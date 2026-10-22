import React from 'react';
import { CHAPTERS } from '../data/chaptersData';
import { ChapterId } from '../types';
import { Language, TRANSLATIONS } from '../data/translations';
import { LanguageSelector } from './LanguageSelector';
import { 
  BookOpen, 
  Boxes, 
  Eye, 
  Layers, 
  Sparkles, 
  CheckSquare, 
  MessageSquare, 
  ArrowRight, 
  ArrowLeft,
  Zap
} from 'lucide-react';

interface OverviewProps {
  onSelectTab: (tab: ChapterId) => void;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
}

export const Overview: React.FC<OverviewProps> = ({
  onSelectTab,
  language,
  onSelectLanguage,
}) => {
  const t = TRANSLATIONS[language];
  const isRtl = language === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const chapterTabMapping: { [key: string]: ChapterId } = {
    ch02: 'ch02-tokenization',
    ch03: 'ch03-attention',
    ch04: 'ch04-architecture',
    ch05: 'ch05-pretraining',
    ch06: 'ch06-classification',
    ch07: 'ch07-instructions',
  };

  const interactiveFeatures = [
    {
      id: 'ch02-tokenization' as ChapterId,
      icon: Boxes,
      color: 'from-blue-600 to-cyan-500',
    },
    {
      id: 'ch03-attention' as ChapterId,
      icon: Eye,
      color: 'from-indigo-600 to-purple-500',
    },
    {
      id: 'ch04-architecture' as ChapterId,
      icon: Layers,
      color: 'from-emerald-600 to-teal-500',
    },
    {
      id: 'kv-cache' as ChapterId,
      icon: Zap,
      color: 'from-cyan-600 to-blue-500',
    },
    {
      id: 'ch05-pretraining' as ChapterId,
      icon: Sparkles,
      color: 'from-amber-500 to-orange-500',
    },
    {
      id: 'ch06-classification' as ChapterId,
      icon: CheckSquare,
      color: 'from-rose-600 to-pink-500',
    },
    {
      id: 'ch07-instructions' as ChapterId,
      icon: MessageSquare,
      color: 'from-purple-600 to-indigo-600',
    },
  ];

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-12 shadow-2xl space-y-6">
        {/* Language Selector prominent banner on top of Hero */}
        <div className="relative z-10 pb-2">
          <LanguageSelector
            currentLanguage={language}
            onSelectLanguage={onSelectLanguage}
            variant="hero"
          />
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400">
            <BookOpen className="w-3.5 h-3.5" />
            {t.badge}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {t.heroTitle}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {t.heroSubtitle}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onSelectTab('ch02-tokenization')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <span>{t.btnStartCh2}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelectTab('ch05-pretraining')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{t.btnTryGen}</span>
            </button>
          </div>
        </div>

        {/* Ambient background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Interactive Playgrounds Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {t.playgroundsTitle}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {t.playgroundsSubtitle}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {interactiveFeatures.map((item) => {
            const Icon = item.icon;
            const featInfo = t.features[item.id] || {
              chapter: '',
              title: item.id,
              description: '',
            };

            return (
              <div
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className="group relative bg-slate-900 border border-slate-800 hover:border-slate-700 p-6 rounded-2xl cursor-pointer transition-all hover:scale-[1.01] hover:shadow-xl hover:shadow-slate-950/50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${item.color} p-0.5 flex items-center justify-center shadow-md`}>
                      <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      {featInfo.chapter}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                    {featInfo.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {featInfo.description}
                  </p>
                </div>

                <div className="flex items-center text-xs font-semibold text-blue-400 group-hover:text-blue-300 gap-1 mt-4 pt-4 border-t border-slate-800/80">
                  <span>{t.openPlayground}</span>
                  <ArrowIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Complete Chapters Syllabus & Reference */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {t.syllabusTitle}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {t.syllabusSubtitle}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {CHAPTERS.map((ch) => {
            const tabId = chapterTabMapping[ch.id];
            const chTrans = t.chapters[ch.id] || {
              number: ch.number,
              title: ch.title,
              subtitle: ch.subtitle,
              description: ch.description,
              keyConcepts: ch.keyConcepts,
            };

            return (
              <div
                key={ch.id}
                className="p-5 bg-slate-950 rounded-2xl border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-wider font-mono">
                      {chTrans.number}
                    </span>
                    <span className="text-slate-600">•</span>
                    <h3 className="text-base font-bold text-white">
                      {chTrans.title}
                    </h3>
                  </div>
                  <div className="text-xs font-medium text-slate-400">
                    {chTrans.subtitle}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pt-1">
                    {chTrans.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {chTrans.keyConcepts.slice(0, 3).map((concept, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-slate-900 text-slate-300 border border-slate-800">
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>

                {tabId && (
                  <button
                    onClick={() => onSelectTab(tabId)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5 shrink-0 transition-colors"
                  >
                    <span>{t.launchLab}</span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
