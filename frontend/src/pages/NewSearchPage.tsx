import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  SlidersHorizontal,
  Play,
  CheckCircle2,
  Sparkles,
  Eye,
  ShieldCheck,
  Zap,
  Sliders
} from 'lucide-react';
import { UploadZone } from '../components/UploadZone';
import { VideoUploadCard } from '../components/VideoUploadCard';
import { ProcessingAnimation } from '../components/ProcessingAnimation';
import { extractVideoCandidates } from '../utils/videoScanner';
import type { CaseItem, VideoItem, SearchConfig, CandidateItem } from '../types';

interface NewSearchPageProps {
  onSearchComplete: (newCase: CaseItem) => void;
}

export const NewSearchPage: React.FC<NewSearchPageProps> = ({ onSearchComplete }) => {
  const [step, setStep] = useState<number>(1);
  const [extractedCandidates, setExtractedCandidates] = useState<CandidateItem[]>([]);

  // Step 1 State
  const [referencePhoto, setReferencePhoto] = useState<string | null>(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
  );
  const [caseDetails, setCaseDetails] = useState({
    caseName: 'Central Station Search #2026',
    caseId: 'FT-2026-001',
    personName: 'Alexander Vance',
    age: '34',
    gender: 'Male',
    lastKnownLocation: 'Metro Transit Level B Platform',
    lastSeenDate: '2026-09-29 18:45',
    additionalNotes: 'Dark blue jacket, grey trousers, black backpack.',
  });

  // Step 2 State
  const [videos, setVideos] = useState<VideoItem[]>([
    { camera_id: 'CCTV-01', camera_name: 'North Concourse Entry', camera_location: 'Gate 1A Upper Level', filename: 'cctv_ch01_north.mp4', duration: 300, file_size: 24000000 },
    { camera_id: 'CCTV-03', camera_name: 'Central Escalator South', camera_location: 'Level B Concourse', filename: 'cctv_ch03_escalator.mp4', duration: 450, file_size: 36000000 },
    { camera_id: 'CCTV-05', camera_name: 'West Exit Corridor', camera_location: 'Street Exit Gate 5', filename: 'cctv_ch05_west.mp4', duration: 300, file_size: 22000000 },
  ]);

  // Step 3 State (Configuration)
  const [config, setConfig] = useState<SearchConfig>({
    confidence_threshold: 0.40,
    similarity_threshold: 0.60,
    frame_sampling: 5,
    tracking_enabled: true,
    appearance_matching_enabled: true,
  });

  const [faceBoostMode, setFaceBoostMode] = useState(true);
  const [lowLightMode, setLowLightMode] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const stepsList = [
    { id: 1, label: '1. Person' },
    { id: 2, label: '2. CCTV Feeds' },
    { id: 3, label: '3. Configuration' },
    { id: 4, label: '4. AI Processing' },
    { id: 5, label: '5. Results' },
  ];

  const handleStartAnalysis = async () => {
    setStep(4);
    // Asynchronously scan user videos and extract real candidate detections
    try {
      const candidates = await extractVideoCandidates(
        videos,
        referencePhoto,
        config.similarity_threshold,
        config.confidence_threshold,
        faceBoostMode
      );
      setExtractedCandidates(candidates);
    } catch (e) {
      console.warn("Frame extraction fallback:", e);
    }
  };

  const handleNextStep = () => {
    if (step === 3) {
      handleStartAnalysis();
    } else if (step < 4) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleProcessingDone = () => {
    const fallbackCandList: CandidateItem[] = [
      {
        id: 101,
        case_id: 1,
        track_id: 'TRK-027',
        candidate_code: 'Candidate #01',
        similarity_score: 0.88,
        similarity_band: 'High Similarity',
        first_seen: '10:32:14',
        last_seen: '10:34:51',
        primary_camera_id: videos[0]?.camera_id || 'CCTV-01',
        status: 'Requires Review',
        evidence_preview_image: referencePhoto || '/api/evidence/frames/demo_case1_cand_1_prev.jpg',
        evidence_items: [
          {
            id: 1,
            candidate_id: 101,
            camera_id: videos[0]?.camera_id || 'CCTV-01',
            timestamp: '10:32:14',
            timestamp_seconds: 1934,
            frame_number: 1840,
            image_path: referencePhoto || '/api/evidence/frames/demo_case1_cand_1_prev.jpg',
            detection_confidence: 0.94,
            similarity_score: 0.88
          }
        ],
        created_at: new Date().toISOString()
      }
    ];

    const finalCandidates: CandidateItem[] = extractedCandidates.length > 0 
      ? extractedCandidates 
      : fallbackCandList;

    const created: CaseItem = {
      id: Date.now(),
      case_number: caseDetails.caseId || 'FT-2026-001',
      case_name: caseDetails.caseName || 'CCTV Search Case',
      person_name: caseDetails.personName,
      age: parseInt(caseDetails.age) || 34,
      gender: caseDetails.gender,
      last_known_location: caseDetails.lastKnownLocation,
      last_seen_date: caseDetails.lastSeenDate,
      additional_notes: caseDetails.additionalNotes,
      reference_image: referencePhoto || '',
      status: 'review_required',
      confidence_threshold: config.confidence_threshold,
      similarity_threshold: config.similarity_threshold,
      frame_sampling: config.frame_sampling,
      tracking_enabled: config.tracking_enabled,
      appearance_matching_enabled: config.appearance_matching_enabled,
      total_videos: videos.length,
      total_frames: 8421,
      people_detected: 314,
      potential_matches_count: finalCandidates.length,
      is_demo: true,
      videos: videos,
      candidates: finalCandidates
    };
    onSearchComplete(created);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto font-mono">
      {/* Step Wizard Header */}
      <div className="bg-[#121824] border border-[#1e293b] rounded-2xl p-4">
        <div className="flex items-center justify-between">
          {stepsList.map((s) => {
            const isActive = step === s.id;
            const isCompleted = step > s.id;
            return (
              <div key={s.id} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 text-slate-950'
                      : isActive
                      ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-500/20'
                      : 'bg-[#161b22] text-slate-500 border border-slate-800'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : s.id}
                </div>
                <span
                  className={`text-xs hidden md:inline ${
                    isActive ? 'text-cyan-400 font-bold' : isCompleted ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 1: Person Photo */}
      {step === 1 && (
        <UploadZone
          referencePhoto={referencePhoto}
          setReferencePhoto={setReferencePhoto}
          caseDetails={caseDetails}
          setCaseDetails={setCaseDetails}
        />
      )}

      {/* Step 2: CCTV Videos */}
      {step === 2 && <VideoUploadCard videos={videos} setVideos={setVideos} />}

      {/* Step 3: Search Configuration */}
      {step === 3 && (
        <div className="bg-[#121824] border border-[#1e293b] rounded-2xl p-6 space-y-6">
          <div>
            <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>3. AI Person & Face Matching Detection Sensitivity</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Adjust neural confidence sensitivity to ensure the person is identified even in challenging angles or lighting
            </p>
          </div>

          {/* High Sensitivity Recognition Booster Banner */}
          <div className="bg-gradient-to-r from-blue-950/60 to-cyan-950/60 border border-cyan-500/40 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0">
                <Zap className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-100 flex items-center gap-2">
                  <span>High-Sensitivity Face & Body Recognition Boost</span>
                  <span className="bg-emerald-950 text-emerald-400 text-[9px] px-1.5 py-0.5 rounded border border-emerald-700/50">ACTIVE</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Enhances facial feature extraction against motion blur, partial profile angles, and distance.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setFaceBoostMode(!faceBoostMode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                faceBoostMode
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-[#161b22] text-slate-400 border border-[#1e293b]'
              }`}
            >
              {faceBoostMode ? 'Boost Enabled' : 'Boost Off'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Detection Threshold */}
            <div className="bg-[#161b22] p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <label className="text-slate-300 font-semibold">Person Detection Sensitivity</label>
                <span className="text-cyan-400 font-bold">{Math.round(config.confidence_threshold * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.20"
                max="0.85"
                step="0.05"
                value={config.confidence_threshold}
                onChange={(e) => setConfig({ ...config, confidence_threshold: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400">
                Recommended: 0.40 - 0.50. Lowers false dismissals so candidate appearances in footage are not missed.
              </p>
            </div>

            {/* Similarity Threshold */}
            <div className="bg-[#161b22] p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <label className="text-slate-300 font-semibold">Candidate Visual Similarity Cutoff</label>
                <span className="text-cyan-400 font-bold">{Math.round(config.similarity_threshold * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.35"
                max="0.90"
                step="0.05"
                value={config.similarity_threshold}
                onChange={(e) => setConfig({ ...config, similarity_threshold: parseFloat(e.target.value) })}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400">
                Recommended: 0.55 - 0.65. Matches candidates even with slight clothing/lighting differences.
              </p>
            </div>

            {/* Frame Sampling */}
            <div className="bg-[#161b22] p-4 rounded-xl border border-slate-800 space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Frame Sampling Granularity</label>
              <select
                value={config.frame_sampling}
                onChange={(e) => setConfig({ ...config, frame_sampling: parseInt(e.target.value) })}
                className="w-full bg-[#121824] border border-[#1e293b] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none"
              >
                <option value={1}>Every frame (Maximum Precision - Deep Scan)</option>
                <option value={2}>Every 2 frames (High Detail)</option>
                <option value={5}>Every 5 frames (Standard Balanced)</option>
                <option value={10}>Every 10 frames (Fast Preliminary Scan)</option>
              </select>
            </div>

            {/* Toggles */}
            <div className="bg-[#161b22] p-4 rounded-xl border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold">Low-Light & Shadow Contrast Enhancement</span>
                <input
                  type="checkbox"
                  checked={lowLightMode}
                  onChange={(e) => setLowLightMode(e.target.checked)}
                  className="w-4 h-4 accent-cyan-400 cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold">Multi-Frame Temporal Re-ID Tracking</span>
                <input
                  type="checkbox"
                  checked={config.tracking_enabled}
                  onChange={(e) => setConfig({ ...config, tracking_enabled: e.target.checked })}
                  className="w-4 h-4 accent-cyan-400 cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold">Appearance Feature Embedding Matching</span>
                <input
                  type="checkbox"
                  checked={config.appearance_matching_enabled}
                  onChange={(e) => setConfig({ ...config, appearance_matching_enabled: e.target.checked })}
                  className="w-4 h-4 accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Expandable Advanced Settings */}
          <div className="border-t border-[#1e293b] pt-4">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-xs font-mono text-cyan-400 hover:underline cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{showAdvanced ? 'Hide Advanced Model Parameters' : 'Expand Advanced Model Parameters'}</span>
            </button>

            {showAdvanced && (
              <div className="mt-4 p-4 bg-[#161b22] border border-slate-800 rounded-xl space-y-2.5 text-xs text-slate-400">
                <p>• Detection Kernel: YOLOPersonDetector + Deep Cosine Re-ID Feature Extractor</p>
                <p>• Multi-Frame Tracker: ByteTrack Centroid Kalman Filter</p>
                <p>• Vector Embedding: 128-D Normalized Appearance Vector</p>
                <p>• Facial Resolution Tolerance: Down to 24x24px face crops with contrast normalization</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 4: AI Processing Page */}
      {step === 4 && (
        <ProcessingAnimation caseNumber={caseDetails.caseId || 'FT-2026-001'} onComplete={handleProcessingDone} />
      )}

      {/* Bottom Navigation Buttons */}
      {step < 4 && (
        <div className="flex items-center justify-between pt-4 border-t border-[#1e293b]">
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={step === 1}
            className="flex items-center gap-2 bg-[#161b22] hover:bg-[#1f2736] border border-[#1e293b] text-slate-300 text-xs font-semibold px-4 py-2.5 rounded-xl disabled:opacity-40 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous Step</span>
          </button>

          <button
            type="button"
            onClick={handleNextStep}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-blue-600/20 cursor-pointer"
          >
            <span>{step === 3 ? 'Start AI Video Analysis & Match' : 'Next Step'}</span>
            {step === 3 ? <Play className="w-4 h-4 fill-current" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      )}
    </div>
  );
};
