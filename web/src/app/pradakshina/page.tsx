'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, Play, Pause, RotateCcw, Volume2, CheckCircle2, Sparkles, 
  Trophy, CircleDot, ArrowRight, ArrowLeft, Disc, Compass
} from 'lucide-react';
import pradakshinaData from '@/data/pradakshina.json';
import { chantVerse, stopChanting } from '@/lib/audio';

export default function PradakshinaPage() {
  const [chantIndex, setChantIndex] = useState<number>(0);
  const [chantedNames, setChantedNames] = useState<Set<number>>(new Set());
  const [isAutoLoop, setIsAutoLoop] = useState(false);
  const [cadenceSpeed, setCadenceSpeed] = useState<number>(3500); // 3.5s per name
  const [viewStyle, setViewStyle] = useState<'sanctum' | 'mala' | 'catalog'>('sanctum');

  const currentName = pradakshinaData[chantIndex] || pradakshinaData[0];
  const progressPercent = Math.round((chantedNames.size / 108) * 100);

  const markChanted = (index: number) => {
    setChantedNames(prev => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  const handleNext = () => {
    markChanted(chantIndex);
    if (chantIndex < 107) {
      setChantIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (chantIndex > 0) {
      setChantIndex(prev => prev - 1);
    }
  };

  const handleReset = () => {
    stopChanting();
    setIsAutoLoop(false);
    setChantedNames(new Set());
    setChantIndex(0);
  };

  const playCurrentName = () => {
    chantVerse(currentName.name, () => {
      markChanted(chantIndex);
      if (isAutoLoop) {
        if (chantIndex < 107) {
          setTimeout(() => setChantIndex(c => c + 1), cadenceSpeed);
        } else {
          setIsAutoLoop(false);
        }
      }
    });
  };

  useEffect(() => {
    if (isAutoLoop) {
      playCurrentName();
    }
  }, [chantIndex, isAutoLoop]);

  useEffect(() => {
    return () => {
      stopChanting();
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Sanctum Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/25 text-xs text-[#f3d27a] mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-sanskrit tracking-wider">॥ श्रीरामाष्टोत्तरशतनामावली ॥ १०८ दिव्यनामानि</span>
        </div>
        <h1 className="font-cinzel text-3xl sm:text-5xl md:text-6xl font-bold text-gold-gradient">
          Temple Parikrama
        </h1>
        <p className="text-sm sm:text-base text-[#a39eb5] mt-3 leading-relaxed font-light">
          Circumambulate the sacred presence of Bhagavan Sri Rama. 
          Light all 108 eternal diyas through meditative recitation of the Ashtottara Shatanamavali.
        </p>

        {/* Parikrama Controller Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-8 p-4 rounded-2xl bg-white/[0.02] border border-amber-400/20 max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300">
              <Flame className="w-5 h-5 animate-flame" />
            </div>
            <div className="text-left">
              <div className="text-sm font-bold text-[#f5efe6] font-cinzel">
                {chantedNames.size} / 108 Diyas Lit
              </div>
              <div className="text-xs text-[#a39eb5]">
                {progressPercent}% Parikrama Completed
              </div>
            </div>
          </div>

          {/* View Modes & Reset */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewStyle('sanctum')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                viewStyle === 'sanctum' ? 'saffron-gradient text-black font-bold' : 'bg-white/5 text-[#a39eb5] hover:text-white'
              }`}
            >
              Sanctum
            </button>
            <button
              onClick={() => setViewStyle('mala')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                viewStyle === 'mala' ? 'saffron-gradient text-black font-bold' : 'bg-white/5 text-[#a39eb5] hover:text-white'
              }`}
            >
              108 Mala
            </button>
            <button
              onClick={() => setViewStyle('catalog')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                viewStyle === 'catalog' ? 'saffron-gradient text-black font-bold' : 'bg-white/5 text-[#a39eb5] hover:text-white'
              }`}
            >
              All Names
            </button>
            <button
              onClick={handleReset}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#a39eb5] hover:text-white border border-white/10"
              title="Reset Parikrama"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Completion Banner */}
      {chantedNames.size === 108 && (
        <div className="mb-10 p-8 rounded-3xl bg-gradient-to-r from-amber-500/25 via-orange-500/25 to-amber-500/25 border border-amber-400/50 text-center shadow-2xl animate-in zoom-in-95 duration-500">
          <Trophy className="w-12 h-12 text-amber-300 mx-auto mb-3 animate-bounce" />
          <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-gold-gradient">
            ॥ प्रदक्षिणा संपूर्णा · Parikrama Accomplished! ॥
          </h3>
          <p className="text-sm text-amber-200/90 mt-2 max-w-lg mx-auto font-light">
            You have completed the full 108-round circumambulation of Sri Rama's divine names. 
            May truth, courage, compassion, and divine peace abide in your heart.
          </p>
        </div>
      )}

      {/* VIEW 1: THE CENTRAL SANCTUM ALTAR (GARBHAGRIHA MANDALA) */}
      {viewStyle === 'sanctum' && (
        <div className="manuscript-pothi rounded-3xl p-5 sm:p-14 relative overflow-hidden text-center shadow-2xl mb-12">
          {/* Central Sanctum Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Diya Counter Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-xs text-amber-300 font-cinzel mb-4">
            <span>Diya #{currentName.id} of 108</span>
            <span>•</span>
            <span>Round {Math.floor(chantIndex / 12) + 1} of 9</span>
          </div>

          {/* Glowing Garbhagriha Centerpiece */}
          <div className="my-6 flex flex-col items-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-b from-amber-500/20 via-orange-900/30 to-black/60 border-2 border-amber-400/40 flex items-center justify-center sanctum-glow mb-6 relative">
              <span className="text-4xl sm:text-5xl animate-flame">🪔</span>
              {/* Radial Orbit Ring Indicators */}
              <div className="absolute inset-0 rounded-full border border-amber-300/30 animate-spin-slow" />
            </div>

            <h2 className="font-sanskrit text-2xl sm:text-5xl md:text-7xl font-bold text-gold-gradient leading-tight tracking-wide my-2 break-words max-w-full px-2">
              {currentName.name}
            </h2>

            <div className="text-lg sm:text-2xl text-amber-200/90 font-serif italic mt-1 font-light">
              {currentName.iast}
            </div>

            <p className="text-sm sm:text-base text-[#f5efe6]/90 max-w-xl mx-auto mt-6 leading-relaxed font-light">
              "{currentName.meaning}"
            </p>
          </div>

          {/* Action & Auto-Chant Bar */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-10 pt-6 border-t border-amber-400/15">
            <button
              onClick={handlePrev}
              disabled={chantIndex === 0}
              className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#a39eb5] hover:text-white disabled:opacity-20 cursor-pointer flex items-center gap-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous Diya</span>
            </button>

            <button
              onClick={playCurrentName}
              className="p-3.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 hover:scale-105 transition-all cursor-pointer shadow-md"
              title="Chant Name"
            >
              <Volume2 className="w-5 h-5 text-amber-400" />
            </button>

            <button
              onClick={() => setIsAutoLoop(l => !l)}
              className={`px-6 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                isAutoLoop
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30 font-bold animate-pulse'
                  : 'bg-white/10 hover:bg-white/15 text-[#f5efe6] border border-white/10'
              }`}
            >
              {isAutoLoop ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isAutoLoop ? 'Pause Auto-Chant' : 'Auto-Chant All 108'}</span>
            </button>

            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-full saffron-gradient text-black font-bold text-xs hover:opacity-95 shadow-lg shadow-orange-950/40 flex items-center gap-2 cursor-pointer"
            >
              <span>Light Next Diya</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* VIEW 2: SACRED 108 JAPA MALA BEADS VIEW */}
      {viewStyle === 'mala' && (
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-[#120d24] to-[#080512] border border-amber-400/20 mb-12">
          <div className="text-center mb-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#f59e3a] font-cinzel">
              ॥ अष्टोत्तरशत जपमाला · 108 Beads of Devotion ॥
            </span>
            <p className="text-xs text-[#a39eb5] mt-1">
              Each bead represents a sacred name. Click any bead to jump and chant that name.
            </p>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-12 gap-2 sm:gap-2.5 max-w-4xl mx-auto">
            {pradakshinaData.map((item, idx) => {
              const isLit = chantedNames.has(idx);
              const isCurrent = chantIndex === idx;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setChantIndex(idx);
                    markChanted(idx);
                    chantVerse(item.name);
                  }}
                  className={`aspect-square rounded-full flex flex-col items-center justify-center text-xs font-mono font-bold transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-amber-400 text-black ring-4 ring-amber-500/40 scale-110 shadow-lg'
                      : isLit
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-sm'
                      : 'bg-white/5 text-[#a39eb5] hover:bg-white/10 border border-white/5'
                  }`}
                  title={`${item.id}. ${item.name} (${item.meaning})`}
                >
                  <span className="text-[10px]">{item.id}</span>
                  {isLit && <Flame className="w-2.5 h-2.5 text-amber-400 animate-flame" />}
                </button>
              );
            })}
          </div>

          {/* Active Bead Highlight */}
          <div className="mt-8 p-5 rounded-2xl bg-black/50 border border-white/10 text-center max-w-xl mx-auto">
            <div className="font-sanskrit text-2xl font-bold text-gold-gradient">
              {currentName.name}
            </div>
            <div className="text-xs text-[#a39eb5] italic mt-0.5">{currentName.iast}</div>
            <p className="text-xs text-[#f5efe6]/90 mt-2">"{currentName.meaning}"</p>
          </div>
        </div>
      )}

      {/* VIEW 3: EXHAUSTIVE CATALOG GRID */}
      {viewStyle === 'catalog' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-cinzel text-lg font-bold text-[#f5efe6]">
              All 108 Sacred Names
            </h3>
            <span className="text-xs text-[#a39eb5]">Click any card to chant & illuminate</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {pradakshinaData.map((item, idx) => {
              const isLit = chantedNames.has(idx);
              const isCurrent = chantIndex === idx;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setChantIndex(idx);
                    markChanted(idx);
                    chantVerse(item.name);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    isCurrent
                      ? 'bg-amber-950/40 border-amber-400 ring-1 ring-amber-400 scale-[1.01]'
                      : isLit
                      ? 'bg-amber-500/[0.07] border-amber-500/30'
                      : 'bg-[#0e0a1b]/60 border-white/5 hover:border-amber-400/30 hover:bg-[#151026]'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-amber-400 font-bold">
                        #{item.id}
                      </span>
                      <h4 className="font-sanskrit text-base font-bold text-[#f3d27a]">
                        {item.name}
                      </h4>
                    </div>
                    <div className="text-xs text-[#a39eb5] italic mt-0.5">
                      {item.iast}
                    </div>
                    <p className="text-[11px] text-[#f5efe6]/80 mt-1 line-clamp-2">
                      {item.meaning}
                    </p>
                  </div>

                  <div className="shrink-0 mt-1">
                    <Flame
                      className={`w-5 h-5 transition-colors ${
                        isLit
                          ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(245,158,58,0.8)] animate-flame'
                          : 'text-white/20'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
