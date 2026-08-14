import { NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";
import { getSessionUser } from "@/lib/auth";
import { assertCsrf } from "@/lib/csrf";
import { rejectDangerous } from "@/lib/validation";
import { enrichRaw } from "@/lib/mapping/enrich";
import { upsertEntry } from "@/lib/data/store";
import { clientIp, rateLimit } from "@/lib/security";

const MAX = 400_000;

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const ip = clientIp(req.headers);
  const rl = rateLimit(`import:${ip}`, 5, 60 * 60_000);
  if (!rl.ok) return NextResponse.json({ error: "Too many imports" }, { status: 429 });

  const form = await req.formData();
  try {
    assertCsrf(String(form.get("csrf") ?? ""));
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 403 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (file.size > MAX) return NextResponse.json({ error: "CSV too large" }, { status: 413 });
  const name = file.name.toLowerCase();
  if (!name.endsWith(".csv") && file.type !== "text/csv") {
    return NextResponse.json({ error: "Only CSV is accepted" }, { status: 400 });
  }

  const text = await file.text();
  if (/<\s*script/i.test(text)) {
    return NextResponse.json({ error: "Forbidden content in CSV" }, { status: 400 });
  }

  const parsed = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
  });
  let imported = 0;
  let skipped = 0;
  for (const row of parsed.data) {
    const gondi = (row.gondi_pronunciation || row.gondi || "").trim();
    const hindi = (row.hindi || "").trim();
    const english = (row.english || "").trim();
    if (!gondi || !hindi || !english) {
      skipped += 1;
      continue;
    }
    try {
      rejectDangerous(gondi, "Gondi");
      rejectDangerous(hindi, "Hindi");
      rejectDangerous(english, "English");
    } catch {
      skipped += 1;
      continue;
    }
    const entry = enrichRaw(
      {
        gondi_pronunciation: gondi,
        hindi,
        english,
        category: (row.category || "general").trim() || "general",
        category_hi: row.category_hi || "",
        source_page: row.source_page || "csv",
        notes: row.notes,
      },
      { status: "published", verified: false, source: "csv-import", created_by: user.id }
    );
    await upsertEntry(entry, user.email);
    imported += 1;
  }

  return NextResponse.json({
    imported,
    skipped,
    message: "Imported rows keep source Gondi spelling. Review unverified rows.",
  });
}
