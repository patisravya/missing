from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="investigator") # admin, lead_investigator, investigator
    created_at = Column(DateTime, default=datetime.utcnow)

    reviews = relationship("Review", back_populates="user")

class Case(Base):
    __tablename__ = "cases"

    id = Column(Integer, primary_key=True, index=True)
    case_number = Column(String, unique=True, index=True, nullable=False)
    case_name = Column(String, nullable=False)
    person_name = Column(String, nullable=True)
    age = Column(Integer, nullable=True)
    gender = Column(String, nullable=True)
    last_known_location = Column(String, nullable=True)
    last_seen_date = Column(String, nullable=True)
    additional_notes = Column(Text, nullable=True)
    reference_image = Column(String, nullable=True) # relative file path or base64 data
    status = Column(String, default="draft") # draft, processing, completed, review_required, no_candidate_found
    
    # Configurations
    confidence_threshold = Column(Float, default=0.50)
    similarity_threshold = Column(Float, default=0.70)
    frame_sampling = Column(Integer, default=5)
    tracking_enabled = Column(Boolean, default=True)
    appearance_matching_enabled = Column(Boolean, default=True)
    
    # Processed stats
    total_videos = Column(Integer, default=0)
    total_frames = Column(Integer, default=0)
    people_detected = Column(Integer, default=0)
    potential_matches_count = Column(Integer, default=0)
    
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    videos = relationship("Video", back_populates="case", cascade="all, delete-orphan")
    candidates = relationship("Candidate", back_populates="case", cascade="all, delete-orphan")

class Video(Base):
    __tablename__ = "videos"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=False)
    camera_id = Column(String, nullable=False)
    camera_name = Column(String, nullable=True)
    camera_location = Column(String, nullable=True)
    filename = Column(String, nullable=False)
    duration = Column(Float, default=0.0) # duration in seconds
    file_size = Column(Integer, default=0) # size in bytes
    storage_path = Column(String, nullable=False)
    recording_date = Column(String, nullable=True)
    recording_start_time = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    case = relationship("Case", back_populates="videos")
    detections = relationship("Detection", back_populates="video", cascade="all, delete-orphan")

class Detection(Base):
    __tablename__ = "detections"

    id = Column(Integer, primary_key=True, index=True)
    video_id = Column(Integer, ForeignKey("videos.id"), nullable=False)
    track_id = Column(String, nullable=False) # e.g. TRK-027
    timestamp = Column(String, nullable=False) # e.g. 10:32:14 or 00:02:14
    timestamp_seconds = Column(Float, default=0.0)
    frame_number = Column(Integer, nullable=False)
    confidence = Column(Float, nullable=False)
    bounding_box = Column(JSON, nullable=False) # {x, y, w, h}

    video = relationship("Video", back_populates="detections")

class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=False)
    track_id = Column(String, nullable=False)
    candidate_code = Column(String, nullable=False) # Candidate #01
    similarity_score = Column(Float, nullable=False) # e.g. 0.87
    similarity_band = Column(String, nullable=False) # High Similarity, Medium Similarity, Low Similarity
    first_seen = Column(String, nullable=False)
    last_seen = Column(String, nullable=False)
    primary_camera_id = Column(String, nullable=False)
    status = Column(String, default="Requires Review") # Requires Review, Kept for Further Investigation, Rejected Candidate
    reviewer_notes = Column(Text, nullable=True)
    review_decision = Column(String, nullable=True) # pending, kept, rejected
    evidence_preview_image = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    case = relationship("Case", back_populates="candidates")
    evidence_items = relationship("Evidence", back_populates="candidate", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="candidate", cascade="all, delete-orphan")

class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"), nullable=False)
    video_id = Column(Integer, ForeignKey("videos.id"), nullable=True)
    camera_id = Column(String, nullable=False)
    timestamp = Column(String, nullable=False)
    timestamp_seconds = Column(Float, default=0.0)
    frame_number = Column(Integer, nullable=False)
    image_path = Column(String, nullable=False)
    bounding_box = Column(JSON, nullable=True)
    detection_confidence = Column(Float, default=0.92)
    similarity_score = Column(Float, default=0.85)

    candidate = relationship("Candidate", back_populates="evidence_items")

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    candidate_id = Column(Integer, ForeignKey("candidates.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    decision = Column(String, nullable=False) # kept, rejected, review_later
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    candidate = relationship("Candidate", back_populates="reviews")
    user = relationship("User", back_populates="reviews")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, nullable=True)
    user_id = Column(Integer, nullable=True)
    action = Column(String, nullable=False)
    details = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
