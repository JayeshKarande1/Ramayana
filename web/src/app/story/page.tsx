import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Layers, Sparkles } from 'lucide-react';
import kandasData from '@/data/kandas.json';

export default function StoryIndexPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb & Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/25 text-xs text-[#f3d27a] mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-sanskrit tracking-wider">॥ श्रीमद्वाल्मीकीयरामायणम् ॥ सप्तकाण्डानि</span>
        </div>
        <h1 className="font-cinzel text-3xl sm:text-5xl md:text-6xl font-bold text-gold-gradient">
          The Living Scripture Codex
        </h1>
        <p className="text-sm sm:text-base text-[#a39eb5] mt-3 leading-relaxed font-light">
          The complete canonical Valmiki Ramayana structured across seven sacred cantos and 648 sargas. 
          Choose a canto to enter its illuminated verses and word-by-word Sanskrit padaccheda.
        </p>
      </div>

      {/* Kandas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {kandasData.map(k => (
          <Link
            key={k.id}
            href={`/story/${k.id}`}
            className="manuscript-pothi flex flex-col justify-between p-6 sm:p-8 rounded-3xl hover:border-amber-400/50 transition-all duration-300 group shadow-xl hover:-translate-y-1"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-400/30 flex items-center justify-center font-cinzel text-base font-bold text-amber-300">
                  {k.romanNumeral}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-amber-200/80">
                  {k.sargasCount} Sargas · {k.shlokasCount.toLocaleString()} Verses
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-1">
                <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#f5efe6] group-hover:text-amber-300 transition-colors">
                  {k.name}
                </h2>
                <span className="font-sanskrit text-sm sm:text-base text-[#f3d27a]/80">
                  {k.sanskrit}
                </span>
              </div>

              <div className="text-xs text-[#f59e3a] font-semibold mb-3 font-cinzel">
                {k.subtitle}
              </div>

              <p className="text-xs sm:text-sm text-[#a39eb5] leading-relaxed font-light">
                {k.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-amber-400 group-hover:text-amber-300">
              <span>Open Canto Chapters</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
