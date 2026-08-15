import type {
  ArtItem,
  Festival,
  HeritageItem,
  Place,
  RegionInfo,
  SacredPlace,
} from "@/data/culture/types";
import { SourceBadge } from "./SourceBadge";

export function CardShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <article
      className={`flex h-full flex-col rounded-2xl border border-earth-500/10 bg-white p-5 shadow-card ${className}`}
    >
      {children}
    </article>
  );
}

export function MetaPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-cream-200 px-2.5 py-0.5 text-[11px] font-medium text-earth-500">
      {children}
    </span>
  );
}

export function FestivalCard({ f }: { f: Festival }) {
  return (
    <CardShell>
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-english text-lg font-bold text-forest-600">{f.name}</h3>
        {f.name_hi && <span className="font-deva text-base text-terracotta-500">{f.name_hi}</span>}
      </div>
      <p className="mt-1.5 flex flex-wrap gap-1.5">
        <MetaPill>{f.community}</MetaPill>
        <MetaPill>{f.state}</MetaPill>
        {f.season && <MetaPill>{f.season}</MetaPill>}
      </p>
      {f.meaning && <p className="mt-3 text-sm leading-relaxed text-ink-700">{f.meaning}</p>}
      {f.activities && (
        <p className="mt-2 text-xs text-ink-700/70">
          <span className="font-semibold text-earth-500">Traditions:</span> {f.activities}
        </p>
      )}
      <SourceBadge s={f.source} className="mt-auto pt-3" />
    </CardShell>
  );
}

const ART_LABEL: Record<ArtItem["category"], string> = {
  painting: "Painting",
  dance: "Dance",
  music: "Music",
  craft: "Craft",
  textile: "Textile",
  metal: "Metal work",
  architecture: "Architecture",
};

export function ArtCard({ a }: { a: ArtItem }) {
  return (
    <CardShell>
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-english text-lg font-bold text-forest-600">{a.name}</h3>
        <MetaPill>{ART_LABEL[a.category]}</MetaPill>
      </div>
      <p className="mt-1.5 flex flex-wrap gap-1.5">
        <MetaPill>{a.community}</MetaPill>
        <MetaPill>{a.state}</MetaPill>
      </p>
      <p className="mt-3 text-sm leading-relaxed text-ink-700">{a.description}</p>
      <SourceBadge s={a.source} className="mt-auto pt-3" />
    </CardShell>
  );
}

export function PlaceCard({ p }: { p: Place }) {
  return (
    <CardShell>
      <h3 className="font-english text-lg font-bold text-forest-600">{p.name}</h3>
      <p className="mt-1.5 flex flex-wrap gap-1.5">
        <MetaPill>{p.state}</MetaPill>
        {p.district && <MetaPill>{p.district}</MetaPill>}
        <MetaPill>{p.type}</MetaPill>
      </p>
      <p className="mt-3 text-sm leading-relaxed text-ink-700">{p.why}</p>
      <p className="mt-2 text-xs text-ink-700/70">
        <span className="font-semibold text-earth-500">Cultural connection:</span> {p.connection}
      </p>
      <SourceBadge s={p.source} className="mt-auto pt-3" />
    </CardShell>
  );
}

export function SacredCard({ s }: { s: SacredPlace }) {
  return (
    <CardShell>
      <h3 className="font-english text-lg font-bold text-forest-600">{s.name}</h3>
      <p className="mt-1.5 flex flex-wrap gap-1.5">
        <MetaPill>{s.state}</MetaPill>
      </p>
      <p className="mt-3 text-sm leading-relaxed text-ink-700">{s.significance}</p>
      <p className="mt-2 text-xs text-ink-700/70">
        <span className="font-semibold text-earth-500">Association:</span> {s.association}
      </p>
      {s.terminology_note && (
        <p className="mt-2 rounded-lg bg-cream-100 px-3 py-1.5 text-xs text-ink-700/70">
          {s.terminology_note}
        </p>
      )}
      <SourceBadge s={s.source} className="mt-auto pt-3" />
    </CardShell>
  );
}

const KIND_LABEL: Record<HeritageItem["kind"], string> = {
  person: "Historical figure",
  movement: "Movement / kingdom",
  institution: "Institution",
  milestone: "Milestone",
};

export function HeritageCard({ h }: { h: HeritageItem }) {
  return (
    <CardShell>
      <MetaPill>{KIND_LABEL[h.kind]}</MetaPill>
      <h3 className="mt-2 font-english text-lg font-bold text-forest-600">{h.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-700">{h.description}</p>
      <SourceBadge s={h.source} className="mt-auto pt-3" />
    </CardShell>
  );
}

export function RegionCard({ r }: { r: RegionInfo }) {
  return (
    <CardShell>
      <div className="flex flex-wrap items-baseline gap-2">
        <h3 className="font-english text-lg font-bold text-forest-600">{r.name_en}</h3>
        <span className="font-deva text-base text-terracotta-500">{r.name_hi}</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-ink-700">{r.description}</p>
      <p className="mt-3 text-xs text-ink-700/70">
        <span className="font-semibold text-earth-500">States:</span> {r.states.join(", ")}
      </p>
      <p className="mt-1 text-xs text-ink-700/70">
        <span className="font-semibold text-earth-500">Communities:</span> {r.communities.join(", ")}
      </p>
      <p className="mt-2 text-[11px] text-ink-700/50">Broad cultural region — not an official classification.</p>
    </CardShell>
  );
}
