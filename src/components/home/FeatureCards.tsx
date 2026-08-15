import Link from "next/link";
import { ArrowRight } from "lucide-react";

function BookArt() {
  return (
    <svg viewBox="0 0 64 64" className="h-14 w-14" fill="none" aria-hidden>
      <path d="M8 14c8-4 16-4 24 0v38c-8-4-16-4-24 0zM56 14c-8-4-16-4-24 0v38c8-4 16-4 24 0z" stroke="#6B3518" strokeWidth="2.4" strokeLinejoin="round" fill="#FBF6EC" />
      <path d="M14 24c5-2 9-2 13 0M14 31c5-2 9-2 13 0M14 38c5-2 9-2 13 0" stroke="#A94F24" strokeWidth="2" strokeLinecap="round" />
      <path d="M37 24h13M37 31h13M37 38h9" stroke="#123C2A" strokeWidth="2" strokeLinecap="round" />
      <path d="M40 45l3 3 6-7" stroke="#C58A3A" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TranslateArt() {
  return (
    <svg viewBox="0 0 64 64" className="h-14 w-14" fill="none" aria-hidden>
      <circle cx="22" cy="24" r="13" stroke="#123C2A" strokeWidth="2.4" fill="#FBF6EC" />
      <text x="22" y="30" textAnchor="middle" fontSize="16" fill="#123C2A" fontFamily="serif">अ</text>
      <circle cx="42" cy="40" r="13" stroke="#A94F24" strokeWidth="2.4" fill="#FBF6EC" />
      <text x="42" y="46" textAnchor="middle" fontSize="15" fill="#A94F24" className="font-gondi" fontFamily="var(--font-gondi)">𑴎</text>
      <path d="M30 15c8-4 18-2 22 5M34 49c-8 4-18 2-22-5" stroke="#C58A3A" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M50 16l2 4 4-1M14 48l-2-4-4 1" stroke="#C58A3A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ScriptArt() {
  return (
    <svg viewBox="0 0 64 64" className="h-14 w-14" fill="none" aria-hidden>
      <rect x="8" y="10" width="48" height="44" rx="8" stroke="#123C2A" strokeWidth="2.4" fill="#FBF6EC" />
      <path d="M8 24h48M24 24v30M40 24v30" stroke="#123C2A" strokeWidth="1.6" opacity="0.5" />
      <text x="16" y="21" fontSize="11" fill="#A94F24" fontFamily="var(--font-gondi)">𑴀</text>
      <text x="32" y="21" fontSize="11" fill="#123C2A" fontFamily="var(--font-gondi)">𑴌</text>
      <text x="48" y="21" fontSize="11" fill="#6B3518" fontFamily="var(--font-gondi)">𑴛</text>
      <text x="16" y="38" fontSize="11" fill="#123C2A" fontFamily="var(--font-gondi)">𑴦</text>
      <text x="32" y="38" fontSize="11" fill="#A94F24" fontFamily="var(--font-gondi)">𑴤</text>
      <text x="48" y="38" fontSize="11" fill="#123C2A" fontFamily="var(--font-gondi)">𑴉</text>
      <text x="16" y="51" fontSize="11" fill="#6B3518" fontFamily="var(--font-gondi)">𑴨</text>
      <text x="32" y="51" fontSize="11" fill="#123C2A" fontFamily="var(--font-gondi)">𑴎</text>
      <text x="48" y="51" fontSize="11" fill="#A94F24" fontFamily="var(--font-gondi)">𑴫</text>
    </svg>
  );
}

function CultureArt() {
  return (
    <svg viewBox="0 0 64 64" className="h-14 w-14" fill="none" aria-hidden>
      <circle cx="32" cy="14" r="6" stroke="#C58A3A" strokeWidth="2.2" fill="#F5EBDD" />
      <path d="M32 20v14M32 34l-8 16M32 34l8 16M32 24l-10 6M32 24l10 6" stroke="#6B3518" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M14 30c2-6 6-9 10-10M50 30c-2-6-6-9-10-10" stroke="#A94F24" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="32" cy="44" rx="7" ry="5" stroke="#123C2A" strokeWidth="2.2" fill="#FBF6EC" />
      <path d="M27 42h10" stroke="#123C2A" strokeWidth="1.6" />
      <path d="M10 56c7-3 15-3 22 0 7-3 15-3 22 0" stroke="#C58A3A" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const CARDS = [
  {
    href: "/browse",
    title: "Dictionary",
    desc: "Search words in Gondi, Hindi, English",
    art: <BookArt />,
    ring: "bg-ochre-500/15",
    arrow: "bg-terracotta-500",
  },
  {
    href: "/translator",
    title: "Translator",
    desc: "Translate between available languages instantly",
    art: <TranslateArt />,
    ring: "bg-forest-500/10",
    arrow: "bg-forest-600",
  },
  {
    href: "/script",
    title: "Script Learning",
    desc: "Learn Masaram Gondi Script — vowels, consonants, numbers",
    art: <ScriptArt />,
    ring: "bg-cream-300/60",
    arrow: "bg-forest-600",
  },
  {
    href: "/about",
    title: "Culture & Knowledge",
    desc: "Explore Gondwana culture, language and heritage",
    art: <CultureArt />,
    ring: "bg-terracotta-500/10",
    arrow: "bg-terracotta-600",
  },
];

export function FeatureCards() {
  const rise = ["anim-rise", "anim-rise-1", "anim-rise-2", "anim-rise-3"];
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {CARDS.map((c, i) => (
        <Link
          key={c.title}
          href={c.href}
          className={`group relative overflow-hidden rounded-3xl border border-earth-500/10 bg-white p-5 shadow-card transition hover:-translate-y-1 hover:shadow-lift ${rise[i]}`}
        >
          <span className={`inline-grid place-items-center rounded-2xl p-3 ${c.ring}`}>
            {c.art}
          </span>
          <h3 className="mt-4 font-english text-xl font-bold tracking-tight text-forest-600">{c.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-700">{c.desc}</p>
          <span
            aria-hidden
            className={`absolute bottom-5 right-5 grid h-9 w-9 place-items-center rounded-full text-cream-50 transition group-hover:scale-110 ${c.arrow}`}
          >
            <ArrowRight size={16} />
          </span>
        </Link>
      ))}
    </div>
  );
}
