import React, { useState, useMemo } from 'react';
import { computeMultiHeadAttention } from '../services/attentionEngine';
import { Eye, HelpCircle, Layers, ShieldAlert, Sparkles } from 'lucide-react';

export const AttentionVisualizer: React.FC = () => {
  const [inputText, setInputText] = useState<string>("The animal didn't cross the street because it was tired");
  const [selectedTokensCount, setSelectedTokensCount] = useState<number>(7);
  const [numHeads, setNumHeads] = useState<number>(4);
  const [causal, setCausal] = useState<boolean>(true);
  const [activeHead, setActiveHead] = useState<number>(0);
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

  // Extract clean tokens
  const tokens = useMemo(() => {
    return inputText
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, selectedTokensCount);
  }, [inputText, selectedTokensCount]);

  const attentionData = useMemo(() => {
    if (tokens.length === 0) return null;
    return computeMultiHeadAttention(tokens, numHeads, causal);
  }, [tokens, numHeads, causal]);

  const activeMatrix = attentionData?.heads[activeHead]?.matrix || [];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full">
                Chapter 3: Coding Attention Mechanisms
              </span>
              <span className="text-xs text-slate-400">Scaled Dot-Product & Causal MHA</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Interactive Multi-Head Self-Attention Heatmap
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Self-attention allows tokens to contextualize their meaning by attending to relevant previous words. Test causal masking to see how future tokens are masked with <span className="font-mono text-rose-400">-\infty</span> so autoregressive GPT models cannot peek ahead.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setInputText("The animal didn't cross the street because it was tired")}
              className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors"
            >
              Classic 'It' Coreference
            </button>
            <button
              onClick={() => setInputText("Jack Gisburn had always thought rather a cheap genius")}
              className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors"
            >
              The Verdict Sentence
            </button>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 block">
              Sentence Tokens ({tokens.length} words)
            </label>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 block">
              Max Tokens to Render: <span className="text-indigo-400 font-bold">{selectedTokensCount}</span>
            </label>
            <input
              type="range"
              min={3}
              max={10}
              value={selectedTokensCount}
              onChange={(e) => setSelectedTokensCount(Number(e.target.value))}
              className="w-full accent-indigo-500 mt-2"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 block">
              Attention Masking
            </label>
            <button
              onClick={() => setCausal(!causal)}
              className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                causal
                  ? 'bg-indigo-950/60 border-indigo-500/50 text-indigo-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              {causal ? <ShieldAlert className="w-4 h-4 text-indigo-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
              {causal ? 'Causal Masking (GPT): ON' : 'Bidirectional (BERT): ON'}
            </button>
          </div>
        </div>
      </div>

      {/* Head Selector & Formula */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Select Attention Head:
          </span>
          <div className="flex gap-1.5">
            {Array.from({ length: numHeads }).map((_, h) => (
              <button
                key={h}
                onClick={() => setActiveHead(h)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeHead === h
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Head {h + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="font-mono text-xs text-indigo-300 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          Attention(Q, K, V) = softmax(Q·Kᵀ / √d_k {causal ? '+ M_causal' : ''}) · V
        </div>
      </div>

      {/* Interactive Matrix Heatmap */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            Attention Weight Matrix α (Head {activeHead + 1} of {numHeads})
          </h3>
          {hoveredCell && (
            <div className="text-xs font-mono bg-indigo-950 text-indigo-200 border border-indigo-700/60 px-3 py-1 rounded-md">
              Query: <strong className="text-white">"{tokens[hoveredCell.row]}"</strong> attends to Key: <strong className="text-white">"{tokens[hoveredCell.col]}"</strong> → weight: <strong className="text-amber-400">{(activeMatrix[hoveredCell.row]?.[hoveredCell.col] * 100 || 0).toFixed(1)}%</strong>
            </div>
          )}
        </div>

        <div className="overflow-x-auto p-4 bg-slate-950 rounded-xl border border-slate-800/80">
          <div className="inline-block min-w-full">
            {/* Table Header: Key Tokens */}
            <div className="flex items-center pb-2 border-b border-slate-800 text-xs font-mono">
              <div className="w-28 shrink-0 text-slate-500 font-bold text-right pr-4">
                Query \ Key →
              </div>
              {tokens.map((token, j) => (
                <div 
                  key={j} 
                  className={`flex-1 text-center font-semibold px-1 py-1 truncate min-w-[70px] ${
                    hoveredCell?.col === j ? 'text-amber-400 bg-amber-500/10 rounded' : 'text-slate-300'
                  }`}
                  title={token}
                >
                  {token}
                </div>
              ))}
            </div>

            {/* Matrix Rows: Query Tokens */}
            {tokens.map((qToken, i) => (
              <div key={i} className="flex items-center py-1.5 border-b border-slate-900 text-xs font-mono">
                {/* Query Token Label */}
                <div 
                  className={`w-28 shrink-0 text-right pr-4 font-semibold truncate ${
                    hoveredCell?.row === i ? 'text-blue-400 font-bold' : 'text-slate-300'
                  }`}
                  title={qToken}
                >
                  {qToken}
                </div>

                {/* Cells */}
                {tokens.map((kToken, j) => {
                  const weight = activeMatrix[i]?.[j] || 0;
                  const isMasked = causal && j > i;
                  const isHovered = hoveredCell?.row === i && hoveredCell?.col === j;

                  // Compute background intensity
                  const opacity = isMasked ? 0 : Math.min(1, Math.max(0.08, weight * 1.5));
                  const bgStyle = isMasked 
                    ? { backgroundColor: '#1e293b' }
                    : { backgroundColor: `rgba(99, 102, 241, ${opacity})` };

                  return (
                    <div
                      key={j}
                      onMouseEnter={() => setHoveredCell({ row: i, col: j })}
                      onMouseLeave={() => setHoveredCell(null)}
                      style={bgStyle}
                      className={`flex-1 h-12 flex flex-col items-center justify-center m-0.5 rounded cursor-pointer transition-all border ${
                        isHovered 
                          ? 'border-amber-400 scale-105 z-10 shadow-lg' 
                          : isMasked 
                            ? 'border-slate-800 opacity-40' 
                            : 'border-indigo-900/40'
                      }`}
                    >
                      {isMasked ? (
                        <span className="text-[10px] text-slate-500 font-mono">-∞ (0.00)</span>
                      ) : (
                        <>
                          <span className={`text-xs font-bold ${weight > 0.3 ? 'text-white' : 'text-slate-200'}`}>
                            {weight.toFixed(2)}
                          </span>
                          <span className="text-[9px] text-indigo-200 opacity-80">
                            {(weight * 100).toFixed(0)}%
                          </span>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 mt-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-indigo-600 inline-block"></span>
              <span>High Attention</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-indigo-950 inline-block border border-indigo-800"></span>
              <span>Low Attention</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-slate-800 inline-block border border-slate-700"></span>
              <span>Causal Mask (-∞)</span>
            </div>
          </div>
          <span className="italic">Note: Every row in the unmasked section sums to exactly 1.0 (100%) due to Softmax.</span>
        </div>
      </div>
    </div>
  );
};
