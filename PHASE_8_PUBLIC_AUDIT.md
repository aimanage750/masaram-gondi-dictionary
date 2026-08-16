# PHASE 8 — PUBLIC WEBSITE AUDIT & PRODUCTION READINESS

Date: 2026-08-16 · Repository `aimanage750/masaram-gondi-dictionary` · Audited at commit `47e85f4` (post Phase 7, working tree clean).
Scope: PUBLIC website only. Admin panel, Google login and dictionary data are **out of scope** for this phase.

---

## 1. Audit method

- Static review: routes, components, metadata, assets, APIs, middleware, PWA files, CSS/theme layer.
- Runtime tests (dev server): every public route status, 5-script search, all 437 word pages, report word-identification, theme toggle presence, API endpoints.
- Converter parity: `scripts/test-converter.ts` golden suite.
- Build/lint/typecheck.

## 2. Dictionary integrity (verified, unchanged)

| Check | Result |
|---|---|
| Entries | **437** |
| Unique IDs | 437 · 0 duplicates |
| Masaram Gondi / Roman Gondi / Roman Hindi coverage | 437/437 each |
| All `/word/[id]` pages | **437/437 HTTP 200** (direct load) |
| Search (Hindi / English / Gondi Devanagari / Roman Gondi / Masaram) | all 5 find तल्ला → correct entry `59b2mn` |
| `/api/dictionary` | 200, public-safe fields only |

**No dictionary value, ID, mapping or font was modified.**

## 3. Issues found → action

| # | Issue | Severity | Fix | Safe? | Data impact |
|---|---|---|---|---|---|
| 1 | No `robots.txt` | Medium | Add `src/app/robots.ts` (allow all + sitemap URL) | ✅ | none |
| 2 | No sitemap | High (SEO) | Add `src/app/sitemap.ts` — static routes, 11 grammar lessons, 13 categories, 437 word URLs (all real data) | ✅ | none |
| 3 | No Open Graph / Twitter metadata anywhere | High (SEO/social) | Root `openGraph` + `twitter` in layout; per-word `openGraph` in `/word/[id]` generateMetadata. Image: existing `public/img/hero-landscape.jpg` (1823×863, project's own asset) | ✅ | none |
| 4 | `/script` and `/translator` have **no `<h1>`** (SectionTitle always renders `<h2>`) — heading hierarchy/a11y | Medium | Add `level` prop to `SectionTitle` (default `h2`, unchanged); pass `level="h1"` on script + translator pages | ✅ | none |
| 5 | 404 page minimal (no visible "404", single link) | Medium | Rebuild `not-found.tsx`: 404 + "Page not found" + **Back to Home** + **Open Dictionary**, bilingual, design-system styling | ✅ | none |
| 6 | No loading states for dynamic routes (`/word/[id]`, `/report?word=` are `force-dynamic`) | Low–Medium | Add `word/[id]/loading.tsx` + `report/loading.tsx` skeletons (design tokens, no layout jump) | ✅ | none |
| 7 | `/keyboard` is a client page → no SEO metadata | Medium | Split into server `page.tsx` (metadata) + client component (behavior unchanged) | ✅ | none |
| 8 | `/browse/[category]` has no per-category metadata | Medium | Add `generateMetadata` using real `CATEGORY_META` names | ✅ | none |
| 9 | Home hero gradient (`from-cream-100/60 → to-cream-100`) stays light in dark mode | Medium (theme) | Add `.dark` overrides for these two gradient stops in globals.css | ✅ | none |
| 10 | Service worker precache (mgd-v3) misses newer public routes (`/contribute`, `/report`, `/vakya`) | Low | Bump cache to `mgd-v4`, add the three routes to PRECACHE | ✅ | none |
| 11 | Hero image 390 KB (1823×863) loaded via CSS background | Low (perf) | **NOT changed** — re-encoding risks visual quality; it renders as a decorative `aria-hidden` background. Documented only. | — | — |
| 12 | `/grammar/verbs`-style English slugs don't exist | None | Not a bug — lesson slugs are Hindi terms (sangya, kriya, kaal…); all internal links correct. | — | — |

## 4. Verified healthy (no action needed)

- **Header/Navigation:** logo, site name, active states, mobile menu, theme selector, Admin link — all present; no overflow at 320px (toggle is icons-only below md). Global Converter nav kept; in-content Converter button removed from Script (Phase 6) — confirmed still correct.
- **Dictionary:** listing, search, cards, word detail, back navigation, related words, verified badge — consistent design, correct data. Masaram Gondi visually dominant in detail header (text-5xl/6xl) ✅ hierarchy Masaram > Gondi > Roman > Hindi > English preserved.
- **Fonts:** Masaram Gondi (local TTF), Devanagari (local TTF), Inter (self-hosted via next/font) — no external runtime font dependencies; glyphs 𑴛𑴧𑵅𑴧𑴱 / सिर render as real Unicode text in both themes.
- **Converter:** golden parity suite ALL PASSED; Character Map absent from Converter, present on Script; copy works; engine untouched.
- **Contribute / Report:** forms, validation, duplicate checks, success/error states; submissions forced `PENDING`; contributor/reporter emails never rendered publicly; honeypot + CSRF + rate limits intact.
- **Theme:** Light/Dark/System persisted (`localStorage["theme"]`), pre-paint script (no flash), system mode reacts live; all tokens compile both palettes (verified in prod CSS).
- **Footer:** links all resolve to real routes; no fake social links; deep forest footer readable in both themes.
- **Security sanity:** admin APIs (`entries`, `entries/[id]`, `import`, `audio`, `sentences`, `contributions/[id]`) all session+role gated; `/admin` middleware-guarded; no secrets in frontend (only Supabase anon keys, public by design); CSRF on mutations; dangerous-pattern + https-only URL validation; contributions/reports cannot self-approve (status forced server-side, RLS enforces `pending`).
- **PWA:** manifest (name, icons 192/512, standalone, theme color) valid; offline page exists; favicon + app icons present (existing branding kept).
- **Error states:** public APIs return generic messages ("Invalid form", "Something went wrong…") — no SQL/stack internals exposed.
- **Empty states:** search no-results message, absent-field sections hidden on detail page — no `undefined/null/NaN` rendered.

## 5. Intentionally NOT changed (risk/scope)

- Hero JPG re-encode (issue 11) — visual-quality risk for marginal gain.
- No OG image redesign — existing hero asset reused per spec §24.
- Admin pages inherit theme tokens automatically; no admin-specific theming (§37).
- Converter engine, dictionary data, mappings, fonts — untouched per phase rules.

## 6. Status after fixes

Build: TypeScript ✅ · ESLint ✅ (0 warnings) · Production build ✅ 52/52 pages · Converter golden tests ALL PASSED ✅.

Runtime re-verification (post-fix):
- All public routes 200; unknown route → professional 404 ✅
- `/robots.txt` serves allow-all + sitemap; `/sitemap.xml` = **473 URLs** (12 static + 11 grammar lessons + 13 browse + **437 word pages**) ✅
- Open Graph + Twitter card present (home + per-word with the actual word in the shared title) ✅
- `<h1>` present on every public page (script + translator fixed via `SectionTitle level` prop) ✅
- Loading skeletons on `/word/[id]` and `/report` dynamic routes ✅
- Keyboard + category pages now have dedicated metadata; empty category shows a meaningful message ✅
- Home hero gradient follows dark background ✅
- Service worker `mgd-v4` precaches `/contribute`, `/report`, `/vakya` ✅
- Dictionary: `/api/dictionary` returns 437 entries; 437/437 word pages 200 (verified pre-fix) ✅
- Theme toggle present on all public pages; Light/Dark/System persist without flash ✅
- Admin/auth/API surfaces disallowed from indexing; admin APIs remain session+role gated ✅

**Checkpoint commit:** `2e4168f` — `feat: final public website polish and production readiness`.
