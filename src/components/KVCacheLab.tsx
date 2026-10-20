import React, { useState, useMemo } from 'react';
import { estimateKVCacheMemory, KVCacheMetrics } from '../services/kvCacheEngine';
import { Zap, Database, Sliders, CheckCircle2, TrendingDown, Cpu } from 'lucide-react';

export const KVCacheLab: React.FC = () => {
  const [contextLength, setContextLength] = useState<number>(4096);
  const [batchSize, setBatchSize] = useState<number>(1);
  const [nLayers, setNLayers] = useState<number>(32);
  const [nHeads, setNHeads] = useState<number>(32);
  const [dHead, setDHead] = useState<number>(128);
  const [precisionBytes, setPrecisionBytes] = useState<number>(2); // 2 = fp16 / bf16

  const metrics: KVCacheMetrics = useMemo(() => ({
    contextLength,
    batchSize,
    nLayers,
    nHeads,
    dHead,
    precisionBytes,
  }), [contextLength, batchSize, nLayers, nHeads, dHead, precisionBytes]);

  const estimates = useMemo(() => estimateKVCacheMemory(metrics), [metrics]);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full">
                Chapter 4 Advanced: KV-Cache & Modern Attention Architectures
              </span>
              <span className="text-xs text-slate-400">ch04/03 to ch04/10</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              KV-Cache Memory Estimator & Architecture Benchmarks
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Without a Key-Value cache, autoregressive generation recomputes all past tokens at every step ($O(T^2)$ computational complexity). While KV caching makes generation $O(1)$ per step, it incurs heavy VRAM memory overhead. Compare MHA, GQA, MLA, SWA, and KV sharing below.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setContextLength(2048);
                setBatchSize(1);
                setNLayers(12);
                setNHeads(12);
                setDHead(64);
              }}
              className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors"
            >
              GPT-2 Small Preset
            </button>
            <button
              onClick={() => {
                setContextLength(8192);
                setBatchSize(4);
                setNLayers(32);
                setNHeads(32);
                setDHead(128);
              }}
              className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors"
            >
              Llama 3 / Qwen Preset
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          Model & Inference Hyperparameters
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Context Length */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300">Context Length:</span>
              <span className="font-mono font-bold text-cyan-400">{contextLength.toLocaleString()} tokens</span>
            </div>
            <input
              type="range"
              min={512}
              max={32768}
              step={512}
              value={contextLength}
              onChange={(e) => setContextLength(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>

          {/* Batch Size */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300">Batch Size:</span>
              <span className="font-mono font-bold text-cyan-400">{batchSize} sequences</span>
            </div>
            <input
              type="range"
              min={1}
              max={16}
              value={batchSize}
              onChange={(e) => setBatchSize(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>

          {/* Precision */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300">Precision (Bytes/Element):</span>
              <span className="font-mono font-bold text-cyan-400">
                {precisionBytes === 4 ? 'FP32 (4 bytes)' : precisionBytes === 2 ? 'FP16 / BF16 (2 bytes)' : 'INT8 (1 byte)'}
              </span>
            </div>
            <div className="flex gap-2">
              {[
                { label: 'FP32', val: 4 },
                { label: 'FP16 / BF16', val: 2 },
                { label: 'INT8', val: 1 }
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => setPrecisionBytes(opt.val)}
                  className={`flex-1 py-1 px-2 rounded-lg text-xs font-mono font-semibold transition-all ${
                    precisionBytes === opt.val
                      ? 'bg-cyan-600 text-white'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Layers */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300">Transformer Layers:</span>
              <span className="font-mono font-bold text-white">{nLayers}</span>
            </div>
            <input
              type="range"
              min={6}
              max={64}
              step={2}
              value={nLayers}
              onChange={(e) => setNLayers(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>

          {/* Heads */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300">Attention Heads (Query):</span>
              <span className="font-mono font-bold text-white">{nHeads}</span>
            </div>
            <input
              type="range"
              min={4}
              max={64}
              step={4}
              value={nHeads}
              onChange={(e) => setNHeads(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>

          {/* Head Dimension */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-300">Head Dimension (d_head):</span>
              <span className="font-mono font-bold text-white">{dHead}</span>
            </div>
            <input
              type="range"
              min={32}
              max={256}
              step={32}
              value={dHead}
              onChange={(e) => setDHead(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Memory Comparison Table & Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              KV Cache Memory Footprint by Technique
            </span>
            <span className="text-xs font-mono text-slate-400">
              Formula: 2 × B × L × H_kv × S × D × Bytes
            </span>
          </h3>

          <div className="space-y-4">
            {estimates.map((est, i) => {
              const maxMB = Math.max(...estimates.map(e => e.cacheMemoryMB), 1);
              const barWidth = Math.max(8, (est.cacheMemoryMB / maxMB) * 100);

              return (
                <div key={i} className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                    <span className="text-sm font-bold text-white flex items-center gap-2">
                      {est.technique}
                      {est.bandwidthReductionPercent > 0 && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          -{est.bandwidthReductionPercent}% VRAM
                        </span>
                      )}
                    </span>
                    <span className="text-base font-mono font-bold text-cyan-400">
                      {est.cacheMemoryMB >= 1024 
                        ? `${(est.cacheMemoryMB / 1024).toFixed(2)} GB` 
                        : `${est.cacheMemoryMB.toFixed(1)} MB`}
                    </span>
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden my-2 border border-slate-800">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        i === 0 
                          ? 'bg-rose-500' 
                          : i === 1 
                            ? 'bg-blue-500' 
                            : i === 2 
                              ? 'bg-emerald-500' 
                              : 'bg-indigo-500'
                      }`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>

                  <p className="text-xs text-slate-400 mt-1">
                    {est.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Intuition Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              KV-Cache Computational Speedup
            </h3>
            
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs leading-relaxed text-slate-300">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">Without KV-Cache:</strong> Step 100 generates Q, K, V for all 100 tokens. Step 101 generates Q, K, V for all 101 tokens. Complexity is <strong>quadratic O(N²)</strong>.
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">With KV-Cache:</strong> The previous 100 Keys and Values are kept in GPU memory. The model only computes <strong>1 query, 1 key, 1 value</strong> for the newest token! Complexity drops to <strong>O(1) per step</strong>.
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2">
              <div className="font-semibold text-slate-200 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-400" />
                Repository Implementation Reference
              </div>
              <ul className="list-disc pl-4 space-y-1 text-slate-400 font-mono text-[11px]">
                <li>ch04/03_kv-cache/gpt_with_kv_cache.py</li>
                <li>ch04/04_gqa/gpt_with_kv_gqa.py</li>
                <li>ch04/05_mla/gpt_with_kv_mla.py</li>
                <li>ch04/06_swa/gpt_with_kv_swa.py</li>
                <li>ch04/10_kv-sharing/gpt_with_kv_sharing.py</li>
              </ul>
            </div>
          </div>

          <div className="p-4 bg-emerald-950/30 border border-emerald-800/40 rounded-xl text-xs text-emerald-200">
            <strong>Key Takeaway:</strong> GQA (used by Llama 3 and Mistral) slashes cache memory by 75% with virtually zero loss in generation quality!
          </div>
        </div>
      </div>
    </div>
  );
};
