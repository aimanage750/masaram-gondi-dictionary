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
      <h1 className="font-display text-3xl">एडमिन नियंत्रण</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat label="प्रकाशित शब्द" value={published} />
        <Stat label="लंबित सुझाव" value={pending} />
        <Stat label="ऑडिट" value={audit.length} />
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <a href="/admin/scan" className="gond-frame rounded-2xl bg-terracotta-500 p-5 text-cream-50">
          <p className="font-display text-xl">किताब स्कैन</p>
          <p className="mt-1 text-sm text-cream-100">पन्ने की फोटो → जाँच → सेव</p>
        </a>
        <a href="/admin/vakya" className="gond-frame rounded-2xl bg-white p-5">
          <p className="font-display text-xl text-forest-600">वाक्यांश + PDF</p>
          <p className="mt-1 text-sm text-ink-700">किताब का PDF / फोटो देखकर वाक्य जोड़ें</p>
        </a>
      </div>
      <p className="mt-8 max-w-xl font-deva text-sm text-ink-700/80">
        गोंडी उच्चारण किताब जैसा ही रखना है। अनुमान से नया गोंडी शब्द न बनाएँ।
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
