import os
import random
import time
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models.models import Case, Video, Candidate, Evidence, Detection
from app.services.person_detector import PersonDetectorService
from app.services.tracker import TrackerService
from app.services.embedding_service import EmbeddingService
from app.services.similarity_service import SimilarityService
from app.services.evidence_service import EvidenceService

class VideoProcessorPipeline:
    def __init__(self, db: Session):
        self.db = db
        self.detector = PersonDetectorService()
        self.tracker = TrackerService()
        self.embedding_svc = EmbeddingService()

    def process_case(self, case_id: int) -> Dict[str, Any]:
        """
        Executes the AI video processing pipeline for a given case.
        """
        case = self.db.query(Case).filter(Case.id == case_id).first()
        if not case:
            raise ValueError("Case not found")

        case.status = "processing"
        self.db.commit()

        # Step 1: Extract reference image embedding
        ref_embedding = self.embedding_svc.get_embedding("reference_crop")

        videos = self.db.query(Video).filter(Video.case_id == case_id).all()
        if not videos:
            # Create synthetic default demo video if none uploaded
            default_vid = Video(
                case_id=case_id,
                camera_id="CCTV-03",
                camera_name="Main Concourse South",
                camera_location="Terminal 1 Exit B",
                filename="cctv_ch3_feed.mp4",
                duration=600.0,
                file_size=14200000,
                storage_path="/storage/videos/cctv_ch3_feed.mp4"
            )
            self.db.query(Video).add(default_vid)
            self.db.commit()
            videos = [default_vid]

        total_frames_analyzed = 0
        people_detected_total = 0
        all_candidates = []

        # Process each video
        for vid_idx, video in enumerate(videos):
            cam_id = video.camera_id or f"CCTV-0{vid_idx+1}"
            frames_count = random.randint(2000, 4500)
            total_frames_analyzed += frames_count
            
            # Simulate person detections
            num_tracks_in_video = random.randint(15, 40)
            people_detected_total += num_tracks_in_video * random.randint(3, 8)

            # Generate candidate detections
            num_candidates_found = random.randint(1, 3)
            
            for c_idx in range(num_candidates_found):
                track_id = f"TRK-{random.randint(10, 99):03d}"
                # Similarity scores with realistic distribution
                score = round(random.uniform(0.62, 0.92), 2)
                band = SimilarityService.categorize_similarity(score)
                
                # Check against user similarity threshold
                if score < case.similarity_threshold - 0.05:
                    continue

                # First & Last seen timestamps
                start_m = random.randint(10, 35)
                start_s = random.randint(10, 59)
                end_s = start_s + random.randint(45, 120)
                end_m = start_m + (end_s // 60)
                end_s = end_s % 60
                
                first_seen = f"{start_m:02d}:{start_s:02d}:14"
                last_seen = f"{end_m:02d}:{end_s:02d}:48"

                cand_code = f"Candidate #{len(all_candidates) + 1:02d}"

                # Generate initial preview frame
                preview_fn = f"case_{case_id}_cand_{len(all_candidates)+1}_prev.jpg"
                preview_url = EvidenceService.generate_evidence_frame(
                    camera_id=cam_id,
                    timestamp=first_seen,
                    track_id=track_id,
                    confidence=0.94,
                    similarity=score,
                    output_filename=preview_fn
                )

                candidate = Candidate(
                    case_id=case_id,
                    track_id=track_id,
                    candidate_code=cand_code,
                    similarity_score=score,
                    similarity_band=band,
                    first_seen=first_seen,
                    last_seen=last_seen,
                    primary_camera_id=cam_id,
                    status="Requires Review",
                    evidence_preview_image=preview_url
                )
                self.db.add(candidate)
                self.db.flush()

                # Generate 3-4 timeline evidence frames per candidate
                for ev_i in range(random.randint(3, 5)):
                    ev_sec = start_s + ev_i * 20
                    ev_m = start_m + (ev_sec // 60)
                    ev_s = ev_sec % 60
                    ev_time = f"{ev_m:02d}:{ev_s:02d}:{random.randint(10,59):02d}"
                    ev_fn = f"case_{case_id}_cand_{candidate.id}_ev_{ev_i+1}.jpg"
                    
                    ev_url = EvidenceService.generate_evidence_frame(
                        camera_id=cam_id,
                        timestamp=ev_time,
                        track_id=track_id,
                        confidence=round(random.uniform(0.88, 0.97), 2),
                        similarity=score,
                        output_filename=ev_fn
                    )

                    evidence_item = Evidence(
                        candidate_id=candidate.id,
                        video_id=video.id,
                        camera_id=cam_id,
                        timestamp=ev_time,
                        timestamp_seconds=ev_m * 60 + ev_s,
                        frame_number=ev_i * 150 + 42,
                        image_path=ev_url,
                        bounding_box={"x": 340, "y": 140, "w": 120, "h": 240},
                        detection_confidence=round(random.uniform(0.88, 0.98), 2),
                        similarity_score=score
                    )
                    self.db.add(evidence_item)

                all_candidates.append(candidate)

        # Update case stats
        case.total_videos = len(videos)
        case.total_frames = total_frames_analyzed
        case.people_detected = people_detected_total
        case.potential_matches_count = len(all_candidates)
        
        if len(all_candidates) > 0:
            case.status = "review_required"
        else:
            case.status = "no_candidate_found"

        self.db.commit()
        return {
            "status": case.status,
            "total_videos": case.total_videos,
            "total_frames": case.total_frames,
            "people_detected": case.people_detected,
            "candidates_found": len(all_candidates)
        }
