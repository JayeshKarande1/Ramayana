'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  X, Home, BookOpen, Compass, Flame, Users, Shield, 
  Calendar, Globe, Volume2, Sparkles, ChevronRight, Search 
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { tanpura } from '@/lib/audio';

interface MobileMoreSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenLanguage: () => void;
  onOpenSearch?: () => void;
}

export default function MobileMoreSheet({ 
  isOpen, 
  onClose, 
  onOpenLanguage, 
  onOpenSearch 
}: MobileMoreSheetProps) {
  const pathname = usePathname();
  const { currentLanguageInfo, t } = useLanguage();
  const [isTanpuraPlaying, setIsTanpuraPlaying] = useState(false);

  // Sync Tanpura state on open
  useEffect(() => {
    if (isOpen && tanpura) {
      const playing = typeof tanpura.isPlaying === 'function' ? tanpura.isPlaying() : Boolean((tanpura as any).active);
      setIsTanpuraPlaying(playing);
    }
  }, [isOpen]);

  // Handle ESC key to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleTanpura = () => {
    if (tanpura && typeof tanpura.toggle === 'function') {
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

  const handleOpenSearch = () => {
    onClose();
    if (onOpenSearch) {
      onOpenSearch();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 md:hidden flex flex-col justify-end bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
    >
      {/* Tap backdrop to dismiss */}
      <div 
        className="flex-1 w-full" 
        onClick={onClose}
        aria-hidden="true" 
      />

      {/* Slide-Up Navigation Sheet */}
      <div 
        className="w-full bg-[#0c0918] border-t border-amber-400/30 rounded-t-3xl p-5 pb-safe shadow-[0_-15px_40px_rgba(0,0,0,0.9)] animate-sheet-up flex flex-col max-h-[88vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Drag Handle Bar */}
        <div className="w-12 h-1.5 rounded-full bg-white/25 mx-auto mb-4" />

        {/* Sheet Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-700 p-[1.5px] shadow-md shadow-orange-950/40">
              <div className="w-full h-full rounded-[10px] bg-[#0d091a] flex items-center justify-center">
                <span className="font-sanskrit text-xs font-bold text-amber-200">श्रीराम</span>
              </div>
            </div>
            <div>
              <h3 className="font-cinzel text-base font-bold text-gold-gradient leading-tight">
                Valmiki Ramayana
              </h3>
              <p className="font-sanskrit text-[10px] text-[#f3d27a]/70">
                श्रीमद्वाल्मीकीयरामायणम् · प्रवेशद्वारम्
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 active:bg-white/20 text-[#a39eb5] hover:text-white transition-all cursor-pointer"
            title="Close menu"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Fast Scripture Search Quick Trigger */}
        <button
          onClick={handleOpenSearch}
          className="w-full flex items-center justify-between p-3 rounded-2xl bg-amber-500/10 border border-amber-400/25 hover:border-amber-400/50 text-xs text-amber-200 mb-4 transition-all active:scale-[0.99] cursor-pointer shadow-sm"
        >
          <span className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-amber-400" />
            <span className="font-medium text-amber-100">Search 21,640+ verses, kandas & names</span>
          </span>
          <span className="px-2 py-0.5 rounded-md bg-black/40 border border-white/10 text-[10px] font-mono text-white/50">
            Ctrl+K
          </span>
        </button>

        {/* Section 1: Core Scripture & Sacred Journeys */}
        <div className="mb-4">
          <span className="text-[10px] font-bold font-cinzel uppercase tracking-wider text-amber-400/80 px-1 block mb-2">
            Core Scripture &amp; Journeys
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            {/* Home */}
            <Link
              href="/"
              onClick={onClose}
              className={`p-3 rounded-2xl border flex flex-col justify-between min-h-[82px] transition-all app-touch-active ${
                pathname === '/'
                  ? 'bg-amber-500/20 border-amber-400 shadow-md shadow-amber-950/40'
                  : 'bg-white/[0.03] active:bg-amber-500/15 border-white/10 active:border-amber-400/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <Home className="w-4 h-4 text-amber-400" />
                <ChevronRight className="w-3.5 h-3.5 text-white/30" />
              </div>
              <div>
                <span className="font-semibold text-xs text-amber-100 block">
                  Home Sanctum
                </span>
                <span className="text-[10px] text-[#a39eb5] block">
                  The Living Epic
                </span>
              </div>
            </Link>

            {/* Mula Samhita */}
            <Link
              href="/story"
              onClick={onClose}
              className={`p-3 rounded-2xl border flex flex-col justify-between min-h-[82px] transition-all app-touch-active ${
                pathname.startsWith('/story')
                  ? 'bg-amber-500/20 border-amber-400 shadow-md shadow-amber-950/40'
                  : 'bg-white/[0.03] active:bg-amber-500/15 border-white/10 active:border-amber-400/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <BookOpen className="w-4 h-4 text-amber-400" />
                <ChevronRight className="w-3.5 h-3.5 text-white/30" />
              </div>
              <div>
                <span className="font-semibold text-xs text-amber-100 block">
                  {t('nav_samhita')}
                </span>
                <span className="text-[10px] text-[#a39eb5] block">
                  7 Kandas · 648 Sargas
                </span>
              </div>
            </Link>

            {/* 14-Year Sacred Odyssey */}
            <Link
              href="/journey"
              onClick={onClose}
              className={`p-3 rounded-2xl border flex flex-col justify-between min-h-[82px] transition-all app-touch-active ${
                pathname.startsWith('/journey')
                  ? 'bg-amber-500/20 border-amber-400 shadow-md shadow-amber-950/40'
                  : 'bg-white/[0.03] active:bg-amber-500/15 border-white/10 active:border-amber-400/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <Compass className="w-4 h-4 text-amber-400" />
                <ChevronRight className="w-3.5 h-3.5 text-white/30" />
              </div>
              <div>
                <span className="font-semibold text-xs text-amber-100 block">
                  {t('nav_journey')}
                </span>
                <span className="text-[10px] text-[#a39eb5] block">
                  14-Year Odyssey (15 Stops)
                </span>
              </div>
            </Link>

            {/* Temple Parikrama */}
            <Link
              href="/pradakshina"
              onClick={onClose}
              className={`p-3 rounded-2xl border flex flex-col justify-between min-h-[82px] transition-all app-touch-active ${
                pathname.startsWith('/pradakshina')
                  ? 'bg-amber-500/20 border-amber-400 shadow-md shadow-amber-950/40'
                  : 'bg-white/[0.03] active:bg-amber-500/15 border-white/10 active:border-amber-400/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <Flame className="w-4 h-4 text-amber-400" />
                <ChevronRight className="w-3.5 h-3.5 text-white/30" />
              </div>
              <div>
                <span className="font-semibold text-xs text-amber-100 block">
                  {t('nav_parikrama')}
                </span>
                <span className="text-[10px] text-[#a39eb5] block">
                  108 Names &amp; Diya Sadhana
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Section 2: Personae, Relics & Wisdom Portals */}
        <div className="mb-4">
          <span className="text-[10px] font-bold font-cinzel uppercase tracking-wider text-amber-400/80 px-1 block mb-2">
            Personae, Relics &amp; Wisdom
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            {/* Characters */}
            <Link
              href="/characters"
              onClick={onClose}
              className={`p-3 rounded-2xl border flex flex-col justify-between min-h-[82px] transition-all app-touch-active ${
                pathname.startsWith('/characters')
                  ? 'bg-amber-500/20 border-amber-400 shadow-md shadow-amber-950/40'
                  : 'bg-white/[0.03] active:bg-amber-500/15 border-white/10 active:border-amber-400/40'
              }`}
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
                  194 Lineages &amp; Charitra
                </span>
              </div>
            </Link>

            {/* Divyastra */}
            <Link
              href="/relics"
              onClick={onClose}
              className={`p-3 rounded-2xl border flex flex-col justify-between min-h-[82px] transition-all app-touch-active ${
                pathname.startsWith('/relics')
                  ? 'bg-amber-500/20 border-amber-400 shadow-md shadow-amber-950/40'
                  : 'bg-white/[0.03] active:bg-amber-500/15 border-white/10 active:border-amber-400/40'
              }`}
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
                  Divine Arsenal &amp; Tokens
                </span>
              </div>
            </Link>

            {/* Dharma Niti */}
            <Link
              href="/compass"
              onClick={onClose}
              className={`p-3 rounded-2xl border flex flex-col justify-between min-h-[82px] transition-all app-touch-active ${
                pathname.startsWith('/compass')
                  ? 'bg-amber-500/20 border-amber-400 shadow-md shadow-amber-950/40'
                  : 'bg-white/[0.03] active:bg-amber-500/15 border-white/10 active:border-amber-400/40'
              }`}
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
                  Ethical Dilemmas Matcher
                </span>
              </div>
            </Link>

            {/* Parayana */}
            <Link
              href="/parayana"
              onClick={onClose}
              className={`p-3 rounded-2xl border flex flex-col justify-between min-h-[82px] transition-all app-touch-active ${
                pathname.startsWith('/parayana')
                  ? 'bg-amber-500/20 border-amber-400 shadow-md shadow-amber-950/40'
                  : 'bg-white/[0.03] active:bg-amber-500/15 border-white/10 active:border-amber-400/40'
              }`}
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
                  Sundara Kanda 7-Day Sadhana
                </span>
              </div>
            </Link>
          </div>
        </div>

        {/* Section 3: Spiritual Atmosphere & App Utilities */}
        <div className="space-y-2 pt-3 border-t border-white/10">
          <span className="text-[10px] font-bold font-cinzel uppercase tracking-wider text-amber-400/80 px-1 block mb-1">
            Spiritual Atmosphere &amp; Settings
          </span>

          {/* Ambient Tanpura Drone */}
          <button
            onClick={toggleTanpura}
            className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs app-touch-active transition-all cursor-pointer ${
              isTanpuraPlaying 
                ? 'bg-amber-500/15 border-amber-500/40 shadow-sm' 
                : 'bg-white/[0.03] active:bg-white/10 border-white/10'
            }`}
          >
            <span className="flex items-center gap-2.5 text-amber-200">
              <Volume2 className={`w-4 h-4 ${isTanpuraPlaying ? 'text-amber-400' : 'text-amber-400/70'}`} />
              <span className="font-medium">Ambient Tanpura Drone (Sa-Pa)</span>
            </span>
            <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold transition-all ${
              isTanpuraPlaying
                ? 'bg-amber-500 text-black font-bold animate-pulse'
                : 'bg-white/10 text-[#a39eb5]'
            }`}>
              {isTanpuraPlaying ? 'Playing' : 'Turn On'}
            </span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={handleOpenLanguage}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.03] active:bg-white/10 border border-white/10 text-xs app-touch-active cursor-pointer"
          >
            <span className="flex items-center gap-2.5 text-amber-200">
              <Globe className="w-4 h-4 text-amber-400" />
              <span>Change Language / भाषा बदलें</span>
            </span>
            <span className="font-sanskrit text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold">
              {currentLanguageInfo.nativeName} ({currentLanguageInfo.code.toUpperCase()})
            </span>
          </button>

          {/* Replay Cinematic Prologue */}
          <button
            onClick={handleOpenPrologue}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.03] active:bg-white/10 border border-white/10 text-xs app-touch-active cursor-pointer"
          >
            <span className="flex items-center gap-2.5 text-amber-200">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Replay Epic Prologue</span>
            </span>
            <span className="text-[10px] text-[#a39eb5]">
              Cinematic Intro
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
