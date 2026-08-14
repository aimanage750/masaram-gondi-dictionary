export function publicError(err: unknown, fallback = "सेव नहीं हुआ"): string {
  if (typeof err === "string" && err.trim()) return err;
  if (err && typeof err === "object") {
    const o = err as { error?: unknown; message?: unknown; formErrors?: string[]; fieldErrors?: Record<string, string[] | undefined> };
    if (typeof o.error === "string") return o.error;
    if (typeof o.message === "string") return o.message;
    const fields = o.fieldErrors
      ? Object.entries(o.fieldErrors)
          .flatMap(([k, v]) => (v ?? []).map((m) => `${k}: ${m}`))
          .join(" · ")
      : "";
    if (fields) return fields;
    if (Array.isArray(o.formErrors) && o.formErrors.length) return o.formErrors.join(" · ");
  }
  return fallback;
}
