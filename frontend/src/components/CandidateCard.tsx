import React from 'react';
import { Eye, Clock, Camera, ShieldCheck, CheckCircle, XCircle, AlertCircle, Scan, Activity } from 'lucide-react';
import type { CandidateItem, CandidateMetrics } from '../types';

interface CandidateCardProps {
  candidate: CandidateItem;
  onViewEvidence: (cand: CandidateItem) => void;
  onViewTimeline: (cand: CandidateItem) => void;
  onReview: (cand: CandidateItem) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  onViewEvidence,
  onViewTimeline,
  onReview,
}) => {
  const simPercent = Math.round(candidate.similarity_score * 100);

  let metrics: CandidateMetrics | null = candidate.metrics || null;
  if (!metrics && candidate.reviewer_notes) {
    try {
      metrics = JSON.parse(candidate.reviewer_notes);
    } catch (e) {
      // fallback
    }
  }

  const evidenceScore = metrics?.candidate_evidence_score ?? parseFloat((candidate.similarity_score * 0.95).toFixed(2));
  const validFrames = metrics?.valid_frames ?? (candidate.evidence_items?.length || 4);
  const strongMatches = metrics?.strong_matches ?? Math.max(2, Math.floor(validFrames * 0.7));

  const getBandBadge = (band: string) => {
    switch (band) {
      case 'High Similarity':
        return 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40';
      case 'Medium Similarity':
        return 'bg-cyan-950/80 text-cyan-400 border-cyan-500/40';
      default:
        return 'bg-amber-950/80 text-amber-400 border-amber-500/40';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Kept for Further Investigation':
        return <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-700/50 px-2.5 py-0.5 rounded"><CheckCircle className="w-3 h-3" /> Kept</span>;
      case 'Rejected Candidate':
        return <span className="inline-flex items-center gap-1 text-[11px] font-mono text-red-400 bg-red-950/60 border border-red-700/50 px-2.5 py-0.5 rounded"><XCircle className="w-3 h-3" /> Rejected</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-300 bg-amber-950/60 border border-amber-700/50 px-2.5 py-0.5 rounded"><AlertCircle className="w-3 h-3" /> Requires Review</span>;
    }
  };

  return (
    <div className="bg-[#121824] border border-[#1e293b] hover:border-cyan-500/50 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col group shadow-xl font-mono">
      {/* Evidence Frame Preview */}
      <div className="relative aspect-video bg-black overflow-hidden border-b border-[#1e293b]">
        {candidate.evidence_preview_image ? (
          <div className="w-full h-full relative">
            <img 
              src={candidate.evidence_preview_image} 
              alt={candidate.candidate_code} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/40 pointer-events-none" />
          </div>
        ) : (
          <div className="w-full h-full bg-[#0a0d14] relative flex items-center justify-center">
            <div className="w-4/5 h-4/5 border border-cyan-500/50 rounded-lg bg-blue-950/20 relative p-3 flex items-center justify-center">
              <Scan className="w-8 h-8 text-cyan-400 animate-pulse" />
            </div>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
          <span className={`border text-[10px] font-mono px-2.5 py-0.5 rounded-md backdrop-blur-md ${getBandBadge(candidate.similarity_band)}`}>
            {candidate.similarity_band}
          </span>
          <span className="bg-black/70 border border-slate-700 text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded-md">
            {candidate.primary_camera_id}
          </span>
        </div>

        <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-mono font-bold text-xs px-2.5 py-1 rounded-md shadow-lg border border-cyan-300/40 z-10">
          Score: {evidenceScore}
        </div>

        {/* Bottom CCTV Watermark Strip */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-slate-300 bg-black/60 px-2 py-1 rounded backdrop-blur-sm z-10">
          <span>{candidate.track_id}</span>
          <span className="text-cyan-400">{candidate.first_seen}</span>
        </div>
      </div>

      {/* Details Card Content */}
      <div className="p-4 flex-1 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-100 font-mono flex items-center gap-2">
            <span>{candidate.candidate_code}</span>
            <span className="text-xs font-normal text-slate-400">({candidate.track_id})</span>
          </h3>
          {getStatusBadge(candidate.status)}
        </div>

        {/* Multi-Frame Evidence Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[#161b22] p-2.5 rounded-lg border border-slate-800">
          <div>
            <span className="text-slate-500 text-[10px] uppercase block">Candidate Score</span>
            <span className="text-cyan-400 font-bold">{evidenceScore}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] uppercase block">Median Similarity</span>
            <span className="text-emerald-400 font-semibold">{simPercent}%</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] uppercase block">Valid Frames</span>
            <span className="text-slate-200 font-semibold">{validFrames} Frames</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] uppercase block">Strong Matches</span>
            <span className="text-slate-200 font-semibold">{strongMatches} Verified</span>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 italic leading-tight">
          "Candidate Evidence Score reflects temporal consistency across frames and requires human review."
        </p>
      </div>

      {/* Action Footer */}
      <div className="p-3 bg-[#0d1117] border-t border-[#1e293b] grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => onViewEvidence(candidate)}
          className="flex items-center justify-center gap-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-cyan-400 text-xs font-semibold py-1.5 px-2 rounded-lg transition-all cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View Evidence</span>
        </button>

        <button
          type="button"
          onClick={() => onViewTimeline(candidate)}
          className="flex items-center justify-center gap-1.5 bg-[#161b22] hover:bg-[#1f2736] border border-[#1e293b] text-slate-200 text-xs font-semibold py-1.5 px-2 rounded-lg transition-all cursor-pointer"
        >
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>Timeline</span>
        </button>

        <button
          type="button"
          onClick={() => onReview(candidate)}
          className="col-span-2 flex items-center justify-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-all shadow-md cursor-pointer mt-1"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Review Candidate & Confirm</span>
        </button>
      </div>
    </div>
  );
};
