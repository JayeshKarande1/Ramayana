# LLM Working Guide: Valmiki Ramayana

## Purpose

This repository builds a static, immersive reading and exploration site for the Valmiki Ramayana. It presents 7 kandas, 648 sargas, Sanskrit source text, transliteration, word-level notes, English meanings, people, a journey map, 108-name pradakshina, and related devotional tools.

The site is intentionally client-friendly: it has no application API or runtime database dependency. The production result is a static Next.js export that can be hosted on GitHub Pages.

## Read This Before Editing

- The web application lives in [`web/`](web/), not at the repository root.
- Read [`web/AGENTS.md`](web/AGENTS.md) before changing Next.js code. It requires consulting the installed Next.js documentation under `web/node_modules/next/dist/docs/` for the feature being changed because this Next version may differ from training data.
- Preserve Sanskrit, transliteration, source IDs, and translations exactly unless the requested work explicitly authorizes content correction.
- Treat the root corpus and the web corpus as separate artifacts. Root `data/` is used by Python tooling; the running site imports `web/src/data/`.

## Top-Level Map

```text
data/                       Source corpus and generated SQLite database
  sargas/<kanda>_<n>.json   648 chapter files
  kandas.json               Seven-kanda metadata
  characters.json           Person directory data
  journey.json              Journey-map stops
  pradakshina.json          108 names
  ramayana.db               Generated SQLite + FTS5 index
scraper/                    Python ingestion, compilation, and checks
web/                        Next.js 16 / React 19 static site
  src/app/                  App Router routes
  src/components/           Shared interactive UI
  src/context/              Client-side language preference
  src/data/                 Web-imported mirror of corpus JSON
  src/lib/                  Audio, chapter-file lookup, transliteration
  public/search_index.json  Generated browser search index
deploy/                     GitHub Pages workflow
deploy.ps1                  Builds and force-pushes the gh-pages branch
```

## Architecture and Data Flow

```text
ramayana.info (scraper input)
        |
        v
root data/*.json and data/sargas/*.json
        |
        +--> scraper/build_sqlite.py --> data/ramayana.db --> generate_search_index.py
        |                                                   --> web/public/search_index.json
        |
        +--> manually synchronized mirror --> web/src/data/*.json
                                                |
                                                v
                                      Next.js static export --> web/out/ --> GitHub Pages
```

### The two data locations are a critical constraint

`scraper/scrape_sargas.py` and the other scraper scripts write root `data/`. `scraper/build_sqlite.py` also reads root `data/`. In contrast, route components import metadata from `@/data/...`, which resolves to `web/src/data/...`; chapter routes read from `web/src/data/sargas/` through `src/lib/sargas.ts`.

There is no repository script that synchronizes these locations. When changing or regenerating content, update the intended source and deliberately synchronize the web mirror before verifying the UI. Do not assume that rebuilding `ramayana.db` changes the rendered chapters.

## Web Application

### Runtime and static-export model

- Stack: Next.js `16.3.4`, React `19.2.8`, TypeScript, Tailwind CSS v4, and `lucide-react`.
- `web/next.config.ts` sets `output: 'export'`, `trailingSlash: true`, and disables image optimization.
- On GitHub Actions builds only, `basePath` and `NEXT_PUBLIC_BASE_PATH` become `/ramayana-gemini`. Browser asset fetches must keep this prefix in mind.
- Dynamic story routes must remain statically enumerable. `story/[kanda]/page.tsx` and `story/[kanda]/[sarga]/page.tsx` use `generateStaticParams()` from `kandas.json`.
- Server route components use Node `fs` during build/export to load chapter JSON. Do not move that file access into a client component.

### Important routes

| Route | Responsibility | Key implementation |
| --- | --- | --- |
| `/` | Home / epic turning points | `web/src/app/page.tsx` |
| `/story` | Kanda index | `web/src/app/story/page.tsx` |
| `/story/[kanda]` | Kanda overview and all chapter links | `web/src/app/story/[kanda]/page.tsx` |
| `/story/[kanda]/[sarga]` | Individual chapter reader | `web/src/app/story/[kanda]/[sarga]/page.tsx`, `components/SargaReader.tsx` |
| `/journey` | 14-year journey explorer | `web/src/app/journey/page.tsx`, `components/JourneyMap.tsx` |
| `/characters` | Character directory | `web/src/app/characters/page.tsx` |
| `/pradakshina` | 108-name diya interaction | `web/src/app/pradakshina/page.tsx` |
| `/parayana` | Sundara Kanda seven-day tracker | `web/src/app/parayana/page.tsx` |
| `/relics`, `/compass` | Curated thematic experiences | corresponding route files |

### Global composition

`web/src/app/layout.tsx` wraps every route with `LanguageProvider`, temple particles, cinematic intro, header, page transition, footer, and the mobile navigation bar. New pages inherit that chrome automatically. Add global providers or persistent UI here with care because they affect every static route.

### Client-state conventions

- Interactive components declare `'use client'`.
- The language preference is held by `LanguageContext` and persisted under localStorage key `ramayana_language`.
- Use `useLanguage()` only below `LanguageProvider`.
- Audio is browser-only Web Speech/Web Audio logic in `web/src/lib/audio.ts`; do not invoke it while rendering on the server.
- Search loads and caches `public/search_index.json` in the browser. Its URL correctly includes `NEXT_PUBLIC_BASE_PATH` for GitHub Pages.

## Content Contracts

### Kanda (`kandas.json`)

Each item has:

```ts
{ id, order, romanNumeral, name, sanskrit, subtitle,
  description, sargasCount, shlokasCount, themeColor }
```

`id` must match the chapter filename prefix and all story-route URLs (for example, `bala`, `sundara`, `yuddha`). `sargasCount` controls static route generation, so a mismatch creates missing pages or broken links.

### Sarga (`sargas/<kanda>_<number>.json`)

```ts
{
  kanda: string,
  kandaName: string,
  sarga: number,
  title: string,
  totalShlokas: number,
  shlokas: Array<{
    id: string,
    shlokaNumber: number,
    sanskrit: string,
    transliteration: string,
    wordByWord: string,
    meaning: string
  }>
}
```

Required invariants:

- The file name is exactly `<kanda>_<sarga>.json`.
- `kanda`, `sarga`, and filename agree.
- `totalShlokas` matches the number of `shlokas`.
- `shlokaNumber` is the route-anchor number: search links target `#shloka-<shlokaNumber>`.
- Preserve `id` (the external verse code) separately from the database canonical key, which is generated as `<kanda>_<sarga>_<shlokaNumber>`.

## Content and Build Pipeline

Run Python commands from the repository root.

1. `python scraper/scrape_sargas.py` fetches/caches chapter data in `data/sargas/` from `ramayana.info` using six concurrent workers.
2. The supporting `scrape_characters.py`, `scrape_journey.py`, and `scrape_pradakshina.py` populate the other root JSON files.
3. `python scraper/build_sqlite.py` rebuilds `data/ramayana.db` and its FTS5 tables from root `data/`.
4. `python scraper/generate_search_index.py` produces `web/public/search_index.json` from the database. It intentionally contains a selected subset rather than every verse.
5. Synchronize changed root JSON to `web/src/data/` when the site must reflect the new corpus.
6. `python scraper/verify_data.py` audits the root data; `python scraper/test_web.py` checks a running local site.

Do not run the scraper merely to change visual/UI code: it contacts an external site and can mutate a large corpus. Likewise, rebuilding SQLite deletes and recreates `data/ramayana.db`.

## Reader and Localization Details

`SargaReader` supports book, manuscript, carousel, and split reading modes; per-verse speech; continuous playback; copy/share actions; and script selection. Its `SargaData` and `Shloka` TypeScript interfaces are the expected reader contract.

`transliterate()` currently converts Devanagari to Bengali, Gujarati, Telugu, Kannada, and Malayalam with Unicode offsets. It returns the input text for `devanagari`, and IAST display is normally taken from stored `transliteration`; Tamil is declared in the type/options but has no offset mapping in the current implementation. Do not claim full linguistic transliteration support without testing it.

The language selector translates UI strings. It does not translate corpus meanings, and the language-to-script entries in `LanguageContext` currently retain `devanagari`; reader script selection is independently controlled.

## Safe Change Procedure

1. Read the relevant route/component plus its imported data contract.
2. Keep server-only imports (`fs`, `path`) out of client components.
3. For a new route, confirm it works under `output: 'export'`, uses trailing-slash-compatible links, and does not require a server API.
4. For a new Kanda/Sarga, update both counts and mirrored data, then regenerate/check all static params.
5. For any public asset fetch or URL built in browser code, support `NEXT_PUBLIC_BASE_PATH`.
6. Do not overwrite unrelated uncommitted work. The working tree may contain active UI changes.

## Validation

From `web/`:

```powershell
npm.cmd install
npm.cmd run lint
npm.cmd run build
```

For UI changes, run `npm.cmd run dev`, test the exact interaction in a browser, and include a story page, search modal, mobile navigation, and a GitHub Pages base-path build where relevant.

For corpus changes, additionally run:

```powershell
python scraper/verify_data.py
python scraper/build_sqlite.py
python scraper/generate_search_index.py
```

Then confirm that a representative rendered route loads the expected new chapter and that search results use correct links/anchors.

## Deployment

`web/package.json` exposes `npm run deploy`, which runs `deploy.ps1`. The script sets `GITHUB_ACTIONS=true`, builds `web/out`, initializes a temporary Git repository there, and force-pushes it to `origin/gh-pages` before removing the temporary `.git` directory.

This is a destructive remote operation. Do not run it for ordinary local validation or without explicit authorization to publish. The expected site URL is `https://jayeshkarande1.github.io/ramayana-gemini/`.

## Quick Decision Guide

| Request | Likely files | Extra care |
| --- | --- | --- |
| Change shared chrome/navigation | `layout.tsx`, `Header.tsx`, mobile nav components | affects every route |
| Change a reader feature | `SargaReader.tsx`, `audio.ts`, `transliteration.ts` | test keyboard/audio and all modes |
| Add/change chapter content | both data trees, possibly SQLite/index | preserve IDs and synchronize mirrors |
| Change search | `SearchModal.tsx`, `generate_search_index.py` | preserve base-path prefix and route anchors |
| Change static deployment | `next.config.ts`, `deploy.ps1`, workflow | test GitHub Pages base path |

