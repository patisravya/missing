from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Candidate, Evidence, Review, Case
from app.schemas.schemas import CandidateResponse, ReviewCreate, ReviewResponse
from app.config import settings

router = APIRouter(prefix="/candidates", tags=["Candidates"])

@router.get("/{candidate_id}", response_model=CandidateResponse)
def get_candidate(candidate_id: int, db: Session = Depends(get_db)):
    cand = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not cand:
        raise HTTPException(status_code=404, detail="Candidate not found")
    return cand

@router.get("/{candidate_id}/timeline")
def get_candidate_timeline(candidate_id: int, db: Session = Depends(get_db)):
    cand = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not cand:
        raise HTTPException(status_code=404, detail="Candidate not found")

    evidence_items = db.query(Evidence).filter(Evidence.candidate_id == candidate_id).order_by(Evidence.timestamp_seconds.asc()).all()

    timeline_points = [
        {
            "id": ev.id,
            "timestamp": ev.timestamp,
            "timestamp_seconds": ev.timestamp_seconds,
            "camera_id": ev.camera_id,
            "frame_number": ev.frame_number,
            "image_path": ev.image_path,
            "detection_confidence": ev.detection_confidence,
            "similarity_score": ev.similarity_score
        }
        for ev in evidence_items
    ]

    return {
        "candidate_id": cand.id,
        "candidate_code": cand.candidate_code,
        "track_id": cand.track_id,
        "similarity_score": cand.similarity_score,
        "first_seen": cand.first_seen,
        "last_seen": cand.last_seen,
        "primary_camera": cand.primary_camera_id,
        "timeline_events": timeline_points,
        "total_detections": len(timeline_points)
    }

@router.post("/{candidate_id}/review", response_model=CandidateResponse)
def review_candidate(
    candidate_id: int,
    review_in: ReviewCreate,
    db: Session = Depends(get_db)
):
    cand = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not cand:
        raise HTTPException(status_code=404, detail="Candidate not found")

    if review_in.decision == "kept":
        cand.status = "Kept for Further Investigation"
        cand.review_decision = "kept"
    elif review_in.decision == "rejected":
        cand.status = "Rejected Candidate"
        cand.review_decision = "rejected"
    else:
        cand.status = "Requires Review"
        cand.review_decision = "pending"

    cand.reviewer_notes = review_in.notes

    new_review = Review(
        candidate_id=candidate_id,
        user_id=1, # Lead investigator
        decision=review_in.decision,
        notes=review_in.notes
    )
    db.add(new_review)
    db.commit()
    db.refresh(cand)
    return cand
