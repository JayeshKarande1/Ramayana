'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Volume2, VolumeX, Menu, X, BookOpen, Compass, Flame, Users, Calendar, Sparkles, Shield, Globe, ChevronLeft } from 'lucide-react';
import SearchModal from './SearchModal';
import LanguageModal from './LanguageModal';
import MobileMoreSheet from './MobileMoreSheet';
import { useLanguage } from '@/context/LanguageContext';
import { tanpura } from '@/lib/audio';

export default function Header() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isTanpuraPlaying, setIsTanpuraPlaying] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentLanguageInfo, t } = useLanguage();

  const toggleTanpura = () => {
    if (tanpura && typeof tanpura.toggle === 'function') {
      const active = tanpura.toggle();
      setIsTanpuraPlaying(active);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Contextual back navigation on mobile
  const getMobileBackInfo = () => {
    const cleanPath = pathname.replace(/\/+$/, '');
    const segments = cleanPath.split('/').filter(Boolean);

    if (segments.length === 0) {
      return null;
    }

    if (segments[0] === 'story') {
      if (segments.length >= 3) {
        // e.g. /story/bala/1 -> back to /story/bala/
        return { href: `/story/${segments[1]}/`, label: 'Kanda' };
      }
      if (segments.length === 2) {
        // e.g. /story/bala -> back to /story/
        return { href: '/story/', label: 'Codex' };
      }
      // e.g. /story -> back to home /
      return { href: '/', label: 'Home' };
    }

    // Any other top-level section (/journey, /characters, etc.)
    return { href: '/', label: 'Home' };
  };

  const mobileBack = getMobileBackInfo();

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[rgba(243,210,122,0.12)] bg-[#07050d]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Contextual Back Navigation on Mobile */}
          <div className="flex items-center gap-2">
            {mobileBack && (
              <Link
                href={mobileBack.href}
                className="md:hidden flex items-center gap-1 py-1.5 px-2.5 rounded-xl bg-white/5 border border-white/10 text-amber-300 active:scale-95 transition-all app-touch-active"
                title={`Back to ${mobileBack.label}`}
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                <span className="font-cinzel text-xs font-bold text-amber-200">
                  {mobileBack.label}
                </span>
              </Link>
            )}

            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-amber-800 p-[2px] shadow-lg shadow-orange-950/40 group-hover:scale-105 transition-transform">
                <div className="w-full h-full rounded-full bg-[#0d091a] flex items-center justify-center">
                  <span className="font-sanskrit text-xs sm:text-sm font-bold text-amber-200">श्रीराम</span>
                </div>
              </div>
              <div className={`flex flex-col ${pathname !== '/' ? 'hidden sm:flex' : 'flex'}`}>
                <span className="font-cinzel text-lg sm:text-xl font-bold tracking-wider text-gold-gradient">
                  RAMAYANA
                </span>
                <span className="font-sanskrit text-[9px] sm:text-[10px] tracking-widest text-[#a39eb5]/80">
                  रामायणम् · वाल्मीकीयम्
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#a39eb5]">
            <Link href="/story" className="hover:text-[#f59e3a] transition-colors flex items-center gap-1.5 font-semibold text-amber-200">
              <BookOpen className="w-4 h-4 text-amber-400" /> {t('nav_samhita')}
            </Link>
            <Link href="/journey" className="hover:text-[#f59e3a] transition-colors flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-400" /> {t('nav_journey')}
            </Link>
            <Link href="/pradakshina" className="hover:text-[#f59e3a] transition-colors flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400" /> {t('nav_parikrama')}
            </Link>
            <Link href="/characters" className="hover:text-[#f59e3a] transition-colors flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-400" /> {t('nav_characters')}
            </Link>
            <Link href="/relics" className="hover:text-[#f59e3a] transition-colors flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-amber-400" /> {t('nav_relics')}
            </Link>
            <Link href="/compass" className="hover:text-[#f59e3a] transition-colors flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-400" /> {t('nav_compass')}
            </Link>
            <Link href="/parayana" className="hover:text-[#f59e3a] transition-colors flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-400" /> {t('nav_parayana')}
            </Link>
          </nav>

          {/* Action Tools */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Search Trigger Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center justify-center gap-2 h-9 px-2.5 sm:px-3 rounded-full bg-white/5 border border-white/10 hover:border-amber-500/30 text-xs text-[#a39eb5] hover:text-[#f3f0e6] transition-all cursor-pointer"
              title="Search scripture (Ctrl+K)"
              aria-label="Search scripture"
            >
              <Search className="w-3.5 h-3.5 text-[#f59e3a]" />
              <span className="hidden sm:inline">{t('action_search')}</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-black/40 rounded border border-white/10 text-white/40">
                ⌘K
              </kbd>
            </button>

            {/* Language Switcher Trigger */}
            <button
              onClick={() => setIsLanguageOpen(true)}
              className="flex items-center gap-1.5 h-9 px-2.5 sm:px-3 rounded-full bg-white/5 border border-white/10 hover:border-amber-400/40 text-xs text-amber-200 hover:text-white transition-all cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(245,158,11,0.2)]"
              title="Change Language / भाषा बदलें"
              aria-label="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-sanskrit text-xs font-semibold sm:inline hidden">
                {currentLanguageInfo.nativeName}
              </span>
              <span className="font-mono text-[11px] font-semibold sm:hidden inline text-amber-300">
                {currentLanguageInfo.code.toUpperCase()}
              </span>
            </button>

            {/* Replay Prologue Button (Desktop) */}
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new Event('open-ramayana-prologue'));
                }
              }}
              className="hidden sm:flex items-center gap-1.5 h-9 px-3 rounded-full bg-amber-500/10 border border-amber-500/30 hover:border-amber-400 text-xs text-amber-200 hover:text-white transition-all cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(245,158,11,0.25)]"
              title="Experience Epic Prologue"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('action_prologue')}</span>
            </button>

            {/* Ambient Tanpura Drone Player Button (Desktop) */}
            <button
              onClick={toggleTanpura}
              className={`hidden sm:flex h-9 px-3 rounded-full border transition-all cursor-pointer items-center gap-2 text-xs font-medium ${
                isTanpuraPlaying
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-md shadow-amber-500/25'
                  : 'bg-white/5 border-white/10 text-[#a39eb5] hover:text-white'
              }`}
              title={isTanpuraPlaying ? 'Stop Ambient Tanpura Drone' : 'Play Ambient Tanpura Drone (Sa-Pa harmonics)'}
            >
              {isTanpuraPlaying ? (
                <>
                  <span className="flex items-end gap-0.5 h-3.5">
                    <span className="w-0.5 h-3 bg-amber-400 animate-pulse" />
                    <span className="w-0.5 h-2 bg-amber-300 animate-pulse delay-75" />
                    <span className="w-0.5 h-3.5 bg-amber-400 animate-pulse delay-150" />
                    <span className="w-0.5 h-1.5 bg-amber-300 animate-pulse delay-100" />
                  </span>
                  <span className="text-[11px] text-amber-200">Tanpura On</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-amber-400/70" />
                  <span className="text-[11px]">Tanpura</span>
                </>
              )}
            </button>

            {/* Mobile Menu Button - High Contrast & Guaranteed Visible */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              className={`md:hidden flex items-center justify-center w-10 h-10 rounded-xl transition-all cursor-pointer ${
                mobileMenuOpen 
                  ? 'bg-amber-500/25 border border-amber-400 text-amber-300' 
                  : 'bg-white/10 hover:bg-white/15 border border-amber-400/30 text-amber-200 shadow-sm'
              }`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

      </header>

      {/* Mobile More Portals Drawer Sheet */}
      <MobileMoreSheet 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)}
        onOpenLanguage={() => setIsLanguageOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Global Language Selector Modal */}
      <LanguageModal isOpen={isLanguageOpen} onClose={() => setIsLanguageOpen(false)} />
    </>
  );
}
