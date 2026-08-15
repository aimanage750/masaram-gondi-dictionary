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
          100: "#F7F0E4",
          200: "#EFE2C9",
          300: "#E2CFA8",
        },
        terracotta: {
          400: "#E07A45",
          500: "#C45C26",
          600: "#A3491C",
          700: "#7A3414",
        },
        forest: {
          400: "#4A8A5E",
          500: "#2D5A3D",
          600: "#234832",
          700: "#183324",
          800: "#142418",
          900: "#101910",
        },
        gold: {
          300: "#FFE7B0",
          400: "#F0C14B",
          500: "#D4A017",
        },
        clay: {
          500: "#8B3A2A",
        },
        ochre: {
          400: "#E4B53A",
          500: "#D4A017",
          600: "#B38610",
        },
        ink: {
          700: "#4A3728",
          800: "#2A1F14",
          900: "#1A130C",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "Noto Sans Devanagari", "system-ui", "sans-serif"],
        gondi: ["var(--font-gondi)", "Noto Sans Masaram Gondi", "sans-serif"],
        deva: ["var(--font-deva)", "Noto Sans Devanagari", "serif"],
      },
      boxShadow: {
        card: "0 10px 30px -12px rgba(61, 36, 21, 0.25)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.4)",
      },
    },
  },
  plugins: [],
};
export default config;
