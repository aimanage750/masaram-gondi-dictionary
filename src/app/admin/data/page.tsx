import { listEntries } from "@/lib/data/store";
import { DataAdmin } from "@/components/admin/DataAdmin";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin · Data / CSV" };

export default async function AdminDataPage() {
  const entries = await listEntries({ includeUnpublished: true });
  return <DataAdmin entryCount={entries.length} />;
}
