import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Layers, Sparkles } from 'lucide-react';
import kandasData from '@/data/kandas.json';

const formatCount = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export default function StoryIndexPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Breadcrumb & Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/25 text-xs text-[#f3d27a] mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-sanskrit tracking-wider text-[11px] sm:text-xs">॥ श्रीमद्वाल्मीकीयरामायणम् ॥ सप्तकाण्डानि</span>
        </div>
        <h1 className="font-cinzel text-2xl sm:text-5xl md:text-6xl font-bold text-gold-gradient">
          The Living Scripture Codex
        </h1>
        <p className="text-xs sm:text-base text-[#a39eb5] mt-3 leading-relaxed font-light">
          The complete canonical Valmiki Ramayana structured across seven sacred cantos and 648 sargas. 
          Choose a canto to enter its illuminated verses, or open the distraction-free book reader.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link
            href="/story/bala/1/?mode=book"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full saffron-gradient text-black font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Read as Book (Book UI)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Kandas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {kandasData.map(k => (
          <Link
            key={k.id}
            href={`/story/${k.id}/`}
            className="manuscript-pothi flex flex-col justify-between p-5 sm:p-8 rounded-2xl sm:rounded-3xl hover:border-amber-400/50 transition-all duration-300 group shadow-xl hover:-translate-y-1"
          >
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3 sm:mb-4">
                <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-amber-500/15 border border-amber-400/30 flex items-center justify-center font-cinzel text-sm sm:text-base font-bold text-amber-300">
                  {k.romanNumeral}
                </span>
                <span className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-mono bg-white/5 border border-white/10 text-amber-200/80">
                  {k.sargasCount} Sargas · {formatCount(k.shlokasCount)} Verses
                </span>
              </div>

              <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 mb-1">
                <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#f5efe6] group-hover:text-amber-300 transition-colors">
                  {k.name}
                </h2>
                <span className="font-sanskrit text-sm sm:text-base text-[#f3d27a]/80">
                  {k.sanskrit}
                </span>
              </div>

              <div className="text-xs text-[#f59e3a] font-semibold mb-2 sm:mb-3 font-cinzel">
                {k.subtitle}
              </div>

              <p className="text-xs sm:text-sm text-[#a39eb5] leading-relaxed font-light">
                {k.description}
              </p>
            </div>

            <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-amber-400 group-hover:text-amber-300">
              <span>Open Canto Chapters</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
