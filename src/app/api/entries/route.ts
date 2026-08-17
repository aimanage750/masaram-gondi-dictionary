import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { entrySchema, rejectDangerous } from "@/lib/validation";
import { assertCsrf } from "@/lib/csrf";
import { enrichRaw } from "@/lib/mapping/enrich";
import { upsertEntry } from "@/lib/data/store";
import { CATEGORY_META } from "@/data/raw-entries";

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden — एडमिन लॉगिन करो" }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  const parsed = entrySchema.safeParse(body);
  if (!parsed.success) {
    const flat = parsed.error.flatten();
    const msg =
      Object.values(flat.fieldErrors).flat().filter(Boolean)[0] ||
      flat.formErrors[0] ||
      "गोंडी, हिन्दी और English चाहिए";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
  try {
    await assertCsrf(body.csrf);
    rejectDangerous(parsed.data.gondi_pronunciation, "Gondi");
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 403 });
  }
  const cat = CATEGORY_META.find((c) => c.slug === (parsed.data.category || "general"));
  const entry = enrichRaw(
    {
      gondi_pronunciation: parsed.data.gondi_pronunciation,
      hindi: parsed.data.hindi,
      english: parsed.data.english,
      category: cat?.slug ?? "general",
      category_hi: cat?.name_hi ?? "",
      source_page: "admin",
      notes: parsed.data.notes,
    },
    {
      status: parsed.data.status ?? "published",
      verified: parsed.data.verified ?? true,
      created_by: user.id,
      source: parsed.data.source,
      gondi_script: parsed.data.gondi_script || undefined,
      roman_gondi: parsed.data.roman_gondi || undefined,
      roman_hindi: parsed.data.roman_hindi || undefined,
    }
  );
  if (parsed.data.source_page) entry.source_page = parsed.data.source_page;
  try {
    await upsertEntry(entry, user.email);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message || "सेव नहीं हुआ" }, { status: 500 });
  }
  return NextResponse.json({ id: entry.id });
}
