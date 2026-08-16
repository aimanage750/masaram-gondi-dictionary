"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Archive, ArchiveRestore, Pencil, PlusCircle, Search } from "lucide-react";
import { ConfirmDialog } from "./ConfirmDialog";
import { useCsrf } from "./useCsrf";
import { normalizeSearch } from "@/lib/mapping/romanize";

export interface AdminEntryRow {
  id: string;
  gondi_script: string;
  gondi_pronunciation: string;
  roman_gondi: string;
  hindi: string;
  english: string;
  category: string;
  source: string;
  status: string;
  verified: boolean;
}

const STATUSES = ["all", "published", "pending", "draft", "rejected", "archived"];

export function DictionaryAdmin({
  entries,
  initialStatus = "all",
}: {
  entries: AdminEntryRow[];
  initialStatus?: string;
}) {
  const csrf = useCsrf();
  const [data, setData] = useState<AdminEntryRow[]>(entries);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState(initialStatus);
  const [verifiedFilter, setVerifiedFilter] = useState("all");
  const [limit, setLimit] = useState(30);
  const [confirm, setConfirm] = useState<{ row: AdminEntryRow; to: "archived" | "published" } | null>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const rows = useMemo(() => {
    const nq = normalizeSearch(q.trim());
    return data.filter((e) => {
      if (status !== "all" && e.status !== status) return false;
      if (verifiedFilter === "yes" && !e.verified) return false;
      if (verifiedFilter === "no" && e.verified) return false;
      if (!nq) return true;
      const hay = normalizeSearch(
        `${e.gondi_pronunciation} ${e.roman_gondi} ${e.hindi} ${e.english} ${e.gondi_script}`
      );
      return hay.includes(nq);
    });
  }, [data, q, status, verifiedFilter]);

  async function patch(id: string, body: Record<string, unknown>) {
    const res = await fetch(`/api/admin/entries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, csrf }),
    });
    return res.ok;
  }

  async function applyConfirm() {
    if (!confirm) return;
    setBusy(true);
    const ok = await patch(confirm.row.id, { status: confirm.to });
    setBusy(false);
    setConfirm(null);
    if (ok) {
      setToast(confirm.to === "archived" ? "Word archived · आर्काइव हुआ" : "Word restored · बहाल हुआ");
      const target = confirm.row.id;
      const nextStatus = confirm.to;
      setData((d) => d.map((e) => (e.id === target ? { ...e, status: nextStatus } : e)));
    } else {
      setToast("Action failed · विफल रहा");
    }
  }

  const selectCls =
    "rounded-xl border border-earth-500/20 bg-white px-3 py-2.5 text-sm text-ink-800 outline-none focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-500/30";

  return (
    <div className="mx-auto max-w-7xl">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-english text-2xl font-bold text-forest-600 md:text-3xl">Dictionary</h1>
          <p className="mt-1 text-sm text-ink-700/70">
            {data.length} total · {rows.length} shown. Edit carefully — published words are live.
          </p>
        </div>
        <Link
          href="/admin/dictionary/new"
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-terracotta-500 px-5 py-2.5 text-sm font-semibold text-cream-50 shadow-card hover:bg-terracotta-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta-500"
        >
          <PlusCircle size={16} aria-hidden /> Add Word
        </Link>
      </header>

      {/* Controls */}
      <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search size={16} aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-700/50" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            type="search"
            placeholder="Search Gondi, Roman, Hindi, English…"
            aria-label="Search dictionary entries"
            className="w-full rounded-xl border border-earth-500/15 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-terracotta-500 focus:ring-2 focus:ring-terracotta-500/30"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-ink-700/70">
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectCls}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm text-ink-700/70">
          Verified
          <select value={verifiedFilter} onChange={(e) => setVerifiedFilter(e.target.value)} className={selectCls}>
            <option value="all">all</option>
            <option value="yes">verified</option>
            <option value="no">unverified</option>
          </select>
        </label>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-x-auto rounded-3xl border border-earth-500/10 bg-white shadow-card">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-terracotta-700">
              <th scope="col" className="border-b border-ink-800/15 px-3 py-2.5 font-semibold">Masaram</th>
              <th scope="col" className="border-b border-ink-800/15 px-3 py-2.5 font-semibold">Gondi</th>
              <th scope="col" className="border-b border-ink-800/15 px-3 py-2.5 font-semibold">Hindi</th>
              <th scope="col" className="border-b border-ink-800/15 px-3 py-2.5 font-semibold">English</th>
              <th scope="col" className="border-b border-ink-800/15 px-3 py-2.5 font-semibold">Category</th>
              <th scope="col" className="border-b border-ink-800/15 px-3 py-2.5 font-semibold">Status</th>
              <th scope="col" className="border-b border-ink-800/15 px-3 py-2.5 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, limit).map((e) => (
              <tr key={e.id} className="odd:bg-cream-100/40">
                <td className="border-b border-ink-800/10 px-3 py-2 font-gondi text-xl text-forest-600">{e.gondi_script}</td>
                <td className="border-b border-ink-800/10 px-3 py-2">
                  <span className="font-deva">{e.gondi_pronunciation}</span>
                  <span className="block text-xs text-ink-700/60">{e.roman_gondi}</span>
                </td>
                <td className="border-b border-ink-800/10 px-3 py-2 font-deva">{e.hindi}</td>
                <td className="border-b border-ink-800/10 px-3 py-2 font-english">{e.english}</td>
                <td className="border-b border-ink-800/10 px-3 py-2 text-xs text-ink-700/70">{e.category}</td>
                <td className="border-b border-ink-800/10 px-3 py-2">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    e.status === "published"
                      ? "bg-forest-600/10 text-forest-600"
                      : e.status === "archived"
                        ? "bg-ink-700/10 text-ink-700/70"
                        : "bg-ochre-500/15 text-earth-500"
                  }`}>
                    {e.status}{e.verified ? " ✓" : ""}
                  </span>
                </td>
                <td className="border-b border-ink-800/10 px-3 py-2">
                  <span className="flex flex-wrap gap-1.5">
                    <Link
                      href={`/admin/dictionary/${e.id}`}
                      aria-label={`Edit ${e.gondi_pronunciation}`}
                      className="inline-flex min-h-[34px] items-center gap-1 rounded-full border border-terracotta-600/30 px-3 py-1 text-xs font-semibold text-terracotta-700 hover:bg-terracotta-500/10"
                    >
                      <Pencil size={12} aria-hidden /> Edit
                    </Link>
                    {e.status !== "archived" ? (
                      <button
                        type="button"
                        onClick={() => setConfirm({ row: e, to: "archived" })}
                        className="inline-flex min-h-[34px] items-center gap-1 rounded-full border border-earth-500/25 px-3 py-1 text-xs font-semibold text-ink-700 hover:bg-cream-200"
                      >
                        <Archive size={12} aria-hidden /> Archive
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirm({ row: e, to: "published" })}
                        className="inline-flex min-h-[34px] items-center gap-1 rounded-full border border-forest-600/30 px-3 py-1 text-xs font-semibold text-forest-600 hover:bg-forest-600/10"
                      >
                        <ArchiveRestore size={12} aria-hidden /> Restore
                      </button>
                    )}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <p className="p-8 text-center text-sm text-ink-700/60">कोई परिणाम नहीं। No matching entries.</p>
        )}
      </div>

      {rows.length > limit && (
        <button
          type="button"
          onClick={() => setLimit((l) => l + 50)}
          className="mt-4 inline-flex min-h-[42px] items-center rounded-full border border-terracotta-600/30 px-6 py-2 text-sm font-semibold text-terracotta-700 hover:bg-terracotta-500/10"
        >
          Show more ({rows.length - limit} remaining)
        </button>
      )}

      <ConfirmDialog
        open={!!confirm}
        busy={busy}
        title={confirm?.to === "archived" ? "Archive this word?" : "Restore this word?"}
        confirmLabel={confirm?.to === "archived" ? "Archive" : "Restore"}
        message={
          confirm && (
            <>
              <strong className="font-deva">{confirm.row.gondi_pronunciation}</strong> (
              {confirm.row.hindi}, {confirm.row.english}) will be{" "}
              {confirm.to === "archived"
                ? "removed from the public dictionary. This is reversible — no data is deleted."
                : "published back to the public dictionary."}
            </>
          )
        }
        onConfirm={applyConfirm}
        onCancel={() => setConfirm(null)}
      />

      <div aria-live="polite" role="status" className={`pointer-events-none fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink-900 px-4 py-2 text-sm text-cream-50 transition-opacity ${toast ? "opacity-100" : "opacity-0"}`}>
        {toast ?? ""}
      </div>
    </div>
  );
}
