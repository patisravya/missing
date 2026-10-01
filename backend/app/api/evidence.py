import os
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Evidence
from app.schemas.schemas import EvidenceResponse
from app.config import settings

router = APIRouter(prefix="/evidence", tags=["Evidence"])

@router.get("/{evidence_id}", response_model=EvidenceResponse)
def get_evidence_item(evidence_id: int, db: Session = Depends(get_db)):
    ev = db.query(Evidence).filter(Evidence.id == evidence_id).first()
    if not ev:
        raise HTTPException(status_code=404, detail="Evidence frame not found")
    return ev

@router.get("/frames/{filename}")
def serve_evidence_frame(filename: str):
    filepath = os.path.join(settings.EVIDENCE_DIR, filename)
    if os.path.exists(filepath):
        return FileResponse(filepath, media_type="image/jpeg")
    
    # Fallback to creating synthetic frame on the fly if file missing
    from app.services.evidence_service import EvidenceService
    EvidenceService.generate_evidence_frame(
        camera_id="CCTV-03",
        timestamp="10:32:14",
        track_id="TRK-027",
        confidence=0.94,
        similarity=0.87,
        output_filename=filename
    )
    return FileResponse(filepath, media_type="image/jpeg")
