'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Compass, Flame, Users, Search, Calendar, Volume2, ArrowRight, Sparkles } from 'lucide-react';
import kandasData from '@/data/kandas.json';
import { chantVerse } from '@/lib/audio';

export default function HomePage() {
  const [isPlayingShloka, setIsPlayingShloka] = useState(false);

  const dailyShloka = {
    sanskrit: "मा निषाद प्रतिष्ठां त्वमगमश्शाश्वतीस्समा: । यत्क्रौञ्चमिथुनादेकमवधी: काममोहितम् ॥",
    transliteration: "mā niṣāda pratiṣṭhāṃ tvamagamaśśāśvatīssamā: · yatkrauñcamithunādekamavadhī: kāmamohitam",
    meaning: "\"O hunter, you shall find no rest for unending years, since you have slain one of the love-bound curlew pair.\" — The spontaneous grief of sage Valmiki that birthed the shloka metre.",
    citation: "Bala Kanda · Sarga 2, Shloka 15",
    link: "/story/bala/2#shloka-15"
  };

  const handlePlayShloka = () => {
    setIsPlayingShloka(true);
    chantVerse(dailyShloka.sanskrit, () => setIsPlayingShloka(false));
  };

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full py-24 sm:py-32 px-4 flex flex-col items-center text-center overflow-hidden bg-gradient-to-b from-[#0b0819] via-[#07050d] to-[#07050d]">
        {/* Ambient Glow Orb */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Sacred Invocation Badge */}
        <div className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-amber-400/20 text-xs text-[#f3d27a] mb-6">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-sanskrit tracking-wider">॥ श्रीरामो जयति ॥ आदिकाव्यम्</span>
        </div>

        {/* Main Headings */}
        <h1 className="relative z-10 font-cinzel text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-gold-gradient max-w-4xl">
          Valmiki Ramayana
        </h1>
        <p className="relative z-10 font-sanskrit text-2xl sm:text-4xl text-amber-300/80 mt-2 font-medium tracking-wide">
          श्रीमद्वाल्मीकीय रामायणम्
        </p>

        {/* Lead Quote */}
        <p className="relative z-10 max-w-2xl text-[#a39eb5] text-base sm:text-lg mt-6 leading-relaxed font-light">
          Twenty-one thousand sacred verses. Seven Kandas. One ideal life of righteousness, devotion, and compassion — sung by Maharishi Valmiki two and a half millennia ago.
        </p>

        {/* Call to Actions */}
        <div className="relative z-10 flex flex-wrap justify-center items-center gap-4 mt-8">
          <Link
            href="/story/bala/1"
            className="px-7 py-3 rounded-full saffron-gradient text-black font-semibold text-sm hover:opacity-95 transition-all shadow-lg shadow-orange-950/50 flex items-center gap-2 group"
          >
            <span>Begin Reading First Shloka</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/journey"
            className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[#f3f0e6] font-medium text-sm transition-all flex items-center gap-2"
          >
            <Compass className="w-4 h-4 text-[#f59e3a]" />
            <span>Trace 14-Year Map</span>
          </Link>
          <Link
            href="/pradakshina"
            className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[#f3f0e6] font-medium text-sm transition-all flex items-center gap-2"
          >
            <Flame className="w-4 h-4 text-[#f59e3a]" />
            <span>108 Names Parikrama</span>
          </Link>
        </div>

        {/* Scripture Stats */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 max-w-3xl w-full mt-16 p-6 rounded-2xl bg-white/[0.02] border border-amber-400/15 backdrop-blur-sm">
          <div>
            <div className="font-cinzel text-2xl sm:text-3xl font-bold text-[#f3d27a]">7</div>
            <div className="text-xs text-[#a39eb5] mt-0.5">Kandas (Books)</div>
          </div>
          <div>
            <div className="font-cinzel text-2xl sm:text-3xl font-bold text-[#f3d27a]">648</div>
            <div className="text-xs text-[#a39eb5] mt-0.5">Sargas (Chapters)</div>
          </div>
          <div>
            <div className="font-cinzel text-2xl sm:text-3xl font-bold text-[#f3d27a]">21,640+</div>
            <div className="text-xs text-[#a39eb5] mt-0.5">Sacred Shlokas</div>
          </div>
          <div>
            <div className="font-cinzel text-2xl sm:text-3xl font-bold text-[#f3d27a]">194</div>
            <div className="text-xs text-[#a39eb5] mt-0.5">Personalities</div>
          </div>
        </div>
      </section>

      {/* Daily Darshan / Shloka of the Day */}
      <section className="w-full max-w-5xl px-4 py-16">
        <div className="text-center mb-8">
          <span className="text-xs tracking-widest text-[#f59e3a] uppercase font-semibold">नित्यदर्शनम् · Daily Darshan</span>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#f3f0e6] mt-1">Today's Sacred Verse</h2>
        </div>

        <div className="relative rounded-2xl bg-gradient-to-br from-[#120d24] to-[#0a0714] border border-amber-400/20 p-6 sm:p-10 shadow-xl overflow-hidden">
          <div className="flex justify-between items-start gap-4 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20">
              The Genesis Verse
            </span>
            <button
              onClick={handlePlayShloka}
              className={`p-2.5 rounded-full border transition-all flex items-center gap-2 text-xs ${
                isPlayingShloka
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 animate-pulse'
                  : 'bg-white/5 border-white/10 text-[#a39eb5] hover:text-white'
              }`}
              title="Chant this shloka"
            >
              <Volume2 className="w-4 h-4 text-[#f59e3a]" />
              <span className="hidden sm:inline">{isPlayingShloka ? 'Chanting...' : 'Listen Chanted'}</span>
            </button>
          </div>

          <p className="font-sanskrit text-xl sm:text-3xl text-center text-gold-gradient leading-relaxed my-4 font-medium">
            {dailyShloka.sanskrit}
          </p>

          <p className="text-center text-xs sm:text-sm text-[#a39eb5] italic max-w-2xl mx-auto my-3">
            {dailyShloka.transliteration}
          </p>

          <p className="text-center text-sm sm:text-base text-[#f3f0e6]/90 max-w-3xl mx-auto mt-4 leading-relaxed">
            {dailyShloka.meaning}
          </p>

          <div className="flex justify-center mt-6">
            <Link
              href={dailyShloka.link}
              className="text-xs font-semibold text-[#f59e3a] hover:underline flex items-center gap-1"
            >
              Read in context — {dailyShloka.citation} →
            </Link>
          </div>
        </div>
      </section>

      {/* Six Ways Into The Epic */}
      <section className="w-full max-w-6xl px-4 py-12">
        <div className="text-center mb-10">
          <span className="text-xs tracking-widest text-[#f59e3a] uppercase font-semibold">प्रकल्पः · Explorations</span>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#f3f0e6] mt-1">Six Pathways into the Epic</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Pathway 1 */}
          <Link href="/story" className="p-6 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-amber-400/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 text-[#f59e3a] group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="font-sanskrit text-sm text-[#f3d27a]/60">कथा</div>
            <h3 className="font-cinzel text-lg font-bold text-[#f3f0e6] mt-0.5">The Complete Scripture</h3>
            <p className="text-xs text-[#a39eb5] mt-2 leading-relaxed">
              Read all 7 Kandas and 648 Sargas with word-by-word Sanskrit breakdown and modern translations.
            </p>
          </Link>

          {/* Pathway 2 */}
          <Link href="/journey" className="p-6 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-amber-400/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-4 text-[#f59e3a] group-hover:scale-110 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <div className="font-sanskrit text-sm text-[#f3d27a]/60">यात्रा</div>
            <h3 className="font-cinzel text-lg font-bold text-[#f3f0e6] mt-0.5">Rama's 14-Year Map</h3>
            <p className="text-xs text-[#a39eb5] mt-2 leading-relaxed">
              Trace the 3,000 km journey across 15 sacred stops from Ayodhya through Panchavati and Kishkindha to Lanka.
            </p>
          </Link>

          {/* Pathway 3 */}
          <Link href="/pradakshina" className="p-6 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-amber-400/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 text-[#f59e3a] group-hover:scale-110 transition-transform">
              <Flame className="w-6 h-6" />
            </div>
            <div className="font-sanskrit text-sm text-[#f3d27a]/60">प्रदक्षिणा</div>
            <h3 className="font-cinzel text-lg font-bold text-[#f3f0e6] mt-0.5">Pradakshina · 108 Names</h3>
            <p className="text-xs text-[#a39eb5] mt-2 leading-relaxed">
              Chant the 108 names of Sri Rama with an interactive diya lighting experience and audio accompaniment.
            </p>
          </Link>

          {/* Pathway 4 */}
          <Link href="/characters" className="p-6 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-amber-400/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4 text-[#f59e3a] group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <div className="font-sanskrit text-sm text-[#f3d27a]/60">पात्राणि</div>
            <h3 className="font-cinzel text-lg font-bold text-[#f3f0e6] mt-0.5">194 Personalities</h3>
            <p className="text-xs text-[#a39eb5] mt-2 leading-relaxed">
              Explore the exhaustive roster of gods, sages, warriors, vanaras, and rakshasas grouped across 12 tiers.
            </p>
          </Link>

          {/* Pathway 5 */}
          <Link href="/parayana" className="p-6 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-amber-400/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 text-[#f59e3a] group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <div className="font-sanskrit text-sm text-[#f3d27a]/60">पारायणम्</div>
            <h3 className="font-cinzel text-lg font-bold text-[#f3f0e6] mt-0.5">Parayana Schedules</h3>
            <p className="text-xs text-[#a39eb5] mt-2 leading-relaxed">
              Structured 7-day, 9-day, and 16-day recital trackers for Sundara Kanda and Bala Kanda sadhana.
            </p>
          </Link>

          {/* Pathway 6 */}
          <button 
            onClick={() => {
              window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
            }} 
            className="p-6 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-amber-400/40 transition-all group text-left cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mb-4 text-[#f59e3a] group-hover:scale-110 transition-transform">
              <Search className="w-6 h-6" />
            </div>
            <div className="font-sanskrit text-sm text-[#f3d27a]/60">अन्वेषणम्</div>
            <h3 className="font-cinzel text-lg font-bold text-[#f3f0e6] mt-0.5">Instant Search (FTS5)</h3>
            <p className="text-xs text-[#a39eb5] mt-2 leading-relaxed">
              Instant sub-50ms search across all 21,640 verses in both Sanskrit Devanagari and English prose.
            </p>
          </button>
        </div>
      </section>

      {/* The Seven Kandas Section */}
      <section className="w-full max-w-6xl px-4 py-16">
        <div className="text-center mb-10">
          <span className="text-xs tracking-widest text-[#f59e3a] uppercase font-semibold">सप्तकाण्डानि · The Epic Arc</span>
          <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-[#f3f0e6] mt-1">Seven Kandas of the Ramayana</h2>
          <p className="text-sm text-[#a39eb5] max-w-xl mx-auto mt-2">
            Follow the chronological path from the divine appearance of Lord Rama to his eternal return.
          </p>
        </div>

        <div className="space-y-4">
          {kandasData.map(k => (
            <Link
              key={k.id}
              href={`/story/${k.id}`}
              className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/10 hover:border-amber-400/30 transition-all group"
            >
              <div className="flex items-start sm:items-center gap-4 sm:gap-6">
                <span className="font-cinzel text-xl sm:text-2xl font-bold text-amber-300/60 w-8">
                  {k.romanNumeral}
                </span>
                <div>
                  <div className="flex items-baseline gap-2">
                    <h3 className="font-cinzel text-base sm:text-xl font-bold text-[#f3f0e6] group-hover:text-[#f59e3a] transition-colors">
                      {k.name}
                    </h3>
                    <span className="font-sanskrit text-xs sm:text-sm text-[#f3d27a]/70">
                      {k.sanskrit}
                    </span>
                  </div>
                  <div className="text-xs text-[#f59e3a] font-medium mt-0.5">{k.subtitle}</div>
                  <p className="text-xs sm:text-sm text-[#a39eb5] mt-1 line-clamp-1 max-w-3xl">
                    {k.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="hidden sm:flex flex-col text-right text-xs text-[#a39eb5]">
                  <span className="font-semibold text-white/80">{k.sargasCount} Sargas</span>
                  <span>{k.shlokasCount.toLocaleString()} Verses</span>
                </div>
                <ArrowRight className="w-5 h-5 text-[#f59e3a] group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Phalasruti Invocation */}
      <section className="w-full py-20 px-4 text-center bg-gradient-to-t from-[#040207] to-[#07050d] border-t border-white/5">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="text-xs tracking-widest text-amber-400 uppercase font-semibold">फलश्रुतिः · The Divine Promise</span>
          <p className="font-sanskrit text-xl sm:text-2xl text-gold-gradient leading-relaxed font-medium">
            इदं पवित्रं पापघ्नं पुण्यं वेदैश्च सम्मितम् ।<br />
            य: पठेद्रामचरितं सर्वपापै: प्रमुच्यते ॥
          </p>
          <p className="text-xs sm:text-sm text-[#a39eb5] italic">
            idaṃ pavitraṃ pāpaghnaṃ puṇyaṃ vedaiśca sammitam · ya: paṭhedrāmacaritaṃ sarvapāpai: pramucyate
          </p>
          <p className="text-sm text-[#f3f0e6]/80 leading-relaxed max-w-xl mx-auto">
            "This story of Rama is sacred and holy. It dispels sins and stands equal to the Vedas. Whosoever reads it with a sincere heart is liberated from all distress."
          </p>
          <div className="pt-4">
            <Link
              href="/story/bala/1"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full saffron-gradient text-black font-semibold text-xs hover:opacity-90 transition-opacity"
            >
              🪔 Begin With Sarga 1
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
