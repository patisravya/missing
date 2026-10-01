import React, { useState } from 'react';
import { FileText, Download, Printer, FileSpreadsheet, Code } from 'lucide-react';
import { ReportPreview } from '../components/ReportPreview';
import { CaseItem } from '../types';

interface ReportsPageProps {
  cases: CaseItem[];
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ cases }) => {
  const [selectedCaseId, setSelectedCaseId] = useState<number>(cases[0]?.id || 1);
  const selectedCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 font-mono tracking-tight">
            Investigation Report Generator
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Export compliant PDF, CSV, and JSON case documentation with mandatory legal disclaimers
          </p>
        </div>

        {/* Case Selector Dropdown */}
        <div className="flex items-center gap-2 bg-[#121824] border border-[#1e293b] px-3 py-1.5 rounded-xl">
          <span className="text-xs font-mono text-slate-400">Select Case:</span>
          <select
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(Number(e.target.value))}
            className="bg-[#161b22] text-cyan-400 font-mono text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none border border-slate-800"
          >
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.case_number} — {c.case_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Render Selected Case Report Preview */}
      {selectedCase && <ReportPreview caseData={selectedCase} />}
    </div>
  );
};
