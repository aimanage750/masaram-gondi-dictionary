import { listAudit } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export default async function AuditPage() {
  const rows = await listAudit();
  return (
    <div>
      <h1 className="font-display text-3xl">Audit log</h1>
      <ul className="mt-4 space-y-2 text-sm">
        {rows.map((r) => (
          <li key={r.id} className="rounded-xl bg-white px-3 py-2">
            <span className="text-forest-600">{r.action}</span> · {r.entity_type} · {r.entity_id}{" "}
            · {r.actor} · {r.detail} · {r.created_at}
          </li>
        ))}
      </ul>
    </div>
  );
}
