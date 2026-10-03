import torch
from fastapi import APIRouter
from app.config import settings
from app.services.calibration_service import CalibrationService
from app.services.video_processor import get_ai_models

router = APIRouter(prefix="/settings", tags=["Settings"])

@router.get("")
def get_system_settings():
    detector, embedding_model = get_ai_models()
    device_name = "CUDA GPU" if torch.cuda.is_available() else "CPU"
    detector_name = detector.__class__.__name__
    embedding_name = embedding_model.__class__.__name__

    return {
        "project_name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "demo_mode": settings.DEMO_MODE,
        "default_confidence_threshold": settings.DEFAULT_DETECTION_CONFIDENCE,
        "default_similarity_threshold": settings.DEFAULT_SIMILARITY_THRESHOLD,
        "default_frame_sampling": settings.DEFAULT_FRAME_SAMPLING,
        "supported_video_formats": ["MP4", "AVI", "MOV", "MKV"],
        "supported_photo_formats": ["JPG", "JPEG", "PNG", "WEBP"],
        "storage_mode": "Local High-Security CCTV Storage",
        "processing_device": device_name,
        "privacy_policy": "Biometric & CCTV processing authorized for search and investigation purposes only.",
        "ai_status": {
            "person_detector": f"Online ({detector_name})",
            "tracker": "Online (ByteTrack / MultiObjectTracker)",
            "embedding_model": f"Online ({embedding_name})",
            "device": device_name,
            "quality_filter": "Active (Variance of Laplacian + BBox Area + Illumination)"
        }
    }

@router.post("/calibration")
def run_calibration():
    service = CalibrationService()
    return service.run_calibration_suite()
