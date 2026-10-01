import React from 'react';
import { Clock, ArrowRight, AlertCircle } from 'lucide-react';
import type { CandidateItem } from '../types';

interface TimelineProps {
  candidate: CandidateItem;
  onSelectEvidence?: (item: any) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ candidate, onSelectEvidence }) => {
  const events = [
    { time: '10:30:18', cam: 'CCTV-01', location: 'North Concourse Gate 1', conf: '92%', note: 'Candidate detected moving south' },
    { time: '10:32:14', cam: 'CCTV-03', location: 'Level B Escalator', conf: '94%', note: 'High visual similarity detection' },
    { time: '10:33:21', cam: 'CCTV-03', location: 'Level B Concourse East', conf: '96%', note: 'Stationary near information desk' },
    { time: '10:34:51', cam: 'CCTV-03', location: 'Level B Concourse Exit', conf: '97%', note: 'Exiting escalator corridor' },
    { time: '10:36:20', cam: 'CCTV-05', location: 'West Exit Gate 5', conf: '89%', note: 'Candidate detected exiting building' },
  ];

  return (
    <div className="bg-[#121824] border border-[#1e293b] rounded-xl p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#1e293b] pb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100 font-mono flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Detection Timeline & Camera Sequence</span>
            <span className="text-xs font-normal text-slate-400">({candidate.candidate_code})</span>
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Chronological detection history across monitored CCTV channels
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#161b22] px-3.5 py-1.5 rounded-lg border border-[#1e293b] text-xs font-mono text-cyan-400">
          <span>CCTV-01</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-emerald-400 font-bold">CCTV-03</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          <span>CCTV-05</span>
        </div>
      </div>

      <div className="relative py-4">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#1e293b] -translate-y-1/2 hidden md:block" />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
          {events.map((ev, i) => (
            <div
              key={i}
              onClick={() => onSelectEvidence && onSelectEvidence(ev)}
              className="bg-[#161b22] border border-[#1e293b] hover:border-cyan-500/50 rounded-xl p-3 space-y-2 cursor-pointer transition-all hover:-translate-y-1 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400">{ev.time}</span>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded">
                  {ev.cam}
                </span>
              </div>

              <div className="aspect-video bg-slate-950 rounded-md border border-slate-800 flex items-center justify-center relative overflow-hidden group-hover:border-cyan-400/50">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#161b22_1px,transparent_1px),linear-gradient(to_bottom,#161b22_1px,transparent_1px)] bg-[size:10px_10px] opacity-30" />
                <div className="w-12 h-16 border border-cyan-400/60 bg-cyan-500/10 rounded flex items-center justify-center">
                  <span className="text-[8px] font-mono text-cyan-300">TRK-027</span>
                </div>
              </div>

              <div className="text-[11px] font-mono space-y-1">
                <p className="text-slate-300 font-semibold truncate">{ev.location}</p>
                <p className="text-slate-400 text-[10px] italic">{ev.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 bg-[#161b22] px-3.5 py-2 rounded-lg border border-[#1e293b] text-xs text-slate-400 font-mono">
        <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>
          Note: Camera transitions illustrate temporal sequence across recorded channels. Actual physical movement paths require camera position calibration.
        </span>
      </div>
    </div>
  );
};
