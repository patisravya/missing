import numpy as np
from abc import ABC, abstractmethod
from typing import List, Dict, Any, Tuple, Optional

class BasePersonDetector(ABC):
    """Abstract Base Class for Person Detection Models."""
    
    @abstractmethod
    def detect_persons(self, frame_bgr: np.ndarray, confidence_threshold: float = 0.40) -> List[Dict[str, Any]]:
        """
        Detect persons in a frame.
        Returns list of dicts: [
          {
             "class": "person",
             "confidence": float,
             "bbox": [x1, y1, x2, y2],  # pixel coordinates
             "area": float
          }
        ]
        """
        pass

class BaseTracker(ABC):
    """Abstract Base Class for Multi-Object Tracking Models."""

    @abstractmethod
    def update_tracks(self, detections: List[Dict[str, Any]], frame_id: int, timestamp: float) -> List[Dict[str, Any]]:
        """
        Update tracking state across frames.
        Returns list of dicts: [
          {
             "track_id": str,
             "bbox": [x1, y1, x2, y2],
             "confidence": float,
             "frame_id": int,
             "timestamp": float
          }
        ]
        """
        pass

class BaseEmbeddingModel(ABC):
    """Abstract Base Class for Person Re-ID Visual Feature Embedding Models."""

    @abstractmethod
    def extract_embedding(self, image_crop: np.ndarray) -> np.ndarray:
        """
        Extract normalized feature vector from cropped person image or reference photo.
        Returns 1D numpy float32 array with ||embedding|| == 1.0.
        """
        pass

    @abstractmethod
    def extract_batch_embeddings(self, crops: List[np.ndarray]) -> np.ndarray:
        """
        Extract normalized feature vectors from a batch of cropped person images.
        Returns 2D numpy float32 array of shape (N, D).
        """
        pass

class BaseQualityFilter(ABC):
    """Abstract Base Class for Frame & Person Crop Quality Evaluator."""

    @abstractmethod
    def evaluate_crop(
        self,
        crop_bgr: np.ndarray,
        bbox: List[int],
        frame_shape: Tuple[int, int],
        min_width: int = 40,
        min_height: int = 80,
        min_blur_var: float = 45.0
    ) -> Dict[str, Any]:
        """
        Evaluates crop quality (blur, size, occlusion, contrast).
        Returns: {
            "is_valid": bool,
            "quality_score": float (0.0 to 1.0),
            "blur_score": float,
            "bbox_area": int,
            "rejection_reason": Optional[str]
        }
        """
        pass
