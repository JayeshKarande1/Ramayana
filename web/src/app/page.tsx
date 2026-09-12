'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  BookOpen, Compass, Flame, Users, Calendar, Volume2, ArrowRight, 
  Sparkles, ShieldCheck, MapPin, Feather, HeartHandshake, Eye
} from 'lucide-react';
import kandasData from '@/data/kandas.json';
import { chantVerse, playTempleBell, playDiyaSpark } from '@/lib/audio';
import EpicTurningPoints from '@/components/EpicTurningPoints';

export default function HomePage() {
  const [isPlayingShloka, setIsPlayingShloka] = useState(false);
  const [selectedKandaIndex, setSelectedKandaIndex] = useState(0);

  const dailyShloka = {
    sanskrit: "मा निषाद प्रतिष्ठां त्वमगमश्शाश्वतीस्समा: । यत्क्रौञ्चमिथुनादेकमवधी: काममोहितम् ॥",
    transliteration: "mā niṣāda pratiṣṭhāṃ tvamagamaśśāśvatīssamā: · yatkrauñcamithunādekamavadhī: kāmamohitam",
    meaning: "\"O hunter, you shall find no peace for eternal years, since you have slain one of the love-bound curlew pair.\" — The spontaneous compassionate grief of sage Valmiki that birthed the first shloka of human literature.",
    citation: "Bala Kanda · Sarga 2, Shloka 15",
    theme: "The Birth of Poetry through Compassion (Karuna Rasa)",
    reflection: "Dharma begins not with cold law, but with spontaneous empathy for suffering creatures. When Valmiki witnessed grief, poetry was born to heal the world.",
    link: "/story/bala/2#shloka-15"
  };

  const handlePlayShloka = () => {
    setIsPlayingShloka(true);
    chantVerse(dailyShloka.sanskrit, () => setIsPlayingShloka(false));
  };

  const activeKanda = kandasData[selectedKandaIndex] || kandasData[0];

  const kandaHighlights: Record<string, { theme: string; quote: string; pivot: string }> = {
    bala: {
      theme: "The Divine Birth & Youthful Vows",
      quote: "Rama breaks Shiva's celestial bow Pinaka, uniting with Sita in Mithila.",
      pivot: "The descent of Vishnu to uphold cosmic righteousness through mortal human form."
    },
    ayodhya: {
      theme: "The Test of Duty & Renunciation",
      quote: "Rama accepts fourteen years of forest exile without a shred of resentment.",
      pivot: "Dharma transcends political power; truth to father's word eclipses the throne."
    },
    aranya: {
      theme: "The Forest of Peril & Separation",
      quote: "Panchavati serenity shattered by the golden deer deception and Sita's abduction.",
      pivot: "The peaceful hermitage years end; the inevitable conflict with cosmic evil begins."
    },
    kishkindha: {
      theme: "The Forest Alliances & Unshakable Loyalty",
      quote: "Rama forms the eternal covenant of friendship with Sugriva and meets Hanuman.",
      pivot: "The righteous bond between man and the forest kingdom to locate the divine mother."
    },
    sundara: {
      theme: "The Leap of Faith & Victorious Devotion",
      quote: "Hanuman leaps the ocean, delivers Rama's ring to Sita, and incinerates Lanka.",
      pivot: "A lone devotee's unwavering faith turns the tide against impossible odds."
    },
    yuddha: {
      theme: "The Great War of Dharma & Liberation",
      quote: "The construction of Rama Setu, fall of Kumbhakarna and Ravana, and Rama's coronation.",
      pivot: "Adharma is annihilated; righteousness is established across the three realms."
    },
    uttara: {
      theme: "The Golden Age & Eternal Return",
      quote: "The Ramarajya golden era, Lava-Kusha's recitation, and Rama's ascension to Vaikuntha.",
      pivot: "The culmination of the mortal avatar and its eternal reverberation through history."
    }
  };

  const currentHighlight = kandaHighlights[activeKanda.id] || {
    theme: activeKanda.subtitle,
    quote: activeKanda.description,
    pivot: "A sacred chapter in the eternal epic."
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Sanctum Hero Experience */}
      <section className="relative w-full py-20 sm:py-28 px-4 flex flex-col items-center text-center overflow-hidden">
        {/* Divine Background Illumination */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-28 left-1/3 w-[300px] h-[300px] bg-orange-600/10 rounded-full blur-[90px] pointer-events-none" />

        {/* Floating Sacred Diya Flame Icon */}
        <div className="relative z-10 flex items-center justify-center mb-6">
          <button
            onClick={() => playTempleBell(392)}
            className="relative w-16 h-16 rounded-full bg-gradient-to-b from-amber-500/20 to-orange-950/40 border border-amber-400/30 flex items-center justify-center sanctum-glow hover:scale-110 active:scale-95 transition-all cursor-pointer group"
            title="Ring Sacred Temple Bell (Ghanta)"
          >
            <span className="text-2xl animate-flame select-none group-hover:scale-125 transition-transform">🪔</span>
          </button>
        </div>

        {/* Sacred Invocation Badge */}
        <div className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/25 text-xs text-[#f3d27a] mb-5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-sanskrit tracking-wider font-medium">॥ श्रीरामो जयति ॥ आदिकाव्यम् श्रीमद्वाल्मीकीयम्</span>
        </div>

        {/* Majestic Title */}
        <h1 className="relative z-10 font-cinzel text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-gold-gradient max-w-4xl leading-tight">
          The Living Ramayana
        </h1>
        <p className="relative z-10 font-sanskrit text-2xl sm:text-3xl text-amber-200/90 mt-2 font-medium tracking-wide">
          श्रीमद्वाल्मीकीय रामायणम्
        </p>

        {/* Poetic Subtitle */}
        <p className="relative z-10 max-w-2xl text-[#a39eb5] text-base sm:text-lg mt-5 leading-relaxed font-light">
          Traverse 21,640 sacred verses across seven Kandas and fifteen sacred lands. 
          Experience the epic not as a static book, but as an interactive spiritual odyssey.
        </p>

        {/* Hero Quick Action CTAs */}
        <div className="relative z-10 flex flex-wrap items-center justify-center gap-3.5 mt-8">
          <Link
            href="/story"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-400 text-black font-semibold text-sm tracking-wide transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Open Scripture Codex</span>
          </Link>
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event('open-ramayana-prologue'));
              }
            }}
            className="px-6 py-3 rounded-full bg-amber-500/15 border border-amber-400/40 hover:border-amber-300 text-amber-200 hover:text-white font-medium text-sm tracking-wide transition-all shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:shadow-[0_0_25px_rgba(245,158,11,0.35)] flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Experience Prologue</span>
          </button>
          <Link
            href="/journey"
            className="px-5 py-3 rounded-full bg-white/5 border border-white/10 hover:border-amber-400/40 text-sm text-[#a39eb5] hover:text-white transition-all flex items-center gap-2"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Rama Yatra</span>
          </Link>
        </div>

        {/* Three Experiential Gateways (Cards) */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl w-full mt-12 text-left">
          {/* Gateway 1: The Living Codex */}
          <Link
            href="/story"
            className="group relative p-6 rounded-2xl bg-gradient-to-b from-[#18112b]/90 to-[#0c0817]/90 border border-amber-400/30 hover:border-amber-400/70 transition-all duration-300 shadow-xl hover:-translate-y-1 ring-1 ring-amber-400/20"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="text-xs font-semibold tracking-widest text-[#f59e3a] uppercase font-cinzel">Gateway I</div>
            <h3 className="font-cinzel text-xl font-bold text-[#f5efe6] mt-1 group-hover:text-amber-300 transition-colors">
              The Living Samhita
            </h3>
            <p className="text-xs text-[#a39eb5] mt-2 leading-relaxed">
              648 Sargas with word-by-word Sanskrit Anvaya breakdown, audio chanting, and meditative full-screen focus.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>Open Samhita</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Gateway 2: Rama Yatra */}
          <Link
            href="/journey"
            className="group relative p-6 rounded-2xl bg-gradient-to-b from-[#161026]/90 to-[#0c0817]/90 border border-amber-400/20 hover:border-amber-400/60 transition-all duration-300 shadow-xl hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <div className="text-xs font-semibold tracking-widest text-[#f59e3a] uppercase font-cinzel">Gateway II</div>
            <h3 className="font-cinzel text-xl font-bold text-[#f5efe6] mt-1 group-hover:text-amber-300 transition-colors">
              Rama Yatra (Sacred Journey)
            </h3>
            <p className="text-xs text-[#a39eb5] mt-2 leading-relaxed">
              Step into Rama&apos;s footsteps across 3,000 km and 15 sacred geographic milestones from Ayodhya to Lanka.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>Begin Rama Yatra</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Gateway 3: Sacred Sadhana */}
          <Link
            href="/pradakshina"
            className="group relative p-6 rounded-2xl bg-gradient-to-b from-[#161026]/90 to-[#0c0817]/90 border border-amber-400/20 hover:border-amber-400/60 transition-all duration-300 shadow-xl hover:-translate-y-1"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
              <Flame className="w-6 h-6" />
            </div>
            <div className="text-xs font-semibold tracking-widest text-[#f59e3a] uppercase font-cinzel">Gateway III</div>
            <h3 className="font-cinzel text-xl font-bold text-[#f5efe6] mt-1 group-hover:text-amber-300 transition-colors">
              Temple Parikrama
            </h3>
            <p className="text-xs text-[#a39eb5] mt-2 leading-relaxed">
              Circumambulate 108 Sacred Names of Sri Rama with interactive diya lighting and automatic temple chanting cadence.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>Enter Sanctum</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        </div>

        {/* Global Statistics Ribbon */}
        <div className="relative z-10 flex flex-wrap justify-center items-center gap-4 sm:gap-12 mt-14 py-4 px-4 sm:px-8 rounded-2xl sm:rounded-full bg-white/[0.03] border border-amber-400/20 backdrop-blur-md">
          <div className="text-center">
            <span className="font-cinzel font-bold text-amber-300 text-lg sm:text-xl">7</span>
            <span className="text-[11px] text-[#a39eb5] ml-2">Kandas</span>
          </div>
          <div className="w-px h-4 bg-white/10 hidden sm:block" />
          <div className="text-center">
            <span className="font-cinzel font-bold text-amber-300 text-lg sm:text-xl">648</span>
            <span className="text-[11px] text-[#a39eb5] ml-2">Sargas</span>
          </div>
          <div className="w-px h-4 bg-white/10 hidden sm:block" />
          <div className="text-center">
            <span className="font-cinzel font-bold text-amber-300 text-lg sm:text-xl">21,640</span>
            <span className="text-[11px] text-[#a39eb5] ml-2">Verses</span>
          </div>
          <div className="w-px h-4 bg-white/10 hidden sm:block" />
          <div className="text-center">
            <span className="font-cinzel font-bold text-amber-300 text-lg sm:text-xl">15</span>
            <span className="text-[11px] text-[#a39eb5] ml-2">Sacred Lands</span>
          </div>
          <div className="w-px h-4 bg-white/10 hidden sm:block" />
          <div className="text-center">
            <span className="font-cinzel font-bold text-amber-300 text-lg sm:text-xl">194</span>
            <span className="text-[11px] text-[#a39eb5] ml-2">Personalities</span>
          </div>
        </div>
      </section>

      {/* Saptakanda Wheel: The Chronological Epic Arc */}
      <section className="w-full max-w-6xl px-4 py-16">
        <div className="text-center mb-8">
          <span className="text-xs tracking-widest text-[#f59e3a] uppercase font-semibold">सप्तकाण्डानि · The Epic Continuum</span>
          <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-[#f5efe6] mt-1">
            The Seven Divine Cantos
          </h2>
          <p className="text-sm text-[#a39eb5] max-w-xl mx-auto mt-2 font-light">
            Select a Canto to reveal its spiritual essence, pivotal drama, and sacred metric count.
          </p>
        </div>

        {/* Kanda Selector Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 pt-2 no-scrollbar">
          {kandasData.map((k, idx) => {
            const isSelected = idx === selectedKandaIndex;
            return (
              <button
                key={k.id}
                onClick={() => {
                  setSelectedKandaIndex(idx);
                  playDiyaSpark();
                }}
                className={`px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? 'saffron-gradient text-black shadow-lg shadow-orange-950/40 font-bold scale-105'
                    : 'bg-white/5 border border-white/10 text-[#a39eb5] hover:text-white hover:border-amber-400/30'
                }`}
              >
                <span>{k.romanNumeral}.</span>
                <span>{k.name}</span>
                <span className="font-sanskrit text-[11px] opacity-80">({k.sanskrit})</span>
              </button>
            );
          })}
        </div>

        {/* Active Kanda Showcase Stage */}
        <div className="mt-6 rounded-3xl bg-gradient-to-br from-[#150f24] via-[#0f0a1d] to-[#080512] border border-amber-400/25 p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-xs text-amber-300 font-medium">
                <span>Book {activeKanda.romanNumeral}</span>
                <span>•</span>
                <span className="font-sanskrit">{activeKanda.sanskrit}</span>
              </div>

              <div>
                <h3 className="font-cinzel text-3xl sm:text-4xl font-bold text-[#f5efe6]">
                  {activeKanda.name} Kanda
                </h3>
                <p className="text-sm font-medium text-[#f59e3a] mt-1">
                  {currentHighlight.theme}
                </p>
              </div>

              <p className="text-sm text-[#a39eb5] leading-relaxed">
                {activeKanda.description}
              </p>

              {/* Turning Point Highlight */}
              <div className="p-4 rounded-xl bg-white/[0.02] border-l-2 border-amber-400 text-xs text-white/90">
                <span className="font-semibold text-amber-300 block mb-1">Dharmic Milestone:</span>
                {currentHighlight.pivot}
              </div>
            </div>

            {/* Metrics & Action Card */}
            <div className="flex flex-col gap-4 w-full lg:w-72 shrink-0 bg-black/40 p-6 rounded-2xl border border-white/10">
              <div className="flex justify-between items-center text-xs pb-3 border-b border-white/10">
                <span className="text-[#a39eb5]">Sargas (Chapters)</span>
                <span className="font-cinzel font-bold text-amber-300 text-base">{activeKanda.sargasCount}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-3 border-b border-white/10">
                <span className="text-[#a39eb5]">Sacred Verses</span>
                <span className="font-cinzel font-bold text-amber-300 text-base">{activeKanda.shlokasCount.toLocaleString()}</span>
              </div>
              <div className="pt-2">
                <Link
                  href={`/story/${activeKanda.id}/1`}
                  className="w-full py-3 rounded-full saffron-gradient text-black font-semibold text-xs text-center hover:opacity-95 transition-all shadow-md flex items-center justify-center gap-2 group"
                >
                  <span>Read Sarga 1 of {activeKanda.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href={`/story/${activeKanda.id}`}
                  className="w-full mt-2 py-2 text-center text-xs text-[#a39eb5] hover:text-amber-300 transition-colors block"
                >
                  Browse all {activeKanda.sargasCount} Sargas →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scrollytelling Epic Arc: The Seven Turning Points of Dharma */}
      <EpicTurningPoints />

      {/* Daily Contemplation Altar (Dharma Card) */}
      <section className="w-full max-w-5xl px-4 py-12">
        <div className="text-center mb-6">
          <span className="text-xs tracking-widest text-[#f59e3a] uppercase font-semibold">नित्यदर्शनम् · Daily Contemplation</span>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#f5efe6] mt-1">
            The Living Shloka
          </h2>
        </div>

        <div className="manuscript-pothi rounded-3xl p-6 sm:p-10 relative overflow-hidden">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/25">
              {dailyShloka.theme}
            </span>
            <button
              onClick={handlePlayShloka}
              className={`px-4 py-2 rounded-full border transition-all flex items-center gap-2 text-xs font-medium cursor-pointer ${
                isPlayingShloka
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-md shadow-amber-500/25 animate-pulse'
                  : 'bg-white/5 border-white/10 text-[#a39eb5] hover:text-white'
              }`}
              title="Chant this shloka"
            >
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span>{isPlayingShloka ? 'Chanting in Sanskrit...' : 'Listen Chanted'}</span>
            </button>
          </div>

          <p className="font-sanskrit text-2xl sm:text-3xl md:text-4xl text-center text-gold-gradient leading-relaxed my-6 font-medium">
            {dailyShloka.sanskrit}
          </p>

          <p className="text-center text-xs sm:text-sm text-[#a39eb5] italic max-w-2xl mx-auto my-3">
            {dailyShloka.transliteration}
          </p>

          <p className="text-center text-sm sm:text-base text-[#f5efe6]/90 max-w-3xl mx-auto mt-4 leading-relaxed font-light">
            {dailyShloka.meaning}
          </p>

          {/* Dharmic Contemplation Box */}
          <div className="mt-8 pt-6 border-t border-amber-400/15 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#a39eb5] text-center sm:text-left max-w-xl">
              <span className="text-amber-300 font-semibold">Contemplation: </span>
              {dailyShloka.reflection}
            </div>
            <Link
              href={dailyShloka.link}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 shrink-0"
            >
              <span>{dailyShloka.citation}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Four Additional Experiential Portals */}
      <section className="w-full max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Box 1: Characters & Dharma Charitra */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-[#140e24] to-[#0a0714] border border-amber-400/20 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-4">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold tracking-widest text-[#f59e3a] uppercase font-cinzel">Lineages &amp; Charitra</span>
              <h3 className="font-cinzel text-2xl font-bold text-[#f5efe6] mt-1">
                194 Named Personalities
              </h3>
              <p className="text-xs sm:text-sm text-[#a39eb5] mt-2 leading-relaxed">
                Discover the complex tapestry of characters across 12 spiritual and social tiers: 
                The Solar Dynasty, Vanara chieftains, Asura rulers, and immortal Rishis.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
              <span className="text-xs text-amber-300/80 font-medium">12 Faction Tiers</span>
              <Link
                href="/characters"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300"
              >
                <span>Explore Charitra</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Box 2: 7-Day Sundara Kanda Parayana */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-[#140e24] to-[#0a0714] border border-amber-400/20 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-300 mb-4">
                <Calendar className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold tracking-widest text-[#f59e3a] uppercase font-cinzel">Sadhana Regimen</span>
              <h3 className="font-cinzel text-2xl font-bold text-[#f5efe6] mt-1">
                Sundara Kanda 7-Day Parayana
              </h3>
              <p className="text-xs sm:text-sm text-[#a39eb5] mt-2 leading-relaxed">
                Follow the traditional Saptaha sadhana regimen dividing the 68 Sargas across seven days 
                with invocation shlokas, daily sankalpa, and progress tracking.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
              <span className="text-xs text-amber-300/80 font-medium">68 Chapters · 7 Days</span>
              <Link
                href="/parayana"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300"
              >
                <span>Open Sadhana Altar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Box 3: The Divyastra Kosha & Sacred Relics */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-[#140e24] to-[#0a0714] border border-amber-400/20 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300 mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold tracking-widest text-[#f59e3a] uppercase font-cinzel">Divyastra Kosha</span>
              <h3 className="font-cinzel text-2xl font-bold text-[#f5efe6] mt-1">
                Divine Arsenal &amp; Relics
              </h3>
              <p className="text-xs sm:text-sm text-[#a39eb5] mt-2 leading-relaxed">
                Behold the celestial astras and holy tokens: Kodanda bow, Pinaka, Brahmastra, 
                Rama&apos;s signet ring, and the Sanjeevani Himalayan peak.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
              <span className="text-xs text-amber-300/80 font-medium">7 Legendary Relics</span>
              <Link
                href="/relics"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300"
              >
                <span>Enter Divyastra Kosha</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Box 4: Dharma Niti Compass */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-[#140e24] to-[#0a0714] border border-amber-400/20 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-300 mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-xs font-semibold tracking-widest text-[#f59e3a] uppercase font-cinzel">Ethical Archetype</span>
              <h3 className="font-cinzel text-2xl font-bold text-[#f5efe6] mt-1">
                Dharma Niti (Moral Compass)
              </h3>
              <p className="text-xs sm:text-sm text-[#a39eb5] mt-2 leading-relaxed">
                Reflect on three profound moral dilemmas to discover which sacred archetype 
                (Rama, Sita, Lakshmana, Hanuman, Bharata, Vibhishana) mirrors your soul.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
              <span className="text-xs text-amber-300/80 font-medium">3-Dilemma Matcher</span>
              <Link
                href="/compass"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300"
              >
                <span>Explore Dharma Niti</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Phalasruti Benediction Footer Section */}
      <section className="w-full py-16 px-4 text-center border-t border-amber-400/15 bg-[#040207]">
        <div className="max-w-2xl mx-auto space-y-4">
          <span className="text-xs tracking-widest text-amber-400 uppercase font-semibold font-cinzel">
            ॥ फलश्रुतिः · The Divine Benediction ॥
          </span>
          <p className="font-sanskrit text-xl sm:text-2xl text-gold-gradient leading-relaxed font-medium">
            इदं पवित्रं पापघ्नं पुण्यं वेदैश्च सम्मितम् ।<br />
            य: पठेद्रामचरितं सर्वपापै: प्रमुच्यते ॥
          </p>
          <p className="text-xs text-[#a39eb5] italic">
            idaṃ pavitraṃ pāpaghnaṃ puṇyaṃ vedaiśca sammitam · ya: paṭhedrāmacaritaṃ sarvapāpai: pramucyate
          </p>
          <p className="text-xs sm:text-sm text-[#f5efe6]/80 leading-relaxed font-light">
            "This account of Rama is pure and sanctifying. It dispels adversity and is peer to the Vedas. 
            Whosoever reflects upon it with devotion is freed from all distress."
          </p>
        </div>
      </section>
    </div>
  );
}
