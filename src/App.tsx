import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Overview } from './components/Overview';
import { TokenizationPlayground } from './components/TokenizationPlayground';
import { AttentionVisualizer } from './components/AttentionVisualizer';
import { ArchitectureExplorer } from './components/ArchitectureExplorer';
import { KVCacheLab } from './components/KVCacheLab';
import { TextGenerator } from './components/TextGenerator';
import { ClassificationPlayground } from './components/ClassificationPlayground';
import { InstructionChat } from './components/InstructionChat';
import { VercelApiModal } from './components/VercelApiModal';
import { ChapterId } from './types';
import { Language, LANGUAGES } from './data/translations';
import { Cpu, Code2 } from 'lucide-react';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<ChapterId>('overview');
  const [language, setLanguage] = useState<Language>('en');
  const [isApiModalOpen, setIsApiModalOpen] = useState<boolean>(false);

  const selectedLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];
  const isRtl = selectedLang.dir === 'rtl';

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white"
    >
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenApiModal={() => setIsApiModalOpen(true)}
        language={language}
        onSelectLanguage={setLanguage}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === 'overview' && (
          <Overview
            onSelectTab={setCurrentTab}
            language={language}
            onSelectLanguage={setLanguage}
          />
        )}
        {currentTab === 'ch02-tokenization' && <TokenizationPlayground />}
        {currentTab === 'ch03-attention' && <AttentionVisualizer />}
        {currentTab === 'ch04-architecture' && <ArchitectureExplorer />}
        {currentTab === 'kv-cache' && <KVCacheLab />}
        {currentTab === 'ch05-pretraining' && <TextGenerator />}
        {currentTab === 'ch06-classification' && <ClassificationPlayground />}
        {currentTab === 'ch07-instructions' && <InstructionChat />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs">
              <Cpu className="w-3.5 h-3.5" />
            </div>
            <span>
              Rewritten from <strong>mabsoutwassim-afk/LLMs-from-scratch</strong> as a standalone interactive React application.
            </span>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <span>
              Source: <em className="text-slate-300">Build a Large Language Model (From Scratch)</em> by Sebastian Raschka
            </span>
            <a
              href="https://github.com/rasbt/LLMs-from-scratch"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Code2 className="w-4 h-4 text-slate-400" />
              <span>Original Repo</span>
            </a>
          </div>
        </div>
      </footer>

      {/* API Health Modal */}
      <VercelApiModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
      />
    </div>
  );
};

export default App;
