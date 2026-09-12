'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Volume2, VolumeX, Play, Pause, ChevronLeft, ChevronRight, 
  Copy, Check, BookOpen, Sparkles, ScrollText, Maximize2, 
  Columns, Settings, Layers, ArrowLeft, ArrowRight, Share2
} from 'lucide-react';
import { chantVerse, stopChanting } from '@/lib/audio';
import { transliterate, ScriptType } from '@/lib/transliteration';

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
  // Reading mode: 'manuscript' (illuminated scroll), 'carousel' (focused sadhana deck), 'split' (scholar dual codex)
  const [readingMode, setReadingMode] = useState<'manuscript' | 'carousel' | 'split'>('manuscript');
  const [script, setScript] = useState<ScriptType>('devanagari');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('normal');
  const [activePlayingIndex, setActivePlayingIndex] = useState<number | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedWbw, setExpandedWbw] = useState<Record<number, boolean>>({});

  const shlokas = sargaData.shlokas || [];
  const activePlayingIndexRef = useRef<number | null>(null);
  activePlayingIndexRef.current = activePlayingIndex;
  const isAutoPlayingRef = useRef<boolean>(false);
  isAutoPlayingRef.current = isAutoPlaying;

  const playVerse = (index: number, autoAdvance = false) => {
    if (index >= shlokas.length) {
      setIsAutoPlaying(false);
      setActivePlayingIndex(null);
      return;
    }

    setActivePlayingIndex(index);
    if (readingMode === 'carousel') {
      setCarouselIndex(index);
    }
    const shloka = shlokas[index];

    // Scroll to verse card if in manuscript or split mode
    if (readingMode !== 'carousel') {
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
      const startIndex = readingMode === 'carousel' ? carouselIndex : (activePlayingIndex !== null ? activePlayingIndex : 0);
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

  // Keyboard navigation for Carousel mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (readingMode === 'carousel') {
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
  }, [readingMode, carouselIndex, activePlayingIndex, shlokas.length]);

  useEffect(() => {
    return () => {
      stopChanting();
    };
  }, []);

  const prevSarga = sargaData.sarga > 1 ? sargaData.sarga - 1 : null;
  const nextSarga = sargaData.sarga < totalSargasInKanda ? sargaData.sarga + 1 : null;

  const currentCarouselShloka = shlokas[carouselIndex] || shlokas[0];

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'huge': return 'text-3xl sm:text-4xl';
      case 'large': return 'text-2xl sm:text-3xl';
      default: return 'text-xl sm:text-2xl';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-32">
      {/* Illuminated Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/25 text-xs text-[#f3d27a] mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <Link href={`/story/${sargaData.kanda}`} className="hover:underline font-sanskrit font-medium">
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
              href={`/story/${sargaData.kanda}/${prevSarga}`}
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
              href={`/story/${sargaData.kanda}/${nextSarga}`}
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
        <div className="flex items-center bg-black/50 p-1 rounded-xl border border-white/10 text-xs">
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
          </select>
        </div>
      </div>

      {/* MODE 1: THE ILLUMINATED POTHI MANUSCRIPT (Continuous Flow) */}
      {readingMode === 'manuscript' && (
        <div className="space-y-6">
          {shlokas.map((shloka, index) => {
            const isPlaying = activePlayingIndex === index;
            const displaySanskrit = script === 'iast' 
              ? shloka.transliteration 
              : transliterate(shloka.sanskrit, script);

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

                {/* Sacred Sanskrit Verse */}
                <p className={`font-sanskrit text-gold-gradient leading-relaxed mb-4 font-medium ${getFontSizeClass()}`}>
                  {displaySanskrit}
                </p>

                {/* Academic Transliteration */}
                {script !== 'iast' && shloka.transliteration && (
                  <p className="text-xs sm:text-sm text-[#a39eb5] italic leading-relaxed mb-4 font-light">
                    {shloka.transliteration}
                  </p>
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

            {/* Central Stage: Sanskrit Verse */}
            <div className="py-8 text-center space-y-6">
              <p className="font-sanskrit text-3xl sm:text-5xl text-gold-gradient leading-loose font-medium px-4">
                {script === 'iast' 
                  ? currentCarouselShloka.transliteration 
                  : transliterate(currentCarouselShloka.sanskrit, script)}
              </p>

              {script !== 'iast' && currentCarouselShloka.transliteration && (
                <p className="text-sm sm:text-base text-[#a39eb5] italic max-w-2xl mx-auto leading-relaxed">
                  {currentCarouselShloka.transliteration}
                </p>
              )}

              {currentCarouselShloka.meaning && (
                <p className="text-base sm:text-lg text-[#f5efe6]/90 max-w-3xl mx-auto leading-relaxed font-light pt-4 border-t border-white/5">
                  "{currentCarouselShloka.meaning}"
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
            const displaySanskrit = script === 'iast' 
              ? shloka.transliteration 
              : transliterate(shloka.sanskrit, script);

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

                    <p className="font-sanskrit text-2xl sm:text-3xl text-gold-gradient leading-relaxed font-medium">
                      {displaySanskrit}
                    </p>

                    {script !== 'iast' && shloka.transliteration && (
                      <p className="text-xs text-[#a39eb5] italic leading-relaxed">
                        {shloka.transliteration}
                      </p>
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
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
