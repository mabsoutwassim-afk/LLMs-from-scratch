import { CandidateToken, GenerationParams, GenerationStep } from '../types';

// Domain vocabulary & continuation sequences reflective of the book's training data ("The Verdict", general NLP, science, LLM concepts)
const KNOWLEDGE_BASE: { [key: string]: string[] } = {
  theVerdict: [
    " had always thought Jack Gisburn rather a cheap genius—though a good fellow enough—so when I heard he had married an American heiress who had bought the Victorian-style villa, I was not particularly surprised.",
    " was not surprised to find Gisburn established in such splendor. His pictures had always possessed that fatal facility which appeals to buyers with more money than taste.",
    " regarded the masterpiece with a sensation of acute curiosity, wondering whether genius or charlatanry had guided his confident hand."
  ],
  attention: [
    " allows the neural network to dynamically assign different weights to different parts of the input sequence, capturing long-range dependencies effectively.",
    " mechanisms compute queries, keys, and values through linear projections. Causal masking ensures autoregressive models cannot attend to future tokens during training.",
    " is the cornerstone of modern decoder-only architectures like GPT and Llama, replacing recurrent connections with parallel matrix multiplications."
  ],
  default: [
    " is an autoregressive transformer designed to predict the next token given preceding context. By training on large datasets using cross-entropy loss, the model learns statistical regularities of language.",
    " transforms raw input tokens through stacked transformer blocks containing multi-head self-attention, layer normalization, and feed-forward networks.",
    " provides foundation capabilities that can subsequently be adapted via supervised fine-tuning and alignment techniques such as Direct Preference Optimization."
  ]
};

// Generates next token candidate distribution
export function getTopCandidates(
  partialText: string,
  temperature: number = 0.7,
  topK: number = 5
): CandidateToken[] {
  const words = partialText.trim().split(/\s+/);
  const lastWord = words[words.length - 1]?.toLowerCase() || '';

  // Context-aware plausible candidates
  let candidateWords: { token: string; baseScore: number }[] = [];

  if (lastWord.includes('attent')) {
    candidateWords = [
      { token: ' mechanisms', baseScore: 4.8 },
      { token: ' weights', baseScore: 4.2 },
      { token: ' heads', baseScore: 3.9 },
      { token: ' scores', baseScore: 3.5 },
      { token: ' is', baseScore: 2.8 },
      { token: ' matrix', baseScore: 2.5 },
    ];
  } else if (lastWord.includes('model') || lastWord.includes('gpt')) {
    candidateWords = [
      { token: ' architecture', baseScore: 4.6 },
      { token: ' parameters', baseScore: 4.3 },
      { token: ' training', baseScore: 3.8 },
      { token: ' generates', baseScore: 3.2 },
      { token: ' uses', baseScore: 3.0 },
      { token: ' layers', baseScore: 2.7 },
    ];
  } else if (lastWord.includes('token') || lastWord.includes('word')) {
    candidateWords = [
      { token: ' embeddings', baseScore: 4.9 },
      { token: ' prediction', baseScore: 4.1 },
      { token: ' sequences', baseScore: 3.7 },
      { token: ' IDs', baseScore: 3.3 },
      { token: ' representation', baseScore: 3.1 },
    ];
  } else if (lastWord.includes('the')) {
    candidateWords = [
      { token: ' model', baseScore: 4.5 },
      { token: ' input', baseScore: 4.1 },
      { token: ' transformer', baseScore: 3.9 },
      { token: ' attention', baseScore: 3.6 },
      { token: ' weights', baseScore: 3.2 },
      { token: ' dataset', baseScore: 3.0 },
    ];
  } else {
    candidateWords = [
      { token: ' and', baseScore: 4.0 },
      { token: ' the', baseScore: 3.8 },
      { token: ' to', baseScore: 3.5 },
      { token: ' with', baseScore: 3.3 },
      { token: ' of', baseScore: 3.1 },
      { token: ' in', baseScore: 2.9 },
      { token: ' that', baseScore: 2.7 },
    ];
  }

  // Apply temperature scaling
  const t = Math.max(0.01, temperature);
  const scaledScores = candidateWords.map(c => ({
    token: c.token,
    logit: c.baseScore,
    scaledLogit: c.baseScore / t,
  }));

  // Softmax
  const maxScaled = Math.max(...scaledScores.map(s => s.scaledLogit));
  const expScores = scaledScores.map(s => Math.exp(s.scaledLogit - maxScaled));
  const sumExp = expScores.reduce((a, b) => a + b, 0);

  const rawCandidates: CandidateToken[] = scaledScores.map((s, idx) => ({
    token: s.token,
    logit: s.logit,
    prob: expScores[idx] / sumExp,
  }));

  // Sort descending
  rawCandidates.sort((a, b) => b.prob - a.prob);

  // Apply top-K
  const filtered = rawCandidates.slice(0, Math.min(topK, rawCandidates.length));
  // Re-normalize
  const totalP = filtered.reduce((acc, c) => acc + c.prob, 0);
  return filtered.map(c => ({
    ...c,
    prob: totalP > 0 ? c.prob / totalP : 1 / filtered.length,
  }));
}

/**
 * Text generation simulator matching Chapter 5:
 * generate(model, idx, max_new_tokens, context_size, top_k, temperature)
 */
export async function* generateTextStream(
  prompt: string,
  params: GenerationParams,
  onStep?: (step: GenerationStep) => void
): AsyncGenerator<string, void, unknown> {
  const trimmedPrompt = prompt.trim();
  let currentText = trimmedPrompt;

  // Pick target response or build dynamic tokens
  let continuationPool: string[] = [];
  if (trimmedPrompt.toLowerCase().includes('jack') || trimmedPrompt.toLowerCase().includes('verdict')) {
    continuationPool = KNOWLEDGE_BASE.theVerdict;
  } else if (trimmedPrompt.toLowerCase().includes('attention') || trimmedPrompt.toLowerCase().includes('self-attention')) {
    continuationPool = KNOWLEDGE_BASE.attention;
  } else {
    continuationPool = KNOWLEDGE_BASE.default;
  }

  // Target full sentence
  const targetSentence = continuationPool[Math.abs(params.seed || 123) % continuationPool.length];
  // Break into subword token chunks
  const tokensToEmit = targetSentence.match(/'s|'t|'re|'ve|'m|'ll|'d| ?[a-zA-Z]+| ?[0-9]+| ?[^\s\w]+|\s+/g) || [' '];

  const maxTokens = Math.min(params.maxNewTokens, tokensToEmit.length);

  for (let i = 0; i < maxTokens; i++) {
    // Generate realistic candidate distribution
    const topCandidates = getTopCandidates(currentText, params.temperature, params.topK);
    const chosenToken = tokensToEmit[i];
    currentText += chosenToken;

    const step: GenerationStep = {
      token: chosenToken,
      tokenId: 1000 + i * 37,
      topCandidates,
      selectedProb: topCandidates[0]?.prob || 0.85,
    };

    if (onStep) {
      onStep(step);
    }

    yield chosenToken;

    // Small realistic delay between token outputs
    await new Promise(res => setTimeout(res, 40));
  }
}
