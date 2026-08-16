import Link from "next/link";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  Database,
  FileEdit,
  Inbox,
  Library,
} from "lucide-react";
import { listContributions, listEntries, listReports, listSources } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export const metadata = { title: "Admin Dashboard" };

function Stat({
  label,
  value,
  href,
  Icon,
  tone = "forest",
}: {
  label: string;
  value: number | string;
  href: string;
  Icon: typeof BookOpen;
  tone?: "forest" | "terracotta" | "ochre";
}) {
  const tones = {
    forest: "text-forest-600 bg-forest-600/10",
    terracotta: "text-terracotta-600 bg-terracotta-500/10",
    ochre: "text-earth-500 bg-ochre-500/15",
  } as const;
  return (
    <Link
      href={href}
      className="group rounded-3xl border border-earth-500/10 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:border-terracotta-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-terracotta-500"
    >
      <span className={`inline-grid h-10 w-10 place-items-center rounded-2xl ${tones[tone]}`}>
        <Icon size={18} aria-hidden />
      </span>
      <p className="mt-3 font-english text-3xl font-bold text-ink-800">{value}</p>
      <p className="mt-0.5 text-sm font-medium text-ink-700/70">{label}</p>
    </Link>
  );
}

export default async function AdminDashboard() {
  const [entries, contributions, reports, sources] = await Promise.all([
    listEntries({ includeUnpublished: true }),
    listContributions(),
    listReports(),
    listSources().catch(() => []),
  ]);

  const published = entries.filter((e) => e.status === "published").length;
  const drafts = entries.filter((e) => e.status === "draft").length;
  const archived = entries.filter((e) => e.status === "archived").length;
  const pendingContribs = contributions.filter(
    (c) => (c.review_status ?? c.status) === "pending"
  ).length;
  const pendingReports = reports.filter(
    (r) => r.status === "pending" || r.status === "investigating"
  ).length;
  const needsVerification = entries.filter((e) => !e.verified && e.status !== "archived").length;

  const recentEntries = [...entries]
    .sort((a, b) => (b.updated_at ?? "").localeCompare(a.updated_at ?? ""))
    .slice(0, 6);
  const recentReports = reports.slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl">
      <header>
        <h1 className="font-english text-2xl font-bold text-forest-600 md:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-ink-700/70">
          Dictionary health, pending reviews and verification at a glance.
        </p>
      </header>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Dictionary Words" value={published} href="/admin/dictionary" Icon={BookOpen} />
        <Stat
          label="Pending Contributions"
          value={pendingContribs}
          href="/admin/contributions"
          Icon={Inbox}
          tone="terracotta"
        />
        <Stat
          label="Pending Reports"
          value={pendingReports}
          href="/admin/reports"
          Icon={AlertTriangle}
          tone="ochre"
        />
        <Stat
          label="Needs Verification"
          value={needsVerification}
          href="/admin/verification"
          Icon={CheckCircle2}
          tone="terracotta"
        />
        <Stat label="Sources" value={sources.length} href="/admin/sources" Icon={Library} />
        <Stat label="Drafts" value={drafts} href="/admin/dictionary?status=draft" Icon={FileEdit} />
        <Stat label="Archived" value={archived} href="/admin/dictionary?status=archived" Icon={Database} />
        <Stat label="Total Records" value={entries.length} href="/admin/data" Icon={Database} />
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <section className="rounded-3xl border border-earth-500/10 bg-white p-5 shadow-card">
          <h2 className="font-english text-base font-bold text-forest-600">Recently Updated Words</h2>
          <ul className="mt-3 divide-y divide-earth-500/10">
            {recentEntries.map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-3 py-2.5">
                <span className="flex min-w-0 items-baseline gap-3">
                  <span className="font-gondi text-lg text-forest-600">{e.gondi_script}</span>
                  <span className="truncate font-deva text-sm text-ink-800">
                    {e.gondi_pronunciation} · {e.hindi}
                  </span>
                </span>
                <span className="shrink-0 rounded-full bg-cream-200 px-2.5 py-0.5 text-[11px] font-semibold text-ink-700">
                  {e.status}
                  {e.verified ? " · ✓" : ""}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border border-earth-500/10 bg-white p-5 shadow-card">
          <h2 className="font-english text-base font-bold text-forest-600">Latest Error Reports</h2>
          {recentReports.length === 0 ? (
            <p className="mt-3 text-sm text-ink-700/60">कोई रिपोर्ट नहीं। No reports yet.</p>
          ) : (
            <ul className="mt-3 divide-y divide-earth-500/10">
              {recentReports.map((r) => (
                <li key={r.id} className="py-2.5">
                  <Link href="/admin/reports" className="block hover:underline">
                    <span className="font-deva text-sm text-ink-800">
                      {r.reported_gondi_devanagari ?? "General"} —{" "}
                      {r.error_types.slice(0, 2).join(", ")}
                    </span>
                    <span className="mt-0.5 block truncate text-xs text-ink-700/60">
                      {r.description}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
