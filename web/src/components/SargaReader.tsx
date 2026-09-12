'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Volume2, VolumeX, Play, Pause, ChevronLeft, ChevronRight, 
  Copy, Check, BookOpen, Sparkles, ScrollText, Maximize2, 
  Columns, Settings, Layers, ArrowLeft, ArrowRight, Share2, X
} from 'lucide-react';
import { chantVerse, stopChanting } from '@/lib/audio';
import { transliterate, ScriptType } from '@/lib/transliteration';
import { useLanguage } from '@/context/LanguageContext';

export interface Shloka {
  id: string;
  shlokaNumber: number;
  sanskrit: string;
  transliteration: string;
  wordByWord: string;
  meaning: string;
}

export interface SargaData {
  kanda: string;
  kandaName: string;
  sarga: number;
  title: string;
  totalShlokas: number;
  shlokas: Shloka[];
}

interface SargaReaderProps {
  sargaData: SargaData;
  totalSargasInKanda: number;
}

export default function SargaReader({ sargaData, totalSargasInKanda }: SargaReaderProps) {
  const { currentLanguageInfo } = useLanguage();
  // Reading mode: 'book' (distraction-free pothi page), 'manuscript' (illuminated scroll), 'carousel' (focused sadhana deck), 'split' (scholar dual codex)
  const [readingMode, setReadingMode] = useState<'book' | 'manuscript' | 'carousel' | 'split'>('manuscript');
  const [script, setScript] = useState<ScriptType>(currentLanguageInfo?.script || 'devanagari');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('normal');
  const [activePlayingIndex, setActivePlayingIndex] = useState<number | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [bookIndex, setBookIndex] = useState<number>(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedWbw, setExpandedWbw] = useState<Record<number, boolean>>({});

  const shlokas = sargaData.shlokas || [];
  const activePlayingIndexRef = useRef<number | null>(null);
  activePlayingIndexRef.current = activePlayingIndex;
  const isAutoPlayingRef = useRef<boolean>(false);
  isAutoPlayingRef.current = isAutoPlaying;

  // Sync script with current global language if available
  useEffect(() => {
    if (currentLanguageInfo?.script) {
      setScript(currentLanguageInfo.script);
    }
  }, [currentLanguageInfo]);

  // Check URL query param to open Book Mode
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'book') {
        setReadingMode('book');
      }
    }
  }, []);

  const goToPrevShloka = () => {
    if (bookIndex > 0) {
      setBookIndex(prev => prev - 1);
    }
  };

  const goToNextShloka = () => {
    if (bookIndex < shlokas.length - 1) {
      setBookIndex(prev => prev + 1);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchEndX - touchStartX;
    if (diffX < -50) {
      // Swiped left -> next verse
      goToNextShloka();
    } else if (diffX > 50) {
      // Swiped right -> previous verse
      goToPrevShloka();
    }
    setTouchStartX(null);
  };

  const playVerse = (index: number, autoAdvance = false) => {
    if (index >= shlokas.length) {
      setIsAutoPlaying(false);
      setActivePlayingIndex(null);
      return;
    }

    setActivePlayingIndex(index);
    if (readingMode === 'carousel') {
      setCarouselIndex(index);
    } else if (readingMode === 'book') {
      setBookIndex(index);
    }
    const shloka = shlokas[index];

    // Scroll to verse card if in manuscript or split mode
    if (readingMode !== 'carousel' && readingMode !== 'book') {
      const element = document.getElementById(`shloka-${shloka.shlokaNumber}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    chantVerse(shloka.sanskrit, () => {
      if (isAutoPlayingRef.current) {
        setTimeout(() => {
          playVerse(index + 1, true);
        }, 900);
      } else {
        setActivePlayingIndex(null);
      }
    });
  };

  const toggleAutoPlay = () => {
    if (isAutoPlaying) {
      stopChanting();
      setIsAutoPlaying(false);
      setActivePlayingIndex(null);
    } else {
      setIsAutoPlaying(true);
      const startIndex = readingMode === 'book' ? bookIndex : (readingMode === 'carousel' ? carouselIndex : (activePlayingIndex !== null ? activePlayingIndex : 0));
      playVerse(startIndex, true);
    }
  };

  const handleCopy = (shloka: Shloka) => {
    const textToCopy = `${shloka.sanskrit}\n\n${shloka.meaning}\n(Valmiki Ramayana, ${sargaData.kandaName} Sarga ${sargaData.sarga}.${shloka.shlokaNumber})`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(shloka.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleWbw = (num: number) => {
    setExpandedWbw(prev => ({ ...prev, [num]: !prev[num] }));
  };

  // Keyboard navigation for Carousel and Book modes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (readingMode === 'book') {
        if (e.key === 'Escape') {
          setReadingMode('manuscript');
          if (typeof window !== 'undefined' && window.location.search.includes('mode=book')) {
            const url = new URL(window.location.href);
            url.searchParams.delete('mode');
            window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
          }
        } else if (e.key === 'ArrowRight' && bookIndex < shlokas.length - 1) {
          setBookIndex(prev => prev + 1);
        } else if (e.key === 'ArrowLeft' && bookIndex > 0) {
          setBookIndex(prev => prev - 1);
        }
      } else if (readingMode === 'carousel') {
        if (e.key === 'ArrowRight' && carouselIndex < shlokas.length - 1) {
          setCarouselIndex(prev => prev + 1);
        } else if (e.key === 'ArrowLeft' && carouselIndex > 0) {
          setCarouselIndex(prev => prev - 1);
        } else if (e.key === ' ') {
          e.preventDefault();
          if (activePlayingIndex === carouselIndex) {
            stopChanting();
            setActivePlayingIndex(null);
          } else {
            playVerse(carouselIndex);
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [readingMode, bookIndex, carouselIndex, activePlayingIndex, shlokas.length]);

  // Lock body scroll when full-screen Book Mode is open
  useEffect(() => {
    if (readingMode === 'book') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [readingMode]);

  useEffect(() => {
    return () => {
      stopChanting();
    };
  }, []);

  const prevSarga = sargaData.sarga > 1 ? sargaData.sarga - 1 : null;
  const nextSarga = sargaData.sarga < totalSargasInKanda ? sargaData.sarga + 1 : null;

  const currentCarouselShloka = shlokas[carouselIndex] || shlokas[0];
  const currentBookShloka = shlokas[bookIndex] || shlokas[0];

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'huge': return 'text-3xl sm:text-4xl';
      case 'large': return 'text-2xl sm:text-3xl';
      default: return 'text-xl sm:text-2xl';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-32">
      {/* Illuminated Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/25 text-xs text-[#f3d27a] mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <Link href={`/story/${sargaData.kanda}/`} className="hover:underline font-sanskrit font-medium">
            {sargaData.kandaName}
          </Link>
          <span>•</span>
          <span>Sarga {sargaData.sarga}</span>
        </div>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-gold-gradient">
          {sargaData.title}
        </h1>
        <p className="text-xs text-[#a39eb5] mt-2 font-mono">
          Valmiki Ramayana · {sargaData.kandaName} · {shlokas.length} Sacred Shlokas
        </p>
      </div>

      {/* Experience Controls Bar */}
      <div className="sticky top-16 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-[#07050d]/95 backdrop-blur-md border-y border-amber-400/15 flex flex-wrap items-center justify-between gap-3 mb-8">
        {/* Navigation & Chapter Indicator */}
        <div className="flex items-center gap-2">
          {prevSarga ? (
            <Link
              href={`/story/${sargaData.kanda}/${prevSarga}/`}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#a39eb5] hover:text-white transition-colors"
              title="Previous Sarga"
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>
          ) : (
            <div className="w-7" />
          )}

          <span className="font-cinzel text-sm sm:text-base font-bold text-amber-200">
            Sarga {sargaData.sarga} / {totalSargasInKanda}
          </span>

          {nextSarga ? (
            <Link
              href={`/story/${sargaData.kanda}/${nextSarga}/`}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[#a39eb5] hover:text-white transition-colors"
              title="Next Sarga"
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <div className="w-7" />
          )}
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex max-w-full items-center overflow-x-auto rounded-xl border border-white/10 bg-black/50 p-1 text-xs">
          <button
            onClick={() => setReadingMode('book')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              readingMode === 'book'
                ? 'saffron-gradient text-black font-bold shadow-sm'
                : 'text-[#a39eb5] hover:text-white'
            }`}
            title="Open Distraction-Free Book Mode"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Book Mode</span>
            <span className="sm:hidden">Book</span>
          </button>
          <button
            onClick={() => setReadingMode('manuscript')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              readingMode === 'manuscript'
                ? 'saffron-gradient text-black font-bold shadow-sm'
                : 'text-[#a39eb5] hover:text-white'
            }`}
          >
            <ScrollText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pothi Scroll</span>
            <span className="sm:hidden">Scroll</span>
          </button>
          <button
            onClick={() => setReadingMode('carousel')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              readingMode === 'carousel'
                ? 'saffron-gradient text-black font-bold shadow-sm'
                : 'text-[#a39eb5] hover:text-white'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sadhana Deck</span>
            <span className="sm:hidden">Deck</span>
          </button>
          <button
            onClick={() => setReadingMode('split')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              readingMode === 'split'
                ? 'saffron-gradient text-black font-bold shadow-sm'
                : 'text-[#a39eb5] hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Scholar Codex</span>
            <span className="sm:hidden">Scholar</span>
          </button>
        </div>

        {/* Script & Autoplay Quick Controls */}
        <div className="flex items-center gap-2">
          {/* Autoplay Sarga Chanting */}
          <button
            onClick={toggleAutoPlay}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isAutoPlaying
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30 animate-pulse'
                : 'bg-white/5 hover:bg-white/10 text-amber-300 border border-white/10'
            }`}
          >
            {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span className="hidden sm:inline">{isAutoPlaying ? 'Pause Sarga' : 'Chant Sarga'}</span>
          </button>

          {/* Script Dropdown */}
          <select
            value={script}
            onChange={e => setScript(e.target.value as ScriptType)}
            className="bg-[#120d24] text-xs text-[#f3d27a] border border-white/10 rounded-lg px-2.5 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="devanagari">देवनागरी (Devanagari)</option>
            <option value="iast">Roman (IAST)</option>
            <option value="telugu">తెలుగు (Telugu)</option>
            <option value="tamil">தமிழ் (Tamil)</option>
            <option value="kannada">ಕನ್ನಡ (Kannada)</option>
            <option value="bengali">বাংলা (Bengali)</option>
            <option value="malayalam">മലയാളം (Malayalam)</option>
            <option value="gujarati">ગુજરાતી (Gujarati)</option>
          </select>
        </div>
      </div>

      {/* FULL SCREEN BOOK STYLE VIEW */}
      {readingMode === 'book' && (
        <div 
          className="fixed inset-0 z-50 bg-[#06040a] text-[#f5efe6] flex flex-col justify-between p-4 sm:p-8 md:p-10 overflow-hidden select-none animate-in fade-in duration-200"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Subtle Ambient Sacred Illumination */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/20 via-[#0a0714] to-[#040207] pointer-events-none" />
          
          {/* Top Progress Line across the top of screen */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-30">
            <div 
              className="h-full saffron-gradient transition-all duration-300"
              style={{ width: `${((bookIndex + 1) / shlokas.length) * 100}%` }}
            />
          </div>

          {/* Minimalist Top Bar: Chapter Title, Counter, and Close Button Only */}
          <div className="relative z-20 flex items-center justify-between pb-3 border-b border-amber-400/20 max-w-5xl mx-auto w-full">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="font-cinzel text-xs sm:text-sm font-bold text-amber-300 tracking-wider">
                {sargaData.kandaName}
              </span>
              <span className="text-white/20">•</span>
              <span className="text-xs sm:text-sm text-amber-200/80 font-cinzel">
                Sarga {sargaData.sarga}
              </span>
              <span className="text-white/20">•</span>
              <span className="text-xs font-mono text-amber-400/90 bg-amber-500/10 border border-amber-500/25 px-2.5 py-0.5 rounded-full font-semibold">
                Shloka {bookIndex + 1} of {shlokas.length}
              </span>
            </div>

            {/* ONLY Close Button */}
            <button
              onClick={() => {
                setReadingMode('manuscript');
                if (typeof window !== 'undefined' && window.location.search.includes('mode=book')) {
                  const url = new URL(window.location.href);
                  url.searchParams.delete('mode');
                  window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-amber-400/40 text-xs text-white transition-all cursor-pointer shadow-lg active:scale-95"
              title="Close Book Mode (Esc)"
            >
              <span className="font-medium">Close</span>
              <X className="w-4 h-4 text-amber-400" />
            </button>
          </div>

          {/* Central Book Page: Pure Shloka Focus */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full my-auto px-2 sm:px-6 overflow-y-auto max-h-[calc(100vh-170px)]">
            <div className="w-full manuscript-pothi p-6 sm:p-12 md:p-14 rounded-3xl border border-amber-400/30 shadow-[0_0_60px_rgba(0,0,0,0.85)] relative overflow-hidden flex flex-col items-center justify-center min-h-[380px] sm:min-h-[460px]">
              
              {/* Sacred Verse Seal */}
              <div className="mb-6 flex items-center justify-center">
                <span className="px-4 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 font-sanskrit text-amber-300 text-sm font-semibold shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                  ॥ श्लोकः {currentBookShloka.shlokaNumber} ॥
                </span>
              </div>

              {/* The Sacred Sanskrit Shloka in Original Devanagari */}
              <p className={`font-sanskrit text-gold-gradient leading-relaxed sm:leading-loose font-medium px-2 sm:px-6 select-text max-w-3xl mx-auto text-center drop-shadow-[0_2px_10px_rgba(245,158,11,0.25)] transition-all ${
                fontSize === 'huge' 
                  ? 'text-3xl sm:text-5xl md:text-6xl' 
                  : (fontSize === 'large' ? 'text-2xl sm:text-4xl md:text-5xl' : 'text-xl sm:text-3xl md:text-4xl')
              }`}>
                {currentBookShloka.sanskrit}
              </p>

              {/* Transliteration (Regional Indic Script or Roman IAST) */}
              {script !== 'devanagari' ? (
                <p className="text-sm sm:text-base text-amber-200/90 font-serif max-w-xl mx-auto text-center mt-3 leading-relaxed">
                  {script === 'iast' 
                    ? currentBookShloka.transliteration 
                    : transliterate(currentBookShloka.sanskrit, script)}
                </p>
              ) : (
                currentBookShloka.transliteration && (
                  <p className="text-xs sm:text-sm text-[#a39eb5] italic max-w-xl mx-auto text-center mt-4 leading-relaxed font-light">
                    {currentBookShloka.transliteration}
                  </p>
                )
              )}

              {/* Verse Meaning */}
              {currentBookShloka.meaning && (
                <div className="mt-6 max-w-2xl mx-auto text-center border-t border-white/10 pt-4 px-4">
                  <p className="text-xs sm:text-sm text-[#f5efe6]/85 leading-relaxed font-light italic">
                    &ldquo;{currentBookShloka.meaning}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Bar: ONLY REQUIRED NAVIGATION BUTTONS */}
          <div className="relative z-20 max-w-3xl mx-auto w-full pt-4 border-t border-amber-400/15 flex items-center justify-between gap-4">
            {/* Previous Shloka Button */}
            {bookIndex > 0 ? (
              <button
                onClick={goToPrevShloka}
                className="flex items-center gap-2 px-6 sm:px-8 py-3.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 hover:border-amber-400/40 text-[#f5efe6] active:scale-95 transition-all text-sm font-semibold cursor-pointer shadow-lg"
              >
                <ArrowLeft className="w-4 h-4 text-amber-400" />
                <span>Previous</span>
              </button>
            ) : prevSarga ? (
              <Link
                href={`/story/${sargaData.kanda}/${prevSarga}/?mode=book`}
                className="flex items-center gap-2 px-6 sm:px-8 py-3.5 rounded-full border border-amber-400/25 bg-amber-500/10 hover:bg-amber-500/20 text-amber-200 active:scale-95 transition-all text-sm font-semibold shadow-lg"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Sarga {prevSarga}</span>
              </Link>
            ) : (
              <button
                disabled
                className="flex items-center gap-2 px-6 sm:px-8 py-3.5 rounded-full border border-white/5 bg-transparent text-white/20 text-sm font-semibold cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4 opacity-20" />
                <span>Previous</span>
              </button>
            )}

            {/* Center Shloka Progress & Swipe Hint */}
            <div className="text-center font-cinzel text-xs text-[#a39eb5]">
              <span className="text-amber-300 font-bold text-sm">{bookIndex + 1}</span>
              <span className="text-white/30 mx-1">/</span>
              <span>{shlokas.length}</span>
              <span className="text-[10px] text-amber-400/50 block tracking-wider mt-0.5">
                ← Swipe or Arrow keys →
              </span>
            </div>

            {/* Next Shloka Button */}
            {bookIndex < shlokas.length - 1 ? (
              <button
                onClick={goToNextShloka}
                className="flex items-center gap-2 px-6 sm:px-8 py-3.5 rounded-full saffron-gradient text-black font-bold shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 active:scale-95 transition-all text-sm cursor-pointer"
              >
                <span>Next Shloka</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : nextSarga ? (
              <Link
                href={`/story/${sargaData.kanda}/${nextSarga}/?mode=book`}
                className="flex items-center gap-2 px-6 sm:px-8 py-3.5 rounded-full saffron-gradient text-black font-bold shadow-lg shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all text-sm"
              >
                <span>Next Sarga →</span>
              </Link>
            ) : (
              <button
                disabled
                className="flex items-center gap-2 px-6 sm:px-8 py-3.5 rounded-full border border-white/5 bg-transparent text-white/20 text-sm font-semibold cursor-not-allowed"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4 opacity-20" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* MODE 1: THE ILLUMINATED POTHI MANUSCRIPT (Continuous Flow) */}
      {readingMode === 'manuscript' && (
        <div className="space-y-6 break-words">
          {shlokas.map((shloka, index) => {
            const isPlaying = activePlayingIndex === index;

            return (
              <article
                key={shloka.id || index}
                id={`shloka-${shloka.shlokaNumber}`}
                className={`manuscript-pothi p-6 sm:p-8 rounded-3xl transition-all duration-300 ${
                  isPlaying
                    ? 'ring-2 ring-amber-400 bg-amber-950/20 shadow-2xl'
                    : 'hover:border-amber-400/40'
                }`}
              >
                {/* Meta Bar */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/5 text-xs text-[#a39eb5]">
                  <div className="flex items-center gap-2 font-cinzel">
                    <span className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-[11px]">
                      {shloka.shlokaNumber}
                    </span>
                    <span className="text-amber-300/70 font-semibold">{sargaData.kandaName} {sargaData.sarga}.{shloka.shlokaNumber}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => playVerse(index)}
                      className={`px-3 py-1 rounded-full border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isPlaying
                          ? 'bg-amber-500 text-black border-amber-400 font-semibold shadow-md'
                          : 'bg-white/5 border-white/10 hover:border-amber-400/40 text-[#a39eb5] hover:text-white'
                      }`}
                      title="Chant this shloka"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-[11px]">{isPlaying ? 'Chanting...' : 'Chant'}</span>
                    </button>
                    <button
                      onClick={() => handleCopy(shloka)}
                      className="p-1.5 rounded-full bg-white/5 border border-white/10 hover:border-amber-400/40 text-[#a39eb5] hover:text-white transition-colors cursor-pointer"
                      title="Copy Sanskrit & Meaning"
                    >
                      {copiedId === shloka.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Sacred Sanskrit Verse in Original Devanagari */}
                <p className={`font-sanskrit text-gold-gradient leading-relaxed mb-4 font-medium ${getFontSizeClass()}`}>
                  {shloka.sanskrit}
                </p>

                {/* Transliteration (Regional Indic Script or Academic IAST) */}
                {script !== 'devanagari' ? (
                  <p className="text-sm sm:text-base text-amber-200/90 font-serif leading-relaxed mb-4">
                    {script === 'iast' ? shloka.transliteration : transliterate(shloka.sanskrit, script)}
                  </p>
                ) : (
                  shloka.transliteration && (
                    <p className="text-xs sm:text-sm text-[#a39eb5] italic leading-relaxed mb-4 font-light">
                      {shloka.transliteration}
                    </p>
                  )
                )}

                {/* Word-by-Word Padaccheda Toggle */}
                {shloka.wordByWord && (
                  <div className="my-4">
                    <button
                      onClick={() => toggleWbw(shloka.shlokaNumber)}
                      className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1.5 cursor-pointer"
                    >
                      <span className="underline decoration-amber-400/40 underline-offset-4">
                        {expandedWbw[shloka.shlokaNumber] ? 'Hide Word-by-Word Anvaya (पदच्छेद)' : 'Show Word-by-Word Anvaya (पदच्छेद)'}
                      </span>
                    </button>
                    {expandedWbw[shloka.shlokaNumber] && (
                      <div className="mt-3 p-4 rounded-2xl bg-black/60 border border-amber-400/20 text-xs text-[#f5efe6]/90 leading-relaxed font-sanskrit">
                        {shloka.wordByWord}
                      </div>
                    )}
                  </div>
                )}

                {/* English Meaning */}
                {shloka.meaning && (
                  <div className="pt-3 border-t border-white/5">
                    <p className="text-sm sm:text-base text-[#f5efe6]/90 leading-relaxed font-light">
                      {shloka.meaning}
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* MODE 2: THE MEDITATIVE SADHANA DECK (Verse-by-Verse Carousel) */}
      {readingMode === 'carousel' && (
        <div className="py-6">
          <div className="manuscript-pothi rounded-3xl p-8 sm:p-14 min-h-[480px] flex flex-col justify-between shadow-2xl relative">
            {/* Carousel Header & Counter */}
            <div className="flex items-center justify-between pb-4 border-b border-amber-400/15 text-xs text-[#a39eb5]">
              <div className="flex items-center gap-2">
                <span className="font-cinzel text-amber-300 font-bold text-sm">
                  Shloka {carouselIndex + 1} of {shlokas.length}
                </span>
                <span>•</span>
                <span className="font-mono text-[#a39eb5]">{currentCarouselShloka.id}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => playVerse(carouselIndex)}
                  className={`px-4 py-1.5 rounded-full border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                    activePlayingIndex === carouselIndex
                      ? 'bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/30'
                      : 'bg-white/5 border-white/10 text-amber-300 hover:text-white'
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{activePlayingIndex === carouselIndex ? 'Chanting...' : 'Chant This Shloka'}</span>
                </button>
              </div>
            </div>

            {/* Central Stage: Sacred Sanskrit Verse in Original Devanagari */}
            <div className="py-8 text-center space-y-6">
              <p className="font-sanskrit text-3xl sm:text-5xl text-gold-gradient leading-loose font-medium px-4">
                {currentCarouselShloka.sanskrit}
              </p>

              {/* Transliteration (Regional Indic Script or Academic IAST) */}
              {script !== 'devanagari' ? (
                <p className="text-base sm:text-lg text-amber-200/90 font-serif max-w-2xl mx-auto leading-relaxed">
                  {script === 'iast' 
                    ? currentCarouselShloka.transliteration 
                    : transliterate(currentCarouselShloka.sanskrit, script)}
                </p>
              ) : (
                currentCarouselShloka.transliteration && (
                  <p className="text-sm sm:text-base text-[#a39eb5] italic max-w-2xl mx-auto leading-relaxed">
                    {currentCarouselShloka.transliteration}
                  </p>
                )
              )}

              {currentCarouselShloka.meaning && (
                <p className="text-base sm:text-lg text-[#f5efe6]/90 max-w-3xl mx-auto leading-relaxed font-light pt-4 border-t border-white/5">
                  &ldquo;{currentCarouselShloka.meaning}&rdquo;
                </p>
              )}

              {currentCarouselShloka.wordByWord && (
                <div className="mt-4 p-4 rounded-2xl bg-black/40 border border-white/5 text-xs text-[#f3d27a]/80 font-sanskrit max-w-2xl mx-auto">
                  <span className="text-amber-400 font-semibold block mb-1">Anvaya / Breakdown:</span>
                  {currentCarouselShloka.wordByWord}
                </div>
              )}
            </div>

            {/* Stepper Controls */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between">
              <button
                onClick={() => setCarouselIndex(prev => Math.max(0, prev - 1))}
                disabled={carouselIndex === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold cursor-pointer ${
                  carouselIndex === 0
                    ? 'border-white/5 text-white/20 cursor-not-allowed'
                    : 'border-white/10 text-[#a39eb5] hover:text-white hover:border-amber-400/40'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Shloka</span>
              </button>

              <div className="text-center">
                <span className="text-xs text-[#a39eb5] block font-mono">
                  {Math.round(((carouselIndex + 1) / shlokas.length) * 100)}% of Sarga
                </span>
                <span className="text-[11px] text-amber-400/60 font-sans">
                  Use ← / → keys to browse · Space to chant
                </span>
              </div>

              <button
                onClick={() => setCarouselIndex(prev => Math.min(shlokas.length - 1, prev + 1))}
                disabled={carouselIndex === shlokas.length - 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold cursor-pointer ${
                  carouselIndex === shlokas.length - 1
                    ? 'border-white/5 text-white/20 cursor-not-allowed'
                    : 'saffron-gradient text-black font-bold shadow-md hover:opacity-95'
                }`}
              >
                <span>Next Shloka</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODE 3: THE SCHOLAR'S DUAL CODEX (Split View) */}
      {readingMode === 'split' && (
        <div className="space-y-6">
          {shlokas.map((shloka, index) => {
            const isPlaying = activePlayingIndex === index;

            return (
              <article
                key={shloka.id || index}
                id={`shloka-${shloka.shlokaNumber}`}
                className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 ${
                  isPlaying
                    ? 'bg-amber-950/20 border-amber-400 shadow-xl'
                    : 'bg-gradient-to-b from-[#110d21] to-[#080512] border-white/10'
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Sanskrit Sacred Verse */}
                  <div className="md:col-span-6 space-y-4">
                    <div className="flex items-center justify-between text-xs text-[#a39eb5]">
                      <span className="font-cinzel text-amber-300 font-bold">
                        Verse {shloka.shlokaNumber}
                      </span>
                      <button
                        onClick={() => playVerse(index)}
                        className={`px-3 py-1 rounded-full border text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                          isPlaying
                            ? 'bg-amber-500 text-black border-amber-400 font-semibold'
                            : 'bg-white/5 border-white/10 text-amber-300 hover:text-white'
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{isPlaying ? 'Chanting...' : 'Chant'}</span>
                      </button>
                    </div>

                    {/* Original Sacred Sanskrit Shloka in Devanagari */}
                    <p className="font-sanskrit text-2xl sm:text-3xl text-gold-gradient leading-relaxed font-medium">
                      {shloka.sanskrit}
                    </p>

                    {/* Transliteration (Regional Indic Script or Academic IAST) */}
                    {script !== 'devanagari' ? (
                      <p className="text-sm text-amber-200/90 font-serif leading-relaxed">
                        {script === 'iast' ? shloka.transliteration : transliterate(shloka.sanskrit, script)}
                      </p>
                    ) : (
                      shloka.transliteration && (
                        <p className="text-xs text-[#a39eb5] italic leading-relaxed">
                          {shloka.transliteration}
                        </p>
                      )
                    )}
                  </div>

                  {/* Right Column: Word Analysis & English Translation */}
                  <div className="md:col-span-6 space-y-4 md:border-l md:border-white/10 md:pl-8">
                    {shloka.meaning && (
                      <div>
                        <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider block mb-1 font-cinzel">
                          Translation
                        </span>
                        <p className="text-sm sm:text-base text-[#f5efe6]/90 leading-relaxed font-light">
                          {shloka.meaning}
                        </p>
                      </div>
                    )}

                    {shloka.wordByWord && (
                      <div className="pt-3 border-t border-white/5">
                        <span className="text-[11px] font-semibold text-[#f59e3a] uppercase tracking-wider block mb-1 font-cinzel">
                          Padaccheda / Anvaya
                        </span>
                        <p className="text-xs text-[#f3d27a]/80 font-sanskrit leading-relaxed">
                          {shloka.wordByWord}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Floating Bottom Audio Sanctum Bar */}
      {readingMode !== 'book' && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4">
          <div className="rounded-full bg-[#0a0714]/90 backdrop-blur-xl border border-amber-400/30 p-2 sm:p-2.5 shadow-2xl flex items-center justify-between gap-3 text-xs text-[#f5efe6]">
            {/* Autoplay Toggle */}
            <button
              onClick={toggleAutoPlay}
              className={`px-4 py-2 rounded-full font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                isAutoPlaying
                  ? 'bg-amber-500 text-black shadow-md animate-pulse'
                  : 'saffron-gradient text-black hover:opacity-90'
              }`}
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isAutoPlaying ? 'Pause Autoplay' : 'Continuous Chant'}</span>
            </button>

            {/* Active Status Display */}
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-[#a39eb5]">
              <span>Active:</span>
              <span className="text-amber-300 font-mono font-bold">
                {activePlayingIndex !== null 
                  ? `Shloka ${shlokas[activePlayingIndex]?.shlokaNumber}` 
                  : (readingMode === 'carousel' ? `Shloka ${carouselIndex + 1}` : 'Ready')}
              </span>
            </div>

            {/* Quick Script Selector in Bottom Bar */}
            <div className="flex items-center gap-2">
              <select
                value={script}
                onChange={e => setScript(e.target.value as ScriptType)}
                className="bg-black/50 text-[11px] text-amber-300 border border-white/10 rounded-full px-3 py-1.5 focus:outline-none cursor-pointer"
              >
                <option value="devanagari">Devanagari</option>
                <option value="iast">IAST Roman</option>
                <option value="telugu">Telugu</option>
                <option value="tamil">Tamil</option>
                <option value="kannada">Kannada</option>
                <option value="bengali">Bengali</option>
                <option value="malayalam">Malayalam</option>
                <option value="gujarati">Gujarati</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
