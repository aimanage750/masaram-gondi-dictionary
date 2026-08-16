import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

/**
 * Multi-script typography system:
 *  - English / UI      → Inter (next/font/google, self-hosted, variable)
 *  - Hindi / Devanagari→ Noto Sans Devanagari (local TTF, preserved)
 *  - Masaram Gondi     → Noto Sans Masaram Gondi (local TTF, preserved)
 *  - Cultural display  → serif stack (see tailwind.config `display`)
 */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const gondi = localFont({
  src: "../../public/fonts/NotoSansMasaramGondi-Regular.ttf",
  variable: "--font-gondi",
  display: "swap",
});

const deva = localFont({
  src: "./fonts/NotoSansDevanagari-Regular.ttf",
  variable: "--font-deva",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Masaram Gondi Script Dictionary",
    template: "%s · Masaram Gondi Script Dictionary",
  },
  description:
    "Masaram Gondi Script Dictionary — search Gondi words in Masaram Gondi script, Devanagari pronunciation, Hindi and English; translate, convert and learn the script. Preserving Our Language • Our Identity.",
  applicationName: "Masaram Gondi Script Dictionary",
  manifest: "/manifest.json",
  authors: [{ name: "Saiyyam Ji" }, { name: "Rajendra Saiyyam" }],
  keywords: [
    "Masaram Gondi",
    "Masaram Gondi Script",
    "Gondi Hindi English Dictionary",
    "Gondi dictionary",
    "Gondi converter",
    "Gondi grammar",
    "गोंडी",
    "मसराम गोंडी",
    "Unicode 11D00",
  ],
  appleWebApp: { capable: true, title: "Masaram Gondi", statusBarStyle: "default" },
  openGraph: {
    type: "website",
    siteName: "Masaram Gondi Script Dictionary",
    locale: "hi_IN",
    title: "Masaram Gondi Script Dictionary",
    description:
      "Search Gondi words in Masaram Gondi script, Devanagari pronunciation, Hindi and English; translate, convert and learn the script. Preserving Our Language • Our Identity.",
    url: "https://masaram-gondi-script-platform.vercel.app",
    images: [
      {
        url: "/img/hero-landscape.jpg",
        width: 1823,
        height: 863,
        alt: "Masaram Gondi Script Dictionary",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Masaram Gondi Script Dictionary",
    description:
      "Search Gondi words in Masaram Gondi script, Devanagari, Hindi and English. Preserving Our Language • Our Identity.",
    images: ["/img/hero-landscape.jpg"],
  },
  metadataBase: new URL("https://masaram-gondi-script-platform.vercel.app"),
};

export const viewport: Viewport = {
  themeColor: "#123C2A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="hi"
      suppressHydrationWarning
      className={`${inter.variable} ${gondi.variable} ${deva.variable}`}
    >
      <head>
        {/* Pre-paint theme init — runs before first render, prevents flash.
            Reads localStorage "theme" (light | dark | system, default system)
            and applies the resolved `dark` class + color-scheme immediately. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme')||'system';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var h=document.documentElement;h.classList.toggle('dark',d);h.style.colorScheme=d?'dark':'light';}catch(e){}})();`,
          }}
        />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
