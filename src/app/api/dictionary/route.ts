import { NextResponse } from "next/server";
import { listEntries } from "@/lib/data/store";
import { toPublic } from "@/lib/mapping/enrich";

export const dynamic = "force-dynamic";

/** Public dump — 4 fields only — used by the PWA cache. */
export async function GET() {
  const entries = await listEntries();
  return NextResponse.json(
    { entries: entries.map((e) => toPublic(e)) },
    { headers: { "Cache-Control": "public, max-age=300" } }
  );
}
