import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Clock, Save, X } from 'lucide-react';
import type { CandidateItem } from '../types';

interface ReviewModalProps {
  candidate: CandidateItem;
  onClose: () => void;
  onSubmitReview: (candidateId: number, decision: 'kept' | 'rejected' | 'pending', notes: string) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ candidate, onClose, onSubmitReview }) => {
  const [decision, setDecision] = useState<'kept' | 'rejected' | 'pending'>(
    candidate.review_decision || 'kept'
  );
  const [notes, setNotes] = useState(candidate.reviewer_notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReview(candidate.id, decision, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#121824] border border-[#1e293b] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl space-y-6 p-6">
        <div className="flex items-center justify-between border-b border-[#1e293b] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-mono">
                Manual Investigator Review
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {candidate.candidate_code} • Track {candidate.track_id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg border border-[#1e293b] text-slate-400 hover:text-slate-200 hover:bg-[#161b22] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-[#161b22] p-4 rounded-xl border border-[#1e293b] text-center space-y-2">
          <p className="text-xs font-mono font-semibold text-slate-200">
            Does this candidate match require further investigation?
          </p>
          <p className="text-[11px] text-slate-400 font-mono">
            Similarity Score: <strong className="text-cyan-400">{Math.round(candidate.similarity_score * 100)}%</strong> ({candidate.similarity_band})
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setDecision('kept')}
            className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
              decision === 'kept'
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-bold shadow-lg shadow-emerald-950/40'
                : 'bg-[#161b22] border-[#1e293b] text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Keep Candidate</span>
          </button>

          <button
            type="button"
            onClick={() => setDecision('rejected')}
            className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
              decision === 'rejected'
                ? 'bg-red-950/80 border-red-500 text-red-300 font-bold shadow-lg shadow-red-950/40'
                : 'bg-[#161b22] border-[#1e293b] text-slate-400 hover:text-slate-200'
            }`}
          >
            <XCircle className="w-5 h-5 text-red-400" />
            <span>Reject Candidate</span>
          </button>

          <button
            type="button"
            onClick={() => setDecision('pending')}
            className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
              decision === 'pending'
                ? 'bg-amber-950/80 border-amber-500 text-amber-300 font-bold shadow-lg shadow-amber-950/40'
                : 'bg-[#161b22] border-[#1e293b] text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-5 h-5 text-amber-400" />
            <span>Review Later</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1">
              Investigator Rationale & Case Notes *
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Verified jacket color and backpack style match reference photo. Added to high-priority trace shortlist."
              className="w-full bg-[#161b22] border border-[#1e293b] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#1e293b]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#1e293b] text-xs font-semibold text-slate-400 hover:bg-[#161b22] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Review Action</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
