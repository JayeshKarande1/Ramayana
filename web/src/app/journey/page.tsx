'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MapPin, Compass, ExternalLink, ArrowRight, ArrowLeft, Volume2, 
  Play, Pause, Sparkles, Navigation, Users, Shield, BookOpen
} from 'lucide-react';
import journeyData from '@/data/journey.json';
import { chantVerse, playDiyaSpark } from '@/lib/audio';
import JourneyMap from '@/components/JourneyMap';

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
  const [viewMode, setViewMode] = useState<'map' | 'feed' | 'list'>('map');

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
      setSelectedStop(prev => {
        const next = prev >= 15 ? 1 : prev + 1;
        playDiyaSpark();
        return next;
      });
    }, 6000);
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
    <div className="w-full min-w-0 max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-12">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-10 px-1">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-amber-500/10 border border-amber-400/25 text-[11px] sm:text-xs text-[#f3d27a] mb-3 sm:mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="font-sanskrit tracking-wider">॥ श्रीरामवनवासयात्रा ॥ ३,२०० कि.मी.</span>
        </div>
        <h1 className="font-cinzel text-2xl sm:text-5xl md:text-6xl font-bold text-gold-gradient tracking-tight">
          The 14-Year Sacred Odyssey
        </h1>
        <p className="text-xs sm:text-base text-[#a39eb5] mt-2 sm:mt-3 leading-relaxed font-light max-w-2xl mx-auto">
          Walk with Bhagavan Sri Rama through 3,200 kilometers of dense wilderness, 
          ancient hermitages, and oceanic bridges from the Sarayu river to the citadel of Lanka.
        </p>

        {/* Global Journey Metrics Ribbon */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-6 mt-4 sm:mt-6 py-2.5 sm:py-3 px-3 sm:px-6 rounded-2xl sm:rounded-full bg-white/[0.02] border border-amber-400/20 text-[11px] sm:text-xs text-[#a39eb5] max-w-xl mx-auto">
          <div><strong className="text-amber-300 font-cinzel text-xs sm:text-sm">15</strong> Sacred Waypoints</div>
          <span className="hidden sm:inline text-white/20">•</span>
          <div><strong className="text-amber-300 font-cinzel text-xs sm:text-sm">3,200+</strong> km on Foot</div>
          <span className="hidden sm:inline text-white/20">•</span>
          <div><strong className="text-amber-300 font-cinzel text-xs sm:text-sm">14</strong> Sacred Years</div>
          <div className="w-full sm:w-auto flex justify-center mt-1 sm:mt-0">
            <button
              onClick={() => setIsAutoTouring(!isAutoTouring)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold cursor-pointer transition-all ${
                isAutoTouring
                  ? 'bg-amber-500 text-black font-bold animate-pulse shadow-md shadow-amber-500/30'
                  : 'bg-white/5 border border-white/10 text-amber-300 hover:border-amber-400/40'
              }`}
            >
              {isAutoTouring ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isAutoTouring ? 'Pause Tour' : 'Auto Pilgrimage'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Epoch Filter Tabs */}
      <div className="flex justify-start sm:justify-center gap-1.5 sm:gap-2 mb-5 sm:mb-8 overflow-x-auto pb-2.5 no-scrollbar px-1">
        {epochs.map(e => (
          <button
            key={e.id}
            onClick={() => {
              setActiveEpoch(e.id);
              if (e.id !== 'all') {
                setSelectedStop(e.stops[0]);
              }
            }}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeEpoch === e.id
                ? 'saffron-gradient text-black font-bold shadow-md shadow-orange-950/40 scale-102 sm:scale-105'
                : 'bg-white/5 hover:bg-white/10 text-[#a39eb5] border border-white/10'
            }`}
          >
            <span>{e.label}</span>
          </button>
        ))}
      </div>

      {/* Segmented View Switcher Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-white/10 mb-6 px-1">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-white/10 text-xs w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={() => setViewMode('map')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs font-medium flex-1 sm:flex-initial ${
              viewMode === 'map'
                ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-sm font-semibold'
                : 'text-[#a39eb5] hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Antique Map</span>
          </button>
          <button
            onClick={() => setViewMode('feed')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs font-medium flex-1 sm:flex-initial ${
              viewMode === 'feed'
                ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-sm font-semibold'
                : 'text-[#a39eb5] hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Story Stream</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 text-xs font-medium flex-1 sm:flex-initial ${
              viewMode === 'list'
                ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-sm font-semibold'
                : 'text-[#a39eb5] hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Ledger</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <div className="text-right">
            <span className="text-xs font-semibold text-amber-300 font-cinzel block">
              {activeStopData.name}
            </span>
            <span className="text-[10px] text-[#a39eb5] font-mono">
              {meta.distance} • {meta.timeline.split(' ')[0]}
            </span>
          </div>
        </div>
      </div>

      {/* View Content: Feed (Chronological Mobile Stream) OR Split Map & Stage */}
      {viewMode === 'feed' ? (
        /* Full-Width Chronological Story Stream Mode */
        <div className="space-y-6 max-w-4xl mx-auto mb-16">
          <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 border border-amber-400/20 text-xs text-amber-200/90 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Continuous Chronicle of Bhagavan Sri Rama&apos;s 14-year pilgrimage ({filteredStops.length} Sanctuaries). Read sequentially or filter by epoch above.
            </span>
          </div>

          {filteredStops.map((s) => {
            const sMeta = stopMeta[s.stop] || stopMeta[1];

            return (
              <article
                key={s.stop}
                id={`feed-stop-${s.stop}`}
                className="manuscript-pothi rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl border border-amber-400/20 relative overflow-hidden"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full saffron-gradient text-black font-cinzel font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                      {s.stop}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 font-cinzel">
                      Sanctuary {s.stop} of 15
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs bg-white/5 border border-white/10 text-[#a39eb5]">
                      {s.kanda}
                    </span>
                  </div>

                  {s.mapsUrl && (
                    <a
                      href={s.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300 font-medium"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {/* Titles */}
                <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-2">
                  <h2 className="font-cinzel text-xl sm:text-3xl font-bold text-gold-gradient">
                    {s.name}
                  </h2>
                  <span className="font-sanskrit text-lg sm:text-2xl text-amber-200">
                    {s.sanskritName}
                  </span>
                </div>

                {/* Geo banner */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono text-[#a39eb5] mb-4 p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{s.location}</span>
                  </div>
                  <span>•</span>
                  <div><span className="text-amber-300 font-bold">{sMeta.distance}</span> from Ayodhya</div>
                  <span>•</span>
                  <div className="text-amber-200">{sMeta.timeline}</div>
                </div>

                {/* Narrative Description */}
                <p className="text-sm sm:text-base text-[#f5efe6]/90 leading-relaxed mb-4 font-light">
                  {s.description}
                </p>

                {/* Figures */}
                {sMeta.figures.length > 0 && (
                  <div className="mb-4">
                    <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider block mb-1.5 font-cinzel">
                      Figures Encountered
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {sMeta.figures.map(figure => (
                        <span
                          key={figure}
                          className="px-2.5 py-0.5 rounded-full text-[11px] bg-purple-500/10 border border-purple-500/25 text-purple-200"
                        >
                          {figure}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sacred Verse */}
                {s.featuredShloka?.sanskrit && (
                  <div className="p-3.5 sm:p-4 rounded-xl bg-black/50 border border-amber-400/25 mb-4">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] sm:text-[11px] font-semibold text-[#f59e3a] uppercase tracking-wider font-cinzel">
                        ॥ मन्त्रसंस्मरणम् · Sacred Verse ॥
                      </span>
                      <button
                        onClick={() => {
                          chantVerse(s.featuredShloka.sanskrit, () => {});
                          playDiyaSpark();
                        }}
                        className="px-2.5 py-1 rounded-full border border-white/10 text-amber-300 hover:text-white bg-white/5 flex items-center gap-1 text-xs cursor-pointer active:scale-95"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>Chant Verse</span>
                      </button>
                    </div>
                    <p className="font-sanskrit text-base sm:text-lg text-gold-gradient leading-relaxed my-1.5 font-medium">
                      {s.featuredShloka.sanskrit}
                    </p>
                    {s.featuredShloka.meaning && (
                      <p className="text-xs text-[#a39eb5] mt-1 italic">
                        &ldquo;{s.featuredShloka.meaning}&rdquo;
                      </p>
                    )}
                  </div>
                )}

                {/* Sarga Link CTA */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <Link
                    href={sMeta.sargaLink}
                    className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-amber-200 font-semibold active:scale-95"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Read Sarga in Scripture Codex</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        /* Split Dual-Pane Mode (Desktop Side-by-Side, Mobile Top-and-Bottom with Synchronized Card) */
        <div id="journey-map-top" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Left Column: Interactive Map or Milestone Ledger */}
          <div className="lg:col-span-6">
            {viewMode === 'map' ? (
              <>
                <JourneyMap
                  selectedStop={selectedStop}
                  onSelectStop={(s) => {
                    setSelectedStop(s);
                    playDiyaSpark();
                  }}
                  isAutoTouring={isAutoTouring}
                  onToggleAutoTour={() => setIsAutoTouring(!isAutoTouring)}
                />

                {/* Mobile Synchronized Active Sanctuary Card (Directly below map on mobile for instant feedback) */}
                <div className="lg:hidden mt-3 bg-gradient-to-b from-[#181126] to-[#0c0817] rounded-2xl border border-amber-400/30 p-4 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 font-cinzel">
                      Stop {activeStopData.stop} of 15 · {activeStopData.kanda}
                    </span>
                    <span className="text-xs font-mono text-amber-400/90 font-semibold">
                      {meta.distance}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between gap-2 mb-1.5">
                    <h3 className="font-cinzel text-lg font-bold text-gold-gradient">
                      {activeStopData.name}
                    </h3>
                    <span className="font-sanskrit text-sm text-amber-200/90">
                      {activeStopData.sanskritName}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-[#a39eb5] mb-2.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate">{activeStopData.location}</span>
                    <span>•</span>
                    <span className="truncate">{meta.timeline}</span>
                  </div>

                  <p className="text-xs text-[#f5efe6]/85 line-clamp-2 leading-relaxed mb-3 font-light">
                    {activeStopData.description}
                  </p>

                  <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-white/10">
                    <div className="flex items-center gap-2">
                      {activeStopData.featuredShloka?.sanskrit && (
                        <button
                          onClick={handleChantShloka}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all ${
                            isPlayingShloka
                              ? 'bg-amber-500 text-black border-amber-400 animate-pulse'
                              : 'bg-amber-500/15 border-amber-400/30 text-amber-300 hover:bg-amber-500/25'
                          }`}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>{isPlayingShloka ? 'Chanting...' : 'Chant'}</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          const el = document.getElementById('sanctuary-details');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-[#f5efe6] font-medium flex items-center gap-1 active:scale-95 transition-all hover:border-amber-400/30"
                      >
                        <span>Full Story</span>
                        <ArrowRight className="w-3 h-3 text-amber-400" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setSelectedStop(prev => Math.max(1, prev - 1));
                          playDiyaSpark();
                        }}
                        disabled={activeStopData.stop === 1}
                        className={`p-1.5 rounded-lg border text-xs active:scale-90 transition-all ${
                          activeStopData.stop === 1
                            ? 'border-white/5 text-white/20 cursor-not-allowed'
                            : 'border-white/10 bg-white/5 text-[#a39eb5] hover:text-white'
                        }`}
                        aria-label="Previous Sanctuary"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedStop(prev => Math.min(15, prev + 1));
                          playDiyaSpark();
                        }}
                        disabled={activeStopData.stop === 15}
                        className={`p-1.5 rounded-lg border text-xs active:scale-90 transition-all ${
                          activeStopData.stop === 15
                            ? 'border-white/5 text-white/20 cursor-not-allowed'
                            : 'border-white/10 bg-white/5 text-[#a39eb5] hover:text-white'
                        }`}
                        aria-label="Next Sanctuary"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              /* Milestone Ledger Mode: No nested scroll traps on mobile! */
              <div className="bg-gradient-to-b from-[#110d21] to-[#0a0714] rounded-2xl sm:rounded-3xl border border-amber-400/20 p-3 sm:p-5 shadow-2xl space-y-2.5 lg:max-h-[700px] lg:overflow-y-auto pr-1">
                {filteredStops.map(s => {
                  const isSelected = selectedStop === s.stop;
                  const sMeta = stopMeta[s.stop] || stopMeta[1];

                  return (
                    <div
                      key={s.stop}
                      onClick={() => {
                        setSelectedStop(s.stop);
                        playDiyaSpark();
                      }}
                      className={`p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-gradient-to-r from-amber-500/20 to-orange-950/30 border-amber-400 shadow-md shadow-amber-950/40 scale-[1.01]'
                          : 'bg-white/[0.02] border-white/5 hover:border-amber-400/30 hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-cinzel text-xs font-bold shrink-0 transition-transform ${
                          isSelected
                            ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-black scale-105 sm:scale-110 shadow-md shadow-amber-500/30 font-bold'
                            : 'bg-white/10 text-amber-200'
                        }`}>
                          {s.stop}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-baseline gap-1.5 sm:gap-2">
                            <h4 className={`text-xs sm:text-sm font-bold font-cinzel truncate ${isSelected ? 'text-amber-300' : 'text-[#f5efe6]'}`}>
                              {s.name}
                            </h4>
                            <span className="font-sanskrit text-[11px] sm:text-xs text-[#f3d27a]/60 truncate hidden xs:inline">
                              {s.sanskritName}
                            </span>
                          </div>
                          <div className="text-[10px] sm:text-[11px] text-[#a39eb5] flex items-center gap-1.5 sm:gap-2 mt-0.5 truncate">
                            <span className="truncate">{s.location.split(',')[0]}</span>
                            <span>•</span>
                            <span className="font-mono text-amber-400/80">{sMeta.distance}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0 pl-2">
                        <span className="text-[9px] sm:text-[10px] uppercase font-bold text-[#f59e3a] block">
                          {s.kanda.replace(' Kanda', '')}
                        </span>
                        <span className="text-[9px] sm:text-[10px] text-[#a39eb5] font-mono">
                          {sMeta.timeline.split(' ')[0]}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: High-Impact Waypoint Stage (Sticky on Desktop, Rich Stage on Mobile) */}
          <div id="sanctuary-details" className="lg:col-span-6 lg:sticky lg:top-24 scroll-mt-24">
            <div className="manuscript-pothi rounded-2xl sm:rounded-3xl p-4 sm:p-9 shadow-2xl relative overflow-hidden">
              {/* Ambient Background Aura */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Stage Header Tags */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 mb-4">
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
              <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-2">
                <h2 className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-bold text-gold-gradient break-words">
                  {activeStopData.name}
                </h2>
                <span className="font-sanskrit text-lg sm:text-2xl md:text-3xl text-amber-200 font-medium">
                  {activeStopData.sanskritName}
                </span>
              </div>

              {/* Geographical & Chronological Banner */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-mono text-[#a39eb5] mb-5 sm:mb-6 p-2.5 sm:p-3 rounded-xl bg-black/40 border border-white/5">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{activeStopData.location}</span>
                </div>
                <span className="hidden sm:inline text-white/20">•</span>
                <div>
                  <span className="text-amber-300 font-bold">{meta.distance}</span> from Ayodhya
                </div>
                <span className="hidden sm:inline text-white/20">•</span>
                <div className="text-amber-200">
                  {meta.timeline}
                </div>
              </div>

              {/* Narrative Description */}
              <p className="text-sm sm:text-base text-[#f5efe6]/90 leading-relaxed mb-5 sm:mb-6 font-light">
                {activeStopData.description}
              </p>

              {/* Figures Present / Encountered */}
              <div className="mb-5 sm:mb-6">
                <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider block mb-2 flex items-center gap-1.5 font-cinzel">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  Figures Encountered at this Sanctuary
                </span>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {meta.figures.map(figure => (
                    <span
                      key={figure}
                      className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs bg-purple-500/10 border border-purple-500/25 text-purple-200"
                    >
                      {figure}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tags Ribbon */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-5 sm:mb-6">
                {activeStopData.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] bg-white/5 border border-white/10 text-amber-300/80">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Sacred Shloka with Audio Chant Player */}
              {activeStopData.featuredShloka?.sanskrit && (
                <div className="p-4 sm:p-5 rounded-2xl bg-black/50 border border-amber-400/25 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] sm:text-[11px] font-semibold text-[#f59e3a] uppercase tracking-wider font-cinzel">
                      ॥ मन्त्रसंस्मरणम् · Sacred Verse Chanted Here ॥
                    </span>
                    <button
                      onClick={handleChantShloka}
                      className={`px-2.5 sm:px-3 py-1 rounded-full border transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer ${
                        isPlayingShloka
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 animate-pulse'
                          : 'bg-white/5 border-white/10 text-amber-300 hover:text-white'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isPlayingShloka ? 'Chanting...' : 'Chant Shloka'}</span>
                    </button>
                  </div>

                  <p className="font-sanskrit text-base sm:text-xl text-gold-gradient leading-relaxed my-2 font-medium">
                    {activeStopData.featuredShloka.sanskrit}
                  </p>

                  {activeStopData.featuredShloka.meaning && (
                    <p className="text-xs sm:text-sm text-[#a39eb5] mt-2 italic">
                      &ldquo;{activeStopData.featuredShloka.meaning}&rdquo;
                    </p>
                  )}
                </div>
              )}

              {/* Action Bar: Sarga Reader Direct Launcher & Stepper */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                <Link
                  href={meta.sargaLink}
                  className="w-full sm:w-auto px-4 sm:px-5 py-2.5 sm:py-3 rounded-full saffron-gradient text-black font-semibold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-md group active:scale-95"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Read Sarga in Scripture Codex</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3">
                  <button
                    onClick={() => {
                      const el = document.getElementById('journey-map-top');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="lg:hidden text-xs text-amber-300/90 hover:text-amber-200 flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-white/5 border border-white/10 cursor-pointer active:scale-95"
                  >
                    <Compass className="w-3.5 h-3.5 text-amber-400" />
                    <span>Map Top ↑</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedStop(prev => Math.max(1, prev - 1));
                        playDiyaSpark();
                      }}
                      disabled={activeStopData.stop === 1}
                      className={`p-2.5 rounded-full border text-xs cursor-pointer active:scale-95 ${
                        activeStopData.stop === 1
                          ? 'border-white/5 text-white/20 cursor-not-allowed'
                          : 'border-white/10 text-[#a39eb5] hover:text-white hover:border-amber-400/40 bg-white/5'
                      }`}
                      title="Previous Stop"
                      aria-label="Previous Stop"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-mono text-[#a39eb5] px-1">
                      {activeStopData.stop} / 15
                    </span>
                    <button
                      onClick={() => {
                        setSelectedStop(prev => Math.min(15, prev + 1));
                        playDiyaSpark();
                      }}
                      disabled={activeStopData.stop === 15}
                      className={`p-2.5 rounded-full border text-xs cursor-pointer active:scale-95 ${
                        activeStopData.stop === 15
                          ? 'border-white/5 text-white/20 cursor-not-allowed'
                          : 'border-white/10 text-[#a39eb5] hover:text-white hover:border-amber-400/40 bg-white/5'
                      }`}
                      title="Next Stop"
                      aria-label="Next Stop"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
