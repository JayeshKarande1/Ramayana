'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Volume2, VolumeX, Play, Pause, ChevronLeft, ChevronRight, 
  Copy, Check, BookOpen, Sparkles, SlidersHorizontal 
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
  const [viewMode, setViewMode] = useState<'study' | 'chanting' | 'bilingual'>('study');
  const [script, setScript] = useState<ScriptType>('devanagari');
  const [activePlayingIndex, setActivePlayingIndex] = useState<number | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
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
    const shloka = shlokas[index];

    // Scroll to verse card
    const element = document.getElementById(`shloka-${shloka.shlokaNumber}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    chantVerse(shloka.sanskrit, () => {
      if (isAutoPlayingRef.current) {
        setTimeout(() => {
          playVerse(index + 1, true);
        }, 800);
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
      playVerse(activePlayingIndex !== null ? activePlayingIndex : 0, true);
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

  useEffect(() => {
    return () => {
      stopChanting();
    };
  }, []);

  const prevSarga = sargaData.sarga > 1 ? sargaData.sarga - 1 : null;
  const nextSarga = sargaData.sarga < totalSargasInKanda ? sargaData.sarga + 1 : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Controls Bar */}
      <div className="sticky top-16 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-[#07050d]/95 backdrop-blur-md border-b border-white/10 flex flex-wrap items-center justify-between gap-3 mb-8">
        {/* Sarga Prev/Next Navigation */}
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
            Sarga {sargaData.sarga}
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

          <span className="text-xs text-[#a39eb5] font-mono ml-2">
            ({shlokas.length} shlokas)
          </span>
        </div>

        {/* Action Controls: Autoplay, View Mode & Script */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Autoplay Sarga Button */}
          <button
            onClick={toggleAutoPlay}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isAutoPlaying
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30 animate-pulse'
                : 'bg-white/5 hover:bg-white/10 text-[#f3f0e6] border border-white/10'
            }`}
          >
            {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isAutoPlaying ? 'Pause Chanting' : 'Chant Sarga'}</span>
          </button>

          {/* Reading Mode Selector */}
          <div className="flex items-center bg-white/5 rounded-lg p-0.5 border border-white/10 text-xs">
            <button
              onClick={() => setViewMode('study')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                viewMode === 'study' ? 'bg-[#f59e3a] text-black font-semibold' : 'text-[#a39eb5]'
              }`}
            >
              Study
            </button>
            <button
              onClick={() => setViewMode('chanting')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                viewMode === 'chanting' ? 'bg-[#f59e3a] text-black font-semibold' : 'text-[#a39eb5]'
              }`}
            >
              Chant
            </button>
          </div>

          {/* Script Dropdown */}
          <select
            value={script}
            onChange={e => setScript(e.target.value as ScriptType)}
            className="bg-[#120d24] text-xs text-[#f3d27a] border border-white/10 rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer"
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

      {/* Sarga Header Info */}
      <div className="text-center mb-10">
        <Link
          href={`/story/${sargaData.kanda}`}
          className="text-xs uppercase tracking-widest text-[#f59e3a] font-semibold hover:underline"
        >
          {sargaData.kandaName}
        </Link>
        <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-gold-gradient mt-1">
          {sargaData.title}
        </h1>
        <p className="text-xs text-[#a39eb5] mt-1 font-mono">
          Valmiki Ramayana · {sargaData.kanda.toUpperCase()} Chapter {sargaData.sarga}
        </p>
      </div>

      {/* Shlokas List */}
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
              className={`p-6 rounded-2xl border transition-all duration-300 ${
                isPlaying
                  ? 'bg-amber-950/20 border-amber-400/60 shadow-xl shadow-amber-950/40 ring-1 ring-amber-400/40'
                  : 'bg-[#0e0a1b]/60 border-white/10 hover:border-amber-400/20'
              }`}
            >
              {/* Card Meta Bar */}
              <div className="flex items-center justify-between mb-4 text-xs text-[#a39eb5]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[#f59e3a] font-semibold">
                    {shloka.id}
                  </span>
                  <span>·</span>
                  <span>Verse {shloka.shlokaNumber}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Play Single Shloka */}
                  <button
                    onClick={() => playVerse(index)}
                    className={`p-1.5 rounded-full border transition-colors cursor-pointer ${
                      isPlaying
                        ? 'bg-amber-500 text-black border-amber-400'
                        : 'bg-white/5 border-white/10 hover:border-amber-400/40 text-[#a39eb5] hover:text-white'
                    }`}
                    title="Chant this verse"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Copy Shloka */}
                  <button
                    onClick={() => handleCopy(shloka)}
                    className="p-1.5 rounded-full bg-white/5 border border-white/10 hover:border-amber-400/40 text-[#a39eb5] hover:text-white transition-colors cursor-pointer"
                    title="Copy Sanskrit & Meaning"
                  >
                    {copiedId === shloka.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Sanskrit Verse */}
              <p
                className={`font-sanskrit text-gold-gradient leading-relaxed ${
                  viewMode === 'chanting'
                    ? 'text-2xl sm:text-3xl text-center my-6 font-medium tracking-wide'
                    : 'text-xl sm:text-2xl mb-3'
                }`}
              >
                {displaySanskrit}
              </p>

              {/* Transliteration (Shown in study/bilingual modes if script is not already Roman) */}
              {viewMode !== 'chanting' && script !== 'iast' && shloka.transliteration && (
                <p className="text-xs sm:text-sm text-[#a39eb5] italic leading-relaxed mb-4">
                  {shloka.transliteration}
                </p>
              )}

              {/* Study Mode: Word-by-Word Accordion */}
              {viewMode === 'study' && shloka.wordByWord && (
                <div className="my-3">
                  <button
                    onClick={() => toggleWbw(shloka.shlokaNumber)}
                    className="text-xs text-[#f59e3a] hover:underline font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <span>{expandedWbw[shloka.shlokaNumber] ? 'Hide Word Breakdown (पदच्छेद/अन्वय)' : 'Show Word Breakdown (पदच्छेद/अन्वय)'}</span>
                  </button>
                  {expandedWbw[shloka.shlokaNumber] && (
                    <div className="mt-2 p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-[#f3f0e6]/80 leading-relaxed font-sanskrit">
                      {shloka.wordByWord}
                    </div>
                  )}
                </div>
              )}

              {/* English Meaning / Translation */}
              {viewMode !== 'chanting' && shloka.meaning && (
                <div className="mt-3 pt-3 border-t border-white/5">
                  <p className="text-sm text-[#f3f0e6]/90 leading-relaxed">
                    {shloka.meaning}
                  </p>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Bottom Sarga Navigation */}
      <div className="mt-12 pt-8 border-t border-white/10 flex items-center justify-between">
        {prevSarga ? (
          <Link
            href={`/story/${sargaData.kanda}/${prevSarga}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#f3f0e6] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Previous (Sarga {prevSarga})
          </Link>
        ) : (
          <div />
        )}

        <Link
          href={`/story/${sargaData.kanda}`}
          className="text-xs font-semibold text-[#f59e3a] hover:underline"
        >
          Back to {sargaData.kandaName} Index
        </Link>

        {nextSarga ? (
          <Link
            href={`/story/${sargaData.kanda}/${nextSarga}`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full saffron-gradient text-black text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            Next (Sarga {nextSarga}) <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
}
