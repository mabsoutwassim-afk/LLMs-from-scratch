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

// Matrix multiplication A (n x k) * B (k x m)
function matmul(A: number[][], B: number[][]): number[][] {
  const n = A.length;
  const k = A[0].length;
  const m = B[0].length;
  const res: number[][] = Array.from({ length: n }, () => Array(m).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      let sum = 0;
      for (let p = 0; p < k; p++) {
        sum += A[i][p] * B[p][j];
      }
      res[i][j] = sum;
    }
  }
  return res;
}

// Transpose B (r x c) -> (c x r)
function transpose(B: number[][]): number[][] {
  const r = B.length;
  const c = B[0].length;
  const T: number[][] = Array.from({ length: c }, () => Array(r).fill(0));
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < c; j++) {
      T[j][i] = B[i][j];
    }
  }
  return T;
}

// Softmax with numeric stability
function softmax(row: number[], maskIndices?: boolean[]): number[] {
  let max = -Infinity;
  for (let i = 0; i < row.length; i++) {
    if (maskIndices && maskIndices[i]) continue;
    if (row[i] > max) max = row[i];
  }

  let sum = 0;
  const expRow: number[] = [];
  for (let i = 0; i < row.length; i++) {
    if (maskIndices && maskIndices[i]) {
      expRow.push(0);
    } else {
      const expVal = Math.exp(row[i] - max);
      expRow.push(expVal);
      sum += expVal;
    }
  }

  return expRow.map(v => (sum > 0 ? v / sum : 0));
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

    // Dot product Q * K^T
    const KT = transpose(K);
    const rawScores = matmul(Q, KT);

    // Scale by sqrt(dK)
    const scaleFactor = Math.sqrt(dK);
    const scaledScores: number[][] = rawScores.map(row =>
      row.map(val => val / scaleFactor)
    );

    // Apply causal mask and softmax
    const attentionWeights: number[][] = [];
    for (let i = 0; i < seqLen; i++) {
      const maskFlags: boolean[] = [];
      for (let j = 0; j < seqLen; j++) {
        maskFlags.push(causal && j > i);
      }
      attentionWeights.push(softmax(scaledScores[i], maskFlags));
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
