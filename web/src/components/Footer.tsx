import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-[#050309] border-t border-[rgba(243,210,122,0.1)] text-[#a39eb5] text-sm pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Column */}
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-amber-800 p-[2px]">
              <div className="w-full h-full rounded-full bg-[#0d091a] flex items-center justify-center">
                <span className="font-sanskrit text-xs font-bold text-amber-200">श्रीराम</span>
              </div>
            </div>
            <div>
              <span className="font-cinzel text-lg font-bold text-gold-gradient block">RAMAYANA</span>
              <span className="font-sanskrit text-[10px] text-[#f3d27a]/60">रामायणम्</span>
            </div>
          </Link>
          <p className="text-xs text-[#a39eb5]/80 leading-relaxed max-w-xs">
            A free, open digital archive of Maharishi Valmiki&apos;s Sanskrit epic. 21,640+ shlokas across 7 Kandas with word-by-word meanings and prose translations.
          </p>
          <div className="pt-2 font-sanskrit text-[#f3d27a] text-sm">
            लोकाः समस्ताः सुखिनो भवन्तु
          </div>
        </div>

        {/* The 7 Kandas */}
        <div>
          <h4 className="font-cinzel text-sm font-semibold text-[#f3f0e6] mb-4">The Seven Kandas</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/story/bala" className="hover:text-[#f59e3a] transition-colors">I. Bala Kanda (The Beginning)</Link></li>
            <li><Link href="/story/ayodhya" className="hover:text-[#f59e3a] transition-colors">II. Ayodhya Kanda (The Exile)</Link></li>
            <li><Link href="/story/aranya" className="hover:text-[#f59e3a] transition-colors">III. Aranya Kanda (The Forest)</Link></li>
            <li><Link href="/story/kishkindha" className="hover:text-[#f59e3a] transition-colors">IV. Kishkindha Kanda (The Alliance)</Link></li>
            <li><Link href="/story/sundara" className="hover:text-[#f59e3a] transition-colors">V. Sundara Kanda (The Beautiful)</Link></li>
            <li><Link href="/story/yuddha" className="hover:text-[#f59e3a] transition-colors">VI. Yuddha Kanda (The War)</Link></li>
            <li><Link href="/story/uttara" className="hover:text-[#f59e3a] transition-colors">VII. Uttara Kanda (The Legacy)</Link></li>
          </ul>
        </div>

        {/* Explorations */}
        <div>
          <h4 className="font-cinzel text-sm font-semibold text-[#f3f0e6] mb-4">Sacred Exploration</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/journey" className="hover:text-[#f59e3a] transition-colors">Rama Yatra · 14-Year Sacred Journey</Link></li>
            <li><Link href="/relics" className="hover:text-[#f59e3a] transition-colors">Divyastra · Sacred Relics &amp; Arsenal</Link></li>
            <li><Link href="/compass" className="hover:text-[#f59e3a] transition-colors">Dharma Niti · Moral Compass &amp; Dilemmas</Link></li>
            <li><Link href="/pradakshina" className="hover:text-[#f59e3a] transition-colors">Mandir Parikrama · 108 Sacred Names</Link></li>
            <li><Link href="/characters" className="hover:text-[#f59e3a] transition-colors">Charitra · Personalities &amp; Lineages</Link></li>
            <li><Link href="/parayana" className="hover:text-[#f59e3a] transition-colors">Nitya Parayana · 7-Day Recital Regimen</Link></li>
            <li><Link href="/story" className="hover:text-[#f59e3a] transition-colors">Mula Samhita · All 648 Sargas Browser</Link></li>
          </ul>
        </div>

        {/* Scripture Stats */}
        <div>
          <h4 className="font-cinzel text-sm font-semibold text-[#f3f0e6] mb-4">Scripture Preserved</h4>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="font-cinzel text-lg font-bold text-[#f3d27a]">21,640+</div>
              <div className="text-[10px] text-[#a39eb5]">Sanskrit Shlokas</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="font-cinzel text-lg font-bold text-[#f3d27a]">648</div>
              <div className="text-[10px] text-[#a39eb5]">Sargas</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="font-cinzel text-lg font-bold text-[#f3d27a]">194</div>
              <div className="text-[10px] text-[#a39eb5]">Personalities</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="font-cinzel text-lg font-bold text-[#f3d27a]">15</div>
              <div className="text-[10px] text-[#a39eb5]">Sacred Stops</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-[#a39eb5]/60 gap-4">
        <div>© Valmiki Ramayana Archive · Dedicated to Bhagavan Sri Rama 🙏</div>
        <div className="font-sanskrit text-[#f3d27a]/80 font-medium">॥ जय श्री राम ॥</div>
      </div>
    </footer>
  );
}
