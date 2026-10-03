import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Circle, Cpu, Scan, Layers, Activity, ShieldCheck } from 'lucide-react';

interface ProcessingAnimationProps {
  caseNumber: string;
  candidateCount?: number;
  onComplete: () => void;
}

export const ProcessingAnimation: React.FC<ProcessingAnimationProps> = ({ caseNumber, candidateCount = 0, onComplete }) => {
  const [progress, setProgress] = useState(15);
  const [framesAnalyzed, setFramesAnalyzed] = useState(1240);
  const [peopleDetected, setPeopleDetected] = useState(12);
  const [activeStep, setActiveStep] = useState(4);
  const [logs, setLogs] = useState<string[]>([
    '10:32:10 — Case initialized: ' + caseNumber,
    '10:32:11 — Reference image visual embedding extracted (128-dim)',
    '10:32:12 — CCTV video feeds validated: multi-stream ingestion active',
    '10:32:14 — Frame extraction pipeline active (Sampling: Every 5 frames)',
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 800);
          return 100;
        }

        const next = prev + 5;
        setFramesAnalyzed((f) => f + 420);
        setPeopleDetected((p) => p + Math.floor(Math.random() * 8 + 2));

        if (next > 40 && activeStep < 5) {
          setActiveStep(5);
          setLogs((l) => [...l, `10:32:${Math.floor(next/2)} — Person tracking & bounding box analyzer active`]);
        }
        if (next > 70 && activeStep < 6) {
          setActiveStep(6);
          setLogs((l) => [...l, `10:32:${Math.floor(next/2)} — Visual Re-ID similarity matching calculated`]);
          if (candidateCount > 0) {
            setLogs((l) => [...l, `10:32:${Math.floor(next/2)+1} — Positive appearance correlation identified (${candidateCount} candidate${candidateCount > 1 ? 's' : ''})`]);
          } else {
            setLogs((l) => [...l, `10:32:${Math.floor(next/2)+1} — No correlation above threshold detected in current window`]);
          }
        }
        if (next > 90 && activeStep < 7) {
          setActiveStep(7);
          if (candidateCount > 0) {
            setLogs((l) => [...l, `10:32:${Math.floor(next/2)+2} — Evidence timeline and verified frame stamps compiled`]);
          } else {
            setLogs((l) => [...l, `10:32:${Math.floor(next/2)+2} — Search finalized: Target individual not present in analyzed feeds`]);
          }
        }

        return next;
      });
    }, 320);

    return () => clearInterval(timer);
  }, [activeStep, onComplete, caseNumber, candidateCount]);

  const steps = [
    { id: 1, label: 'Reference Image', status: 'done' },
    { id: 2, label: 'CCTV Upload', status: 'done' },
    { id: 3, label: 'Frame Extraction', status: 'done' },
    { id: 4, label: 'Person Detection', status: activeStep >= 4 ? (activeStep > 4 ? 'done' : 'active') : 'pending' },
    { id: 5, label: 'Person Tracking', status: activeStep >= 5 ? (activeStep > 5 ? 'done' : 'active') : 'pending' },
    { id: 6, label: 'Visual Matching', status: activeStep >= 6 ? (activeStep > 6 ? 'done' : 'active') : 'pending' },
    { id: 7, label: 'Evidence Generation', status: activeStep >= 7 ? (activeStep > 7 ? 'done' : 'active') : 'pending' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-blue-950/60 border border-blue-500/40 text-cyan-400 font-mono text-xs px-3 py-1 rounded-full shadow-lg">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>AI SURVEILLANCE PROCESSING ENGINE • CASE: {caseNumber}</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-100 font-mono tracking-tight">
          Analyzing CCTV Footage & Re-ID Matching
        </h2>
        <p className="text-xs text-slate-400 max-w-xl mx-auto font-mono">
          Detecting person appearances across multi-camera streams and comparing feature embeddings against reference photograph.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Step Checklist */}
        <div className="bg-[#121824] border border-[#1e293b] rounded-xl p-5 space-y-3">
          <h3 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Pipeline Checklist
          </h3>
          <div className="space-y-2.5">
            {steps.map((s) => (
              <div key={s.id} className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-2">
                  <span className="text-slate-600">0{s.id}.</span> {s.label}
                </span>
                {s.status === 'done' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                {s.status === 'active' && <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />}
                {s.status === 'pending' && <Circle className="w-4 h-4 text-slate-700 shrink-0" />}
              </div>
            ))}
          </div>
        </div>

        {/* Progress & Live Telemetry */}
        <div className="md:col-span-2 bg-[#121824] border border-[#1e293b] rounded-xl p-6 space-y-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-mono text-slate-400">Processing CCTV Feed</p>
              <p className="text-3xl font-bold font-mono text-cyan-400 mt-1">{progress}%</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-blue-950/40 border border-cyan-500/40 flex items-center justify-center text-cyan-400 relative">
              <Scan className="w-8 h-8 animate-radar" />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#161b22] border border-[#1e293b] rounded-full h-3 overflow-hidden p-0.5">
            <div
              className="bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Live Metrics */}
          <div className="grid grid-cols-3 gap-3 text-center pt-2 border-t border-[#1e293b]">
            <div className="bg-[#161b22] p-2.5 rounded-lg border border-slate-800">
              <p className="text-[10px] font-mono text-slate-400 uppercase">Frames Analyzed</p>
              <p className="text-lg font-bold font-mono text-slate-100">{framesAnalyzed.toLocaleString()}</p>
            </div>
            <div className="bg-[#161b22] p-2.5 rounded-lg border border-slate-800">
              <p className="text-[10px] font-mono text-slate-400 uppercase">People Detected</p>
              <p className="text-lg font-bold font-mono text-slate-100">{peopleDetected}</p>
            </div>
            <div className="bg-[#161b22] p-2.5 rounded-lg border border-slate-800">
              <p className="text-[10px] font-mono text-slate-400 uppercase">Candidates Found</p>
              <p className={`text-lg font-bold font-mono ${candidateCount > 0 ? 'text-cyan-400' : 'text-slate-400'}`}>{candidateCount}</p>
            </div>
          </div>

          {/* Console Log Terminal */}
          <div className="bg-[#0a0d14] border border-[#1e293b] rounded-lg p-3 text-[11px] font-mono space-y-1.5 h-32 overflow-y-auto">
            {logs.map((log, i) => (
              <p key={i} className="text-slate-300">
                <span className="text-cyan-500">❯</span> {log}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
