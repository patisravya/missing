import os
from sqlalchemy.orm import Session
from app.database import engine, Base, SessionLocal
from app.models.models import User, Case, Video, Candidate, Evidence
from app.services.evidence_service import EvidenceService

def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    # Check if demo data exists
    if db.query(Case).filter(Case.case_number == "FT-2026-001").first():
        print("Demo database already seeded.")
        db.close()
        return

    print("Seeding FindTrace AI demo cases and candidate data...")

    # Demo User
    demo_user = User(
        name="Senior Investigator Miller",
        email="demo@findtrace.ai",
        password_hash="pbkdf2:sha256:demo_hash_investigation",
        role="lead_investigator"
    )
    db.add(demo_user)

    # Demo Case 1 (Primary Demo Case)
    case1 = Case(
        case_number="FT-2026-001",
        case_name="Demo Missing Person Search — Central Station",
        person_name="Alexander Vance",
        age=34,
        gender="Male",
        last_known_location="Metro Transit Level B, Platform 4",
        last_seen_date="2026-09-29 18:45",
        additional_notes="Subject wearing dark blue jacket, grey trousers, carrying black backpack.",
        reference_image="/api/cases/reference-files/demo_ref.jpg",
        status="review_required",
        confidence_threshold=0.50,
        similarity_threshold=0.70,
        frame_sampling=5,
        tracking_enabled=True,
        appearance_matching_enabled=True,
        total_videos=3,
        total_frames=8421,
        people_detected=314,
        potential_matches_count=5,
        is_demo=True
    )
    db.add(case1)
    db.flush()

    # Demo Videos for Case 1
    vids = [
        Video(case_id=case1.id, camera_id="CCTV-01", camera_name="North Concourse Entry", camera_location="Gate 1A Upper Level", filename="cctv_ch01_north.mp4", duration=300.0, file_size=24000000, storage_path="storage/videos/cctv_ch01.mp4"),
        Video(case_id=case1.id, camera_id="CCTV-03", camera_name="Central Escalator South", camera_location="Level B Concourse", filename="cctv_ch03_escalator.mp4", duration=450.0, file_size=36000000, storage_path="storage/videos/cctv_ch03.mp4"),
        Video(case_id=case1.id, camera_id="CCTV-05", camera_name="West Exit Corridor", camera_location="Street Exit Gate 5", filename="cctv_ch05_west.mp4", duration=300.0, file_size=22000000, storage_path="storage/videos/cctv_ch05.mp4"),
    ]
    for v in vids:
        db.add(v)
    db.flush()

    # Demo Candidate Detections for Case 1 (Scores: 87%, 82%, 78%, 71%, 64%)
    candidate_specs = [
        {"code": "Candidate #01", "track": "TRK-027", "score": 0.87, "band": "High Similarity", "first": "10:32:14", "last": "10:34:51", "cam": "CCTV-03", "status": "Requires Review"},
        {"code": "Candidate #02", "track": "TRK-042", "score": 0.82, "band": "High Similarity", "first": "10:31:05", "last": "10:32:22", "cam": "CCTV-01", "status": "Requires Review"},
        {"code": "Candidate #03", "track": "TRK-089", "score": 0.78, "band": "Medium Similarity", "first": "10:35:10", "last": "10:37:04", "cam": "CCTV-05", "status": "Requires Review"},
        {"code": "Candidate #04", "track": "TRK-104", "score": 0.71, "band": "Medium Similarity", "first": "10:30:18", "last": "10:31:40", "cam": "CCTV-01", "status": "Requires Review"},
        {"code": "Candidate #05", "track": "TRK-112", "score": 0.64, "band": "Low Similarity", "first": "10:36:20", "last": "10:36:55", "cam": "CCTV-05", "status": "Rejected Candidate"},
    ]

    for cand_idx, spec in enumerate(candidate_specs):
        prev_fn = f"demo_case1_cand_{cand_idx+1}_prev.jpg"
        prev_url = EvidenceService.generate_evidence_frame(
            camera_id=spec["cam"],
            timestamp=spec["first"],
            track_id=spec["track"],
            confidence=0.95,
            similarity=spec["score"],
            output_filename=prev_fn
        )

        cand = Candidate(
            case_id=case1.id,
            track_id=spec["track"],
            candidate_code=spec["code"],
            similarity_score=spec["score"],
            similarity_band=spec["band"],
            first_seen=spec["first"],
            last_seen=spec["last"],
            primary_camera_id=spec["cam"],
            status=spec["status"],
            evidence_preview_image=prev_url
        )
        db.add(cand)
        db.flush()

        # Evidence timeline items for candidate #01
        if cand_idx == 0:
            timestamps = ["10:32:14", "10:32:38", "10:33:21", "10:34:51"]
            for i, ts in enumerate(timestamps):
                ev_fn = f"demo_case1_cand1_ev_{i+1}.jpg"
                ev_url = EvidenceService.generate_evidence_frame(
                    camera_id="CCTV-03",
                    timestamp=ts,
                    track_id="TRK-027",
                    confidence=round(0.92 + (i*0.01), 2),
                    similarity=0.87,
                    output_filename=ev_fn
                )
                ev = Evidence(
                    candidate_id=cand.id,
                    video_id=vids[1].id,
                    camera_id="CCTV-03",
                    timestamp=ts,
                    timestamp_seconds=1934.0 + (i * 24),
                    frame_number=1840 + (i * 350),
                    image_path=ev_url,
                    bounding_box={"x": 340, "y": 140, "w": 120, "h": 240},
                    detection_confidence=0.94,
                    similarity_score=0.87
                )
                db.add(ev)

    # Demo Case 2
    case2 = Case(
        case_number="FT-2026-002",
        case_name="Downtown Commercial District Trace",
        person_name="Elena Rostova",
        age=28,
        gender="Female",
        last_known_location="Grand Arcade Plaza",
        last_seen_date="2026-09-28 14:15",
        status="completed",
        confidence_threshold=0.50,
        similarity_threshold=0.70,
        total_videos=2,
        total_frames=5120,
        people_detected=184,
        potential_matches_count=2,
        is_demo=True
    )
    db.add(case2)

    db.commit()
    print("Demo database successfully seeded!")
    db.close()

if __name__ == "__main__":
    seed_database()
