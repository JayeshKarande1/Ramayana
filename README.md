# 🪔 Valmiki Ramayana (श्रीमद्वाल्मीकीय रामायणम्)

> A modern digital archive and exploration platform for Maharishi Valmiki's complete Sanskrit epic — 21,640+ shlokas, 648 sargas, 194 personalities, interactive 14-year exile map, and 108 names pradakshina.

[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%20v4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![SQLite FTS5](https://img.shields.io/badge/SQLite-FTS5-003B57?style=flat-square&logo=sqlite)](https://sqlite.org/)
[![License](https://img.shields.io/badge/License-MIT-amber?style=flat-square)](LICENSE)

---

## 🌟 Key Features

### 📖 1. The Complete Scripture (7 Kandas · 648 Sargas · 21,640+ Verses)
* **High-Fidelity Typography**: Original Sanskrit in authentic Devanagari alongside academic IAST Roman transliteration.
* **Granular Vocabulary**: Word-by-word Anvaya / Padaccheda breakdowns for Sanskrit learners and scholars.
* **Prose Translations**: Clear, faithful English translations for every shloka.
* **Three Dedicated Reading Perspectives**:
  - **Study Mode**: Devanagari + IAST + Word-by-word accordion + English translation.
  - **Chanting / Darshan Mode**: Large Sanskrit typography, distraction-free, auto-scroll.
  - **Bilingual Mode**: Side-by-side view.
* **Multi-Script Transliteration**: Instant client-side conversion into **Devanagari, Roman (IAST), Telugu, Tamil, Kannada, Bengali, and Malayalam**.

### 🎧 2. Functional Audio & Temple Atmosphere
* **Sanskrit Verse Chanting**: Listen to individual verses or enable **Continuous Sarga Autoplay** via Web Speech synthesis.
* **Ambient Tanpura Drone**: Built-in Web Audio drone generator tuned to traditional temple harmonics (`Sa-Pa`) accessible from the top navigation bar.

### 🗺️ 3. Rama's 14-Year Journey Map
* Interactive route explorer tracing 3,000+ km across **15 sacred geographic stops** from Ayodhya to Lanka:
  - *Ayodhya → Shringaverapura → Prayag → Chitrakoot → Dandakaranya → Panchavati → Lepakshi → Shabari Ashram → Kishkindha → Rishyamukha → Southern Coast → Rameshwaram → Rama Setu → Ashok Vatika → Lanka*.
* Includes modern locations, precise GPS coordinates, narrative events, tags, and featured shlokas.

### 🪔 4. Pradakshina · 108 Sacred Names
* Complete **Śrī Rāma Aṣṭottara Śatanāmāvalī** with Devanagari, IAST transliteration, and English meanings.
* Interactive **Diya Lighting Parikrama**: Tap each diya as you chant, track your progress, listen to audio pronunciations, and celebrate completing the 108-round parikrama.

### 👥 5. Personalities Guide (194 Figures)
* Complete roster of 194 named figures classified across 12 spiritual and social tiers (*Divine Couple, Brothers, Royal Parents, Gurus, Devas, Rishis, Allies, Kings, Vanaras, Ravana's House, Rakshasas, Others*).
* Instant filtering by role, aliases, and appearances across Kandas with biographical modals.

### 📅 6. Sundara Kanda Parayana Sadhana Tracker
* Traditional **7-Day Saptaha Parayana Schedule** dividing the 68 sargas of Sundara Kanda across 7 days.
* Daily checklist, progress tracking, and direct chapter jumpers.

### ⚡ 7. Instant Search & Multi-Target Deployment
* **Client-Side Static Search & SQLite FTS5**: Global search modal (`Ctrl+K` / `⌘K`) querying indexed verses in both Sanskrit, IAST Roman transliteration, and English meanings.
* **100% Static HTML Export (`output: 'export'`)**: Fully exportable for GitHub Pages, Cloudflare Pages, or any static host with automated GitHub Actions CI/CD.

---

## 🏛️ Repository Architecture

```text
├── deploy/
│   └── github-pages.yml          # GitHub Pages automated deployment workflow
├── data/
│   ├── kandas.json               # Metadata for all 7 Kandas
│   ├── characters.json           # 194 Personalities with roles, aliases & bios
│   ├── journey.json              # 15 Sacred stops with GPS coordinates
│   ├── pradakshina.json          # 108 Sacred names of Sri Rama
│   ├── ramayana.db               # SQLite database with FTS5 virtual table
│   └── sargas/                   # 648 Individual Sarga JSON files
├── scraper/
│   ├── scrape_sargas.py          # Multithreaded concurrent sarga scraper
│   ├── scrape_characters.py      # Character roster & profile extractor
│   ├── scrape_journey.py         # 15 stops journey map extractor
│   ├── scrape_pradakshina.py     # 108 names extractor
│   ├── generate_search_index.py  # Fast static search index generator
│   ├── build_sqlite.py           # SQLite database & FTS5 search compiler
│   ├── verify_data.py            # Comprehensive dataset audit
│   └── test_web.py               # Web endpoint integration test suite
└── web/                          # Next.js Full-Stack & Static Export Web App
    ├── public/
    │   ├── .nojekyll             # GitHub Pages bypass Jekyll marker
    │   └── search_index.json     # Client-side instant search index
    ├── src/
    │   ├── app/
    │   │   ├── page.tsx          # Living sanctum homepage & 7 turning points
    │   │   ├── layout.tsx        # Global layout with particles & audio
    │   │   ├── story/            # Living Scripture Codex (all 648 sargas)
    │   │   ├── journey/          # Interactive 14-year route explorer
    │   │   ├── pradakshina/      # 108 Names diya chanting parikrama
    │   │   ├── characters/       # 194 Personalities directory & modal
    │   │   ├── relics/           # Divine Arsenal & Sacred Relics Treasury
    │   │   ├── compass/          # The Dharma Compass moral dilemma matcher
    │   │   └── parayana/         # Sundara Kanda 7-Day sadhana tracker
    │   ├── components/           # UI & Audio Components (Particles, Reader, Intro)
    │   └── lib/                  # Procedural Web Audio & Transliteration
```

---

## 🚀 Quick Start

### 1. Prerequisites
* **Node.js**: v20+ or v22+ (v22 recommended for built-in `node:sqlite`)
* **Python**: v3.10+ (for scraper and data compilation)

### 2. Run the Web Application
```bash
# Navigate to web directory
cd web

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

To run the production build:
```bash
npm run build
npm run start
```

### 3. (Optional) Run Scraper & Rebuild Database
```bash
# Install Python scraper dependencies
pip install httpx beautifulsoup4

# Run scrapers
python scraper/scrape_sargas.py
python scraper/scrape_characters.py
python scraper/scrape_journey.py
python scraper/scrape_pradakshina.py

# Build SQLite database with FTS5 search index
python scraper/build_sqlite.py

# Verify dataset integrity
python scraper/verify_data.py
```

---

## 🙏 Reverence & Dedication

Composed by Maharishi Valmiki, the *Adi Kavi* (the first poet of human literature).
Dedicated with devotion to Bhagavan Sri Rama.

> **लोकाः समस्ताः सुखिनो भवन्तु**  
> *"May all beings everywhere be happy and free."*
