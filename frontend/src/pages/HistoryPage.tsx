import React, { useState } from 'react';
import { History, Search, Filter, Eye, Calendar, Film } from 'lucide-react';
import { CaseItem } from '../types';

interface HistoryPageProps {
  cases: CaseItem[];
  onSelectCase: (c: CaseItem) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ cases, onSelectCase }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredCases = cases.filter((c) => {
    const matchesSearch = c.case_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.case_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.person_name && c.person_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && c.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-100 font-mono tracking-tight">
          CCTV Search Case History Archive
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          Search and review historical missing person investigation records
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-[#121824] border border-[#1e293b] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Case ID, Case Name, Person..."
            className="w-full bg-[#161b22] border border-[#1e293b] rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-xs font-mono text-slate-400">Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#161b22] border border-[#1e293b] text-slate-200 text-xs font-mono rounded-lg px-3 py-2 focus:outline-none"
          >
            <option value="all">All Cases</option>
            <option value="review_required">Review Required</option>
            <option value="completed">Completed</option>
            <option value="no_candidate_found">No Candidates Found</option>
          </select>
        </div>
      </div>

      {/* Case Table */}
      <div className="bg-[#121824] border border-[#1e293b] rounded-xl overflow-hidden shadow-lg">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#161b22] text-slate-400 border-b border-[#1e293b] uppercase">
            <tr>
              <th className="p-3.5">Case ID</th>
              <th className="p-3.5">Case Name</th>
              <th className="p-3.5">Reference Person</th>
              <th className="p-3.5">CCTV Feeds</th>
              <th className="p-3.5">Candidates</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e293b]">
            {filteredCases.map((c) => (
              <tr key={c.id} className="hover:bg-[#161b22]/50">
                <td className="p-3.5 font-bold text-cyan-400">{c.case_number}</td>
                <td className="p-3.5 font-semibold text-slate-200">{c.case_name}</td>
                <td className="p-3.5 text-slate-300">{c.person_name || 'N/A'}</td>
                <td className="p-3.5 text-slate-400">{c.total_videos || 0} Feeds</td>
                <td className="p-3.5 font-bold">
                  {(c.potential_matches_count ?? c.candidates?.length ?? 0) > 0 ? (
                    <span className="text-cyan-400">{c.potential_matches_count ?? c.candidates?.length} Matches</span>
                  ) : (
                    <span className="text-red-400 text-[11px] font-semibold">0 Matches (Not Found)</span>
                  )}
                </td>
                <td className="p-3.5">
                  {c.status === 'no_candidate_found' ? (
                    <span className="bg-red-950/80 text-red-400 border border-red-800/40 px-2 py-0.5 rounded text-[11px]">
                      Not Found
                    </span>
                  ) : c.status === 'review_required' ? (
                    <span className="bg-amber-950/80 text-amber-300 border border-amber-800/40 px-2 py-0.5 rounded text-[11px]">
                      Review Required
                    </span>
                  ) : (
                    <span className="bg-blue-950 text-cyan-400 border border-blue-800/40 px-2 py-0.5 rounded text-[11px]">
                      {c.status}
                    </span>
                  )}
                </td>
                <td className="p-3.5 text-right">
                  <button
                    onClick={() => onSelectCase(c)}
                    className="inline-flex items-center gap-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-cyan-400 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Case</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
