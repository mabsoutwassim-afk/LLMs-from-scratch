import React, { useState, useRef, useEffect } from 'react';
import { LANGUAGES, Language } from '../data/translations';
import { Globe, Check, ChevronDown } from 'lucide-react';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  variant?: 'navbar' | 'hero' | 'standalone';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onSelectLanguage,
  variant = 'navbar',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLangOption = LANGUAGES.find((l) => l.code === currentLanguage) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (variant === 'hero') {
    return (
      <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 border border-slate-700/80 p-2 rounded-2xl shadow-xl backdrop-blur">
        <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300">
          <Globe className="w-4 h-4 text-blue-400" />
          <span>Language / Langue / Idioma / اللغة:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {LANGUAGES.map((lang) => {
            const isSelected = currentLanguage === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => onSelectLanguage(lang.code)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 ring-1 ring-blue-400'
                    : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60'
                }`}
              >
                <span className="text-sm">{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/70 rounded-xl transition-all cursor-pointer shadow-sm"
        aria-label="Select Language"
      >
        <Globe className="w-3.5 h-3.5 text-blue-400" />
        <span className="text-sm">{selectedLangOption.flag}</span>
        <span className="hidden sm:inline font-semibold">{selectedLangOption.name}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-slate-900 border border-slate-700/90 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase border-b border-slate-800">
            Select Language
          </div>
          {LANGUAGES.map((lang) => {
            const isSelected = currentLanguage === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => {
                  onSelectLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600/20 text-blue-300 font-bold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">{lang.flag}</span>
                  <span>{lang.name}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-blue-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
