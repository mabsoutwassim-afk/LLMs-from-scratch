export type ChapterId = 
  | 'overview'
  | 'ch02-tokenization'
  | 'ch03-attention'
  | 'ch04-architecture'
  | 'ch05-pretraining'
  | 'ch06-classification'
  | 'ch07-instructions'
  | 'kv-cache'
  | 'book-index';

export interface ModelConfig {
  name: string;
  size: string;
  vocabSize: number;
  contextLength: number;
  embDim: number;
  nHeads: number;
  nLayers: number;
  dropRate: number;
  qkvBias: boolean;
  paramsMillion: number;
}

export interface TokenItem {
  id: number;
  token: string;
  bytes?: number[];
  color?: string;
}

export interface AttentionHeadData {
  headIndex: number;
  tokens: string[];
  matrix: number[][]; // [row_query][col_key] -> attention weight (0 to 1)
  rawScores?: number[][];
}

export interface GenerationParams {
  model: string;
  temperature: number;
  topK: number;
  topP: number;
  maxNewTokens: number;
  contextLength: number;
  seed: number;
  showThinking?: boolean;
}

export interface CandidateToken {
  token: string;
  prob: number;
  logit: number;
}

export interface GenerationStep {
  token: string;
  tokenId: number;
  topCandidates: CandidateToken[];
  selectedProb: number;
}

export interface ClassificationResult {
  label: string;
  confidence: number;
  probabilities: { [label: string]: number };
  highlightedTokens: { token: string; weight: number }[];
  inferenceTimeMs: number;
  model: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  thinking?: string;
  timestamp: string;
  tokensGenerated?: number;
  formattedPrompt?: string;
}

export interface DPOComparison {
  instruction: string;
  prompt: string;
  chosen: string;
  chosenLogProb: number;
  rejected: string;
  rejectedLogProb: number;
  margin: number;
}

export interface ChapterSummary {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  keyConcepts: string[];
  codeFiles: string[];
  architectureDiagram?: string;
}
