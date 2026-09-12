'use client';

import React, { useState } from 'react';
import { Sparkles, Play, Pause, ChevronRight, ChevronLeft, Volume2, Navigation } from 'lucide-react';
import { playDiyaSpark } from '@/lib/audio';

export interface WaypointCoord {
  stop: number;
  name: string;
  sanskritName: string;
  kanda: string;
  x: number;
  y: number;
  distance: string;
}

// Artistically balanced cartographic coordinates reflecting authentic ancient Bharatavarsha geography
export const MAP_WAYPOINTS: WaypointCoord[] = [
  { stop: 1, name: "Ayodhya", sanskritName: "अयोध्या", kanda: "Bala Kanda", x: 380, y: 70, distance: "0 km" },
  { stop: 2, name: "Shringaverapura", sanskritName: "शृङ्गवेरपुर", kanda: "Ayodhya Kanda", x: 355, y: 118, distance: "140 km" },
  { stop: 3, name: "Prayag", sanskritName: "प्रयाग", kanda: "Ayodhya Kanda", x: 405, y: 145, distance: "185 km" },
  { stop: 4, name: "Chitrakoot", sanskritName: "चित्रकूट", kanda: "Ayodhya Kanda", x: 320, y: 175, distance: "280 km" },
  { stop: 5, name: "Dandaka Forest", sanskritName: "दण्डकारण्य", kanda: "Aranya Kanda", x: 310, y: 265, distance: "600 km" },
  { stop: 6, name: "Panchavati", sanskritName: "पञ्चवटी", kanda: "Aranya Kanda", x: 135, y: 295, distance: "1,100 km" },
  { stop: 7, name: "Lepakshi", sanskritName: "लेपाक्षी", kanda: "Aranya Kanda", x: 265, y: 410, distance: "1,700 km" },
  { stop: 8, name: "Shabari Ashram", sanskritName: "शबरी आश्रम", kanda: "Aranya Kanda", x: 175, y: 435, distance: "1,950 km" },
  { stop: 9, name: "Kishkindha", sanskritName: "किष्किन्धा", kanda: "Kishkindha Kanda", x: 205, y: 475, distance: "2,100 km" },
  { stop: 10, name: "Rishyamukha", sanskritName: "ऋष्यमूक", kanda: "Kishkindha Kanda", x: 250, y: 505, distance: "2,150 km" },
  { stop: 11, name: "Southern Coast", sanskritName: "महेन्द्रगिरि", kanda: "Yuddha Kanda", x: 235, y: 575, distance: "2,750 km" },
  { stop: 12, name: "Rameshwaram", sanskritName: "रामेश्वरम्", kanda: "Yuddha Kanda", x: 300, y: 615, distance: "2,850 km" },
  { stop: 13, name: "Ram Setu", sanskritName: "रामसेतुः", kanda: "Yuddha Kanda", x: 335, y: 645, distance: "2,900 km" },
  { stop: 14, name: "Lanka", sanskritName: "लङ्का", kanda: "Yuddha Kanda", x: 375, y: 680, distance: "3,200 km" },
  { stop: 15, name: "Pushpaka Return", sanskritName: "अयोध्यागमनम्", kanda: "Yuddha Kanda", x: 425, y: 85, distance: "Aerial Return" }
];

interface JourneyMapProps {
  selectedStop: number;
  onSelectStop: (stop: number) => void;
  isAutoTouring: boolean;
  onToggleAutoTour: () => void;
}

export default function JourneyMap({
  selectedStop,
  onSelectStop,
  isAutoTouring,
  onToggleAutoTour,
}: JourneyMapProps) {
  const [hoveredStop, setHoveredStop] = useState<number | null>(null);

  // Generate smooth SVG spline connecting stops 1 to 14
  const outwardStops = MAP_WAYPOINTS.slice(0, 14);
  const routePathD = outwardStops.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = outwardStops[i - 1];
    const mx = (prev.x + pt.x) / 2;
    const my = (prev.y + pt.y) / 2;
    return `${acc} Q ${prev.x} ${pt.y}, ${pt.x} ${pt.y}`;
  }, '');

  // Celestial Pushpaka Vimana aerial return arc (14 -> 15)
  const lanka = MAP_WAYPOINTS[13];
  const ayodhyaReturn = MAP_WAYPOINTS[14];
  const vimanaPathD = `M ${lanka.x} ${lanka.y} C ${lanka.x + 80} 400, ${ayodhyaReturn.x + 70} 250, ${ayodhyaReturn.x} ${ayodhyaReturn.y}`;

  const currentStopData = MAP_WAYPOINTS.find(w => w.stop === selectedStop) || MAP_WAYPOINTS[0];

  const handleStopClick = (stopNum: number) => {
    onSelectStop(stopNum);
    playDiyaSpark();
  };

  return (
    <div className="relative w-full rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#120d24] via-[#0d091a] to-[#07050e] border border-amber-400/20 p-3 sm:p-6 shadow-2xl overflow-hidden">
      {/* Ancient Map Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 pb-2.5 sm:pb-3 border-b border-white/10 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping shrink-0" />
          <h3 className="font-cinzel text-xs sm:text-base font-bold text-amber-200 tracking-wider truncate">
            Cartography of Bharatavarsha · 3,200 km Trail
          </h3>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onToggleAutoTour}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold transition-all cursor-pointer ${
              isAutoTouring
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30'
                : 'bg-white/5 border border-white/10 text-amber-300 hover:border-amber-400/40'
            }`}
          >
            {isAutoTouring ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isAutoTouring ? 'Pause' : 'Auto Tour'}</span>
          </button>

          <button
            onClick={() => handleStopClick(selectedStop <= 1 ? 15 : selectedStop - 1)}
            className="p-1.5 rounded-full bg-white/5 border border-white/10 text-[#a39eb5] hover:text-white cursor-pointer active:scale-90"
            title="Previous Waypoint"
            aria-label="Previous Waypoint"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleStopClick(selectedStop >= 15 ? 1 : selectedStop + 1)}
            className="p-1.5 rounded-full bg-white/5 border border-white/10 text-[#a39eb5] hover:text-white cursor-pointer active:scale-90"
            title="Next Waypoint"
            aria-label="Next Waypoint"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Ancient Map Canvas */}
      <div className="relative w-full aspect-[520/730] max-h-[520px] sm:max-h-[720px] select-none flex items-center justify-center">
        <svg
          viewBox="0 0 520 740"
          className="w-full h-full drop-shadow-2xl overflow-visible"
        >
          <defs>
            {/* Glowing Golden Route Filter */}
            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Intense Lotus Pulsing Filter */}
            <filter id="lotusGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Linear Gradients */}
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fde68a" />
              <stop offset="35%" stopColor="#f59e0b" />
              <stop offset="75%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>

            <linearGradient id="vimanaGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#fef08a" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Subcontinental Coastline & Geographic Waterway Contours */}
          <g opacity="0.18" stroke="#f3d27a" fill="none" strokeWidth="0.8">
            {/* Peninsula Outline */}
            <path d="M 110,210 Q 90,320 120,410 Q 150,520 220,620 Q 250,650 280,630 Q 340,560 380,480 Q 420,380 430,260" strokeDasharray="3 3" />
            {/* Sri Lanka Island Outline */}
            <ellipse cx="370" cy="675" rx="35" ry="48" stroke="#f3d27a" strokeWidth="1" strokeDasharray="2 2" fill="rgba(245,158,11,0.03)" />
            {/* Sacred Rivers */}
            {/* Ganga River */}
            <path d="M 280,90 Q 360,110 420,135 Q 470,160 500,200" stroke="#60a5fa" strokeWidth="1.2" opacity="0.4" />
            {/* Yamuna River */}
            <path d="M 250,110 Q 340,125 405,145" stroke="#38bdf8" strokeWidth="1" opacity="0.3" />
            {/* Godavari River */}
            <path d="M 120,300 Q 230,290 350,320 Q 420,360 450,380" stroke="#38bdf8" strokeWidth="1" opacity="0.3" />
            {/* Tungabhadra River */}
            <path d="M 160,450 Q 240,460 320,440" stroke="#38bdf8" strokeWidth="0.8" opacity="0.25" />
          </g>

          {/* Ancient Compass Rose (दिग्दर्शन) Top Left */}
          <g transform="translate(65, 75)" opacity="0.55">
            <circle cx="0" cy="0" r="28" stroke="#f3d27a" strokeWidth="0.75" fill="rgba(0,0,0,0.3)" />
            <circle cx="0" cy="0" r="16" stroke="#f3d27a" strokeWidth="0.5" strokeDasharray="1 2" fill="none" />
            {/* 4 Points */}
            <polygon points="0,-26 3,-5 0,-1" fill="#f59e0b" />
            <polygon points="0,-26 -3,-5 0,-1" fill="#fbbf24" />
            <polygon points="0,26 3,5 0,1" fill="#f59e0b" />
            <polygon points="0,26 -3,5 0,1" fill="#fbbf24" />
            <polygon points="26,0 5,3 1,0" fill="#f59e0b" />
            <polygon points="26,0 5,-3 1,0" fill="#fbbf24" />
            <polygon points="-26,0 -5,3 -1,0" fill="#f59e0b" />
            <polygon points="-26,0 -5,-3 -1,0" fill="#fbbf24" />
            {/* Sanskrit Cardinal Markers */}
            <text x="0" y="-31" textAnchor="middle" fill="#fef08a" fontSize="8" fontFamily="Noto Serif Devanagari" fontWeight="bold">उ</text>
            <text x="0" y="38" textAnchor="middle" fill="#a39eb5" fontSize="7" fontFamily="Noto Serif Devanagari">द</text>
            <text x="35" y="3" textAnchor="start" fill="#a39eb5" fontSize="7" fontFamily="Noto Serif Devanagari">पू</text>
            <text x="-35" y="3" textAnchor="end" fill="#a39eb5" fontSize="7" fontFamily="Noto Serif Devanagari">प</text>
          </g>

          {/* Ocean Waves / Samudra Label */}
          <g opacity="0.3" stroke="#38bdf8" strokeWidth="0.75" fill="none">
            <path d="M 180,680 Q 200,670 220,680 T 260,680 T 300,680" />
            <path d="M 210,705 Q 230,695 250,705 T 290,705 T 330,705" />
            <text x="240" y="725" fill="#60a5fa" fontSize="9" fontFamily="Cinzel" letterSpacing="3" opacity="0.7">
              MAHASAMUDRA
            </text>
          </g>

          {/* The Celestial Pushpaka Vimana Arc (Lanka to Ayodhya) */}
          <path
            d={vimanaPathD}
            fill="none"
            stroke="url(#vimanaGrad)"
            strokeWidth="2"
            strokeDasharray="4 4"
            opacity="0.6"
          />
          {/* Pushpaka Label */}
          <text x="445" y="320" fill="#7dd3fc" fontSize="8" fontFamily="Cinzel" letterSpacing="1" opacity="0.8" transform="rotate(78 445 320)">
            ✦ Pushpaka Vimana Skyway ✦
          </text>

          {/* The Sacred Ground Pilgrimage Route (Ayodhya to Lanka) */}
          {/* Base route halo */}
          <path
            d={routePathD}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.15"
            filter="url(#goldGlow)"
          />
          {/* Golden luminous spine */}
          <path
            d={routePathD}
            fill="none"
            stroke="url(#routeGradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#goldGlow)"
          />
          {/* Animated pulsing bead trail */}
          <path
            d={routePathD}
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeDasharray="2 12"
            opacity="0.8"
            className="animate-pulse"
          />

          {/* Ocean Bridge Indicator: Rama Setu */}
          <g transform="translate(315, 630)" opacity="0.85">
            <line x1="0" y1="0" x2="28" y2="22" stroke="#fbbf24" strokeWidth="3" strokeDasharray="3 2" />
            <text x="32" y="12" fill="#fef3c7" fontSize="7.5" fontFamily="Cinzel" fontWeight="600">
              Setu
            </text>
          </g>

          {/* 15 Waypoint Nodes */}
          {MAP_WAYPOINTS.map((pt) => {
            const isSelected = selectedStop === pt.stop;
            const isHovered = hoveredStop === pt.stop;

            return (
              <g
                key={pt.stop}
                transform={`translate(${pt.x}, ${pt.y})`}
                className="cursor-pointer group"
                onClick={() => handleStopClick(pt.stop)}
                onMouseEnter={() => setHoveredStop(pt.stop)}
                onMouseLeave={() => setHoveredStop(null)}
              >
                {/* Generous touch target for effortless mobile tapping */}
                <circle
                  cx="0"
                  cy="0"
                  r="28"
                  fill="transparent"
                  className="cursor-pointer"
                />

                {/* Outer Glow Halo for active or hovered node */}
                {(isSelected || isHovered) && (
                  <>
                    <circle
                      cx="0"
                      cy="0"
                      r="22"
                      fill="rgba(245, 158, 11, 0.25)"
                      className="animate-ping"
                      style={{ animationDuration: '2.5s' }}
                    />
                    <circle
                      cx="0"
                      cy="0"
                      r="15"
                      fill="rgba(245, 158, 11, 0.35)"
                    />
                  </>
                )}

                {/* Base Node Disc */}
                <circle
                  cx="0"
                  cy="0"
                  r={isSelected ? 10 : 7}
                  fill={isSelected ? "#ea580c" : isHovered ? "#d97706" : "#1a1226"}
                  stroke={isSelected ? "#fef08a" : "#fbbf24"}
                  strokeWidth={isSelected ? 2.5 : 1.2}
                  filter={isSelected ? "url(#goldGlow)" : undefined}
                />

                {/* Node Number */}
                <text
                  x="0"
                  y="3"
                  textAnchor="middle"
                  fill={isSelected ? "#ffffff" : "#fef08a"}
                  fontSize={isSelected ? "8.5" : "7"}
                  fontFamily="Cinzel"
                  fontWeight="bold"
                >
                  {pt.stop}
                </text>

                {/* Stop Label text */}
                <g
                  transform={`translate(${pt.x > 320 ? -14 : 14}, 3)`}
                  opacity={isSelected ? 1 : isHovered ? 0.95 : 0.8}
                >
                  <text
                    x="0"
                    y="0"
                    textAnchor={pt.x > 320 ? "end" : "start"}
                    fill={isSelected ? "#fef08a" : "#f3f0e6"}
                    fontSize={isSelected ? "11" : "8.5"}
                    fontFamily="Cinzel"
                    fontWeight={isSelected ? "bold" : "600"}
                    className="transition-all"
                  >
                    {pt.name}
                  </text>
                  <text
                    x="0"
                    y="10"
                    textAnchor={pt.x > 320 ? "end" : "start"}
                    fill={isSelected ? "#fbbf24" : "#f59e0b"}
                    fontSize={isSelected ? "8" : "7"}
                    fontFamily="Noto Serif Devanagari"
                    opacity={isSelected ? 1 : 0.75}
                  >
                    {pt.sanskritName}
                  </text>
                </g>
              </g>
            );
          })}

          {/* ACTIVE LOTUS RUNNER (Glides to the current stop) */}
          <g
            transform={`translate(${currentStopData.x}, ${currentStopData.y})`}
            className="transition-all duration-700 ease-out pointer-events-none"
            filter="url(#lotusGlow)"
          >
            {/* Radiant pulsing halo */}
            <circle cx="0" cy="0" r="16" fill="rgba(251, 191, 36, 0.45)" className="animate-ping" style={{ animationDuration: '2s' }} />
            {/* Sacred Lotus Blossom Icon */}
            <g transform="translate(-10, -10) scale(1)">
              <path
                d="M 10,2 C 7,6 4,11 10,18 C 16,11 13,6 10,2 Z"
                fill="#fef08a"
              />
              <path
                d="M 10,18 C 5,14 1,9 5,4 C 8,9 9,14 10,18 Z"
                fill="#f59e0b"
              />
              <path
                d="M 10,18 C 15,14 19,9 15,4 C 12,9 11,14 10,18 Z"
                fill="#f59e0b"
              />
            </g>
          </g>
        </svg>

        {/* Hovered / Active Tooltip Pill */}
        {hoveredStop && (
          <div className="absolute top-4 left-4 pointer-events-none bg-black/80 backdrop-blur-md border border-amber-400/30 rounded-xl px-3 py-1.5 text-xs shadow-xl animate-fade-in">
            <span className="font-cinzel font-bold text-amber-300">
              {MAP_WAYPOINTS[hoveredStop - 1].name}
            </span>{' '}
            <span className="text-[11px] text-[#a39eb5]">
              ({MAP_WAYPOINTS[hoveredStop - 1].distance})
            </span>
          </div>
        )}
      </div>

      {/* Map Footer Scrubber & Milestones */}
      <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2 flex-wrap justify-between sm:justify-start w-full sm:w-auto">
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[11px] font-semibold">
            Stop {currentStopData.stop} of 15
          </span>
          <span className="text-[#f3f0e6] font-medium font-cinzel text-xs sm:text-sm">
            {currentStopData.name} ({currentStopData.sanskritName})
          </span>
          <span className="text-[#a39eb5] font-mono text-[11px]">
            {currentStopData.distance}
          </span>
        </div>

        {/* Mobile Touch Number Pill Scrubber */}
        <div className="sm:hidden w-full flex items-center justify-between gap-1.5 pt-1">
          <button
            onClick={() => handleStopClick(selectedStop <= 1 ? 15 : selectedStop - 1)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-amber-300 active:scale-90 transition-transform shrink-0"
            aria-label="Previous Stop"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-1 no-scrollbar scroll-smooth">
            {MAP_WAYPOINTS.map(w => (
              <button
                key={w.stop}
                onClick={() => handleStopClick(w.stop)}
                className={`w-7 h-7 rounded-full flex items-center justify-center font-cinzel text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  selectedStop === w.stop
                    ? 'saffron-gradient text-black scale-110 shadow-md shadow-amber-500/40 font-extrabold'
                    : 'bg-white/5 text-[#a39eb5] border border-white/10 hover:border-amber-400/40'
                }`}
                aria-label={`Jump to stop ${w.stop}: ${w.name}`}
              >
                {w.stop}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleStopClick(selectedStop >= 15 ? 1 : selectedStop + 1)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-amber-300 active:scale-90 transition-transform shrink-0"
            aria-label="Next Stop"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Desktop Sleek Scrubber */}
        <div className="hidden sm:flex items-center gap-0.5 sm:gap-1 flex-wrap justify-center">
          {MAP_WAYPOINTS.map(w => (
            <button
              key={w.stop}
              onClick={() => handleStopClick(w.stop)}
              title={`${w.stop}. ${w.name}`}
              aria-label={`Jump to stop ${w.stop}: ${w.name}`}
              className="p-1 cursor-pointer flex items-center justify-center group"
            >
              <span className={`h-2 rounded-full transition-all block ${
                selectedStop === w.stop
                  ? 'w-6 bg-gradient-to-r from-amber-400 to-orange-500 shadow-sm shadow-amber-500/50'
                  : 'w-1.5 bg-white/25 group-hover:bg-white/50'
              }`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
