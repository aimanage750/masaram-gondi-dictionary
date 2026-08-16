"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown, Eye, Flag } from "lucide-react";
import { ConfirmDialog } from "./ConfirmDialog";
import { useCsrf } from "./useCsrf";

export interface AdminReport {
  id: string;
  dictionary_entry_id: string | null;
  reported_gondi_devanagari: string | null;
  error_types: string[];
  description: string;
  suggested_correction: string | null;
  correct_gondi_devanagari: string | null;
  correct_roman_gondi: string | null;
  correct_masaram_gondi: string | null;
  correct_hindi: string | null;
  correct_english: string | null;
  correct_pronunciation: string | null;
  source_type: string | null;
  source_name: string | null;
  source_author: string | null;
  source_page: string | null;
  source_url: string | null;
  evidence: string | null;
  status: string;
  created_at: string;
}

export interface CurrentEntry {
  id: string;
  gondi_script: string;
  gondi_pronunciation: string;
  roman_gondi: string;
  hindi: string;
  english: string;
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-ochre-500/15 text-earth-500",
  investigating: "bg-terracotta-500/10 text-terracotta-700",
  corrected: "bg-forest-600/10 text-forest-600",
  resolved: "bg-forest-600/10 text-forest-600",
  rejected: "bg-ink-700/10 text-ink-700/70",
  duplicate: "bg-ink-700/10 text-ink-700/70",
};

export function ReportsAdmin({
  reports,
  entries,
}: {
  reports: AdminReport[];
  entries: Record<string, CurrentEntry>;
}) {
  const csrf = useCsrf();
  const [filter, setFilter] = useState("open");
  const [open, setOpen] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [confirmApply, setConfirmApply] = useState<{ report: AdminReport; fields: string[] } | null>(null);

  const rows = useMemo(
    () =>
      reports.filter((r) => {
        if (filter === "all") return true;
        if (filter === "open") return r.status === "pending" || r.status === "investigating";
        return r.status === filter;
      }),
    [reports, filter]
  );

  function notify(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  async function setStatus(id: string, status: string) {
    setBusy(true);
    const res = await fetch(`/api/admin/reports/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, csrf }),
    });
    setBusy(false);
    notify(res.ok ? `✓ ${status}` : "Failed");
    if (res.ok) {
      const r = reports.find((x) => x.id === id);
      if (r) r.status = status;
      setFilter((f) => f);
    }
  }

  async function applyCorrection() {
    if (!confirmApply) return;
    setBusy(true);
    const res = await fetch(`/api/admin/reports/${confirmApply.report.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apply: confirmApply.fields, csrf }),
    });
    setBusy(false);
    setConfirmApply(null);
    if (res.ok) {
      notify("✓ Correction applied — entry updated");
      const r = reports.find((x) => x.id === confirmApply.report.id);
      if (r) r.status = "corrected";
    } else {
      const d = await res.json().catch(() => ({}));
      notify(`Failed: ${d?.error ?? "error"}`);
    }
  }

  function correctableFields(r: AdminReport) {
    const cur = r.dictionary_entry_id ? entries[r.dictionary_entry_id] : undefined;
    return [
      { key: "gondi_devanagari", label: "Gondi Devanagari", from: cur?.gondi_pronunciation ?? null, to: r.correct_gondi_devanagari },
      { key: "roman_gondi", label: "Roman Gondi", from: cur?.roman_gondi ?? null, to: r.correct_roman_gondi },
      { key: "masaram_gondi", label: "Masaram Gondi", from: cur?.gondi_script ?? null, to: r.correct_masaram_gondi },
      { key: "hindi", label: "Hindi", from: cur?.hindi ?? null, to: r.correct_hindi },
      { key: "english", label: "English", from: cur?.english ?? null, to: r.correct_english },
      { key: "pronunciation", label: "Pronunciation", from: cur?.gondi_pronunciation ?? null, to: r.correct_pronunciation },
    ].filter((f) => f.to);
  }

  const chip = "inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-5 py-2 text-xs font-semibold disabled:opacity-50";

  return (
    <div className="mx-auto max-w-6xl">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-english text-2xl font-bold text-forest-600 md:text-3xl">Error Reports</h1>
          <p className="mt-1 text-sm text-ink-700/70">
            Reports never change the dictionary automatically — corrections are explicit and confirmed.
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm text-ink-700/70">
          Status
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-xl border border-earth-500/20 bg-white px-3 py-2.5 text-sm outline-none focus:border-terracotta-500"
          >
            <option value="open">open</option>
            <option value="pending">pending</option>
            <option value="investigating">investigating</option>
            <option value="corrected">corrected</option>
            <option value="resolved">resolved</option>
            <option value="rejected">rejected</option>
            <option value="duplicate">duplicate</option>
            <option value="all">all</option>
          </select>
        </label>
      </header>

      {rows.length === 0 ? (
        <p className="mt-8 flex items-center justify-center gap-2 rounded-3xl border border-earth-500/10 bg-white p-10 text-sm text-ink-700/60 shadow-card">
          <Flag size={16} aria-hidden /> कोई रिपोर्ट नहीं। No reports with this status.
        </p>
      ) : (
        <ul className="mt-5 space-y-3">
          {rows.map((r) => {
            const cur = r.dictionary_entry_id ? entries[r.dictionary_entry_id] : undefined;
            const expanded = open === r.id;
            const fields = correctableFields(r);
            return (
              <li key={r.id} className="rounded-3xl border border-earth-500/10 bg-white p-5 shadow-card">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-deva text-base font-semibold text-ink-800">
                      {r.reported_gondi_devanagari ?? "General report"}
                    </span>
                    <span className="text-xs text-ink-700/60">
                      {r.error_types.join(", ")} · {(r.created_at ?? "").slice(0, 10)}
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[r.status] ?? "bg-ink-700/10 text-ink-700/70"}`}>
                      {r.status}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setOpen(expanded ? null : r.id)}
                    aria-expanded={expanded}
                    className="inline-flex min-h-[36px] items-center gap-1 rounded-full border border-earth-500/25 px-4 py-1.5 text-xs font-semibold text-ink-700 hover:bg-cream-200"
                  >
                    <ChevronDown size={13} aria-hidden className={expanded ? "rotate-180" : ""} />
                    {expanded ? "Close" : "Open"}
                  </button>
                </div>
                <p className="mt-2 text-sm text-ink-700/80">{r.description}</p>

                {expanded && (
                  <div className="mt-4 space-y-4 border-t border-earth-500/10 pt-4">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="rounded-2xl bg-cream-100 p-4 text-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-ink-700/55">Current Dictionary Value</p>
                        {cur ? (
                          <div className="mt-2 space-y-1">
                            <p className="font-gondi text-xl text-forest-600">{cur.gondi_script}</p>
                            <p className="font-deva">{cur.gondi_pronunciation} · {cur.roman_gondi}</p>
                            <p>{cur.hindi} · {cur.english}</p>
                            <Link href={`/word/${cur.id}`} className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-terracotta-600 underline underline-offset-2">
                              <Eye size={11} aria-hidden /> View public page
                            </Link>
                          </div>
                        ) : (
                          <p className="mt-2 text-ink-700/60">Not linked to an entry.</p>
                        )}
                      </div>
                      <div className="rounded-2xl bg-cream-100 p-4 text-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-ink-700/55">Reported Problem & Suggestion</p>
                        <p className="mt-2">{r.description}</p>
                        {r.suggested_correction && (
                          <p className="mt-2 rounded-xl bg-white p-2.5 font-deva text-xs">{r.suggested_correction}</p>
                        )}
                      </div>
                      <div className="rounded-2xl bg-cream-100 p-4 text-sm">
                        <p className="text-xs font-semibold uppercase tracking-wide text-ink-700/55">Source / Evidence</p>
                        {r.source_name ? (
                          <div className="mt-2 space-y-1">
                            <p>{r.source_type}: <strong>{r.source_name}</strong></p>
                            {r.source_author && <p>Author: {r.source_author}</p>}
                            {r.source_page && <p>Page: {r.source_page}</p>}
                            {r.source_url && <p className="break-all">{r.source_url}</p>}
                          </div>
                        ) : (
                          <p className="mt-2 text-ink-700/60">Source not provided</p>
                        )}
                        {r.evidence && <p className="mt-2 text-xs">{r.evidence}</p>}
                      </div>
                    </div>

                    {fields.length > 0 && (
                      <div className="rounded-2xl border border-ochre-500/40 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-earth-500">
                          Suggested Corrections (USER SUGGESTION — not verified)
                        </p>
                        <div className="mt-2 grid gap-2 sm:grid-cols-2">
                          {fields.map((f) => (
                            <p key={f.key} className="text-sm">
                              <span className="text-ink-700/60">{f.label}:</span>{" "}
                              <span className="line-through opacity-60">{f.from ?? "—"}</span> →{" "}
                              <strong className="font-deva">{f.to}</strong>
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                      {fields.length > 0 && (r.status === "pending" || r.status === "investigating") && (
                        <button
                          type="button"
                          onClick={() => setConfirmApply({ report: r, fields: fields.map((f) => f.key) })}
                          disabled={busy}
                          className={`${chip} bg-forest-600 text-cream-50 shadow-card hover:bg-forest-500`}
                        >
                          Correct Dictionary…
                        </button>
                      )}
                      {r.status === "pending" && (
                        <button type="button" disabled={busy} onClick={() => setStatus(r.id, "investigating")} className={`${chip} border border-terracotta-600/30 text-terracotta-700 hover:bg-terracotta-500/10`}>
                          Investigate
                        </button>
                      )}
                      {!["resolved", "rejected", "duplicate", "corrected"].includes(r.status) && (
                        <>
                          <button type="button" disabled={busy} onClick={() => setStatus(r.id, "resolved")} className={`${chip} border border-forest-600/30 text-forest-600 hover:bg-forest-600/10`}>
                            Resolve
                          </button>
                          <button type="button" disabled={busy} onClick={() => setStatus(r.id, "duplicate")} className={`${chip} border border-earth-500/25 text-ink-700 hover:bg-cream-200`}>
                            Mark Duplicate
                          </button>
                          <button type="button" disabled={busy} onClick={() => setStatus(r.id, "rejected")} className={`${chip} border border-earth-500/25 text-ink-700 hover:bg-cream-200`}>
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDialog
        open={!!confirmApply}
        busy={busy}
        title="Apply correction to the dictionary?"
        confirmLabel="Apply Correction"
        message={
          confirmApply && (
            <>
              The following user-suggested changes will be written to the{" "}
              <strong>live dictionary entry</strong>: {confirmApply.fields.join(", ")}. This action
              is audited. Confirm you have verified the correction against a source.
            </>
          )
        }
        onConfirm={applyCorrection}
        onCancel={() => setConfirmApply(null)}
      />

      <div aria-live="polite" role="status" className={`pointer-events-none fixed bottom-5 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink-900 px-4 py-2 text-sm text-cream-50 transition-opacity ${toast ? "opacity-100" : "opacity-0"}`}>
        {toast ?? ""}
      </div>
    </div>
  );
}
