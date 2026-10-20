import React, { useState, useRef, useEffect } from 'react';
import { 
  streamInstructionResponse, 
  formatAlpacaPrompt, 
  DPO_EXAMPLES 
} from '../services/instructionEngine';
import { SAMPLE_TEXTS } from '../data/chaptersData';
import { ChatMessage } from '../types';
import { 
  MessageSquare, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  ChevronDown, 
  ChevronUp, 
  Sliders, 
  ThumbsUp, 
  ThumbsDown,
  Layers,
  Code
} from 'lucide-react';

export const InstructionChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I am the fine-tuned instruction model from Chapter 7. You can ask me questions about building LLMs, attention mechanisms, tokenization, or request Python code snippets.",
      timestamp: 'Just now',
    }
  ]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [modelType, setModelType] = useState<'gpt2-sft' | 'qwen3-thinking'>('gpt2-sft');
  const [showThinkingMap, setShowThinkingMap] = useState<{ [id: string]: boolean }>({});
  const [activeTab, setActiveTab] = useState<'chat' | 'dpo-explorer' | 'prompt-template'>('chat');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming]);

  const handleSend = async (userPrompt?: string) => {
    const textToSend = userPrompt || inputValue;
    if (!textToSend.trim() || isStreaming) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: 'Now',
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsStreaming(true);

    const assistantMsgId = `assistant-${Date.now()}`;
    const formattedPrompt = formatAlpacaPrompt(textToSend);

    const assistantPlaceholder: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      thinking: '',
      timestamp: 'Now',
      formattedPrompt,
    };

    setMessages(prev => [...prev, assistantPlaceholder]);
    if (modelType === 'qwen3-thinking') {
      setShowThinkingMap(prev => ({ ...prev, [assistantMsgId]: true }));
    }

    try {
      const generator = streamInstructionResponse(textToSend, modelType);
      let contentAcc = '';
      let thinkingAcc = '';

      for await (const { contentChunk, thinkingChunk, isThinking } of generator) {
        if (isThinking && thinkingChunk) {
          thinkingAcc += thinkingChunk;
        } else if (contentChunk) {
          contentAcc += contentChunk;
        }

        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMsgId
              ? {
                  ...msg,
                  content: contentAcc,
                  thinking: thinkingAcc || undefined,
                }
              : msg
          )
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-full">
                Chapter 7 User Interface: Instruction Finetuning & DPO
              </span>
              <span className="text-xs text-slate-400">ch07/06_user_interface/app.py</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Instruction-Following Chat & Alignment Workbench
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl">
              Port of the Chapter 7 and Qwen3 interactive interfaces. Transforms the raw next-token predictor into an assistant via supervised fine-tuning (SFT) and Direct Preference Optimization (DPO).
            </p>
          </div>

          {/* Model Switcher */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setModelType('gpt2-sft')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                modelType === 'gpt2-sft'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              GPT-2 Medium (355M) SFT
            </button>
            <button
              onClick={() => setModelType('qwen3-thinking')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                modelType === 'qwen3-thinking'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Qwen3-0.6B (Thinking Mode)
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab('chat')}
          className={`pb-3 px-4 text-sm font-medium border-b-2 transition-all ${
            activeTab === 'chat'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Conversational Chat
        </button>
        <button
          onClick={() => setActiveTab('dpo-explorer')}
          className={`pb-3 px-4 text-sm font-medium border-b-2 transition-all ${
            activeTab === 'dpo-explorer'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          DPO Preference Tuning Lab
        </button>
        <button
          onClick={() => setActiveTab('prompt-template')}
          className={`pb-3 px-4 text-sm font-medium border-b-2 transition-all ${
            activeTab === 'prompt-template'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Alpaca Prompt Formatting Inspector
        </button>
      </div>

      {/* View 1: Chat Interface */}
      {activeTab === 'chat' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[600px] overflow-hidden">
          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${
                  msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-purple-600 text-white'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Content Bubble */}
                <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white font-medium rounded-tr-none'
                    : 'bg-slate-950 text-slate-100 border border-slate-800/80 rounded-tl-none'
                }`}>
                  {/* Thinking Section if present */}
                  {msg.thinking && (
                    <div className="mb-3 border border-purple-900/60 bg-purple-950/30 rounded-xl overflow-hidden">
                      <button
                        onClick={() =>
                          setShowThinkingMap(prev => ({ ...prev, [msg.id]: !prev[msg.id] }))
                        }
                        className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-purple-300 font-semibold bg-purple-950/50 hover:bg-purple-900/30 transition-colors"
                      >
                        <span className="flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                          Chain-of-Thought Reasoning
                        </span>
                        {showThinkingMap[msg.id] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                      {showThinkingMap[msg.id] && (
                        <div className="p-3 text-xs font-mono text-purple-200/80 whitespace-pre-wrap border-t border-purple-900/40">
                          {msg.thinking}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="whitespace-pre-wrap">{msg.content}</div>

                  {/* Formatted prompt pill */}
                  {msg.formattedPrompt && (
                    <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                      <span>Model: {modelType}</span>
                      <span className="font-mono">Alpaca Masked SFT</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Prompt Suggestions */}
          <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-slate-400 shrink-0">Try asking:</span>
            {SAMPLE_TEXTS.instructionSamples.map((s, idx) => (
              <button
                key={idx}
                disabled={isStreaming}
                onClick={() => handleSend(s.instruction)}
                className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 whitespace-nowrap border border-slate-700 transition-colors shrink-0"
              >
                {s.instruction}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-slate-950 border-t border-slate-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isStreaming}
                placeholder="Ask the instruction-finetuned assistant..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
              />
              <button
                type="submit"
                disabled={isStreaming || !inputValue.trim()}
                className={`p-3 rounded-xl transition-all ${
                  isStreaming || !inputValue.trim()
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/30'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* View 2: DPO Explorer */}
      {activeTab === 'dpo-explorer' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Direct Preference Optimization (DPO) Dataset Pairs
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              As implemented in <span className="font-mono text-purple-300">ch07/04_preference-tuning-with-dpo/</span>: Instead of training a separate reward model as in PPO, DPO directly optimizes the policy model using the implicit reward from paired human preferences.
            </p>
          </div>

          <div className="space-y-4">
            {DPO_EXAMPLES.map((ex, i) => (
              <div key={i} className="bg-slate-950 p-5 rounded-xl border border-slate-800/80 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Instruction: "{ex.instruction}"
                  </span>
                  <span className="text-xs font-mono text-purple-400 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/60">
                    Reward Margin: +{ex.margin.toFixed(2)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Chosen */}
                  <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/60 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                      <span className="flex items-center gap-1.5">
                        <ThumbsUp className="w-3.5 h-3.5" />
                        Chosen (Preferred y_w)
                      </span>
                      <span className="font-mono">LogProb: {ex.chosenLogProb}</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-mono">
                      {ex.chosen}
                    </p>
                  </div>

                  {/* Rejected */}
                  <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-800/60 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-rose-400">
                      <span className="flex items-center gap-1.5">
                        <ThumbsDown className="w-3.5 h-3.5" />
                        Rejected (Dispreferred y_l)
                      </span>
                      <span className="font-mono">LogProb: {ex.rejectedLogProb}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-mono">
                      {ex.rejected}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 3: Alpaca Prompt Formatting */}
      {activeTab === 'prompt-template' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Code className="w-5 h-5 text-amber-400" />
            Alpaca Prompt Formatting & Loss Masking
          </h3>
          <p className="text-xs text-slate-300">
            During supervised fine-tuning in Chapter 7, prompts must be formatted in a standardized structure so the model recognizes instructions. Crucially, PyTorch cross-entropy loss is <strong>masked on the instruction tokens</strong> (set to <span className="font-mono text-amber-400">-100</span>) so the model is only penalized for errors in the generated response!
          </p>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto whitespace-pre">
            <span className="text-slate-500"># ch07/01_main-chapter-code/gpt_instruction_finetuning.py</span>{'\n'}
            <span className="text-purple-400">def</span> <span className="text-yellow-300">format_input</span>(entry):{'\n'}
            {'    '}instruction_text = (<span className="text-emerald-400">f"Below is an instruction that describes a task. "</span>{'\n'}
            {'                        '}<span className="text-emerald-400">f"Write a response that appropriately completes the request.\n\n"</span>{'\n'}
            {'                        '}<span className="text-emerald-400">f"### Instruction:\n{`{entry['instruction']}`}\n\n"</span>{'\n'}
            {'                        '}<span className="text-emerald-400">f"### Response:\n"</span>){'\n'}
            {'    '}response_text = entry[<span className="text-emerald-400">"output"</span>]{'\n'}
            {'    '}return instruction_text + response_text
          </div>
        </div>
      )}
    </div>
  );
};
