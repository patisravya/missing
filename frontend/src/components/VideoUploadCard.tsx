import React, { useState, useRef } from 'react';
import { 
  Film, 
  Trash2, 
  Plus, 
  MoveUp, 
  MoveDown, 
  Camera, 
  MapPin, 
  CheckCircle2, 
  UploadCloud, 
  Play, 
  Pause, 
  X, 
  Clock, 
  FileVideo, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import type { VideoItem } from '../types';

interface VideoUploadCardProps {
  videos: VideoItem[];
  setVideos: React.Dispatch<React.SetStateAction<VideoItem[]>>;
}

export const VideoUploadCard: React.FC<VideoUploadCardProps> = ({ videos, setVideos }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activePreviewUrl, setActivePreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>('');

  // Default demo video feeds generator
  const handleLoadDemoFeeds = () => {
    const demoFeeds: VideoItem[] = [
      {
        id: Date.now() + 1,
        camera_id: 'CCTV-01',
        camera_name: 'North Concourse Entry',
        camera_location: 'Gate 1A Upper Level',
        filename: 'cctv_ch01_north.mp4',
        duration: 300,
        file_size: 24000000,
        recording_date: '2026-09-29',
        recording_start_time: '10:30:00'
      },
      {
        id: Date.now() + 2,
        camera_id: 'CCTV-03',
        camera_name: 'Central Escalator South',
        camera_location: 'Level B Concourse',
        filename: 'cctv_ch03_escalator.mp4',
        duration: 450,
        file_size: 36000000,
        recording_date: '2026-09-29',
        recording_start_time: '10:31:00'
      },
      {
        id: Date.now() + 3,
        camera_id: 'CCTV-05',
        camera_name: 'West Exit Corridor',
        camera_location: 'Street Exit Gate 5',
        filename: 'cctv_ch05_west.mp4',
        duration: 300,
        file_size: 22000000,
        recording_date: '2026-09-29',
        recording_start_time: '10:35:00'
      },
    ];
    setVideos(demoFeeds);
  };

  const handleFilesSelected = (files: FileList | File[]) => {
    const newItems: VideoItem[] = [];

    Array.from(files).forEach((file, idx) => {
      const camNumber = videos.length + newItems.length + 1;
      const camId = `CCTV-${camNumber < 10 ? '0' + camNumber : camNumber}`;
      const objectUrl = URL.createObjectURL(file);

      // Create video element to measure duration
      const tempVideo = document.createElement('video');
      tempVideo.preload = 'metadata';
      tempVideo.src = objectUrl;

      const videoItem: VideoItem = {
        id: Date.now() + idx,
        camera_id: camId,
        camera_name: `Camera Feed ${camNumber}`,
        camera_location: `Investigative Sector ${camNumber}`,
        filename: file.name,
        duration: 300, // default fallback
        file_size: file.size,
        file: file,
        storage_path: objectUrl,
        recording_date: new Date().toISOString().split('T')[0],
        recording_start_time: '10:30:00'
      };

      tempVideo.onloadedmetadata = () => {
        if (tempVideo.duration && !isNaN(tempVideo.duration)) {
          videoItem.duration = Math.round(tempVideo.duration);
          setVideos(prev => [...prev]);
        }
      };

      newItems.push(videoItem);
    });

    if (newItems.length > 0) {
      setVideos(prev => [...prev, ...newItems]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesSelected(e.target.files);
    }
  };

  const handleRemove = (idx: number) => {
    setVideos(videos.filter((_, i) => i !== idx));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= videos.length) return;
    const copy = [...videos];
    const temp = copy[index];
    copy[index] = copy[newIdx];
    copy[newIdx] = temp;
    setVideos(copy);
  };

  const handleUpdateMetadata = (idx: number, field: keyof VideoItem, value: any) => {
    const copy = [...videos];
    copy[idx] = { ...copy[idx], [field]: value };
    setVideos(copy);
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '05:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '24.0 MB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      {/* Header with Title and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-mono font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <FileVideo className="w-4 h-4 text-cyan-400" />
            <span>2. Upload CCTV Surveillance Video Feeds</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Upload footage directly from your device (MP4, AVI, MOV, MKV, WebM) • Multi-camera streams
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLoadDemoFeeds}
            className="flex items-center gap-1.5 bg-[#161b22] hover:bg-[#1f2937] border border-[#1e293b] text-slate-300 hover:text-cyan-300 text-xs font-mono font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Load Sample Feeds</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-mono font-semibold px-4 py-1.5 rounded-lg shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Choose Files from Device</span>
          </button>
        </div>
      </div>

      {/* Hidden File Input for Device Video Uploads */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="video/mp4,video/avi,video/quicktime,video/x-matroska,video/webm,.mkv,.mp4,.mov,.avi"
        className="hidden"
        onChange={handleInputChange}
      />

      {/* Drag & Drop Device Video Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer group ${
          isDragging 
            ? 'border-cyan-400 bg-cyan-950/30' 
            : 'border-[#1e293b] hover:border-blue-500/60 bg-[#121824]/60 hover:bg-[#161b22]'
        }`}
      >
        <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center mx-auto text-cyan-400 group-hover:scale-110 transition-transform mb-3 shadow-lg">
          <UploadCloud className="w-7 h-7" />
        </div>
        <p className="text-sm font-semibold text-slate-200 font-mono">
          Drag & drop CCTV video files from your device, or <span className="text-cyan-400 underline decoration-cyan-500">browse device files</span>
        </p>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Supports single or batch CCTV video upload (MP4, AVI, MOV, MKV, WebM) • Up to 2GB per stream
        </p>
      </div>

      {/* Uploaded Videos List */}
      {videos.length > 0 ? (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
            <span>Configured CCTV Feeds ({videos.length})</span>
            <span>Drag / reorder camera timeline precedence</span>
          </div>

          {videos.map((vid, idx) => (
            <div
              key={vid.id || idx}
              className="bg-[#121824] border border-[#1e293b] hover:border-slate-700 rounded-xl p-4 transition-all space-y-3"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left: Video Details & Thumbnail */}
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-xl bg-[#0a0d14] border border-blue-500/30 flex items-center justify-center text-cyan-400 shrink-0 relative overflow-hidden group">
                    <Film className="w-6 h-6" />
                    {vid.storage_path && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActivePreviewUrl(vid.storage_path || '');
                          setPreviewTitle(`${vid.camera_id} — ${vid.filename}`);
                        }}
                        className="absolute inset-0 bg-blue-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                        title="Preview video"
                      >
                        <Play className="w-5 h-5 fill-current" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold bg-blue-950 text-cyan-400 px-2.5 py-0.5 rounded border border-blue-800/40">
                        {vid.camera_id}
                      </span>
                      <span className="text-sm font-semibold text-slate-100 font-mono truncate max-w-xs sm:max-w-md">
                        {vid.filename}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        Duration: {formatDuration(vid.duration)}
                      </span>
                      <span>•</span>
                      <span>Size: {formatFileSize(vid.file_size)}</span>
                      <span>•</span>
                      <span className="text-emerald-400 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Device Stream Ready
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Action Buttons */}
                <div className="flex items-center justify-between md:justify-end gap-2 border-t md:border-t-0 border-[#1e293b] pt-2 md:pt-0">
                  {vid.storage_path && (
                    <button
                      type="button"
                      onClick={() => {
                        setActivePreviewUrl(vid.storage_path || '');
                        setPreviewTitle(`${vid.camera_id} — ${vid.filename}`);
                      }}
                      className="flex items-center gap-1 text-xs font-mono bg-[#161b22] hover:bg-slate-800 border border-[#1e293b] text-cyan-400 px-2.5 py-1 rounded-lg cursor-pointer"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Play Feed</span>
                    </button>
                  )}

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMove(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 rounded bg-[#161b22] hover:bg-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-30 cursor-pointer"
                      title="Move feed up"
                    >
                      <MoveUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(idx, 'down')}
                      disabled={idx === videos.length - 1}
                      className="p-1.5 rounded bg-[#161b22] hover:bg-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-30 cursor-pointer"
                      title="Move feed down"
                    >
                      <MoveDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(idx)}
                      className="p-1.5 rounded bg-[#161b22] hover:bg-red-950/40 text-slate-400 hover:text-red-400 border border-transparent hover:border-red-800/40 cursor-pointer"
                      title="Remove video"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Editable Camera Metadata Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-[#1e293b]/60 text-xs font-mono">
                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-0.5">Camera ID / Label</label>
                  <input
                    type="text"
                    value={vid.camera_id}
                    onChange={(e) => handleUpdateMetadata(idx, 'camera_id', e.target.value)}
                    className="w-full bg-[#161b22] border border-[#1e293b] rounded px-2.5 py-1 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-0.5">Camera Name</label>
                  <input
                    type="text"
                    value={vid.camera_name || ''}
                    onChange={(e) => handleUpdateMetadata(idx, 'camera_name', e.target.value)}
                    placeholder="e.g. North Gate Entry"
                    className="w-full bg-[#161b22] border border-[#1e293b] rounded px-2.5 py-1 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 uppercase block mb-0.5">Camera Location</label>
                  <input
                    type="text"
                    value={vid.camera_location || ''}
                    onChange={(e) => handleUpdateMetadata(idx, 'camera_location', e.target.value)}
                    placeholder="e.g. Sector 1 Terminal B"
                    className="w-full bg-[#161b22] border border-[#1e293b] rounded px-2.5 py-1 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 bg-amber-950/30 border border-amber-500/30 rounded-xl flex items-center gap-2.5 text-xs text-amber-200 font-mono">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Please choose or drag at least one CCTV video feed from your device to proceed with person detection.</span>
        </div>
      )}

      {/* In-Browser CCTV Video Player Modal */}
      {activePreviewUrl && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#121824] border border-[#1e293b] rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl space-y-4 p-5 font-mono">
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Camera className="w-4 h-4 text-cyan-400" />
                <span>Footage Player: {previewTitle}</span>
              </h3>
              <button
                type="button"
                onClick={() => setActivePreviewUrl(null)}
                className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video bg-black rounded-xl overflow-hidden border border-cyan-500/30 flex items-center justify-center">
              <video
                src={activePreviewUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => setActivePreviewUrl(null)}
                className="px-4 py-1.5 rounded-lg bg-[#161b22] border border-[#1e293b] text-xs font-semibold text-slate-300 hover:bg-[#1f2937] cursor-pointer"
              >
                Close Player
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
