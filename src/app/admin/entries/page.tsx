import Link from "next/link";
import { listEntries } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export default async function AdminEntries({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = (searchParams.q ?? "").toLowerCase();
  const entries = await listEntries({ includeUnpublished: true });
  const filtered = q
    ? entries.filter((e) =>
        `${e.gondi_pronunciation} ${e.hindi} ${e.english} ${e.roman_gondi}`
          .toLowerCase()
          .includes(q)
      )
    : entries;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl">Entries</h1>
        <Link href="/admin/entries/new" className="rounded-xl bg-terracotta-500 px-4 py-2 text-cream-50">
          New entry
        </Link>
      </div>
      <form className="mt-4">
        <input
          name="q"
          defaultValue={searchParams.q}
          placeholder="Filter…"
          className="w-full max-w-md rounded-xl border border-terracotta-500/30 px-3 py-2"
        />
      </form>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-terracotta-500/20 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-cream-200 text-ink-700">
            <tr>
              <th className="px-3 py-2">Masaram</th>
              <th className="px-3 py-2">Pronunciation</th>
              <th className="px-3 py-2">Hindi</th>
              <th className="px-3 py-2">English</th>
              <th className="px-3 py-2">Cat</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 300).map((e) => (
              <tr key={e.id} className="border-t border-cream-200">
                <td className="px-3 py-2 font-gondi text-lg">
                  <Link href={`/admin/entries/${e.id}`} className="text-forest-600">
                    {e.gondi_script}
                  </Link>
                </td>
                <td className="px-3 py-2 font-deva">{e.gondi_pronunciation}</td>
                <td className="px-3 py-2 font-deva">{e.hindi}</td>
                <td className="px-3 py-2">{e.english}</td>
                <td className="px-3 py-2 text-ink-700/70">{e.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
