import { listContributions, listEntries } from "@/lib/data/store";
import { ContributionsAdmin } from "@/components/admin/ContributionsAdmin";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin · Contributions" };

export default async function AdminContributionsPage() {
  const [contributions, entries] = await Promise.all([listContributions(), listEntries()]);
  return (
    <ContributionsAdmin
      contributions={contributions.map((c) => ({
        id: c.id,
        gondi_script: c.gondi_script,
        gondi_pronunciation: c.gondi_pronunciation,
        roman_gondi: c.roman_gondi,
        roman_hindi: c.roman_hindi,
        hindi: c.hindi,
        english: c.english,
        category: c.category,
        notes: c.notes,
        contributor_name: c.contributor_name,
        review_status: c.review_status,
        status: c.status,
        created_at: c.created_at,
        details: c.details,
      }))}
      entries={entries.map((e) => ({
        id: e.id,
        gondi_pronunciation: e.gondi_pronunciation,
        hindi: e.hindi,
        english: e.english,
      }))}
    />
  );
}
