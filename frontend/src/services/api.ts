import type { CaseItem, CandidateItem, DashboardStats, SearchConfig, User } from '../types';

const API_BASE = '/api';

let mockDemoMode = true;

const initialMockCases: CaseItem[] = [
  {
    id: 1,
    case_number: 'FT-2026-001',
    case_name: 'Demo Missing Person Search — Central Station',
    person_name: 'Alexander Vance',
    age: 34,
    gender: 'Male',
    last_known_location: 'Metro Transit Level B, Platform 4',
    last_seen_date: '2026-09-29 18:45',
    additional_notes: 'Subject wearing dark blue jacket, grey trousers, carrying black backpack.',
    reference_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    status: 'review_required',
    confidence_threshold: 0.50,
    similarity_threshold: 0.70,
    frame_sampling: 5,
    tracking_enabled: true,
    appearance_matching_enabled: true,
    total_videos: 3,
    total_frames: 8421,
    people_detected: 314,
    potential_matches_count: 5,
    is_demo: true,
    created_at: '2026-09-29T10:14:00Z',
    updated_at: '2026-09-29T10:35:00Z',
    videos: [
      { camera_id: 'CCTV-01', camera_name: 'North Concourse Entry', camera_location: 'Gate 1A Upper Level', filename: 'cctv_ch01_north.mp4', duration: 300, file_size: 24000000 },
      { camera_id: 'CCTV-03', camera_name: 'Central Escalator South', camera_location: 'Level B Concourse', filename: 'cctv_ch03_escalator.mp4', duration: 450, file_size: 36000000 },
      { camera_id: 'CCTV-05', camera_name: 'West Exit Corridor', camera_location: 'Street Exit Gate 5', filename: 'cctv_ch05_west.mp4', duration: 300, file_size: 22000000 },
    ],
    candidates: [
      {
        id: 101,
        case_id: 1,
        track_id: 'TRK-027',
        candidate_code: 'Candidate #01',
        similarity_score: 0.87,
        similarity_band: 'High Similarity',
        first_seen: '10:32:14',
        last_seen: '10:34:51',
        primary_camera_id: 'CCTV-03',
        status: 'Requires Review',
        evidence_preview_image: '/api/evidence/frames/demo_case1_cand_1_prev.jpg',
        evidence_items: [
          { id: 1, candidate_id: 101, camera_id: 'CCTV-03', timestamp: '10:32:14', timestamp_seconds: 1934, frame_number: 1840, image_path: '/api/evidence/frames/demo_case1_cand1_ev_1.jpg', detection_confidence: 0.94, similarity_score: 0.87 },
          { id: 2, candidate_id: 101, camera_id: 'CCTV-03', timestamp: '10:32:38', timestamp_seconds: 1958, frame_number: 2190, image_path: '/api/evidence/frames/demo_case1_cand1_ev_2.jpg', detection_confidence: 0.95, similarity_score: 0.87 },
          { id: 3, candidate_id: 101, camera_id: 'CCTV-03', timestamp: '10:33:21', timestamp_seconds: 2001, frame_number: 2540, image_path: '/api/evidence/frames/demo_case1_cand1_ev_3.jpg', detection_confidence: 0.96, similarity_score: 0.87 },
          { id: 4, candidate_id: 101, camera_id: 'CCTV-03', timestamp: '10:34:51', timestamp_seconds: 2091, frame_number: 2890, image_path: '/api/evidence/frames/demo_case1_cand1_ev_4.jpg', detection_confidence: 0.97, similarity_score: 0.87 },
        ]
      },
      {
        id: 102,
        case_id: 1,
        track_id: 'TRK-042',
        candidate_code: 'Candidate #02',
        similarity_score: 0.82,
        similarity_band: 'High Similarity',
        first_seen: '10:31:05',
        last_seen: '10:32:22',
        primary_camera_id: 'CCTV-01',
        status: 'Requires Review',
        evidence_preview_image: '/api/evidence/frames/demo_case1_cand_2_prev.jpg',
        evidence_items: [
          { id: 5, candidate_id: 102, camera_id: 'CCTV-01', timestamp: '10:31:05', timestamp_seconds: 1865, frame_number: 1200, image_path: '/api/evidence/frames/demo_case1_cand_2_prev.jpg', detection_confidence: 0.92, similarity_score: 0.82 }
        ]
      },
      {
        id: 103,
        case_id: 1,
        track_id: 'TRK-089',
        candidate_code: 'Candidate #03',
        similarity_score: 0.78,
        similarity_band: 'Medium Similarity',
        first_seen: '10:35:10',
        last_seen: '10:37:04',
        primary_camera_id: 'CCTV-05',
        status: 'Requires Review',
        evidence_preview_image: '/api/evidence/frames/demo_case1_cand_3_prev.jpg',
        evidence_items: [
          { id: 6, candidate_id: 103, camera_id: 'CCTV-05', timestamp: '10:35:10', timestamp_seconds: 2110, frame_number: 3100, image_path: '/api/evidence/frames/demo_case1_cand_3_prev.jpg', detection_confidence: 0.91, similarity_score: 0.78 }
        ]
      },
      {
        id: 104,
        case_id: 1,
        track_id: 'TRK-104',
        candidate_code: 'Candidate #04',
        similarity_score: 0.71,
        similarity_band: 'Medium Similarity',
        first_seen: '10:30:18',
        last_seen: '10:31:40',
        primary_camera_id: 'CCTV-01',
        status: 'Requires Review',
        evidence_preview_image: '/api/evidence/frames/demo_case1_cand_4_prev.jpg',
        evidence_items: [
          { id: 7, candidate_id: 104, camera_id: 'CCTV-01', timestamp: '10:30:18', timestamp_seconds: 1818, frame_number: 950, image_path: '/api/evidence/frames/demo_case1_cand_4_prev.jpg', detection_confidence: 0.89, similarity_score: 0.71 }
        ]
      },
      {
        id: 105,
        case_id: 1,
        track_id: 'TRK-112',
        candidate_code: 'Candidate #05',
        similarity_score: 0.64,
        similarity_band: 'Low Similarity',
        first_seen: '10:36:20',
        last_seen: '10:36:55',
        primary_camera_id: 'CCTV-05',
        status: 'Rejected Candidate',
        evidence_preview_image: '/api/evidence/frames/demo_case1_cand_5_prev.jpg',
        evidence_items: [
          { id: 8, candidate_id: 105, camera_id: 'CCTV-05', timestamp: '10:36:20', timestamp_seconds: 2180, frame_number: 3400, image_path: '/api/evidence/frames/demo_case1_cand_5_prev.jpg', detection_confidence: 0.85, similarity_score: 0.64 }
        ]
      }
    ]
  },
  {
    id: 2,
    case_number: 'FT-2026-002',
    case_name: 'Downtown Commercial District Trace',
    person_name: 'Elena Rostova',
    age: 28,
    gender: 'Female',
    last_known_location: 'Grand Arcade Plaza',
    last_seen_date: '2026-09-28 14:15',
    status: 'completed',
    confidence_threshold: 0.50,
    similarity_threshold: 0.70,
    frame_sampling: 5,
    tracking_enabled: true,
    appearance_matching_enabled: true,
    total_videos: 2,
    total_frames: 5120,
    people_detected: 184,
    potential_matches_count: 2,
    is_demo: true,
    created_at: '2026-09-28T14:30:00Z',
    updated_at: '2026-09-28T15:00:00Z',
    videos: [
      { camera_id: 'CCTV-02', filename: 'cctv_arcade_02.mp4', duration: 250, file_size: 18000000 }
    ],
    candidates: []
  }
];

export const api = {
  getDemoMode: () => mockDemoMode,
  setDemoMode: (val: boolean) => { mockDemoMode = val; },

  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const res = await fetch(`${API_BASE}/cases/dashboard-stats`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Using local fallback dashboard stats");
    }
    return {
      total_searches: initialMockCases.length,
      videos_processed: 126,
      people_detected: 8421,
      potential_matches: 37,
      awaiting_review: 14
    };
  },

  getCurrentUser: (): User => {
    const saved = localStorage.getItem('findtrace_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      name: "Senior Investigator Miller",
      email: "demo@findtrace.ai",
      role: "lead_investigator",
      badge_number: "SOC-LEAD-007",
      agency: "Cyber Crime & CCTV Analysis Unit"
    };
  },

  login: async (credentials: { email: string; password: string }): Promise<User> => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      if (res.ok) {
        const data = await res.json();
        const user: User = {
          name: data.user_name || "Investigator",
          email: data.user_email || credentials.email,
          role: data.user_role || "investigator",
          badge_number: data.badge_number || "FT-INV-809",
          agency: data.agency || "Metropolitan Surveillance Unit",
          access_token: data.access_token
        };
        localStorage.setItem('findtrace_user', JSON.stringify(user));
        return user;
      }
    } catch (e) {
      console.warn("Backend auth unavailable, using local mock auth");
    }

    const role = credentials.email.includes("admin") ? "administrator" : credentials.email.includes("lead") ? "lead_investigator" : "investigator";
    const user: User = {
      name: credentials.email.split("@")[0].replace(".", " ").replace(/^[a-z]/, (c) => c.toUpperCase()),
      email: credentials.email,
      role: role,
      badge_number: "SOC-INV-" + Math.floor(100 + Math.random() * 900),
      agency: "Special Investigation Unit",
      access_token: "mock_jwt_token_" + Date.now()
    };
    localStorage.setItem('findtrace_user', JSON.stringify(user));
    return user;
  },

  register: async (userData: { name: string; email: string; password: string; role?: string; badge_number?: string; agency?: string }): Promise<User> => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (res.ok) {
        const data = await res.json();
        const user: User = {
          name: data.user_name || userData.name,
          email: data.user_email || userData.email,
          role: data.user_role || userData.role || "investigator",
          badge_number: data.badge_number || userData.badge_number || "FT-INV-809",
          agency: data.agency || userData.agency || "Metropolitan Surveillance Unit",
          access_token: data.access_token
        };
        localStorage.setItem('findtrace_user', JSON.stringify(user));
        return user;
      }
    } catch (e) {
      console.warn("Backend register unavailable, using local mock registration");
    }

    const user: User = {
      name: userData.name,
      email: userData.email,
      role: userData.role || "investigator",
      badge_number: userData.badge_number || "FT-REG-" + Math.floor(100 + Math.random() * 900),
      agency: userData.agency || "Law Enforcement Video Analysis Unit",
      access_token: "mock_jwt_reg_" + Date.now()
    };
    localStorage.setItem('findtrace_user', JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem('findtrace_user');
  },

  getCases: async (): Promise<CaseItem[]> => {
    try {
      const res = await fetch(`${API_BASE}/cases`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Using local fallback cases list");
    }
    return initialMockCases;
  },

  getCaseById: async (id: number): Promise<CaseItem> => {
    try {
      const res = await fetch(`${API_BASE}/cases/${id}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Using local fallback case details");
    }
    const found = initialMockCases.find(c => c.id === id);
    if (!found) throw new Error("Case not found");
    return found;
  },

  createCase: async (payload: Partial<CaseItem>): Promise<CaseItem> => {
    try {
      const res = await fetch(`${API_BASE}/cases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Using local mock case creation");
    }
    const newId = initialMockCases.length + 10;
    const newCase: CaseItem = {
      id: newId,
      case_number: `FT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      case_name: payload.case_name || 'New CCTV Investigation',
      person_name: payload.person_name,
      age: payload.age,
      gender: payload.gender,
      last_known_location: payload.last_known_location,
      last_seen_date: payload.last_seen_date,
      additional_notes: payload.additional_notes,
      reference_image: payload.reference_image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      status: 'draft',
      confidence_threshold: payload.confidence_threshold || 0.50,
      similarity_threshold: payload.similarity_threshold || 0.70,
      frame_sampling: payload.frame_sampling || 5,
      tracking_enabled: payload.tracking_enabled ?? true,
      appearance_matching_enabled: payload.appearance_matching_enabled ?? true,
      total_videos: 0,
      total_frames: 0,
      people_detected: 0,
      potential_matches_count: 0,
      is_demo: payload.is_demo ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      videos: [],
      candidates: []
    };
    initialMockCases.unshift(newCase);
    return newCase;
  },

  startSearch: async (caseId: number): Promise<CaseItem> => {
    try {
      const res = await fetch(`${API_BASE}/cases/${caseId}/start-search`, { method: 'POST' });
      if (res.ok) {
        const resCase = await fetch(`${API_BASE}/cases/${caseId}`);
        if (resCase.ok) return await resCase.json();
      }
    } catch (e) {
      console.warn("Using local mock AI search pipeline");
    }

    const target = initialMockCases.find(c => c.id === caseId) || initialMockCases[0];
    target.status = 'review_required';
    target.total_videos = target.videos?.length || 3;
    target.total_frames = 8421;
    target.people_detected = 314;
    target.potential_matches_count = 5;
    
    if (!target.candidates || target.candidates.length === 0) {
      target.candidates = initialMockCases[0].candidates;
    }
    return target;
  },

  reviewCandidate: async (candidateId: number, decision: 'kept' | 'rejected' | 'pending', notes?: string) => {
    try {
      const res = await fetch(`${API_BASE}/candidates/${candidateId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision, notes })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Using local mock review storage");
    }
    for (const c of initialMockCases) {
      if (c.candidates) {
        const cand = c.candidates.find(item => item.id === candidateId);
        if (cand) {
          cand.status = decision === 'kept' ? 'Kept for Further Investigation' : decision === 'rejected' ? 'Rejected Candidate' : 'Requires Review';
          cand.reviewer_notes = notes;
          return cand;
        }
      }
    }
    return { id: candidateId, status: decision === 'kept' ? 'Kept for Further Investigation' : 'Rejected Candidate' };
  }
};
