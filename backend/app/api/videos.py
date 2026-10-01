import os
import shutil
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Case, Video
from app.schemas.schemas import VideoResponse
from app.config import settings

router = APIRouter(prefix="", tags=["Videos"])

@router.post("/cases/{case_id}/videos", response_model=VideoResponse)
async def upload_cctv_video(
    case_id: int,
    camera_id: str = Form(...),
    camera_name: Optional[str] = Form(None),
    camera_location: Optional[str] = Form(None),
    recording_date: Optional[str] = Form(None),
    recording_start_time: Optional[str] = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    filename = f"case_{case_id}_{camera_id}_{file.filename}"
    filepath = os.path.join(settings.VIDEOS_DIR, filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    file_size = os.path.getsize(filepath) if os.path.exists(filepath) else 15000000

    video = Video(
        case_id=case_id,
        camera_id=camera_id,
        camera_name=camera_name or f"Camera {camera_id}",
        camera_location=camera_location or "Investigative Sector 1",
        filename=file.filename,
        duration=300.0, # estimated 5 mins
        file_size=file_size,
        storage_path=filepath,
        recording_date=recording_date or "2026-09-30",
        recording_start_time=recording_start_time or "10:30:00"
    )

    db.add(video)
    case.total_videos += 1
    db.commit()
    db.refresh(video)
    return video

@router.delete("/videos/{video_id}")
def delete_video(video_id: int, db: Session = Depends(get_db)):
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    case = db.query(Case).filter(Case.id == video.case_id).first()
    if case and case.total_videos > 0:
        case.total_videos -= 1

    db.delete(video)
    db.commit()
    return {"message": "Video removed successfully"}
