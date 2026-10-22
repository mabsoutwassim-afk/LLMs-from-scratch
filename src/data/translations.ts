export type Language = 'en' | 'fr' | 'es' | 'ar';

export interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'es', name: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
];

export interface FeatureTranslation {
  chapter: string;
  title: string;
  description: string;
}

export interface ChapterTranslation {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  keyConcepts: string[];
}

export interface TranslationSet {
  languageName: string;
  selectLanguage: string;
  // Hero section
  badge: string;
  heroTitle: string;
  heroSubtitle: string;
  btnStartCh2: string;
  btnTryGen: string;
  // Interactive playgrounds section
  playgroundsTitle: string;
  playgroundsSubtitle: string;
  openPlayground: string;
  features: Record<string, FeatureTranslation>;
  // Chapters syllabus section
  syllabusTitle: string;
  syllabusSubtitle: string;
  launchLab: string;
  chapters: Record<string, ChapterTranslation>;
  // Navbar & App
  nav: {
    overview: string;
    ch02: string;
    ch03: string;
    ch04: string;
    kvCache: string;
    ch05: string;
    ch06: string;
    ch07: string;
    apiStatus: string;
    githubSource: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationSet> = {
  en: {
    languageName: 'English',
    selectLanguage: 'Language',
    badge: 'Build a Large Language Model (From Scratch)',
    heroTitle: 'The Interactive Deep Learning Workbench for LLMs',
    heroSubtitle:
      'Rewritten as a full-featured React application. Explore every stage of building, pretraining, fine-tuning, and serving a decoder-only Large Language Model from foundational tensor operations up to conversational instruction assistants.',
    btnStartCh2: 'Start with Chapter 2 (BPE)',
    btnTryGen: 'Try Text Generator (Ch 5)',

    playgroundsTitle: 'Interactive Chapter Playgrounds & Tools',
    playgroundsSubtitle:
      "Direct ports and interactive simulations of the codebase's user interfaces and architectures",
    openPlayground: 'Open Playground',

    features: {
      'ch02-tokenization': {
        chapter: 'Chapter 2',
        title: 'Tokenization & DataLoader',
        description:
          'Interactive GPT-2 BPE tokenizer, token ID mapping, and sliding window dataset batch generator.',
      },
      'ch03-attention': {
        chapter: 'Chapter 3',
        title: 'Multi-Head Causal Attention',
        description:
          'Real-time scaled dot-product attention calculation, causal masking toggle, and attention heatmaps.',
      },
      'ch04-architecture': {
        chapter: 'Chapter 4',
        title: 'Full Transformer Architecture',
        description:
          'Explore the complete PyTorch GPTModel pipeline, LayerNorm, GELU, and theoretical parameter calculations.',
      },
      'kv-cache': {
        chapter: 'Advanced Ch4',
        title: 'KV-Cache Memory & GQA Lab',
        description:
          'Memory footprint estimator comparing MHA, Grouped-Query Attention (GQA), MLA, and Sliding Window Attention.',
      },
      'ch05-pretraining': {
        chapter: 'Chapter 5 UI',
        title: 'Pretrained Text Generator',
        description:
          'Live autoregressive text generation with temperature, top-K sampling, and token distribution analysis.',
      },
      'ch06-classification': {
        chapter: 'Chapter 6 UI',
        title: 'Finetuned Text Classifier',
        description:
          'Classify SMS spam and movie reviews using a fine-tuned GPT-2 classification head with token attribution.',
      },
      'ch07-instructions': {
        chapter: 'Chapter 7 UI',
        title: 'Instruction Chat & DPO',
        description:
          'Conversational assistant using the Alpaca instruction template and Direct Preference Optimization (DPO).',
      },
    },

    syllabusTitle: 'Book Chapters & PyTorch Package Structure',
    syllabusSubtitle:
      'Complete reference to the 7 core chapters implemented in pkg/llms_from_scratch',
    launchLab: 'Launch Lab',

    chapters: {
      ch01: {
        number: 'Chapter 1',
        title: 'Understanding Large Language Models',
        subtitle: 'From N-grams to Modern Autoregressive Transformers',
        description:
          'An overview of large language models, their evolution, self-supervised pretraining on web-scale text, and the 3-stage training pipeline (Pretraining -> Supervised Fine-Tuning -> Alignment / RLHF).',
        keyConcepts: [
          'Decoder-only autoregressive transformers',
          'Next-token prediction objective',
          'The 3 stages of LLM development: Pretraining, Fine-Tuning, Alignment',
          'Parameter scale vs. compute requirements',
          'GPT-2, Llama, and modern open-weight LLMs',
        ],
      },
      ch02: {
        number: 'Chapter 2',
        title: 'Working with Text Data',
        subtitle: 'Tokenization, Embeddings & DataLoader',
        description:
          'Preparing input text for deep neural networks: splitting text into tokens, handling unknown words with Byte-Pair Encoding (BPE), mapping tokens to embedding vectors, adding positional encodings, and building PyTorch DataLoaders with a sliding window.',
        keyConcepts: [
          'Word-level vs. Character-level vs. Subword Byte-Pair Encoding (BPE)',
          'TikToken GPT-2 vocabulary (50,257 tokens)',
          'Token Embeddings & Learned Positional Embeddings',
          'Sliding window sampling with context_size and stride',
          'PyTorch Dataset & DataLoader from scratch',
        ],
      },
      ch03: {
        number: 'Chapter 3',
        title: 'Coding Attention Mechanisms',
        subtitle: 'Self-Attention, Causal Masking & Multi-Head Attention',
        description:
          'The mathematical core of modern language models: computing attention weights using dot-product similarity, scaling by sqrt(d_k), causal masking to prevent looking into the future, and parallel multi-head attention.',
        keyConcepts: [
          'Query, Key, and Value (Q, K, V) projection matrices',
          'Scaled Dot-Product Attention: Softmax(Q K^T / sqrt(d_k)) * V',
          'Causal Attention Masking (upper triangular set to -infinity)',
          'Dropout on attention weights to prevent overfitting',
          'Multi-Head Attention (MHA) for parallel representation subspaces',
        ],
      },
      ch04: {
        number: 'Chapter 4',
        title: 'Implementing a GPT Model from Scratch',
        subtitle: 'Transformer Blocks, LayerNorm, GELU & KV-Cache',
        description:
          'Assembling the complete GPT model architecture in PyTorch: Layer Normalization, Gaussian Error Linear Units (GELU), residual connections, stacking transformer blocks, and output linear projections.',
        keyConcepts: [
          'LayerNorm vs. BatchNorm: normalizing across hidden dimensions',
          'GELU activation function with smooth approximations',
          'Shortcut / Residual connections for stable gradient flow',
          'Full TransformerBlock: LayerNorm -> MultiHeadAttention -> LayerNorm -> FeedForward',
          'GPTModel class assembling token embeddings, pos embeddings, transformer blocks, and final head',
          'KV Cache optimization for O(1) step inference',
        ],
      },
      ch05: {
        number: 'Chapter 5',
        title: 'Pretraining on Unlabeled Data',
        subtitle: 'Cross-Entropy Loss, Training Loop & Text Generation',
        description:
          'Training the GPT model from scratch using next-token prediction cross-entropy loss, tracking validation perplexity, implementing temperature and top-k sampling for diverse text generation, and loading OpenAI pretrained weights.',
        keyConcepts: [
          'Cross-entropy loss calculation on shifted target tokens',
          'Perplexity metric: exp(loss)',
          'AdamW optimizer and cosine learning rate schedules with warmup',
          'Greedy search vs. Temperature scaling vs. Top-K sampling',
          'Loading official OpenAI GPT-2 124M/355M/774M/1558M weights into our scratch architecture',
        ],
      },
      ch06: {
        number: 'Chapter 6',
        title: 'Finetuning for Text Classification',
        subtitle: 'Classifying Spam & Sentiment with Pretrained GPT-2',
        description:
          'Modifying the pretrained GPT-2 architecture for classification tasks by replacing the 50,257-class language modeling head with a 2-class linear output layer, freezing earlier transformer blocks, and finetuning on SMS spam and movie review datasets.',
        keyConcepts: [
          'Replacing output head (vocab_size -> num_classes)',
          'Extracting representation from the last token in the sequence',
          'Weight freezing strategies: finetuning all layers vs. only output head vs. last transformer block',
          'Evaluation metrics: classification accuracy, confusion matrix, F1-score',
          'Interactive SMS spam detection and sentiment analysis',
        ],
      },
      ch07: {
        number: 'Chapter 7',
        title: 'Finetuning with Instructions',
        subtitle: 'Instruction Alignment, Alpaca Prompting & DPO',
        description:
          'Converting the raw next-token predictor into an assistant that follows human instructions. Implementing Alpaca-style prompt templates, supervised instruction finetuning (SFT), Direct Preference Optimization (DPO), and evaluating model responses.',
        keyConcepts: [
          'Instruction-following datasets (instruction, optional input, response)',
          'Alpaca format prompt masking so loss is only calculated on responses',
          'Supervised Finetuning (SFT) training loop',
          'Direct Preference Optimization (DPO) on paired preferences (chosen vs. rejected)',
          'Building ChatGPT-like conversational web interfaces',
        ],
      },
    },

    nav: {
      overview: 'Overview',
      ch02: 'Ch 2: BPE & Tokens',
      ch03: 'Ch 3: Attention',
      ch04: 'Ch 4: Architecture',
      kvCache: 'KV-Cache Lab',
      ch05: 'Ch 5: Generator',
      ch06: 'Ch 6: Classifier',
      ch07: 'Ch 7: Instructions & DPO',
      apiStatus: 'API Status',
      githubSource: 'GitHub Source',
    },
  },

  fr: {
    languageName: 'Français',
    selectLanguage: 'Langue',
    badge: 'Construire un grand modèle de langage (à partir de zéro)',
    heroTitle: "L'Atelier Interactif d'Apprentissage Profond pour les LLMs",
    heroSubtitle:
      "Réécrit sous la forme d'une application React complète. Explorez chaque étape de la construction, du pré-entraînement, du réglage fin et de la mise en service d'un modèle de langage à décodeur uniquement, des opérations de tenseurs fondamentales jusqu'aux assistants conversationnels d'instructions.",
    btnStartCh2: 'Commencer avec le Chapitre 2 (BPE)',
    btnTryGen: 'Essayer le Générateur de Texte (Ch 5)',

    playgroundsTitle: 'Ateliers et Outils Interactifs des Chapitres',
    playgroundsSubtitle:
      'Simulations interactives et adaptations directes des interfaces et architectures de la base de code',
    openPlayground: "Ouvrir l'Atelier",

    features: {
      'ch02-tokenization': {
        chapter: 'Chapitre 2',
        title: 'Tokenisation et DataLoader',
        description:
          "Tokeniseur BPE GPT-2 interactif, mappage d'identifiants de tokens et générateur de lots par fenêtre glissante.",
      },
      'ch03-attention': {
        chapter: 'Chapitre 3',
        title: 'Attention Causale Multi-Têtes',
        description:
          "Calcul de l'attention par produit scalaire échelonné en temps réel, masquage causal et cartes thermiques d'attention.",
      },
      'ch04-architecture': {
        chapter: 'Chapitre 4',
        title: 'Architecture Transformer Complète',
        description:
          'Explorez le pipeline complet PyTorch GPTModel, LayerNorm, GELU et les calculs théoriques de paramètres.',
      },
      'kv-cache': {
        chapter: 'Ch4 Avancé',
        title: 'Laboratoire Mémoire KV-Cache & GQA',
        description:
          "Estimateur d'empreinte mémoire comparant MHA, l'Attention à Requêtes Groupées (GQA), MLA et l'Attention à Fenêtre Glissante.",
      },
      'ch05-pretraining': {
        chapter: 'Interface Ch 5',
        title: 'Générateur de Texte Pré-entraîné',
        description:
          "Génération de texte autorégressive en direct avec température, échantillonnage top-K et analyse de la distribution des tokens.",
      },
      'ch06-classification': {
        chapter: 'Interface Ch 6',
        title: 'Classificateur de Texte Affiné',
        description:
          "Classifiez les SMS spams et les critiques de films à l'aide d'une tête de classification GPT-2 affinée avec attribution de tokens.",
      },
      'ch07-instructions': {
        chapter: 'Interface Ch 7',
        title: "Chat d'Instructions & DPO",
        description:
          "Assistant conversationnel utilisant le modèle d'instruction Alpaca et l'Optimisation Directe des Préférences (DPO).",
      },
    },

    syllabusTitle: duLivre('Chapitres du Livre & Structure du Paquet PyTorch'),
    syllabusSubtitle:
      'Référence complète des 7 chapitres principaux implémentés dans pkg/llms_from_scratch',
    launchLab: 'Lancer le Labo',

    chapters: {
      ch01: {
        number: 'Chapitre 1',
        title: 'Comprendre les Grands Modèles de Langage',
        subtitle: 'Des N-grammes aux Transformers Autorégressifs Modernes',
        description:
          'Vue d\'ensemble des grands modèles de langage, leur évolution, le pré-entraînement auto-supervisé sur du texte à l\'échelle du web et le pipeline d\'entraînement en 3 étapes (Pré-entraînement -> Réglage fin supervisé -> Alignement / RLHF).',
        keyConcepts: [
          'Transformers autorégressifs à décodeur uniquement',
          'Objectif de prédiction du token suivant',
          'Les 3 étapes du développement de LLM: Pré-entraînement, Réglage fin, Alignement',
          'Échelle des paramètres vs. exigences de calcul',
          'GPT-2, Llama et LLMs modernes à poids ouverts',
        ],
      },
      ch02: {
        number: 'Chapitre 2',
        title: 'Travailler avec les Données Textuelles',
        subtitle: 'Tokenisation, Plongements & DataLoader',
        description:
          'Préparation du texte d\'entrée pour les réseaux de neurones profonds: division du texte en tokens, gestion des mots inconnus avec le Byte-Pair Encoding (BPE), mappage des tokens en vecteurs de plongement, ajout d\'encodages positionnels et construction de DataLoaders PyTorch avec fenêtre glissante.',
        keyConcepts: [
          'Niveau mot vs. Niveau caractère vs. Encodage par paires d\'octets (BPE)',
          'Vocabulaire TikToken GPT-2 (50 257 tokens)',
          'Plongements de tokens & Plongements positionnels appris',
          'Échantillonnage par fenêtre glissante avec taille de contexte et pas',
          'Dataset & DataLoader PyTorch à partir de zéro',
        ],
      },
      ch03: {
        number: 'Chapitre 3',
        title: 'Coder les Mécanismes d\'Attention',
        subtitle: 'Auto-Attention, Masquage Causal & Attention Multi-Têtes',
        description:
          'Le cœur mathématique des modèles de langage modernes: calcul des poids d\'attention à l\'aide de la similarité par produit scalaire, mise à l\'échelle par sqrt(d_k), masquage causal pour empêcher d\'anticiper le futur, et attention multi-têtes parallèle.',
        keyConcepts: [
          'Matrices de projection Requête, Clé et Valeur (Q, K, V)',
          'Attention par Produit Scalaire Échelonné: Softmax(Q K^T / sqrt(d_k)) * V',
          'Masquage d\'Attention Causal (partie supérieure triangulaire fixée à -infini)',
          'Dropout sur les poids d\'attention pour éviter le surapprentissage',
          'Attention Multi-Têtes (MHA) pour sous-espaces de représentation parallèles',
        ],
      },
      ch04: {
        number: 'Chapitre 4',
        title: 'Implémenter un Modèle GPT à Partir de Zéro',
        subtitle: 'Blocs Transformer, LayerNorm, GELU & KV-Cache',
        description:
          'Assemblage de l\'architecture complète du modèle GPT dans PyTorch: Normalisation de couche (LayerNorm), Unités linéaires d\'erreur gaussienne (GELU), connexions résiduelles, empilement de blocs transformer et projections linéaires de sortie.',
        keyConcepts: [
          'LayerNorm vs. BatchNorm: normalisation sur les dimensions cachées',
          'Fonction d\'activation GELU avec approximations lisses',
          'Connexions résiduelles pour un flux de gradient stable',
          'Bloc Transformer complet: LayerNorm -> MultiHeadAttention -> LayerNorm -> FeedForward',
          'Classe GPTModel assemblant plongements de tokens, plongements positionnels, blocs transformer et tête finale',
          'Optimisation KV Cache pour inférence en étapes O(1)',
        ],
      },
      ch05: {
        number: 'Chapitre 5',
        title: 'Pré-entraînement sur des Données Non Étiquetées',
        subtitle: 'Perte d\'Entropie Croisée, Boucle d\'Entraînement & Génération de Texte',
        description:
          'Entraînement du modèle GPT à partir de zéro en utilisant la perte d\'entropie croisée de prédiction du token suivant, suivi de la perplexité de validation, mise en œuvre de la température et de l\'échantillonnage top-k pour une génération de texte variée, et chargement des poids pré-entraînés OpenAI.',
        keyConcepts: [
          'Calcul de perte d\'entropie croisée sur tokens cibles décalés',
          'Métrique de perplexité: exp(perte)',
          'Optimiseur AdamW et planificateurs de taux d\'apprentissage en cosinus avec préchauffage',
          'Recherche gloutonne vs. Ajustement de température vs. Échantillonnage Top-K',
          'Chargement des poids officiels OpenAI GPT-2 (124M/355M/774M/1558M) dans notre architecture',
        ],
      },
      ch06: {
        number: 'Chapitre 6',
        title: 'Réglage Fin pour la Classification de Texte',
        subtitle: 'Classification du Spam & des Sentiments avec GPT-2 Pré-entraîné',
        description:
          'Modification de l\'architecture GPT-2 pré-entraînée pour les tâches de classification en remplaçant la tête de modélisation de langage à 50 257 classes par une couche de sortie linéaire à 2 classes, le gel des blocs transformer précédents et le réglage fin sur des jeux de données de SMS spams et de critiques de films.',
        keyConcepts: [
          'Remplacement de la tête de sortie (vocab_size -> num_classes)',
          'Extraction de la représentation à partir du dernier token de la séquence',
          'Stratégies de gel des poids: réglage fin de toutes les couches vs. uniquement la tête de sortie vs. dernier bloc transformer',
          'Métriques d\'évaluation: précision de classification, matrice de confusion, score F1',
          'Détection interactive de SMS spams et analyse de sentiments',
        ],
      },
      ch07: {
        number: 'Chapitre 7',
        title: 'Réglage Fin avec des Instructions',
        subtitle: 'Alignement d\'Instructions, Formatage Alpaca & DPO',
        description:
          'Conversion du prédicteur de token brut en un assistant qui suit les instructions humaines. Implémentation de modèles d\'instructions de style Alpaca, réglage fin supervisé des instructions (SFT), optimisation directe des préférences (DPO) et évaluation des réponses du modèle.',
        keyConcepts: [
          'Jeux de données de suivi d\'instructions (instruction, entrée optionnelle, réponse)',
          'Masquage de modèle de format Alpaca pour que la perte ne soit calculée que sur les réponses',
          'Boucle d\'entraînement de réglage fin supervisé (SFT)',
          'Optimisation Directe des Préférences (DPO) sur des paires de préférences (choisi vs. rejeté)',
          'Construction d\'interfaces web conversationnelles de type ChatGPT',
        ],
      },
    },

    nav: {
      overview: 'Aperçu',
      ch02: 'Ch 2: BPE & Tokens',
      ch03: 'Ch 3: Attention',
      ch04: 'Ch 4: Architecture',
      kvCache: 'Labo KV-Cache',
      ch05: 'Ch 5: Générateur',
      ch06: 'Ch 6: Classificateur',
      ch07: 'Ch 7: Instructions & DPO',
      apiStatus: 'Statut API',
      githubSource: 'Source GitHub',
    },
  },

  es: {
    languageName: 'Español',
    selectLanguage: 'Idioma',
    badge: 'Construir un gran modelo de lenguaje (desde cero)',
    heroTitle: 'El Banco de Trabajo Interactivo de Aprendizaje Profundo para LLMs',
    heroSubtitle:
      'Reescrito como una aplicación React completa. Explore cada etapa de construcción, preentrenamiento, ajuste fino y servicio de un modelo de lenguaje de solo decodificador, desde operaciones de tensores fundamentales hasta asistentes conversacionales de instrucciones.',
    btnStartCh2: 'Comenzar con el Capítulo 2 (BPE)',
    btnTryGen: 'Probar Generador de Texto (Cap 5)',

    playgroundsTitle: 'Laboratorios y Herramientas Interactivas de Capítulos',
    playgroundsSubtitle:
      'Simulaciones interactivas y adaptaciones directas de las interfaces y arquitecturas de la base de código',
    openPlayground: 'Abrir Laboratorio',

    features: {
      'ch02-tokenization': {
        chapter: 'Capítulo 2',
        title: 'Tokenización y DataLoader',
        description:
          'Tokenizador BPE GPT-2 interactivo, mapeo de IDs de tokens y generador de lotes por ventana deslizante.',
      },
      'ch03-attention': {
        chapter: 'Capítulo 3',
        title: 'Atención Causal Multicabeza',
        description:
          'Cálculo de atención de producto escalar escalado en tiempo real, máscara causal y mapas de calor de atención.',
      },
      'ch04-architecture': {
        chapter: 'Capítulo 4',
        title: 'Arquitectura Transformer Completa',
        description:
          'Explore el flujo completo de PyTorch GPTModel, LayerNorm, GELU y cálculos teóricos de parámetros.',
      },
      'kv-cache': {
        chapter: 'Cap 4 Avanzado',
        title: 'Laboratorio de Memoria KV-Cache y GQA',
        description:
          'Estimador de huella de memoria que compara MHA, Atención de Consultas Agrupadas (GQA), MLA y Atención con Ventana Deslizante.',
      },
      'ch05-pretraining': {
        chapter: 'Interfaz Cap 5',
        title: 'Generador de Texto Preentrenado',
        description:
          'Generación de texto autorregresiva en vivo con temperatura, muestreo top-K y análisis de distribución de tokens.',
      },
      'ch06-classification': {
        chapter: 'Interfaz Cap 6',
        title: 'Clasificador de Texto Ajustado',
        description:
          'Clasifique spam de SMS y reseñas de películas utilizando una cabeza de clasificación GPT-2 ajustada con atribución de tokens.',
      },
      'ch07-instructions': {
        chapter: 'Interfaz Cap 7',
        title: 'Chat de Instrucciones y DPO',
        description:
          'Asistente conversacional que utiliza la plantilla de instrucciones Alpaca y Optimización de Preferencias Directas (DPO).',
      },
    },

    syllabusTitle: 'Capítulos del Libro y Estructura del Paquete PyTorch',
    syllabusSubtitle:
      'Referencia completa de los 7 capítulos principales implementados en pkg/llms_from_scratch',
    launchLab: 'Iniciar Lab',

    chapters: {
      ch01: {
        number: 'Capítulo 1',
        title: 'Comprendiendo los Grandes Modelos de Lenguaje',
        subtitle: 'Desde N-gramas hasta Transformers Autorregresivos Modernos',
        description:
          'Una visión general de los grandes modelos de lenguaje, su evolución, preentrenamiento autosupervisado en texto a escala web y el flujo de entrenamiento de 3 etapas (Preentrenamiento -> Ajuste fino supervisado -> Alineación / RLHF).',
        keyConcepts: [
          'Transformers autorregresivos de solo decodificador',
          'Objetivo de predicción del siguiente token',
          'Las 3 etapas del desarrollo de LLM: Preentrenamiento, Ajuste Fino, Alineación',
          'Escala de parámetros vs. requisitos de cómputo',
          'GPT-2, Llama y LLMs modernos de pesos abiertos',
        ],
      },
      ch02: {
        number: 'Capítulo 2',
        title: 'Trabajando con Datos de Texto',
        subtitle: 'Tokenización, Embeddings y DataLoader',
        description:
          'Preparación de texto de entrada para redes neuronales profundas: división de texto en tokens, manejo de palabras desconocidas con Byte-Pair Encoding (BPE), mapeo de tokens a vectores de embedding, adición de codificaciones posicionales y construcción de DataLoaders de PyTorch con ventana deslizante.',
        keyConcepts: [
          'Nivel de palabra vs. Nivel de carácter vs. Codificación por pares de bytes (BPE)',
          'Vocabulario TikToken GPT-2 (50.257 tokens)',
          'Embeddings de tokens y embeddings posicionales aprendidos',
          'Muestreo de ventana deslizante con tamaño de contexto y paso',
          'Dataset y DataLoader de PyTorch desde cero',
        ],
      },
      ch03: {
        number: 'Capítulo 3',
        title: 'Codificando Mecanismos de Atención',
        subtitle: 'Autoatención, Máscara Causal y Atención Multicabeza',
        description:
          'El núcleo matemático de los modelos de lenguaje modernos: cálculo de pesos de atención mediante similitud de producto escalar, escalado por sqrt(d_k), máscara causal para evitar mirar al futuro y atención multicabeza paralela.',
        keyConcepts: [
          'Matrices de proyección Consulta, Clave y Valor (Q, K, V)',
          'Atención de Producto Escalar Escalado: Softmax(Q K^T / sqrt(d_k)) * V',
          'Máscara de Atención Causal (triangular superior fijada en -infinito)',
          'Dropout en pesos de atención para prevenir sobreajuste',
          'Atención Multicabeza (MHA) para subespacios de representación paralelos',
        ],
      },
      ch04: {
        number: 'Capítulo 4',
        title: 'Implementando un Modelo GPT desde Cero',
        subtitle: 'Bloques Transformer, LayerNorm, GELU y KV-Cache',
        description:
          'Ensamblado de la arquitectura completa del modelo GPT en PyTorch: Normalización de capa (LayerNorm), Unidades Lineales de Error Gaussiano (GELU), conexiones residuales, apilamiento de bloques transformer y proyecciones lineales de salida.',
        keyConcepts: [
          'LayerNorm vs. BatchNorm: normalización en dimensiones ocultas',
          'Función de activación GELU con aproximaciones suaves',
          'Conexiones residuales para un flujo de gradiente estable',
          'Bloque Transformer completo: LayerNorm -> MultiHeadAttention -> LayerNorm -> FeedForward',
          'Clase GPTModel que ensambla embeddings de tokens, posicionales, bloques y cabeza final',
          'Optimización KV Cache para inferencia en pasos O(1)',
        ],
      },
      ch05: {
        number: 'Capítulo 5',
        title: 'Preentrenamiento en Datos No Etiquetados',
        subtitle: 'Pérdida de Entropía Cruzada, Bucle de Entrenamiento y Generación de Texto',
        description:
          'Entrenamiento del modelo GPT desde cero utilizando pérdida de entropía cruzada de predicción del siguiente token, seguimiento de perplejidad de validación, implementación de temperatura y muestreo top-k para generación de texto diversa, y carga de pesos preentrenados de OpenAI.',
        keyConcepts: [
          'Cálculo de pérdida de entropía cruzada en tokens objetivo desplazados',
          'Métrica de perplejidad: exp(pérdida)',
          'Optimizador AdamW y programa de tasa de aprendizaje de coseno con calentamiento',
          'Búsqueda codiciosa vs. Escalado de temperatura vs. Muestreo Top-K',
          'Carga de pesos oficiales de OpenAI GPT-2 (124M/355M/774M/1558M) en nuestra arquitectura',
        ],
      },
      ch06: {
        number: 'Capítulo 6',
        title: 'Ajuste Fino para Clasificación de Texto',
        subtitle: 'Clasificando Spam y Sentimiento con GPT-2 Preentrenado',
        description:
          'Modificación de la arquitectura GPT-2 preentrenada para tareas de clasificación reemplazando la cabeza de modelado de lenguaje de 50.257 clases por una capa de salida lineal de 2 clases, congelamiento de bloques transformer anteriores y ajuste fino en conjuntos de datos de spam de SMS y reseñas de películas.',
        keyConcepts: [
          'Reemplazo de la cabeza de salida (vocab_size -> num_classes)',
          'Extracción de representación a partir del último token de la secuencia',
          'Estrategias de congelamiento de pesos: ajuste fino de todas las capas vs. solo cabeza de salida vs. último bloque',
          'Métricas de evaluación: precisión de clasificación, matriz de confusión, puntuación F1',
          'Detección interactiva de spam en SMS y análisis de sentimiento',
        ],
      },
      ch07: {
        number: 'Capítulo 7',
        title: 'Ajuste Fino con Instrucciones',
        subtitle: 'Alineación de Instrucciones, Formato Alpaca y DPO',
        description:
          'Conversión del predictor de tokens sin formato en un asistente que sigue instrucciones humanas. Implementación de plantillas de instrucciones estilo Alpaca, ajuste fino supervisado (SFT), Optimización de Preferencias Directas (DPO) y evaluación de respuestas.',
        keyConcepts: [
          'Conjuntos de datos de seguimiento de instrucciones (instrucción, entrada opcional, respuesta)',
          'Máscara de plantilla con formato Alpaca para calcular pérdida solo en respuestas',
          'Bucle de entrenamiento de ajuste fino supervisado (SFT)',
          'Optimización de Preferencias Directas (DPO) en pares de preferencias (elegido vs. rechazado)',
          'Construcción de interfaces web conversacionales tipo ChatGPT',
        ],
      },
    },

    nav: {
      overview: 'Visión General',
      ch02: 'Cap 2: BPE y Tokens',
      ch03: 'Cap 3: Atención',
      ch04: 'Cap 4: Arquitectura',
      kvCache: 'Lab KV-Cache',
      ch05: 'Cap 5: Generador',
      ch06: 'Cap 6: Clasificador',
      ch07: 'Cap 7: Instrucciones y DPO',
      apiStatus: 'Estado API',
      githubSource: 'Código GitHub',
    },
  },

  ar: {
    languageName: 'العربية',
    selectLanguage: 'اللغة',
    badge: 'بناء نموذج لغوي كبير (من الصفر)',
    heroTitle: 'بيئة العمل التفاعلية للتعلم العميق للنماذج اللغوية الكبيرة',
    heroSubtitle:
      'تمت إعادة كتابته كتطبيق React كامل الميزات. استكشف كل مرحلة من مراحل البناء والتدريب المسبق والضبط الدقيق وتقديم نموذج لغوي كبير يعتمد على فك الترميز فقط، بدءاً من عمليات الموتر الأساسية وحتى المساعدين التفاعليين للتعليمات.',
    btnStartCh2: 'البدء بالفصل الثاني (BPE)',
    btnTryGen: 'تجربة مولد النصوص (الفصل 5)',

    playgroundsTitle: 'المختبرات والأدوات التفاعلية للفصول',
    playgroundsSubtitle:
      'محاكاة تفاعلية وتطبيقات مباشرة لواجهات المستخدم وبنيات كود المصدر',
    openPlayground: 'فتح المختبر',

    features: {
      'ch02-tokenization': {
        chapter: 'الفصل 2',
        title: 'الترميز ومحمل البيانات',
        description:
          'مجزئ النصوص BPE لـ GPT-2 التفاعلي، ورسم خرائط معرفات الرموز، ومولد الدفعات بأسلوب النافذة المنزلقة.',
      },
      'ch03-attention': {
        chapter: 'الفصل 3',
        title: 'الانتباه السببي متعدد الرؤوس',
        description:
          'حساب الانتباه للضرب النقطي الموزون في الوقت الفعلي، وتفعيل القناع السببي، وخريطة الانتباه الحرارية.',
      },
      'ch04-architecture': {
        chapter: 'الفصل 4',
        title: 'بنية المحول الكاملة',
        description:
          'استكشف خط معالجة PyTorch GPTModel الكامل، وNorm الطبقة، وGELU، وحسابات المعلمات النظرية.',
      },
      'kv-cache': {
        chapter: 'الفصل 4 المتقدم',
        title: 'مختبر ذاكرة KV-Cache و GQA',
        description:
          'حاسبة استخدام الذاكرة لتقييم ومقارنة الانتباه متعدد الرؤوس (MHA)، وانتباه الاستعلامات المجمعة (GQA)، وMLA، وانتباه النافذة المنزلقة.',
      },
      'ch05-pretraining': {
        chapter: 'واجهة الفصل 5',
        title: 'مولد النصوص المدرب مسبقاً',
        description:
          'توليد النصوص التلقائي المباشر مع ضبط درجة الحرارة، وعينات top-K، وتحليل توزيع الرموز.',
      },
      'ch06-classification': {
        chapter: 'واجهة الفصل 6',
        title: 'مصنف النصوص الضبط الدقيق',
        description:
          'تصنيف الرسائل القصيرة المزعجة ومراجعات الأفلام باستخدام رأس تصنيف GPT-2 دقيق مع إسناد الرموز.',
      },
      'ch07-instructions': {
        chapter: 'واجهة الفصل 7',
        title: 'دردشة التعليمات وتحسين التفضيل المباشر',
        description:
          'مساعد محادثة باستخدام قالب تعليمات Alpaca وتحسين التفضيل المباشر (DPO).',
      },
    },

    syllabusTitle: 'فصول الكتاب وبنية حزمة PyTorch',
    syllabusSubtitle:
      'مرجع كامل للفصول السبعة الأساسية المنفذة في pkg/llms_from_scratch',
    launchLab: 'بدء المختبر',

    chapters: {
      ch01: {
        number: 'الفصل 1',
        title: 'فهم النماذج اللغوية الكبيرة',
        subtitle: 'من نماذج N-gram إلى محولات التوليد الذاتي الحديثة',
        description:
          'نظرة عامة على النماذج اللغوية الكبيرة، وتطورها، والتدريب المسبق الذاتي على نصوص الإنترنت، ومسار التدريب المكون من 3 مراحل (التدريب المسبق -> الضبط الدقيق الموجه -> المحاذاة / RLHF).',
        keyConcepts: [
          'محولات التوليد الذاتي التي تعتمد على فك الترميز فقط',
          'هدف التنبؤ بالرمز التالي',
          'المراحل الثلاث لتطوير النماذج: التدريب المسبق، الضبط الدقيق، المحاذاة',
          'حجم المعلمات مقابل متطلبات الحساب',
          'GPT-2 و Llama والنماذج الحديثة مفتوحة الوزن',
        ],
      },
      ch02: {
        number: 'الفصل 2',
        title: 'التعامل مع البيانات النصية',
        subtitle: 'الترميز، التضمينات ومحمل البيانات',
        description:
          'إعداد النص المدخل للشبكات العصبية العميقة: تقسيم النص إلى رموز، والتعامل مع الكلمات غير المعروفة باستخدام ترميز أزواج البايت (BPE)، ورسم خرائط الرموز إلى متجهات التضمين، وإضافة التضمينات المكانية، وبناء محمل البيانات PyTorch بأسلوب النافذة المنزلقة.',
        keyConcepts: [
          'مستوى الكلمة مقابل مستوى الحرف مقابل ترميز أزواج البايت (BPE)',
          'قاموس TikToken لـ GPT-2 (50,257 رمزاً)',
          'تضمينات الرموز والتضمينات المكانية المتعلمة',
          'أخذ العينات بالنافذة المنزلقة مع حجم السياق والخطوة',
          'مجموعة البيانات ومحمل البيانات من الصفر في PyTorch',
        ],
      },
      ch03: {
        number: 'الفصل 3',
        title: 'برمجة آليات الانتباه',
        subtitle: 'الانتباه الذاتي، القناع السببي والانتباه متعدد الرؤوس',
        description:
          'الجوهر الرياضي للنماذج اللغوية الحديثة: حساب أوزان الانتباه باستخدام تشابه الضرب النقطي، والتقسيم على جذر(d_k)، والقناع السببي لمنع النظر إلى المستقبل، والانتباه المتوازي متعدد الرؤوس.',
        keyConcepts: [
          'مصفوفات الإسقاط للاستعلام والمفتاح والقيمة (Q, K, V)',
          'الانتباه بالضرب النقطي الموزون: Softmax(Q K^T / sqrt(d_k)) * V',
          'قناع الانتباه السببي (تعيين الجزء المثلثي العلوي إلى -ما لا نهاية)',
          'الأسقاط (Dropout) على أوزان الانتباه لمنع الافراط في المطابقة',
          'الانتباه متعدد الرؤوس (MHA) لمساحات التمثيل المتوازية',
        ],
      },
      ch04: {
        number: 'الفصل 4',
        title: 'تطبيق نموذج GPT من الصفر',
        subtitle: 'كتل المحول، LayerNorm، GELU و KV-Cache',
        description:
          'تجميع بنية نموذج GPT الكاملة في PyTorch: تطبيع الطبقة (LayerNorm)، وحدات الخطأ غاوس الخطي (GELU)، الاتصالات المتبقية، تجميع كتل المحول، والإسقاطات الخطية للمخرجات.',
        keyConcepts: [
          'LayerNorm مقابل BatchNorm: التطبيع عبر الأبعاد الخفية',
          'دالة التنشيط GELU مع التقريبات الملساء',
          'الاتصالات المتبقية لضمان تدفق متدرج مستقر',
          'كتلة المحول الكاملة: LayerNorm -> MultiHeadAttention -> LayerNorm -> FeedForward',
          'فئة GPTModel التي تجمع تضمينات الرموز والتضمينات المكانية وكتل المحول',
          'تحسين ذاكرة KV Cache لاستدلال في خطوات O(1)',
        ],
      },
      ch05: {
        number: 'الفصل 5',
        title: 'التدريب المسبق على بيانات غير معنونة',
        subtitle: 'خسارة الاعتراء المتقاطع، دورة التدريب وتوليد النصوص',
        description:
          'تدريب نموذج GPT من الصفر باستخدام خسارة الاعتراء المتقاطع للتنبؤ بالرمز التالي، وتتبع الحيرة في التحقق، وتطبيق درجة الحرارة وأخذ عينات top-k لتوليد نصوص متنوعة، وتحميل أوزان OpenAI المدربة مسبقاً.',
        keyConcepts: [
          'حساب خسارة الاعتراء المتقاطع على الرموز المستهدفة المزاحة',
          'مقياس الحيرة (Perplexity): exp(loss)',
          'محسن AdamW وجداول معدل التعلم الجيبي مع الإحماء',
          'البحث الجشع مقابل قياس درجة الحرارة مقابل أخذ عينات Top-K',
          'تحميل أوزان OpenAI الرسمية لـ GPT-2 في بنيتنا المصممة من الصفر',
        ],
      },
      ch06: {
        number: 'الفصل 6',
        title: 'الضبط الدقيق لتصنيف النصوص',
        subtitle: 'تصنيف الرسائل المزعجة والمشاعر باستخدام GPT-2 المدرب مسبقاً',
        description:
          'تعديل بنية GPT-2 المدربة مسبقاً لمهام التصنيف عن طريق استبدال رأس نمذجة اللغة المكون من 50,257 فئة بطبقة إخراج خطية ذات فئتين، وتجميد كتل المحول السابقة، والضبط الدقيق على مجموعات بيانات الرسائل المزعجة ومراجع الأفلام.',
        keyConcepts: [
          'استبدال رأس الإخراج (vocab_size -> num_classes)',
          'استخراج التمثيل من الرمز الأخير في التسلسل',
          'استراتيجيات تجميد الأوزان: الضبط الدقيق لجميع الطبقات مقابل رأس الإخراج فقط',
          'مقاييس التقييم: دقة التصنيف، مصفوفة الارتباك، درجة F1',
          'الكشف التفاعلي عن الرسائل المزعجة وتحليل المشاعر',
        ],
      },
      ch07: {
        number: 'الفصل 7',
        title: 'الضبط الدقيق باستخدام التعليمات',
        subtitle: 'محاذاة التعليمات، صيغة Alpaca وتحسين التفضيل المباشر DPO',
        description:
          'تحويل المتبنئ بالرموز الخام إلى مساعد يتبع التعليمات البشرية. تطبيق قوالب التعليمات بأسلوب Alpaca، والضبط الدقيق الموجه للتعليمات (SFT)، وتحسين التفضيل المباشر (DPO)، وتقييم استجابات النموذج.',
        keyConcepts: [
          'مجموعات بيانات اتباع التعليمات (التعليمات، المدخلات الاختيارية، الاستجابة)',
          'قناع قالب Alpaca بحيث يتم حساب الخسارة على الاستجابات فقط',
          'دورة تدريب الضبط الدقيق الموجه (SFT)',
          'تحسين التفضيل المباشر (DPO) على أزواج التفضيلات (المختار مقابل المرفوض)',
          'بناء واجهات ويب تفاعلية للمحادثة شبيهة بـ ChatGPT',
        ],
      },
    },

    nav: {
      overview: 'نظرة عامة',
      ch02: 'فصل 2: الترميز والرموز',
      ch03: 'فصل 3: الانتباه',
      ch04: 'فصل 4: البنية',
      kvCache: 'مختبر ذاكرة KV',
      ch05: 'فصل 5: المولد',
      ch06: 'فصل 6: المصنف',
      ch07: 'فصل 7: التعليمات و DPO',
      apiStatus: 'حالة API',
      githubSource: 'مصدر GitHub',
    },
  },
};

// Helper function to handle fallback text for non-fr string call in helper
function duLivre(str: string): string {
  return str;
}
