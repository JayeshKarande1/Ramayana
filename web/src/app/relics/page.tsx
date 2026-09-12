'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, Volume2, ArrowRight, Shield, Flame, 
  ExternalLink, Info, Award, Compass, Search
} from 'lucide-react';
import { chantVerse, playDiyaSpark, playTempleBell } from '@/lib/audio';

interface Relic {
  id: string;
  name: string;
  sanskritName: string;
  category: 'astra' | 'token' | 'relic';
  categoryLabel: string;
  wielder: string;
  origin: string;
  kanda: string;
  sargaLink: string;
  sanskritShloka: string;
  shlokaMeaning: string;
  lore: string;
  divineAttribute: string;
  element: string;
  icon: string;
  gradient: string;
  glowColor: string;
}

const relicsData: Relic[] = [
  {
    id: 'kodanda',
    name: "Kodanda",
    sanskritName: "कोदण्डम्",
    category: 'astra',
    categoryLabel: "Divine Astra · Sacred Bow",
    wielder: "Bhagavan Sri Rama",
    origin: "Consecrated by Sage Agastya & Celestial Gods",
    kanda: "Ayodhya / Aranya / Yuddha Kanda",
    sargaLink: "/story/yuddha/21",
    sanskritShloka: "चापमानय सौमित्रे शरांश्चाशीविषोपमान् । समुद्रं शोषयिष्यामि पद्भ्यां यान्तु प्लवङ्गमाः ॥",
    shlokaMeaning: "Bring my bow, Lakshmana, and venomous arrows like serpents. I shall dry the ocean so the Vanaras may walk across on foot.",
    lore: "The supreme longbow of Bhagavan Rama. Its resonant twang (Jyakara) sent shockwaves through the hearts of tyrannical forces across Bharatavarsha. In the hands of Rama, Kodanda shot with absolute moral rectitude — its arrows never struck the unarmed, the fleeing, or the penitent.",
    divineAttribute: "Absolute Infallibility & Dharmic Precision",
    element: "Fire & Wind (Agni-Vayu)",
    icon: "🏹",
    gradient: "from-amber-600/20 via-orange-950/30 to-amber-950/40",
    glowColor: "rgba(245, 158, 11, 0.35)"
  },
  {
    id: 'pinaka',
    name: "Pinaka",
    sanskritName: "पिनाकः",
    category: 'astra',
    categoryLabel: "Divine Astra · Shiva's Bow",
    wielder: "Lord Shiva · Broken by Sri Rama",
    origin: "Forged by Vishwakarma · Preserved at Janakpur",
    kanda: "Bala Kanda",
    sargaLink: "/story/bala/67",
    sanskritShloka: "बभञ्ज रामो धर्मात्मा मध्ये तद्धनुरुत्तमम् । तस्य शब्दो महानासीन् निर्घातसमनिःस्वनः ॥",
    shlokaMeaning: "The righteous Rama broke that sublime bow in the middle; a colossal roar arose like an apocalyptic thunderbolt.",
    lore: "The titanic bow of Mahadeva Shiva, guarded in the treasury of King Janaka. It was so colossal that five thousand strong warriors were required to roll its eight-wheeled iron chest. Kings from across the earth failed to even budge it. Young Rama bent the bow with effortless poise until it snapped in two, winning the hand of Sita.",
    divineAttribute: "Primordial Shiva Radiance & Destiny's Fulfilment",
    element: "Cosmic Thunder & Ether (Akasha)",
    icon: "⚡",
    gradient: "from-blue-600/20 via-indigo-950/30 to-slate-950/40",
    glowColor: "rgba(96, 165, 250, 0.35)"
  },
  {
    id: 'brahmastra',
    name: "Brahmastra",
    sanskritName: "ब्रह्मास्त्रम्",
    category: 'astra',
    categoryLabel: "Ultimate Cosmic Astra",
    wielder: "Bestowed by Sage Agastya upon Sri Rama",
    origin: "Fashioned by Lord Brahma at creation",
    kanda: "Yuddha Kanda",
    sargaLink: "/story/yuddha/108",
    sanskritShloka: "ततः स बाणं जग्राह रामः सर्पमिव ज्वलत् । ब्रह्मणा निर्मितं पूर्वं सर्वलोकमहाप्रभम् ॥",
    shlokaMeaning: "Then Rama seized the flaming arrow, like a blazing serpent, fashioned anciently by Brahma with universal cosmic brilliance.",
    lore: "The paramount weapon of cosmic dissolution, charged with the Gayatri mantra and the fire of the Sun. Its feathers were wind, its tip the blazing sun, its body Mount Meru. Reserved only as a measure of last resort against invincible evil, Rama released it to pierce Ravana's navel, eradicating adharma and immediately returning purified to Rama's quiver.",
    divineAttribute: "Cosmic Dissolution of Incurable Darkness",
    element: "Brahmic Solar Fire (Tejas)",
    icon: "☄️",
    gradient: "from-red-600/20 via-amber-950/30 to-orange-950/40",
    glowColor: "rgba(239, 68, 68, 0.35)"
  },
  {
    id: 'anguliyaka',
    name: "Rama's Signet Ring",
    sanskritName: "रामाङ्गुलीयकम्",
    category: 'token',
    categoryLabel: "Sacred Token of Devotion",
    wielder: "Carried by Hanuman to Mother Sita",
    origin: "Ayodhya Royal Treasury",
    kanda: "Kishkindha / Sundara Kanda",
    sargaLink: "/story/sundara/36",
    sanskritShloka: "ददौ च तस्य शुभाङ्गुलीयकं रामः स्वनामाङ्कितमप्रमेयम् । अभिज्ञानं मया दत्तं जनकस्य सुताप्रिये ॥",
    shlokaMeaning: "Rama gave to Hanuman his auspicious signet ring engraved with his sacred name: 'A supreme token given by me for the beloved daughter of Janaka.'",
    lore: "A golden ring bearing the sacred name 'राम'. When Sita sat surrounded by demonesses in the Ashok Vatika on the verge of despair, Hanuman dropped this ring into her lap from the branches of the Simshapa tree. Beholding her lord's name, Sita wept tears of joy, recognizing that Rama's love had traversed the uncrossable sea.",
    divineAttribute: "Unshakable Faith & Reassurance of Grace",
    element: "Pure Gold & Devotional Tears",
    icon: "💍",
    gradient: "from-amber-400/25 via-yellow-950/30 to-amber-950/40",
    glowColor: "rgba(251, 191, 36, 0.35)"
  },
  {
    id: 'chudamani',
    name: "Sita's Chudamani",
    sanskritName: "चूडामणिः",
    category: 'token',
    categoryLabel: "Celestial Bridal Hair Jewel",
    wielder: "Presented by Mother Sita to Sri Rama",
    origin: "Gift from King Janaka & Queen Sunayana",
    kanda: "Sundara Kanda",
    sargaLink: "/story/sundara/38",
    sanskritShloka: "मणिं गृहीत्वा हनुमान् रामस्योपनयिष्यति । दृष्ट्वा मणिं स धर्मात्मा स्मरिष्यति पितुर्मम ॥",
    shlokaMeaning: "Hanuman shall bear this crest jewel and present it to Rama; beholding this jewel, the righteous one will recall my father and mother.",
    lore: "The luminous crest jewel worn by Sita in her hair, carefully kept tied into the knot of her worn silk sari throughout ten months of captivity. Entrusted to Hanuman as proof of her unwavering chastity and endurance, it brought Rama to his knees with both sorrow and fierce resolve when placed in his palms.",
    divineAttribute: "Unblemished Purity & Heroic Fidelity",
    element: "Celestial Pearl & Diamond Radiance",
    icon: "💎",
    gradient: "from-emerald-500/20 via-teal-950/30 to-slate-950/40",
    glowColor: "rgba(16, 185, 129, 0.35)"
  },
  {
    id: 'dronagiri',
    name: "Dronagiri & Sanjeevani",
    sanskritName: "सञ्जीवनीशैलः",
    category: 'relic',
    categoryLabel: "Sacred Himalayan Peak of Life",
    wielder: "Uprooted & Carried by Lord Hanuman",
    origin: "Himalayan Rishabha-Kailasha Range",
    kanda: "Yuddha Kanda",
    sargaLink: "/story/yuddha/74",
    sanskritShloka: "उत्पाट्य तं गिरिशृङ्गं नानौषधिविराजितम् । जगाम वेगेनोत्पत्य वायुवेगसमो विभुः ॥",
    shlokaMeaning: "Uprooting that mountain peak radiant with medicinal herbs, the all-powerful Hanuman leapt into the heavens with the speed of the wind.",
    lore: "When Lakshmana lay mortally wounded by Indrajit's spear, royal physician Sushena identified four sacred herbs: Mrita-Sanjeevani (reviver of the dead), Vishalyakarani (arrow remover), Sandhani (bone joiner), and Savarnakarani (skin restorer). Unable to identify them in the dark, Hanuman tore the entire Himalayan crest from the earth and flew through the night, reviving the army with its fragrance alone.",
    divineAttribute: "Conquest of Mortality & Omnipotent Service",
    element: "Himalayan Prana & Sacred Flora",
    icon: "🏔️",
    gradient: "from-teal-600/20 via-emerald-950/30 to-green-950/40",
    glowColor: "rgba(20, 184, 166, 0.35)"
  },
  {
    id: 'pushpaka',
    name: "Pushpaka Vimana",
    sanskritName: "पुष्पकविमानम्",
    category: 'relic',
    categoryLabel: "Celestial Chariot of the Sky",
    wielder: "Created by Brahma · Commanded by Sri Rama",
    origin: "Forged by Vishwakarma for Kubera",
    kanda: "Yuddha / Uttara Kanda",
    sargaLink: "/story/yuddha/123",
    sanskritShloka: "मनसा समं वेगं वहन्तीं कामरूपिणीम् । पुष्पकाख्यां समासाद्य प्रयाताः सोदरास्तदा ॥",
    shlokaMeaning: "Ascending that celestial Pushpaka capable of shapeshifting and flying at the speed of thought, the brothers journeyed forward.",
    lore: "The divine aerial chariot fashioned by Vishwakarma for Brahma, later usurped by Ravana from Kubera. Capable of soaring through the heavens at the speed of thought, its interior expanded infinitely to seat any number of devotees with supreme comfort. Upon Ravana's defeat, it reverently carried Rama, Sita, Lakshmana, and the Vanara army back to Ayodhya.",
    divineAttribute: "Speed of Consciousness & Universal Hospitality",
    element: "Celestial Ether & Thought",
    icon: "✨",
    gradient: "from-purple-600/20 via-amber-950/30 to-indigo-950/40",
    glowColor: "rgba(168, 85, 247, 0.35)"
  }
];

export default function RelicsPage() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'astra' | 'token' | 'relic'>('all');
  const [activeRelic, setActiveRelic] = useState<Relic>(relicsData[0]);
  const [isChanting, setIsChanting] = useState(false);

  const filtered = selectedFilter === 'all' 
    ? relicsData 
    : relicsData.filter(r => r.category === selectedFilter);

  const handleCardClick = (relic: Relic) => {
    setActiveRelic(relic);
    playDiyaSpark();
  };

  const handleChant = () => {
    setIsChanting(true);
    chantVerse(activeRelic.sanskritShloka, () => setIsChanting(false));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/25 text-xs text-[#f3d27a] mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-sanskrit tracking-wider">॥ दिव्यास्त्राणि पावनचिह्नानि च ॥ The Sacred Treasury</span>
        </div>
        <h1 className="font-cinzel text-3xl sm:text-5xl md:text-6xl font-bold text-gold-gradient">
          The Divine Arsenal & Relics
        </h1>
        <p className="text-sm sm:text-base text-[#a39eb5] mt-3 leading-relaxed font-light">
          Explore the celestial weapons, immortal crests, and tokens of infinite devotion that turned 
          the cosmic tides of the Valmiki Ramayana.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          {[
            { id: 'all', label: 'All 7 Sacred Relics' },
            { id: 'astra', label: '🏹 Divine Astras (Weapons)' },
            { id: 'token', label: '💍 Tokens of Devotion' },
            { id: 'relic', label: '🏔️ Cosmic Relics & Vehicles' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => {
                setSelectedFilter(f.id as any);
                playDiyaSpark();
              }}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                selectedFilter === f.id
                  ? 'saffron-gradient text-black shadow-md shadow-amber-500/25 scale-105'
                  : 'bg-white/5 border border-white/10 text-[#a39eb5] hover:text-white'
              }`}
            >
              <span>{f.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Altar Layout: Left Grid of Relic Cards, Right Focused Altar Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (5 cols): Interactive Relic Racks */}
        <div className="lg:col-span-5 space-y-3">
          {filtered.map(r => {
            const isSelected = activeRelic.id === r.id;
            return (
              <div
                key={r.id}
                onClick={() => handleCardClick(r)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${
                  isSelected
                    ? `bg-gradient-to-r ${r.gradient} border-amber-400 shadow-xl scale-[1.02]`
                    : 'bg-white/[0.02] border-white/5 hover:border-amber-400/30 hover:bg-white/[0.05]'
                }`}
                style={isSelected ? { boxShadow: `0 0 25px ${r.glowColor}` } : undefined}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-transform ${
                    isSelected ? 'scale-110 bg-amber-500/20 border border-amber-400/40' : 'bg-white/5'
                  }`}>
                    {r.icon}
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <h4 className={`text-base font-bold font-cinzel ${isSelected ? 'text-amber-300' : 'text-[#f5efe6]'}`}>
                        {r.name}
                      </h4>
                      <span className="font-sanskrit text-xs text-amber-200/70">
                        {r.sanskritName}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#a39eb5] mt-0.5 line-clamp-1">
                      {r.categoryLabel}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] uppercase font-mono text-amber-400 block font-semibold">
                    {r.element.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-[#a39eb5] font-mono">
                    {r.kanda.split(' ')[0]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column (7 cols): The Consecrated Relic Sanctum Stage */}
        <div className="lg:col-span-7 sticky top-24">
          <div
            className={`rounded-3xl bg-gradient-to-br ${activeRelic.gradient} via-[#0c0817] to-[#06040e] border border-amber-400/30 p-6 sm:p-9 shadow-2xl relative overflow-hidden transition-all duration-500`}
            style={{ boxShadow: `0 0 50px ${activeRelic.glowColor}` }}
          >
            {/* Ambient Background Aura */}
            <div
              className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-colors duration-700"
              style={{ background: activeRelic.glowColor }}
            />

            {/* Stage Header Tags */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 relative z-10">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 font-cinzel">
                {activeRelic.categoryLabel}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs bg-white/5 border border-white/10 text-[#a39eb5]">
                {activeRelic.kanda}
              </span>
            </div>

            {/* Relic Title */}
            <div className="flex items-center gap-4 mb-3 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-black/40 border border-amber-400/30 flex items-center justify-center text-3xl shadow-inner">
                {activeRelic.icon}
              </div>
              <div>
                <h2 className="font-cinzel text-3xl sm:text-4xl font-bold text-gold-gradient">
                  {activeRelic.name}
                </h2>
                <p className="font-sanskrit text-xl text-amber-300/90 font-medium">
                  {activeRelic.sanskritName}
                </p>
              </div>
            </div>

            {/* Sacred Origin & Element Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-black/50 border border-white/5 text-xs font-mono text-[#a39eb5] mb-6 relative z-10">
              <div>
                <span className="text-[10px] text-amber-400/80 block uppercase">Wielder</span>
                <span className="text-white font-semibold">{activeRelic.wielder}</span>
              </div>
              <div>
                <span className="text-[10px] text-amber-400/80 block uppercase">Cosmic Element</span>
                <span className="text-amber-200">{activeRelic.element}</span>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-[10px] text-amber-400/80 block uppercase">Divine Attribute</span>
                <span className="text-amber-300 line-clamp-1">{activeRelic.divineAttribute}</span>
              </div>
            </div>

            {/* Sacred Shloka Card */}
            <div className="p-5 rounded-2xl bg-black/60 border border-amber-400/20 mb-6 relative z-10">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
                <span className="text-[11px] font-mono text-amber-400/80">
                  Scripture Invocation
                </span>
                <button
                  onClick={handleChant}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium cursor-pointer transition-all ${
                    isChanting
                      ? 'bg-amber-500/30 text-amber-300 border border-amber-500/50 animate-pulse'
                      : 'bg-white/5 border border-white/10 text-[#a39eb5] hover:text-white'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isChanting ? 'Chanting...' : 'Listen Shloka'}</span>
                </button>
              </div>

              <p className="font-sanskrit text-lg sm:text-xl text-gold-gradient font-medium leading-relaxed mb-3">
                {activeRelic.sanskritShloka}
              </p>
              <p className="text-xs sm:text-sm text-[#a39eb5] italic font-serif leading-relaxed">
                &ldquo;{activeRelic.shlokaMeaning}&rdquo;
              </p>
            </div>

            {/* Narrative Lore */}
            <div className="mb-6 relative z-10">
              <h3 className="text-xs font-semibold text-amber-300 uppercase tracking-wider font-cinzel mb-2">
                Sacred Lore & Significance
              </h3>
              <p className="text-sm text-[#f5efe6]/90 leading-relaxed font-light">
                {activeRelic.lore}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10 relative z-10">
              <Link
                href={activeRelic.sargaLink}
                className="flex-1 py-3 px-6 rounded-full saffron-gradient text-black font-bold text-xs tracking-wider uppercase text-center shadow-lg shadow-amber-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Read Scripture Chapter</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={() => playTempleBell(440)}
                className="py-3 px-5 rounded-full bg-white/5 border border-white/10 hover:border-amber-400/40 text-xs text-amber-200 transition-all flex items-center gap-2 cursor-pointer"
                title="Ring Sanctum Bell"
              >
                <span>Ring Bell</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
