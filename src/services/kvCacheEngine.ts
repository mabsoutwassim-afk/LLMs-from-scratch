export interface KVCacheMetrics {
  contextLength: number;
  batchSize: number;
  nLayers: number;
  nHeads: number;
  dHead: number;
  precisionBytes: number; // 2 for fp16/bf16, 4 for fp32, 1 for int8
}

export interface KVCacheEstimate {
  technique: string;
  cacheMemoryMB: number;
  bandwidthReductionPercent: number;
  flopsSavedPerStepPercent: number;
  description: string;
}

/**
 * Calculates KV cache memory in Megabytes for various attention variants
 * Memory formula: 2 * batch_size * n_layers * num_kv_heads * context_length * d_head * bytes_per_element / (1024^2)
 */
export function estimateKVCacheMemory(metrics: KVCacheMetrics): KVCacheEstimate[] {
  const { contextLength, batchSize, nLayers, nHeads, dHead, precisionBytes } = metrics;

  // Standard Multi-Head Attention (MHA): n_kv_heads = nHeads
  const mhaBytes = 2 * batchSize * nLayers * nHeads * contextLength * dHead * precisionBytes;
  const mhaMB = mhaBytes / (1024 * 1024);

  // Grouped Query Attention (GQA): e.g. 4 or 8 query heads per KV head (ratio 4:1 or 8:1)
  const gqaHeads = Math.max(1, Math.floor(nHeads / 4));
  const gqaBytes = 2 * batchSize * nLayers * gqaHeads * contextLength * dHead * precisionBytes;
  const gqaMB = gqaBytes / (1024 * 1024);

  // Multi-Head Latent Attention (MLA as in DeepSeek): low-rank compression (compression ratio ~4.5x)
  const mlaMB = mhaMB * 0.22;

  // Sliding Window Attention (SWA as in Mistral): window size typically 4096 or 1024
  const windowSize = Math.min(contextLength, 1024);
  const swaBytes = 2 * batchSize * nLayers * nHeads * windowSize * dHead * precisionBytes;
  const swaMB = swaBytes / (1024 * 1024);

  // Layer KV Sharing (e.g., sharing KV heads across every 2 layers)
  const kvSharingMB = mhaMB * 0.5;

  return [
    {
      technique: 'Multi-Head Attention (Standard MHA)',
      cacheMemoryMB: parseFloat(mhaMB.toFixed(2)),
      bandwidthReductionPercent: 0,
      flopsSavedPerStepPercent: 88,
      description: 'Stores separate Key and Value vectors for all heads and all layers. Fast step latency but linear memory growth with context.',
    },
    {
      technique: 'Grouped-Query Attention (GQA)',
      cacheMemoryMB: parseFloat(gqaMB.toFixed(2)),
      bandwidthReductionPercent: 75,
      flopsSavedPerStepPercent: 91,
      description: 'Groups multiple query heads to share a single Key/Value head pair (e.g., Llama 3, Qwen 2.5). Reduces memory by 4x–8x.',
    },
    {
      technique: 'Multi-Head Latent Attention (MLA)',
      cacheMemoryMB: parseFloat(mlaMB.toFixed(2)),
      bandwidthReductionPercent: 78,
      flopsSavedPerStepPercent: 92,
      description: 'Compresses KV into low-rank latent representation vectors before caching, drastically cutting memory during generation.',
    },
    {
      technique: 'Sliding Window Attention (SWA)',
      cacheMemoryMB: parseFloat(swaMB.toFixed(2)),
      bandwidthReductionPercent: Math.max(0, Math.round((1 - windowSize / contextLength) * 100)),
      flopsSavedPerStepPercent: 89,
      description: 'Limits attention memory to a fixed sliding context window (e.g. 1024 tokens), bounding memory indefinitely for infinite generation.',
    },
    {
      technique: 'Cross-Layer KV Sharing',
      cacheMemoryMB: parseFloat(kvSharingMB.toFixed(2)),
      bandwidthReductionPercent: 50,
      flopsSavedPerStepPercent: 90,
      description: 'Shares computed Key and Value states across consecutive transformer layers, halving total cache allocations.',
    },
  ];
}
