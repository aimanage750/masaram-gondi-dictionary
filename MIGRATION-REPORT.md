# Masaram Gondi Language Platform — Migration Report

Date: 2026-08-15 · Commit: `9d29761` · Backup branch: `backup/pre-platform-integration` (points at pre-migration `bf45724`)

## 1. Files created (31)
- `src/lib/converter/mapping.ts` — canonical Devanagari⇄Masaram 1:1 map (from converter repo `mapping.json` v1.1)
- `src/lib/converter/converter.ts` — engine port (convert / convertReverse / smart-ra)
- `src/lib/converter/utils.ts` — codepoint + clipboard helpers
- `src/app/converter/page.tsx`
- `src/components/converter/Converter.tsx`, `ConverterInput.tsx`, `ConverterOutput.tsx`, `ConverterControls.tsx`, `ConverterKeyboard.tsx`
- `src/app/grammar/page.tsx`, `src/app/grammar/[lesson]/page.tsx`
- `src/data/grammar/types.ts`, `lessons.ts`, `lessons/{sangya,sarvanam,kriya,visheshan,kriya-visheshan,ling,vachan,kaal,karak,vakya,anya}.ts`
- `src/components/grammar/GrammarCard.tsx`, `LessonLayout.tsx`, `GrammarTable.tsx`, `ExampleBox.tsx`, `PendingNote.tsx`
- `src/app/contact/page.tsx` (About Author)
- `scripts/test-converter.ts` (golden tests)

## 2. Files modified (18)
`src/components/SiteHeader.tsx` (new responsive nav), `src/components/SiteFooter.tsx` (About/Contact + author info + “Create by Saiyyam Ji”), `src/app/globals.css` (dark forest theme), `tailwind.config.ts` (gold/clay/forest-800/900), `src/app/layout.tsx` (metadata), `next.config.mjs` (/grammar/any redirect), `public/sw.js` (precache mgd-v2), `public/manifest.json`, `src/app/about/page.tsx`, and contrast fixes in `page.tsx`, `browse/page.tsx`, `browse/[category]/page.tsx`, `vakya/page.tsx`, `keyboard/page.tsx`, `contribute/page.tsx`, `word/[id]/page.tsx`, `not-found.tsx`, `offline/page.tsx`.

## 3. Files removed
None. No existing functionality deleted.

## 4. Converter logic source
Original: `web/js/converter.js` (mirrors `converter/python/devanagari_to_masaram_gondi.py`) in repo `aimanage750/masaram-gondi`. Ported 1:1 to TypeScript. All golden tests from the original Python suite pass, including smart-ra (कर्म→𑴌𑵆𑴤 repha, क्रम→𑴌𑵇𑴤 ra-kara), conjuncts (क्ष ज्ञ त्र), nukta letters, punctuation passthrough, and reverse round-trips.

## 5. Mapping / data source
- Single source of truth for the 1:1 map: `src/lib/converter/mapping.ts` (= converter repo `mapping.json` v1.1).
- Verified programmatically identical to the dictionary engine’s table (`src/lib/mapping/masaram.ts`) — no conflicting duplicates.
- Dictionary engine (`masaram.ts`) kept untouched: it generated the 451 stored entries; changing it would mutate existing data.
- Documented engine-level differences (preserved, not overwritten): ऋ/ॠ → dictionary uses अ+ृ sign, converter uses र+ृ sign; dictionary emits halanta for word-final dead consonant, converter keeps virama; dictionary maps ASCII digits to Gondi digits, converter passes them through; only the converter has reverse conversion.

## 6. New routes
`/converter`, `/grammar`, `/grammar/sangya`, `/grammar/sarvanam`, `/grammar/kriya`, `/grammar/visheshan`, `/grammar/kriya-visheshan`, `/grammar/ling`, `/grammar/vachan`, `/grammar/kaal`, `/grammar/karak`, `/grammar/vakya`, `/grammar/anya` (+ `/grammar/any` → redirect), `/contact`. All existing routes unchanged.

## 7. Navigation changes
Desktop/tablet (≥768px): खोज | श्रेणी | वाक्यांश | Converter | व्याकरण (one row, aria-current states).
Mobile: खोज | श्रेणी | वाक्यांश tabs + hamburger menu (Converter, व्याकरण, कीबोर्ड, योगदान, परिचय, Admin). Not overcrowded; menu closes on navigation.

## 8. Theme changes
Adopted the converter’s design system: dark forest gradient (#101910→#1A2C1C→#24180F) with subtle tribal dot pattern, terracotta accents, gold/ochre highlights, cream paper cards for content, deep shadows, gold focus outlines. Not a copy-paste of style.css — re-expressed in Tailwind + small globals.css layer. Admin screens keep their own light layout.

## 9. Responsive changes
Converter grid stacks under 768px; grammar tables scroll horizontally (focusable wrapper); output uses break-words/pre-wrap; touch targets ≥44px; keyboard keys wrap; all pages max-w constrained with px-4 gutters (no horizontal overflow at 320px); nav collapses to 3 tabs + menu; large Gondi text scales via existing text classes.

## 10. Grammar architecture
Data-driven: `src/data/grammar/lessons/*.ts` (typed content) → registry `lessons.ts` → SSG route `/grammar/[lesson]` via `generateStaticParams`. Components render sections: definitions, terms (Hindi/Gondi/English), tables, sourced examples, rules, pending flags. Adding a topic = add one data file + registry entry.

## 11. Dependencies
None added, none removed. (`tsx` used only for local test runs via npx.)

## 12. Tests performed
- Golden suite (original Python cases): ALL PASSED — मसराम, गोंडी, नमस्ते, भारत, हिन्दी, जय हिन्द, क्षेत्र, कर्म, क्रम, पानी, घर, punctuation, long sentence, reverse round-trips, empty input.
- Dictionary engine regression: तल्ला→𑴛𑴧𑵅𑴧𑴱 unchanged; shared-table parity verified.
- Runtime route checks (dev server): 25 URLs, all expected 200/307/404.
- Dictionary search UI + `/api/search` + `/api/dictionary` verified (437 published entries served).
- Admin auth redirect (/admin → /login) verified. SSR conversion output verified. Fonts, sw.js, manifest verified.

## 13. npm run lint
✔ No ESLint warnings or errors.

## 14. npm run build
✓ Compiled successfully · 44/44 pages generated · no errors.

## 15. Remaining warnings
None blocking. Note: `next dev` prints standard Next 14 dev notices only.

## 16. Linguistic data requiring verification
- Grammar rules for all lessons are marked “स्रोत की पुष्टि बाकी” (pending) — no rules invented. Only sourced examples included (गोंडी करीयाट book entries; pronouns from the converter repo’s everyday dictionary with dialect attribution).
- The homepage Gondi string 𑴎𑴉𑴟𑴱𑴝𑴳 (pre-existing) reverses to गोनादी — may deserve owner review someday (not changed).
- Converter repo’s 108-word everyday dictionary was NOT merged into the main dictionary (different sources; possible conflicts e.g. पानी). Decision needed by owner before any merge.
- Old GitHub Pages converter should stay live until the integrated `/converter` is verified in production.
