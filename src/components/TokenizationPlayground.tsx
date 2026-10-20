import React, { useState, useMemo } from 'react';
import { 
  tokenizeText, 
  generateDataLoaderBatches, 
  simulateBPETraining 
} from '../services/tokenizerEngine';
import { SAMPLE_TEXTS } from '../data/chaptersData';
import { Hash, Sparkles, Layers, Sliders, ArrowRight, Code } from 'lucide-react';

export const TokenizationPlayground: React.FC = () => {
  const [inputText, setInputText] = useState<string>(SAMPLE_TEXTS.theVerdict);
  const [contextSize, setContextSize] = useState<number>(4);
  const [stride, setStride] = useState<number>(1);
  const [activeSubTab, setActiveSubTab] = useState<'tokens' | 'dataloader' | 'bpe-algorithm'>('tokens');

  const tokens = useMemo(() => tokenizeText(inputText), [inputText]);
  const dataBatches = useMemo(
    () => generateDataLoaderBatches(tokens, contextSize, stride),
    [tokens, contextSize, stride]
  );
  const bpeSteps = useMemo(() => {
    const words = inputText.split(/\s+/).filter(w => w.length > 2).slice(0, 8);
    return simulateBPETraining(words, 4);
  }, [inputText]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-full">
                Chapter 2: Working with Text Data
              </span>
              <span className="text-xs text-slate-400">tiktoken & GPT-2 Vocabulary</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Interactive Tokenization & DataLoader Workbench
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              LLMs cannot read raw characters directly. Learn how raw strings are broken into subword tokens using Byte-Pair Encoding (BPE), mapped to unique IDs, and formatted into sliding-window training tensors.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setInputText(SAMPLE_TEXTS.theVerdict)}
              className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors"
            >
              The Verdict (Book Sample)
            </button>
            <button
              onClick={() => setInputText(SAMPLE_TEXTS.shortSample)}
              className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors"
            >
              Short Intuition Text
            </button>
          </div>
        </div>
      </div>

      {/* Input Text Area */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Input Text to Tokenize
          </label>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>Characters: <strong className="text-slate-200">{inputText.length}</strong></span>
            <span>Tokens: <strong className="text-blue-400">{tokens.length}</strong></span>
            <span>Avg chars/token: <strong className="text-slate-200">{(inputText.length / (tokens.length || 1)).toFixed(1)}</strong></span>
          </div>
        </div>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={3}
          className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
          placeholder="Type or paste any text to inspect tokenization in real time..."
        />
      </div>

      {/* Sub-tab navigation */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveSubTab('tokens')}
          className={`pb-3 px-4 text-sm font-medium border-b-2 transition-all ${
            activeSubTab === 'tokens'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Token Breakdown ({tokens.length})
        </button>
        <button
          onClick={() => setActiveSubTab('dataloader')}
          className={`pb-3 px-4 text-sm font-medium border-b-2 transition-all ${
            activeSubTab === 'dataloader'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Sliding Window DataLoader
        </button>
        <button
          onClick={() => setActiveSubTab('bpe-algorithm')}
          className={`pb-3 px-4 text-sm font-medium border-b-2 transition-all ${
            activeSubTab === 'bpe-algorithm'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          BPE Pair Merge Algorithm
        </button>
      </div>

      {/* View 1: Token Breakdown */}
      {activeSubTab === 'tokens' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Hash className="w-4 h-4 text-blue-400" />
              Interactive Token Stream (Hover or Click to Inspect)
            </h3>
            <div className="flex flex-wrap gap-2 leading-relaxed p-4 bg-slate-950 rounded-xl border border-slate-800/80">
              {tokens.map((item, index) => (
                <div
                  key={index}
                  className={`inline-flex flex-col items-center px-2 py-1 rounded-md border text-xs font-mono transition-transform hover:scale-105 cursor-pointer ${item.color}`}
                  title={`Token ID: ${item.id} | Bytes: [${item.bytes?.join(', ')}]`}
                >
                  <span className="font-semibold">{item.token === ' ' ? '␣' : item.token}</span>
                  <span className="text-[10px] opacity-75">#{item.id}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 mt-3">
              Tip: Notice how spaces are encoded as part of the following word (e.g. <span className="font-mono text-slate-300">" token"</span> vs <span className="font-mono text-slate-300">"token"</span>). This preserves exact spacing when reconstructing text.
            </p>
          </div>

          {/* Token Details Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 overflow-hidden">
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
              First 15 Token Encodings
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2 px-3">Position</th>
                    <th className="py-2 px-3">Token String</th>
                    <th className="py-2 px-3">Token ID</th>
                    <th className="py-2 px-3">UTF-8 Bytes</th>
                    <th className="py-2 px-3">Embedding Lookup Shape</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {tokens.slice(0, 15).map((tok, i) => (
                    <tr key={i} className="hover:bg-slate-800/40">
                      <td className="py-2 px-3 text-slate-500">{i}</td>
                      <td className="py-2 px-3 text-amber-300 font-bold">
                        "{tok.token === ' ' ? ' ' : tok.token}"
                      </td>
                      <td className="py-2 px-3 text-blue-400 font-bold">{tok.id}</td>
                      <td className="py-2 px-3 text-slate-300">
                        [{tok.bytes?.join(', ')}]
                      </td>
                      <td className="py-2 px-3 text-emerald-400">
                        W_embed[{tok.id}] → [768]
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* View 2: DataLoader Sliding Window */}
      {activeSubTab === 'dataloader' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-indigo-400" />
                  Sliding Window Next-Token Training Pairs
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  How Chapter 2 creates PyTorch training batches: Target <span className="font-mono text-emerald-400">y</span> is shifted exactly by 1 position relative to input <span className="font-mono text-blue-400">x</span>.
                </p>
              </div>

              {/* Sliders */}
              <div className="flex items-center gap-6 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-blue-400" />
                  <label className="text-xs text-slate-300">
                    Context Size: <strong className="text-white">{contextSize}</strong>
                  </label>
                  <input
                    type="range"
                    min={2}
                    max={8}
                    value={contextSize}
                    onChange={(e) => setContextSize(Number(e.target.value))}
                    className="w-20 accent-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs text-slate-300">
                    Stride: <strong className="text-white">{stride}</strong>
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={4}
                    value={stride}
                    onChange={(e) => setStride(Number(e.target.value))}
                    className="w-20 accent-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Generated Batches */}
            <div className="space-y-3">
              {dataBatches.length === 0 ? (
                <p className="text-sm text-slate-400 italic">
                  Input text too short for context size {contextSize}. Add more text above.
                </p>
              ) : (
                dataBatches.map((batch) => (
                  <div 
                    key={batch.step} 
                    className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400 min-w-16">
                      <span className="px-2 py-1 bg-slate-800 rounded font-semibold text-slate-200">
                        Step {batch.step}
                      </span>
                    </div>

                    {/* Input x */}
                    <div className="flex-1">
                      <div className="text-[11px] font-semibold text-blue-400 uppercase tracking-wider mb-1">
                        Input x (context): [{batch.inputIds.join(', ')}]
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {batch.inputTokens.map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 text-xs font-mono bg-blue-950/60 border border-blue-800/80 text-blue-200 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <ArrowRight className="w-5 h-5 text-slate-600 hidden md:block shrink-0" />

                    {/* Target y */}
                    <div className="flex-1">
                      <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                        Target y (next tokens): [{batch.targetIds.join(', ')}]
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {batch.targetTokens.map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 text-xs font-mono bg-emerald-950/60 border border-emerald-800/80 text-emerald-200 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* View 3: BPE Pair Merge Algorithm */}
      {activeSubTab === 'bpe-algorithm' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Code className="w-5 h-5 text-amber-400" />
              Byte-Pair Encoding (BPE) Iterative Pair Merging
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              As demonstrated in <span className="font-mono text-amber-300">ch02/05_bpe-from-scratch/</span>: BPE counts all adjacent character pairs across vocabulary words and iteratively replaces the most frequent pair with a merged symbol.
            </p>
          </div>

          <div className="space-y-4">
            {bpeSteps.map((step) => (
              <div key={step.iteration} className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                    Iteration {step.iteration}: Merge Pair
                  </span>
                  <span className="text-xs text-slate-400">
                    Frequency in corpus: <strong className="text-white">{step.frequency}</strong> times
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm font-mono my-2">
                  <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-200 rounded">
                    '{step.bestPair[0]}' + '{step.bestPair[1]}'
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                  <span className="px-2.5 py-1 bg-amber-950/60 border border-amber-600/60 text-amber-300 rounded font-bold">
                    '{step.newVocabularyEntry}'
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  Resulting sample token splits:
                  <div className="flex flex-wrap gap-2 mt-1">
                    {step.resultingTokens.slice(0, 5).map((tokList, idx) => (
                      <span key={idx} className="bg-slate-900 px-2 py-0.5 rounded text-slate-300 border border-slate-800 font-mono">
                        [{tokList.map(t => `'${t}'`).join(', ')}]
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
