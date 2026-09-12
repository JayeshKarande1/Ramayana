'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Compass, Flame, Grid } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import MobileMoreSheet from './MobileMoreSheet';
import LanguageModal from './LanguageModal';

export default function MobileAppNavBar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isBookMode, setIsBookMode] = useState(false);

  // Detect if user is currently inside the full-screen Book Mode
  useEffect(() => {
    const checkBookMode = () => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        // Only hide if specifically viewing a sarga in book mode
        const isReadingBook = pathname.includes('/story/') && params.get('mode') === 'book';
        setIsBookMode(isReadingBook);
      }
    };

    checkBookMode();
    window.addEventListener('popstate', checkBookMode);
    return () => window.removeEventListener('popstate', checkBookMode);
  }, [pathname]);

  // Hide bottom bar completely in distraction-free Book Mode
  if (isBookMode) {
    return null;
  }

  const isHomeActive = pathname === '/';
  const isSamhitaActive = pathname.startsWith('/story');
  const isJourneyActive = pathname.startsWith('/journey');
  const isParikramaActive = pathname.startsWith('/pradakshina');

  return (
    <>
      <nav 
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#07050d]/95 backdrop-blur-xl border-t border-amber-400/20 pb-[calc(0.4rem+env(safe-area-inset-bottom,0px))] pt-1.5 px-3 shadow-[0_-8px_30px_rgba(0,0,0,0.8)]"
      >
        <div className="grid grid-cols-5 items-center justify-around max-w-md mx-auto">
          {/* Tab 1: Home */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all app-touch-active ${
              isHomeActive
                ? 'text-amber-300'
                : 'text-[#a39eb5] hover:text-white'
            }`}
          >
            <div className={`p-1 rounded-full transition-all ${
              isHomeActive ? 'bg-amber-500/15 shadow-[0_0_12px_rgba(245,158,11,0.3)] scale-110' : ''
            }`}>
              <Home className={`w-5 h-5 ${isHomeActive ? 'text-amber-400 stroke-[2.2]' : 'stroke-[1.8]'}`} />
            </div>
            <span className={`text-[10px] font-medium tracking-tight mt-0.5 ${
              isHomeActive ? 'text-amber-200 font-bold' : ''
            }`}>
              Home
            </span>
          </Link>

          {/* Tab 2: Samhita */}
          <Link
            href="/story"
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all app-touch-active ${
              isSamhitaActive
                ? 'text-amber-300'
                : 'text-[#a39eb5] hover:text-white'
            }`}
          >
            <div className={`p-1 rounded-full transition-all ${
              isSamhitaActive ? 'bg-amber-500/15 shadow-[0_0_12px_rgba(245,158,11,0.3)] scale-110' : ''
            }`}>
              <BookOpen className={`w-5 h-5 ${isSamhitaActive ? 'text-amber-400 stroke-[2.2]' : 'stroke-[1.8]'}`} />
            </div>
            <span className={`text-[10px] font-medium tracking-tight mt-0.5 truncate max-w-[58px] ${
              isSamhitaActive ? 'text-amber-200 font-bold' : ''
            }`}>
              {t('nav_samhita')}
            </span>
          </Link>

          {/* Tab 3: Rama Yatra */}
          <Link
            href="/journey"
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all app-touch-active ${
              isJourneyActive
                ? 'text-amber-300'
                : 'text-[#a39eb5] hover:text-white'
            }`}
          >
            <div className={`p-1 rounded-full transition-all ${
              isJourneyActive ? 'bg-amber-500/15 shadow-[0_0_12px_rgba(245,158,11,0.3)] scale-110' : ''
            }`}>
              <Compass className={`w-5 h-5 ${isJourneyActive ? 'text-amber-400 stroke-[2.2]' : 'stroke-[1.8]'}`} />
            </div>
            <span className={`text-[10px] font-medium tracking-tight mt-0.5 truncate max-w-[58px] ${
              isJourneyActive ? 'text-amber-200 font-bold' : ''
            }`}>
              {t('nav_journey')}
            </span>
          </Link>

          {/* Tab 4: Parikrama */}
          <Link
            href="/pradakshina"
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all app-touch-active ${
              isParikramaActive
                ? 'text-amber-300'
                : 'text-[#a39eb5] hover:text-white'
            }`}
          >
            <div className={`p-1 rounded-full transition-all ${
              isParikramaActive ? 'bg-amber-500/15 shadow-[0_0_12px_rgba(245,158,11,0.3)] scale-110' : ''
            }`}>
              <Flame className={`w-5 h-5 ${isParikramaActive ? 'text-amber-400 stroke-[2.2]' : 'stroke-[1.8]'}`} />
            </div>
            <span className={`text-[10px] font-medium tracking-tight mt-0.5 truncate max-w-[58px] ${
              isParikramaActive ? 'text-amber-200 font-bold' : ''
            }`}>
              {t('nav_parikrama')}
            </span>
          </Link>

          {/* Tab 5: More Portals */}
          <button
            onClick={() => setIsMoreOpen(true)}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all app-touch-active cursor-pointer ${
              isMoreOpen ? 'text-amber-300' : 'text-[#a39eb5] hover:text-white'
            }`}
          >
            <div className={`p-1 rounded-full transition-all ${
              isMoreOpen ? 'bg-amber-500/15 shadow-[0_0_12px_rgba(245,158,11,0.3)] scale-110' : ''
            }`}>
              <Grid className="w-5 h-5 stroke-[1.8]" />
            </div>
            <span className="text-[10px] font-medium tracking-tight mt-0.5">
              More
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile More Portals Drawer Sheet */}
      <MobileMoreSheet 
        isOpen={isMoreOpen} 
        onClose={() => setIsMoreOpen(false)}
        onOpenLanguage={() => setIsLanguageOpen(true)}
      />

      {/* Language Selector Modal */}
      <LanguageModal 
        isOpen={isLanguageOpen} 
        onClose={() => setIsLanguageOpen(false)} 
      />
    </>
  );
}
