'use client';

import React, { useState, useEffect } from 'react';
import { Flame, Play, Pause, RotateCcw, Volume2, CheckCircle2, Sparkles, Trophy } from 'lucide-react';
import pradakshinaData from '@/data/pradakshina.json';
import { chantVerse, stopChanting } from '@/lib/audio';

export default function PradakshinaPage() {
  const [chantIndex, setChantIndex] = useState<number>(0);
  const [chantedNames, setChantedNames] = useState<Set<number>>(new Set());
  const [isAutoLoop, setIsAutoLoop] = useState(false);
  const [viewMode, setViewMode] = useState<'stepper' | 'grid'>('stepper');

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
          setTimeout(() => setChantIndex(c => c + 1), 700);
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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-xs tracking-widest text-[#f59e3a] uppercase font-semibold">
          प्रदक्षिणा · Śrī Rāma Aṣṭottara Śatanāmāvalī
        </span>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-gold-gradient mt-2">
          Pradakshina · 108 Sacred Names
        </h1>
        <p className="text-sm text-[#a39eb5] mt-3 leading-relaxed">
          Circumambulate the divine presence of Sri Rama by chanting the 108 sacred names. Tap each diya or let the continuous parikrama guide your meditation.
        </p>
      </div>

      {/* Progress & Stats Bar */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#0e0a1b] border border-amber-400/20 mb-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-300">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-sm font-bold text-[#f3f0e6]">
              {chantedNames.size} of 108 Diyas Lit
            </div>
            <div className="text-xs text-[#a39eb5]">
              {progressPercent}% of Sacred Parikrama Completed
            </div>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full sm:w-64 h-2 rounded-full bg-white/10 overflow-hidden">
          <div 
            className="h-full saffron-gradient transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* View Mode Toggle & Reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(v => v === 'stepper' ? 'grid' : 'stepper')}
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-[#a39eb5] hover:text-white"
          >
            {viewMode === 'stepper' ? 'Show Grid View' : 'Focus Stepper'}
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-[#a39eb5] hover:text-white"
            title="Reset Parikrama"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Completion Celebration Banner */}
      {chantedNames.size === 108 && (
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/20 border border-amber-400/40 text-center animate-in zoom-in-95 duration-500">
          <Trophy className="w-10 h-10 text-[#f3d27a] mx-auto mb-2" />
          <h3 className="font-cinzel text-xl font-bold text-gold-gradient">
            Parikrama Sampoorna! (प्रदक्षिणा संपूर्णा)
          </h3>
          <p className="text-xs sm:text-sm text-amber-200/80 mt-1 max-w-md mx-auto">
            You have offered your devotion through all 108 sacred names of Sri Rama. May his peace, strength, and righteousness fill your life.
          </p>
        </div>
      )}

      {/* Stepper Focus Mode */}
      {viewMode === 'stepper' && (
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-[#150f29] via-[#0d091a] to-[#07050d] border border-amber-400/30 text-center shadow-2xl relative overflow-hidden mb-12">
          <div className="text-xs font-mono text-[#f59e3a] mb-2 uppercase tracking-widest">
            Name {currentName.id} of 108
          </div>

          <div className="my-6">
            <h2 className="font-sanskrit text-4xl sm:text-6xl font-bold text-gold-gradient leading-tight tracking-wide">
              {currentName.name}
            </h2>
            <div className="text-base sm:text-xl text-amber-200/80 font-serif italic mt-2">
              {currentName.iast}
            </div>
          </div>

          <p className="text-sm sm:text-base text-[#f3f0e6]/90 max-w-xl mx-auto my-6 leading-relaxed">
            "{currentName.meaning}"
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4 mt-8 flex-wrap">
            <button
              onClick={handlePrev}
              disabled={chantIndex === 0}
              className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-[#a39eb5] hover:text-white disabled:opacity-30 cursor-pointer"
            >
              ← Previous
            </button>

            <button
              onClick={playCurrentName}
              className="p-3 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:scale-105 transition-all cursor-pointer"
              title="Chant Name"
            >
              <Volume2 className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsAutoLoop(l => !l)}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all ${
                isAutoLoop
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/30 animate-pulse'
                  : 'bg-white/10 hover:bg-white/15 text-[#f3f0e6] border border-white/10'
              }`}
            >
              {isAutoLoop ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isAutoLoop ? 'Pause Auto-Chant' : 'Auto-Chant All'}</span>
            </button>

            <button
              onClick={handleNext}
              className="px-6 py-2 rounded-full saffron-gradient text-black font-semibold text-xs hover:opacity-95 cursor-pointer"
            >
              Chant & Next (🪔) →
            </button>
          </div>
        </div>
      )}

      {/* Grid Mode (All 108 Diyas) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-cinzel text-lg font-bold text-[#f3f0e6]">
            All 108 Names of Sri Rama
          </h2>
          <span className="text-xs text-[#a39eb5]">Click any name to chant & light the diya</span>
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
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                  isCurrent
                    ? 'bg-amber-950/40 border-amber-400 ring-1 ring-amber-400'
                    : isLit
                    ? 'bg-amber-500/[0.06] border-amber-500/30'
                    : 'bg-[#0e0a1b]/60 border-white/5 hover:border-amber-400/30'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-[#f59e3a]">
                      #{item.id}
                    </span>
                    <h3 className="font-sanskrit text-base font-bold text-[#f3d27a]">
                      {item.name}
                    </h3>
                  </div>
                  <div className="text-xs text-[#a39eb5] italic mt-0.5">
                    {item.iast}
                  </div>
                  <p className="text-[11px] text-[#f3f0e6]/80 mt-1 line-clamp-2">
                    {item.meaning}
                  </p>
                </div>

                <div className="shrink-0 mt-1">
                  <Flame
                    className={`w-5 h-5 transition-colors ${
                      isLit
                        ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(245,158,58,0.8)]'
                        : 'text-white/20'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
