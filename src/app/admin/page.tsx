import { listAudit, listContributions, listEntries } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const [entries, contrib, audit] = await Promise.all([
    listEntries({ includeUnpublished: true }),
    listContributions(),
    listAudit(),
  ]);
  const published = entries.filter((e) => e.status === "published").length;
  const pending = Array.isArray(contrib)
    ? contrib.filter((c: { status?: string; review_status?: string }) =>
        (c.review_status ?? c.status) === "pending"
      ).length
    : 0;

  return (
    <div>
      <h1 className="font-display text-3xl">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Published entries" value={published} />
        <Stat label="Pending contributions" value={pending} />
        <Stat label="Audit events" value={audit.length} />
      </div>
      <p className="mt-8 max-w-xl text-sm text-ink-700/80">
        Gondi pronunciation is never silently rewritten. Hindi/English may receive obvious
        spelling fixes. New Gondi words require a source.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="gond-frame rounded-2xl bg-white p-5">
      <p className="text-sm text-ink-700/70">{label}</p>
      <p className="font-display text-3xl text-forest-600">{value}</p>
    </div>
  );
}
