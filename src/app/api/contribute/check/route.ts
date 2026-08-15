import { NextRequest, NextResponse } from "next/server";
import { listEntries } from "@/lib/data/store";
import { searchEntries } from "@/lib/search";
import { searchQuerySchema } from "@/lib/validation";
import { clientIp, rateLimit } from "@/lib/security";

/** Pre-submission duplicate check for the Contribute form.
 * Returns only public-safe entry fields (toPublic inside searchEntries). */
export async function GET(req: NextRequest) {
  const ip = clientIp(req.headers);
  const rl = rateLimit(`contrib-check:${ip}`, 60, 60 * 60_000);
  if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const url = new URL(req.url);
  const parsed = searchQuerySchema.safeParse({
    q: url.searchParams.get("q") ?? "",
    limit: url.searchParams.get("limit") ?? "5",
  });
  if (!parsed.success) return NextResponse.json({ error: "Invalid query" }, { status: 400 });

  const entries = await listEntries();
  const hits = searchEntries(entries, parsed.data.q, { limit: parsed.data.limit });
  return NextResponse.json({ results: hits.map((h) => h.entry) });
}
