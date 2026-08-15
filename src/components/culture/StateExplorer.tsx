"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import { STATES } from "@/data/culture/states";
import { CENSUS } from "@/data/culture/overview";
import { SourceBadge } from "./SourceBadge";

type SortKey = "st_population" | "st_percent" | "name";

function fmt(n: number): string {
  return n.toLocaleString("en-IN");
}

export function StateExplorer() {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<SortKey>("st_population");
  const [open, setOpen] = useState<string | null>(null);

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    let list = STATES.filter(
      (s) =>
        !query ||
        s.state.toLowerCase().includes(query) ||
        s.major_communities.join(" ").toLowerCase().includes(query) ||
        s.major_regions.join(" ").toLowerCase().includes(query)
    );
    list = [...list].sort((a, b) => {
      if (sort === "name") return a.state.localeCompare(b.state);
      if (sort === "st_percent") return (b.st_percent ?? -1) - (a.st_percent ?? -1);
      return (b.st_population_2011 ?? -1) - (a.st_population_2011 ?? -1);
    });
    return list;
  }, [q, sort]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="sr-only" htmlFor="state-search">
          Search states, communities or regions
        </label>
        <input
          id="state-search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search state / community / region…"
          className="w-full flex-1 rounded-xl border border-earth-500/15 bg-white px-4 py-2.5 text-sm text-ink-800 outline-none placeholder:text-ink-700/45 focus:ring-2 focus:ring-terracotta-500/40"
        />
        <label className="flex items-center gap-2 text-sm text-ink-700">
          Sort by
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-xl border border-earth-500/15 bg-white px-3 py-2.5 text-sm text-ink-800 outline-none focus:ring-2 focus:ring-terracotta-500/40"
          >
            <option value="st_population">ST population (2011)</option>
            <option value="st_percent">ST % of state (2011)</option>
            <option value="name">State name</option>
          </select>
        </label>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-earth-500/10" tabIndex={0} role="group" aria-label="State-wise tribal population table, Census 2011">
        <table className="w-full min-w-[720px] border-collapse bg-white text-left text-sm">
          <thead>
            <tr className="bg-cream-200/70 text-xs font-semibold uppercase tracking-wide text-earth-500">
              <th scope="col" className="px-4 py-3">State / UT</th>
              <th scope="col" className="px-4 py-3">Total population (2011)</th>
              <th scope="col" className="px-4 py-3">ST population (2011)</th>
              <th scope="col" className="px-4 py-3">ST %</th>
              <th scope="col" className="px-4 py-3">Details</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => {
              const isOpen = open === s.state;
              return (
                <FragmentRow
                  key={s.state}
                  state={s.state}
                  total={s.total_population_2011}
                  st={s.st_population_2011}
                  pct={s.st_percent}
                  communities={s.major_communities}
                  regions={s.major_regions}
                  isOpen={isOpen}
                  onToggle={() => setOpen(isOpen ? null : s.state)}
                />
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center font-deva text-ink-700">
                  कोई परिणाम नहीं मिला।
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <SourceBadge s={CENSUS} className="mt-3" />
      <p className="mt-1 text-[11px] text-ink-700/55">
        2011 is the latest published Census of India dataset; figures are not current estimates.
        AP 2011 = undivided Andhra Pradesh including Telangana.
      </p>
    </div>
  );
}

function FragmentRow({
  state,
  total,
  st,
  pct,
  communities,
  regions,
  isOpen,
  onToggle,
}: {
  state: string;
  total: number;
  st: number | null;
  pct: number | null;
  communities: string[];
  regions: string[];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr className="border-t border-earth-500/10">
        <td className="px-4 py-3 font-english font-semibold text-ink-800">{state}</td>
        <td className="px-4 py-3 text-ink-700">{total > 0 ? fmt(total) : "—"}</td>
        <td className="px-4 py-3 text-ink-700">{st !== null ? fmt(st) : "no notified ST"}</td>
        <td className="px-4 py-3 font-semibold text-terracotta-600">
          {pct !== null ? `${pct}%` : "—"}
        </td>
        <td className="px-4 py-3">
          {communities.length > 0 && (
            <button
              type="button"
              onClick={onToggle}
              aria-expanded={isOpen}
              className="inline-flex min-h-[36px] items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-forest-600 hover:bg-cream-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta-500"
            >
              <ChevronDown
                size={14}
                aria-hidden
                className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
              {isOpen ? "Close" : "Communities & regions"}
            </button>
          )}
        </td>
      </tr>
      {isOpen && (
        <tr className="border-t border-earth-500/5 bg-cream-100/60">
          <td colSpan={5} className="px-4 py-3">
            <p className="text-xs text-ink-700">
              <span className="font-semibold text-earth-500">Major communities:</span>{" "}
              {communities.join(", ")}
            </p>
            <p className="mt-1 text-xs text-ink-700">
              <span className="font-semibold text-earth-500">Major regions:</span>{" "}
              {regions.join(", ")}
            </p>
          </td>
        </tr>
      )}
    </>
  );
}
