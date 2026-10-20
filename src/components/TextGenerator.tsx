import React, { useState, useRef } from 'react';
import { generateTextStream } from '../services/gptEngine';
import { GPT_MODEL_CONFIGS, SAMPLE_TEXTS } from '../data/chaptersData';
import { GenerationParams, GenerationStep } from '../types';
import { Sparkles, Play, RotateCcw, Sliders, Cpu, Activity, CheckCircle2 } from 'lucide-react';

export const TextGenerator: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<string>('gpt2-small (124M)');
  const [prompt, setPrompt] = useState<string>("I HAD always thought Jack Gisburn rather a cheap genius");
  const [generatedText, setGeneratedText] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [temperature, setTemperature] = useState<number>(0.7);
  const [topK, setTopK] = useState<number>(5);
  const [maxNewTokens, setMaxNewTokens] = useState<number>(35);
  const [seed, setSeed] = useState<number>(123);
  const [generationSteps, setGenerationSteps] = useState<GenerationStep[]>([]);
  const [activeStep, setActiveStep] = useState<GenerationStep | null>(null);

  const abortControllerRef = useRef<boolean>(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setGeneratedText('');
    setGenerationSteps([]);
    setActiveStep(null);
    abortControllerRef.current = false;

    const params: GenerationParams = {
      model: selectedModel,
      temperature,
      topK,
      topP: 0.9,
      maxNewTokens,
      contextLength: 1024,
      seed,
    };

    try {
      const stream = generateTextStream(prompt, params, (step) => {
        setGenerationSteps((prev) => [...prev, step]);
        setActiveStep(step);
      });

      let fullGenerated = '';
      for await (const chunk of stream) {
        if (abortControllerRef.current) break;
        fullGenerated += chunk;
        setGeneratedText(fullGenerated);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStop = () => {
    abortControllerRef.current = true;
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-full">
                Chapter 5 User Interface: Pretrained Text Generation
              </span>
              <span className="text-xs text-slate-400">ch05/06_user_interface/app_orig.py</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Pretrained GPT-2 Autoregressive Generator
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Port of the Chapter 5 Chainlit interface. Run autoregressive text completion with OpenAI GPT-2 weights loaded into the architecture built from scratch. Tweak temperature and top-K sampling to observe token candidate distributions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPrompt("I HAD always thought Jack Gisburn rather a cheap genius")}
              className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors"
            >
              The Verdict Prompt
            </button>
            <button
              onClick={() => setPrompt("The attention mechanism in modern large language models")}
              className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors"
            >
              NLP Science Prompt
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Prompt Input & Generation Output */}
        <div className="lg:col-span-8 space-y-6">
          {/* Prompt Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <label className="text-sm font-semibold text-slate-200 flex items-center justify-between mb-2">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Prompt / Context
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {selectedModel}
              </span>
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              disabled={isGenerating}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              placeholder="Enter your prompt here..."
            />

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all ${
                    isGenerating
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
                  }`}
                >
                  <Play className="w-4 h-4 fill-current" />
                  {isGenerating ? 'Generating Tokens...' : 'Generate Completion'}
                </button>

                {isGenerating && (
                  <button
                    onClick={handleStop}
                    className="px-4 py-2.5 rounded-xl text-sm font-bold bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/80 transition-colors"
                  >
                    Stop
                  </button>
                )}
              </div>

              {generatedText && !isGenerating && (
                <button
                  onClick={() => {
                    setGeneratedText('');
                    setGenerationSteps([]);
                    setActiveStep(null);
                  }}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Clear Output
                </button>
              )}
            </div>
          </div>

          {/* Output Display Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 min-h-[220px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Model Text Output
              </h3>
              {isGenerating && (
                <span className="flex items-center gap-2 text-xs text-blue-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                  Predicting next token...
                </span>
              )}
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 text-sm leading-relaxed font-mono min-h-[140px]">
              <span className="text-slate-400">{prompt}</span>
              <span className="text-emerald-400 font-bold">{generatedText}</span>
              {isGenerating && (
                <span className="inline-block w-2 h-4 bg-emerald-400 ml-1 animate-pulse align-middle" />
              )}
              {!generatedText && !isGenerating && (
                <span className="text-slate-600 italic block mt-4 font-sans text-xs">
                  Click "Generate Completion" to start sampling tokens from the pretrained GPT-2 model.
                </span>
              )}
            </div>

            {/* Generated Tokens Stream Badges */}
            {generationSteps.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <div className="text-xs font-semibold text-slate-400 mb-2">
                  Generated Tokens ({generationSteps.length}): Click any token to inspect its top candidate probabilities
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 bg-slate-950 rounded-lg border border-slate-800">
                  {generationSteps.map((step, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveStep(step)}
                      className={`px-2 py-0.5 rounded text-xs font-mono border transition-all ${
                        activeStep === step
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                          : 'bg-slate-800/80 text-emerald-300 border-slate-700 hover:border-emerald-500/50'
                      }`}
                    >
                      {step.token}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Sampling Controls & Next-Token Distribution */}
        <div className="lg:col-span-4 space-y-6">
          {/* Hyperparameters Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-400" />
              Sampling Parameters
            </h3>

            {/* Model Select */}
            <div>
              <label className="text-xs text-slate-400 block mb-1">Pretrained Model Size</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none"
              >
                {Object.keys(GPT_MODEL_CONFIGS).map(k => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>

            {/* Temperature Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Temperature (T):</span>
                <span className="font-mono font-bold text-amber-400">
                  {temperature === 0 ? '0.0 (Greedy)' : temperature.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min={0.0}
                max={1.5}
                step={0.05}
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-amber-500"
              />
              <span className="text-[10px] text-slate-400">Higher = more creative/diverse; 0 = deterministic argmax</span>
            </div>

            {/* Top-K Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Top-K:</span>
                <span className="font-mono font-bold text-blue-400">{topK}</span>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                step={1}
                value={topK}
                onChange={(e) => setTopK(parseInt(e.target.value))}
                className="w-full accent-blue-500"
              />
              <span className="text-[10px] text-slate-400">Restricts sampling pool to top K highest probability tokens</span>
            </div>

            {/* Max New Tokens Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">Max New Tokens:</span>
                <span className="font-mono font-bold text-white">{maxNewTokens}</span>
              </div>
              <input
                type="range"
                min={10}
                max={60}
                step={5}
                value={maxNewTokens}
                onChange={(e) => setMaxNewTokens(parseInt(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>
          </div>

          {/* Next-Token Probability Distribution Inspector */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center justify-between">
              <span>Next-Token Candidates</span>
              {activeStep && (
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  Chosen: "{activeStep.token}"
                </span>
              )}
            </h3>

            {activeStep ? (
              <div className="space-y-2">
                <p className="text-[11px] text-slate-400">
                  Softmax probabilities calculated across the top-K vocabulary candidates:
                </p>
                {activeStep.topCandidates.map((cand, i) => (
                  <div key={i} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="font-bold text-white">"{cand.token}"</span>
                      <span className="text-emerald-400 font-semibold">
                        {(cand.prob * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${Math.max(4, cand.prob * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                Generate text to inspect live token probabilities and sampling decisions.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
