import { listEntries } from "@/lib/data/store";
import { DictionaryAdmin } from "@/components/admin/DictionaryAdmin";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin · Dictionary" };

export default async function AdminDictionaryPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const entries = await listEntries({ includeUnpublished: true });
  const rows = entries.map((e) => ({
    id: e.id,
    gondi_script: e.gondi_script,
    gondi_pronunciation: e.gondi_pronunciation,
    roman_gondi: e.roman_gondi,
    hindi: e.hindi,
    english: e.english,
    category: e.category,
    source: e.source,
    status: e.status,
    verified: e.verified,
  }));
  return (
    <DictionaryAdmin
      entries={rows}
      initialStatus={
        searchParams.status &&
        ["published", "pending", "draft", "rejected", "archived"].includes(searchParams.status)
          ? searchParams.status
          : "all"
      }
    />
  );
}
