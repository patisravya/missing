import React from 'react';
import { 
  Shield, 
  Search, 
  Play, 
  Cpu, 
  Eye, 
  Clock, 
  UserCheck, 
  ArrowRight, 
  Camera, 
  Sparkles, 
  Lock,
  Layers,
  FileCheck
} from 'lucide-react';

interface LandingPageProps {
  onStartSearch: () => void;
  onRunDemo: () => void;
  onSignInClick: () => void;
  onSignUpClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onStartSearch, 
  onRunDemo, 
  onSignInClick,
  onSignUpClick 
}) => {
  const features = [
    {
      icon: Cpu,
      title: 'AI-Assisted Person Detection',
      desc: 'Automatically isolate human shapes and candidates across high-definition CCTV feeds using neural vision models.',
    },
    {
      icon: Eye,
      title: 'Smart Multi-Frame Tracking',
      desc: 'Persistent temporal object tracking retains candidate IDs through occlusions, lighting changes, and camera movements.',
    },
    {
      icon: Sparkles,
      title: 'Visual Appearance Re-ID',
      desc: 'Deep feature vector embeddings match reference photographs against detected person crops with probabilistic scoring.',
    },
    {
      icon: Clock,
      title: 'Evidence Timeline',
      desc: 'Review exact frame timestamps, candidate duration, and multi-channel camera transition sequences.',
    },
    {
      icon: UserCheck,
      title: 'Human Verification Control',
      desc: 'Keeps investigators in total control. AI assists visual search while humans make final confirmation decisions.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 flex flex-col font-mono selection:bg-blue-600 selection:text-white">
      {/* Top Header Navigation */}
      <header className="border-b border-[#1e293b] bg-[#0d1117]/80 backdrop-blur-md px-6 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-slate-100 tracking-wider">FindTrace <span className="text-cyan-400">AI</span></h1>
            <p className="text-[10px] text-slate-400 tracking-widest uppercase">Search • Track • Verify</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <button
            onClick={onSignInClick}
            className="text-xs text-slate-300 hover:text-cyan-400 px-3 py-1.5 font-semibold transition-colors cursor-pointer border border-[#1e293b] rounded-lg bg-[#161b22] hover:border-slate-700"
          >
            Sign In
          </button>
          <button
            onClick={onSignUpClick}
            className="text-xs text-cyan-400 hover:text-cyan-300 px-3 py-1.5 font-semibold transition-colors cursor-pointer border border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-900/40 rounded-lg hidden sm:block"
          >
            Sign Up
          </button>
          <button
            onClick={onStartSearch}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold px-3.5 sm:px-4 py-2 rounded-lg shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Start New Search</span>
            <span className="sm:hidden">Search</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-16 space-y-16">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-blue-950/80 border border-blue-500/40 text-cyan-400 text-xs px-3.5 py-1.5 rounded-full shadow-lg">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span>AI-ASSISTED MISSING PERSON CCTV SEARCH SYSTEM</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight text-slate-100">
            Rapid CCTV Search. <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
              Track Candidates. Verify Evidence.
            </span>
          </h1>

          <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto font-sans leading-relaxed">
            Analyze CCTV footage, detect potential person matches, and review evidence through an intelligent investigation timeline designed for law enforcement and authorized emergency response.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={onStartSearch}
              className="flex items-center gap-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-xl shadow-blue-600/25 transition-all hover:scale-105 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Start New Search</span>
            </button>

            <button
              onClick={onRunDemo}
              className="flex items-center gap-2.5 bg-[#121824] hover:bg-[#182030] border border-[#1e293b] hover:border-cyan-500/40 text-cyan-400 text-sm font-semibold px-6 py-3 rounded-xl transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>View Interactive Demo</span>
            </button>
          </div>
        </div>

        {/* Visual Pipeline Illustration Diagram */}
        <div className="bg-[#121824] border border-[#1e293b] rounded-2xl p-8 shadow-2xl relative overflow-hidden space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-widest">
              End-to-End Visual Intelligence Pipeline
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              From reference photograph to verified candidate timeline
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center relative z-10">
            {/* Node 1 */}
            <div className="bg-[#161b22] border border-blue-500/30 p-4 rounded-xl text-center space-y-2">
              <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-cyan-400 flex items-center justify-center mx-auto border border-blue-500/40">
                <Camera className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-200">1. Reference Photo</p>
              <p className="text-[10px] text-slate-400">Embedding Extraction</p>
            </div>

            <ArrowRight className="w-5 h-5 text-cyan-400 mx-auto hidden md:block" />

            {/* Node 2 */}
            <div className="bg-[#161b22] border border-blue-500/30 p-4 rounded-xl text-center space-y-2">
              <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-cyan-400 flex items-center justify-center mx-auto border border-blue-500/40">
                <Layers className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-200">2. CCTV Video</p>
              <p className="text-[10px] text-slate-400">Frame Extraction</p>
            </div>

            <ArrowRight className="w-5 h-5 text-cyan-400 mx-auto hidden md:block" />

            {/* Node 3 */}
            <div className="bg-[#161b22] border border-cyan-500/50 p-4 rounded-xl text-center space-y-2 shadow-lg shadow-cyan-500/10">
              <div className="w-10 h-10 rounded-lg bg-cyan-600/20 text-cyan-300 flex items-center justify-center mx-auto border border-cyan-500/40">
                <Cpu className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-100">3. AI Detection & Track</p>
              <p className="text-[10px] text-slate-400">Person Crop Re-ID</p>
            </div>

            <ArrowRight className="w-5 h-5 text-cyan-400 mx-auto hidden md:block" />

            {/* Node 4 */}
            <div className="bg-[#161b22] border border-emerald-500/40 p-4 rounded-xl text-center space-y-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                <FileCheck className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-200">4. Evidence Timeline</p>
              <p className="text-[10px] text-slate-400">Human Review & Report</p>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold font-mono text-slate-100">Key Platform Capabilities</h2>
            <p className="text-xs text-slate-400 max-w-xl mx-auto font-sans">
              Built specifically for missing person searches requiring strict human oversight.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#121824] border border-[#1e293b] hover:border-blue-500/40 rounded-xl p-6 space-y-3 transition-all hover:-translate-y-1 shadow-lg"
                >
                  <div className="w-11 h-11 rounded-lg bg-blue-950/60 border border-blue-500/30 flex items-center justify-center text-cyan-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-100 font-mono">{feat.title}</h3>
                  <p className="text-xs text-slate-400 font-sans leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1e293b] bg-[#0d1117] py-6 px-8 text-center text-xs text-slate-500">
        <p>© 2026 FindTrace AI. All rights reserved. Candidate matches are probabilistic and require human verification.</p>
      </footer>
    </div>
  );
};
