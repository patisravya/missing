import React, { useState } from 'react';
import { Settings as SettingsIcon, Shield, Database, Lock, Trash2, Save, Cpu, CheckCircle } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [detConf, setDetConf] = useState(0.50);
  const [simThresh, setSimThresh] = useState(0.70);
  const [frameSamp, setFrameSamp] = useState(5);
  const [retentionDays, setRetentionDays] = useState(90);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("System Settings Updated Successfully!");
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-slate-100 font-mono tracking-tight">
          System Settings & Privacy Policy
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          Configure detection parameters, local storage abstraction, and data retention rules
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* AI Thresholds */}
        <div className="bg-[#121824] border border-[#1e293b] rounded-xl p-6 space-y-4">
          <h2 className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4" />
            <span>AI Model Default Parameters</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-[#161b22] p-4 rounded-xl border border-slate-800 space-y-2">
              <label className="text-slate-300 font-semibold block">Default Person Detection Confidence</label>
              <input
                type="range"
                min="0.20"
                max="0.90"
                step="0.05"
                value={detConf}
                onChange={(e) => setDetConf(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <span className="text-cyan-400 font-bold">{Math.round(detConf * 100)}%</span>
            </div>

            <div className="bg-[#161b22] p-4 rounded-xl border border-slate-800 space-y-2">
              <label className="text-slate-300 font-semibold block">Default Candidate Similarity Cutoff</label>
              <input
                type="range"
                min="0.40"
                max="0.95"
                step="0.05"
                value={simThresh}
                onChange={(e) => setSimThresh(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <span className="text-cyan-400 font-bold">{Math.round(simThresh * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Storage Abstraction Settings */}
        <div className="bg-[#121824] border border-[#1e293b] rounded-xl p-6 space-y-4">
          <h2 className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4" />
            <span>File Storage Abstraction</span>
          </h2>

          <div className="bg-[#161b22] p-4 rounded-xl border border-slate-800 space-y-3 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Active Storage Driver</span>
              <span className="text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
                Local Storage Driver
              </span>
            </div>
            <p className="text-slate-400 text-[11px]">
              Root Path: <code className="text-cyan-300">c:\missing\storage\</code>
            </p>
          </div>
        </div>

        {/* Privacy & Retention */}
        <div className="bg-[#121824] border border-[#1e293b] rounded-xl p-6 space-y-4">
          <h2 className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
            <Lock className="w-4 h-4" />
            <span>Privacy & Data Retention Compliance</span>
          </h2>

          <div className="bg-[#161b22] p-4 rounded-xl border border-slate-800 space-y-3 text-xs font-mono text-slate-300">
            <p>
              <strong>Authorization Requirement:</strong> "Only upload footage and photographs you are authorized to process."
            </p>
            <p>
              <strong>Biometric Data Lifecycle:</strong> Reference embeddings are kept in-memory for the active search session only.
            </p>

            <div className="pt-2 flex items-center justify-between">
              <span>Automatic Video Purge Retention:</span>
              <select
                value={retentionDays}
                onChange={(e) => setRetentionDays(Number(e.target.value))}
                className="bg-[#121824] border border-[#1e293b] text-cyan-400 rounded px-3 py-1"
              >
                <option value={30}>30 Days</option>
                <option value={90}>90 Days (Recommended)</option>
                <option value={180}>180 Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs px-5 py-2.5 rounded-lg shadow-lg cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save System Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
