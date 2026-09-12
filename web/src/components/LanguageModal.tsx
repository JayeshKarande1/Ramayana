'use client';

import React from 'react';
import { X, Check, Globe, Sparkles } from 'lucide-react';
import { useLanguage, LANGUAGES, LanguageCode } from '@/context/LanguageContext';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LanguageModal({ isOpen, onClose }: LanguageModalProps) {
  const { language, setLanguage } = useLanguage();

  if (!isOpen) return null;

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl rounded-3xl bg-[#0e0a1b] border border-amber-400/30 p-6 sm:p-8 shadow-[0_0_60px_rgba(245,158,11,0.15)] relative animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-5 border-b border-amber-400/20 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-gold-gradient">
                  Select Language
                </h3>
                <span className="font-sanskrit text-xs text-amber-300/80 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-400/20">
                  भाषा चयनम्
                </span>
              </div>
              <p className="text-xs text-[#a39eb5] mt-0.5 font-light">
                Choose your preferred language for scripture &amp; navigation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[#a39eb5] hover:text-white transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Languages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {LANGUAGES.map(lang => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`p-4 rounded-2xl border text-left transition-all relative group cursor-pointer flex flex-col justify-between min-h-[96px] ${
                  isSelected
                    ? 'saffron-gradient text-black font-bold shadow-lg shadow-amber-500/25 border-amber-400 scale-[1.02]'
                    : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/10 hover:border-amber-400/40 text-[#f5efe6]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`font-sanskrit text-base sm:text-lg font-bold ${isSelected ? 'text-black' : 'text-amber-200 group-hover:text-amber-300'}`}>
                    {lang.nativeName}
                  </span>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center text-black">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                  )}
                </div>
                <div>
                  <span className={`text-xs block font-medium ${isSelected ? 'text-black/80' : 'text-[#a39eb5]'}`}>
                    {lang.name}
                  </span>
                  <span className={`text-[10px] uppercase font-mono tracking-wider ${isSelected ? 'text-black/60' : 'text-amber-400/60'}`}>
                    {lang.script}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Hint */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-[#a39eb5]">
          <span className="flex items-center gap-1.5 text-[11px]">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Applies instantly across menus, labels &amp; transliteration</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
