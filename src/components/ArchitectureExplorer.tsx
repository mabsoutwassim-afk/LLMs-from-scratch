import React, { useState } from 'react';
import { GPT_MODEL_CONFIGS } from '../data/chaptersData';
import { Layers, ChevronRight, Cpu, Sliders, Info, Box } from 'lucide-react';

export const ArchitectureExplorer: React.FC = () => {
  const [selectedModelKey, setSelectedModelKey] = useState<string>('gpt2-small (124M)');
  const [activeLayerInspect, setActiveLayerInspect] = useState<string>('transformer_block');

  const config = GPT_MODEL_CONFIGS[selectedModelKey];

  // Mathematical parameter calculations
  const tokenEmbedParams = config.vocabSize * config.embDim;
  const posEmbedParams = config.contextLength * config.embDim;
  // Per layer:
  // Q, K, V projections: 3 * (embDim * embDim) + Out projection (embDim * embDim) = 4 * embDim^2
  const attnParamsPerLayer = 4 * config.embDim * config.embDim;
  // MLP: Linear(embDim, 4 * embDim) + Linear(4 * embDim, embDim) = 8 * embDim^2
  const mlpParamsPerLayer = 8 * config.embDim * config.embDim;
  // Layer norms: 2 per block * (2 * embDim) = 4 * embDim
  const lnParamsPerLayer = 4 * config.embDim;
  const totalPerBlock = attnParamsPerLayer + mlpParamsPerLayer + lnParamsPerLayer;
  const allBlocksTotal = totalPerBlock * config.nLayers;
  const finalHeadParams = config.embDim * config.vocabSize;
  const totalTheoreticalParams = tokenEmbedParams + posEmbedParams + allBlocksTotal + finalHeadParams;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                Chapter 4: Implementing a GPT Model from Scratch
              </span>
              <span className="text-xs text-slate-400">PyTorch GPTModel & TransformerBlock</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Transformer Architecture & Parameter Breakdown
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Inspect how token embeddings, positional encodings, layer normalization, multi-head attention, and feed-forward networks with GELU activations assemble into the full decoder-only architecture.
            </p>
          </div>

          {/* Model selection dropdown */}
          <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <select
              value={selectedModelKey}
              onChange={(e) => setSelectedModelKey(e.target.value)}
              className="bg-transparent text-sm font-semibold text-white focus:outline-none cursor-pointer"
            >
              {Object.keys(GPT_MODEL_CONFIGS).map((key) => (
                <option key={key} value={key} className="bg-slate-900 text-white">
                  {key}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Architecture Specs Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Parameters</div>
          <div className="text-xl font-bold text-emerald-400 mt-1">
            {(totalTheoreticalParams / 1e6).toFixed(1)}M
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Reported: {config.size}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Layers (Depth)</div>
          <div className="text-xl font-bold text-white mt-1">{config.nLayers}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Transformer blocks</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Emb Dimension</div>
          <div className="text-xl font-bold text-white mt-1">{config.embDim}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Hidden size (d_model)</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Attention Heads</div>
          <div className="text-xl font-bold text-white mt-1">{config.nHeads}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">{config.embDim / config.nHeads}d per head</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Context Length</div>
          <div className="text-xl font-bold text-blue-400 mt-1">{config.contextLength}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Max sequence tokens</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Vocab Size</div>
          <div className="text-xl font-bold text-indigo-400 mt-1">{config.vocabSize.toLocaleString()}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Subword tokens</div>
        </div>
      </div>

      {/* Interactive Architectural Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Diagram */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            GPT Model Computation Flow (Click to Inspect)
          </h3>

          <div className="space-y-3 font-mono text-xs">
            {/* Input Tokens */}
            <div 
              onClick={() => setActiveLayerInspect('input')}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                activeLayerInspect === 'input' 
                  ? 'bg-blue-950/60 border-blue-500 text-blue-200 shadow-md' 
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-2">
                  <Box className="w-4 h-4 text-blue-400" />
                  1. Input Token & Positional Encodings
                </span>
                <span className="text-[11px] opacity-75">Shape: [Batch, SeqLen, {config.embDim}]</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-sans">
                tok_emb = nn.Embedding({config.vocabSize}, {config.embDim}) + pos_emb = nn.Embedding({config.contextLength}, {config.embDim})
              </p>
            </div>

            <div className="flex justify-center text-slate-600">↓</div>

            {/* Transformer Block Repeat */}
            <div 
              onClick={() => setActiveLayerInspect('transformer_block')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                activeLayerInspect === 'transformer_block' 
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 shadow-md' 
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-emerald-300 flex items-center gap-2 font-mono">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  2. TransformerBlock (Repeated × {config.nLayers} Layers)
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[11px]">
                  × {config.nLayers}
                </span>
              </div>

              <div className="space-y-2 pl-3 border-l-2 border-emerald-800/60 my-2">
                <div className="p-2 bg-slate-900 rounded border border-slate-800 text-[11px]">
                  <span className="text-amber-300 font-semibold">Pre-LayerNorm 1:</span> LayerNorm({config.embDim})
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800 text-[11px]">
                  <span className="text-blue-300 font-semibold">Multi-Head Causal Attention:</span> {config.nHeads} heads, d_k={config.embDim / config.nHeads}
                </div>
                <div className="p-1 text-slate-400 text-[10px] pl-2 font-sans">
                  + Residual Shortcut: <span className="font-mono text-emerald-400">x = x + attn(ln_1(x))</span>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800 text-[11px]">
                  <span className="text-amber-300 font-semibold">Pre-LayerNorm 2:</span> LayerNorm({config.embDim})
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800 text-[11px]">
                  <span className="text-purple-300 font-semibold">FeedForward Network:</span> Linear({config.embDim}, {4 * config.embDim}) → GELU → Linear({4 * config.embDim}, {config.embDim})
                </div>
                <div className="p-1 text-slate-400 text-[10px] pl-2 font-sans">
                  + Residual Shortcut: <span className="font-mono text-emerald-400">x = x + ffn(ln_2(x))</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center text-slate-600">↓</div>

            {/* Final LayerNorm */}
            <div 
              onClick={() => setActiveLayerInspect('final_ln')}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                activeLayerInspect === 'final_ln' 
                  ? 'bg-amber-950/60 border-amber-500 text-amber-200 shadow-md' 
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-2">
                  <Box className="w-4 h-4 text-amber-400" />
                  3. Final Layer Normalization
                </span>
                <span className="text-[11px] opacity-75">LayerNorm({config.embDim})</span>
              </div>
            </div>

            <div className="flex justify-center text-slate-600">↓</div>

            {/* Output Head */}
            <div 
              onClick={() => setActiveLayerInspect('output_head')}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                activeLayerInspect === 'output_head' 
                  ? 'bg-purple-950/60 border-purple-500 text-purple-200 shadow-md' 
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-2">
                  <Box className="w-4 h-4 text-purple-400" />
                  4. Linear Output Head (Language Modeling Head)
                </span>
                <span className="text-[11px] opacity-75">Linear({config.embDim}, {config.vocabSize})</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 font-sans">
                Produces logits over all {config.vocabSize.toLocaleString()} vocabulary tokens for next-token prediction.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Code & Details Inspector */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-400" />
            PyTorch Implementation Deep Dive
          </h3>

          {activeLayerInspect === 'transformer_block' && (
            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-slate-300 leading-relaxed overflow-x-auto">
                <span className="text-slate-500"># pkg/llms_from_scratch/ch04.py</span>{'\n'}
                <span className="text-purple-400">class</span> <span className="text-yellow-300">TransformerBlock</span>(nn.Module):{'\n'}
                {'    '}def __init__(self, cfg):{'\n'}
                {'        '}super().__init__(){'\n'}
                {'        '}self.att = MultiHeadAttention(...) {'\n'}
                {'        '}self.ff = FeedForward(cfg) {'\n'}
                {'        '}self.norm1 = LayerNorm(cfg["emb_dim"]){'\n'}
                {'        '}self.norm2 = LayerNorm(cfg["emb_dim"]){'\n'}
                {'        '}self.drop_shortcut = nn.Dropout(...){'\n\n'}
                {'    '}def forward(self, x):{'\n'}
                {'        '}<span className="text-emerald-400"># Shortcut connection 1</span>{'\n'}
                {'        '}shortcut = x{'\n'}
                {'        '}x = self.norm1(x){'\n'}
                {'        '}x = self.att(x){'\n'}
                {'        '}x = self.drop_shortcut(x){'\n'}
                {'        '}x = x + shortcut{'\n\n'}
                {'        '}<span className="text-emerald-400"># Shortcut connection 2</span>{'\n'}
                {'        '}shortcut = x{'\n'}
                {'        '}x = self.norm2(x){'\n'}
                {'        '}x = self.ff(x){'\n'}
                {'        '}x = self.drop_shortcut(x){'\n'}
                {'        '}x = x + shortcut{'\n'}
                {'        '}return x
              </div>
              <p className="text-slate-300 font-sans text-xs">
                <strong>Why Pre-LayerNorm?</strong> As Sebastian explains in Chapter 4, applying LayerNorm <em>before</em> the attention and feed-forward submodules (Pre-LN) creates a clean, uninterrupted identity highway via the residual addition, drastically stabilizing gradient backpropagation through deep networks (e.g. 12 to 48 layers).
              </p>
            </div>
          )}

          {activeLayerInspect === 'input' && (
            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-slate-300 leading-relaxed overflow-x-auto">
                <span className="text-slate-500"># Embeddings layer</span>{'\n'}
                self.tok_emb = nn.Embedding(cfg["vocab_size"], cfg["emb_dim"]){'\n'}
                self.pos_emb = nn.Embedding(cfg["context_length"], cfg["emb_dim"]){'\n\n'}
                <span className="text-emerald-400"># Forward addition</span>{'\n'}
                batch_size, seq_len = in_idx.shape{'\n'}
                tok_embeds = self.tok_emb(in_idx){'\n'}
                pos_embeds = self.pos_emb(torch.arange(seq_len, device=in_idx.device)){'\n'}
                x = tok_embeds + pos_embeds{'\n'}
                x = self.drop_emb(x)
              </div>
              <p className="text-slate-300 font-sans text-xs">
                Unlike RNNs, transformers process all sequence positions simultaneously. The learned positional embeddings inject spatial order so the network knows whether a token occurred at index 0, 1, or 500.
              </p>
            </div>
          )}

          {activeLayerInspect === 'output_head' && (
            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-slate-300 leading-relaxed overflow-x-auto">
                <span className="text-slate-500"># Final Linear LM Head</span>{'\n'}
                self.out_head = nn.Linear({'\n'}
                {'    '}cfg["emb_dim"],{'\n'}
                {'    '}cfg["vocab_size"],{'\n'}
                {'    '}bias=False{'\n'}
                ){'\n\n'}
                logits = self.out_head(x) <span className="text-slate-500"># [Batch, SeqLen, 50257]</span>
              </div>
              <p className="text-slate-300 font-sans text-xs">
                In Chapter 6, we demonstrate transfer learning by simply replacing this 50,257-output LM head with a 2-output head (<span className="font-mono text-blue-400">nn.Linear(emb_dim, 2)</span>) to classify spam vs ham or movie sentiment!
              </p>
            </div>
          )}

          {activeLayerInspect === 'final_ln' && (
            <div className="space-y-3 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-slate-300 leading-relaxed overflow-x-auto">
                self.final_norm = LayerNorm(cfg["emb_dim"]){'\n'}
                x = self.final_norm(x)
              </div>
              <p className="text-slate-300 font-sans text-xs">
                Normalizes the hidden representations across the final embedding dimension before projecting onto the vocabulary logits.
              </p>
            </div>
          )}

          {/* Parameter count summary table */}
          <div className="border-t border-slate-800 pt-4 mt-4">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Parameter Count Allocation
            </h4>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span>Token Embeddings:</span>
                <span className="font-bold text-white">{(tokenEmbedParams / 1e6).toFixed(2)}M</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Positional Embeddings:</span>
                <span className="font-bold text-white">{(posEmbedParams / 1e6).toFixed(2)}M</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>All {config.nLayers} Transformer Blocks:</span>
                <span className="font-bold text-emerald-400">{(allBlocksTotal / 1e6).toFixed(2)}M</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Final Output Head:</span>
                <span className="font-bold text-white">{(finalHeadParams / 1e6).toFixed(2)}M</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
