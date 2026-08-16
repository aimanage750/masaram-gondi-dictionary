import { notFound } from "next/navigation";
import { getEntry } from "@/lib/data/store";
import { WordForm } from "@/components/admin/WordForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin · Edit Word" };

export default async function AdminEditWordPage({ params }: { params: { id: string } }) {
  const entry = await getEntry(params.id, true);
  if (!entry) notFound();
  return (
    <WordForm
      mode="edit"
      initial={{
        id: entry.id,
        gondi_script: entry.gondi_script,
        gondi_pronunciation: entry.gondi_pronunciation,
        roman_gondi: entry.roman_gondi,
        roman_hindi: entry.roman_hindi,
        hindi: entry.hindi,
        english: entry.english,
        category: entry.category,
        notes: entry.notes,
        source: entry.source,
        source_page: entry.source_page,
        status: entry.status,
        verified: entry.verified,
      }}
    />
  );
}
