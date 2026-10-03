import cv2
import numpy as np
from scipy.optimize import linear_sum_assignment
from typing import List, Dict, Any, Tuple, Optional
from app.ai.base import BaseTracker
from app.ai.quality_filter import ImageQualityFilter

def calculate_iou(box1: List[int], box2: List[int]) -> float:
    """Computes Intersection over Union between two [x1, y1, x2, y2] boxes."""
    x1 = max(box1[0], box2[0])
    y1 = max(box1[1], box2[1])
    x2 = min(box1[2], box2[2])
    y2 = min(box1[3], box2[3])

    inter_area = max(0, x2 - x1) * max(0, y2 - y1)
    if inter_area == 0:
        return 0.0

    b1_area = (box1[2] - box1[0]) * (box1[3] - box1[1])
    b2_area = (box2[2] - box2[0]) * (box2[3] - box2[1])
    union_area = b1_area + b2_area - inter_area
    if union_area <= 0:
        return 0.0

    return inter_area / union_area

class TrackState:
    """Represents an active or historical person track across video frames."""
    def __init__(self, track_id: int, initial_bbox: List[int], confidence: float, frame_id: int, timestamp: float):
        self.track_id = f"TRK-{track_id:03d}"
        self.numeric_id = track_id
        self.bbox = list(initial_bbox) # [x1, y1, x2, y2]
        self.first_frame = frame_id
        self.last_frame = frame_id
        self.first_timestamp = timestamp
        self.last_timestamp = timestamp
        self.detection_count = 1
        self.misses = 0
        self.is_confirmed = False

        # History collection
        self.frames: List[int] = [frame_id]
        self.timestamps: List[float] = [timestamp]
        self.confidences: List[float] = [confidence]
        self.bounding_boxes: List[List[int]] = [list(initial_bbox)]
        
        # Representative high-quality crops & embeddings
        self.representative_crops: List[Dict[str, Any]] = []

    def update(self, bbox: List[int], confidence: float, frame_id: int, timestamp: float, crop_bgr: Optional[np.ndarray] = None, quality_filter: Optional[ImageQualityFilter] = None, frame_shape: Optional[Tuple[int, int]] = None):
        self.bbox = list(bbox)
        self.last_frame = frame_id
        self.last_timestamp = timestamp
        self.detection_count += 1
        self.misses = 0

        if self.detection_count >= 3:
            self.is_confirmed = True

        self.frames.append(frame_id)
        self.timestamps.append(timestamp)
        self.confidences.append(confidence)
        self.bounding_boxes.append(list(bbox))

        # Check and collect representative crop if available
        if crop_bgr is not None and crop_bgr.size > 0 and quality_filter is not None and frame_shape is not None:
            eval_res = quality_filter.evaluate_crop(crop_bgr, bbox, frame_shape)
            if eval_res["is_valid"]:
                # Maintain up to 20 representative crops per track sorted by quality
                crop_entry = {
                    "frame_id": frame_id,
                    "timestamp": timestamp,
                    "bbox": list(bbox),
                    "confidence": confidence,
                    "quality_score": eval_res["quality_score"],
                    "blur_score": eval_res["blur_score"],
                    "crop_bgr": crop_bgr.copy()
                }
                self.representative_crops.append(crop_entry)
                # Keep top 20 by quality
                if len(self.representative_crops) > 20:
                    self.representative_crops.sort(key=lambda x: x["quality_score"], reverse=True)
                    self.representative_crops = self.representative_crops[:20]

    def mark_missed(self):
        self.misses += 1

class MultiObjectTracker(BaseTracker):
    """
    Multi-Object Person Tracker (SORT / ByteTrack inspired).
    Uses IoU cost matrix matching with Hungarian algorithm and persistent Track IDs.
    """
    def __init__(self, iou_threshold: float = 0.30, max_misses: int = 30):
        self.iou_threshold = iou_threshold
        self.max_misses = max_misses
        self.active_tracks: Dict[int, TrackState] = {}
        self.all_tracks: Dict[int, TrackState] = {}
        self.next_id = 1
        self.quality_filter = ImageQualityFilter()

    def update_tracks(
        self,
        detections: List[Dict[str, Any]],
        frame_id: int,
        timestamp: float,
        full_frame_bgr: Optional[np.ndarray] = None
    ) -> List[Dict[str, Any]]:
        active_track_ids = list(self.active_tracks.keys())
        active_boxes = [self.active_tracks[tid].bbox for tid in active_track_ids]
        det_boxes = [d["bbox"] for d in detections]

        frame_shape = full_frame_bgr.shape[:2] if full_frame_bgr is not None else (720, 1280)

        # Build IoU cost matrix
        if active_boxes and det_boxes:
            iou_matrix = np.zeros((len(active_boxes), len(det_boxes)), dtype=np.float32)
            for i, abox in enumerate(active_boxes):
                for j, dbox in enumerate(det_boxes):
                    iou_matrix[i, j] = calculate_iou(abox, dbox)

            # Hungarian matching (maximize IoU <=> minimize -IoU)
            row_ind, col_ind = linear_sum_assignment(-iou_matrix)

            matched_active = set()
            matched_dets = set()

            for r, c in zip(row_ind, col_ind):
                if iou_matrix[r, c] >= self.iou_threshold:
                    tid = active_track_ids[r]
                    det = detections[c]
                    
                    crop = None
                    if full_frame_bgr is not None:
                        x1, y1, x2, y2 = det["bbox"]
                        crop = full_frame_bgr[y1:y2, x1:x2]

                    self.active_tracks[tid].update(
                        bbox=det["bbox"],
                        confidence=det["confidence"],
                        frame_id=frame_id,
                        timestamp=timestamp,
                        crop_bgr=crop,
                        quality_filter=self.quality_filter,
                        frame_shape=frame_shape
                    )
                    matched_active.add(r)
                    matched_dets.add(c)

            # Unmatched active tracks
            for r, tid in enumerate(active_track_ids):
                if r not in matched_active:
                    self.active_tracks[tid].mark_missed()

            # Unmatched detections -> spawn new tracks
            for c, det in enumerate(detections):
                if c not in matched_dets:
                    tid = self.next_id
                    self.next_id += 1
                    track = TrackState(tid, det["bbox"], det["confidence"], frame_id, timestamp)
                    
                    if full_frame_bgr is not None:
                        x1, y1, x2, y2 = det["bbox"]
                        crop = full_frame_bgr[y1:y2, x1:x2]
                        track.update(
                            bbox=det["bbox"],
                            confidence=det["confidence"],
                            frame_id=frame_id,
                            timestamp=timestamp,
                            crop_bgr=crop,
                            quality_filter=self.quality_filter,
                            frame_shape=frame_shape
                        )

                    self.active_tracks[tid] = track
                    self.all_tracks[tid] = track
        else:
            # All detections are new
            for det in detections:
                tid = self.next_id
                self.next_id += 1
                track = TrackState(tid, det["bbox"], det["confidence"], frame_id, timestamp)
                
                if full_frame_bgr is not None:
                    x1, y1, x2, y2 = det["bbox"]
                    crop = full_frame_bgr[y1:y2, x1:x2]
                    track.update(
                        bbox=det["bbox"],
                        confidence=det["confidence"],
                        frame_id=frame_id,
                        timestamp=timestamp,
                        crop_bgr=crop,
                        quality_filter=self.quality_filter,
                        frame_shape=frame_shape
                    )

                self.active_tracks[tid] = track
                self.all_tracks[tid] = track

            # If no detections, mark all active tracks missed
            if not det_boxes:
                for tid in active_track_ids:
                    self.active_tracks[tid].mark_missed()

        # Remove dead tracks with excessive misses from active set
        dead_tracks = [tid for tid, trk in self.active_tracks.items() if trk.misses > self.max_misses]
        for tid in dead_tracks:
            del self.active_tracks[tid]

        # Return currently active tracks
        results = []
        for tid, trk in self.active_tracks.items():
            results.append({
                "track_id": trk.track_id,
                "bbox": trk.bbox,
                "confidence": trk.confidences[-1] if trk.confidences else 0.50,
                "frame_id": frame_id,
                "timestamp": timestamp
            })

        return results

    def get_all_completed_tracks(self) -> List[TrackState]:
        """Returns all tracks recorded during video processing."""
        return list(self.all_tracks.values())
