"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, MapPin } from "lucide-react";
import { TreeLogo } from "@/components/brand/TreeLogo";

const SECTIONS = [
  { href: "/", label: "Home · खोज" },
  { href: "/browse", label: "Dictionary · श्रेणी" },
  { href: "/translator", label: "Translator" },
  { href: "/converter", label: "Converter" },
  { href: "/grammar", label: "Grammar · व्याकरण" },
  { href: "/vakya", label: "Sentences · वाक्यांश" },
  { href: "/script", label: "Script · लिपि" },
  { href: "/keyboard", label: "कीबोर्ड" },
];

const ABOUT = [
  { href: "/about", label: "About · इस वेबसाइट के बारे में" },
  { href: "/contact", label: "Contact Us · लेखक परिचय" },
  { href: "/contribute", label: "योगदान · Contribute" },
];

/** Repeating tribal border strip (pure SVG). */
function TribalStrip({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`overflow-hidden ${className}`}>
      <svg viewBox="0 0 720 14" preserveAspectRatio="none" className="h-3.5 w-full text-gold-500">
        {Array.from({ length: 24 }).map((_, i) => (
          <g key={i} transform={`translate(${i * 30} 0)`}>
            <path d="M6 7l5-5 5 5-5 5z" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="22" cy="7" r="1.6" fill="currentColor" />
            <path d="M0 7h2M28 7h2" stroke="currentColor" strokeWidth="1" />
          </g>
        ))}
      </svg>
    </div>
  );
}

export function SiteFooter() {
  const path = usePathname();
  if (path.startsWith("/admin") || path.startsWith("/login")) return null;

  return (
    <footer className="mt-16 bg-forest-900 text-cream-100">
      <TribalStrip className="bg-forest-800" />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <TreeLogo className="h-12 w-12" />
            <div>
              <p className="font-display text-lg font-bold leading-tight text-cream-50">
                Masaram Gondi
              </p>
              <p className="font-display text-sm font-semibold text-gold-400">
                Script Dictionary
              </p>
            </div>
          </div>
          <p className="mt-4 font-gondi text-2xl text-gold-300" aria-hidden>
            𑴤𑴫𑴦𑴱𑴤 𑴎𑴽𑵀𑴘𑴳
          </p>
          <p className="mt-3 text-sm leading-relaxed text-cream-200/75">
            A serious digital platform for preserving, learning, searching and promoting
            the Masaram Gondi language and script — Unicode U+11D00–U+11D5F.
          </p>
        </div>

        <nav aria-label="फ़ुटर अनुभाग">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
            Sections
          </h2>
          <ul className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {SECTIONS.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="font-deva text-cream-100/85 underline-offset-4 hover:text-gold-300 hover:underline"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="फ़ुटर परिचय">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
            About
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {ABOUT.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="font-deva text-cream-100/85 underline-offset-4 hover:text-gold-300 hover:underline"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-cream-200/60">
            स्रोत: गोंडी करीयाट (गोंडी सिखाएं) — uploaded primary source. कोई गोंडी शब्द
            अनुमान से नहीं बनाया गया।
          </p>
        </nav>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-300">
            About Author
          </h2>
          <p className="mt-4 font-deva text-base font-semibold text-cream-50">
            Rajendra Saiyyam
          </p>
          <ul className="mt-2 space-y-2 text-sm text-cream-200/80">
            <li>
              <a
                href="mailto:sevajoharsaiyyam@gmail.com"
                className="inline-flex items-start gap-2 break-all underline-offset-4 hover:text-gold-300 hover:underline"
              >
                <Mail size={15} className="mt-0.5 shrink-0" aria-hidden />
                sevajoharsaiyyam@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin size={15} className="mt-0.5 shrink-0" aria-hidden />
              <span>
                Naytola (Dorli), Damoh, Birsa,
                <br />
                Balaghat, M.P. — India
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gold-500/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-sm md:flex-row">
          <p className="font-deva">
            Create by <strong className="text-gold-300">Saiyyam Ji</strong>
          </p>
          <p className="font-deva font-semibold tracking-wide text-gold-400">
            Jai Seva &nbsp;|&nbsp; Jai Gondwana
          </p>
          <p className="text-xs text-cream-200/60">
            Munshi Mangal Singh Masaram · 1918 · Unicode U+11D00–U+11D5F
          </p>
        </div>
      </div>
    </footer>
  );
}
