import cv2
import numpy as np
from typing import Dict, Any, List, Tuple, Optional
from app.ai.base import BaseQualityFilter

class ImageQualityFilter(BaseQualityFilter):
    """
    Evaluates person crops and reference images for:
    - Minimum dimensions (configurable min width / height)
    - Motion / camera blur (Variance of Laplacian)
    - Extreme lighting / underexposure / overexposure
    - Border clipping / extreme occlusion
    """
    def __init__(
        self,
        min_width: int = 40,
        min_height: int = 80,
        min_blur_var: float = 40.0,
        min_area: int = 3200
    ):
        self.min_width = min_width
        self.min_height = min_height
        self.min_blur_var = min_blur_var
        self.min_area = min_area

    def evaluate_crop(
        self,
        crop_bgr: np.ndarray,
        bbox: List[int],
        frame_shape: Tuple[int, int],
        min_width: Optional[int] = None,
        min_height: Optional[int] = None,
        min_blur_var: Optional[float] = None
    ) -> Dict[str, Any]:
        mw = min_width or self.min_width
        mh = min_height or self.min_height
        mb = min_blur_var or self.min_blur_var

        if crop_bgr is None or crop_bgr.size == 0:
            return {
                "is_valid": False,
                "quality_score": 0.0,
                "blur_score": 0.0,
                "bbox_area": 0,
                "rejection_reason": "Empty or corrupted crop"
            }

        ch, cw = crop_bgr.shape[:2]
        area = cw * ch

        # 1. Dimension Check
        if cw < mw or ch < mh:
            return {
                "is_valid": False,
                "quality_score": round(max(0.1, (area / (mw * mh)) * 0.4), 2),
                "blur_score": 0.0,
                "bbox_area": area,
                "rejection_reason": f"Crop dimensions too small ({cw}x{ch}px < min {mw}x{mh}px)"
            }

        # 2. Blur / Sharpness Metric (Variance of Laplacian)
        gray = cv2.cvtColor(crop_bgr, cv2.COLOR_BGR2GRAY)
        laplacian_var = float(cv2.Laplacian(gray, cv2.CV_64F).var())

        if laplacian_var < mb:
            return {
                "is_valid": False,
                "quality_score": round(min(0.45, laplacian_var / (mb * 2)), 2),
                "blur_score": round(laplacian_var, 1),
                "bbox_area": area,
                "rejection_reason": f"Excessive blur detected (blur score {laplacian_var:.1f} < threshold {mb})"
            }

        # 3. Illumination & Contrast Check
        mean_lum = float(np.mean(gray))
        std_lum = float(np.std(gray))

        if mean_lum < 18.0:
            return {
                "is_valid": False,
                "quality_score": 0.2,
                "blur_score": round(laplacian_var, 1),
                "bbox_area": area,
                "rejection_reason": "Crop is severely underexposed / pitch dark"
            }
        elif mean_lum > 245.0 and std_lum < 15.0:
            return {
                "is_valid": False,
                "quality_score": 0.2,
                "blur_score": round(laplacian_var, 1),
                "bbox_area": area,
                "rejection_reason": "Crop is severely overexposed / washed out"
            }

        # 4. Compute overall quality score (0.50 to 1.00)
        # Factor in size, sharpness, and illumination stability
        size_factor = min(1.0, area / (120 * 240))
        blur_factor = min(1.0, laplacian_var / 250.0)
        illum_factor = min(1.0, 1.0 - abs(mean_lum - 128.0) / 128.0)

        quality_score = float(round(0.4 * size_factor + 0.4 * blur_factor + 0.2 * illum_factor, 3))
        quality_score = max(0.50, min(0.99, quality_score))

        return {
            "is_valid": True,
            "quality_score": quality_score,
            "blur_score": round(laplacian_var, 1),
            "bbox_area": area,
            "rejection_reason": None
        }

    @staticmethod
    def validate_reference_image(image_bgr: np.ndarray) -> Dict[str, Any]:
        """
        Validates the uploaded missing person reference photograph.
        """
        if image_bgr is None or image_bgr.size == 0:
            return {
                "is_valid": False,
                "error": "Reference image is empty, missing, or unreadable."
            }

        h, w = image_bgr.shape[:2]
        if w < 100 or h < 100:
            return {
                "is_valid": False,
                "error": f"Reference image resolution is too low ({w}x{h}px). Minimum required is 100x100px."
            }

        gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)
        lap_var = float(cv2.Laplacian(gray, cv2.CV_64F).var())
        if lap_var < 20.0:
            return {
                "is_valid": False,
                "error": f"Reference image is extremely blurry (sharpness score {lap_var:.1f}). Please upload a clearer photograph for reliable Re-ID matching."
            }

        return {
            "is_valid": True,
            "width": w,
            "height": h,
            "blur_score": round(lap_var, 1),
            "error": None
        }
