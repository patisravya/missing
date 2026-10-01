from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import Response
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Case
from app.services.report_service import ReportService

router = APIRouter(prefix="", tags=["Reports"])

@router.get("/cases/{case_id}/report")
def get_case_report(
    case_id: int,
    format: str = Query("json", description="Export format: json, csv, text"),
    db: Session = Depends(get_db)
):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    # Serialize case data
    case_dict = {
        "case_number": case.case_number,
        "case_name": case.case_name,
        "person_name": case.person_name,
        "age": case.age,
        "gender": case.gender,
        "last_known_location": case.last_known_location,
        "created_at": case.created_at,
        "status": case.status,
        "total_videos": case.total_videos,
        "total_frames": case.total_frames,
        "people_detected": case.people_detected,
        "potential_matches_count": case.potential_matches_count,
        "candidates": [
            {
                "candidate_code": c.candidate_code,
                "track_id": c.track_id,
                "similarity_score": c.similarity_score,
                "similarity_band": c.similarity_band,
                "first_seen": c.first_seen,
                "last_seen": c.last_seen,
                "primary_camera_id": c.primary_camera_id,
                "status": c.status,
                "reviewer_notes": c.reviewer_notes
            }
            for c in case.candidates
        ]
    }

    if format == "csv":
        csv_data = ReportService.generate_csv_report(case_dict)
        return Response(content=csv_data, media_type="text/csv", headers={"Content-Disposition": f"attachment; filename=FindTrace_Report_{case.case_number}.csv"})
    
    json_data = ReportService.generate_json_report(case_dict)
    if format == "text":
        return Response(content=json_data, media_type="text/plain")

    return Response(content=json_data, media_type="application/json")
