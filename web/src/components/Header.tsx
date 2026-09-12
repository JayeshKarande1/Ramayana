'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Volume2, VolumeX, Menu, X, BookOpen, Compass, Flame, Users, Calendar, Sparkles, Shield, Globe } from 'lucide-react';
import SearchModal from './SearchModal';
import LanguageModal from './LanguageModal';
import { useLanguage } from '@/context/LanguageContext';
import { tanpura } from '@/lib/audio';

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isTanpuraPlaying, setIsTanpuraPlaying] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentLanguageInfo, t } = useLanguage();

  const toggleTanpura = () => {
    if (tanpura) {
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

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[rgba(243,210,122,0.12)] bg-[#07050d]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-amber-800 p-[2px] shadow-lg shadow-orange-950/40 group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-[#0d091a] flex items-center justify-center">
                <span className="font-sanskrit text-sm font-bold text-amber-200">श्रीराम</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-cinzel text-xl font-bold tracking-wider text-gold-gradient">
                RAMAYANA
              </span>
              <span className="font-sanskrit text-[10px] tracking-widest text-[#a39eb5]/80">
                रामायणम् · वाल्मीकीयम्
              </span>
            </div>
          </Link>

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
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher Trigger */}
            <button
              onClick={() => setIsLanguageOpen(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-amber-400/40 text-xs text-amber-200 hover:text-white transition-all cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(245,158,11,0.2)]"
              title="Change Language / भाषा बदलें"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-sanskrit text-xs font-semibold">{currentLanguageInfo.nativeName}</span>
            </button>

            {/* Replay Prologue Button */}
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new Event('open-ramayana-prologue'));
                }
              }}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 hover:border-amber-400 text-xs text-amber-200 hover:text-white transition-all cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(245,158,11,0.25)]"
              title="Experience Epic Prologue"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{t('action_prologue')}</span>
            </button>

            {/* Search Trigger Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-amber-500/30 text-xs text-[#a39eb5] hover:text-[#f3f0e6] transition-all cursor-pointer"
              title="Search scripture (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-[#f59e3a]" />
              <span className="hidden sm:inline">{t('action_search')}</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-black/40 rounded border border-white/10 text-white/40">
                ⌘K
              </kbd>
            </button>

            {/* Ambient Tanpura Drone Player Button */}
            <button
              onClick={toggleTanpura}
              className={`px-3 py-1.5 rounded-full border transition-all cursor-pointer flex items-center gap-2 text-xs font-medium ${
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
                  <span className="hidden sm:inline text-[11px]">Tanpura</span>
                </>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-white/5 text-[#a39eb5]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#0d091a] px-4 py-4 space-y-3">
            {/* Mobile Language Switcher */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsLanguageOpen(true);
              }}
              className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-white/5 border border-white/10 text-sm text-amber-200 hover:text-white w-full cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <Globe className="w-4 h-4 text-amber-400" />
                <span>{t('action_language')}</span>
              </span>
              <span className="font-sanskrit text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold">
                {currentLanguageInfo.nativeName}
              </span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new Event('open-ramayana-prologue'));
                }
              }}
              className="flex items-center gap-3 py-2 text-sm text-amber-300 font-medium hover:text-amber-200 w-full text-left"
            >
              <Sparkles className="w-4 h-4 text-amber-400" /> {t('action_prologue')}
            </button>
            <Link
              href="/story"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 py-2 text-sm text-[#f3f0e6] hover:text-[#f59e3a] font-semibold text-amber-200"
            >
              <BookOpen className="w-4 h-4 text-amber-400" /> {t('sub_samhita')}
            </Link>
            <Link
              href="/journey"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 py-2 text-sm text-[#f3f0e6] hover:text-[#f59e3a]"
            >
              <Compass className="w-4 h-4 text-amber-400" /> {t('sub_journey')}
            </Link>
            <Link
              href="/pradakshina"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 py-2 text-sm text-[#f3f0e6] hover:text-[#f59e3a]"
            >
              <Flame className="w-4 h-4 text-amber-400" /> {t('sub_parikrama')}
            </Link>
            <Link
              href="/characters"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 py-2 text-sm text-[#f3f0e6] hover:text-[#f59e3a]"
            >
              <Users className="w-4 h-4 text-amber-400" /> {t('sub_characters')}
            </Link>
            <Link
              href="/relics"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 py-2 text-sm text-[#f3f0e6] hover:text-[#f59e3a]"
            >
              <Shield className="w-4 h-4 text-amber-400" /> {t('sub_relics')}
            </Link>
            <Link
              href="/compass"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 py-2 text-sm text-[#f3f0e6] hover:text-[#f59e3a]"
            >
              <Compass className="w-4 h-4 text-amber-400" /> {t('sub_compass')}
            </Link>
            <Link
              href="/parayana"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 py-2 text-sm text-[#f3f0e6] hover:text-[#f59e3a]"
            >
              <Calendar className="w-4 h-4 text-amber-400" /> {t('sub_parayana')}
            </Link>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Global Language Selector Modal */}
      <LanguageModal isOpen={isLanguageOpen} onClose={() => setIsLanguageOpen(false)} />
    </>
  );
}
