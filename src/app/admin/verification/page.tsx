import { listEntries } from "@/lib/data/store";
import { VerificationAdmin } from "@/components/admin/VerificationAdmin";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin · Verification" };

export default async function AdminVerificationPage() {
  const entries = await listEntries({ includeUnpublished: true });
  const queue = entries
    .filter((e) => !e.verified && e.status !== "archived" && e.status !== "rejected")
    .map((e) => ({
      id: e.id,
      gondi_script: e.gondi_script,
      gondi_pronunciation: e.gondi_pronunciation,
      roman_gondi: e.roman_gondi,
      hindi: e.hindi,
      english: e.english,
      source: e.source,
      notes: e.notes,
      status: e.status,
    }));
  return <VerificationAdmin rows={queue} />;
}
