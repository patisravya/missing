export type CaseStatus = 'draft' | 'processing' | 'completed' | 'review_required' | 'no_candidate_found' | 'weak_candidate_found';

export type CandidateStatus = 'Requires Review' | 'Kept for Further Investigation' | 'Rejected Candidate';

export type SimilarityBand = 'High Similarity' | 'Medium Similarity' | 'Low Similarity';

export interface User {
  id?: number;
  name: string;
  email: string;
  role: string;
  badge_number?: string;
  agency?: string;
  access_token?: string;
}

export interface VideoItem {
  id?: number;
  camera_id: string;
  camera_name?: string;
  camera_location?: string;
  filename: string;
  duration?: number;
  file_size?: number;
  storage_path?: string;
  recording_date?: string;
  recording_start_time?: string;
  file?: File;
}

export interface EvidenceItem {
  id: number;
  candidate_id: number;
  video_id?: number;
  camera_id: string;
  timestamp: string;
  timestamp_seconds: number;
  frame_number: number;
  image_path: string;
  bounding_box?: { x: number; y: number; w: number; h: number };
  detection_confidence: number;
  similarity_score: number;
}

export interface CandidateMetrics {
  candidate_evidence_score: number;
  median_similarity: number;
  mean_similarity: number;
  max_similarity: number;
  top_k_similarity: number;
  valid_frames: number;
  strong_matches: number;
  candidate_margin: number;
  consistency_score: number;
  detection_quality: number;
  decision_category?: string;
  status_label?: string;
  explanation?: string;
}

export interface CandidateItem {
  id: number;
  case_id: number;
  track_id: string;
  candidate_code: string;
  similarity_score: number;
  similarity_band: SimilarityBand;
  first_seen: string;
  last_seen: string;
  primary_camera_id: string;
  status: CandidateStatus;
  reviewer_notes?: string;
  review_decision?: 'kept' | 'rejected' | 'pending';
  evidence_preview_image?: string;
  evidence_items?: EvidenceItem[];
  metrics?: CandidateMetrics;
  created_at?: string;
}

export interface CaseItem {
  id: number;
  case_number: string;
  case_name: string;
  person_name?: string;
  age?: number;
  gender?: string;
  last_known_location?: string;
  last_seen_date?: string;
  additional_notes?: string;
  reference_image?: string;
  status: CaseStatus;
  confidence_threshold: number;
  similarity_threshold: number;
  frame_sampling: number;
  tracking_enabled: boolean;
  appearance_matching_enabled: boolean;
  total_videos: number;
  total_frames: number;
  people_detected: number;
  potential_matches_count: number;
  is_demo?: boolean;
  created_at?: string;
  updated_at?: string;
  videos?: VideoItem[];
  candidates?: CandidateItem[];
}

export interface DashboardStats {
  total_searches: number;
  videos_processed: number;
  people_detected: number;
  potential_matches: number;
  awaiting_review: number;
}

export interface SearchConfig {
  confidence_threshold: number;
  similarity_threshold: number;
  frame_sampling: number;
  tracking_enabled: boolean;
  appearance_matching_enabled: boolean;
}

export interface CalibrationResult {
  status: string;
  metrics: {
    precision: number;
    recall: number;
    false_positive_rate: number;
    false_negative_rate: number;
    true_positives: number;
    false_positives: number;
    true_negatives: number;
    false_negatives: number;
  };
  scenarios: Array<{
    name: string;
    expected: string;
    actual: string;
    passed: boolean;
  }>;
  debug_telemetry: {
    total_tracks: number;
    rejected_too_short: number;
    rejected_too_blurry: number;
    rejected_low_similarity: number;
    rejected_single_frame_spike: number;
    rejected_insufficient_frames: number;
    retrieved_candidates_stage1: number;
    verified_candidates_stage2: number;
    track_diagnostics: Array<{
      track_id: string;
      status: string;
      reason: string;
    }>;
  };
}
