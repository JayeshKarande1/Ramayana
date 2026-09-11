'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, BookOpen, Loader2, ExternalLink } from 'lucide-react';

interface SearchResult {
  shloka_id: string;
  verse_code: string;
  kanda_id: string;
  sarga_number: number;
  shloka_number: number;
  sanskrit: string;
  transliteration: string;
  meaning: string;
  sanskrit_snippet?: string;
  meaning_snippet?: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [kandaFilter, setKandaFilter] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ q: query, limit: '20' });
        if (kandaFilter) params.set('kanda', kandaFilter);
        const res = await fetch(`/api/search?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.results || []);
        }
      } catch (e) {
        console.error('Search fetch failed:', e);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, kandaFilter]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl rounded-2xl bg-[#0f0b1c] border border-[rgba(243,210,122,0.25)] shadow-2xl shadow-amber-950/40 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[rgba(243,210,122,0.15)] flex items-center gap-3 bg-[#151026]">
          <Search className="w-5 h-5 text-[#f59e3a] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search across 21,640 shlokas in Sanskrit or English (e.g. dharma, Hanuman, सत्य)..."
            className="flex-1 bg-transparent text-sm sm:text-base text-[#f3f0e6] placeholder:text-[#a39eb5]/60 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-[#a39eb5] hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={onClose} 
            className="px-2.5 py-1 text-xs rounded-md bg-white/5 border border-white/10 text-[#a39eb5] hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Kanda Filter Chips */}
        <div className="px-4 py-2 bg-[#0d0918] border-b border-white/5 flex items-center gap-2 overflow-x-auto text-xs text-[#a39eb5]">
          <span className="shrink-0">Filter Kanda:</span>
          {['', 'bala', 'ayodhya', 'aranya', 'kishkindha', 'sundara', 'yuddha', 'uttara'].map(k => (
            <button
              key={k}
              onClick={() => setKandaFilter(k)}
              className={`px-2.5 py-1 rounded-full transition-colors whitespace-nowrap capitalize ${
                kandaFilter === k 
                  ? 'bg-[#f59e3a] text-black font-semibold' 
                  : 'bg-white/5 hover:bg-white/10 text-[#f3f0e6]'
              }`}
            >
              {k || 'All Kandas'}
            </button>
          ))}
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center text-[#f59e3a] gap-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xs text-[#a39eb5]">Searching sacred scriptures...</span>
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="py-12 text-center text-[#a39eb5]">
              No matching shlokas found for "{query}". Try a different word or root term.
            </div>
          )}

          {!loading && !query && (
            <div className="py-10 text-center space-y-3">
              <BookOpen className="w-8 h-8 mx-auto text-[#f3d27a]/40" />
              <p className="text-sm text-[#a39eb5]">Instant search across Maharishi Valmiki's complete Sanskrit text & translations</p>
              <div className="flex flex-wrap justify-center gap-2 text-xs">
                {['Dharma', 'Maryada', 'Ocean leap', 'Sita abduction', 'Ravana boon', 'Bharata sandals'].map(suggestion => (
                  <button
                    key={suggestion}
                    onClick={() => setQuery(suggestion)}
                    className="px-3 py-1 rounded-full bg-white/5 hover:bg-amber-500/20 text-[#f3d27a] border border-amber-500/20"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!loading && results.map(item => (
            <Link
              key={item.shloka_id}
              href={`/story/${item.kanda_id}/${item.sarga_number}#shloka-${item.shloka_number}`}
              onClick={onClose}
              className="block p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-[rgba(243,210,122,0.3)] transition-all group"
            >
              <div className="flex items-center justify-between text-xs text-[#f59e3a] mb-1.5">
                <span className="font-semibold uppercase tracking-wider">
                  {item.kanda_id} Kanda · Sarga {item.sarga_number} · Shloka {item.shloka_number}
                </span>
                <span className="font-mono text-[#a39eb5] group-hover:text-white flex items-center gap-1">
                  {item.verse_code} <ExternalLink className="w-3 h-3" />
                </span>
              </div>
              <p className="font-sanskrit text-sm sm:text-base text-[#f3d27a] leading-relaxed mb-1 line-clamp-2">
                {item.sanskrit}
              </p>
              <p 
                className="text-xs sm:text-sm text-[#f3f0e6]/80 leading-relaxed line-clamp-2"
                dangerouslySetInnerHTML={{ __html: item.meaning_snippet || item.meaning }}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
