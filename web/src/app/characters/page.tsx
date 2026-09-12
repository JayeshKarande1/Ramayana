'use client';

import React, { useState } from 'react';
import { 
  Search, Users, X, BookOpen, Sparkles, Crown, 
  Flame, Shield, Mountain, Sun, Volume2, ArrowRight
} from 'lucide-react';
import charactersData from '@/data/characters.json';
import { chantVerse } from '@/lib/audio';

interface Character {
  slug: string;
  name: string;
  sanskritName: string;
  tier: {
    title: string;
    sanskrit: string;
    icon: string;
  };
  roleTag: string;
  description: string;
  aliases: string[];
  appearsIn: string[];
  hasFullProfile: boolean;
  extendedBio?: string;
  imageUrl?: string;
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const getImageUrl = (url?: string) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (basePath && url.startsWith(basePath)) return url;
  return `${basePath}${url}`;
};

const grandFactions = [
  { 
    id: 'all', 
    name: 'All 194 Figures', 
    sanskrit: 'सर्वे पात्राणि',
    icon: Sparkles,
    desc: 'The complete dramatis personae of the Valmiki Ramayana.' 
  },
  { 
    id: 'solar', 
    name: 'The Solar Dynasty', 
    sanskrit: 'रघुवंशः · अयोध्या',
    icon: Sun,
    desc: 'The scions and royal house of Ayodhya: Rama, Sita, Lakshmana, Bharata, and Dasharatha.',
    tiers: ['The Divine Couple', 'Brothers & Param Bhakta', 'Royal Parents & In-Laws', 'Ikshvaku Lineage & Kings', 'Faithful Allies of Rama']
  },
  { 
    id: 'vanara', 
    name: 'The Vanara Empire', 
    sanskrit: 'वानरसेना · किष्किन्धा',
    icon: Mountain,
    desc: 'The heroes and chieftains of Kishkindha: Hanuman, Sugriva, Vali, Angada, and Jambavan.',
    tiers: ['Vanaras & Rikshas', 'Faithful Allies of Rama']
  },
  { 
    id: 'lanka', 
    name: 'The Asura Citadel', 
    sanskrit: 'राक्षसकुलम् · लङ्का',
    icon: Shield,
    desc: 'The warriors, royalty, and sorcerers of Lanka: Ravana, Indrajit, Kumbhakarna, and Vibhishana.',
    tiers: ["Ravana's House", 'Other Rakshasas']
  },
  { 
    id: 'sages', 
    name: 'Rishis & Celestials', 
    sanskrit: 'ऋषयः · देवाश्च',
    icon: Flame,
    desc: 'The spiritual preceptors, seers, gods, and cosmic guardians of the three worlds.',
    tiers: ['Kula Gurus & Maharshis', 'Rishis & Sages', 'Devas — Cosmic Powers', 'Other Beings']
  }
];

export default function CharactersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaction, setActiveFaction] = useState<string>('all');
  const [modalCharacter, setModalCharacter] = useState<Character | null>(null);
  const [isPlayingQuote, setIsPlayingQuote] = useState(false);

  const selectedFactionData = grandFactions.find(f => f.id === activeFaction) || grandFactions[0];

  const filteredCharacters = (charactersData as Character[]).filter(c => {
    // Check faction
    let matchesFaction = activeFaction === 'all';
    if (!matchesFaction && selectedFactionData.tiers) {
      if (activeFaction === 'vanara') {
        const vanaraSlugs = ['hanuman', 'sugriva', 'vali', 'angada-son-of-vali', 'jambavan', 'tara', 'ruma', 'nila', 'nala', 'kesari', 'sushena', 'panasa', 'mainda', 'dvivida', 'sharabha'];
        matchesFaction = c.tier.title === 'Vanaras & Rikshas' || vanaraSlugs.includes(c.slug);
      } else if (activeFaction === 'solar') {
        const nonSolarAllies = ['hanuman', 'sugriva', 'vali', 'angada-son-of-vali', 'jambavan', 'tara', 'ruma', 'nila', 'nala', 'kesari', 'sushena', 'vibhishana'];
        matchesFaction = selectedFactionData.tiers.includes(c.tier.title) && !nonSolarAllies.includes(c.slug);
      } else {
        matchesFaction = selectedFactionData.tiers.includes(c.tier.title);
      }
    }

    // Check search query
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesFaction;

    const matchesSearch = 
      c.name.toLowerCase().includes(q) ||
      c.sanskritName.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      (c.aliases && c.aliases.some((a: string) => typeof a === 'string' && a.toLowerCase().includes(q))) ||
      c.roleTag.toLowerCase().includes(q) ||
      c.tier.title.toLowerCase().includes(q);

    return matchesFaction && matchesSearch;
  });

  const handleChantName = (name: string) => {
    setIsPlayingQuote(true);
    chantVerse(name, () => setIsPlayingQuote(false));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/25 text-xs text-[#f3d27a] mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-sanskrit tracking-wider">॥ रामायणपात्राणि ॥ १९४ धर्ममूर्तयः</span>
        </div>
        <h1 className="font-cinzel text-3xl sm:text-5xl md:text-6xl font-bold text-gold-gradient">
          Dharma Alliances & Figures
        </h1>
        <p className="text-sm sm:text-base text-[#a39eb5] mt-3 leading-relaxed font-light">
          Traverse the moral tapestry of 194 named figures across five grand dynasties. 
          Discover their lineages, pivotal decisions, and enduring lessons in righteousness.
        </p>
      </div>

      {/* Grand Factions Switcher Banners */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        {grandFactions.map(faction => {
          const Icon = faction.icon;
          const isSelected = activeFaction === faction.id;

          return (
            <button
              key={faction.id}
              onClick={() => setActiveFaction(faction.id)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-b from-amber-500/20 to-orange-950/40 border-amber-400 ring-1 ring-amber-400/50 shadow-lg scale-[1.02]'
                  : 'bg-[#0f0b1c]/80 border-white/5 hover:border-amber-400/30 hover:bg-[#151026]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-amber-300' : 'text-amber-400/70'}`} />
                  <span className="font-sanskrit text-[10px] text-amber-300/60">{faction.sanskrit.split(' ')[0]}</span>
                </div>
                <h3 className={`font-cinzel text-xs sm:text-sm font-bold ${isSelected ? 'text-amber-200' : 'text-[#f5efe6]'}`}>
                  {faction.name}
                </h3>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search Input Bar */}
      <div className="max-w-2xl mx-auto mb-10">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search figure by name, Sanskrit, or alias (e.g. Lakshmana, Anjaneya, जनक, रावण)..."
            className="w-full pl-11 pr-10 py-3.5 rounded-full bg-[#0e0a1b] border border-amber-400/20 text-xs sm:text-sm text-[#f5efe6] placeholder:text-[#a39eb5]/50 focus:outline-none focus:border-amber-400/60 shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a39eb5] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex justify-between items-center text-xs text-[#a39eb5] mt-3 px-2">
          <span>Displaying <strong>{filteredCharacters.length}</strong> figures in {selectedFactionData.name}</span>
          {activeFaction !== 'all' && (
            <button 
              onClick={() => setActiveFaction('all')}
              className="text-amber-400 hover:underline font-medium"
            >
              View all 194 figures
            </button>
          )}
        </div>
      </div>

      {/* Characters Constellation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCharacters.map(char => (
          <div
            key={char.slug}
            onClick={() => setModalCharacter(char)}
            className="manuscript-pothi rounded-2xl border border-amber-400/20 hover:border-amber-400/60 transition-all duration-300 cursor-pointer flex flex-col justify-between group shadow-lg hover:-translate-y-1 overflow-hidden"
          >
            {/* Authentic Portrait Image Banner */}
            {char.imageUrl ? (
              <div className="relative w-full h-48 sm:h-52 overflow-hidden bg-black/50 border-b border-amber-400/20">
                <img
                  src={getImageUrl(char.imageUrl)}
                  alt={char.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0a1b] via-transparent to-black/30" />
                
                {/* Floating Badges on Image */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-black/70 backdrop-blur-md border border-amber-400/30 flex items-center justify-center text-sm shadow-md">
                    {char.tier.icon || '🕉️'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-black/80 backdrop-blur-md border border-amber-400/40 text-amber-300 font-cinzel shadow-md">
                    {char.roleTag}
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-5 pb-0 flex items-center justify-between">
                <span className="text-xl sm:text-2xl">{char.tier.icon || '🕉️'}</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 border border-amber-500/25 text-amber-300 font-cinzel">
                  {char.roleTag}
                </span>
              </div>
            )}

            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
              <div>
                {/* Names */}
                <div className="flex items-baseline gap-2 mb-1">
                  <h4 className="font-cinzel text-base sm:text-lg font-bold text-[#f5efe6] group-hover:text-amber-300 transition-colors">
                    {char.name}
                  </h4>
                  <span className="font-sanskrit text-xs text-[#f3d27a]/70 font-medium">
                    {char.sanskritName}
                  </span>
                </div>

                <div className="text-[11px] text-amber-400/80 font-medium mb-2 font-cinzel">
                  {char.tier.title}
                </div>

                {/* Description */}
                <p className="text-xs text-[#a39eb5] line-clamp-3 leading-relaxed font-light">
                  {char.description}
                </p>
              </div>

              {/* Footer Meta */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-[#a39eb5]">
                <div className="truncate max-w-[180px]">
                  {char.appearsIn && char.appearsIn.length > 0 ? (
                    <span>{char.appearsIn.join(', ')}</span>
                  ) : (
                    <span>Valmiki Ramayana</span>
                  )}
                </div>
                <span className="text-amber-400 group-hover:translate-x-1 transition-transform font-medium flex items-center gap-1">
                  <span>Dossier</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Character Profile Modal Dossier */}
      {modalCharacter && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setModalCharacter(null)}
        >
          <div 
            className="relative w-full max-w-2xl rounded-3xl manuscript-pothi p-5 sm:p-9 shadow-2xl max-h-[88vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setModalCharacter(null)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-[#a39eb5] hover:text-white z-10 transition-all cursor-pointer"
              aria-label="Close character modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Character Portrait Hero */}
            {modalCharacter.imageUrl && (
              <div className="relative w-full h-48 sm:h-72 rounded-2xl overflow-hidden mb-6 border border-amber-400/30 shadow-2xl bg-black/60">
                <img
                  src={getImageUrl(modalCharacter.imageUrl)}
                  alt={modalCharacter.name}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0a1b] via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <span className="text-[11px] text-amber-300 font-cinzel uppercase tracking-widest bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-amber-400/30">
                    Classical Sacred Masterpiece
                  </span>
                </div>
              </div>
            )}

            {/* Modal Header */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 pr-8">
              <span className="text-3xl sm:text-4xl">{modalCharacter.tier.icon}</span>
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs uppercase font-semibold text-[#f59e3a] tracking-wider font-cinzel">
                  {modalCharacter.tier.title} · {modalCharacter.tier.sanskrit}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-amber-500/15 border border-amber-400/30 text-amber-300 uppercase font-semibold">
                  {modalCharacter.roleTag}
                </span>
              </div>
            </div>

            {/* Title & Sanskrit Audio Button */}
            <div className="flex flex-wrap items-center justify-between gap-3 my-3">
              <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
                <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-gold-gradient break-words">
                  {modalCharacter.name}
                </h2>
                <span className="font-sanskrit text-xl sm:text-3xl text-amber-200">
                  {modalCharacter.sanskritName}
                </span>
              </div>

              <button
                onClick={() => handleChantName(`${modalCharacter.name}. ${modalCharacter.sanskritName}`)}
                className={`p-2.5 rounded-full border text-xs cursor-pointer transition-all ${
                  isPlayingQuote
                    ? 'bg-amber-500 text-black border-amber-400 animate-pulse'
                    : 'bg-white/5 border-white/10 text-amber-300 hover:text-white'
                }`}
                title="Pronounce Name"
              >
                <Volume2 className="w-4 h-4 text-amber-400" />
              </button>
            </div>

            {/* Short Description */}
            <p className="text-sm sm:text-base text-[#f5efe6]/90 leading-relaxed mb-6 font-light">
              {modalCharacter.description}
            </p>

            {/* Extended Biography */}
            {modalCharacter.extendedBio && (
              <div className="my-6 p-5 rounded-2xl bg-black/50 border border-amber-400/20 text-xs sm:text-sm text-[#a39eb5] leading-relaxed space-y-3 font-light">
                <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider font-cinzel">
                  ॥ धर्मवृत्तान्तः · Narrative Role & Dharma ॥
                </div>
                {modalCharacter.extendedBio.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            )}

            {/* Aliases & Kandas Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-white/10">
              {modalCharacter.aliases && modalCharacter.aliases.length > 0 && (
                <div>
                  <span className="font-semibold text-amber-300 block mb-1 font-cinzel">Also known as:</span>
                  <span className="text-[#a39eb5]">{modalCharacter.aliases.join(', ')}</span>
                </div>
              )}
              {modalCharacter.appearsIn && modalCharacter.appearsIn.length > 0 && (
                <div>
                  <span className="font-semibold text-amber-300 block mb-1 font-cinzel">Appears across Kandas:</span>
                  <span className="text-[#a39eb5]">{modalCharacter.appearsIn.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
