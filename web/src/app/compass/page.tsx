'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Compass, Sparkles, Volume2, ArrowRight, RotateCcw, 
  Shield, Award, Heart, CheckCircle2 
} from 'lucide-react';
import { playDiyaSpark, playTempleBell, playConchShell, chantVerse } from '@/lib/audio';

interface Archetype {
  id: string;
  name: string;
  sanskritTitle: string;
  title: string;
  motto: string;
  shloka: string;
  meaning: string;
  traits: string[];
  guidance: string;
  icon: string;
  gradient: string;
  glow: string;
}

const archetypes: Record<string, Archetype> = {
  rama: {
    id: 'rama',
    name: "Sri Rama",
    sanskritTitle: "मर्यादापुरुषोत्तमः",
    title: "The Sovereign of Rectitude & Duty",
    motto: "Truth once uttered is unshakeable; righteousness is not negotiable.",
    shloka: "रामो विग्रहवान् धर्मः साधुः सत्यपराक्रमः । राजा सर्वस्य लोकस्य देवानामिव वासवः ॥",
    meaning: "Rama is Dharma personified — virtuous, steadfast in truth, and the rightful sovereign of all realms.",
    traits: ["Principled Duty", "Calm Fortitude", "Universal Compassion", "Self-Restraint"],
    guidance: "Your spirit aligns with Maryada Purushottama. In moments of ambiguity, you do not ask what is pleasurable or expedient, but what is right. Anchor yourself in quiet dignity; duty fulfilled without resentment is your greatest spiritual offering.",
    icon: "🏹",
    gradient: "from-amber-500/25 via-orange-950/30 to-[#0c0817]",
    glow: "rgba(245, 158, 11, 0.35)"
  },
  sita: {
    id: 'sita',
    name: "Mother Sita",
    sanskritTitle: "भूमिजा जानकी",
    title: "The Indomitable Spirit of Grace",
    motto: "Circumstances may strip away all comfort, but none can touch an unblemished soul.",
    shloka: "अनन्या राघवेणाहं भास्करेण प्रभा यथा ।",
    meaning: "I am inseparable from Raghava, just as the blazing radiant light is inseparable from the Sun.",
    traits: ["Supreme Resilience", "Inner Purity", "Fierce Dignity", "Unconditional Love"],
    guidance: "Your archetype is the daughter of Mother Earth. You possess immense emotional endurance and quiet moral power that tyrants cannot fathom. Even in the wilderness or captivity, your integrity remains pure gold.",
    icon: "🪷",
    gradient: "from-emerald-500/25 via-teal-950/30 to-[#0c0817]",
    glow: "rgba(16, 185, 129, 0.35)"
  },
  lakshmana: {
    id: 'lakshmana',
    name: "Lakshmana",
    sanskritTitle: "सौमित्रिः अनघात्मा",
    title: "The Fierce Guardian of Truth",
    motto: "Dharma is not passive; it must be shielded with courage and vigilance.",
    shloka: "अहं तस्यानुजो भ्राता गुणैर्दासमुपागतः । ऋतेऽपि त्वामहं रामं नेहे राज्यं न जीवितम् ॥",
    meaning: "I am his younger brother, bound by his virtues. Without Rama, I desire neither sovereign realm nor mortal breath.",
    traits: ["Protective Valor", "Absolute Loyalty", "Direct Action", "Uncompromising Resolve"],
    guidance: "Your soul resonates with Lakshmana. You possess a fiery heart that refuses to stand idle in the presence of injustice. Channel your passion with discernment; when aligned with higher wisdom, your protective vigilance changes destinies.",
    icon: "⚡",
    gradient: "from-yellow-600/25 via-amber-950/30 to-[#0c0817]",
    glow: "rgba(234, 179, 8, 0.35)"
  },
  hanuman: {
    id: 'hanuman',
    name: "Sri Hanuman",
    sanskritTitle: "महावीरः मारुतात्मजः",
    title: "The Ocean of Devotion & Infinite Strength",
    motto: "When personal ego dissolves into pure service, the impossible becomes effortless.",
    shloka: "यत्र यत्र रघुनाथकीर्तनं तत्र तत्र कृतमस्तकाञ्जलिम् । बाष्पवारिपरिपूर्णलोचनं मारुतिं नमत राक्षसान्तकम् ॥",
    meaning: "Wherever Rama's name is sung, there with bowed head and tears of devotion stands Hanuman, conqueror of all darkness.",
    traits: ["Selfless Service (Seva)", "Immense Courage", "Profound Humility", "Wisdom & Eloquence"],
    guidance: "Your archetype is Maruti. You carry colossal latent strength, but your greatest glory is your humility. When you dedicate your skills to a purpose greater than yourself, obstacles dissolve and mountains can be carried upon your palm.",
    icon: "🌊",
    gradient: "from-orange-500/25 via-red-950/30 to-[#0c0817]",
    glow: "rgba(249, 115, 22, 0.35)"
  },
  bharata: {
    id: 'bharata',
    name: "Bharata",
    sanskritTitle: "धर्मपरायणः त्यागशीलः",
    title: "The Saintly Trustee of Righteousness",
    motto: "Power is not an entitlement to enjoy, but a sacred trust to serve.",
    shloka: "न मे मोघोऽयमभिसन्धिः पादुके मूर्ध्नि धारयन् । वसिष्यामि बहिर्नगर्या जटाचीरधरो मुनिः ॥",
    meaning: "Placing the sacred sandals upon my head, I shall abide outside the gates as an ascetic until the rightful king returns.",
    traits: ["Supreme Renunciation", "Moral Incorruptibility", "Brotherly Devotion", "Stewardship"],
    guidance: "Your archetype is Bharata. You value honor over worldly gain and understand that true nobility is measured by what you are willing to walk away from. You make a flawless trustee and ethical leader.",
    icon: "👣",
    gradient: "from-amber-600/25 via-stone-950/30 to-[#0c0817]",
    glow: "rgba(217, 119, 6, 0.35)"
  },
  vibhishana: {
    id: 'vibhishana',
    name: "Vibhishana",
    sanskritTitle: "सत्त्वनिष्ठः धर्मविद्",
    title: "The Conscience of Discernment",
    motto: "Dharma transcends tribal allegiance and bloodline; walk with the light.",
    shloka: "त्यक्त्वा पुत्रांश्च दारांश्च राघवं शरणं गतः ।",
    meaning: "Relinquishing worldly ties and false loyalties, I have sought supreme refuge in Rama alone.",
    traits: ["Moral Clarity (Viveka)", "Courage of Conviction", "Spiritual Non-conformity", "Sanctuary"],
    guidance: "Your archetype is Vibhishana. You possess the rare courage to speak uncomfortable truths to power and disengage from toxic loyalties. You recognize that staying loyal to truth is the highest loyalty of all.",
    icon: "🕊️",
    gradient: "from-sky-500/25 via-blue-950/30 to-[#0c0817]",
    glow: "rgba(14, 165, 233, 0.35)"
  }
};

const questions = [
  {
    id: 1,
    title: "Dilemma I · Truth & Heart (सत्यं वा स्नेहः)",
    context: "A sacred promise or ethical principle threatens your personal comfort and conflicts with the desires of those you love most. What is your guiding light?",
    options: [
      {
        text: "Honor the vow without bitterness. Personal convenience can never outweigh the sacred integrity of truth.",
        archetype: 'rama'
      },
      {
        text: "Anchor in quiet, indestructible dignity. Outer circumstances may change, but inner purity remains sovereign.",
        archetype: 'sita'
      },
      {
        text: "Fight fiercely for those you love. If an unjust rule brings suffering to the righteous, question and challenge it with bold action.",
        archetype: 'lakshmana'
      },
      {
        text: "Relinquish power and step back. Refuse to profit from circumstances that cost others their rightful joy.",
        archetype: 'bharata'
      }
    ]
  },
  {
    id: 2,
    title: "Dilemma II · The Abyss of Obstacles (शरणम् अशरणे)",
    context: "You stand before an impassable ocean of difficulty where ordinary calculation, resource, and human logic fall short. How do you advance?",
    options: [
      {
        text: "Surrender your ego entirely to the divine cause. When you act purely as an instrument of love, you can leap across any sea.",
        archetype: 'hanuman'
      },
      {
        text: "Have the moral fortitude to break away from groupthink and toxic clan loyalty. Walk into the unknown if that is where truth abides.",
        archetype: 'vibhishana'
      },
      {
        text: "Unite diverse allies, invoke sacred blessings, and build the bridge patiently, stone by floating stone.",
        archetype: 'rama'
      },
      {
        text: "Stand guard vigilantly on the shore without sleeping, dedicating every ounce of life to protect the sanctuary of righteousness.",
        archetype: 'lakshmana'
      }
    ]
  },
  {
    id: 3,
    title: "Dilemma III · The Supreme Legacy (धर्मस्य सारः)",
    context: "When the struggles of life subside and actions are weighed in the scales of eternity, what constitutes a truly noble life?",
    options: [
      {
        text: "Ramarajya: Establishing universal welfare, where the humble are sheltered and governance is a transparent altar of justice.",
        archetype: 'rama'
      },
      {
        text: "Kainkarya: Living in selfless service with folded hands, asking for no reward other than the joy of uplifting others.",
        archetype: 'hanuman'
      },
      {
        text: "Viveka: Having possessed the courage to stand for Dharma when all around were seduced by arrogance and pride.",
        archetype: 'vibhishana'
      },
      {
        text: "Pavitrata: Walking through fire, exile, and sorrow with unbroken grace, leaving a legacy of spiritual fortitude.",
        archetype: 'sita'
      }
    ]
  }
];

export default function CompassPage() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [resultArchetype, setResultArchetype] = useState<Archetype | null>(null);
  const [isChanting, setIsChanting] = useState(false);

  const handleOptionSelect = (archetypeKey: string) => {
    playDiyaSpark();
    const newAnswers = [...selectedAnswers, archetypeKey];
    setSelectedAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate archetype tally
      const counts: Record<string, number> = {};
      newAnswers.forEach(a => {
        counts[a] = (counts[a] || 0) + 1;
      });

      // Find archetype with highest count
      let top = 'rama';
      let maxCount = 0;
      Object.entries(counts).forEach(([k, count]) => {
        if (count > maxCount) {
          maxCount = count;
          top = k;
        }
      });

      const matched = archetypes[top] || archetypes['rama'];
      setResultArchetype(matched);
      playConchShell();
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setSelectedAnswers([]);
    setResultArchetype(null);
    playTempleBell(440);
  };

  const handleChant = () => {
    if (!resultArchetype) return;
    setIsChanting(true);
    chantVerse(resultArchetype.shloka, () => setIsChanting(false));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/25 text-xs text-[#f3d27a] mb-4">
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-sanskrit tracking-wider">॥ धर्मदिक्सूचकम् ॥ The Moral Archetype Matcher</span>
        </div>
        <h1 className="font-cinzel text-3xl sm:text-5xl font-bold text-gold-gradient">
          The Dharma Compass
        </h1>
        <p className="text-sm sm:text-base text-[#a39eb5] mt-3 leading-relaxed font-light">
          Three profound philosophical dilemmas. Discover which sacred archetype of the Valmiki Ramayana 
          mirrors your deepest ethical instinct.
        </p>
      </div>

      {/* QUESTION FLOW */}
      {!resultArchetype ? (
        <div className="manuscript-pothi rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Progress Ribbon */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <span className="text-xs font-semibold text-amber-300 font-cinzel">
              Dilemma {currentStep + 1} of {questions.length}
            </span>
            <div className="flex items-center gap-1.5">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === currentStep
                      ? 'w-8 bg-amber-400'
                      : idx < currentStep
                      ? 'w-3 bg-amber-500/60'
                      : 'w-2 bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Question Title & Context */}
          <div className="mb-8">
            <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-amber-100 mb-3">
              {questions[currentStep].title}
            </h3>
            <p className="text-sm sm:text-base text-[#f5efe6]/90 font-serif italic leading-relaxed p-4 rounded-2xl bg-black/40 border border-amber-400/20">
              &ldquo;{questions[currentStep].context}&rdquo;
            </p>
          </div>

          {/* 4 Interactive Choice Cards */}
          <div className="space-y-3.5">
            {questions[currentStep].options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleOptionSelect(opt.archetype)}
                className="w-full text-left p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-amber-400 hover:bg-amber-500/10 transition-all cursor-pointer group flex items-start gap-4 shadow-sm hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:scale-[1.01]"
              >
                <div className="w-7 h-7 rounded-full bg-white/5 border border-white/15 flex items-center justify-center font-cinzel text-xs text-amber-300 group-hover:bg-amber-400 group-hover:text-black font-bold shrink-0 transition-colors">
                  {String.fromCharCode(65 + i)}
                </div>
                <p className="text-xs sm:text-sm text-[#e0dad0] group-hover:text-white leading-relaxed font-light">
                  {opt.text}
                </p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* REVELATION / ARCHETYPE CARD */
        <div
          className={`rounded-3xl bg-gradient-to-br ${resultArchetype.gradient} border border-amber-400/40 p-6 sm:p-10 shadow-2xl relative overflow-hidden animate-fade-in`}
          style={{ boxShadow: `0 0 60px ${resultArchetype.glow}` }}
        >
          {/* Ambient Aura */}
          <div
            className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl pointer-events-none"
            style={{ background: resultArchetype.glow }}
          />

          <div className="text-center max-w-xl mx-auto mb-8 relative z-10">
            <span className="text-xs font-semibold tracking-widest text-amber-300 uppercase font-cinzel block mb-2">
              Your Dharmic Archetype Revealed
            </span>
            <div className="w-20 h-20 mx-auto rounded-3xl bg-black/50 border border-amber-400/40 flex items-center justify-center text-4xl shadow-inner mb-4">
              {resultArchetype.icon}
            </div>
            <h2 className="font-cinzel text-3xl sm:text-5xl font-bold text-gold-gradient">
              {resultArchetype.name}
            </h2>
            <p className="font-sanskrit text-2xl text-amber-200 mt-1 font-medium">
              {resultArchetype.sanskritTitle}
            </p>
            <p className="text-xs font-mono text-amber-300/90 mt-1 tracking-wider uppercase">
              {resultArchetype.title}
            </p>
          </div>

          {/* Motto Banner */}
          <div className="p-4 rounded-2xl bg-black/50 border border-amber-400/20 text-center mb-8 relative z-10">
            <p className="text-xs sm:text-sm text-[#f5efe6] font-serif italic">
              &ldquo;{resultArchetype.motto}&rdquo;
            </p>
          </div>

          {/* Shloka Invocation */}
          <div className="p-5 sm:p-6 rounded-2xl bg-black/60 border border-amber-400/30 mb-8 relative z-10">
            <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
              <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider">
                Archetypal Invocation
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
            <p className="font-sanskrit text-xl sm:text-2xl text-gold-gradient text-center font-medium leading-relaxed mb-3">
              {resultArchetype.shloka}
            </p>
            <p className="text-xs sm:text-sm text-[#a39eb5] text-center italic font-serif">
              &ldquo;{resultArchetype.meaning}&rdquo;
            </p>
          </div>

          {/* Philosophical Guidance */}
          <div className="mb-8 relative z-10">
            <h4 className="text-xs font-semibold text-amber-300 uppercase tracking-wider font-cinzel mb-2">
              Spiritual Guidance for Your Path
            </h4>
            <p className="text-sm text-[#f5efe6]/90 leading-relaxed font-light">
              {resultArchetype.guidance}
            </p>
          </div>

          {/* Key Dharmic Traits */}
          <div className="mb-8 relative z-10">
            <h4 className="text-xs font-semibold text-amber-300 uppercase tracking-wider font-cinzel mb-3">
              Pillars of Virtue
            </h4>
            <div className="flex flex-wrap gap-2">
              {resultArchetype.traits.map((t, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 border border-amber-400/25 text-amber-200"
                >
                  <CheckCircle2 className="w-3 h-3 text-amber-400" />
                  <span>{t}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10 relative z-10">
            <button
              onClick={resetQuiz}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:border-amber-400/40 text-xs text-[#a39eb5] hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Compass Quiz</span>
            </button>

            <Link
              href="/characters"
              className="w-full sm:w-auto px-8 py-3 rounded-full saffron-gradient text-black font-bold text-xs tracking-wider uppercase shadow-md shadow-amber-500/20 hover:opacity-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Explore All Characters</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
