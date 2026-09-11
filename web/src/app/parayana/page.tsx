'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, CheckCircle2, Circle, Flame, ArrowRight, Award } from 'lucide-react';

interface DaySchedule {
  day: number;
  title: string;
  sargas: number[];
  sargaRange: string;
  focus: string;
}

const SUNDARA_KANDA_7_DAYS: DaySchedule[] = [
  { day: 1, title: "The Ocean Leap", sargas: Array.from({ length: 15 }, (_, i) => i + 1), sargaRange: "Sargas 1 – 15", focus: "Hanuman's leap across the ocean, overcoming Surasa and Simhika, and entering Lanka by night." },
  { day: 2, title: "Searching the Palaces", sargas: Array.from({ length: 11 }, (_, i) => i + 16), sargaRange: "Sargas 16 – 26", focus: "Searching Ravana's palace and discovering Mother Sita grief-stricken under the Shimshapa tree." },
  { day: 3, title: "Consoling Sita", sargas: Array.from({ length: 12 }, (_, i) => i + 27), sargaRange: "Sargas 27 – 38", focus: "Trijata's auspicious dream, Hanuman singing Rama's glory, delivering the signet ring (Anguliyaka), and receiving the Chudamani." },
  { day: 4, title: "The Lion's Roar", sargas: Array.from({ length: 10 }, (_, i) => i + 39), sargaRange: "Sargas 39 – 48", focus: "Destruction of the Ashoka grove, battle with Kinkaras, slaying of Jambumali, and killing of Prince Aksha." },
  { day: 5, title: "In Ravana's Court", sargas: Array.from({ length: 7 }, (_, i) => i + 49), sargaRange: "Sargas 49 – 55", focus: "Bound by Brahmastra, confronting Ravana, burning of Lanka with his fiery tail, and comforting Sita." },
  { day: 6, title: "The Return Leap", sargas: Array.from({ length: 5 }, (_, i) => i + 56), sargaRange: "Sargas 56 – 60", focus: "Hanuman leaps back to Mahendra mountain, joyous reunion with Angada, Jambavan, and the Vanaras." },
  { day: 7, title: "Delivering the Good News", sargas: Array.from({ length: 8 }, (_, i) => i + 61), sargaRange: "Sargas 61 – 68", focus: "The celebration at Madhuvana, reporting 'दृष्टा सीता' (Sita has been seen!), and Rama embracing Hanuman." }
];

export default function ParayanaPage() {
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());

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

  const progress = Math.round((completedDays.size / 7) * 100);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs tracking-widest text-[#f59e3a] uppercase font-semibold">
          पारायणम् · Sacred Recitation Regimens
        </span>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-gold-gradient mt-2">
          Sundara Kanda Parayana
        </h1>
        <p className="text-sm text-[#a39eb5] mt-3 leading-relaxed">
          The 5th book of Valmiki Ramayana is traditionally chanted for protection, victory over adversity, and attaining peace of mind. Follow this sacred 7-day saptaha regimen.
        </p>
      </div>

      {/* Progress Bar & Sankalpa */}
      <div className="p-6 rounded-2xl bg-[#0f0c1c] border border-amber-400/20 mb-10 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Flame className="w-5 h-5 text-[#f59e3a]" />
            <h3 className="font-cinzel text-base font-bold text-[#f3f0e6]">7-Day Saptaha Sadhana</h3>
          </div>
          <p className="text-xs text-[#a39eb5]">
            {completedDays.size} of 7 Days Completed ({progress}%)
          </p>
        </div>

        <div className="w-full sm:w-64 h-2.5 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full saffron-gradient transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        {completedDays.size === 7 ? (
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
            <Award className="w-4 h-4" /> Parayana Complete!
          </div>
        ) : (
          <div className="text-xs font-mono text-amber-200">
            Day {completedDays.size + 1} Pending
          </div>
        )}
      </div>

      {/* Schedule Days */}
      <div className="space-y-4">
        {SUNDARA_KANDA_7_DAYS.map(d => {
          const isCompleted = completedDays.has(d.day);

          return (
            <div
              key={d.day}
              className={`p-6 rounded-2xl border transition-all ${
                isCompleted
                  ? 'bg-emerald-950/15 border-emerald-500/40'
                  : 'bg-[#0e0a1b]/70 border-white/5 hover:border-amber-400/30'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleDay(d.day)}
                    className="mt-0.5 text-xs transition-colors cursor-pointer"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400 fill-emerald-950/50" />
                    ) : (
                      <Circle className="w-6 h-6 text-[#a39eb5] hover:text-amber-300" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-cinzel text-sm font-bold text-[#f59e3a]">
                        Day {d.day}
                      </span>
                      <span>·</span>
                      <span className="font-mono text-xs text-amber-200">
                        {d.sargaRange}
                      </span>
                    </div>

                    <h3 className="font-cinzel text-lg font-bold text-[#f3f0e6] mt-0.5">
                      {d.title}
                    </h3>

                    <p className="text-xs text-[#a39eb5] mt-1 max-w-2xl leading-relaxed">
                      {d.focus}
                    </p>
                  </div>
                </div>

                {/* Sarga Jump Pills */}
                <div className="flex flex-wrap gap-1.5 sm:justify-end">
                  {d.sargas.map(s => (
                    <Link
                      key={s}
                      href={`/story/sundara/${s}`}
                      className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-white/5 hover:bg-amber-500/20 text-[#f3d27a] border border-white/5 hover:border-amber-400/40 transition-colors"
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
