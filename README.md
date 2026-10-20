# LLMs from Scratch - Interactive React Workbench

An interactive React application and workbench built on top of the concepts and architectures from [Build a Large Language Model (From Scratch)](https://www.manning.com/books/build-a-large-language-model-from-scratch) by Sebastian Raschka.

This application rewrites the original repository interfaces (Chainlit, Vercel handlers, Jupyter notebooks) into a high-performance React SPA with real-time tensor visualizers and sampling engines.

## Features

### 1. Tokenization & DataLoader Playground (Chapter 2)
- Interactive Byte-Pair Encoding (BPE) subword tokenizer with GPT-2 vocabulary (50,257 tokens).
- Live token decomposition: Token IDs, UTF-8 byte arrays, and decoded characters.
- Sliding-window PyTorch DataLoader batch generator showing input $x$ and target $y$ shifted by 1 token with adjustable context length and stride.
- Step-by-step BPE pair merge frequency simulator.

### 2. Multi-Head Attention Heatmap & Mechanism Visualizer (Chapter 3)
- Scaled Dot-Product Attention calculator: $Q = X W_q$, $K = X W_k$, $V = X W_v$.
- Matrix multiplication visualizer for $\text{Softmax}(Q K^T / \sqrt{d_k} + M) V$.
- Causal Masking toggle ($-\infty$ upper-triangular masking) comparing autoregressive decoder attention with bidirectional encoder attention.
- Multi-head attention switcher (Heads 1 to 4) with interactive cell hovering.

### 3. Full Transformer Architecture & Parameter Inspector (Chapter 4)
- Interactive end-to-end GPT computational graph: Token + Positional embeddings, LayerNorm, Multi-Head Attention, GELU MLP, Residual connections, and Language Modeling head.
- Exact mathematical parameter calculation across model sizes:
  - GPT-2 Small (124M)
  - GPT-2 Medium (355M)
  - GPT-2 Large (774M)
  - GPT-2 XL (1558M)
  - Qwen3 (0.6B)
- PyTorch implementation deep-dive for each module.

### 4. KV-Cache Memory & Architecture Benchmarks (Ch04 Advanced)
- Live memory footprint estimator comparing:
  - Standard Multi-Head Attention (MHA)
  - Grouped-Query Attention (GQA)
  - Multi-Head Latent Attention (MLA)
  - Sliding Window Attention (SWA)
  - Cross-Layer KV Sharing
- Computational complexity analysis: $O(t^2)$ without cache vs $O(1)$ per step with cache.

### 5. Pretrained GPT-2 Text Generator (Chapter 5)
- Port of `ch05/06_user_interface/app_orig.py`.
- Autoregressive text generation with token-by-token streaming.
- Sampling controls: Temperature ($T$), Top-K truncation, and max new tokens.
- Next-token candidate probability distribution inspector.

### 6. Finetuned Text Classifier (Chapter 6)
- Port of `ch06/04_user_interface/app.py`.
- SMS Spam Detection ("SPAM" vs "HAM") and Movie Review Sentiment ("POSITIVE" vs "NEGATIVE").
- Replaces the 50,257 LM head with a 2-class linear output layer ($nn.Linear(d_{model}, 2)$).
- Confidence scores and feature token attribution highlighting.

### 7. Instruction-Following Assistant & DPO Alignment (Chapter 7)
- Port of `ch07/06_user_interface/app.py` and `ch05/11_qwen3/`.
- Conversational chat using the Alpaca instruction template (`### Instruction:`, `### Response:`).
- Qwen3 thinking mode with collapsible Chain-of-Thought reasoning blocks.
- Direct Preference Optimization (DPO) lab comparing Chosen ($y_w$) and Rejected ($y_l$) response pairs with log probability margins.

### 8. API Health Contract
- Preserves the API contract from `api/index.py` (`{"name": "LLMs from scratch", "status": "ok", "message": "Repository deployed successfully."}`).

## Running the Application

```bash
# Start development server on port 3000
npm run dev

# Build production bundle
npm run build
```
