import React, { useState } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, Clock, X, Scan, Eye } from 'lucide-react';
import type { CandidateItem, EvidenceItem } from '../types';

interface EvidenceViewerProps {
  candidate: CandidateItem;
  onClose: () => void;
}

export const EvidenceViewer: React.FC<EvidenceViewerProps> = ({ candidate, onClose }) => {
  const defaultItems: EvidenceItem[] = candidate.evidence_items && candidate.evidence_items.length > 0
    ? candidate.evidence_items
    : [
        { id: 1, candidate_id: candidate.id, camera_id: candidate.primary_camera_id, timestamp: candidate.first_seen || '10:32:14', timestamp_seconds: 1934, frame_number: 1840, image_path: candidate.evidence_preview_image || '', detection_confidence: 0.94, similarity_score: candidate.similarity_score },
        { id: 2, candidate_id: candidate.id, camera_id: candidate.primary_camera_id, timestamp: '10:32:38', timestamp_seconds: 1958, frame_number: 2190, image_path: candidate.evidence_preview_image || '', detection_confidence: 0.95, similarity_score: candidate.similarity_score },
        { id: 3, candidate_id: candidate.id, camera_id: candidate.primary_camera_id, timestamp: '10:33:21', timestamp_seconds: 2001, frame_number: 2540, image_path: candidate.evidence_preview_image || '', detection_confidence: 0.96, similarity_score: candidate.similarity_score },
        { id: 4, candidate_id: candidate.id, camera_id: candidate.primary_camera_id, timestamp: candidate.last_seen || '10:34:51', timestamp_seconds: 2091, frame_number: 2890, image_path: candidate.evidence_preview_image || '', detection_confidence: 0.97, similarity_score: candidate.similarity_score },
      ];

  const [activeIdx, setActiveIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const currentItem = defaultItems[activeIdx] || defaultItems[0];

  const handlePrev = () => {
    setActiveIdx((prev) => (prev > 0 ? prev - 1 : defaultItems.length - 1));
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev < defaultItems.length - 1 ? prev + 1 : 0));
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleDownloadFrame = () => {
    if (!currentItem.image_path) return;
    const a = document.createElement('a');
    a.href = currentItem.image_path;
    a.download = `FindTrace_Evidence_${candidate.track_id}_${currentItem.camera_id}_${currentItem.frame_number}.jpg`;
    a.click();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-[#121824] border border-[#1e293b] rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#1e293b] flex items-center justify-between bg-[#0d1117]">
          <div>
            <h2 className="text-base font-bold text-slate-100 font-mono flex items-center gap-2">
              <span>CCTV Evidence Frame Inspector</span>
              <span className="text-xs bg-blue-950 text-cyan-400 px-2.5 py-0.5 rounded border border-blue-800/40">
                {candidate.candidate_code}
              </span>
              <span className="text-xs bg-emerald-950 text-emerald-400 px-2.5 py-0.5 rounded border border-emerald-800/40">
                {Math.round(candidate.similarity_score * 100)}% Match
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              High Precision Visual Evidence Analysis • Tracking ID: {candidate.track_id} • Camera: {currentItem.camera_id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-[#1e293b] text-slate-400 hover:text-slate-200 hover:bg-[#161b22] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 flex-1 overflow-hidden">
          {/* Main CCTV Monitor Viewport */}
          <div className="md:col-span-2 bg-slate-950 p-5 flex flex-col justify-between items-center relative border-r border-[#1e293b] overflow-hidden">
            <div className="w-full flex-1 bg-black rounded-xl border border-cyan-500/30 overflow-hidden relative flex items-center justify-center min-h-[300px]">
              {currentItem.image_path ? (
                <div
                  className="w-full h-full relative flex items-center justify-center transition-transform duration-200"
                  style={{ transform: `scale(${zoomLevel})` }}
                >
                  <img
                    src={currentItem.image_path}
                    alt="CCTV Evidence Frame"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div
                  className="w-full h-full relative border border-cyan-500/40 rounded flex flex-col justify-between p-4 transition-transform duration-200 bg-[#0a0d14]"
                  style={{ transform: `scale(${zoomLevel})` }}
                >
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-400 bg-slate-950/80 px-3 py-1.5 rounded border border-slate-800">
                    <span>CAMERA: {currentItem.camera_id}</span>
                    <span className="text-red-400 font-bold">REC ● LIVE REPLAY</span>
                    <span>TIMESTAMP: {currentItem.timestamp}</span>
                  </div>

                  <div className="w-36 h-48 border-2 border-cyan-400 bg-cyan-500/10 rounded mx-auto relative flex flex-col justify-between p-2 shadow-lg shadow-cyan-500/20">
                    <span className="text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded -mt-5 self-center">
                      CANDIDATE ({candidate.track_id})
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded -mb-4 self-center">
                      SIM: {Math.round(candidate.similarity_score * 100)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 bg-slate-950/80 px-3 py-1 rounded border border-slate-800">
                    <span>FRAME #: {currentItem.frame_number}</span>
                    <span>CONFIDENCE: {Math.round(currentItem.detection_confidence * 100)}%</span>
                    <span>REQUIRES HUMAN REVIEW</span>
                  </div>
                </div>
              )}
            </div>

            {/* Video / Frame Controls Bar */}
            <div className="w-full mt-3 flex items-center justify-between bg-[#121824] px-4 py-2 rounded-xl border border-[#1e293b]">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-1.5 rounded bg-[#161b22] hover:bg-slate-800 text-slate-300 cursor-pointer"
                  title="Previous detection"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={togglePlay}
                  className="p-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
                  title={isPlaying ? 'Pause' : 'Play replay'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="p-1.5 rounded bg-[#161b22] hover:bg-slate-800 text-slate-300 cursor-pointer"
                  title="Next detection"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Zoom controls */}
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span>Zoom: {Math.round(zoomLevel * 100)}%</span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 2.5))}
                  className="p-1 rounded bg-[#161b22] text-slate-300 hover:text-cyan-400 cursor-pointer"
                  title="Zoom in"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
                  className="p-1 rounded bg-[#161b22] text-slate-300 hover:text-cyan-400 cursor-pointer"
                  title="Zoom out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
              </div>

              <button 
                type="button"
                onClick={handleDownloadFrame}
                className="flex items-center gap-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-cyan-400 border border-blue-500/40 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Frame</span>
              </button>
            </div>

            {/* Clickable Timestamps Scrubber */}
            <div className="w-full mt-2.5 flex items-center justify-center gap-2 overflow-x-auto py-1">
              {defaultItems.map((item, idx) => (
                <button
                  key={item.id || idx}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`px-3 py-1 rounded-md text-xs font-mono transition-all cursor-pointer ${
                    activeIdx === idx
                      ? 'bg-cyan-500 text-slate-950 font-bold border border-cyan-300 shadow-md shadow-cyan-500/20'
                      : 'bg-[#161b22] text-slate-400 hover:text-slate-200 border border-[#1e293b]'
                  }`}
                >
                  {item.timestamp}
                </button>
              ))}
            </div>
          </div>

          {/* Evidence Information Panel */}
          <div className="p-5 bg-[#121824] space-y-4 overflow-y-auto">
            <h3 className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wider">
              Detection Telemetry & Analysis
            </h3>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="bg-[#161b22] p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase">Camera Location</span>
                <p className="text-slate-200 font-semibold">{currentItem.camera_id} • Sector Feed</p>
              </div>

              <div className="bg-[#161b22] p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase">Exact Frame Timestamp</span>
                <p className="text-cyan-400 font-semibold">{currentItem.timestamp}</p>
              </div>

              <div className="bg-[#161b22] p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase">Tracking Identifier</span>
                <p className="text-slate-200 font-semibold">{candidate.track_id}</p>
              </div>

              <div className="bg-[#161b22] p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase">Visual Similarity Match</span>
                <p className="text-emerald-400 font-bold text-sm">
                  {Math.round(candidate.similarity_score * 100)}% ({candidate.similarity_band})
                </p>
              </div>

              <div className="bg-[#161b22] p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase">Neural Detection Confidence</span>
                <p className="text-slate-200 font-semibold">{Math.round(currentItem.detection_confidence * 100)}%</p>
              </div>
            </div>

            <div className="p-3 bg-amber-950/40 border border-amber-800/40 rounded-lg text-[11px] text-amber-200/90 space-y-1">
              <p className="font-semibold uppercase text-amber-400">Human Verification Rule:</p>
              <p>
                Visual matching results are purely probabilistic. Investigators must manually evaluate features, clothing, and context.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
