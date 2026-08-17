import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { assertCsrf } from "@/lib/csrf";
import { rejectDangerous } from "@/lib/validation";
import { enrichRaw } from "@/lib/mapping/enrich";
import { upsertEntry } from "@/lib/data/store";
import { CATEGORY_META } from "@/data/raw-entries";
import { z } from "zod";

const rowSchema = z.object({
  gondi_pronunciation: z.string().trim().min(1).max(200),
  hindi: z.string().trim().min(1).max(200),
  english: z.string().trim().min(1).max(200),
  category: z.string().trim().max(40).optional(),
  source_page: z.string().trim().max(20).optional(),
  notes: z.string().trim().max(500).optional(),
});

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  try {
    await assertCsrf(body.csrf);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 403 });
  }
  const rows = Array.isArray(body.rows) ? body.rows : [];
  if (rows.length === 0 || rows.length > 200) {
    return NextResponse.json({ error: "1–200 rows required" }, { status: 400 });
  }

  let saved = 0;
  const errors: string[] = [];
  for (const raw of rows) {
    const parsed = rowSchema.safeParse(raw);
    if (!parsed.success) {
      errors.push("skipped invalid row");
      continue;
    }
    try {
      rejectDangerous(parsed.data.gondi_pronunciation, "Gondi");
      rejectDangerous(parsed.data.hindi, "Hindi");
      rejectDangerous(parsed.data.english, "English");
    } catch {
      errors.push("skipped unsafe row");
      continue;
    }
    const cat = CATEGORY_META.find((c) => c.slug === (parsed.data.category || "general"));
    const entry = enrichRaw(
      {
        gondi_pronunciation: parsed.data.gondi_pronunciation,
        hindi: parsed.data.hindi,
        english: parsed.data.english,
        category: cat?.slug ?? "general",
        category_hi: cat?.name_hi ?? "",
        source_page: parsed.data.source_page || "scan",
        notes: parsed.data.notes || "admin book scan — human reviewed",
      },
      {
        status: "published",
        verified: true,
        source: "uploaded book photo — admin reviewed",
        created_by: user.id,
      }
    );
    await upsertEntry(entry, user.email);
    saved += 1;
  }

  return NextResponse.json({ saved, skipped: errors.length, errors: errors.slice(0, 8) });
}
