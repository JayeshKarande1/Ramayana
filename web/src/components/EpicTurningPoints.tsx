'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, ArrowRight, ArrowLeft, Volume2, Play, Pause, 
  Compass, Shield, Heart, Feather, Crown, Flame, Waves 
} from 'lucide-react';
import { playDiyaSpark, chantVerse } from '@/lib/audio';

interface TurningPoint {
  id: number;
  chapter: string;
  sanskritTitle: string;
  englishTitle: string;
  kanda: string;
  sargaRef: string;
  sargaLink: string;
  virtue: string;
  sanskritShloka: string;
  shlokaMeaning: string;
  narrative: string;
  dharmaPivot: string;
  accentColor: string;
  glowColor: string;
  icon: string;
}

const turningPoints: TurningPoint[] = [
  {
    id: 1,
    chapter: "I",
    sanskritTitle: "शोकः श्लोकत्वमागतः",
    englishTitle: "The Birth of the First Shloka",
    kanda: "Bala Kanda",
    sargaRef: "Bala Kanda · Sarga 2",
    sargaLink: "/story/bala/2",
    virtue: "Karuna · Supreme Compassion",
    sanskritShloka: "मा निषाद प्रतिष्ठां त्वमगमः शाश्वतीः समाः । यत्क्रौञ्चमिथुनादेकमवधीः काममोहितम् ॥",
    shlokaMeaning: "O hunter, you shall find no rest for endless ages, having slain one of the krauncha bird pair while deep in love.",
    narrative: "On the banks of the Tamasa river, Sage Valmiki witnesses a hunter slay a mating krauncha bird. In that moment of intense grief (Shoka), the sage's boundless compassion spontaneously crystallizes into metric rhythm (Shloka) — marking the birth of human poetry.",
    dharmaPivot: "Dharma begins with universal empathy for the suffering of any living being, transforming grief into sublime art.",
    accentColor: "from-amber-500/20 to-yellow-950/30",
    glowColor: "rgba(245, 158, 11, 0.25)",
    icon: "🪶"
  },
  {
    id: 2,
    chapter: "II",
    sanskritTitle: "धर्म्योऽयं पितृनिर्देशः",
    englishTitle: "The Great Renunciation",
    kanda: "Ayodhya Kanda",
    sargaRef: "Ayodhya Kanda · Sarga 19",
    sargaLink: "/story/ayodhya/19",
    virtue: "Satya · Fidelity to Truth & Duty",
    sanskritShloka: "न ह्यतो धर्मचरणं किञ्चिदस्ति महत्तरम् । यथा पितरि शुश्रूषा तस्य वा वचनक्रिया ॥",
    shlokaMeaning: "There is no higher righteous practice than serving one's father and steadfastly honoring his word.",
    narrative: "On the very morning he was to be crowned Emperor of Ayodhya, Rama receives the news of Queen Kaikeyi's boons: fourteen years of exile in bark garments, while Bharata receives the throne. Rama accepts with a smiling, tranquil countenance, consoling his weeping parents.",
    dharmaPivot: "True power is the effortless ability to lay down power when truth and filial honour demand it.",
    accentColor: "from-orange-600/20 to-amber-950/30",
    glowColor: "rgba(234, 88, 12, 0.25)",
    icon: "👑"
  },
  {
    id: 3,
    chapter: "III",
    sanskritTitle: "मायामृगः पञ्चवट्याम्",
    englishTitle: "The Golden Illusion of Panchavati",
    kanda: "Aranya Kanda",
    sargaRef: "Aranya Kanda · Sarga 43",
    sargaLink: "/story/aranya/43",
    virtue: "Viveka · Spiritual Discernment",
    sanskritShloka: "आश्चर्यभूतं सौमित्रे मृगं पश्य मनोहरम् । मणिप्रवरचित्राङ्गं पद्मकिञ्जल्कसन्निभम् ॥",
    shlokaMeaning: "Behold, Lakshmana, this wondrous deer of mesmerizing beauty, glistening with gems and bright as lotus stamens.",
    narrative: "In the serene forests of Panchavati on the Godavari banks, the demon Maricha assumes the form of an irresistible jeweled golden deer to lure Rama and Lakshmana away, allowing Ravana to breach the hermitage and abduct Sita.",
    dharmaPivot: "Even divine souls are tested by illusion (Maya); suffering is not punishment, but the catalyst for cosmic cleansing.",
    accentColor: "from-yellow-600/20 to-emerald-950/30",
    glowColor: "rgba(202, 138, 4, 0.25)",
    icon: "🦌"
  },
  {
    id: 4,
    chapter: "IV",
    sanskritTitle: "महासागरे मारुतेर्लङ्घनम्",
    englishTitle: "Hanuman's Leap of Infinite Devotion",
    kanda: "Sundara Kanda",
    sargaRef: "Sundara Kanda · Sarga 1",
    sargaLink: "/story/sundara/1",
    virtue: "Shraddha · Unflinching Surrender",
    sanskritShloka: "यथा राघोः प्रयुक्तः शरः श्वसनविक्रमः । गच्छेत्तद्वद्गमिष्यामि लङ्कां रावणपालिताम् ॥",
    shlokaMeaning: "As an arrow shot by Rama flies with the fury of wind, so will I speed towards Lanka ruled by Ravana.",
    narrative: "Standing on Mount Mahendra with the impassable ocean stretching 100 yojanas before him, Hanuman awakens to his forgotten divine strength. Chanting Rama's sacred name, he presses his feet into the granite and vaults into the sky like a comet of light.",
    dharmaPivot: "When personal ego dissolves into pure devotion to a righteous purpose, the impossible dissolves into effortless flight.",
    accentColor: "from-sky-600/20 to-blue-950/30",
    glowColor: "rgba(56, 189, 248, 0.25)",
    icon: "🌊"
  },
  {
    id: 5,
    chapter: "V",
    sanskritTitle: "रामसेतुनिर्माणम्",
    englishTitle: "The Bridge of Floating Stones",
    kanda: "Yuddha Kanda",
    sargaRef: "Yuddha Kanda · Sarga 22",
    sargaLink: "/story/yuddha/22",
    virtue: "Sangha · Sacred Collective Unity",
    sanskritShloka: "बबन्धुः सेतुं वानराः सागराम्भसि । नलस्य सेतुरुदधौ सुभगः साम्प्रतं बभौ ॥",
    shlokaMeaning: "The Vanaras raised the miraculous bridge across the ocean's depths; Nala's bridge shone resplendent upon the waters.",
    narrative: "Under the architectural vision of Nala, the Vanaras and bears roll giant mountain boulders and trees into the ocean. By inscribing the holy name of Rama upon the rocks, the waters of the ocean god Varuna bear them effortlessly, uniting two worlds.",
    dharmaPivot: "No individual alone defeats tyranny; the sacred community, where every creature from mighty hero to humble squirrel contributes, bridges the abyss.",
    accentColor: "from-teal-600/20 to-slate-950/30",
    glowColor: "rgba(20, 184, 166, 0.25)",
    icon: "🪨"
  },
  {
    id: 6,
    chapter: "VI",
    sanskritTitle: "ब्रह्मास्त्रेण रावणवधः",
    englishTitle: "The Fall of Ravana & Release of Brahmastra",
    kanda: "Yuddha Kanda",
    sargaRef: "Yuddha Kanda · Sarga 108",
    sargaLink: "/story/yuddha/108",
    virtue: "Vijaya · The Inevitable Triumph of Light",
    sanskritShloka: "स बाणो रावणं हत्वा रुधिराद्रः शरस्तथा । पृथिव्यां विविधे वेगाद् गगने चापि दृश्यते ॥",
    shlokaMeaning: "That piercing arrow, having felled Ravana and bathed in righteousness, returned gently to Rama's quiver.",
    narrative: "After an apocalyptic duel shaking the heavens, Sage Agastya imparts the Aditya Hridaya prayer to Rama. Rama then notches the celestial Brahmastra forged by Brahma himself, releasing the incandescent arrow straight into Ravana's navel.",
    dharmaPivot: "Even immense erudition and cosmic power crumble to ash when divorced from moral restraint and humility.",
    accentColor: "from-rose-600/20 to-amber-950/30",
    glowColor: "rgba(225, 29, 72, 0.25)",
    icon: "🏹"
  },
  {
    id: 7,
    chapter: "VII",
    sanskritTitle: "श्रीरामपट्टाभिषेकः",
    englishTitle: "The Coronation & The Era of Ramarajya",
    kanda: "Yuddha Kanda",
    sargaRef: "Yuddha Kanda · Sarga 128",
    sargaLink: "/story/yuddha/128",
    virtue: "Kalyana · Universal Well-Being & Harmony",
    sanskritShloka: "रामो रामो राम इति प्रजानामभवन् कथाः । रामभूतं जगदभूद् रामे राज्यं प्रशासति ॥",
    shlokaMeaning: "All discourse of the citizens centered on Rama; the entire universe reflected Rama while he ruled in justice.",
    narrative: "Returning triumphantly to Ayodhya in the celestial Pushpaka Vimana, Rama is crowned king by Sage Vasishtha. His reign establishes Ramarajya — an archetypal golden age without premature bereavement, famine, crime, or injustice.",
    dharmaPivot: "When the ruler's sole desire is the upliftment of the lowest subject, governance becomes an altar of sacred devotion.",
    accentColor: "from-amber-400/25 to-orange-950/40",
    glowColor: "rgba(251, 191, 36, 0.3)",
    icon: "🪷"
  }
];

export default function EpicTurningPoints() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isChanting, setIsChanting] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);

  const current = turningPoints[activeIdx];

  const handleSelect = (idx: number) => {
    setActiveIdx(idx);
    playDiyaSpark();
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev >= turningPoints.length - 1 ? 0 : prev + 1));
    playDiyaSpark();
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev <= 0 ? turningPoints.length - 1 : prev - 1));
    playDiyaSpark();
  };

  const handleChant = () => {
    setIsChanting(true);
    chantVerse(current.sanskritShloka, () => setIsChanting(false));
  };

  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => {
        const next = prev >= turningPoints.length - 1 ? 0 : prev + 1;
        playDiyaSpark();
        return next;
      });
    }, 8000);
    return () => clearInterval(interval);
  }, [autoPlay]);

  return (
    <section className="w-full max-w-6xl px-4 py-16">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-400/25 text-xs text-[#f3d27a] mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-sanskrit tracking-wider">॥ सप्तमहाधर्मावर्तनानि ॥ The 7 Pivotal Arcs</span>
        </div>
        <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold text-gold-gradient">
          The Seven Turning Points of Dharma
        </h2>
        <p className="text-sm sm:text-base text-[#a39eb5] max-w-2xl mx-auto mt-2 font-light">
          Journey through the seven transformative crises where righteousness hung in the balance, 
          shaping the destiny of gods and mortals alike.
        </p>
      </div>

      {/* Chapter Stepper Ribbon */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 pt-2 no-scrollbar">
        {turningPoints.map((tp, idx) => {
          const isSelected = idx === activeIdx;
          return (
            <button
              key={tp.id}
              onClick={() => handleSelect(idx)}
              className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                isSelected
                  ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 text-black font-bold shadow-lg shadow-amber-500/30 scale-105'
                  : 'bg-white/5 border border-white/10 text-[#a39eb5] hover:text-white hover:border-amber-400/30'
              }`}
            >
              <span>{tp.icon}</span>
              <span>Act {tp.chapter}</span>
              <span className="font-sanskrit text-[11px] opacity-75 hidden sm:inline">({tp.sanskritTitle.split(' ')[0]})</span>
            </button>
          );
        })}
      </div>

      {/* Main Scrollytelling Stage Card */}
      <div
        className={`mt-6 rounded-3xl bg-gradient-to-br ${current.accentColor} via-[#0c0817] to-[#06040e] border border-amber-400/25 p-6 sm:p-10 shadow-2xl relative overflow-hidden transition-all duration-700`}
        style={{ boxShadow: `0 0 50px ${current.glowColor}` }}
      >
        {/* Ambient Top Glow */}
        <div
          className="absolute -top-28 -right-28 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-colors duration-700"
          style={{ background: current.glowColor }}
        />

        {/* Top Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 font-cinzel">
              Act {current.chapter} of VII
            </span>
            <span className="text-xs text-[#a39eb5] font-mono">
              {current.kanda}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoPlay(!autoPlay)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all ${
                autoPlay
                  ? 'bg-amber-500 text-black font-semibold shadow-md shadow-amber-500/30'
                  : 'bg-white/5 border border-white/10 text-[#a39eb5] hover:text-white'
              }`}
            >
              {autoPlay ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{autoPlay ? 'Auto Playing' : 'Auto Play'}</span>
            </button>

            <button
              onClick={handlePrev}
              className="p-1.5 rounded-full bg-white/5 border border-white/10 text-[#a39eb5] hover:text-white cursor-pointer"
              title="Previous Act"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 rounded-full bg-white/5 border border-white/10 text-[#a39eb5] hover:text-white cursor-pointer"
              title="Next Act"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Turning Point Hero Content */}
        <div className="relative z-10 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (7 cols): Narrative & Shloka */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 font-cinzel tracking-wider uppercase">
                <span>Dharmic Archetype:</span>
                <span className="text-[#fef08a]">{current.virtue}</span>
              </div>
              <h3 className="font-cinzel text-2xl sm:text-4xl font-bold text-[#f5efe6] mt-1.5 leading-tight">
                {current.englishTitle}
              </h3>
              <p className="font-sanskrit text-lg sm:text-xl text-amber-300/90 mt-1">
                {current.sanskritTitle}
              </p>
            </div>

            {/* Sacred Shloka Card */}
            <div className="p-5 rounded-2xl bg-black/40 border border-amber-400/20 relative overflow-hidden">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
                <span className="text-[11px] font-mono text-amber-400/80">
                  {current.sargaRef}
                </span>
                <button
                  onClick={handleChant}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all ${
                    isChanting
                      ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50 animate-pulse'
                      : 'bg-white/5 border border-white/10 text-[#a39eb5] hover:text-white'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isChanting ? 'Chanting...' : 'Listen Shloka'}</span>
                </button>
              </div>

              <p className="font-sanskrit text-lg sm:text-2xl text-gold-gradient font-medium leading-relaxed mb-3">
                {current.sanskritShloka}
              </p>
              <p className="text-xs sm:text-sm text-[#a39eb5] italic font-serif leading-relaxed">
                &ldquo;{current.shlokaMeaning}&rdquo;
              </p>
            </div>

            {/* Narrative Prose */}
            <p className="text-sm sm:text-base text-[#f5efe6]/90 leading-relaxed font-light">
              {current.narrative}
            </p>
          </div>

          {/* Right Column (5 cols): Dharmic Insight & Scripture Gateway */}
          <div className="lg:col-span-5 flex flex-col gap-4 bg-[#0a0715]/80 p-6 rounded-2xl border border-white/10">
            {/* The Pivot Card */}
            <div className="p-4 rounded-xl bg-amber-500/10 border-l-2 border-amber-400">
              <span className="text-xs font-semibold text-amber-300 block mb-1 uppercase font-cinzel">
                The Philosophical Pivot
              </span>
              <p className="text-xs sm:text-sm text-[#e0dad0] leading-relaxed font-serif italic">
                {current.dharmaPivot}
              </p>
            </div>

            {/* Visual Iconography Motif */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-amber-500/10 border border-amber-400/20 flex items-center justify-center text-3xl shrink-0">
                {current.icon}
              </div>
              <div>
                <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider block">
                  Sacred Emblem
                </span>
                <span className="text-xs font-bold text-white">
                  {current.virtue.split('·')[0].trim()}
                </span>
                <p className="text-[11px] text-[#a39eb5] mt-0.5">
                  Symbol of virtue manifested in {current.kanda}
                </p>
              </div>
            </div>

            {/* Direct Scripture Action Button */}
            <div className="pt-2">
              <Link
                href={current.sargaLink}
                className="w-full py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold text-xs tracking-wider uppercase text-center transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 group"
              >
                <span>Read Full Sarga in Codex</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Pagination Dots */}
        <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-center gap-2">
          {turningPoints.map((tp, idx) => (
            <button
              key={tp.id}
              onClick={() => handleSelect(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                activeIdx === idx
                  ? 'w-8 bg-amber-400'
                  : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Go to Turning Point ${tp.chapter}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
