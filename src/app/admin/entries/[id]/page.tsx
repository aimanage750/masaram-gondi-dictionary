import { notFound } from "next/navigation";
import { getEntry } from "@/lib/data/store";
import { EntryForm } from "@/components/admin/EntryForm";

export const dynamic = "force-dynamic";

export default async function EditEntry({ params }: { params: { id: string } }) {
  const entry = await getEntry(params.id, true);
  if (!entry) notFound();
  return (
    <div>
      <h1 className="font-display text-3xl">Edit entry</h1>
      <p className="mt-1 font-mono text-xs text-ink-700/60">{entry.id}</p>
      <EntryForm entry={entry} />
    </div>
  );
}
