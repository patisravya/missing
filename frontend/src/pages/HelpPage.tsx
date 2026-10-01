import React from 'react';
import { HelpCircle, Cpu, ShieldCheck, Layers, Sparkles, BookOpen, AlertTriangle } from 'lucide-react';

export const HelpPage: React.FC = () => {
  const futureExtensions = [
    { title: 'Multi-Camera Persistent Re-ID', desc: 'Track candidate movement continuously across dozens of independent non-overlapping CCTV camera views.' },
    { title: 'Clothing & Appearance Attribute Filters', desc: 'Filter candidates by apparel color, upper clothing type, headwear, or bag carrying characteristics.' },
    { title: 'OCR & License Plate Recognition (LPR)', desc: 'Optionally scan vehicle license plates in parking or exit CCTV streams where legally authorized.' },
    { title: 'Crowd Density & Anomaly Analysis', desc: 'Analyze crowd flows around candidate detection timestamps.' },
    { title: 'Automatic Evidence Summarization', desc: 'AI-generated video highlights isolating key frames for court presentation.' },
    { title: 'Camera-to-Camera Transition Graph', desc: 'Automated transition timing estimation between camera locations.' }
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto font-mono">
      <div>
        <h1 className="text-xl font-bold text-slate-100 tracking-tight">
          FindTrace AI Architecture & Ethics Manual
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Model replacement guide, ethical constraints, and future extensions roadmap
        </p>
      </div>

      {/* Section 1: Ethical & Legal Safeguards */}
      <div className="bg-[#121824] border border-amber-500/40 rounded-xl p-6 space-y-3">
        <h2 className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span>Core Ethical Principle: Human Verification Required</span>
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          FindTrace AI is strictly built as an <strong>investigative search assistant</strong>. The system provides probabilistic visual similarity candidate matches. The system never claims 100% identity confirmation. Investigators are required to manually evaluate every candidate.
        </p>
      </div>

      {/* Section 2: Model Replacement Architecture */}
      <div className="bg-[#121824] border border-[#1e293b] rounded-xl p-6 space-y-4">
        <h2 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
          <Cpu className="w-4 h-4" />
          <span>Plug-and-Play AI Model Architecture</span>
        </h2>
        <p className="text-xs text-slate-400">
          The backend defines modular interfaces allowing production models to be swapped seamlessly:
        </p>

        <div className="bg-[#0a0d14] border border-[#1e293b] rounded-lg p-4 text-xs space-y-2 text-slate-300">
          <p className="text-cyan-400 font-bold">1. BasePersonDetector → YOLOPersonDetector / MockPersonDetector</p>
          <p className="text-cyan-400 font-bold">2. BaseTracker → ByteTrackTracker / DeepSORT / MockTracker</p>
          <p className="text-cyan-400 font-bold">3. BaseEmbeddingModel → ReIDEmbeddingModel / CosineSimilarity</p>
        </div>
      </div>

      {/* Section 3: Future AI Extensions Roadmap */}
      <div className="bg-[#121824] border border-[#1e293b] rounded-xl p-6 space-y-4">
        <h2 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          <span>Future AI Extensions Roadmap (Section 41)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {futureExtensions.map((ext, i) => (
            <div key={i} className="bg-[#161b22] p-4 rounded-xl border border-slate-800 space-y-1">
              <h3 className="text-xs font-bold text-slate-200">{ext.title}</h3>
              <p className="text-[11px] text-slate-400 font-sans">{ext.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
