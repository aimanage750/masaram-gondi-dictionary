# Masaram Gondi Dictionary · गोंडी शब्द कोश

**Created by Saiyyam Ji**

🌐 **Live website:** https://masaram-gondi-dictionary.vercel.app/

A free public dictionary and learning platform for the **Masaram Gondi** script (Unicode `U+11D00–U+11D5F`). Search verified Gondi vocabulary in Masaram Gondi, Devanagari pronunciation, Hindi, English, and Roman search terms.

> गोंडी शब्द कोश — मसराम गोंडी लिपि, गोंडी उच्चारण, हिन्दी और अंग्रेज़ी।
> स्रोत: अपलोड की गई पुस्तक *गोंडी करीयाट (गोंडी सिखाएं)*। गोंडी शब्द या वाक्य अनुमान से नहीं बनाए गए।

## Public dictionary fields

Public results display only these four fields:

1. Masaram Gondi
2. Gondi Pronunciation
3. Hindi
4. English

Roman Gondi and Roman Hindi are used only to make search more flexible; they are not displayed in the public result.

| Masaram Gondi | Gondi Pronunciation | Hindi | English |
|---|---|---|---|
| 𑴛𑴧𑵅𑴧𑴱 | तल्ला | सिर | Head |

Examples of supported search: `तल्ला`, `Talla`, `talla`, `TALLA`, `sir`, `सिर`, `Head`, `𑴛𑴧𑵅𑴧𑴱`.

## Features

- Dictionary search and category browsing
- Masaram Gondi ⇄ Devanagari converter, with verified mapping checks
- Script chart and Masaram Gondi keyboard
- Grammar lessons, sentences, culture and knowledge pages
- Word contributions and report workflow
- Protected admin area with Google OAuth / local development fallback
- Optional Supabase persistence and GitHub-backed data store
- PWA manifest, offline page, theme chooser and responsive design

## Header and responsive-navigation fix

The public header was reviewed and corrected for the tablet / smaller-desktop range:

- Full desktop navigation now appears only at `xl` width and above.
- Below that width, the header uses the accessible menu instead of squeezing icon-only links beside the brand.
- This prevents the logo, navigation, theme switcher and Admin button from colliding or overflowing around tablet and laptop breakpoints.
- The wide navigation keeps compact labels until `2xl`, preserving room for every item.

## Technical review fixes (August 2026)

- Upgraded Next.js to **16.3.1** and migrated ESLint to the Next.js 16 flat-config format.
- Added the missing `tsx` development dependency; `npm run check:mapping` now runs correctly.
- Migrated request cookie usage to Next.js 16 asynchronous APIs.
- Migrated dynamic API route parameters to asynchronous `params` handling required by Next.js 16.
- Updated the Supabase JavaScript client to **2.109.0** (Node 20 compatible).
- Corrected the canonical metadata / Open Graph base URL to the live Vercel URL.
- Replaced internal homepage anchor navigation with `next/link` where appropriate.
- Resolved lint and TypeScript failures; production build now completes successfully.
- `npm audit --omit=dev` reports **0 vulnerabilities** at the time of review.

## Requirements

- Node.js **20.9+**
- npm 10+ recommended
- Optional: Supabase project and/or GitHub store credentials for persistent admin data

## Local development

```bash
cp .env.example .env.local
npm ci
npm run dev
```

Open http://localhost:3000.

### Quality checks

Run these before committing or deploying:

```bash
npm run lint
npm run check:mapping
npx tsc --noEmit
npm run build
npm audit --omit=dev
```

## Environment configuration

Copy `.env.example` to `.env.local`. The application can run without Supabase for local/demo data, but production admin features should configure the documented environment variables, including:

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `ADMIN_EMAILS`
- `ADMIN_SESSION_SECRET`
- Optional `GITHUB_STORE_TOKEN` for GitHub-backed persistence

Never commit `.env.local` or secrets.

## Database setup

For Supabase, apply the migrations in order and then seed data:

```text
supabase/migrations/0001_schema.sql … 0010_sources_and_archive_status.sql
supabase/seed.sql
```

See [DEPLOY.md](./DEPLOY.md) for deployment guidance.

## Links

| Resource | URL |
|---|---|
| Website | https://masaram-gondi-dictionary.vercel.app/ |
| Repository | https://github.com/saiyyamdeveloper/MasaramGondiLipi-dictionary |
| Deployment guide | [DEPLOY.md](./DEPLOY.md) |

## Stack

Next.js 16 · React 18 · TypeScript · Tailwind CSS · Supabase (optional) · Vercel

## License

MIT © Saiyyam Ji
