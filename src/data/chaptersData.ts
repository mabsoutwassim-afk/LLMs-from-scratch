import { ChapterSummary, ModelConfig } from '../types';

export const GPT_MODEL_CONFIGS: Record<string, ModelConfig> = {
  'gpt2-small (124M)': {
    name: 'gpt2-small (124M)',
    size: '124M',
    vocabSize: 50257,
    contextLength: 1024,
    embDim: 768,
    nHeads: 12,
    nLayers: 12,
    dropRate: 0.0,
    qkvBias: true,
    paramsMillion: 124,
  },
  'gpt2-medium (355M)': {
    name: 'gpt2-medium (355M)',
    size: '355M',
    vocabSize: 50257,
    contextLength: 1024,
    embDim: 1024,
    nHeads: 16,
    nLayers: 24,
    dropRate: 0.0,
    qkvBias: true,
    paramsMillion: 355,
  },
  'gpt2-large (774M)': {
    name: 'gpt2-large (774M)',
    size: '774M',
    vocabSize: 50257,
    contextLength: 1024,
    embDim: 1280,
    nHeads: 20,
    nLayers: 36,
    dropRate: 0.0,
    qkvBias: true,
    paramsMillion: 774,
  },
  'gpt2-xl (1558M)': {
    name: 'gpt2-xl (1558M)',
    size: '1558M',
    vocabSize: 50257,
    contextLength: 1024,
    embDim: 1600,
    nHeads: 25,
    nLayers: 48,
    dropRate: 0.0,
    qkvBias: true,
    paramsMillion: 1558,
  },
  'qwen3-0.6b': {
    name: 'Qwen3-0.6B (Reasoning)',
    size: '0.6B',
    vocabSize: 151936,
    contextLength: 32768,
    embDim: 1024,
    nHeads: 16,
    nLayers: 24,
    dropRate: 0.0,
    qkvBias: false,
    paramsMillion: 590,
  },
};

export const CHAPTERS: ChapterSummary[] = [
  {
    id: 'ch01',
    number: 'Chapter 1',
    title: 'Understanding Large Language Models',
    subtitle: 'From N-grams to Modern Autoregressive Transformers',
    description: 'An overview of large language models, their evolution, self-supervised pretraining on web-scale text, and the 3-stage training pipeline (Pretraining -> Supervised Fine-Tuning -> Alignment / RLHF).',
    keyConcepts: [
      'Decoder-only autoregressive transformers',
      'Next-token prediction objective',
      'The 3 stages of LLM development: Pretraining, Fine-Tuning, Alignment',
      'Parameter scale vs. compute requirements',
      'GPT-2, Llama, and modern open-weight LLMs'
    ],
    codeFiles: ['ch01/README.md', 'ch01/reading-recommendations.md'],
  },
  {
    id: 'ch02',
    number: 'Chapter 2',
    title: 'Working with Text Data',
    subtitle: 'Tokenization, Embeddings & DataLoader',
    description: 'Preparing input text for deep neural networks: splitting text into tokens, handling unknown words with Byte-Pair Encoding (BPE), mapping tokens to embedding vectors, adding positional encodings, and building PyTorch DataLoaders with a sliding window.',
    keyConcepts: [
      'Word-level vs. Character-level vs. Subword Byte-Pair Encoding (BPE)',
      'TikToken GPT-2 vocabulary (50,257 tokens)',
      'Token Embeddings & Learned Positional Embeddings',
      'Sliding window sampling with context_size and stride',
      'PyTorch Dataset & DataLoader from scratch'
    ],
    codeFiles: [
      'pkg/llms_from_scratch/ch02.py',
      'ch02/01_main-chapter-code/ch02.ipynb',
      'ch02/05_bpe-from-scratch/bpe-from-scratch.ipynb'
    ],
  },
  {
    id: 'ch03',
    number: 'Chapter 3',
    title: 'Coding Attention Mechanisms',
    subtitle: 'Self-Attention, Causal Masking & Multi-Head Attention',
    description: 'The mathematical core of modern language models: computing attention weights using dot-product similarity, scaling by sqrt(d_k), causal masking to prevent looking into the future, and parallel multi-head attention.',
    keyConcepts: [
      'Query, Key, and Value (Q, K, V) projection matrices',
      'Scaled Dot-Product Attention: Softmax(Q K^T / sqrt(d_k)) * V',
      'Causal Attention Masking (upper triangular set to -infinity)',
      'Dropout on attention weights to prevent overfitting',
      'Multi-Head Attention (MHA) for parallel representation subspaces'
    ],
    codeFiles: [
      'pkg/llms_from_scratch/ch03.py',
      'ch03/01_main-chapter-code/ch03.ipynb',
      'ch03/02_bonus_efficient-multihead-attention/mha-implementations.ipynb'
    ],
  },
  {
    id: 'ch04',
    number: 'Chapter 4',
    title: 'Implementing a GPT Model from Scratch',
    subtitle: 'Transformer Blocks, LayerNorm, GELU & KV-Cache',
    description: 'Assembling the complete GPT model architecture in PyTorch: Layer Normalization, Gaussian Error Linear Units (GELU), residual connections, stacking transformer blocks, and output linear projections.',
    keyConcepts: [
      'LayerNorm vs. BatchNorm: normalizing across hidden dimensions',
      'GELU activation function with smooth approximations',
      'Shortcut / Residual connections for stable gradient flow',
      'Full TransformerBlock: LayerNorm -> MultiHeadAttention -> LayerNorm -> FeedForward',
      'GPTModel class assembling token embeddings, pos embeddings, transformer blocks, and final head',
      'KV Cache optimization for O(1) step inference'
    ],
    codeFiles: [
      'pkg/llms_from_scratch/ch04.py',
      'ch04/01_main-chapter-code/gpt.py',
      'ch04/03_kv-cache/gpt_with_kv_cache.py',
      'ch04/04_gqa/gpt_with_kv_gqa.py'
    ],
  },
  {
    id: 'ch05',
    number: 'Chapter 5',
    title: 'Pretraining on Unlabeled Data',
    subtitle: 'Cross-Entropy Loss, Training Loop & Text Generation',
    description: 'Training the GPT model from scratch using next-token prediction cross-entropy loss, tracking validation perplexity, implementing temperature and top-k sampling for diverse text generation, and loading OpenAI pretrained weights.',
    keyConcepts: [
      'Cross-entropy loss calculation on shifted target tokens',
      'Perplexity metric: exp(loss)',
      'AdamW optimizer and cosine learning rate schedules with warmup',
      'Greedy search vs. Temperature scaling vs. Top-K sampling',
      'Loading official OpenAI GPT-2 124M/355M/774M/1558M weights into our scratch architecture'
    ],
    codeFiles: [
      'pkg/llms_from_scratch/ch05.py',
      'ch05/01_main-chapter-code/gpt_train.py',
      'ch05/01_main-chapter-code/gpt_generate.py',
      'ch05/06_user_interface/app_orig.py'
    ],
  },
  {
    id: 'ch06',
    number: 'Chapter 6',
    title: 'Finetuning for Text Classification',
    subtitle: 'Classifying Spam & Sentiment with Pretrained GPT-2',
    description: 'Modifying the pretrained GPT-2 architecture for classification tasks by replacing the 50,257-class language modeling head with a 2-class linear output layer, freezing earlier transformer blocks, and finetuning on SMS spam and movie review datasets.',
    keyConcepts: [
      'Replacing output head (vocab_size -> num_classes)',
      'Extracting representation from the last token in the sequence',
      'Weight freezing strategies: finetuning all layers vs. only output head vs. last transformer block',
      'Evaluation metrics: classification accuracy, confusion matrix, F1-score',
      'Interactive SMS spam detection and sentiment analysis'
    ],
    codeFiles: [
      'pkg/llms_from_scratch/ch06.py',
      'ch06/01_main-chapter-code/gpt_class_finetune.py',
      'ch06/04_user_interface/app.py'
    ],
  },
  {
    id: 'ch07',
    number: 'Chapter 7',
    title: 'Finetuning with Instructions',
    subtitle: 'Instruction Alignment, Alpaca Prompting & DPO',
    description: 'Converting the raw next-token predictor into an assistant that follows human instructions. Implementing Alpaca-style prompt templates, supervised instruction finetuning (SFT), Direct Preference Optimization (DPO), and evaluating model responses.',
    keyConcepts: [
      'Instruction-following datasets (instruction, optional input, response)',
      'Alpaca format prompt masking so loss is only calculated on responses',
      'Supervised Finetuning (SFT) training loop',
      'Direct Preference Optimization (DPO) on paired preferences (chosen vs. rejected)',
      'Building ChatGPT-like conversational web interfaces'
    ],
    codeFiles: [
      'pkg/llms_from_scratch/ch07.py',
      'ch07/01_main-chapter-code/gpt_instruction_finetuning.py',
      'ch07/04_preference-tuning-with-dpo/dpo-from-scratch.ipynb',
      'ch07/06_user_interface/app.py',
      'ch05/11_qwen3/qwen3-chat-interface/qwen3-chat-interface.py'
    ],
  },
];

export const SAMPLE_TEXTS = {
  theVerdict: "I HAD always thought Jack Gisburn rather a cheap genius—though a good fellow enough—so when I heard he had married an American heiress who had bought the Victorian-style villa, I was not particularly surprised.",
  shortSample: "Every step you take towards building a large language model from scratch deepens your intuition.",
  smsSpamSamples: [
    { text: "Congratulations! You've won a $1,000 Walmart Gift Card. Click here to claim your prize now: http://win-now.cc/claim", label: "spam" },
    { text: "URGENT! Your mobile number was awarded £2,000 bonus credits in our weekly draw. Call 09066362206 to claim.", label: "spam" },
    { text: "Hey, are we still meeting at the library at 3pm to study for the machine learning midterm?", label: "ham" },
    { text: "Can you pick up some milk and eggs on your way home? Thanks!", label: "ham" },
    { text: "FREE entry into our weekly £1000 prize draw. Text WIN to 85222 to participate. T&Cs apply.", label: "spam" },
    { text: "The PyTorch training loss reached 0.05 after 10 epochs on the GPU cluster.", label: "ham" },
  ],
  reviewSentimentSamples: [
    { text: "This movie was an absolute masterpiece! The acting was stellar and the direction was sublime.", label: "positive" },
    { text: "A complete waste of two hours. Poor plot, wooden dialogue, and dreadful pacing throughout.", label: "negative" },
    { text: "One of the best sci-fi films ever produced, with breathtaking visual effects and profound questions.", label: "positive" },
    { text: "The script was unimaginative and the characters felt utterly flat and uninspired.", label: "negative" }
  ],
  instructionSamples: [
    {
      instruction: "Explain how self-attention works in simple terms for a beginner.",
      response: "Imagine reading a sentence like 'The animal didn't cross the street because it was too tired.' To understand what 'it' refers to, self-attention calculates a relevance score between 'it' and every other word in the sentence. It determines that 'animal' is heavily related to 'it', allowing the model to focus on the right context when computing the meaning."
    },
    {
      instruction: "What is the difference between Pretraining and Instruction Fine-tuning?",
      response: "Pretraining trains the model on massive amounts of raw web text to predict the next word. It teaches the model grammar, facts, and reasoning patterns, but the model acts like an autocomplete engine. Instruction Fine-Tuning (SFT) specifically trains the model on pairs of human instructions and high-quality responses, teaching it to behave like a helpful conversational assistant."
    },
    {
      instruction: "Write a short Python function implementing the scaled dot-product attention formula.",
      response: "```python\nimport torch\nimport torch.nn.functional as F\n\ndef scaled_dot_product_attention(Q, K, V, mask=None):\n    d_k = Q.size(-1)\n    scores = torch.matmul(Q, K.transpose(-2, -1)) / (d_k ** 0.5)\n    if mask is not None:\n        scores = scores.masked_fill(mask == 0, float('-inf'))\n    attention_weights = F.softmax(scores, dim=-1)\n    output = torch.matmul(attention_weights, V)\n    return output, attention_weights\n```"
    }
  ]
};
