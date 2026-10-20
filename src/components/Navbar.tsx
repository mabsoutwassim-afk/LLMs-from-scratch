import React from 'react';
import { 
  BookOpen, 
  Cpu, 
  Eye, 
  Boxes, 
  Sparkles, 
  CheckSquare, 
  MessageSquare, 
  Zap,
  Activity,
  Layers
} from 'lucide-react';
import { ChapterId } from '../types';

interface NavbarProps {
  currentTab: ChapterId;
  onSelectTab: (tab: ChapterId) => void;
  onOpenApiModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenApiModal,
}) => {
  const navItems = [
    { id: 'overview' as ChapterId, label: 'Overview', icon: BookOpen },
    { id: 'ch02-tokenization' as ChapterId, label: 'Ch 2: BPE & Tokens', icon: Boxes },
    { id: 'ch03-attention' as ChapterId, label: 'Ch 3: Attention', icon: Eye },
    { id: 'ch04-architecture' as ChapterId, label: 'Ch 4: Architecture', icon: Layers },
    { id: 'kv-cache' as ChapterId, label: 'KV-Cache Lab', icon: Zap },
    { id: 'ch05-pretraining' as ChapterId, label: 'Ch 5: Generator', icon: Sparkles },
    { id: 'ch06-classification' as ChapterId, label: 'Ch 6: Classifier', icon: CheckSquare },
    { id: 'ch07-instructions' as ChapterId, label: 'Ch 7: Instructions & DPO', icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & title */}
          <div 
            onClick={() => onSelectTab('overview')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Cpu className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-100 text-lg tracking-tight">LLMs from Scratch</span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full">
                  PyTorch Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Interactive companion to Sebastian Raschka's guide
              </p>
            </div>
          </div>

          {/* Action buttons on the right */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onOpenApiModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-300 bg-emerald-950/40 border border-emerald-800/60 rounded-lg hover:bg-emerald-900/40 transition-colors"
              title="Test original Vercel Python API health endpoint"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">API Status</span>: <span className="text-emerald-400 font-mono">ok</span>
            </button>

            <a
              href="https://github.com/rasbt/LLMs-from-scratch"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors px-2 py-1 rounded"
            >
              GitHub Source
            </a>
          </div>
        </div>

        {/* Scrollable Navigation Bar */}
        <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-800/60 text-sm">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
