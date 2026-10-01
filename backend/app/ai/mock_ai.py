import math
import random
import numpy as np
from typing import List, Dict, Any
from app.ai.base import BasePersonDetector, BaseTracker, BaseEmbeddingModel

class MockPersonDetector(BasePersonDetector):
    def detect_persons(self, frame: Any, confidence_threshold: float = 0.50) -> List[Dict[str, Any]]:
        # Simulate 1 to 5 detections per frame
        num_persons = random.randint(1, 4)
        detections = []
        for i in range(num_persons):
            conf = round(random.uniform(confidence_threshold, 0.98), 2)
            # Create synthetic bounding box [x, y, width, height]
            x = random.randint(50, 500)
            y = random.randint(50, 300)
            w = random.randint(60, 140)
            h = random.randint(140, 280)
            detections.append({
                "bbox": [x, y, w, h],
                "confidence": conf,
                "class": "person"
            })
        return detections

class MockTracker(BaseTracker):
    def __init__(self):
        self.active_tracks = {}
        self.track_counter = 1

    def update_tracks(self, detections: List[Dict[str, Any]], frame_id: int) -> List[Dict[str, Any]]:
        tracked = []
        for det in detections:
            # Deterministically reuse or spawn track IDs
            if random.random() < 0.6 and self.active_tracks:
                track_id = random.choice(list(self.active_tracks.keys()))
            else:
                track_id = f"TRK-{self.track_counter:03d}"
                self.active_tracks[track_id] = True
                self.track_counter += 1

            tracked.append({
                "track_id": track_id,
                "bbox": det["bbox"],
                "confidence": det["confidence"]
            })
        return tracked

class MockEmbeddingModel(BaseEmbeddingModel):
    def extract_embedding(self, image_crop: Any) -> List[float]:
        # Generate 128-dim normalized embedding vector
        np.random.seed(42 if isinstance(image_crop, str) and "reference" in image_crop else None)
        vec = np.random.randn(128)
        norm = np.linalg.norm(vec)
        if norm > 0:
            vec = vec / norm
        return vec.tolist()
