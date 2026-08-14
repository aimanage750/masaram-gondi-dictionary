import { listContributions } from "@/lib/data/store";
import { ReviewButtons } from "@/components/admin/ReviewButtons";

export const dynamic = "force-dynamic";

export default async function ContributionsPage() {
  const rows = (await listContributions()) as Array<{
    id: string;
    gondi_pronunciation: string;
    hindi: string;
    english: string;
    status?: string;
    review_status?: string;
    contributor_name?: string;
  }>;

  return (
    <div>
      <h1 className="font-display text-3xl">Contributions</h1>
      <div className="mt-4 space-y-3">
        {rows.length === 0 && <p>No contributions yet.</p>}
        {rows.map((r) => (
          <div key={r.id} className="gond-frame rounded-2xl bg-white p-4">
            <p className="font-deva text-lg">
              {r.gondi_pronunciation} · {r.hindi} · {r.english}
            </p>
            <p className="text-xs text-ink-700/60">
              {r.contributor_name || "anonymous"} · {r.review_status ?? r.status}
            </p>
            {(r.review_status ?? r.status) === "pending" && <ReviewButtons id={r.id} />}
          </div>
        ))}
      </div>
    </div>
  );
}
