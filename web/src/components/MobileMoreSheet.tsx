'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Users, Shield, Compass, Calendar, Globe, Volume2, Sparkles, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { tanpura } from '@/lib/audio';

interface MobileMoreSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLanguage: () => void;
}

export default function MobileMoreSheet({ isOpen, onClose, onOpenLanguage }: MobileMoreSheetProps) {
  const { currentLanguageInfo, t } = useLanguage();
  const [isTanpuraPlaying, setIsTanpuraPlaying] = useState(false);

  if (!isOpen) return null;

  const toggleTanpura = () => {
    if (tanpura) {
      const active = tanpura.toggle();
      setIsTanpuraPlaying(active);
    }
  };

  const handleOpenPrologue = () => {
    onClose();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('open-ramayana-prologue'));
    }
  };

  const handleOpenLanguage = () => {
    onClose();
    onOpenLanguage();
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Tap backdrop to dismiss */}
      <div className="flex-1 w-full" onClick={onClose} />

      {/* Slide-Up Bottom Sheet */}
      <div 
        className="w-full bg-[#0c0918] border-t border-amber-400/25 rounded-t-3xl p-5 pb-safe shadow-[0_-15px_40px_rgba(0,0,0,0.8)] animate-sheet-up flex flex-col max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Drag Handle Bar */}
        <div className="w-12 h-1.5 rounded-full bg-white/20 mx-auto mb-4" />

        {/* Sheet Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-cinzel text-sm font-bold text-gold-gradient">
                Sacred Portals &amp; Tools
              </h3>
              <p className="text-[10px] text-[#a39eb5]">
                वाल्मीकि रामायण प्रवेशद्वाराणि
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-[#a39eb5] hover:text-white"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Primary Secondary Portals Grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {/* Charitra */}
          <Link
            href="/characters"
            onClick={onClose}
            className="p-3 rounded-2xl bg-white/[0.03] active:bg-amber-500/15 border border-white/10 active:border-amber-400/40 flex flex-col justify-between app-touch-active min-h-[82px]"
          >
            <div className="flex items-center justify-between">
              <Users className="w-4 h-4 text-amber-400" />
              <ChevronRight className="w-3.5 h-3.5 text-white/30" />
            </div>
            <div>
              <span className="font-semibold text-xs text-amber-100 block">
                {t('nav_characters')}
              </span>
              <span className="text-[10px] text-[#a39eb5] block">
                194 Lineages
              </span>
            </div>
          </Link>

          {/* Divyastra */}
          <Link
            href="/relics"
            onClick={onClose}
            className="p-3 rounded-2xl bg-white/[0.03] active:bg-amber-500/15 border border-white/10 active:border-amber-400/40 flex flex-col justify-between app-touch-active min-h-[82px]"
          >
            <div className="flex items-center justify-between">
              <Shield className="w-4 h-4 text-amber-400" />
              <ChevronRight className="w-3.5 h-3.5 text-white/30" />
            </div>
            <div>
              <span className="font-semibold text-xs text-amber-100 block">
                {t('nav_relics')}
              </span>
              <span className="text-[10px] text-[#a39eb5] block">
                Divine Arsenal
              </span>
            </div>
          </Link>

          {/* Dharma Niti */}
          <Link
            href="/compass"
            onClick={onClose}
            className="p-3 rounded-2xl bg-white/[0.03] active:bg-amber-500/15 border border-white/10 active:border-amber-400/40 flex flex-col justify-between app-touch-active min-h-[82px]"
          >
            <div className="flex items-center justify-between">
              <Compass className="w-4 h-4 text-amber-400" />
              <ChevronRight className="w-3.5 h-3.5 text-white/30" />
            </div>
            <div>
              <span className="font-semibold text-xs text-amber-100 block">
                {t('nav_compass')}
              </span>
              <span className="text-[10px] text-[#a39eb5] block">
                Ethical Dilemmas
              </span>
            </div>
          </Link>

          {/* Parayana */}
          <Link
            href="/parayana"
            onClick={onClose}
            className="p-3 rounded-2xl bg-white/[0.03] active:bg-amber-500/15 border border-white/10 active:border-amber-400/40 flex flex-col justify-between app-touch-active min-h-[82px]"
          >
            <div className="flex items-center justify-between">
              <Calendar className="w-4 h-4 text-amber-400" />
              <ChevronRight className="w-3.5 h-3.5 text-white/30" />
            </div>
            <div>
              <span className="font-semibold text-xs text-amber-100 block">
                {t('nav_parayana')}
              </span>
              <span className="text-[10px] text-[#a39eb5] block">
                Sadhana Tracker
              </span>
            </div>
          </Link>
        </div>

        {/* Quick App Utilities */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          {/* Language Trigger */}
          <button
            onClick={handleOpenLanguage}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.03] active:bg-white/10 border border-white/10 text-xs app-touch-active"
          >
            <span className="flex items-center gap-2.5 text-amber-200">
              <Globe className="w-4 h-4 text-amber-400" />
              <span>Language / भाषा</span>
            </span>
            <span className="font-sanskrit text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold">
              {currentLanguageInfo.nativeName} ({currentLanguageInfo.code.toUpperCase()})
            </span>
          </button>

          {/* Ambient Tanpura Drone */}
          <button
            onClick={toggleTanpura}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.03] active:bg-white/10 border border-white/10 text-xs app-touch-active"
          >
            <span className="flex items-center gap-2.5 text-amber-200">
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>Ambient Tanpura Drone</span>
            </span>
            <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${
              isTanpuraPlaying
                ? 'bg-amber-500 text-black font-bold animate-pulse'
                : 'bg-white/10 text-[#a39eb5]'
            }`}>
              {isTanpuraPlaying ? 'Playing' : 'Off'}
            </span>
          </button>

          {/* Replay Cinematic Prologue */}
          <button
            onClick={handleOpenPrologue}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.03] active:bg-white/10 border border-white/10 text-xs app-touch-active"
          >
            <span className="flex items-center gap-2.5 text-amber-200">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Epic Prologue</span>
            </span>
            <span className="text-[10px] text-[#a39eb5]">
              Replay Intro
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
