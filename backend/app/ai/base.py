from abc import ABC, abstractmethod
from typing import List, Dict, Any

class BasePersonDetector(ABC):
    """Abstract Base Class for Person Detection Models."""
    
    @abstractmethod
    def detect_persons(self, frame: Any, confidence_threshold: float = 0.50) -> List[Dict[str, Any]]:
        """
        Detect persons in a frame.
        Returns list of dicts: [{"bbox": [x, y, w, h], "confidence": float, "class": "person"}]
        """
        pass

class BaseTracker(ABC):
    """Abstract Base Class for Multi-Object Tracking Models."""

    @abstractmethod
    def update_tracks(self, detections: List[Dict[str, Any]], frame_id: int) -> List[Dict[str, Any]]:
        """
        Update tracking state across frames.
        Returns list of dicts: [{"track_id": str, "bbox": [x, y, w, h], "confidence": float}]
        """
        pass

class BaseEmbeddingModel(ABC):
    """Abstract Base Class for Person Re-ID / Visual Feature Embedding Models."""

    @abstractmethod
    def extract_embedding(self, image_crop: Any) -> List[float]:
        """
        Extract feature vector from cropped person image or reference photo.
        Returns float list embedding vector.
        """
        pass
