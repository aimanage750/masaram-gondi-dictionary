import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FBF6EC",
          100: "#F5EBDD",
          200: "#EDE0CC",
          300: "#E2D2B8",
        },
        terracotta: {
          400: "#C06A38",
          500: "#A94F24",
          600: "#8C3F1B",
          700: "#6B3518",
        },
        forest: {
          400: "#2E6B4C",
          500: "#1E5138",
          600: "#123C2A",
          700: "#0D3121",
          800: "#0A2A1C",
          900: "#08251A",
        },
        ochre: {
          400: "#D9A85C",
          500: "#C58A3A",
          600: "#A87226",
        },
        gold: {
          300: "#EACB96",
          400: "#D9A85C",
          500: "#C58A3A",
          600: "#A87226",
        },
        earth: {
          500: "#6B3518",
        },
        ink: {
          700: "#3A4A40",
          800: "#17221C",
          900: "#0E1712",
        },
        clay: {
          500: "#6B3518",
        },
      },
      fontFamily: {
        display: [
          "Iowan Old Style",
          "Palatino Linotype",
          "Book Antiqua",
          "Georgia",
          "serif",
        ],
        sans: [
          "var(--font-sans)",
          "Noto Sans Devanagari",
          "system-ui",
          "sans-serif",
        ],
        gondi: ["var(--font-gondi)", "Noto Sans Masaram Gondi", "sans-serif"],
        deva: ["var(--font-deva)", "Noto Sans Devanagari", "serif"],
      },
      boxShadow: {
        card: "0 10px 30px -12px rgba(23, 34, 28, 0.18)",
        lift: "0 18px 40px -16px rgba(23, 34, 28, 0.28)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.4)",
      },
    },
  },
  plugins: [],
};
export default config;
