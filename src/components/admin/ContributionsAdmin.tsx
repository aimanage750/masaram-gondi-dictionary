"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, ChevronDown, Inbox, Loader2, XCircle } from "lucide-react";
import { ConfirmDialog } from "./ConfirmDialog";
import { useCsrf } from "./useCsrf";

export interface AdminContribution {
  id: string;
  gondi_script: string;
  gondi_pronunciation: string;
  roman_gondi: string;
  roman_hindi: string;
  hindi: string;
  english: string;
  category: string;
  notes: string | null;
  contributor_name?: string;
  review_status: string;
  status: string;
  created_at?: string;
  details?: {
    roman_gondi?: string;
    masaram_gondi?: string;
    hindi_definition?: string;
    english_definition?: string;
    hindi_example?: string;
    english_example?: string;
    gondi_example?: string;
    dialect?: string;
    source_type?: string;
    source_name?: string;
    source_author?: string;
    source_page?: string;
    source_url?: string;
    additional_notes?: string;
  };
}

export interface MergeTarget {
  id: string;
  gondi_pronunciation: string;
  hindi: string;
  english: string;
}

const MERGE_FIELDS = [
  { key: "hindi", label: "Hindi" },
  { key: "english", label: "English" },
  { key: "roman_gondi", label: "Roman Gondi" },
  { key: "roman_hindi", label: "Roman Hindi" },
  { key: "masaram_gondi", label: "Masaram Gondi" },
  { key: "source", label: "Source" },
  { key: "notes", label: "Notes" },
];

export function ContributionsAdmin({
  contributions,
  entries,
}: {
  contributions: AdminContribution[];
  entries: MergeTarget[];
}) {
  const csrf = useCsrf();
  const [filter, setFilter] = useState("pending");
  const [open, setOpen] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [confirmPublish, setConfirmPublish] = useState<AdminContribution | null>(null);
  const [merging, setMerging] = useState<AdminContribution | null>(null);
  const [mergeTarget, setMergeTarget] = useState("");
  const [mergeFields, setMergeFields] = useState<string[]>([]);

  const rows = useMemo(
    () =>
      contributions.filter((c) => {
        const st = c.review_status ?? c.status;
        if (filter === "all") return true;
        return st === filter;
      }),
    [contributions, filter]
  );

  async function act(c: AdminContribution, action: "publish" | "reject" | "merge", extra?: Record<string, unknown>) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/contributions/${c.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, csrf, ...extra }),
      });
      const d = await res.json().catch(() => ({}));
      setToast(res.ok ? `✓ ${action} — done` : `Failed: ${d?.error ?? "error"}`);
      if (res.ok) {
        c.review_status = action === "reject" ? "rejected" : "approved";
        setConfirmPublish(null);
        setMerging(null);
        setMergeFields([]);
        setMergeTarget("");
      }
    } catch {
      setToast("Network error");
    } finally {
      setBusy(false);
      setTimeout(() => setToast(null), 2500);
    }
  }

  const targetEntry = entries.find((e) => e.id === mergeTarget);

  return (
    <div className="mx-auto max-w-6xl">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-english text-2xl font-bold text-forest-600 md:text-3xl">Contributions</h1>
          <p className="mt-1 text-sm text-ink-700/70">
            Public word suggestions. Nothing publishes automatically — every publish is confirmed.
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm text-ink-700/70">
          Status
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border border-earth-500/20 bg-white px-3 py-2.5 text-sm outline-none focus:border-terracotta-500"
          >
            <option value="pending">pending</option>
            <option value="approved">approved</option>
            <option value="rejected">rejected</option>
            <option value="all">all</option>
          </select>
        </label>
      </header>

      {rows.length === 0 ? (
        <p className="mt-8 flex items-center justify-center gap-2 rounded-3xl border border-earth-500/10 bg-white p-10 text-sm text-ink-700/60 shadow-card">
          <Inbox size={16} aria-hidden /> कोई योगदान नहीं। No contributions with this status.
        </p>
      ) : (
        <ul className="mt-5 space-y-3">
          {rows.map((c) => {
            const st = c.review_status ?? c.status;
            const expanded = open === c.id;
            return (
              <li key={c.id} className="rounded-3xl border border-earth-500/10 bg-white p-5 shadow-card">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-gondi text-2xl text-forest-600">{c.gondi_script || "—"}</span>
                    <span className="font-deva text-base text-ink-800">{c.gondi_pronunciation || "—"}</span>
                    <span className="text-sm text-ink-700/70">
                      {c.hindi || "—"} · {c.english || "—"}
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      st === "pending" ? "bg-ochre-500/15 text-earth-500" : st === "approved" ? "bg-forest-600/10 text-forest-600" : "bg-ink-700/10 text-ink-700/70"
                    }`}>
                      {st}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setOpen(expanded ? null : c.id)}
                    aria-expanded={expanded}
                    className="inline-flex min-h-[36px] items-center gap-1 rounded-full border border-earth-500/25 px-4 py-1.5 text-xs font-semibold text-ink-700 hover:bg-cream-200"
                  >
                    <ChevronDown size={13} aria-hidden className={expanded ? "rotate-180" : ""} />
                    {expanded ? "Close" : "Open"}
                  </button>
                </div>

                <p className="mt-2 text-xs text-ink-700/60">
                  Contributor: {c.contributor_name || "anonymous"} · {(c.created_at ?? "").slice(0, 10)} · Category: {c.category}
                </p>

                {expanded && (
                  <div className="mt-4 grid gap-4 border-t border-earth-500/10 pt-4 md:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-ink-700/55">Contributor Data</p>
                      <dl className="mt-2 space-y-1 text-sm">
                        {c.details?.roman_gondi && <p>Roman Gondi: <strong>{c.details.roman_gondi}</strong></p>}
                        {c.details?.masaram_gondi && <p>Masaram: <strong className="font-gondi text-lg">{c.details.masaram_gondi}</strong></p>}
                        {c.roman_gondi && <p>Roman Gondi (derived): {c.roman_gondi}</p>}
                        {c.roman_hindi && <p>Roman Hindi: {c.roman_hindi}</p>}
                        {c.details?.hindi_definition && <p className="font-deva">HI Def: {c.details.hindi_definition}</p>}
                        {c.details?.english_definition && <p>EN Def: {c.details.english_definition}</p>}
                        {c.details?.hindi_example && <p className="font-deva">HI Ex: {c.details.hindi_example}</p>}
                        {c.details?.english_example && <p>EN Ex: {c.details.english_example}</p>}
                        {c.details?.gondi_example && <p className="font-deva">Gondi Ex: {c.details.gondi_example} <em className="text-xs text-earth-500">(needs author verification)</em></p>}
                        {c.details?.dialect && <p>Dialect: {c.details.dialect}</p>}
                        {c.notes && <p>Notes: {c.notes}</p>}
                      </dl>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-ink-700/55">Source</p>
                      <dl className="mt-2 space-y-1 text-sm">
                        {c.details?.source_name ? (
                          <>
                            <p>{c.details.source_type}: <strong>{c.details.source_name}</strong></p>
                            {c.details.source_author && <p>Author: {c.details.source_author}</p>}
                            {c.details.source_page && <p>Page: {c.details.source_page}</p>}
                            {c.details.source_url && <p className="break-all">URL: {c.details.source_url}</p>}
                          </>
                        ) : (
                          <p className="text-ink-700/60">Source not provided</p>
                        )}
                        {c.details?.additional_notes && <p>Evidence: {c.details.additional_notes}</p>}
                      </dl>
                    </div>
                  </div>
                )}

                {st === "pending" && (
                  <div className="mt-4 flex flex-wrap gap-2 border-t border-earth-500/10 pt-4">
                    <button
                      type="button"
                      onClick={() => setConfirmPublish(c)}
                      disabled={busy}
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full bg-forest-600 px-5 py-2 text-xs font-semibold text-cream-50 shadow-card hover:bg-forest-500 disabled:opacity-50"
                    >
                      <CheckCircle2 size={13} aria-hidden /> Approve & Publish…
                    </button>
                    <button
                      type="button"
                      onClick={() => setMerging(c)}
                      disabled={busy}
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-terracotta-600/30 px-5 py-2 text-xs font-semibold text-terracotta-700 hover:bg-terracotta-500/10 disabled:opacity-50"
                    >
                      Merge with Existing…
                    </button>
                    <button
                      type="button"
                      onClick={() => act(c, "reject")}
                      disabled={busy}
                      className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full border border-earth-500/25 px-5 py-2 text-xs font-semibold text-ink-700 hover:bg-cream-200 disabled:opacity-50"
                    >
                      <XCircle size={13} aria-hidden /> Reject
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {/* Publish confirmation */}
      <ConfirmDialog
        open={!!confirmPublish}
        busy={busy}
        title="Publish this entry to the public Dictionary?"
        confirmLabel="Publish"
        message={
          confirmPublish && (
            <>
              <strong className="font-deva">{confirmPublish.gondi_pronunciation}</strong> (
              {confirmPublish.hindi}, {confirmPublish.english}) will become{" "}
              <strong>publicly visible</strong>. Only do this after author verification.
            </>
          )
        }
        onConfirm={() => confirmPublish && act(confirmPublish, "publish")}
        onCancel={() => setConfirmPublish(null)}
      />

      {/* Merge dialog */}
      {merging && (
        <div role="alertdialog" aria-modal="true" aria-label="Merge contribution" className="fixed inset-0 z-50 grid place-items-center p-4">
          <button type="button" aria-label="Cancel merge" onClick={() => setMerging(null)} className="absolute inset-0 bg-ink-900/50" />
          <div className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-earth-500/10 bg-white p-6 shadow-lift">
            <h2 className="font-english text-lg font-bold text-ink-800">Merge with Existing Entry</h2>
            <p className="mt-1 text-sm text-ink-700/70">
              The contribution duplicates an existing word — copy selected fields into the existing
              entry instead of creating a duplicate.
            </p>

            {/* Side by side */}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-cream-100 p-4 text-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-700/55">Contributor Data</p>
                <p className="mt-1 font-deva">{merging.gondi_pronunciation}</p>
                <p>{merging.hindi} · {merging.english}</p>
                {merging.details?.roman_gondi && <p>RG: {merging.details.roman_gondi}</p>}
              </div>
              <div className="rounded-2xl bg-cream-100 p-4 text-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-700/55">Existing Data</p>
                {targetEntry ? (
                  <>
                    <p className="mt-1 font-deva">{targetEntry.gondi_pronunciation}</p>
                    <p>{targetEntry.hindi} · {targetEntry.english}</p>
                  </>
                ) : (
                  <p className="mt-1 text-ink-700/60">Select a target below.</p>
                )}
              </div>
            </div>

            <label className="mt-4 block text-sm font-medium">
              Target entry
              <select
                value={mergeTarget}
                onChange={(e) => setMergeTarget(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-earth-500/20 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-terracotta-500"
              >
                <option value="">— select —</option>
                {entries.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.gondi_pronunciation} · {e.hindi} · {e.english} ({e.id})
                  </option>
                ))}
              </select>
            </label>

            <fieldset className="mt-4">
              <legend className="text-sm font-medium">Fields to copy into the existing entry</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {MERGE_FIELDS.map((f) => {
                  const on = mergeFields.includes(f.key);
                  return (
                    <label key={f.key} className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold ${on ? "border-forest-600 bg-forest-600/10 text-forest-600" : "border-earth-500/20 text-ink-700"}`}>
                      <input
                        type="checkbox"
                        className="h-3.5 w-3.5 accent-forest-600"
                        checked={on}
                        onChange={() =>
                          setMergeFields((prev) => (on ? prev.filter((x) => x !== f.key) : [...prev, f.key]))
                        }
                      />
                      {f.label}
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setMerging(null)} className="inline-flex min-h-[42px] items-center rounded-full border border-earth-500/25 px-5 py-2 text-sm font-semibold text-ink-700 hover:bg-cream-200">
                Cancel
              </button>
              <button
                type="button"
                disabled={busy || !mergeTarget || mergeFields.length === 0}
                onClick={() => act(merging, "merge", { target_entry_id: mergeTarget, fields: mergeFields })}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-terracotta-500 px-5 py-2 text-sm font-semibold text-cream-50 shadow-card hover:bg-terracotta-600 disabled:opacity-50"
              >
                {busy && <Loader2 size={14} aria-hidden className="animate-spin" />}
                Merge Fields
              </button>
            </div>
          </div>
        </div>
      )}

      <div aria-live="polite" role="status" className={`pointer-events-none fixed bottom-5 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink-900 px-4 py-2 text-sm text-cream-50 transition-opacity ${toast ? "opacity-100" : "opacity-0"}`}>
        {toast ?? ""}
      </div>
    </div>
  );
}
