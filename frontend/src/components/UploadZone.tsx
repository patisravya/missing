import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, X, RefreshCw, Lock, CheckCircle2 } from 'lucide-react';

interface UploadZoneProps {
  referencePhoto: string | null;
  setReferencePhoto: (url: string | null) => void;
  caseDetails: {
    caseName: string;
    caseId: string;
    personName: string;
    age: string;
    gender: string;
    lastKnownLocation: string;
    lastSeenDate: string;
    additionalNotes: string;
  };
  setCaseDetails: React.Dispatch<React.SetStateAction<any>>;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  referencePhoto,
  setReferencePhoto,
  caseDetails,
  setCaseDetails,
}) => {
  const [fileInfo, setFileInfo] = useState<{ name: string; size: string } | null>(
    referencePhoto ? { name: 'reference_person_photo.jpg', size: '2.4 MB' } : null
  );

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setReferencePhoto(event.target?.result as string);
      setFileInfo({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setReferencePhoto(null);
    setFileInfo(null);
  };

  return (
    <div className="space-y-6">
      {/* Upload Box */}
      <div>
        <label className="block text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-2">
          1. Missing Person Reference Photo (JPG, PNG, WEBP)
        </label>

        {!referencePhoto ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
            className="border-2 border-dashed border-[#1e293b] hover:border-blue-500/60 bg-[#121824]/60 hover:bg-[#161b22] rounded-xl p-8 text-center transition-all cursor-pointer group"
          >
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              id="ref-photo-upload"
              onChange={handleFileInput}
            />
            <label htmlFor="ref-photo-upload" className="cursor-pointer space-y-3 block">
              <div className="w-14 h-14 rounded-full bg-blue-600/10 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-400 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">
                  Drag & drop reference photograph here, or <span className="text-cyan-400 underline">browse</span>
                </p>
                <p className="text-xs text-slate-500 font-mono mt-1">High resolution front-facing photo yields best results</p>
              </div>
            </label>
          </div>
        ) : (
          <div className="bg-[#121824] border border-[#1e293b] rounded-xl p-4 flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden border border-blue-500/40 relative bg-slate-900 shrink-0">
                <img src={referencePhoto} alt="Reference Person" className="w-full h-full object-cover" />
                <div className="absolute top-1 right-1 bg-emerald-500 text-slate-950 p-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-cyan-400" />
                  {fileInfo?.name}
                </p>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{fileInfo?.size} • Reference Feature Extract Ready</p>
                <span className="inline-block mt-2 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded">
                  Embedding Model Loaded
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label
                htmlFor="ref-photo-upload"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1e293b] text-xs font-semibold text-slate-300 hover:bg-[#161b22] hover:border-slate-700 transition-all cursor-pointer"
              >
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  id="ref-photo-upload"
                  onChange={handleFileInput}
                />
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                Replace
              </label>
              <button
                onClick={handleRemove}
                className="p-1.5 rounded-lg border border-[#1e293b] text-slate-400 hover:text-red-400 hover:border-red-900/40 hover:bg-red-950/20 transition-all cursor-pointer"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400 font-mono bg-[#161b22] px-3 py-1.5 rounded-md border border-[#1e293b]">
          <Lock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>Privacy Guarantee: Reference image will be used strictly for this isolated search session only.</span>
        </div>
      </div>

      {/* Case Details Form */}
      <div className="bg-[#121824] border border-[#1e293b] rounded-xl p-5 space-y-4">
        <h3 className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
          <span>Case Identification & Context (Optional)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Case Name *</label>
            <input
              type="text"
              value={caseDetails.caseName}
              onChange={(e) => setCaseDetails({ ...caseDetails, caseName: e.target.value })}
              placeholder="e.g. Central Station Trace #2026"
              className="w-full bg-[#161b22] border border-[#1e293b] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Subject Person Name (Optional)</label>
            <input
              type="text"
              value={caseDetails.personName}
              onChange={(e) => setCaseDetails({ ...caseDetails, personName: e.target.value })}
              placeholder="e.g. Alexander Vance"
              className="w-full bg-[#161b22] border border-[#1e293b] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Last Known Location</label>
            <input
              type="text"
              value={caseDetails.lastKnownLocation}
              onChange={(e) => setCaseDetails({ ...caseDetails, lastKnownLocation: e.target.value })}
              placeholder="e.g. Metro Transit Level B Platform"
              className="w-full bg-[#161b22] border border-[#1e293b] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Last Seen Date & Time</label>
            <input
              type="text"
              value={caseDetails.lastSeenDate}
              onChange={(e) => setCaseDetails({ ...caseDetails, lastSeenDate: e.target.value })}
              placeholder="e.g. 2026-09-29 18:45"
              className="w-full bg-[#161b22] border border-[#1e293b] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1">Investigator Appearance Notes</label>
          <textarea
            rows={2}
            value={caseDetails.additionalNotes}
            onChange={(e) => setCaseDetails({ ...caseDetails, additionalNotes: e.target.value })}
            placeholder="e.g. Blue jacket, dark denim, black backpack, approx height 180cm..."
            className="w-full bg-[#161b22] border border-[#1e293b] rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
};
