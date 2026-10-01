import os
try:
    from pydantic_settings import BaseSettings
except ImportError:
    class BaseSettings:
        pass

class Settings(BaseSettings):
    PROJECT_NAME: str = "FindTrace AI — AI-Assisted Missing Person CCTV Search System"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "findtrace-super-secret-investigation-key-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # Storage settings
    BASE_DIR: str = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
    STORAGE_DIR: str = os.path.join(BASE_DIR, "storage")
    REFERENCE_PHOTOS_DIR: str = os.path.join(STORAGE_DIR, "reference_photos")
    VIDEOS_DIR: str = os.path.join(STORAGE_DIR, "videos")
    EVIDENCE_DIR: str = os.path.join(STORAGE_DIR, "evidence_frames")
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{os.path.join(BASE_DIR, 'backend', 'findtrace.db')}")
    
    # Default AI thresholds
    DEFAULT_DETECTION_CONFIDENCE: float = 0.50
    DEFAULT_SIMILARITY_THRESHOLD: float = 0.70
    DEFAULT_FRAME_SAMPLING: int = 5
    
    # System mode
    DEMO_MODE: bool = True

settings = Settings()

# Ensure directories exist
os.makedirs(settings.STORAGE_DIR, exist_ok=True)
os.makedirs(settings.REFERENCE_PHOTOS_DIR, exist_ok=True)
os.makedirs(settings.VIDEOS_DIR, exist_ok=True)
os.makedirs(settings.EVIDENCE_DIR, exist_ok=True)
