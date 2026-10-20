import { ChatMessage, DPOComparison } from '../types';

export const DPO_EXAMPLES: DPOComparison[] = [
  {
    instruction: "Explain how multi-head attention computes context vectors.",
    prompt: "Below is an instruction that describes a task. Write a response that appropriately completes the request.\n\n### Instruction:\nExplain how multi-head attention computes context vectors.\n\n### Response:",
    chosen: "Multi-head attention projects the input embeddings into multiple query, key, and value subspaces using learnable linear weights. For each head i, it computes scaled dot-product attention: softmax(Q_i K_i^T / sqrt(d_k)) * V_i. The resulting context vectors from all heads are concatenated along the feature dimension and passed through a final linear projection W_o.",
    chosenLogProb: -12.42,
    rejected: "Attention is when you look at words. Multi-head means there are many heads doing attention at once so it learns faster. Then it adds them together.",
    rejectedLogProb: -38.91,
    margin: 26.49,
  },
  {
    instruction: "Why does GPT use Causal Masking during self-attention?",
    prompt: "Below is an instruction that describes a task. Write a response that appropriately completes the request.\n\n### Instruction:\nWhy does GPT use Causal Masking during self-attention?\n\n### Response:",
    chosen: "In autoregressive language generation, tokens must be generated strictly from left to right. Causal masking sets the attention scores for all future token positions (j > i) to negative infinity before applying softmax. This guarantees that token i can only attend to preceding tokens and itself, preventing data leakage from future tokens.",
    chosenLogProb: -14.18,
    rejected: "Causal masking is used so the model doesn't overfit on the training set. It masks random words like BERT does.",
    rejectedLogProb: -44.05,
    margin: 29.87,
  },
  {
    instruction: "What is the difference between LayerNorm and BatchNorm?",
    prompt: "Below is an instruction that describes a task. Write a response that appropriately completes the request.\n\n### Instruction:\nWhat is the difference between LayerNorm and BatchNorm?\n\n### Response:",
    chosen: "BatchNorm calculates mean and variance across the batch dimension for each feature, which fails when batch sizes vary or sequence lengths are dynamic. In contrast, LayerNorm normalizes across the feature dimension independently for each individual token and sequence, making it invariant to batch size and ideal for transformers.",
    chosenLogProb: -11.95,
    rejected: "BatchNorm is for PyTorch and LayerNorm is for TensorFlow. They do the exact same thing.",
    rejectedLogProb: -51.20,
    margin: 39.25,
  }
];

export function formatAlpacaPrompt(instruction: string, input?: string): string {
  if (input && input.trim()) {
    return `Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.\n\n### Instruction:\n${instruction}\n\n### Input:\n${input}\n\n### Response:\n`;
  }
  return `Below is an instruction that describes a task. Write a response that appropriately completes the request.\n\n### Instruction:\n${instruction}\n\n### Response:\n`;
}

/**
 * Instruction response generator
 */
export async function* streamInstructionResponse(
  instruction: string,
  modelType: 'gpt2-sft' | 'qwen3-thinking' = 'gpt2-sft'
): AsyncGenerator<{ contentChunk: string; thinkingChunk?: string; isThinking?: boolean }, void, unknown> {
  const lower = instruction.toLowerCase();

  let thinking = '';
  let response = '';

  if (modelType === 'qwen3-thinking') {
    thinking = `The user is asking: "${instruction}".\n1. Analyze the core machine learning concept.\n2. Ensure the response adheres to the implementation patterns in 'LLMs from scratch' by Sebastian Raschka.\n3. Formulate a structured, accurate explanation highlighting PyTorch implementation details.`;
  }

  if (lower.includes('bpe') || lower.includes('tokeniz')) {
    response = `Byte-Pair Encoding (BPE) is a subword tokenization algorithm that iteratively merges the most frequently occurring adjacent pair of characters or subwords into a new single token.
    
In Chapter 2 of LLMs from Scratch:
1. We start with a base vocabulary of individual characters or bytes.
2. We iterate over the corpus and count all adjacent bigrams.
3. The most frequent bigram is merged into a new vocabulary token.
4. This repeats until a desired vocabulary size is reached (e.g., 50,257 for GPT-2).

BPE solves the out-of-vocabulary (OOV) problem because unknown words can always be decomposed into smaller familiar subwords or individual characters.`;
  } else if (lower.includes('attention') || lower.includes('transformer')) {
    response = `Scaled Dot-Product Self-Attention is computed with three learned projections of the input X:
• Queries: Q = X W_q
• Keys: K = X W_k
• Values: V = X W_v

The attention weights matrix is given by:
Attention(Q, K, V) = Softmax( (Q K^T) / sqrt(d_k) + M ) * V

Where:
- d_k is the dimension of the key vectors. Dividing by sqrt(d_k) stabilizes gradients when dimensions grow large.
- M is the causal upper-triangular mask where positions with j > i are set to -infinity, ensuring token i cannot attend to future tokens.
- Multi-Head Attention splits the feature space into h parallel heads to attend to information from different representation subspaces.`;
  } else if (lower.includes('kv cache') || lower.includes('cache')) {
    response = `During autoregressive generation, generating each new token only requires computing the Query vector for the very latest token.

Without KV cache:
• At step t, the model recomputes Q, K, and V for all t tokens from scratch, resulting in O(t^2) compute complexity.

With KV cache:
• The Key and Value matrices computed in earlier steps are stored in memory.
• At step t, the model only computes Q_t, K_t, V_t for the single new token, appends K_t and V_t to the cache, and computes attention against the cached keys and values.
• This drops per-step computational complexity from O(t) to O(1), drastically speeding up generation at the cost of GPU VRAM.`;
  } else if (lower.includes('classifier') || lower.includes('spam') || lower.includes('sentiment')) {
    response = `In Chapter 6, we adapt the pretrained GPT-2 model into a text classifier:
1. Replace the final 50,257-dimensional language modeling head with a Linear(emb_dim, 2) head.
2. Extract the hidden state from the last non-padding token in the sequence (which has gathered contextual information from all preceding tokens due to causal self-attention).
3. Freeze early transformer layers to preserve foundational language representations and train with CrossEntropyLoss on labeled data.`;
  } else {
    response = `Based on the architecture implemented in "Build a Large Language Model (From Scratch)":
The model processes the input through:
1. Token & Learned Positional Embeddings
2. N Transformer Blocks (each with Pre-LayerNorm, Multi-Head Causal Self-Attention, and Feed-Forward network with GELU)
3. Final LayerNorm and Linear projection head

For instruction fine-tuning, training examples are formatted using the Alpaca template:
### Instruction: [user task]
### Input: [optional context]
### Response: [target assistant output]

This guides the autoregressive generator to complete tasks helpfully and coherently.`;
  }

  // If thinking mode, stream thinking first
  if (modelType === 'qwen3-thinking' && thinking) {
    const thinkParts = thinking.split(' ');
    for (const part of thinkParts) {
      yield { contentChunk: '', thinkingChunk: part + ' ', isThinking: true };
      await new Promise(r => setTimeout(r, 20));
    }
  }

  // Stream actual content
  const contentWords = response.split(' ');
  for (const word of contentWords) {
    yield { contentChunk: word + ' ', isThinking: false };
    await new Promise(r => setTimeout(r, 25));
  }
}
