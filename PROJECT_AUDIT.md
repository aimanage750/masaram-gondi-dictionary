# PROJECT AUDIT — Masaram Gondi Dictionary (Phase 0)

Date: 2026-08-16 · Audit-only phase. **No project file was modified, deleted or migrated during this audit** (this report is the sole new file).

Repository: `aimanage750/masaram-gondi-dictionary`
Current branch: `main`
Current commit: `c9e0b43` ("Fix creator address spelling…") — identical to remote `main` (verified via `git ls-remote`).
Working tree: **clean** (no pending changes).
Backup branch: `backup/pre-platform-integration` (= `bf45724`, original pre-integration state) exists locally and on GitHub.

---

## 1. Project architecture

- **Framework:** Next.js **14.2.18** (App Router) + TypeScript + Tailwind CSS 3 + `lucide-react`.
- **Fonts:**
  - `public/fonts/NotoSansMasaramGondi-Regular.ttf` (+ copy at `src/app/fonts/`) loaded via `next/font/local` → `--font-gondi`
  - `src/app/fonts/NotoSansDevanagari-Regular.ttf` → `--font-deva`
  - **Inter** via `next/font/google` (variable, self-hosted at build) → `--font-sans` (English/UI)
  - Display serif stack (Iowan Old Style/Palatino/Georgia) via Tailwind `font-display`.
- **PWA:** `public/sw.js` (cache `mgd-v3`, precache `/ /browse /about /keyboard /converter /translator /script /grammar /contact /offline.html /manifest.json`), `public/manifest.json`, `public/offline.html`, `ServiceWorkerRegister` component.
- **Deployment:** Vercel (`vercel.json`: framework nextjs, region `bom1`). Production URL `masaram-gondi-script-platform.vercel.app` (old `masaram-gondi-dictionary.vercel.app` 307-redirects to it).
- **Security:** `middleware.ts` adds security headers everywhere + guards `/admin` (server-side session check); `src/lib/security-headers.ts`, `src/lib/csrf.ts`, `src/lib/validation.ts`.

### Routes (pages)
Public: `/` (search home), `/browse`, `/browse/[category]`, `/word/[id]`, `/vakya`, `/translator`, `/converter`, `/script`, `/keyboard`, `/grammar`, `/grammar/[lesson]` (11 lessons), `/about` (Culture & Knowledge portal), `/contact`, `/contribute`, `/offline`, `/login`.
Admin: `/admin`, `/admin/entries`, `/admin/entries/new`, `/admin/entries/[id]`, `/admin/import`, `/admin/scan`, `/admin/vakya`, `/admin/contributions`, `/admin/audit`.

### API routes
`/api/search`, `/api/dictionary`, `/api/entries`, `/api/entries/[id]`, `/api/entries/bulk`, `/api/import`, `/api/sentences`, `/api/sentences/[id]`, `/api/contribute`, `/api/contributions/[id]`, `/api/audio`, `/api/auth/login`, `/api/auth/logout`, `/api/csrf`.

### Data layer
- `src/data/raw-entries.ts` — **primary dictionary seed** (437 entries from the uploaded book *गोंडी करीयाट (गोंडी सिखाएं)*), + `CATEGORY_META` (14 categories).
- `src/lib/data/store.ts` — dual backend: **Supabase** (if env configured) else **local persistence** (`src/lib/data/persist.ts`, GitHub-backed store option via `GITHUB_STORE_*` env for Vercel).
- `src/lib/mapping/enrich.ts` — derives `gondi_script` (via `devanagariToMasaram`), `roman_gondi`, `roman_hindi`, stable IDs (`makeId` FNV hash; तल्ला/सिर pinned to `59b2mn`).
- `src/lib/search.ts` — multi-field scored search (gondi_script, gondi_pronunciation, roman_gondi, roman_hindi, hindi, english + token fallback, latin fuzzy).
- `src/data/grammar/*` (11 lesson data files + registry), `src/data/culture/*` (9 sourced datasets), `data/sample-import.csv` (CSV import template), `supabase/migrations/0001–0007` (schema, RLS, categories, roles, audit triggers, sentences).

---

## 2. Dictionary audit (exact numbers, computed from source)

| Metric | Value |
|---|---|
| **Total entries (raw seed)** | **437** |
| Unique IDs | 437 |
| **Duplicates** | **0** |
| Entries containing Masaram Gondi (`gondi_script`) | **437 (100%)** |
| Entries containing Roman Gondi | 437 (100%) |
| Entries containing Roman Hindi | 437 (100%) |
| Entries with Hindi | 437 · English 437 · Gondi pronunciation 437 |
| Entries missing `source_page` | 0 |
| **Missing important fields** | **none** (every entry has all core fields) |

*The "≈437 words" shown by the website matches the seed exactly. (An earlier informal grep suggested 451 — that count was a line-matching artifact; the authoritative programmatic count is 437.)*

### Schema (`DictionaryEntry`, `src/lib/types.ts`)
`id, gondi_script, gondi_pronunciation, roman_gondi, roman_hindi, hindi, english, gondi_normalized, category, category_hi, notes, source, source_page, verified, status(published|pending|rejected|draft), audio_path, created_at, updated_at, created_by`.
Public exposure is limited to 4 fields (`PublicEntry`: id, gondi_script, gondi_pronunciation, hindi, english + category/audio).

### Category distribution (seed)
body 116 · building 81 · time 67 · people 29 · medicine 24 · family 24 · health 23 · household 16 · food 16 · direction 15 · clothes 14 · sports 6 · post 6 · general 0.

Sentences: `GondiSentence` store exists (API + `/admin/vakya` + `/vakya` page); **0 seeded sentences locally** (populated via admin / optional Supabase).

---

## 3. Converter audit (untouched)

- **Engine:** `src/lib/converter/converter.ts` — faithful TS port of the original `web/js/converter.js` (repo `aimanage750/masaram-gondi`): 1:1 Devanagari⇄Masaram map, smart-Ra (Repha U+11D46 / Ra-kara U+11D47), nukta, vocalic-R, क्ष/ज्ञ/त्र conjuncts (U+11D2E–30), halanta/virama, reverse conversion. Golden-test suite: `scripts/test-converter.ts` (all pass).
- **Single-source mapping:** `src/lib/converter/mapping.ts` (mirrors `converter/mapping.json` v1.1; verified identical to the dictionary engine's table in `src/lib/mapping/masaram.ts`).
- **Unicode handling:** astral-safe code-point iteration everywhere; keyboard delete is surrogate-safe.
- **Font:** Noto Sans Masaram Gondi via `--font-gondi`; output rendered as **continuous text** (correct akshar+matra joining).
- **UI:** `src/components/converter/` — `Converter.tsx` (workspace: input | swap | output, action bar, Advanced Settings w/ Smart-Ra, local-history), `ConverterInput/Output/Controls/Keyboard/ModeTabs/History`, **`CharMapExplorer.tsx`** (Character Map: स्वर/व्यंजन/मात्राएँ/चिह्न/अंक with search + filters, data from `KEYBOARD_LAYOUT` in `masaram.ts`). Auto script-detection on typing. Copy/Download-TXT/Share. History is localStorage-only.

## 4. Script page audit

- Route `/script` (`src/app/script/page.tsx`) — server component; sections स्वर/व्यंजन/मात्राएँ-चिह्न/अंक rendered as large **real Unicode text** glyph cards (label + U+ code) from `KEYBOARD_LAYOUT`; links to `/keyboard` and `/converter`; Masaram string derived via `devanagariToMasaram` (no hand-typed glyphs).

## 5. Admin Panel audit (untouched)

- **Routes:** `/admin` dashboard, entries list/new/[id] (CRUD via `EntryForm`), CSV import (`/admin/import` + `/api/import`, papaparse), book-scan OCR (`/admin/scan`, tesseract.js + `src/lib/ocr/parse-table.ts`), vakya admin, contributions review, audit log.
- **Auth:** `middleware.ts` gates `/admin`; login via `/api/auth/login` — Supabase auth when `NEXT_PUBLIC_SUPABASE_URL/ANON_KEY` set, else local credentials (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, cookie `mgd_session`); CSRF token via `/api/csrf`; roles `public|contributor|admin` (`src/lib/auth.ts`).
- **Env (`.env.example`):** Supabase public+service keys, `NEXT_PUBLIC_SITE_URL/APP_NAME`, admin creds, `ADMIN_SESSION_SECRET`, Upstash rate-limit (optional), `GITHUB_STORE_TOKEN/REPO/BRANCH` (optional persistence), `MAX_AUDIO_BYTES`.
- **Permissions:** entry upsert/delete + audit writes server-side; public APIs expose only published 4-field data.

## 6. Backup / status

- Git is the backup: branch `main` @ `c9e0b43` == remote; checkpoint branch `backup/pre-platform-integration` @ `bf45724` (pre-redesign original) on local + GitHub.
- All dictionary data lives in-version (`src/data/raw-entries.ts`); converter mappings in-version; fonts in-version; Supabase schema in-version (`supabase/migrations`).
- Repository status: **clean**; no uncommitted work; nothing deleted.

## 7. Important shared components

`SiteHeader` (responsive nav), `SiteFooter` (brand + creator), `SearchBar` (multi-script input + language filter), `WordCard`, `GondiScript` (tofu detection), `GondiKeyboard` (single keyboard source, Devanagari+Masaram modes), `SpeakButton` (TTS), `TreeLogo`, grammar components (`LessonLayout`, `GrammarTable`, `ExampleCard`…), culture components (`CulturePortal`…).

## 8. Potential risks (for future phases)

1. `next/font/google` (Inter) requires network at **build** time (Vercel has it; offline builds would need fallback).
2. Dual data backend (Supabase vs local) — any data-migration work must handle both paths; Vercel persistence depends on optional `GITHUB_STORE_*`.
3. `sw.js` precache list must be kept in sync when routes are added/removed (cache-busting via `mgd-vN`).
4. Dictionary IDs are content-hashed (`makeId`) — editing pronunciation/hindi of an entry changes its ID and would break `/word/[id]` deep links.
5. `general` category is empty; UI filters it out — removing/renaming categories must update `CATEGORY_META` + browse UI together.
6. Heavy admin libs (tesseract.js, pdfjs-dist) are dynamically imported — keep them out of public bundles.

## 9. Recommended implementation order (for later phases)

1. Git checkpoint branch before any change.
2. Data-layer changes first (schema/additions), never touching `makeId`/mapping.
3. UI changes per-page with regression checks on `/`, `/browse`, `/converter`, `/script`, `/admin`.
4. Run `scripts/test-converter.ts` + `npm run lint` + `npm run build` after each phase.
5. Push only after green build; keep `backup/*` branches until verified in production.

---

*End of audit. Phase 0 complete — no implementation started.*
