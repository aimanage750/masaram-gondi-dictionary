"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { OVERVIEW_PARA, OVERVIEW_STATS, DISTRIBUTION_NOTES } from "@/data/culture/overview";
import { STATES } from "@/data/culture/states";
import { REGIONS } from "@/data/culture/regions";
import { FESTIVALS } from "@/data/culture/festivals";
import { ART_ITEMS } from "@/data/culture/art";
import { PLACES, SACRED_PLACES } from "@/data/culture/places";
import { HERITAGE } from "@/data/culture/heritage";
import { devanagariToMasaram } from "@/lib/mapping/masaram";
import { StateExplorer } from "./StateExplorer";
import { GondiSection } from "./GondiSection";
import { SourceBadge } from "./SourceBadge";
import {
  ArtCard,
  FestivalCard,
  HeritageCard,
  MetaPill,
  PlaceCard,
  RegionCard,
  SacredCard,
} from "./CultureCards";

type Tab =
  | "overview"
  | "states"
  | "gondi"
  | "festivals"
  | "art"
  | "places"
  | "sacred"
  | "heritage"
  | "regions"
  | "preserve";

const TABS: { id: Tab; label: string; label_hi: string }[] = [
  { id: "overview", label: "Overview", label_hi: "परिचय" },
  { id: "states", label: "States", label_hi: "राज्यवार" },
  { id: "gondi", label: "Gondi & Scripts", label_hi: "गोंडी व लिपियाँ" },
  { id: "festivals", label: "Festivals", label_hi: "पर्व-त्योहार" },
  { id: "art", label: "Art & Music", label_hi: "कला-संगीत" },
  { id: "places", label: "Places", label_hi: "दर्शनीय स्थल" },
  { id: "sacred", label: "Sacred Places", label_hi: "पवित्र स्थल" },
  { id: "heritage", label: "Heritage", label_hi: "विरासत" },
  { id: "regions", label: "Regions", label_hi: "सांस्कृतिक क्षेत्र" },
  { id: "preserve", label: "Preservation", label_hi: "भाषा संरक्षण" },
];

interface Hit {
  title: string;
  sub: string;
  tab: Tab;
}

export function CulturePortal() {
  const [tab, setTab] = useState<Tab>("overview");
  const [q, setQ] = useState("");

  const index = useMemo<Hit[]>(() => {
    const hits: Hit[] = [];
    for (const s of STATES)
      hits.push({ title: s.state, sub: `State · ST ${s.st_percent !== null ? s.st_percent + "%" : "—"} · ${s.major_communities.join(", ")}`, tab: "states" });
    for (const f of FESTIVALS) hits.push({ title: f.name, sub: `Festival · ${f.community} · ${f.state}`, tab: "festivals" });
    for (const a of ART_ITEMS) hits.push({ title: a.name, sub: `Art/${a.category} · ${a.community} · ${a.state}`, tab: "art" });
    for (const p of PLACES) hits.push({ title: p.name, sub: `Place · ${p.type} · ${p.state}`, tab: "places" });
    for (const sp of SACRED_PLACES) hits.push({ title: sp.name, sub: `Sacred place · ${sp.state}`, tab: "sacred" });
    for (const h of HERITAGE) hits.push({ title: h.title, sub: `Heritage · ${h.kind}`, tab: "heritage" });
    for (const r of REGIONS) hits.push({ title: `${r.name_en} / ${r.name_hi}`, sub: `Region · ${r.communities.slice(0, 4).join(", ")}`, tab: "regions" });
    return hits;
  }, []);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [];
    return index
      .filter((h) => `${h.title} ${h.sub}`.toLowerCase().includes(query))
      .slice(0, 14);
  }, [q, index]);

  function go(h: Hit) {
    setTab(h.tab);
    setQ("");
  }

  return (
    <div>
      {/* Global search */}
      <div className="relative mx-auto max-w-2xl">
        <Search size={17} aria-hidden className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-700/50" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search: state, tribe, language, festival, place, temple, region, script…"
          aria-label="Search culture and knowledge content"
          className="w-full rounded-2xl border border-earth-500/15 bg-white py-3.5 pl-11 pr-4 font-sans text-base text-ink-800 shadow-card outline-none placeholder:text-ink-700/45 focus:ring-2 focus:ring-terracotta-500/40"
        />
        {q.trim() && (
          <ul
            role="listbox"
            aria-label="Search results"
            className="absolute z-20 mt-2 max-h-80 w-full overflow-auto rounded-2xl border border-earth-500/15 bg-white shadow-lift"
          >
            {results.length === 0 && (
              <li className="px-4 py-3 text-sm font-deva text-ink-700">कोई परिणाम नहीं — verified data में नहीं मिला।</li>
            )}
            {results.map((h, i) => (
              <li key={`${h.tab}-${h.title}-${i}`}>
                <button
                  type="button"
                  onClick={() => go(h)}
                  className="w-full px-4 py-2.5 text-left hover:bg-cream-100 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-terracotta-500"
                >
                  <span className="block font-english text-sm font-semibold text-ink-800">{h.title}</span>
                  <span className="block text-xs text-ink-700/70">{h.sub}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Tabs */}
      <div role="tablist" aria-label="Culture and knowledge sections" className="mt-6 flex gap-1.5 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => {
              setTab(t.id);
              setQ("");
            }}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500 ${
              tab === t.id
                ? "bg-terracotta-500 text-cream-50 shadow-card"
                : "bg-white text-ink-800 hover:bg-cream-200"
            }`}
          >
            {t.label} <span className="font-deva text-xs opacity-80">· {t.label_hi}</span>
          </button>
        ))}
      </div>

      <div className="mt-8" role="tabpanel">
        {tab === "overview" && <Overview />}
        {tab === "states" && (
          <section aria-label="राज्यवार आदिवासी जनसंख्या">
            <h2 className="font-deva text-2xl font-bold text-forest-600">राज्यवार आदिवासी जनसंख्या</h2>
            <p className="mt-1 text-sm text-ink-700">State-wise tribal population — Census of India 2011.</p>
            <div className="mt-5">
              <StateExplorer />
            </div>
          </section>
        )}
        {tab === "gondi" && (
          <section aria-label="राज्यवार गोंडी भाषा एवं लिपियाँ">
            <h2 className="font-deva text-2xl font-bold text-forest-600">राज्यवार गोंडी भाषा · गोंडी लिपियाँ</h2>
            <div className="mt-5">
              <GondiSection />
            </div>
          </section>
        )}
        {tab === "festivals" && (
          <Grid title="आदिवासी पर्व एवं त्योहार" note="हर पर्व विशिष्ट समुदाय/क्षेत्र से जुड़ा है — सभी जनजातियों का साझा पर्व मानना सही नहीं।">
            {FESTIVALS.map((f) => (
              <FestivalCard key={f.name} f={f} />
            ))}
          </Grid>
        )}
        {tab === "art" && (
          <Grid title="आदिवासी कला, नृत्य एवं संगीत" note="चित्रकला, नृत्य, वाद्य, धातु-शिल्प और वास्तुकला की परंपराएँ।">
            {ART_ITEMS.map((a) => (
              <ArtCard key={a.name} a={a} />
            ))}
          </Grid>
        )}
        {tab === "places" && (
          <Grid title="भारत के दर्शनीय एवं सांस्कृतिक स्थल" note="जनजातीय विरासत, वन, संग्रहालय और सांस्कृतिक परिदृश्य।">
            {PLACES.map((p) => (
              <PlaceCard key={p.name} p={p} />
            ))}
          </Grid>
        )}
        {tab === "sacred" && (
          <Grid
            title="प्रमुख मंदिर एवं पवित्र स्थल"
            note="समुदायों की अपनी परिभाषाएँ — हर पवित्र स्थल 'मंदिर' नहीं होता; वन-खंड (sacred groves) अलग परंपरा हैं।"
          >
            {SACRED_PLACES.map((s) => (
              <SacredCard key={s.name} s={s} />
            ))}
          </Grid>
        )}
        {tab === "heritage" && (
          <Grid title="आदिवासी इतिहास एवं विरासत" note="व्यक्तित्व, राज्य, आंदोलन, संस्थाएँ और मील के पत्थर — स्रोत-सहित।">
            {HERITAGE.map((h) => (
              <HeritageCard key={h.title} h={h} />
            ))}
          </Grid>
        )}
        {tab === "regions" && (
          <Grid title="भारत के प्रमुख आदिवासी सांस्कृतिक क्षेत्र" note="सूचनात्मक समूहन — आधिकारिक वर्गीकरण नहीं।">
            {REGIONS.map((r) => (
              <RegionCard key={r.id} r={r} />
            ))}
          </Grid>
        )}
        {tab === "preserve" && <Preserve />}
      </div>

      {/* Sources & data note */}
      <section className="mt-12 rounded-2xl border border-earth-500/10 bg-cream-100/70 p-5">
        <h2 className="font-english text-sm font-bold uppercase tracking-wide text-earth-500">
          Sources &amp; Data Note
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-ink-700/80">
          Information on this page is compiled from government publications (Census of India
          2011, Ministry of Tribal Affairs, state compilations), official cultural/tourism
          sources, research publications and other publicly available references. Population
          figures and other statistics are shown with their source year and should not be
          interpreted as current estimates unless explicitly stated. Where only secondary
          sources exist, they are labelled as such.
        </p>
      </section>
    </div>
  );
}

function Overview() {
  return (
    <div className="space-y-8">
      <p className="max-w-4xl font-deva text-base leading-relaxed text-ink-700">{OVERVIEW_PARA}</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {OVERVIEW_STATS.map((s) => (
          <div key={s.label_en} className="rounded-2xl border border-earth-500/10 bg-white p-5 shadow-card">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-earth-500">{s.label_en}</p>
            <p className="font-deva text-xs text-ink-700/70">{s.label_hi}</p>
            <p className="mt-2 font-english text-2xl font-bold tracking-tight text-forest-600">{s.value}</p>
            <p className="text-xs text-ink-700/70">{s.value_note}</p>
            <SourceBadge s={s} className="mt-2" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {DISTRIBUTION_NOTES.map((n) => (
          <div key={n.heading} className="rounded-2xl border border-earth-500/10 bg-white p-5 shadow-card">
            <h3 className="font-english text-base font-bold text-forest-600">{n.heading}</h3>
            <p className="font-deva text-sm text-terracotta-500">{n.heading_hi}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-700">{n.text}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-ink-700/60">
        <MetaPill>2011 = latest published Census of India</MetaPill>{" "}
        <span className="ml-1">नया जनगणना डेटा प्रकाशित होने पर यह अनुभाग अद्यतन होगा।</span>
      </p>
    </div>
  );
}

function Grid({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section aria-label={title}>
      <h2 className="font-deva text-2xl font-bold text-forest-600">{title}</h2>
      {note && <p className="mt-1 max-w-3xl text-sm text-ink-700">{note}</p>}
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{children}</div>
    </section>
  );
}

function Preserve() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="rounded-2xl border border-earth-500/10 bg-white p-6 shadow-card">
        <h2 className="font-deva text-2xl font-bold text-forest-600">भाषा संरक्षण एवं डिजिटल विरासत</h2>
        <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-700">
          <p>
            Every indigenous language carries a unique knowledge system — of forests, medicine,
            kinship, song and cosmology. When a language loses speakers, that knowledge is lost
            with it. Gondi, despite millions of Gond people, recorded only ~2.98 million mother-tongue
            speakers in 2011: language shift is real and urgent.
          </p>
          <p>
            Digital tools change the equation: Unicode encoding (Masaram Gondi, 2017) makes the
            script usable on phones and the web; open dictionaries, converters and keyboards turn
            a heritage script into a living, daily-use script; and community participation keeps
            every entry honest.
          </p>
          <p>
            This project follows one rule: <strong>nothing invented</strong>. Words come from the
            uploaded book <em>गोंडी करीयाट (गोंडी सिखाएं)</em>; grammar sections stay marked
            pending until verified sources arrive.
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link href="/contribute" className="rounded-full bg-terracotta-500 px-4 py-2 text-sm font-semibold text-cream-50 hover:bg-terracotta-600">
            शब्द सुझाएँ · Contribute
          </Link>
          <Link href="/script" className="rounded-full border border-terracotta-500/40 px-4 py-2 text-sm font-semibold text-terracotta-600 hover:bg-terracotta-500/10">
            लिपि सीखें · Learn the script
          </Link>
        </div>
      </div>
      <div className="rounded-2xl border border-gold-500/25 bg-forest-900 p-6 text-cream-100">
        <h3 className="font-english text-lg font-bold text-cream-50">How preservation works here</h3>
        <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-cream-200/85">
          <li>• Unicode-first: real {devanagariToMasaram("गोंडी करीयाट")} text everywhere, never images.</li>
          <li>• Source-tagged entries: every word carries its book page.</li>
          <li>• Offline-capable: PWA keeps the dictionary usable without internet.</li>
          <li>• Community review: suggestions pass admin review before publishing.</li>
          <li>• Open learning: script lessons, keyboard and converter are free.</li>
        </ul>
      </div>
    </div>
  );
}
