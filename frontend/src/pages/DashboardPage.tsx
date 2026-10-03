import React from 'react';
import { 
  Search, 
  Film, 
  Users, 
  CheckCircle2, 
  Plus, 
  FileText, 
  History, 
  ArrowUpRight,
  Eye
} from 'lucide-react';
import { StatCard } from '../components/StatCard';
import type { CaseItem, DashboardStats } from '../types';

interface DashboardPageProps {
  stats: DashboardStats;
  cases: CaseItem[];
  onSelectCase: (c: CaseItem) => void;
  onNewSearch: () => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  stats,
  cases,
  onSelectCase,
  onNewSearch,
  onNavigateTab,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'processing':
        return <span className="text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded text-[11px] font-mono">Processing</span>;
      case 'review_required':
        return <span className="text-amber-400 bg-amber-950/60 border border-amber-800/40 px-2 py-0.5 rounded text-[11px] font-mono">Review Required</span>;
      case 'completed':
        return <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded text-[11px] font-mono">Completed</span>;
      default:
        return <span className="text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded text-[11px] font-mono">No Candidate Found</span>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 font-mono tracking-tight">
            SOC Investigation Dashboard
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Real-time telemetry and CCTV search candidate analytics
          </p>
        </div>

        <button
          onClick={onNewSearch}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New CCTV Search</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Searches"
          value={stats.total_searches}
          subtext="+4 cases this week"
          icon={Search}
          color="blue"
        />
        <StatCard
          label="Videos Processed"
          value={stats.videos_processed}
          subtext="126 active CCTV channels"
          icon={Film}
          color="cyan"
        />
        <StatCard
          label="People Detected"
          value={stats.people_detected.toLocaleString()}
          subtext="Across 8,421 analyzed frames"
          icon={Users}
          color="emerald"
        />
        <StatCard
          label="Potential Matches"
          value={stats.potential_matches}
          subtext={`${stats.awaiting_review} awaiting review`}
          icon={CheckCircle2}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={onNewSearch}
          className="bg-[#121824] border border-[#1e293b] hover:border-cyan-500/50 p-4 rounded-xl text-left space-y-2 group transition-all cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-cyan-400 flex items-center justify-center border border-blue-500/30 group-hover:scale-110 transition-transform">
            <Plus className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-slate-200 font-mono">New Search Wizard</p>
          <p className="text-[11px] text-slate-400">Upload photo & CCTV videos</p>
        </button>

        <button
          onClick={onNewSearch}
          className="bg-[#121824] border border-[#1e293b] hover:border-cyan-500/50 p-4 rounded-xl text-left space-y-2 group transition-all cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-cyan-600/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30 group-hover:scale-110 transition-transform">
            <Film className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-slate-200 font-mono">Upload CCTV</p>
          <p className="text-[11px] text-slate-400">Add footage streams to case</p>
        </button>

        <button
          onClick={() => onNavigateTab('history')}
          className="bg-[#121824] border border-[#1e293b] hover:border-cyan-500/50 p-4 rounded-xl text-left space-y-2 group transition-all cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 group-hover:scale-110 transition-transform">
            <History className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-slate-200 font-mono">Search History</p>
          <p className="text-[11px] text-slate-400">Browse historical case archive</p>
        </button>

        <button
          onClick={() => onNavigateTab('reports')}
          className="bg-[#121824] border border-[#1e293b] hover:border-cyan-500/50 p-4 rounded-xl text-left space-y-2 group transition-all cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 group-hover:scale-110 transition-transform">
            <FileText className="w-4 h-4" />
          </div>
          <p className="text-xs font-bold text-slate-200 font-mono">Generate Report</p>
          <p className="text-[11px] text-slate-400">Export PDF/CSV candidate reports</p>
        </button>
      </div>

      <div className="bg-[#121824] border border-[#1e293b] rounded-xl overflow-hidden shadow-lg space-y-4 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider">
            Recent CCTV Investigations
          </h2>
          <button
            onClick={() => onNavigateTab('history')}
            className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All History</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#161b22] text-slate-400 border-b border-[#1e293b] uppercase">
              <tr>
                <th className="p-3">Search ID</th>
                <th className="p-3">Reference Person</th>
                <th className="p-3">CCTV Videos</th>
                <th className="p-3">Potential Matches</th>
                <th className="p-3">Status</th>
                <th className="p-3">Created</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]">
              {cases.map((c) => (
                <tr key={c.id} className="hover:bg-[#161b22]/50 transition-colors">
                  <td className="p-3 font-bold text-cyan-400">{c.case_number}</td>
                  <td className="p-3 font-semibold text-slate-200">{c.person_name || 'Alexander Vance'}</td>
                  <td className="p-3 text-slate-300">{c.total_videos || 0} Feeds</td>
                  <td className="p-3 font-bold">
                    {(c.potential_matches_count ?? c.candidates?.length ?? 0) > 0 ? (
                      <span className="text-cyan-400">{c.potential_matches_count ?? c.candidates?.length} Candidates</span>
                    ) : (
                      <span className="text-red-400 text-[11px] font-semibold">0 Matches (Not Found)</span>
                    )}
                  </td>
                  <td className="p-3">{getStatusBadge(c.status)}</td>
                  <td className="p-3 text-slate-400">2026-09-29</td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onSelectCase(c)}
                      className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 bg-blue-950/60 border border-blue-800/40 px-2.5 py-1 rounded text-xs transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Results</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
