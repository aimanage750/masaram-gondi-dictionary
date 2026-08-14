import { NextRequest, NextResponse } from "next/server";
import { listEntries } from "@/lib/data/store";
import { searchEntries } from "@/lib/search";
import { searchQuerySchema } from "@/lib/validation";
import { clientIp, rateLimit } from "@/lib/security";

export async function GET(req: NextRequest) {
  const ip = clientIp(req.headers);
  const rl = rateLimit(`search:${ip}`, 60, 60_000);
  if (!rl.ok) {
    return NextResponse.json({ error: "Too many searches" }, { status: 429 });
  }
  const url = new URL(req.url);
  const parsed = searchQuerySchema.safeParse({
    q: url.searchParams.get("q") ?? "",
    category: url.searchParams.get("category") ?? undefined,
    limit: url.searchParams.get("limit") ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const entries = await listEntries({ category: parsed.data.category });
  const hits = searchEntries(entries, parsed.data.q, { limit: parsed.data.limit });
  return NextResponse.json({
    results: hits.map((h) => h.entry),
  });
}
