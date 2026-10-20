import React, { useState } from 'react';
import { classifyText } from '../services/classifierEngine';
import { SAMPLE_TEXTS } from '../data/chaptersData';
import { ClassificationResult } from '../types';
import { CheckSquare, ShieldCheck, AlertTriangle, Sparkles, Sliders, ThumbsUp, ThumbsDown } from 'lucide-react';

export const ClassificationPlayground: React.FC = () => {
  const [task, setTask] = useState<'spam' | 'sentiment'>('spam');
  const [inputText, setInputText] = useState<string>(SAMPLE_TEXTS.smsSpamSamples[0].text);
  const [result, setResult] = useState<ClassificationResult | null>(null);

  const handleClassify = () => {
    if (!inputText.trim()) return;
    const res = classifyText(inputText, { task });
    setResult(res);
  };

  const handleSelectSample = (sampleText: string) => {
    setInputText(sampleText);
    const res = classifyText(sampleText, { task });
    setResult(res);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-full">
                Chapter 6 User Interface: Finetuning for Text Classification
              </span>
              <span className="text-xs text-slate-400">ch06/04_user_interface/app.py</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Finetuned GPT-2 Text Classifier
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Port of the Chapter 6 Chainlit interface. In section 6.5, the 50,257-token language model head is replaced with a 2-class linear output layer (<span className="font-mono text-rose-300">nn.Linear(emb_dim, 2)</span>) and finetuned to classify text sequences.
            </p>
          </div>

          {/* Task Toggle */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => {
                setTask('spam');
                setInputText(SAMPLE_TEXTS.smsSpamSamples[0].text);
                setResult(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                task === 'spam'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              SMS Spam Detection
            </button>
            <button
              onClick={() => {
                setTask('sentiment');
                setInputText(SAMPLE_TEXTS.reviewSentimentSamples[0].text);
                setResult(null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                task === 'sentiment'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Movie Review Sentiment
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input text & Sample loader */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-rose-400" />
                Text to Classify
              </label>
              <span className="text-xs text-slate-400 font-mono">
                {task === 'spam' ? 'Task: Spam vs Ham' : 'Task: Positive vs Negative'}
              </span>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={4}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
              placeholder="Enter message to classify..."
            />

            <div className="flex items-center justify-between mt-4">
              <button
                onClick={handleClassify}
                disabled={!inputText.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Run Classification
              </button>

              <span className="text-xs text-slate-400">
                Uses last token hidden state representation
              </span>
            </div>
          </div>

          {/* Preset Test Samples */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Load Preset Benchmark Samples
            </h4>
            <div className="space-y-2">
              {(task === 'spam' ? SAMPLE_TEXTS.smsSpamSamples : SAMPLE_TEXTS.reviewSentimentSamples).map((sample, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectSample(sample.text)}
                  className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 hover:border-slate-700 cursor-pointer flex items-center justify-between gap-3 text-xs transition-colors group"
                >
                  <span className="text-slate-300 line-clamp-1 group-hover:text-white font-mono">
                    "{sample.text}"
                  </span>
                  <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] shrink-0 ${
                    sample.label === 'spam' || sample.label === 'negative'
                      ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60'
                      : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60'
                  }`}>
                    {sample.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Classification Result Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 min-h-[350px]">
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>Classification Result</span>
              {result && (
                <span className="text-[11px] font-mono text-slate-400">
                  Latency: {result.inferenceTimeMs}ms
                </span>
              )}
            </h3>

            {result ? (
              <div className="space-y-5">
                {/* Main Label Banner */}
                <div className={`p-5 rounded-xl border flex items-center justify-between ${
                  result.label.includes('SPAM') || result.label.includes('NEGATIVE')
                    ? 'bg-rose-950/50 border-rose-800/80 text-rose-200'
                    : 'bg-emerald-950/50 border-emerald-800/80 text-emerald-200'
                }`}>
                  <div className="flex items-center gap-3">
                    {result.label.includes('SPAM') || result.label.includes('NEGATIVE') ? (
                      <AlertTriangle className="w-8 h-8 text-rose-400 shrink-0" />
                    ) : (
                      <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
                    )}
                    <div>
                      <div className="text-[11px] uppercase tracking-wider font-semibold opacity-75">
                        Predicted Class
                      </div>
                      <div className="text-xl font-bold tracking-tight">
                        {result.label}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[11px] opacity-75">Confidence</div>
                    <div className="text-lg font-mono font-bold">
                      {(result.confidence * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Class Probabilities Bars */}
                <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Output Layer Softmax Distribution
                  </div>
                  {Object.entries(result.probabilities).map(([lbl, prob]) => (
                    <div key={lbl} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-300 font-bold">{lbl}</span>
                        <span className="text-white">{(prob * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            lbl.includes('SPAM') || lbl.includes('NEGATIVE')
                              ? 'bg-rose-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${prob * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Feature Attention Highlight */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Influential Token Highlighting
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs leading-relaxed font-mono">
                    {result.highlightedTokens.map((item, idx) => {
                      const isHigh = Math.abs(item.weight) >= 1.5;
                      return (
                        <span
                          key={idx}
                          className={`inline-block px-1 m-0.5 rounded ${
                            isHigh
                              ? item.weight > 0
                                ? 'bg-rose-900/70 text-rose-200 border border-rose-700/60 font-bold'
                                : 'bg-emerald-900/70 text-emerald-200 border border-emerald-700/60 font-bold'
                              : 'text-slate-300'
                          }`}
                        >
                          {item.token}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-center text-slate-500 text-xs space-y-2">
                <CheckSquare className="w-8 h-8 opacity-40" />
                <p>Click "Run Classification" or select a preset sample to inspect the model's decision.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
