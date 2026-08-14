import { NextRequest, NextResponse } from "next/server";
import { contributionSchema, assertPayloadSize, rejectDangerous } from "@/lib/validation";
import { assertCsrf } from "@/lib/csrf";
import { clientIp, rateLimit } from "@/lib/security";
import { addContribution } from "@/lib/data/store";
import { enrichRaw, makeId } from "@/lib/mapping/enrich";

export async function POST(req: NextRequest) {
  const ip = clientIp(req.headers);
  const rl = rateLimit(`contrib:${ip}`, 10, 60 * 60_000);
  if (!rl.ok) return NextResponse.json({ error: "Too many contributions" }, { status: 429 });

  const raw = await req.text();
  try {
    assertPayloadSize(raw, 8192);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 413 });
  }
  const parsed = contributionSchema.safeParse(JSON.parse(raw || "{}"));
  if (!parsed.success) return NextResponse.json({ error: "Invalid form" }, { status: 400 });

  try {
    assertCsrf(parsed.data.csrf);
    rejectDangerous(parsed.data.gondi_pronunciation, "Gondi");
    rejectDangerous(parsed.data.hindi, "Hindi");
    rejectDangerous(parsed.data.english, "English");
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 403 });
  }

  const entry = enrichRaw(
    {
      gondi_pronunciation: parsed.data.gondi_pronunciation,
      hindi: parsed.data.hindi,
      english: parsed.data.english,
      category: parsed.data.category || "general",
      category_hi: "",
      source_page: "contribution",
      notes: parsed.data.notes,
    },
    {
      id: makeId(parsed.data.gondi_pronunciation, parsed.data.hindi + Date.now()),
      verified: false,
      status: "pending",
      source: "user-contribution",
    }
  );

  await addContribution({
    ...entry,
    contributor_name: parsed.data.contributor_name,
    contributor_email: parsed.data.contributor_email,
    review_status: "pending",
  });

  return NextResponse.json({ ok: true });
}
