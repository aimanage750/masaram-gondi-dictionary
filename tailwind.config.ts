import type { Config } from "tailwindcss";

/**
 * Phase 7 — Light / Dark / System theme.
 *
 * Every role-consistent color token below resolves to a CSS variable defined
 * in `src/app/globals.css` (`:root` = light, `.dark` = dark), so ALL opacity
 * modifiers (`/10`, `/60`, …) keep working in both themes without touching
 * components. Tokens with mixed roles stay static by design:
 *  - `cream-*`  → also used as light TEXT on colored buttons, so the scale
 *                 stays bright; surface uses get targeted `.dark` overrides
 *                 in globals.css.
 *  - `gold-*`   → light metallics that read correctly on dark footer too.
 */
const v = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Card / input surface. Light: pure white · Dark: warm charcoal.
           No `text-white` exists in the codebase, so the flip is safe. */
        white: v("surface-card"),
        cream: {
          50: "#FBF6EC",
          100: "#F5EBDD",
          200: "#EDE0CC",
          300: "#E2D2B8",
        },
        terracotta: {
          400: v("terracotta-400"),
          500: v("terracotta-500"),
          600: v("terracotta-600"),
          700: v("terracotta-700"),
        },
        forest: {
          400: v("forest-400"),
          500: v("forest-500"),
          600: v("forest-600"),
          700: v("forest-700"),
          /* 800/900 are used as dark footer/panel BACKGROUNDS with cream
             text — they must stay deep in both themes. */
          800: v("forest-800"),
          900: v("forest-900"),
        },
        ochre: {
          400: v("ochre-400"),
          500: v("ochre-500"),
          600: v("ochre-600"),
        },
        gold: {
          300: "#EACB96",
          400: "#D9A85C",
          500: "#C58A3A",
          600: "#A87226",
        },
        earth: {
          500: v("earth-500"),
        },
        ink: {
          700: v("ink-700"),
          800: v("ink-800"),
          /* Never used as text — kept deep so toasts (bg-ink-900) remain
             dark elevated pills in both themes. */
          900: v("ink-900"),
        },
        clay: {
          500: v("earth-500"),
        },
      },
      fontFamily: {
        /* Base UI stack: English→Inter; Devanagari/Gondi glyphs fall back
           per-glyph to their own fonts (never makes English Devanagari). */
        sans: [
          "var(--font-sans)",
          "Inter",
          "Noto Sans Devanagari",
          "Noto Sans Masaram Gondi",
          "system-ui",
          "sans-serif",
        ],
        english: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        hindi: ["var(--font-deva)", "Noto Sans Devanagari", "sans-serif"],
        deva: ["var(--font-deva)", "Noto Sans Devanagari", "sans-serif"],
        gondi: ["var(--font-gondi)", "Noto Sans Masaram Gondi", "sans-serif"],
        display: [
          "Iowan Old Style",
          "Palatino Linotype",
          "Book Antiqua",
          "Georgia",
          "serif",
        ],
      },
      boxShadow: {
        card: "0 10px 30px -12px var(--shadow-card)",
        lift: "0 18px 40px -16px var(--shadow-lift)",
        inset: "inset 0 1px 0 var(--shadow-inset)",
      },
    },
  },
  plugins: [],
};
export default config;
