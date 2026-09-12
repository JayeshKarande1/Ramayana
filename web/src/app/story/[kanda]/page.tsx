import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import kandasData from '@/data/kandas.json';
import path from 'path';
import { getSargasDirectory, getSargaShlokaCount } from '@/lib/sargas';

const formatCount = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

interface Props {
  params: Promise<{ kanda: string }>;
}

export async function generateStaticParams() {
  return kandasData.map(k => ({ kanda: k.id }));
}

export default async function KandaPage({ params }: Props) {
  const { kanda: kandaId } = await params;
  const kanda = kandasData.find(k => k.id.toLowerCase() === kandaId.toLowerCase());

  if (!kanda) {
    notFound();
  }

  // Load shloka counts for sargas from files robustly
  const sargasDir = getSargasDirectory();
  const sargasList: { sarga: number; shlokas: number; title: string }[] = [];

  for (let i = 1; i <= kanda.sargasCount; i++) {
    const sargaFile = path.join(sargasDir, `${kanda.id}_${i}.json`);
    const shlokaCount = getSargaShlokaCount(sargaFile);

    sargasList.push({
      sarga: i,
      shlokas: shlokaCount,
      title: `Sarga ${i}`
    });
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Navigation Back */}
      <div className="mb-6">
        <Link
          href="/story/"
          className="inline-flex items-center gap-1.5 text-xs text-[#a39eb5] hover:text-[#f59e3a] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to All Kandas
        </Link>
      </div>

      {/* Kanda Hero Banner */}
      <div className="p-5 sm:p-10 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#130e24] via-[#0d0a18] to-[#07050d] border border-amber-400/20 shadow-2xl mb-8 sm:mb-12">
        <div className="flex items-center gap-2 sm:gap-3 text-xs font-semibold text-[#f59e3a] uppercase tracking-wider mb-2">
          <span>Book {kanda.romanNumeral}</span>
          <span>·</span>
          <span>{kanda.subtitle}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-3 mb-4">
          <h1 className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-bold text-gold-gradient">
            {kanda.name}
          </h1>
          <span className="font-sanskrit text-xl sm:text-3xl text-amber-300/80">
            {kanda.sanskrit}
          </span>
        </div>

        <p className="text-xs sm:text-base text-[#a39eb5] leading-relaxed max-w-3xl">
          {kanda.description}
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 pt-6 border-t border-white/10 text-xs text-[#a39eb5]">
          <div className="flex items-center gap-4 sm:gap-6">
            <div>
              <span className="font-semibold text-white">{kanda.sargasCount}</span> Sargas
            </div>
            <div>
              <span className="font-semibold text-white">{formatCount(kanda.shlokasCount)}</span> Verses
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <Link
              href={`/story/${kanda.id}/1/?mode=book`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full saffron-gradient text-black font-bold text-xs shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Read Canto as Book</span>
            </Link>
            <Link
              href={`/story/${kanda.id}/1/`}
              className="text-[#f59e3a] font-semibold hover:underline flex items-center gap-1 text-xs"
            >
              Start Sarga 1 →
            </Link>
          </div>
        </div>
      </div>

      {/* Sargas Grid */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-cinzel text-lg sm:text-xl font-bold text-[#f3f0e6]">
          All {kanda.sargasCount} Chapters
        </h2>
        <span className="text-xs text-[#a39eb5]">Select a sarga to read verses</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-4">
        {sargasList.map(s => (
          <Link
            key={s.sarga}
            href={`/story/${kanda.id}/${s.sarga}/`}
            className="p-3 sm:p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.08] border border-white/5 hover:border-amber-400/40 transition-all text-center group flex flex-col justify-between"
          >
            <div className="font-cinzel text-sm sm:text-base font-bold text-[#f3f0e6] group-hover:text-[#f59e3a] transition-colors">
              Sarga {s.sarga}
            </div>
            <div className="text-[10px] sm:text-[11px] text-[#a39eb5] mt-1 font-mono">
              {s.shlokas > 0 ? `${s.shlokas} shlokas` : 'Read chapter'}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
