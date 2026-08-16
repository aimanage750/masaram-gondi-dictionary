import { NextResponse } from "next/server";
import Papa from "papaparse";
import { getAdminUser } from "@/lib/auth";
import { listEntries } from "@/lib/data/store";

/** Export the full dictionary as CSV (admin only). */
export async function GET() {
  const user = getAdminUser();
  if (!user) return new NextResponse("Forbidden", { status: 403 });
  const entries = await listEntries({ includeUnpublished: true });
  const rows = entries.map((e) => ({
    id: e.id,
    gondi_pronunciation: e.gondi_pronunciation,
    roman_gondi: e.roman_gondi,
    gondi_script: e.gondi_script,
    hindi: e.hindi,
    roman_hindi: e.roman_hindi,
    english: e.english,
    category: e.category,
    source: e.source,
    source_page: e.source_page ?? "",
    verified: e.verified ? "true" : "false",
    status: e.status,
  }));
  const csv = Papa.unparse(rows);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="masaram-gondi-dictionary-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
