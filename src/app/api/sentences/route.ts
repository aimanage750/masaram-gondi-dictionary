import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { assertCsrf } from "@/lib/csrf";
import { rejectDangerous, sentenceSchema } from "@/lib/validation";
import { enrichSentence, toPublicSentence } from "@/lib/mapping/enrich";
import { listSentences, upsertSentence } from "@/lib/data/store";

export async function GET() {
  const rows = await listSentences(false);
  return NextResponse.json({ sentences: rows.map(toPublicSentence) });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  try {
    assertCsrf(body.csrf);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 403 });
  }
  const parsed = sentenceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "गोंडी, हिन्दी और English तीनों चाहिए" }, { status: 400 });
  }
  try {
    rejectDangerous(parsed.data.gondi_pronunciation, "Gondi");
    rejectDangerous(parsed.data.hindi, "Hindi");
    rejectDangerous(parsed.data.english, "English");
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 403 });
  }
  const sentence = enrichSentence(parsed.data, {
    created_by: user.id,
    source: "admin PDF/book — human reviewed",
    verified: true,
    status: "published",
  });
  await upsertSentence(sentence, user.email);
  return NextResponse.json({ id: sentence.id });
}
