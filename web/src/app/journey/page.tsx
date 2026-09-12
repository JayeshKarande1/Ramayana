'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MapPin, Compass, ExternalLink, ArrowRight, ArrowLeft, Volume2, 
  Play, Pause, Sparkles, Navigation, Users, Shield, BookOpen
} from 'lucide-react';
import journeyData from '@/data/journey.json';
import { chantVerse } from '@/lib/audio';

const stopMeta: Record<number, { distance: string; timeline: string; figures: string[]; sargaLink: string }> = {
  1: { distance: "0 km", timeline: "Beginning / Year 0", figures: ["Dasharatha", "Kausalya", "Vishvamitra", "Sita"], sargaLink: "/story/bala/1" },
  2: { distance: "140 km", timeline: "Day 2 of Exile", figures: ["Nishad Raj Guha", "Sumantra"], sargaLink: "/story/ayodhya/50" },
  3: { distance: "185 km", timeline: "Day 3 of Exile", figures: ["Sage Bharadvaja"], sargaLink: "/story/ayodhya/54" },
  4: { distance: "280 km", timeline: "Years 1 to 12", figures: ["Sage Valmiki", "Bharata", "Shatrughna"], sargaLink: "/story/ayodhya/56" },
  5: { distance: "600 km", timeline: "Year 12 of Exile", figures: ["Sage Agastya", "Sage Sutikshna"], sargaLink: "/story/aranya/1" },
  6: { distance: "1,100 km", timeline: "Year 13 of Exile", figures: ["Lakshmana", "Surpanakha", "Maricha", "Ravana"], sargaLink: "/story/aranya/14" },
  7: { distance: "1,700 km", timeline: "Year 13 of Exile", figures: ["Jatayu (Sacrifice)"], sargaLink: "/story/aranya/67" },
  8: { distance: "1,950 km", timeline: "Year 13 of Exile", figures: ["Devotee Shabari", "Sage Matanga"], sargaLink: "/story/aranya/74" },
  9: { distance: "2,100 km", timeline: "Year 14 of Exile", figures: ["Sugriva", "Vali", "Angada", "Tara"], sargaLink: "/story/kishkindha/1" },
  10: { distance: "2,150 km", timeline: "Year 14 of Exile", figures: ["Hanuman", "Vanara Council"], sargaLink: "/story/kishkindha/4" },
  11: { distance: "2,750 km", timeline: "Year 14 of Exile", figures: ["Vibhishana", "Varuna (Ocean Lord)"], sargaLink: "/story/yuddha/4" },
  12: { distance: "2,850 km", timeline: "Year 14 of Exile", figures: ["Lord Shiva (Consecration)"], sargaLink: "/story/yuddha/22" },
  13: { distance: "2,900 km", timeline: "Year 14 of Exile", figures: ["Architect Nala", "Vanara Sena"], sargaLink: "/story/yuddha/22" },
  14: { distance: "3,100 km", timeline: "Year 14 of Exile", figures: ["Divine Mother Sita", "Hanuman", "Trijata"], sargaLink: "/story/sundara/14" },
  15: { distance: "3,200 km", timeline: "Year 14 of Exile", figures: ["Ravana", "Indrajit", "Kumbhakarna", "Mandodari"], sargaLink: "/story/yuddha/100" }
};

const epochs = [
  { id: 'all', label: 'All 15 Sanctuaries', stops: [1, 15] },
  { id: 'epoch1', label: 'I. Renunciation & Ayodhya', stops: [1, 4] },
  { id: 'epoch2', label: 'II. The Deep Wilderness', stops: [5, 8] },
  { id: 'epoch3', label: 'III. Kishkindha Alliance', stops: [9, 11] },
  { id: 'epoch4', label: 'IV. The Ocean & Lanka', stops: [12, 15] }
];

export default function JourneyPage() {
  const [selectedStop, setSelectedStop] = useState<number>(1);
  const [activeEpoch, setActiveEpoch] = useState<string>('all');
  const [isPlayingShloka, setIsPlayingShloka] = useState(false);
  const [isAutoTouring, setIsAutoTouring] = useState(false);

  const activeStopData = journeyData.find(s => s.stop === selectedStop) || journeyData[0];
  const meta = stopMeta[activeStopData.stop] || stopMeta[1];

  const handleChantShloka = () => {
    if (!activeStopData.featuredShloka?.sanskrit) return;
    setIsPlayingShloka(true);
    chantVerse(activeStopData.featuredShloka.sanskrit, () => setIsPlayingShloka(false));
  };

  // Auto-tour timer effect
  useEffect(() => {
    if (!isAutoTouring) return;
    const interval = setInterval(() => {
      setSelectedStop(prev => (prev >= 15 ? 1 : prev + 1));
    }, 7000);
    return () => clearInterval(interval);
  }, [isAutoTouring]);

  const filteredStops = activeEpoch === 'all'
    ? journeyData
    : journeyData.filter(s => {
        const found = epochs.find(e => e.id === activeEpoch);
        if (!found) return true;
        return s.stop >= found.stops[0] && s.stop <= found.stops[1];
      });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/25 text-xs text-[#f3d27a] mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-sanskrit tracking-wider">॥ श्रीरामवनवासयात्रा ॥ ३,२०० कि.मी.</span>
        </div>
        <h1 className="font-cinzel text-3xl sm:text-5xl md:text-6xl font-bold text-gold-gradient">
          The 14-Year Sacred Odyssey
        </h1>
        <p className="text-sm sm:text-base text-[#a39eb5] mt-3 leading-relaxed font-light">
          Walk with Bhagavan Sri Rama through 3,200 kilometers of dense wilderness, 
          ancient hermitages, and oceanic bridges from the Sarayu river to the citadel of Lanka.
        </p>

        {/* Global Journey Metrics Ribbon */}
        <div className="flex flex-wrap justify-center items-center gap-6 mt-6 py-3 px-6 rounded-full bg-white/[0.02] border border-amber-400/20 text-xs text-[#a39eb5] max-w-xl mx-auto">
          <div><strong className="text-amber-300 font-cinzel text-sm">15</strong> Sacred Waypoints</div>
          <span>•</span>
          <div><strong className="text-amber-300 font-cinzel text-sm">3,200+</strong> km on Foot</div>
          <span>•</span>
          <div><strong className="text-amber-300 font-cinzel text-sm">14</strong> Sacred Years</div>
          <span>•</span>
          <button
            onClick={() => setIsAutoTouring(!isAutoTouring)}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
              isAutoTouring
                ? 'bg-amber-500 text-black font-bold animate-pulse'
                : 'bg-white/5 border border-white/10 text-amber-300 hover:border-amber-400/40'
            }`}
          >
            {isAutoTouring ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isAutoTouring ? 'Pause Tour' : 'Auto Pilgrimage'}</span>
          </button>
        </div>
      </div>

      {/* Epoch Filter Tabs */}
      <div className="flex justify-start sm:justify-center gap-2 mb-8 overflow-x-auto pb-3 no-scrollbar">
        {epochs.map(e => (
          <button
            key={e.id}
            onClick={() => {
              setActiveEpoch(e.id);
              if (e.id !== 'all') {
                setSelectedStop(e.stops[0]);
              }
            }}
            className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeEpoch === e.id
                ? 'saffron-gradient text-black font-bold shadow-md shadow-orange-950/40 scale-105'
                : 'bg-white/5 hover:bg-white/10 text-[#a39eb5] border border-white/10'
            }`}
          >
            <span>{e.label}</span>
          </button>
        ))}
      </div>

      {/* Main Odyssey Interactive Grid: Left Interactive Waypoint Track, Right Dramatic Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
        {/* Left Column: Interactive Waypoint Trail */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#110d21] to-[#0a0714] rounded-3xl border border-amber-400/20 p-5 shadow-2xl">
          <div className="flex justify-between items-center pb-3 border-b border-white/10 mb-4 px-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-300 font-cinzel">
              Sacred Trail (15 Milestones)
            </span>
            <span className="text-[11px] text-[#a39eb5]">
              Active: {activeStopData.name} ({meta.distance})
            </span>
          </div>

          <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
            {filteredStops.map(s => {
              const isSelected = selectedStop === s.stop;
              const sMeta = stopMeta[s.stop] || stopMeta[1];

              return (
                <div
                  key={s.stop}
                  onClick={() => setSelectedStop(s.stop)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500/20 to-orange-950/30 border-amber-400 shadow-md shadow-amber-950/40 scale-[1.01]'
                      : 'bg-white/[0.02] border-white/5 hover:border-amber-400/30 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-cinzel text-xs font-bold shrink-0 transition-transform ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-black scale-110 shadow-md shadow-amber-500/30'
                        : 'bg-white/10 text-amber-200'
                    }`}>
                      {s.stop}
                    </div>
                    <div>
                      <div className="flex items-baseline gap-2">
                        <h4 className={`text-sm font-bold font-cinzel ${isSelected ? 'text-amber-300' : 'text-[#f5efe6]'}`}>
                          {s.name}
                        </h4>
                        <span className="font-sanskrit text-xs text-[#f3d27a]/60">
                          {s.sanskritName}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#a39eb5] flex items-center gap-2 mt-0.5">
                        <span>{s.location.split(',')[0]}</span>
                        <span>•</span>
                        <span className="font-mono text-amber-400/80">{sMeta.distance}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] uppercase font-bold text-[#f59e3a] block">
                      {s.kanda.replace(' Kanda', '')}
                    </span>
                    <span className="text-[10px] text-[#a39eb5] font-mono">
                      {sMeta.timeline.split(' ')[0]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: High-Impact Waypoint Stage */}
        <div className="lg:col-span-7 sticky top-24">
          <div className="manuscript-pothi rounded-3xl p-6 sm:p-9 shadow-2xl relative overflow-hidden">
            {/* Ambient Background Aura */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Stage Header Tags */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="inline-flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 font-cinzel">
                  Sanctuary {activeStopData.stop} of 15
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-[#a39eb5]">
                  {activeStopData.kanda}
                </span>
              </div>

              {activeStopData.mapsUrl && (
                <a
                  href={activeStopData.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors font-medium"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* Sanctuary Titles */}
            <div className="flex items-baseline gap-3 mb-2">
              <h2 className="font-cinzel text-3xl sm:text-5xl font-bold text-gold-gradient">
                {activeStopData.name}
              </h2>
              <span className="font-sanskrit text-2xl sm:text-3xl text-amber-200 font-medium">
                {activeStopData.sanskritName}
              </span>
            </div>

            {/* Geographical & Chronological Banner */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#a39eb5] mb-6 p-3 rounded-xl bg-black/40 border border-white/5">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>{activeStopData.location}</span>
              </div>
              <span>•</span>
              <div>
                <span className="text-amber-300 font-bold">{meta.distance}</span> from Ayodhya
              </div>
              <span>•</span>
              <div className="text-amber-200">
                {meta.timeline}
              </div>
            </div>

            {/* Narrative Description */}
            <p className="text-sm sm:text-base text-[#f5efe6]/90 leading-relaxed mb-6 font-light">
              {activeStopData.description}
            </p>

            {/* Figures Present / Encountered */}
            <div className="mb-6">
              <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider block mb-2 flex items-center gap-1.5 font-cinzel">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                Figures Encountered at this Sanctuary
              </span>
              <div className="flex flex-wrap gap-2">
                {meta.figures.map(figure => (
                  <span
                    key={figure}
                    className="px-3 py-1 rounded-full text-xs bg-purple-500/10 border border-purple-500/25 text-purple-200"
                  >
                    {figure}
                  </span>
                ))}
              </div>
            </div>

            {/* Tags Ribbon */}
            <div className="flex flex-wrap gap-2 mb-6">
              {activeStopData.tags.map(tag => (
                <span key={tag} className="px-2.5 py-1 rounded-full text-[11px] bg-white/5 border border-white/10 text-amber-300/80">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Sacred Shloka with Audio Chant Player */}
            {activeStopData.featuredShloka?.sanskrit && (
              <div className="p-5 rounded-2xl bg-black/50 border border-amber-400/25 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] font-semibold text-[#f59e3a] uppercase tracking-wider font-cinzel">
                    ॥ मन्त्रसंस्मरणम् · Sacred Verse Chanted Here ॥
                  </span>
                  <button
                    onClick={handleChantShloka}
                    className={`px-3 py-1 rounded-full border transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer ${
                      isPlayingShloka
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 animate-pulse'
                        : 'bg-white/5 border-white/10 text-amber-300 hover:text-white'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isPlayingShloka ? 'Chanting...' : 'Chant Shloka'}</span>
                  </button>
                </div>

                <p className="font-sanskrit text-lg sm:text-xl text-gold-gradient leading-relaxed my-2 font-medium">
                  {activeStopData.featuredShloka.sanskrit}
                </p>

                {activeStopData.featuredShloka.meaning && (
                  <p className="text-xs sm:text-sm text-[#a39eb5] mt-2 italic">
                    "{activeStopData.featuredShloka.meaning}"
                  </p>
                )}
              </div>
            )}

            {/* Action Bar: Sarga Reader Direct Launcher & Stepper */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link
                href={meta.sargaLink}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full saffron-gradient text-black font-semibold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-md group"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Read Sarga in Scripture Codex</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedStop(prev => Math.max(1, prev - 1))}
                  disabled={activeStopData.stop === 1}
                  className={`p-2 rounded-full border text-xs cursor-pointer ${
                    activeStopData.stop === 1
                      ? 'border-white/5 text-white/20 cursor-not-allowed'
                      : 'border-white/10 text-[#a39eb5] hover:text-white hover:border-amber-400/40'
                  }`}
                  title="Previous Stop"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-[#a39eb5]">
                  {activeStopData.stop} / 15
                </span>
                <button
                  onClick={() => setSelectedStop(prev => Math.min(15, prev + 1))}
                  disabled={activeStopData.stop === 15}
                  className={`p-2 rounded-full border text-xs cursor-pointer ${
                    activeStopData.stop === 15
                      ? 'border-white/5 text-white/20 cursor-not-allowed'
                      : 'border-white/10 text-[#a39eb5] hover:text-white hover:border-amber-400/40'
                  }`}
                  title="Next Stop"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
