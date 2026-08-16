import { listSources } from "@/lib/data/store";
import { SourcesAdmin } from "@/components/admin/SourcesAdmin";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin · Sources" };

export default async function AdminSourcesPage() {
  const sources = await listSources().catch(() => []);
  return <SourcesAdmin sources={sources} />;
}
