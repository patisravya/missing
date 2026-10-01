import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-amber-950/40 border-b border-amber-500/30 px-4 py-2 text-xs text-amber-200/90 flex items-center justify-between shadow-inner">
      <div className="flex items-center gap-2 max-w-5xl mx-auto">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
        <p>
          <strong className="text-amber-400 font-semibold uppercase tracking-wider mr-1">Mandatory AI Notice:</strong>
          Candidate matches represent probabilistic visual similarity scores only and <span className="underline decoration-amber-500">do not establish identity</span>. All candidate detections require strict human verification by authorized investigators.
        </p>
      </div>
    </div>
  );
};
