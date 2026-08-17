import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminUser } from "@/lib/auth";
import { can } from "@/lib/admin-auth/roles";
import { assertCsrf } from "@/lib/csrf";
import { auditEvent, listEntries, upsertEntry } from "@/lib/data/store";
import { enrichRaw } from "@/lib/mapping/enrich";
import { rejectDangerous } from "@/lib/validation";

/** Two-phase CSV import: dryRun=true validates + previews; dryRun=false
 * applies after the admin confirms. Nothing touches the dictionary without
 * the explicit apply call. */

const rowSchema = z.object({
  id: z.string().trim().max(24).optional(),
  gondi_pronunciation: z.string().trim().max(200),
  hindi: z.string().trim().max(200),
  english: z.string().trim().max(200),
  roman_gondi: z.string().trim().max(200).optional(),
  gondi_script: z.string().trim().max(200).optional(),
  roman_hindi: z.string().trim().max(200).optional(),
  category: z.string().trim().max(40).optional(),
  source_page: z.string().trim().max(40).optional(),
  notes: z.string().trim().max(500).optional(),
});

const bodySchema = z.object({
  dryRun: z.boolean(),
  rows: z.array(rowSchema).min(1).max(2000),
  csrf: z.string().min(8),
});

interface Issue {
  row: number;
  kind: "error" | "warning";
  message: string;
}

export async function POST(req: NextRequest) {
  const user = await getAdminUser();
  if (!user || !can(user.role, "publish")) {
    return NextResponse.json({ error: "CSV import requires super admin" }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  try {
    await assertCsrf(parsed.data.csrf);
  } catch {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
  }

  const existing = await listEntries({ includeUnpublished: true });
  const byId = new Map(existing.map((e) => [e.id, e]));
  const seenIds = new Set<string>();
  const seenWords = new Set<string>();
  const issues: Issue[] = [];
  const valid: z.infer<typeof rowSchema>[] = [];

  parsed.data.rows.forEach((r, i) => {
    const n = i + 2; // header = row 1
    if (!r.gondi_pronunciation || !r.hindi || !r.english) {
      issues.push({ row: n, kind: "error", message: "Missing required gondi/hindi/english" });
      return;
    }
    try {
      rejectDangerous(r.gondi_pronunciation, "Gondi");
      rejectDangerous(r.hindi, "Hindi");
      rejectDangerous(r.english, "English");
    } catch {
      issues.push({ row: n, kind: "error", message: "Forbidden content detected" });
      return;
    }
    // Unicode sanity: gondi_script (if given) must be real Masaram Gondi.
    if (r.gondi_script && !/[\u{11D00}-\u{11D5F}]/u.test(r.gondi_script)) {
      issues.push({ row: n, kind: "error", message: "gondi_script contains no Masaram Gondi Unicode (U+11D00–U+11D5F)" });
      return;
    }
    if (r.id) {
      if (seenIds.has(r.id)) {
        issues.push({ row: n, kind: "error", message: `Duplicate id in file: ${r.id}` });
        return;
      }
      seenIds.add(r.id);
    }
    const wordKey = `${r.gondi_pronunciation}::${r.hindi}`.toLowerCase();
    if (seenWords.has(wordKey)) {
      issues.push({ row: n, kind: "warning", message: "Duplicate word within file" });
    }
    seenWords.add(wordKey);
    if (
      !r.id &&
      existing.some(
        (e) =>
          e.gondi_pronunciation.toLowerCase() === r.gondi_pronunciation.toLowerCase() &&
          e.hindi.toLowerCase() === r.hindi.toLowerCase()
      )
    ) {
      issues.push({ row: n, kind: "warning", message: "Matches an existing dictionary word (no id) — will be skipped on apply" });
    }
    if (r.id && !byId.has(r.id)) {
      issues.push({ row: n, kind: "warning", message: `Unknown id ${r.id} — will create a NEW entry with this id` });
    }
    valid.push(r);
  });

  const blocking = issues.filter((x) => x.kind === "error").length;
  const summary = {
    total: parsed.data.rows.length,
    valid: valid.length,
    errors: blocking,
    warnings: issues.filter((x) => x.kind === "warning").length,
    issues: issues.slice(0, 200),
  };

  if (parsed.data.dryRun) {
    return NextResponse.json({ dryRun: true, ...summary });
  }

  if (blocking > 0) {
    return NextResponse.json({ error: "Fix blocking errors before applying" }, { status: 400 });
  }

  let applied = 0;
  let skipped = 0;
  for (const r of valid) {
    const existingById = r.id ? byId.get(r.id) : undefined;
    if (!existingById) {
      const dup = existing.some(
        (e) =>
          !r.id &&
          e.gondi_pronunciation.toLowerCase() === r.gondi_pronunciation.toLowerCase() &&
          e.hindi.toLowerCase() === r.hindi.toLowerCase()
      );
      if (dup) {
        skipped += 1;
        continue;
      }
    }
    const entry = enrichRaw(
      {
        gondi_pronunciation: r.gondi_pronunciation,
        hindi: r.hindi,
        english: r.english,
        category: r.category || existingById?.category || "general",
        category_hi: existingById?.category_hi ?? "",
        source_page: r.source_page || existingById?.source_page || "csv",
        notes: r.notes ?? existingById?.notes ?? undefined,
      },
      {
        ...(existingById ?? {}),
        id: r.id || existingById?.id,
        gondi_script: r.gondi_script || undefined,
        roman_gondi: r.roman_gondi || undefined,
        roman_hindi: r.roman_hindi || undefined,
        status: existingById?.status ?? "pending",
        verified: existingById?.verified ?? false,
        source: existingById?.source ?? "csv-import",
        updated_at: new Date().toISOString(),
      }
    );
    await upsertEntry(entry, user.email);
    applied += 1;
  }

  await auditEvent(user.email, "CSV_IMPORTED", "dictionary", null, `${applied} applied, ${skipped} skipped`);
  return NextResponse.json({ dryRun: false, applied, skipped, ...summary });
}
