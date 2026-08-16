import { listEntries, listReports } from "@/lib/data/store";
import { ReportsAdmin } from "@/components/admin/ReportsAdmin";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin · Error Reports" };

export default async function AdminReportsPage() {
  const [reports, entries] = await Promise.all([listReports(), listEntries({ includeUnpublished: true })]);
  const entryMap: Record<
    string,
    { id: string; gondi_script: string; gondi_pronunciation: string; roman_gondi: string; hindi: string; english: string }
  > = {};
  for (const e of entries) {
    entryMap[e.id] = {
      id: e.id,
      gondi_script: e.gondi_script,
      gondi_pronunciation: e.gondi_pronunciation,
      roman_gondi: e.roman_gondi,
      hindi: e.hindi,
      english: e.english,
    };
  }
  return <ReportsAdmin reports={reports} entries={entryMap} />;
}
