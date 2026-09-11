'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, Navigation, Compass, ExternalLink, ArrowRight } from 'lucide-react';
import journeyData from '@/data/journey.json';

export default function JourneyPage() {
  const [selectedStop, setSelectedStop] = useState<number>(1);
  const [kandaFilter, setKandaFilter] = useState<string>('all');

  const filteredStops = kandaFilter === 'all'
    ? journeyData
    : journeyData.filter(s => s.kanda.toLowerCase().includes(kandaFilter.toLowerCase()));

  const activeStopData = journeyData.find(s => s.stop === selectedStop) || journeyData[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs tracking-widest text-[#f59e3a] uppercase font-semibold">
          श्रीरामयात्रा · Sacred Geography
        </span>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-gold-gradient mt-2">
          Rama's 14-Year Journey
        </h1>
        <p className="text-sm text-[#a39eb5] mt-3 leading-relaxed">
          Trace the 3,000 km sacred trail from Ayodhya across Dandaka Forest, Kishkindha, and the southern ocean to Lanka.
        </p>

        <div className="inline-flex items-center gap-6 mt-4 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 text-xs text-[#a39eb5]">
          <span><strong className="text-white">15</strong> Sacred Stops</span>
          <span>·</span>
          <span><strong className="text-white">3,000+</strong> km on foot</span>
          <span>·</span>
          <span><strong className="text-white">14</strong> Years of Exile</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center gap-2 mb-8 overflow-x-auto pb-2">
        {[
          { id: 'all', label: 'All 15 Stops' },
          { id: 'bala', label: 'Bala Kanda' },
          { id: 'ayodhya', label: 'Ayodhya Kanda' },
          { id: 'aranya', label: 'Aranya Kanda' },
          { id: 'kishkindha', label: 'Kishkindha Kanda' },
          { id: 'sundara', label: 'Sundara Kanda' },
          { id: 'yuddha', label: 'Yuddha Kanda' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setKandaFilter(tab.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              kandaFilter === tab.id
                ? 'bg-[#f59e3a] text-black font-semibold shadow-lg shadow-orange-950/40'
                : 'bg-white/5 hover:bg-white/10 text-[#a39eb5] border border-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Interactive Layout: Route Map + Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
        {/* Route Stops Vertical Timeline */}
        <div className="lg:col-span-5 space-y-3 max-h-[700px] overflow-y-auto pr-2">
          {filteredStops.map(s => {
            const isSelected = selectedStop === s.stop;
            return (
              <div
                key={s.stop}
                onClick={() => setSelectedStop(s.stop)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-amber-950/30 border-amber-400 shadow-lg shadow-amber-950/40 ring-1 ring-amber-400/50'
                    : 'bg-[#0f0c1c]/70 border-white/5 hover:border-amber-400/30 hover:bg-[#151026]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                    isSelected ? 'bg-amber-500 text-black' : 'bg-white/10 text-amber-300'
                  }`}>
                    {s.stop}
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <h3 className="font-cinzel text-sm sm:text-base font-bold text-[#f3f0e6]">
                        {s.name}
                      </h3>
                      <span className="font-sanskrit text-xs text-[#f3d27a]/70">
                        {s.sanskritName}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#a39eb5] truncate max-w-[200px]">
                      {s.location}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-semibold text-[#f59e3a] block">
                    {s.kanda.replace(' Kanda', '')}
                  </span>
                  <span className="text-[10px] text-[#a39eb5] font-mono">
                    {s.coordinates.latitude}°N, {s.coordinates.longitude}°E
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Stop Featured Showcase Card */}
        <div className="lg:col-span-7 sticky top-24">
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#140f28] via-[#0d091a] to-[#07050d] border border-amber-400/30 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Stop {activeStopData.stop} of 15 · {activeStopData.kanda}
              </span>

              {activeStopData.mapsUrl && (
                <a
                  href={activeStopData.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#f59e3a] hover:underline font-medium"
                >
                  <MapPin className="w-3.5 h-3.5" /> View on Map <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            <div className="flex items-baseline gap-3 mb-2">
              <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-gold-gradient">
                {activeStopData.name}
              </h2>
              <span className="font-sanskrit text-xl sm:text-2xl text-amber-300/80">
                {activeStopData.sanskritName}
              </span>
            </div>

            <p className="text-xs font-mono text-[#a39eb5] mb-4">
              📍 {activeStopData.location} ({activeStopData.coordinates.latitude}°N, {activeStopData.coordinates.longitude}°E)
            </p>

            <p className="text-sm sm:text-base text-[#f3f0e6]/90 leading-relaxed mb-6">
              {activeStopData.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {activeStopData.tags.map(tag => (
                <span key={tag} className="px-2.5 py-1 rounded-full text-[11px] bg-white/5 border border-white/10 text-[#f3d27a]">
                  {tag}
                </span>
              ))}
            </div>

            {/* Featured Shloka */}
            {activeStopData.featuredShloka?.sanskrit && (
              <div className="p-4 rounded-2xl bg-black/40 border border-amber-400/20 mb-6">
                <div className="text-[11px] font-semibold text-[#f59e3a] uppercase tracking-wider mb-1">
                  Associated Shloka
                </div>
                <p className="font-sanskrit text-base text-amber-200 leading-relaxed font-medium">
                  {activeStopData.featuredShloka.sanskrit}
                </p>
                {activeStopData.featuredShloka.meaning && (
                  <p className="text-xs text-[#a39eb5] mt-1.5 italic">
                    "{activeStopData.featuredShloka.meaning}"
                  </p>
                )}
              </div>
            )}

            {/* Next Stop Jumper */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              {activeStopData.stop > 1 ? (
                <button
                  onClick={() => setSelectedStop(activeStopData.stop - 1)}
                  className="text-xs text-[#a39eb5] hover:text-white font-medium flex items-center gap-1 cursor-pointer"
                >
                  ← Stop {activeStopData.stop - 1}
                </button>
              ) : <div />}

              {activeStopData.stop < 15 ? (
                <button
                  onClick={() => setSelectedStop(activeStopData.stop + 1)}
                  className="text-xs font-semibold text-[#f59e3a] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Next: Stop {activeStopData.stop + 1} ({journeyData[activeStopData.stop].name}) →
                </button>
              ) : <div />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
