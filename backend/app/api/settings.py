from fastapi import APIRouter
from app.config import settings

router = APIRouter(prefix="/settings", tags=["Settings"])

@router.get("")
def get_system_settings():
    return {
        "project_name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "demo_mode": settings.DEMO_MODE,
        "default_confidence_threshold": settings.DEFAULT_DETECTION_CONFIDENCE,
        "default_similarity_threshold": settings.DEFAULT_SIMILARITY_THRESHOLD,
        "default_frame_sampling": settings.DEFAULT_FRAME_SAMPLING,
        "supported_video_formats": ["MP4", "AVI", "MOV", "MKV"],
        "supported_photo_formats": ["JPG", "JPEG", "PNG", "WEBP"],
        "storage_mode": "Local Storage (Development/Demonstration)",
        "privacy_policy": "Biometric & CCTV processing authorized for investigation purposes only. Data retention compliant.",
        "ai_status": {
            "person_detector": "Online (YOLO / OpenCV / Fallback Active)",
            "tracker": "Online (ByteTrack Active)",
            "embedding_model": "Online (Visual Re-ID Model Active)",
            "system_gpu_acceleration": "Simulated / Auto-detect"
        }
    }
