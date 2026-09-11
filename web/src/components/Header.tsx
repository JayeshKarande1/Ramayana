'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Volume2, VolumeX, Menu, X, BookOpen, Compass, Flame, Users, Calendar } from 'lucide-react';
import SearchModal from './SearchModal';
import { tanpura } from '@/lib/audio';

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTanpuraPlaying, setIsTanpuraPlaying] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <Link href="/story" className="hover:text-[#f59e3a] transition-colors flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" /> Story
            </Link>
            <Link href="/journey" className="hover:text-[#f59e3a] transition-colors flex items-center gap-1.5">
              <Compass className="w-4 h-4" /> Journey
            </Link>
            <Link href="/pradakshina" className="hover:text-[#f59e3a] transition-colors flex items-center gap-1.5">
              <Flame className="w-4 h-4" /> Pradakshina
            </Link>
            <Link href="/characters" className="hover:text-[#f59e3a] transition-colors flex items-center gap-1.5">
              <Users className="w-4 h-4" /> Personalities
            </Link>
            <Link href="/parayana" className="hover:text-[#f59e3a] transition-colors flex items-center gap-1.5">
              <Calendar className="w-4 h-4" /> Parayana
            </Link>
          </nav>

          {/* Action Tools */}
          <div className="flex items-center gap-3">
            {/* Search Trigger Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-amber-500/30 text-xs text-[#a39eb5] hover:text-[#f3f0e6] transition-all cursor-pointer"
              title="Search scriptures (Ctrl+K)"
            >
              <Search className="w-3.5 h-3.5 text-[#f59e3a]" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-black/40 rounded border border-white/10 text-white/40">
                ⌘K
              </kbd>
            </button>

            {/* Ambient Tanpura Drone Player Button */}
            <button
              onClick={toggleTanpura}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                isTanpuraPlaying
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-md shadow-amber-500/20 animate-pulse'
                  : 'bg-white/5 border-white/10 text-[#a39eb5] hover:text-white'
              }`}
              title={isTanpuraPlaying ? 'Stop Ambient Tanpura Drone' : 'Play Ambient Tanpura Drone (Sa-Pa)'}
            >
              {isTanpuraPlaying ? <Volume2 className="w-4 h-4 text-[#f59e3a]" /> : <VolumeX className="w-4 h-4" />}
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
            <Link
              href="/story"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 py-2 text-sm text-[#f3f0e6] hover:text-[#f59e3a]"
            >
              <BookOpen className="w-4 h-4 text-[#f59e3a]" /> The Story (7 Kandas)
            </Link>
            <Link
              href="/journey"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 py-2 text-sm text-[#f3f0e6] hover:text-[#f59e3a]"
            >
              <Compass className="w-4 h-4 text-[#f59e3a]" /> Rama's Journey Map (15 Stops)
            </Link>
            <Link
              href="/pradakshina"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 py-2 text-sm text-[#f3f0e6] hover:text-[#f59e3a]"
            >
              <Flame className="w-4 h-4 text-[#f59e3a]" /> Pradakshina (108 Names)
            </Link>
            <Link
              href="/characters"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 py-2 text-sm text-[#f3f0e6] hover:text-[#f59e3a]"
            >
              <Users className="w-4 h-4 text-[#f59e3a]" /> Personalities Guide (194 figures)
            </Link>
            <Link
              href="/parayana"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 py-2 text-sm text-[#f3f0e6] hover:text-[#f59e3a]"
            >
              <Calendar className="w-4 h-4 text-[#f59e3a]" /> Parayana Tracker
            </Link>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
