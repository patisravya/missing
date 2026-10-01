from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

# Auth Schemas
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Optional[str] = "investigator"
    badge_number: Optional[str] = None
    agency: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_name: str
    user_role: str
    user_email: str
    badge_number: Optional[str] = None
    agency: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

# Case Schemas
class CaseCreate(BaseModel):
    case_name: str
    person_name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    last_known_location: Optional[str] = None
    last_seen_date: Optional[str] = None
    additional_notes: Optional[str] = None
    confidence_threshold: float = 0.50
    similarity_threshold: float = 0.70
    frame_sampling: int = 5
    tracking_enabled: bool = True
    appearance_matching_enabled: bool = True
    is_demo: bool = False

class VideoCreate(BaseModel):
    camera_id: str
    camera_name: Optional[str] = None
    camera_location: Optional[str] = None
    recording_date: Optional[str] = None
    recording_start_time: Optional[str] = None

class VideoResponse(BaseModel):
    id: int
    case_id: int
    camera_id: str
    camera_name: Optional[str]
    camera_location: Optional[str]
    filename: str
    duration: float
    file_size: int
    storage_path: str
    recording_date: Optional[str]
    recording_start_time: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class EvidenceResponse(BaseModel):
    id: int
    candidate_id: int
    video_id: Optional[int]
    camera_id: str
    timestamp: str
    timestamp_seconds: float
    frame_number: int
    image_path: str
    bounding_box: Optional[dict]
    detection_confidence: float
    similarity_score: float

    class Config:
        from_attributes = True

class ReviewCreate(BaseModel):
    decision: str # kept, rejected, review_later
    notes: Optional[str] = None

class ReviewResponse(BaseModel):
    id: int
    candidate_id: int
    user_id: int
    decision: str
    notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

class CandidateResponse(BaseModel):
    id: int
    case_id: int
    track_id: str
    candidate_code: str
    similarity_score: float
    similarity_band: str
    first_seen: str
    last_seen: str
    primary_camera_id: str
    status: str
    reviewer_notes: Optional[str]
    review_decision: Optional[str]
    evidence_preview_image: Optional[str]
    evidence_items: List[EvidenceResponse] = []
    created_at: datetime

    class Config:
        from_attributes = True

class CaseResponse(BaseModel):
    id: int
    case_number: str
    case_name: str
    person_name: Optional[str]
    age: Optional[int]
    gender: Optional[str]
    last_known_location: Optional[str]
    last_seen_date: Optional[str]
    additional_notes: Optional[str]
    reference_image: Optional[str]
    status: str
    confidence_threshold: float
    similarity_threshold: float
    frame_sampling: int
    tracking_enabled: bool
    appearance_matching_enabled: bool
    total_videos: int
    total_frames: int
    people_detected: int
    potential_matches_count: int
    is_demo: bool
    created_at: datetime
    updated_at: datetime
    videos: List[VideoResponse] = []
    candidates: List[CandidateResponse] = []

    class Config:
        from_attributes = True

class DashboardStats(BaseModel):
    total_searches: int
    videos_processed: int
    people_detected: int
    potential_matches: int
    awaiting_review: int

class SearchConfig(BaseModel):
    confidence_threshold: float = 0.50
    similarity_threshold: float = 0.70
    frame_sampling: int = 5
    tracking_enabled: bool = True
    appearance_matching_enabled: bool = True
