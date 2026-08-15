"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, MapPin } from "lucide-react";
import { TreeLogo } from "@/components/brand/TreeLogo";

const EXPLORE = [
  { href: "/", label: "Home", deva: false },
  { href: "/browse", label: "Dictionary", deva: false },
  { href: "/translator", label: "Translator", deva: false },
  { href: "/converter", label: "Converter", deva: false },
  { href: "/grammar", label: "Grammar", deva: false },
  { href: "/vakya", label: "Sentences", deva: false },
  { href: "/script", label: "Script", deva: false },
  { href: "/keyboard", label: "कीबोर्ड", deva: true },
];

/** Repeating tribal border strip (pure SVG, decorative). */
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

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.4fr] lg:gap-14">
        {/* ---- Brand ---- */}
        <div>
          <div className="flex items-center gap-3">
            <TreeLogo className="h-12 w-12" />
            <div>
              <p className="font-english text-lg font-bold leading-tight tracking-tight text-cream-50">
                Masaram Gondi
              </p>
              <p className="font-english text-sm font-semibold text-gold-400">
                Script Dictionary
              </p>
            </div>
          </div>

          <p className="mt-5 font-gondi text-2xl leading-snug text-gold-300" aria-hidden>
            𑴤𑴫𑴦𑴱𑴤 𑴎𑴽𑵀𑴘𑴳
          </p>

          <p className="mt-3 max-w-sm font-english text-sm leading-relaxed text-cream-200/75">
            Preserving, learning and exploring the Masaram Gondi language and script.
          </p>

          <p className="mt-4 max-w-sm font-deva text-xs leading-relaxed text-cream-200/55">
            स्रोत: <em>गोंडी करीयाट (गोंडी सिखाएं)</em> — uploaded primary source। कोई गोंडी
            शब्द या नियम अनुमान से नहीं बनाया गया।
          </p>
        </div>

        {/* ---- Explore ---- */}
        <nav aria-label="Footer — explore sections">
          <h2 className="font-english text-xs font-semibold uppercase tracking-[0.22em] text-gold-300">
            Explore
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {EXPLORE.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className={`${
                    n.deva ? "font-deva" : "font-english"
                  } text-cream-100/85 underline-offset-4 transition hover:text-gold-300 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400`}
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* ---- About the Creator ---- */}
        <section aria-labelledby="footer-creator">
          <h2
            id="footer-creator"
            className="font-english text-xs font-semibold uppercase tracking-[0.22em] text-gold-300"
          >
            About the Creator
          </h2>

          <div className="mt-4 rounded-2xl border border-gold-500/20 bg-forest-800/60 p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="font-english text-lg font-bold tracking-tight text-cream-50">
                Rajendra Saiyyam
              </p>
              <span
                aria-hidden
                className="select-none font-gondi text-xl leading-none text-gold-500/70"
                title="Masaram Gondi"
              >
                𑴎
              </span>
            </div>

            <p className="mt-2 font-english text-[13px] leading-relaxed text-cream-200/75">
              Creator and maintainer of the Masaram Gondi Script Dictionary, a digital
              platform focused on preserving, learning and exploring the Masaram Gondi
              language and script.
            </p>

            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a
                  href="mailto:sevajoharsaiyyam@gmail.com"
                  className="group inline-flex max-w-full items-start gap-2.5 underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400"
                >
                  <Mail
                    size={15}
                    aria-hidden
                    className="mt-0.5 shrink-0 text-gold-400 transition group-hover:text-gold-300"
                  />
                  <span className="break-all text-cream-100/90 group-hover:text-gold-300">
                    sevajoharsaiyyam@gmail.com
                  </span>
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={15} aria-hidden className="mt-0.5 shrink-0 text-gold-400" />
                <span className="font-english leading-relaxed text-cream-200/80">
                  Naytola (Dorli), Damoh, Birsa,
                  <br />
                  Balaghat, M.P., India
                </span>
              </li>
            </ul>
          </div>
        </section>
      </div>

      {/* ---- Bottom bar ---- */}
      <div className="border-t border-gold-500/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-4 py-5 text-center md:flex-row md:justify-between md:text-left">
          <p className="font-english text-sm text-cream-100/90">
            Created &amp; Maintained by{" "}
            <strong className="font-semibold text-gold-300">Rajendra Saiyyam</strong>
          </p>
          <p className="font-deva text-xs font-medium tracking-wide text-gold-500/80">
            Jai Seva&ensp;|&ensp;Jai Gondwana
          </p>
          <p className="font-english text-[11px] text-cream-200/55">
            Munshi Mangal Singh Masaram · 1918 · Unicode U+11D00–U+11D5F
          </p>
        </div>
      </div>
    </footer>
  );
}
