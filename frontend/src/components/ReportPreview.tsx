import React from 'react';
import { FileText, Printer, Shield, AlertTriangle, FileSpreadsheet, Code } from 'lucide-react';
import type { CaseItem } from '../types';

interface ReportPreviewProps {
  caseData: CaseItem;
  onClose?: () => void;
}

export const ReportPreview: React.FC<ReportPreviewProps> = ({ caseData }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = "Candidate Code,Track ID,Similarity Score,Similarity Band,First Seen,Last Seen,Camera ID,Status\n";
    const rows = (caseData.candidates || []).map(c => 
      `"${c.candidate_code}","${c.track_id}","${Math.round(c.similarity_score*100)}%","${c.similarity_band}","${c.first_seen}","${c.last_seen}","${c.primary_camera_id}","${c.status}"`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FindTrace_Report_${caseData.case_number}.csv`;
    a.click();
  };

  const handleExportJSON = () => {
    const reportObj = {
      title: "FindTrace AI Investigation Report",
      case_number: caseData.case_number,
      case_name: caseData.case_name,
      disclaimer: "AI-generated candidate matches are probabilistic and require human verification. The system does not establish identity.",
      candidates: caseData.candidates || []
    };
    const blob = new Blob([JSON.stringify(reportObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `FindTrace_Report_${caseData.case_number}.json`;
    a.click();
  };

  return (
    <div className="bg-[#121824] border border-[#1e293b] rounded-2xl p-8 max-w-4xl mx-auto space-y-8 shadow-2xl print:bg-white print:text-black print:p-0 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1e293b] pb-6 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-cyan-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">Official Investigation Report Preview</h2>
            <p className="text-xs text-slate-400">Case ID: {caseData.case_number}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-[#161b22] hover:bg-slate-800 border border-[#1e293b] text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>CSV Export</span>
          </button>
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 bg-[#161b22] hover:bg-slate-800 border border-[#1e293b] text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
          >
            <Code className="w-3.5 h-3.5 text-cyan-400" />
            <span>JSON</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all shadow-md cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Export PDF</span>
          </button>
        </div>
      </div>

      <div className="space-y-8 bg-[#0a0d14] p-8 rounded-xl border border-[#1e293b] print:border-0 print:bg-white">
        <div className="flex justify-between items-start border-b border-[#1e293b] pb-6 print:border-slate-300">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xl">
              <Shield className="w-6 h-6" />
              <span>FINDTRACE AI</span>
            </div>
            <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">
              AI-ASSISTED MISSING PERSON CCTV SEARCH REPORT
            </p>
          </div>
          <div className="text-right text-xs text-slate-400">
            <p className="font-bold text-slate-200">CASE: {caseData.case_number}</p>
            <p>Generated: {new Date().toISOString().split('T')[0]}</p>
            <p>Examiner: Lead Investigator Miller</p>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider border-b border-cyan-900/40 pb-1">
            1. Case & Reference Context
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs bg-[#121824] p-4 rounded-lg border border-[#1e293b] print:bg-slate-100 print:text-black">
            <div>
              <span className="text-slate-500 text-[10px] uppercase block">Case Name</span>
              <span className="text-slate-200 font-semibold">{caseData.case_name}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase block">Person Name</span>
              <span className="text-slate-200 font-semibold">{caseData.person_name || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase block">Last Known Location</span>
              <span className="text-slate-200 font-semibold">{caseData.last_known_location || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase block">Last Seen Date</span>
              <span className="text-slate-200 font-semibold">{caseData.last_seen_date || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider border-b border-cyan-900/40 pb-1">
            2. CCTV Surveillance Telemetry Summary
          </h3>
          <div className="grid grid-cols-4 gap-4 text-center text-xs bg-[#121824] p-4 rounded-lg border border-[#1e293b]">
            <div>
              <span className="text-slate-500 text-[10px] uppercase block">Videos Analyzed</span>
              <span className="text-slate-200 font-bold text-base">{caseData.total_videos || 3}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase block">Frames Analyzed</span>
              <span className="text-slate-200 font-bold text-base">{(caseData.total_frames || 8421).toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase block">People Detected</span>
              <span className="text-slate-200 font-bold text-base">{caseData.people_detected || 314}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase block">Potential Candidates</span>
              <span className="text-cyan-400 font-bold text-base">{caseData.potential_matches_count || 5}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider border-b border-cyan-900/40 pb-1">
            3. Potential Candidate Matches Matrix
          </h3>
          <div className="overflow-x-auto border border-[#1e293b] rounded-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#121824] text-slate-400 uppercase border-b border-[#1e293b]">
                <tr>
                  <th className="p-3">Candidate</th>
                  <th className="p-3">Track ID</th>
                  <th className="p-3">Similarity</th>
                  <th className="p-3">First Seen</th>
                  <th className="p-3">Last Seen</th>
                  <th className="p-3">Camera</th>
                  <th className="p-3">Review Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e293b]">
                {(caseData.candidates || []).map((cand) => (
                  <tr key={cand.id} className="hover:bg-[#121824]/50">
                    <td className="p-3 font-bold text-slate-200">{cand.candidate_code}</td>
                    <td className="p-3 text-cyan-400">{cand.track_id}</td>
                    <td className="p-3 text-emerald-400 font-bold">{Math.round(cand.similarity_score * 100)}%</td>
                    <td className="p-3 text-slate-300">{cand.first_seen}</td>
                    <td className="p-3 text-slate-300">{cand.last_seen}</td>
                    <td className="p-3 text-slate-300">{cand.primary_camera_id}</td>
                    <td className="p-3 text-amber-300 font-semibold">{cand.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-4 bg-amber-950/40 border border-amber-500/40 rounded-xl space-y-2 text-xs text-amber-200/90 print:bg-slate-100 print:text-black">
          <div className="flex items-center gap-2 font-bold text-amber-400 uppercase">
            <AlertTriangle className="w-4 h-4" />
            <span>MANDATORY LEGAL & ETHICAL DISCLAIMER</span>
          </div>
          <p>
            AI-generated candidate matches are probabilistic visual similarity assessments and <span className="underline font-bold">do not establish identity</span>. This software report is intended solely as an intelligence aid for authorized investigators. Final identification requires independent human verification and corroborating forensic evidence.
          </p>
        </div>
      </div>
    </div>
  );
};
