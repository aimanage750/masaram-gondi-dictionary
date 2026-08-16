import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAdminUser } from "@/lib/auth";
import { can } from "@/lib/admin-auth/roles";
import { assertCsrf } from "@/lib/csrf";
import { auditEvent, getEntry, listReports, updateReportStatus, upsertEntry } from "@/lib/data/store";

const CORRECT_FIELDS = [
  "gondi_devanagari",
  "roman_gondi",
  "masaram_gondi",
  "hindi",
  "english",
  "pronunciation",
  "hindi_definition",
  "english_definition",
  "hindi_example",
  "english_example",
  "gondi_example",
] as const;

const patchSchema = z.object({
  status: z.enum(["pending", "investigating", "corrected", "rejected", "duplicate", "resolved"]).optional(),
  apply: z.array(z.enum(CORRECT_FIELDS)).max(CORRECT_FIELDS.length).optional(),
  csrf: z.string().min(8),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = getAdminUser();
  if (!user || !can(user.role, "review")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json().catch(() => ({}));
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid patch" }, { status: 400 });
  try {
    assertCsrf(parsed.data.csrf);
  } catch {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
  }

  const reports = await listReports();
  const report = reports.find((r) => r.id === params.id);
  if (!report) return NextResponse.json({ error: "Report not found" }, { status: 404 });

  // Applying a correction touches live dictionary data — editor+ only, and
  // the report NEVER modifies the dictionary without this explicit action.
  if (parsed.data.apply?.length) {
    if (!can(user.role, "edit")) {
      return NextResponse.json({ error: "Correcting requires editor role" }, { status: 403 });
    }
    if (!report.dictionary_entry_id) {
      return NextResponse.json({ error: "Report is not linked to an entry" }, { status: 400 });
    }
    const entry = await getEntry(report.dictionary_entry_id, true);
    if (!entry) return NextResponse.json({ error: "Entry not found" }, { status: 404 });

    const before = { ...entry };
    const a = parsed.data.apply;
    if (a.includes("gondi_devanagari") && report.correct_gondi_devanagari)
      entry.gondi_pronunciation = report.correct_gondi_devanagari;
    if (a.includes("roman_gondi") && report.correct_roman_gondi)
      entry.roman_gondi = report.correct_roman_gondi;
    if (a.includes("masaram_gondi") && report.correct_masaram_gondi)
      entry.gondi_script = report.correct_masaram_gondi;
    if (a.includes("hindi") && report.correct_hindi) entry.hindi = report.correct_hindi;
    if (a.includes("english") && report.correct_english) entry.english = report.correct_english;
    if (a.includes("pronunciation") && report.correct_pronunciation)
      entry.gondi_pronunciation = report.correct_pronunciation;
    entry.updated_at = new Date().toISOString();
    try {
      await upsertEntry(entry, user.email);
    } catch (e) {
      return NextResponse.json({ error: (e as Error).message }, { status: 500 });
    }
    await auditEvent(
      user.email,
      "REPORT_CORRECTED",
      "entry",
      entry.id,
      `${before.gondi_pronunciation} fields: ${a.join(",")}`
    );
    await updateReportStatus(report.id, "corrected", user.email);
    return NextResponse.json({ ok: true });
  }

  if (parsed.data.status) {
    await updateReportStatus(report.id, parsed.data.status, user.email);
  }
  return NextResponse.json({ ok: true });
}
