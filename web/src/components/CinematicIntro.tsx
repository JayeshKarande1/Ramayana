'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, Sparkles, ArrowRight, X } from 'lucide-react';
import { playTempleBell, playConchShell, playDiyaSpark } from '@/lib/audio';

export default function CinematicIntro() {
  const [isOpen, setIsOpen] = useState(false);
  const [act, setAct] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [isMuted, setIsMuted] = useState(false);
  const [arrowFired, setArrowFired] = useState(false);

  // Check session storage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const seen = sessionStorage.getItem('ramayana_prologue_completed');
    if (!seen) {
      setIsOpen(true);
    }

    const handleOpenEvent = () => {
      setAct(0);
      setArrowFired(false);
      setIsOpen(true);
    };

    window.addEventListener('open-ramayana-prologue', handleOpenEvent);
    return () => window.removeEventListener('open-ramayana-prologue', handleOpenEvent);
  }, []);

  // Keyboard shortcut (Escape to skip)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSkip = useCallback(() => {
    sessionStorage.setItem('ramayana_prologue_completed', 'true');
    setIsOpen(false);
  }, []);

  const startJourney = () => {
    setAct(1);
    if (!isMuted) {
      playTempleBell(392); // G4 bell
    }

    // Act 1 -> Act 2
    setTimeout(() => {
      setAct(2);
      if (!isMuted) {
        playDiyaSpark();
      }
    }, 3200);

    // Act 2 -> Act 3
    setTimeout(() => {
      setAct(3);
    }, 6600);

    // Act 3 -> Act 4
    setTimeout(() => {
      setAct(4);
    }, 10000);
  };

  const releaseArrow = () => {
    setArrowFired(true);
    if (!isMuted) {
      playConchShell();
    }
    setTimeout(() => {
      handleSkip();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-[#06040a] transition-opacity duration-1000 ${arrowFired ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      {/* Background Sacred Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-950/25 via-[#0a0714] to-[#040207] pointer-events-none" />
      
      {/* Radial Aura Rings */}
      <div className="absolute w-[600px] h-[600px] rounded-full border border-amber-500/10 animate-ping pointer-events-none" style={{ animationDuration: '8s' }} />
      <div className="absolute w-[400px] h-[400px] rounded-full border border-amber-400/15 pointer-events-none" />

      {/* Top Header Controls */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-amber-200/80 hover:text-white hover:border-amber-500/30 transition-all cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
          <span>{isMuted ? 'Sound Muted' : 'Sacred Audio'}</span>
        </button>

        <button
          onClick={handleSkip}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[#a39eb5] hover:text-white hover:border-amber-500/30 transition-all cursor-pointer"
        >
          <span>Skip Prologue</span>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ACT 0: The Invitation Altar */}
      {act === 0 && (
        <div className="relative z-10 max-w-xl px-6 text-center animate-fade-in">
          {/* Sacred Seal Icon */}
          <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-700 p-0.5 shadow-[0_0_50px_rgba(245,158,11,0.3)] mb-8 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#0d091a] flex flex-col items-center justify-center">
              <span className="font-sanskrit text-2xl font-bold text-amber-300">श्री</span>
              <span className="text-[9px] tracking-widest text-amber-400/80 font-cinzel uppercase">Sanctum</span>
            </div>
          </div>

          <h2 className="font-sanskrit text-3xl sm:text-4xl text-amber-100 font-bold tracking-wide mb-3">
            श्रीमद्वाल्मीकीय रामायणम्
          </h2>
          <p className="font-cinzel text-lg sm:text-xl tracking-widest text-amber-300/90 mb-4 uppercase">
            The Awakening of the Epic
          </p>
          <p className="text-sm text-[#a39eb5] leading-relaxed max-w-md mx-auto mb-8 font-serif italic">
            &ldquo;Step beyond the threshold of ordinary time. Experience the timeless resonance of Dharma, devotion, and the hero&apos;s eternal path.&rdquo;
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={startJourney}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-black font-semibold text-sm tracking-wider uppercase hover:shadow-[0_0_35px_rgba(245,158,11,0.6)] hover:scale-105 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Awaken Prologue</span>
            </button>
            <button
              onClick={handleSkip}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white/5 border border-white/10 hover:border-amber-500/30 text-xs text-[#a39eb5] hover:text-white transition-all cursor-pointer"
            >
              Direct to Sanctuary
            </button>
          </div>
        </div>
      )}

      {/* ACT 1: The Cosmic Void */}
      {act === 1 && (
        <div className="relative z-10 max-w-xl px-6 text-center animate-fade-in transition-all duration-1000">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full border border-amber-400/40 flex items-center justify-center animate-spin" style={{ animationDuration: '20s' }}>
            <div className="w-2 h-2 rounded-full bg-amber-300 animate-ping" />
          </div>
          <p className="font-cinzel text-xs uppercase tracking-[0.3em] text-amber-400/80 mb-3">
            Act I · The First Resonance
          </p>
          <p className="font-sanskrit text-2xl sm:text-3xl text-amber-100 font-semibold mb-4 leading-relaxed">
            मा निषाद प्रतिष्ठां त्वमगमः शाश्वतीः समाः
          </p>
          <p className="text-sm text-[#c5c0d6] font-serif italic">
            &ldquo;Before recorded history, grief transformed into metric melody — and the Adi Kavya was born.&rdquo;
          </p>
        </div>
      )}

      {/* ACT 2: The Sacred Flame (Diya) */}
      {act === 2 && (
        <div className="relative z-10 max-w-xl px-6 text-center animate-fade-in transition-all duration-1000">
          {/* Animated Glowing Diya */}
          <div className="relative mx-auto w-24 h-24 mb-6 flex items-center justify-center">
            <div className="absolute w-20 h-20 bg-amber-500/30 rounded-full blur-xl animate-pulse" />
            <svg className="w-20 h-20 drop-shadow-[0_0_20px_rgba(245,158,11,0.8)]" viewBox="0 0 100 100">
              {/* Diya Base */}
              <path
                d="M 20,62 C 20,82 80,82 80,62 C 80,62 85,55 90,52 C 80,55 20,55 10,52 C 15,55 20,62 20,62 Z"
                fill="#d97706"
                stroke="#fef3c7"
                strokeWidth="1.5"
              />
              {/* Flame */}
              <path
                d="M 50,20 C 45,34 38,42 50,55 C 62,42 55,34 50,20 Z"
                fill="url(#flameGrad)"
                className="animate-flame origin-bottom"
              />
              <defs>
                <linearGradient id="flameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="35%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#ea580c" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <p className="font-cinzel text-xs uppercase tracking-[0.3em] text-amber-400/80 mb-3">
            Act II · The Eternal Lamp
          </p>
          <h3 className="font-sanskrit text-3xl sm:text-4xl text-amber-200 font-bold mb-3 tracking-wide">
            ॥ धर्मो रक्षति रक्षितः ॥
          </h3>
          <p className="font-display text-base sm:text-lg text-amber-100/90 font-serif italic">
            &ldquo;Dharma protects those who protect Dharma.&rdquo;
          </p>
        </div>
      )}

      {/* ACT 3: The Embodiment of Dharma */}
      {act === 3 && (
        <div className="relative z-10 max-w-2xl px-6 text-center animate-fade-in transition-all duration-1000">
          <p className="font-cinzel text-xs uppercase tracking-[0.3em] text-amber-400/80 mb-3">
            Act III · The Supreme Paragon
          </p>
          <h3 className="font-sanskrit text-2xl sm:text-3xl text-amber-200 font-bold mb-4 leading-relaxed">
            रामो विग्रहवान् धर्मः साधुः सत्यपराक्रमः ।<br />
            राजा सर्वस्य लोकस्य देवानामिव वासवः ॥
          </h3>
          <p className="font-display text-base sm:text-lg text-[#e0dad0] max-w-lg mx-auto font-serif italic mb-2">
            &ldquo;Rama is Dharma incarnate — virtuous, steadfast in truth, and the rightful sovereign of all worlds.&rdquo;
          </p>
          <span className="text-[11px] font-mono text-amber-400/60 uppercase tracking-widest">
            Valmiki Ramayana · Aranya Kanda 37.13
          </span>
        </div>
      )}

      {/* ACT 4: The Golden Bow & Arrow */}
      {act === 4 && (
        <div className="relative z-10 max-w-xl px-6 text-center animate-fade-in transition-all duration-700">
          <p className="font-cinzel text-xs uppercase tracking-[0.3em] text-amber-400/80 mb-6">
            Act IV · The Celestial Kodanda
          </p>

          {/* Golden Bow & Arrow Graphic */}
          <div className="relative mx-auto w-64 h-32 mb-8 flex items-center justify-center">
            <svg className="w-full h-full drop-shadow-[0_0_25px_rgba(245,158,11,0.7)]" viewBox="0 0 200 100">
              {/* Bow Arc */}
              <path
                d="M 30,15 Q 100,50 30,85"
                fill="none"
                stroke="#fbbf24"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {/* Bowstring */}
              <line
                x1="30"
                y1="15"
                x2={arrowFired ? "30" : "55"}
                y2="50"
                stroke="#fef3c7"
                strokeWidth="1.5"
                strokeDasharray="2 1"
              />
              <line
                x1="30"
                y1="85"
                x2={arrowFired ? "30" : "55"}
                y2="50"
                stroke="#fef3c7"
                strokeWidth="1.5"
                strokeDasharray="2 1"
              />
              {/* Arrow */}
              <g className={`transition-transform duration-700 ${arrowFired ? 'translate-x-96' : 'translate-x-0'}`}>
                <line x1="50" y1="50" x2="160" y2="50" stroke="#fff" strokeWidth="2.5" />
                <polygon points="160,45 175,50 160,55" fill="#fbbf24" />
                {/* Arrow Glow */}
                <circle cx="170" cy="50" r="8" fill="rgba(251, 191, 36, 0.5)" className="animate-ping" />
              </g>
            </svg>
          </div>

          <button
            onClick={releaseArrow}
            disabled={arrowFired}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 text-black font-semibold text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(245,158,11,0.6)] hover:scale-105 transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
          >
            <span>Release Arrow & Enter Sanctum</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Progress Dots Bottom */}
      <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-2 z-20">
        {[0, 1, 2, 3, 4].map((step) => (
          <button
            key={step}
            onClick={() => {
              if (step === 0) setAct(0);
              else if (step === 1) startJourney();
              else setAct(step as any);
            }}
            className={`h-1.5 rounded-full transition-all ${
              act === step ? 'w-8 bg-amber-400' : 'w-2 bg-white/20 hover:bg-white/40'
            }`}
            aria-label={`Go to Act ${step}`}
          />
        ))}
      </div>
    </div>
  );
}
