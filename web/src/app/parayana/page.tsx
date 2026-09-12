'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Calendar, CheckCircle2, Circle, Flame, ArrowRight, Award, 
  Sparkles, Volume2, ShieldCheck, HeartHandshake, Compass
} from 'lucide-react';
import { chantVerse } from '@/lib/audio';

interface DaySchedule {
  day: number;
  title: string;
  sargas: number[];
  sargaRange: string;
  focus: string;
  kavacha: string;
}

const SUNDARA_KANDA_7_DAYS: DaySchedule[] = [
  { 
    day: 1, 
    title: "The Ocean Leap & Infiltration", 
    sargas: Array.from({ length: 15 }, (_, i) => i + 1), 
    sargaRange: "Sargas 1 – 15", 
    focus: "Hanuman's oceanic flight across 100 yojanas, overcoming obstacles Surasa, Mainaka, and Simhika, and entering the golden fortress of Lanka by night.",
    kavacha: "Sankalpa of Courage & Purpose"
  },
  { 
    day: 2, 
    title: "The Solitary Search in Lanka", 
    sargas: Array.from({ length: 11 }, (_, i) => i + 16), 
    sargaRange: "Sargas 16 – 26", 
    focus: "Searching Ravana's inner palaces, the Pushpaka Vimana, and finally locating Mother Sita grief-stricken under the sacred Shimshapa tree in Ashoka Vatika.",
    kavacha: "Sankalpa of Relentless Patience"
  },
  { 
    day: 3, 
    title: "Consoling Sita & The Signet Ring", 
    sargas: Array.from({ length: 12 }, (_, i) => i + 27), 
    sargaRange: "Sargas 27 – 38", 
    focus: "Trijata's prophetic dream, Hanuman singing the divine lineage of Rama, presenting Sri Rama's celestial signet ring (Anguliyaka), and receiving Sita's Chudamani jewel.",
    kavacha: "Sankalpa of Pure Devotion"
  },
  { 
    day: 4, 
    title: "The Lion's Roar in the Grove", 
    sargas: Array.from({ length: 10 }, (_, i) => i + 39), 
    sargaRange: "Sargas 39 – 48", 
    focus: "Hanuman systematically dismantling Ravana's proud pleasure grove, obliterating the Kinkara warriors, Jambumali, and Prince Aksha in single combat.",
    kavacha: "Sankalpa of Righteous Valor"
  },
  { 
    day: 5, 
    title: "Confronting Ravana & The Burning of Lanka", 
    sargas: Array.from({ length: 7 }, (_, i) => i + 49), 
    sargaRange: "Sargas 49 – 55", 
    focus: "Submitting to the Brahmastra out of respect, warning Ravana in open assembly, the lighting of his fiery tail, incinerating the golden city of Lanka, and dousing in the ocean.",
    kavacha: "Sankalpa of Fearless Truth"
  },
  { 
    day: 6, 
    title: "The Joyous Leap of Return", 
    sargas: Array.from({ length: 5 }, (_, i) => i + 56), 
    sargaRange: "Sargas 56 – 60", 
    focus: "Hanuman leaping back from Arishta mountain across the roaring waves, triumphantly greeting Angada, Jambavan, and the ecstatic southern search party.",
    kavacha: "Sankalpa of Shared Joy & Teamwork"
  },
  { 
    day: 7, 
    title: "Drishta Sita: The Corroboration of Faith", 
    sargas: Array.from({ length: 8 }, (_, i) => i + 61), 
    sargaRange: "Sargas 61 – 68", 
    focus: "The celebrated feast at Madhuvana, reporting 'दृष्टा सीता' (Mother Sita is found!) to Lord Rama, delivering the Chudamani, and Rama holding Hanuman in divine embrace.",
    kavacha: "Sankalpa of Supreme Fulfillment"
  }
];

export default function ParayanaPage() {
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());
  const [isPlayingDhyana, setIsPlayingDhyana] = useState(false);

  const dhyanaShloka = {
    sanskrit: "मनोजवं मारुततुल्यवेगं जितेन्द्रियं बुद्धिमतां वरिष्ठम् । वातात्मजं वानरयूथमुख्यं श्रीरामदूतं शरणं प्रपद्ये ॥",
    transliteration: "manojavam mārutatulyavegam jitendriyam buddhimatām variṣṭham · vātātmajam vānarayūthamukhyam śrīrāmadūtam śaraṇam prapadye",
    meaning: "\"I surrender unto Sri Rama's supreme messenger — who is swift as thought, peer to the wind in speed, master of the senses, foremost among the wise, son of Vayu, and chief among the Vanaras.\""
  };

  const toggleDay = (day: number) => {
    setCompletedDays(prev => {
      const next = new Set(prev);
      if (next.has(day)) {
        next.delete(day);
      } else {
        next.add(day);
      }
      return next;
    });
  };

  const handlePlayDhyana = () => {
    setIsPlayingDhyana(true);
    chantVerse(dhyanaShloka.sanskrit, () => setIsPlayingDhyana(false));
  };

  const progress = Math.round((completedDays.size / 7) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/25 text-xs text-[#f3d27a] mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-sanskrit tracking-wider">॥ सुन्दरकाण्ड पारायणम् ॥ सप्ताहमङ्गलम्</span>
        </div>
        <h1 className="font-cinzel text-3xl sm:text-5xl md:text-6xl font-bold text-gold-gradient">
          Sadhana Altar
        </h1>
        <p className="text-sm sm:text-base text-[#a39eb5] mt-3 leading-relaxed font-light">
          The traditional 7-Day Saptaha Parayana of the 68 Sargas of Sundara Kanda. 
          Chanted for victory over obstacles, courage in adversity, and enduring peace.
        </p>
      </div>

      {/* Hanuman Dhyana Shloka Invocation Box */}
      <div className="manuscript-pothi rounded-3xl p-6 sm:p-8 mb-10 shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-300 font-cinzel">
            ॥ ध्यानश्लोकः · Invocatory Prayer to Sri Hanuman ॥
          </span>
          <button
            onClick={handlePlayDhyana}
            className={`px-3 py-1 rounded-full border text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
              isPlayingDhyana
                ? 'bg-amber-500 text-black border-amber-400 font-semibold animate-pulse'
                : 'bg-white/5 border-white/10 text-amber-300 hover:text-white'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-400" />
            <span>{isPlayingDhyana ? 'Chanting...' : 'Chant Invocation'}</span>
          </button>
        </div>

        <p className="font-sanskrit text-xl sm:text-2xl text-center text-gold-gradient leading-relaxed my-3 font-medium">
          {dhyanaShloka.sanskrit}
        </p>

        <p className="text-center text-xs text-[#a39eb5] italic max-w-xl mx-auto mb-2">
          {dhyanaShloka.transliteration}
        </p>

        <p className="text-center text-xs sm:text-sm text-[#f5efe6]/90 max-w-2xl mx-auto leading-relaxed font-light">
          {dhyanaShloka.meaning}
        </p>
      </div>

      {/* Sadhana Progress Altar Ribbon */}
      <div className="p-6 rounded-3xl bg-[#0e0a1b] border border-amber-400/20 mb-10 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-5 h-5 text-amber-400 animate-flame" />
            <h3 className="font-cinzel text-base font-bold text-[#f5efe6]">
              7-Day Saptaha Progress
            </h3>
          </div>
          <p className="text-xs text-[#a39eb5]">
            {completedDays.size} of 7 Days Sanctified ({progress}%)
          </p>
        </div>

        <div className="w-full sm:w-64 h-2.5 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full saffron-gradient transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        {completedDays.size === 7 ? (
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 font-cinzel">
            <Award className="w-5 h-5" />
            <span>॥ पारायणं संपूर्णम् ॥</span>
          </div>
        ) : (
          <div className="text-xs font-mono text-amber-300">
            Day {completedDays.size + 1} Pending
          </div>
        )}
      </div>

      {/* 7-Day Recital Schedule Days */}
      <div className="space-y-4">
        {SUNDARA_KANDA_7_DAYS.map(d => {
          const isCompleted = completedDays.has(d.day);

          return (
            <div
              key={d.day}
              className={`p-6 rounded-3xl border transition-all duration-300 ${
                isCompleted
                  ? 'bg-emerald-950/20 border-emerald-500/40 shadow-md'
                  : 'manuscript-pothi hover:border-amber-400/40'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleDay(d.day)}
                    className="mt-1 text-xs transition-transform hover:scale-110 cursor-pointer"
                    title={isCompleted ? "Mark Incomplete" : "Mark Completed"}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-950/60" />
                    ) : (
                      <Circle className="w-6 h-6 text-[#a39eb5] hover:text-amber-300" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-cinzel text-xs sm:text-sm font-bold text-amber-400">
                        Day {d.day}
                      </span>
                      <span>•</span>
                      <span className="font-mono text-xs text-amber-200">
                        {d.sargaRange}
                      </span>
                      <span>•</span>
                      <span className="text-[11px] text-[#a39eb5] hidden sm:inline">
                        {d.kavacha}
                      </span>
                    </div>

                    <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#f5efe6] mt-0.5">
                      {d.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#a39eb5] mt-1.5 max-w-2xl leading-relaxed font-light">
                      {d.focus}
                    </p>
                  </div>
                </div>

                {/* Sarga Jump Pills */}
                <div className="flex flex-wrap gap-1.5 sm:justify-end shrink-0 max-w-xs">
                  {d.sargas.map(s => (
                    <Link
                      key={s}
                      href={`/story/sundara/${s}`}
                      className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white/5 hover:bg-amber-500/20 text-amber-300 border border-white/5 hover:border-amber-400/40 transition-colors"
                      title={`Read Sundara Kanda Sarga ${s}`}
                    >
                      {s}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
