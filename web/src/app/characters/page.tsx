'use client';

import React, { useState } from 'react';
import { Search, Users, X, BookOpen, Sparkles, ExternalLink } from 'lucide-react';
import charactersData from '@/data/characters.json';

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
}

export default function CharactersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [modalCharacter, setModalCharacter] = useState<Character | null>(null);

  // Extract unique tiers
  const tiers = Array.from(new Set(charactersData.map(c => c.tier.title)));

  const filteredCharacters = (charactersData as Character[]).filter(c => {
    const matchesTier = selectedTier === 'all' || c.tier.title === selectedTier;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesTier;

    const matchesSearch = 
      c.name.toLowerCase().includes(q) ||
      c.sanskritName.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      (c.aliases && c.aliases.some((a: string) => typeof a === 'string' && a.toLowerCase().includes(q))) ||
      c.roleTag.toLowerCase().includes(q);

    return matchesTier && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs tracking-widest text-[#f59e3a] uppercase font-semibold">
          पात्राणि · Dramatis Personae
        </span>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-gold-gradient mt-2">
          Personalities Guide
        </h1>
        <p className="text-sm text-[#a39eb5] mt-3 leading-relaxed">
          An indexed roster of all 194 named personalities across the seven Kandas — heroes, sages, warriors, devas, and villains, each carrying a lesson in dharma.
        </p>
      </div>

      {/* Search Bar & Tier Filter */}
      <div className="max-w-2xl mx-auto mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#f59e3a]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, Sanskrit, alias (e.g. Lakshmana, Anjaneya, जनक)..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#0f0b1c] border border-white/10 text-sm text-[#f3f0e6] placeholder:text-[#a39eb5]/60 focus:outline-none focus:border-amber-400/50 shadow-inner"
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

        {/* Tier Chips */}
        <div className="flex flex-wrap justify-center gap-1.5 overflow-x-auto text-xs pb-2">
          <button
            onClick={() => setSelectedTier('all')}
            className={`px-3 py-1.5 rounded-full transition-all cursor-pointer ${
              selectedTier === 'all'
                ? 'bg-[#f59e3a] text-black font-semibold'
                : 'bg-white/5 hover:bg-white/10 text-[#a39eb5]'
            }`}
          >
            All (194)
          </button>
          {tiers.map(t => (
            <button
              key={t}
              onClick={() => setSelectedTier(t)}
              className={`px-3 py-1.5 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                selectedTier === t
                  ? 'bg-[#f59e3a] text-black font-semibold'
                  : 'bg-white/5 hover:bg-white/10 text-[#a39eb5]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="text-center text-xs text-[#a39eb5] mb-6">
        Showing {filteredCharacters.length} personalities
      </div>

      {/* Characters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCharacters.map(char => (
          <div
            key={char.slug}
            onClick={() => setModalCharacter(char)}
            className="p-5 rounded-2xl bg-[#0f0c1c]/70 hover:bg-[#151026] border border-white/5 hover:border-amber-400/40 transition-all cursor-pointer flex flex-col justify-between group shadow-md"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{char.tier.icon || '🕉️'}</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-semibold bg-white/5 border border-white/10 text-amber-300">
                  {char.roleTag}
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-1">
                <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#f3f0e6] group-hover:text-[#f59e3a] transition-colors">
                  {char.name}
                </h3>
                <span className="font-sanskrit text-xs text-[#f3d27a]/70">
                  {char.sanskritName}
                </span>
              </div>

              <p className="text-xs text-[#a39eb5] line-clamp-3 leading-relaxed mt-2">
                {char.description}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-[#a39eb5]">
              {char.aliases && char.aliases.length > 0 && (
                <div className="truncate mb-1">
                  <span className="text-white/60">Aliases:</span> {char.aliases.join(', ')}
                </div>
              )}
              {char.appearsIn && char.appearsIn.length > 0 && (
                <div className="truncate">
                  <span className="text-white/60">Kandas:</span> {char.appearsIn.join(', ')}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Character Profile Modal */}
      {modalCharacter && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setModalCharacter(null)}
        >
          <div 
            className="relative w-full max-w-2xl rounded-3xl bg-[#110d24] border border-amber-400/30 p-6 sm:p-8 shadow-2xl max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setModalCharacter(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-[#a39eb5] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{modalCharacter.tier.icon}</span>
              <div>
                <span className="text-xs uppercase font-semibold text-[#f59e3a] tracking-wider">
                  {modalCharacter.tier.title} · {modalCharacter.tier.sanskrit}
                </span>
                <span className="ml-2 px-2 py-0.5 rounded text-[10px] bg-white/10 text-amber-200 uppercase">
                  {modalCharacter.roleTag}
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-3 my-3">
              <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-gold-gradient">
                {modalCharacter.name}
              </h2>
              <span className="font-sanskrit text-xl sm:text-2xl text-amber-300/80">
                {modalCharacter.sanskritName}
              </span>
            </div>

            <p className="text-sm text-[#f3f0e6]/90 leading-relaxed mb-6">
              {modalCharacter.description}
            </p>

            {modalCharacter.extendedBio && (
              <div className="my-6 p-4 rounded-2xl bg-black/40 border border-white/5 text-xs sm:text-sm text-[#a39eb5] leading-relaxed space-y-3">
                <div className="text-xs font-semibold text-[#f59e3a] uppercase tracking-wider">
                  Biographical Details & Dharma
                </div>
                {modalCharacter.extendedBio.split('\n\n').map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-white/10">
              {modalCharacter.aliases && modalCharacter.aliases.length > 0 && (
                <div>
                  <span className="font-semibold text-white block mb-1">Also known as:</span>
                  <span className="text-[#a39eb5]">{modalCharacter.aliases.join(', ')}</span>
                </div>
              )}
              {modalCharacter.appearsIn && modalCharacter.appearsIn.length > 0 && (
                <div>
                  <span className="font-semibold text-white block mb-1">Appears across Kandas:</span>
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
