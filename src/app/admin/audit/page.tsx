import { FileSearch } from "lucide-react";
import { listAudit } from "@/lib/data/store";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin · Audit Log" };

const ACTION_TONES: Record<string, string> = {
  WORD_CREATED: "bg-forest-600/10 text-forest-600",
  WORD_UPDATED: "bg-terracotta-500/10 text-terracotta-700",
  WORD_PUBLISHED: "bg-forest-600/10 text-forest-600",
  WORD_ARCHIVED: "bg-ink-700/10 text-ink-700/70",
  WORD_VERIFIED: "bg-forest-600/10 text-forest-600",
  CONTRIBUTION_PUBLISHED: "bg-forest-600/10 text-forest-600",
  CONTRIBUTION_MERGED: "bg-ochre-500/15 text-earth-500",
  REPORT_CORRECTED: "bg-terracotta-500/10 text-terracotta-700",
  CSV_IMPORTED: "bg-ochre-500/15 text-earth-500",
};

export default async function AuditPage() {
  const rows = await listAudit();
  return (
    <div className="mx-auto max-w-5xl">
      <header>
        <h1 className="font-english text-2xl font-bold text-forest-600 md:text-3xl">Audit Log</h1>
        <p className="mt-1 text-sm text-ink-700/70">
          Who changed what, and when. OAuth tokens and passwords are never recorded.
        </p>
      </header>

      {rows.length === 0 ? (
        <p className="mt-8 flex items-center justify-center gap-2 rounded-3xl border border-earth-500/10 bg-white p-10 text-sm text-ink-700/60 shadow-card">
          <FileSearch size={16} aria-hidden /> कोई ऑडिट इवेंट नहीं। No audit events yet.
        </p>
      ) : (
        <div className="mt-5 overflow-x-auto rounded-3xl border border-earth-500/10 bg-white shadow-card">
          <table className="w-full min-w-[680px] border-collapse text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-terracotta-700">
                <th scope="col" className="border-b border-ink-800/15 px-3 py-2.5 font-semibold">Action</th>
                <th scope="col" className="border-b border-ink-800/15 px-3 py-2.5 font-semibold">Entity</th>
                <th scope="col" className="border-b border-ink-800/15 px-3 py-2.5 font-semibold">Detail</th>
                <th scope="col" className="border-b border-ink-800/15 px-3 py-2.5 font-semibold">Admin</th>
                <th scope="col" className="border-b border-ink-800/15 px-3 py-2.5 font-semibold">When</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="odd:bg-cream-100/40">
                  <td className="border-b border-ink-800/10 px-3 py-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${ACTION_TONES[r.action] ?? "bg-cream-200 text-ink-700"}`}>
                      {r.action}
                    </span>
                  </td>
                  <td className="border-b border-ink-800/10 px-3 py-2 text-xs text-ink-700/80">
                    {r.entity_type}
                    {r.entity_id ? ` · ${r.entity_id}` : ""}
                  </td>
                  <td className="border-b border-ink-800/10 px-3 py-2 text-xs text-ink-700/80">{r.detail}</td>
                  <td className="border-b border-ink-800/10 px-3 py-2 text-xs">{r.actor}</td>
                  <td className="border-b border-ink-800/10 px-3 py-2 text-xs text-ink-700/60">
                    {(r.created_at ?? "").replace("T", " ").slice(0, 16)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
