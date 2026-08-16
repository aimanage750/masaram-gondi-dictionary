"use client";

import { useState } from "react";
import Link from "next/link";
import { BadgeCheck, CheckCircle2, FileQuestion, Pencil, XCircle } from "lucide-react";
import { useCsrf } from "./useCsrf";

export interface VerificationRow {
  id: string;
  gondi_script: string;
  gondi_pronunciation: string;
  roman_gondi: string;
  hindi: string;
  english: string;
  source: string;
  notes: string | null;
  status: string;
}

/** Author verification queue: everything not yet author-verified and not
 * archived. Gondi-side data is NEVER treated as authoritative until a human
 * verifies it here. */
export function VerificationAdmin({ rows }: { rows: VerificationRow[] }) {
  const csrf = useCsrf();
  const [data, setData] = useState(rows);
  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function notify(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }

  async function patch(id: string, body: Record<string, unknown>) {
    setBusy(id);
    const res = await fetch(`/api/admin/entries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, csrf }),
    });
    setBusy(null);
    return res.ok;
  }

  async function verify(r: VerificationRow) {
    if (await patch(r.id, { verified: true })) {
      setData((d) => d.filter((x) => x.id !== r.id));
      notify("✓ Verified · सत्यापित");
    } else notify("Failed");
  }

  async function requestEvidence(r: VerificationRow) {
    if (await patch(r.id, { status: "draft", notes: `${r.notes ? r.notes + " | " : ""}MORE EVIDENCE REQUESTED` })) {
      setData((d) => d.filter((x) => x.id !== r.id));
      notify("Moved to DRAFT — more evidence requested");
    } else notify("Failed");
  }

  async function reject(r: VerificationRow) {
    if (await patch(r.id, { status: "rejected" })) {
      setData((d) => d.filter((x) => x.id !== r.id));
      notify("Rejected · अस्वीकृत");
    } else notify("Failed");
  }

  const chip = "inline-flex min-h-[38px] items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold disabled:opacity-50";

  return (
    <div className="mx-auto max-w-6xl">
      <header>
        <h1 className="font-english text-2xl font-bold text-forest-600 md:text-3xl">Verification</h1>
        <p className="mt-1 text-sm text-ink-700/70">
          AUTHOR VERIFICATION REQUIRED — Gondi word, Roman Gondi, Masaram script, pronunciation and
          Gondi examples are never authoritative until verified here.
        </p>
      </header>

      {data.length === 0 ? (
        <p className="mt-8 flex items-center justify-center gap-2 rounded-3xl border border-earth-500/10 bg-white p-10 text-sm text-ink-700/60 shadow-card">
          <BadgeCheck size={16} aria-hidden /> सब सत्यापित है। Nothing awaiting verification.
        </p>
      ) : (
        <ul className="mt-5 space-y-3">
          {data.map((r) => (
            <li key={r.id} className="rounded-3xl border border-earth-500/10 bg-white p-5 shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-gondi text-2xl text-forest-600">{r.gondi_script}</span>
                  <span className="font-deva text-base text-ink-800">{r.gondi_pronunciation}</span>
                  <span className="text-sm text-ink-700/70">{r.roman_gondi} · {r.hindi} · {r.english}</span>
                  <span className="rounded-full bg-ochre-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-earth-500">
                    {r.status} · unverified
                  </span>
                </span>
              </div>
              <p className="mt-2 text-xs text-ink-700/60">
                SOURCE: {r.source}
                {r.notes && <> · Notes: {r.notes}</>}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" disabled={busy === r.id} onClick={() => verify(r)} className={`${chip} bg-forest-600 text-cream-50 shadow-card hover:bg-forest-500`}>
                  <CheckCircle2 size={13} aria-hidden /> Verify
                </button>
                <Link href={`/admin/dictionary/${r.id}`} className={`${chip} border border-terracotta-600/30 text-terracotta-700 hover:bg-terracotta-500/10`}>
                  <Pencil size={12} aria-hidden /> Edit
                </Link>
                <button type="button" disabled={busy === r.id} onClick={() => requestEvidence(r)} className={`${chip} border border-ochre-500/50 text-earth-500 hover:bg-ochre-500/10`}>
                  <FileQuestion size={13} aria-hidden /> Request More Evidence
                </button>
                <button type="button" disabled={busy === r.id} onClick={() => reject(r)} className={`${chip} border border-earth-500/25 text-ink-700 hover:bg-cream-200`}>
                  <XCircle size={13} aria-hidden /> Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div aria-live="polite" role="status" className={`pointer-events-none fixed bottom-5 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink-900 px-4 py-2 text-sm text-cream-50 transition-opacity ${toast ? "opacity-100" : "opacity-0"}`}>
        {toast ?? ""}
      </div>
    </div>
  );
}
