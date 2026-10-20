import { TokenItem } from '../types';

// Palette of colors for token badges
const TOKEN_COLORS = [
  'bg-blue-900/60 text-blue-200 border-blue-700/50',
  'bg-emerald-900/60 text-emerald-200 border-emerald-700/50',
  'bg-amber-900/60 text-amber-200 border-amber-700/50',
  'bg-purple-900/60 text-purple-200 border-purple-700/50',
  'bg-rose-900/60 text-rose-200 border-rose-700/50',
  'bg-cyan-900/60 text-cyan-200 border-cyan-700/50',
  'bg-indigo-900/60 text-indigo-200 border-indigo-700/50',
  'bg-teal-900/60 text-teal-200 border-teal-700/50',
  'bg-orange-900/60 text-orange-200 border-orange-700/50',
  'bg-pink-900/60 text-pink-200 border-pink-700/50',
];

// Pre-seeded subwords common in GPT-2 / LLM vocabulary
const COMMON_VOCAB: { [subword: string]: number } = {
  "<|endoftext|>": 50256,
  "the": 1169,
  "The": 464,
  " a": 257,
  " is": 318,
  " in": 287,
  " to": 284,
  " of": 286,
  " and": 290,
  " that": 326,
  " it": 340,
  " was": 373,
  " for": 329,
  " on": 319,
  " with": 351,
  " as": 355,
  " by": 416,
  " at": 262,
  " from": 422,
  " this": 428,
  " model": 2746,
  " language": 3303,
  " large": 1588,
  " transformer": 39180,
  " attention": 3772,
  " token": 11241,
  " tokens": 16326,
  " scratch": 16410,
  " neural": 15756,
  " network": 2112,
  " training": 2542,
  " deep": 2769,
  " learning": 4673,
  " PyTorch": 38484,
  " GPT": 3856,
  "-2": 1059,
  " loss": 3384,
  " weight": 3392,
  " weights": 6017,
  " layer": 3757,
  " layers": 4699,
  " head": 2141,
  " heads": 7062,
  " context": 4721,
  " size": 1269,
  " data": 1366,
  " input": 3968,
  " output": 3763,
  " Jack": 6224,
  " Gisburn": 48212,
  " rather": 3448,
  " cheap": 7654,
  " genius": 13328,
  "—": 434,
  " though": 1960,
  " good": 922,
  " fellow": 7177,
  " enough": 1576,
  " so": 523,
  " when": 618,
  " I": 314,
  " heard": 2089,
  " he": 339,
  " had": 550,
  " married": 6784,
  " an": 281,
  " American": 1605,
  " heiress": 41920,
  " who": 508,
  " bought": 3388,
  " Victorian": 22312,
  "-style": 4880,
  " villa": 28919,
  ",": 11,
  ".": 13,
  "!": 0,
  "?": 30,
  ":": 25,
  ";": 26,
  " ": 220,
};

// Deterministic hash to token ID (0..50255) for arbitrary words not in the snippet dictionary
function hashToTokenId(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash % 50255) + 100;
}

/**
 * Tokenize input text using GPT-2 regex-based BPE split simulation
 * Regex in GPT-2: 's|'t|'re|'ve|'m|'ll|'d| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+
 */
export function tokenizeText(text: string): TokenItem[] {
  if (!text) return [];

  const regex = /'s|'t|'re|'ve|'m|'ll|'d| ?[a-zA-Z]+| ?[0-9]+| ?[^\s\w]+|\s+/g;
  const matches = text.match(regex) || [text];

  return matches.map((tokenStr, idx) => {
    let id: number;
    if (COMMON_VOCAB[tokenStr] !== undefined) {
      id = COMMON_VOCAB[tokenStr];
    } else if (COMMON_VOCAB[tokenStr.trim()] !== undefined) {
      id = COMMON_VOCAB[tokenStr.trim()];
    } else {
      id = hashToTokenId(tokenStr);
    }

    // Convert string to UTF-8 byte array
    const encoder = new TextEncoder();
    const bytes = Array.from(encoder.encode(tokenStr));

    return {
      id,
      token: tokenStr,
      bytes,
      color: TOKEN_COLORS[idx % TOKEN_COLORS.length],
    };
  });
}

/**
 * Dataloader sliding window generator
 * As implemented in Chapter 2 (ch02.py):
 * Given token_ids, context_size, and stride, yields input_chunk and target_chunk (shifted by 1)
 */
export interface DataLoaderBatch {
  step: number;
  inputIds: number[];
  targetIds: number[];
  inputTokens: string[];
  targetTokens: string[];
}

export function generateDataLoaderBatches(
  tokens: TokenItem[],
  contextSize: number = 4,
  stride: number = 1
): DataLoaderBatch[] {
  const batches: DataLoaderBatch[] = [];
  if (tokens.length <= contextSize) return batches;

  let step = 1;
  for (let i = 0; i <= tokens.length - contextSize - 1; i += stride) {
    const inputSlice = tokens.slice(i, i + contextSize);
    const targetSlice = tokens.slice(i + 1, i + contextSize + 1);

    batches.push({
      step,
      inputIds: inputSlice.map(t => t.id),
      targetIds: targetSlice.map(t => t.id),
      inputTokens: inputSlice.map(t => t.token),
      targetTokens: targetSlice.map(t => t.token),
    });
    step++;
    if (batches.length >= 10) break; // Limit preview batches
  }

  return batches;
}

/**
 * Simulates the BPE merge learning loop on a small corpus
 */
export interface BPEMergeStep {
  iteration: number;
  bestPair: [string, string];
  frequency: number;
  newVocabularyEntry: string;
  resultingTokens: string[][];
}

export function simulateBPETraining(corpus: string[], numMerges: number = 5): BPEMergeStep[] {
  // Split corpus into character lists with special end-of-word marker </w>
  let tokenizedCorpus = corpus.map(word => {
    const chars = word.split('');
    chars[chars.length - 1] = chars[chars.length - 1] + '</w>';
    return chars;
  });

  const steps: BPEMergeStep[] = [];

  for (let iter = 1; iter <= numMerges; iter++) {
    // Count pairs
    const pairCounts: { [pairKey: string]: { pair: [string, string]; count: number } } = {};
    for (const wordList of tokenizedCorpus) {
      for (let i = 0; i < wordList.length - 1; i++) {
        const p1 = wordList[i];
        const p2 = wordList[i + 1];
        const key = `${p1}|||${p2}`;
        if (!pairCounts[key]) {
          pairCounts[key] = { pair: [p1, p2], count: 0 };
        }
        pairCounts[key].count++;
      }
    }

    // Find best pair
    let bestKey: string | null = null;
    let maxCount = 0;
    for (const [key, data] of Object.entries(pairCounts)) {
      if (data.count > maxCount) {
        maxCount = data.count;
        bestKey = key;
      }
    }

    if (!bestKey || maxCount <= 1) break;

    const bestPair = pairCounts[bestKey].pair;
    const merged = bestPair[0] + bestPair[1];

    // Merge in corpus
    tokenizedCorpus = tokenizedCorpus.map(wordList => {
      const newList: string[] = [];
      let i = 0;
      while (i < wordList.length) {
        if (i < wordList.length - 1 && wordList[i] === bestPair[0] && wordList[i + 1] === bestPair[1]) {
          newList.push(merged);
          i += 2;
        } else {
          newList.push(wordList[i]);
          i++;
        }
      }
      return newList;
    });

    steps.push({
      iteration: iter,
      bestPair,
      frequency: maxCount,
      newVocabularyEntry: merged,
      resultingTokens: JSON.parse(JSON.stringify(tokenizedCorpus)),
    });
  }

  return steps;
}
