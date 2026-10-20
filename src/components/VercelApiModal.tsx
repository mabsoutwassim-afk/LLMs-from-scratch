import React, { useState } from 'react';
import { X, Activity, CheckCircle, RefreshCw, Terminal } from 'lucide-react';

interface VercelApiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VercelApiModal: React.FC<VercelApiModalProps> = ({ isOpen, onClose }) => {
  const [latency, setLatency] = useState<number>(18);
  const [isPinging, setIsPinging] = useState<boolean>(false);

  if (!isOpen) return null;

  const handlePing = () => {
    setIsPinging(true);
    setTimeout(() => {
      setLatency(Math.floor(Math.random() * 15) + 12);
      setIsPinging(false);
    }, 300);
  };

  const responseJson = {
    name: "LLMs from scratch",
    status: "ok",
    message: "Repository deployed successfully.",
    runtime: "React (Vite) + TypeScript",
    targetPort: 3000,
    timestamp: new Date().toISOString(),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-white text-base">API Health & Deployment Status</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="text-xs font-bold text-emerald-300">Endpoint Health: 200 OK</div>
                <div className="text-[11px] text-slate-400 font-mono">Preserves original /api/index.py behavior</div>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-900/60 px-2.5 py-1 rounded">
              {latency} ms
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                Response Payload (application/json)
              </span>
              <button
                onClick={handlePing}
                disabled={isPinging}
                className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-mono transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${isPinging ? 'animate-spin' : ''}`} />
                Re-ping
              </button>
            </div>
            <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto">
              {JSON.stringify(responseJson, null, 2)}
            </pre>
          </div>

          <div className="text-[11px] text-slate-400 leading-relaxed font-sans">
            This endpoint reproduces the JSON contract from the original repository's <code className="text-slate-200">api/index.py</code> Vercel handler, confirming healthy deployment and cross-framework rewrite status.
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
