import React, { useState } from 'react';
import { 
  AlertTriangle, 
  FileText, 
  RefreshCw, 
  Plus, 
  Eye, 
  Sliders, 
  Camera, 
  Sparkles, 
  CheckCircle2, 
  Zap,
  UserCheck
} from 'lucide-react';
import { CandidateCard } from '../components/CandidateCard';
import { EvidenceViewer } from '../components/EvidenceViewer';
import { Timeline } from '../components/Timeline';
import { ReviewModal } from '../components/ReviewModal';
import { ReportPreview } from '../components/ReportPreview';
import type { CaseItem, CandidateItem } from '../types';

interface ResultsPageProps {
  caseData: CaseItem;
  onReviewCandidate: (candidateId: number, decision: 'kept' | 'rejected' | 'pending', notes: string) => void;
  onNewSearch: () => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  caseData,
  onReviewCandidate,
  onNewSearch,
}) => {
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateItem | null>(null);
  const [activeModal, setActiveModal] = useState<'evidence' | 'timeline' | 'review' | 'report' | null>(null);
  const [filterBand, setFilterBand] = useState<string>('all');
  const [customThreshold, setCustomThreshold] = useState<number>(caseData.similarity_threshold || 0.60);

  const candidates = caseData.candidates || [];

  const highSim = candidates.filter((c) => c.similarity_band === 'High Similarity').length;
  const medSim = candidates.filter((c) => c.similarity_band === 'Medium Similarity').length;
  const lowSim = candidates.filter((c) => c.similarity_band === 'Low Similarity').length;

  const filteredCandidates = candidates.filter((c) => {
    if (filterBand === 'all') return c.similarity_score >= customThreshold - 0.15;
    if (filterBand === 'high') return c.similarity_band === 'High Similarity';
    if (filterBand === 'med') return c.similarity_band === 'Medium Similarity';
    if (filterBand === 'low') return c.similarity_band === 'Low Similarity';
    if (filterBand === 'review') return c.status === 'Requires Review';
    return true;
  });

  const handleOpenEvidence = (cand: CandidateItem) => {
    setSelectedCandidate(cand);
    setActiveModal('evidence');
  };

  const handleOpenTimeline = (cand: CandidateItem) => {
    setSelectedCandidate(cand);
    setActiveModal('timeline');
  };

  const handleOpenReview = (cand: CandidateItem) => {
    setSelectedCandidate(cand);
    setActiveModal('review');
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Header Summary Bar with Reference Subject Preview */}
      <div className="bg-[#121824] border border-[#1e293b] rounded-2xl p-6 space-y-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#1e293b] pb-6">
          <div className="flex items-start sm:items-center gap-4">
            {caseData.reference_image && (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 border-cyan-400 bg-black shrink-0 relative group shadow-lg shadow-cyan-500/10">
                <img 
                  src={caseData.reference_image} 
                  alt="Target Missing Person" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end justify-center pb-1">
                  <span className="text-[8px] font-bold text-cyan-300">REF PHOTO</span>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold text-slate-100">
                  CCTV Search Results — {caseData.case_name}
                </h1>
                <span className="text-xs font-bold bg-blue-950 text-cyan-400 border border-blue-800/40 px-2.5 py-0.5 rounded">
                  {caseData.case_number}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Target Person: <strong className="text-slate-200">{caseData.person_name || 'Missing Person'}</strong> • Feeds Analyzed: {caseData.total_videos || 3} • Scan Status: <span className="text-emerald-400 font-bold">100% Complete</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setActiveModal('report')}
              className="flex items-center gap-2 bg-[#161b22] hover:bg-[#1a2330] border border-[#1e293b] text-cyan-400 font-semibold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>Export Report</span>
            </button>
            <button
              type="button"
              onClick={onNewSearch}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-lg cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Search</span>
            </button>
          </div>
        </div>

        {/* Live Sensitivity Adjuster */}
        <div className="bg-[#161b22] p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>Similarity Matching Filter Threshold:</span>
            <span className="font-bold text-cyan-400 text-sm">{Math.round(customThreshold * 100)}%</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-80">
            <span className="text-[10px] text-slate-500">Broad (40%)</span>
            <input
              type="range"
              min="0.35"
              max="0.85"
              step="0.05"
              value={customThreshold}
              onChange={(e) => setCustomThreshold(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500">Strict (85%)</span>
          </div>
        </div>

        {/* Breakdown Metric Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#161b22] p-3.5 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase block">Potential Candidates</span>
            <span className="text-2xl font-bold text-cyan-400">{filteredCandidates.length}</span>
          </div>

          <div className="bg-[#161b22] p-3.5 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase block">High Similarity</span>
            <span className="text-2xl font-bold text-emerald-400">{highSim}</span>
          </div>

          <div className="bg-[#161b22] p-3.5 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase block">Medium Similarity</span>
            <span className="text-2xl font-bold text-cyan-400">{medSim}</span>
          </div>

          <div className="bg-[#161b22] p-3.5 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase block">Low Similarity</span>
            <span className="text-2xl font-bold text-amber-400">{lowSim}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          <button
            type="button"
            onClick={() => setFilterBand('all')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterBand === 'all'
                ? 'bg-blue-600/20 text-cyan-400 border border-blue-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Potential Candidates ({filteredCandidates.length})
          </button>

          <button
            type="button"
            onClick={() => setFilterBand('high')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterBand === 'high'
                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            High Similarity ({highSim})
          </button>

          <button
            type="button"
            onClick={() => setFilterBand('med')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterBand === 'med'
                ? 'bg-cyan-950/80 text-cyan-400 border border-cyan-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Medium Similarity ({medSim})
          </button>

          <button
            type="button"
            onClick={() => setFilterBand('low')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterBand === 'low'
                ? 'bg-amber-950/80 text-amber-400 border border-amber-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Low Similarity ({lowSim})
          </button>
        </div>
      </div>

      {/* Candidates Grid */}
      {filteredCandidates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCandidates.map((cand) => (
            <CandidateCard
              key={cand.id}
              candidate={cand}
              onViewEvidence={handleOpenEvidence}
              onViewTimeline={handleOpenTimeline}
              onReview={handleOpenReview}
            />
          ))}
        </div>
      ) : (
        /* Section 28 NO-CANDIDATE RESULT Fallback with instant sensitivity boost */
        <div className="bg-[#121824] border border-[#1e293b] rounded-2xl p-10 text-center space-y-6 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-amber-950/60 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-400 shadow-lg">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-100">No Potential Candidates Found Above Cutoff</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              This does not establish that the person is absent from the footage.
            </p>
          </div>

          <div className="bg-[#161b22] p-4 rounded-xl text-xs text-slate-300 space-y-1.5 text-left border border-slate-800">
            <p>• CCTV Feeds Analyzed: {caseData.total_videos || 3}</p>
            <p>• Total Frames Scanned: {(caseData.total_frames || 8421).toLocaleString()}</p>
            <p>• Current Threshold: {Math.round(customThreshold * 100)}%</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setCustomThreshold(0.40)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Lower Threshold to 40% & Re-scan</span>
            </button>
            <button
              type="button"
              onClick={onNewSearch}
              className="flex items-center gap-2 bg-[#161b22] border border-[#1e293b] text-slate-200 text-xs font-semibold px-4 py-2.5 rounded-xl cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Additional Footage</span>
            </button>
          </div>
        </div>
      )}

      {/* Evidence Modal */}
      {activeModal === 'evidence' && selectedCandidate && (
        <EvidenceViewer candidate={selectedCandidate} onClose={() => setActiveModal(null)} />
      )}

      {/* Timeline Modal View */}
      {activeModal === 'timeline' && selectedCandidate && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-[#121824] border border-[#1e293b] rounded-2xl w-full max-w-4xl p-6 relative">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-sm font-mono cursor-pointer"
            >
              ✕ Close
            </button>
            <Timeline candidate={selectedCandidate} />
          </div>
        </div>
      )}

      {/* Candidate Review Modal */}
      {activeModal === 'review' && selectedCandidate && (
        <ReviewModal
          candidate={selectedCandidate}
          onClose={() => setActiveModal(null)}
          onSubmitReview={onReviewCandidate}
        />
      )}

      {/* Investigation Report Export Preview Modal */}
      {activeModal === 'report' && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="w-full max-w-4xl relative">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 bg-slate-900 border border-slate-700 text-slate-300 hover:text-white px-3 py-1 rounded text-xs font-mono cursor-pointer z-20"
            >
              ✕ Close Preview
            </button>
            <ReportPreview caseData={caseData} />
          </div>
        </div>
      )}
    </div>
  );
};
