import { NextRequest, NextResponse } from "next/server";
import { countOpenReports } from "@/lib/data/store";
import { clientIp, rateLimit } from "@/lib/security";

/** Duplicate-report check: how many open reports exist for one entry.
 * Returns a count only — never reporter data or report contents. */
export async function GET(req: NextRequest) {
  const ip = clientIp(req.headers);
  const rl = rateLimit(`report-check:${ip}`, 60, 60 * 60_000);
  if (!rl.ok) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const word = new URL(req.url).searchParams.get("word") ?? "";
  if (!/^[a-z0-9]{2,24}$/i.test(word)) {
    return NextResponse.json({ error: "Invalid word id" }, { status: 400 });
  }
  try {
    const open = await countOpenReports(word);
    return NextResponse.json({ open });
  } catch {
    return NextResponse.json({ open: 0 });
  }
}
