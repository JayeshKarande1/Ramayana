import React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Layers } from 'lucide-react';
import kandasData from '@/data/kandas.json';

export default function StoryIndexPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb & Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs tracking-widest text-[#f59e3a] uppercase font-semibold">
          श्रीमद्वाल्मीकीयरामायणम् · The Epic
        </span>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-gold-gradient mt-2">
          The Seven Kandas
        </h1>
        <p className="text-sm text-[#a39eb5] mt-3 leading-relaxed">
          The complete Valmiki Ramayana organized into 7 Kandas and 648 Sargas. Choose a book below to begin your reading.
        </p>
      </div>

      {/* Kandas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {kandasData.map(k => (
          <Link
            key={k.id}
            href={`/story/${k.id}`}
            className="flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-[#0f0c1c] border border-[rgba(243,210,122,0.15)] hover:border-amber-400/40 hover:bg-[#151026] transition-all group shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-cinzel text-2xl font-bold text-[#f59e3a]">
                  {k.romanNumeral}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-amber-200/80">
                  {k.sargasCount} Sargas · {k.shlokasCount.toLocaleString()} Verses
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-1">
                <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#f3f0e6] group-hover:text-[#f59e3a] transition-colors">
                  {k.name}
                </h2>
                <span className="font-sanskrit text-sm text-[#f3d27a]/70">
                  {k.sanskrit}
                </span>
              </div>

              <div className="text-xs text-[#f59e3a] font-semibold mb-3">
                {k.subtitle}
              </div>

              <p className="text-xs sm:text-sm text-[#a39eb5] leading-relaxed">
                {k.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-medium text-[#f59e3a] group-hover:text-amber-300">
              <span>Explore Chapters</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
