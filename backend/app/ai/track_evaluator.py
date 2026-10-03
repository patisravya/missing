import numpy as np
from typing import List, Dict, Any, Optional
from app.ai.tracker import TrackState
from app.ai.reid_embedding import ReIDEmbeddingModel

class TrackCandidateEvaluator:
    """
    Evaluates tracks across time and aggregates multi-frame visual evidence.
    Implements 2-stage verification, temporal consistency checks, candidate margins,
    and transparent Candidate Evidence Scoring.
    """
    def __init__(
        self,
        retrieval_threshold: float = 0.60,
        strong_similarity_threshold: float = 0.72,
        min_valid_frames: int = 4,
        min_strong_matches: int = 2,
        min_margin: float = 0.03
    ):
        self.retrieval_threshold = retrieval_threshold
        self.strong_similarity_threshold = strong_similarity_threshold
        self.min_valid_frames = min_valid_frames
        self.min_strong_matches = min_strong_matches
        self.min_margin = min_margin

    def evaluate_all_tracks(
        self,
        tracks: List[TrackState],
        ref_embeddings: List[np.ndarray],
        embedding_model: ReIDEmbeddingModel,
        user_similarity_cutoff: float = 0.65
    ) -> Dict[str, Any]:
        """
        Processes all tracks, computes Re-ID embeddings for representative crops,
        aggregates track-level metrics, applies two-stage filtering, and produces
        explainable candidate decisions and debug telemetry.
        """
        debug_logs = {
            "total_tracks": len(tracks),
            "rejected_too_short": 0,
            "rejected_too_blurry": 0,
            "rejected_low_similarity": 0,
            "rejected_single_frame_spike": 0,
            "rejected_insufficient_frames": 0,
            "retrieved_candidates_stage1": 0,
            "verified_candidates_stage2": 0,
            "track_diagnostics": []
        }

        evaluated_tracks = []

        for trk in tracks:
            # Check crop availability
            valid_crops = trk.representative_crops
            if len(valid_crops) == 0:
                debug_logs["rejected_too_blurry"] += 1
                debug_logs["track_diagnostics"].append({
                    "track_id": trk.track_id,
                    "status": "rejected",
                    "reason": "No valid/sharp crops passed the quality filter (excessive blur or too small)"
                })
                continue

            if trk.detection_count < 3:
                debug_logs["rejected_too_short"] += 1
                debug_logs["track_diagnostics"].append({
                    "track_id": trk.track_id,
                    "status": "rejected",
                    "reason": f"Track too short (duration: {trk.detection_count} frames < min 3)"
                })
                continue

            # Extract batch embeddings for representative crops
            crops_list = [c["crop_bgr"] for c in valid_crops]
            crop_embeddings = embedding_model.extract_batch_embeddings(crops_list)

            # Compute similarities against reference photos
            frame_similarities = []
            for emb in crop_embeddings:
                sim = ReIDEmbeddingModel.compute_multi_reference_similarity(emb, ref_embeddings)
                frame_similarities.append(sim)

            frame_similarities = np.array(frame_similarities, dtype=np.float32)

            # Track-level statistical metrics
            mean_sim = float(np.mean(frame_similarities))
            median_sim = float(np.median(frame_similarities))
            max_sim = float(np.max(frame_similarities))
            
            # Top-k average similarity (top 3 or 5 frames)
            k = min(5, len(frame_similarities))
            top_k_sim = float(np.mean(np.partition(frame_similarities, -k)[-k:]))

            # Number of strong matches
            strong_matches = int(np.sum(frame_similarities >= self.strong_similarity_threshold))
            valid_frames_count = len(frame_similarities)

            # Detection quality & image quality averages
            avg_conf = float(np.mean(trk.confidences)) if trk.confidences else 0.50
            avg_quality = float(np.mean([c["quality_score"] for c in valid_crops]))
            avg_blur = float(np.mean([c["blur_score"] for c in valid_crops]))

            # Temporal consistency: ratio of consistent frames to variance
            sim_std = float(np.std(frame_similarities))
            consistency_score = max(0.0, min(1.0, 1.0 - (sim_std * 2.0)))
            temporal_continuity = min(1.0, valid_frames_count / max(5, self.min_valid_frames))

            # Calculate transparent Candidate Evidence Score (0.0 to 1.0)
            # 0.50 * consistency + 0.20 * median_sim + 0.15 * detection_quality + 0.10 * temporal + 0.05 * image_quality
            evidence_score = (
                0.50 * (median_sim * consistency_score) +
                0.20 * top_k_sim +
                0.15 * avg_conf +
                0.10 * temporal_continuity +
                0.05 * avg_quality
            )
            evidence_score = float(round(max(0.0, min(0.98, evidence_score)), 3))

            # Pack track record
            evaluated_tracks.append({
                "track": trk,
                "track_id": trk.track_id,
                "first_timestamp": trk.first_timestamp,
                "last_timestamp": trk.last_timestamp,
                "duration_seconds": max(1.0, trk.last_timestamp - trk.first_timestamp),
                "detection_count": trk.detection_count,
                "valid_frames": valid_frames_count,
                "strong_matches": strong_matches,
                "mean_similarity": round(mean_sim, 3),
                "median_similarity": round(median_sim, 3),
                "max_similarity": round(max_sim, 3),
                "top_k_similarity": round(top_k_sim, 3),
                "similarity_std": round(sim_std, 3),
                "detection_confidence_mean": round(avg_conf, 3),
                "image_quality_mean": round(avg_quality, 3),
                "blur_score_mean": round(avg_blur, 1),
                "consistency_score": round(consistency_score, 3),
                "candidate_evidence_score": evidence_score,
                "frame_similarities": [round(float(s), 3) for s in frame_similarities],
                "valid_crops": valid_crops
            })

        # Stage 1: Candidate Retrieval
        stage1_candidates = []
        for cand in evaluated_tracks:
            # Needs median or top-k similarity meeting retrieval threshold
            if cand["median_similarity"] >= self.retrieval_threshold or cand["top_k_similarity"] >= self.retrieval_threshold:
                stage1_candidates.append(cand)
            else:
                debug_logs["rejected_low_similarity"] += 1
                debug_logs["track_diagnostics"].append({
                    "track_id": cand["track_id"],
                    "status": "rejected",
                    "reason": f"Stage 1 retrieval cutoff: Median similarity {cand['median_similarity']:.2f} < threshold {self.retrieval_threshold:.2f}"
                })

        debug_logs["retrieved_candidates_stage1"] = len(stage1_candidates)

        # Stage 2: Candidate Verification & Multi-frame Temporal Rules
        verified_candidates = []
        weak_candidates = []

        # Sort candidate tracks by candidate evidence score descending
        stage1_candidates.sort(key=lambda x: x["candidate_evidence_score"], reverse=True)

        for i, cand in enumerate(stage1_candidates):
            # Check for single-frame false positive spike (e.g. max is high, but median is low & strong matches < min)
            if cand["max_similarity"] >= self.strong_similarity_threshold and cand["strong_matches"] < self.min_strong_matches:
                debug_logs["rejected_single_frame_spike"] += 1
                debug_logs["track_diagnostics"].append({
                    "track_id": cand["track_id"],
                    "status": "rejected",
                    "reason": f"Single-frame similarity spike (max: {cand['max_similarity']:.2f}) without multi-frame temporal confirmation (strong matches: {cand['strong_matches']} < {self.min_strong_matches})"
                })
                continue

            # Check minimum valid frames
            if cand["valid_frames"] < min(self.min_valid_frames, 3):
                debug_logs["rejected_insufficient_frames"] += 1
                debug_logs["track_diagnostics"].append({
                    "track_id": cand["track_id"],
                    "status": "rejected",
                    "reason": f"Insufficient valid frames for Re-ID verification ({cand['valid_frames']} < {self.min_valid_frames})"
                })
                continue

            # Calculate candidate margin vs next best candidate
            margin = 0.0
            if i + 1 < len(stage1_candidates):
                margin = round(cand["candidate_evidence_score"] - stage1_candidates[i + 1]["candidate_evidence_score"], 3)
            cand["candidate_margin"] = margin

            # Decision Logic: User Threshold and Evidence Score
            if cand["median_similarity"] >= user_similarity_cutoff and cand["strong_matches"] >= self.min_strong_matches and cand["candidate_evidence_score"] >= 0.65:
                cand["decision_category"] = "Potential Candidate"
                cand["status_label"] = "Requires Human Review"
                verified_candidates.append(cand)
                debug_logs["track_diagnostics"].append({
                    "track_id": cand["track_id"],
                    "status": "accepted_potential_candidate",
                    "reason": f"Multi-frame consistent Re-ID: {cand['valid_frames']} valid frames, {cand['strong_matches']} strong matches, median sim {cand['median_similarity']:.2f}, score {cand['candidate_evidence_score']:.2f}"
                })
            elif cand["median_similarity"] >= (user_similarity_cutoff - 0.10) or cand["strong_matches"] >= 1:
                cand["decision_category"] = "Weak Candidate"
                cand["status_label"] = "Insufficient Evidence"
                weak_candidates.append(cand)
                debug_logs["track_diagnostics"].append({
                    "track_id": cand["track_id"],
                    "status": "weak_candidate",
                    "reason": f"Weak visual correlation: evidence insufficient for potential candidate status (score {cand['candidate_evidence_score']:.2f})"
                })

        debug_logs["verified_candidates_stage2"] = len(verified_candidates)

        return {
            "verified_candidates": verified_candidates,
            "weak_candidates": weak_candidates,
            "all_evaluated": evaluated_tracks,
            "debug_logs": debug_logs
        }
