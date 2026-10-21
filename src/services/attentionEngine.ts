import { AttentionHeadData } from '../types';

// Pseudo-random deterministic weights generator for realistic visual attention computation
function pseudoRandomMatrix(rows: number, cols: number, seed: number): number[][] {
  const matrix: number[][] = [];
  let s = seed;
  for (let r = 0; r < rows; r++) {
    const row: number[] = [];
    for (let c = 0; c < cols; c++) {
      s = (s * 9301 + 49297) % 233280;
      const val = (s / 233280.0) * 2 - 1; // -1 to 1
      row.push(val);
    }
    matrix.push(row);
  }
  return matrix;
}

/**
 * Matrix multiplication A (n x k) * B (k x m)
 * Performance Optimization: Direct array allocation avoids Array.from zero-fill allocations.
 */
function matmul(A: number[][], B: number[][]): number[][] {
  const n = A.length;
  const k = A[0].length;
  const m = B[0].length;
  const res: number[][] = new Array(n);

  for (let i = 0; i < n; i++) {
    const rowA = A[i];
    const rowRes = new Array(m);
    for (let j = 0; j < m; j++) {
      let sum = 0;
      for (let p = 0; p < k; p++) {
        sum += rowA[p] * B[p][j];
      }
      rowRes[j] = sum;
    }
    res[i] = rowRes;
  }
  return res;
}

/**
 * Computes scaled dot-product scores (Q * K^T) / scaleFactor directly in a single pass.
 * Performance Optimization:
 * 1. Eliminates matrix transposition allocation (transpose(K)).
 * 2. Accesses Q and K rows contiguously in memory for faster CPU cache hits.
 * 3. Fuses matrix product and scaling step to avoid an extra 2D array allocation.
 */
function computeScaledAttentionScores(Q: number[][], K: number[][], scaleFactor: number): number[][] {
  const n = Q.length;
  const k = Q[0].length;
  const m = K.length;
  const res: number[][] = new Array(n);

  for (let i = 0; i < n; i++) {
    const rowQ = Q[i];
    const rowRes = new Array(m);
    for (let j = 0; j < m; j++) {
      const rowK = K[j];
      let sum = 0;
      for (let p = 0; p < k; p++) {
        sum += rowQ[p] * rowK[p];
      }
      rowRes[j] = sum / scaleFactor;
    }
    res[i] = rowRes;
  }
  return res;
}

/**
 * Softmax with numeric stability.
 * Performance Optimization: Single pre-allocated array with in-place multiplication by reciprocal sum,
 * eliminating extra array allocation per row from .map().
 */
function softmax(row: number[], maskIndices?: boolean[]): number[] {
  const len = row.length;
  let max = -Infinity;

  for (let i = 0; i < len; i++) {
    if (maskIndices && maskIndices[i]) continue;
    if (row[i] > max) max = row[i];
  }

  let sum = 0;
  const result: number[] = new Array(len);

  for (let i = 0; i < len; i++) {
    if (maskIndices && maskIndices[i]) {
      result[i] = 0;
    } else {
      const expVal = Math.exp(row[i] - max);
      result[i] = expVal;
      sum += expVal;
    }
  }

  if (sum > 0) {
    const invSum = 1 / sum;
    for (let i = 0; i < len; i++) {
      result[i] *= invSum;
    }
  } else {
    for (let i = 0; i < len; i++) {
      result[i] = 0;
    }
  }

  return result;
}

export interface AttentionComputation {
  tokens: string[];
  dIn: number;
  dOut: number;
  numHeads: number;
  causal: boolean;
  heads: AttentionHeadData[];
  qSample: number[][];
  kSample: number[][];
  vSample: number[][];
}

/**
 * Computes Multi-Head Causal Self-Attention as taught in Chapter 3
 */
export function computeMultiHeadAttention(
  tokens: string[],
  numHeads: number = 4,
  causal: boolean = true,
  dOut: number = 16
): AttentionComputation {
  const seqLen = tokens.length;
  const dIn = 8; // simplified feature dimension for clear visualization
  const dK = Math.max(2, Math.floor(dOut / numHeads));

  // Generate synthetic token embeddings X based on token characters
  const X: number[][] = tokens.map((token, tIdx) => {
    return Array.from({ length: dIn }, (_, i) => {
      const charCode = (token.charCodeAt(i % token.length) || 65) / 100;
      return Math.sin(tIdx + 1 + i * 0.7) + charCode * 0.3;
    });
  });

  const heads: AttentionHeadData[] = [];
  let sampleQ: number[][] = [];
  let sampleK: number[][] = [];
  let sampleV: number[][] = [];

  for (let h = 0; h < numHeads; h++) {
    const seed = 1000 + h * 237;
    const Wq = pseudoRandomMatrix(dIn, dK, seed + 1);
    const Wk = pseudoRandomMatrix(dIn, dK, seed + 2);
    const Wv = pseudoRandomMatrix(dIn, dK, seed + 3);

    const Q = matmul(X, Wq);
    const K = matmul(X, Wk);
    const V = matmul(X, Wv);

    if (h === 0) {
      sampleQ = Q;
      sampleK = K;
      sampleV = V;
    }

    // Scaled dot product Q * K^T / sqrt(dK) computed in a single cache-efficient pass
    const scaleFactor = Math.sqrt(dK);
    const scaledScores = computeScaledAttentionScores(Q, K, scaleFactor);

    // Apply causal mask and softmax
    const attentionWeights: number[][] = new Array(seqLen);
    for (let i = 0; i < seqLen; i++) {
      const maskFlags: boolean[] = new Array(seqLen);
      for (let j = 0; j < seqLen; j++) {
        maskFlags[j] = causal && j > i;
      }
      attentionWeights[i] = softmax(scaledScores[i], maskFlags);
    }

    heads.push({
      headIndex: h,
      tokens,
      matrix: attentionWeights,
      rawScores: scaledScores,
    });
  }

  return {
    tokens,
    dIn,
    dOut,
    numHeads,
    causal,
    heads,
    qSample: sampleQ,
    kSample: sampleK,
    vSample: sampleV,
  };
}
