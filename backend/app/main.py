import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import settings
from app.database import Base, engine
from app.api import auth, cases, videos, candidates, evidence, reports, settings as settings_api

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI-Assisted Missing Person CCTV Search System (FindTrace AI)"
)

# Enable CORS for local dev & Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(cases.router, prefix=settings.API_V1_STR)
app.include_router(videos.router, prefix=settings.API_V1_STR)
app.include_router(candidates.router, prefix=settings.API_V1_STR)
app.include_router(evidence.router, prefix=settings.API_V1_STR)
app.include_router(reports.router, prefix=settings.API_V1_STR)
app.include_router(settings_api.router, prefix=settings.API_V1_STR)

# Mount static file endpoints
os.makedirs(settings.EVIDENCE_DIR, exist_ok=True)
os.makedirs(settings.REFERENCE_PHOTOS_DIR, exist_ok=True)

app.mount("/api/evidence/frames", StaticFiles(directory=settings.EVIDENCE_DIR), name="evidence_frames")
app.mount("/api/cases/reference-files", StaticFiles(directory=settings.REFERENCE_PHOTOS_DIR), name="reference_files")

@app.get("/")
def root():
    return {
        "system": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "tagline": "Search. Track. Verify.",
        "status": "Online",
        "demo_mode": settings.DEMO_MODE,
        "disclaimer": "AI-generated candidate matches are probabilistic and require human verification."
    }

@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "FindTrace AI Backend"}
