"use client";

import { FormEvent, useEffect, useState } from "react";
import { Loader2, Send } from "lucide-react";

const initial = { name: "", email: "", subject: "", message: "", website: "" };

type FieldErrors = Partial<Record<keyof typeof initial, string>>;

export default function ContactForm() {
  const [form, setForm] = useState(initial);
  const [csrf, setCsrf] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/csrf", { credentials: "same-origin" })
      .then((res) => res.json())
      .then((data) => { if (active && typeof data.token === "string") setCsrf(data.token); })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  function update(field: keyof typeof initial, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (status !== "idle") setStatus("idle");
    setServerError("");
  }

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (form.name.trim().length < 2) next.name = "नाम कम से कम 2 अक्षरों का होना चाहिए।";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) next.email = "कृपया सही ईमेल दर्ज करें।";
    if (form.subject.trim().length < 2) next.subject = "विषय आवश्यक है।";
    if (form.message.trim().length < 10) next.message = "संदेश कम से कम 10 अक्षरों का होना चाहिए।";
    if (form.message.length > 2000) next.message = "संदेश 2000 अक्षरों से अधिक नहीं हो सकता।";
    return next;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = validate();
    if (Object.keys(next).length) { setErrors(next); return; }
    if (!csrf) { setStatus("error"); setServerError("सुरक्षा टोकन नहीं मिला। कृपया पेज रीफ्रेश करके फिर प्रयास करें।"); return; }

    setStatus("loading");
    setServerError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ ...form, csrf }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data.ok) throw new Error(data.error || "संदेश भेजने में समस्या हुई। कृपया कुछ देर बाद फिर प्रयास करें।");
      setForm(initial);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setServerError(error instanceof Error ? error.message : "संदेश भेजने में समस्या हुई। कृपया कुछ देर बाद फिर प्रयास करें।");
    }
  }

  const inputClass = "mt-2 w-full rounded-xl border border-earth-500/20 bg-cream-50 px-4 py-3 text-ink-800 outline-none transition focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20";

  return (
    <form onSubmit={submit} noValidate className="rounded-3xl border border-earth-500/10 bg-white p-6 shadow-card md:p-8" aria-label="Contact form">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="नाम / Name" htmlFor="contact-name" error={errors.name}>
          <input id="contact-name" name="name" value={form.name} onChange={(e) => update("name", e.target.value)} className={inputClass} autoComplete="name" maxLength={80} aria-invalid={!!errors.name} />
        </Field>
        <Field label="ईमेल / Email" htmlFor="contact-email" error={errors.email}>
          <input id="contact-email" name="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputClass} autoComplete="email" maxLength={120} aria-invalid={!!errors.email} />
        </Field>
      </div>

      <Field label="विषय / Subject" htmlFor="contact-subject" error={errors.subject}>
        <input id="contact-subject" name="subject" value={form.subject} onChange={(e) => update("subject", e.target.value)} className={inputClass} maxLength={160} aria-invalid={!!errors.subject} />
      </Field>

      <Field label="संदेश / Message" htmlFor="contact-message" error={errors.message}>
        <textarea id="contact-message" name="message" value={form.message} onChange={(e) => update("message", e.target.value)} className={`${inputClass} min-h-36 resize-y`} maxLength={2000} aria-invalid={!!errors.message} />
        <p className="mt-1 text-right text-xs text-ink-700/60">{form.message.length}/2000</p>
      </Field>

      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update("website", e.target.value)} />
      </div>

      <div aria-live="polite" className="mt-4">
        {status === "success" && <div className="rounded-xl border border-forest-500/20 bg-forest-500/10 px-4 py-3 font-deva text-sm text-ink-800">संदेश सफलतापूर्वक भेज दिया गया है। धन्यवाद! हम जल्द ही आपसे संपर्क करेंगे।<br /><span className="font-sans text-xs">Your message has been sent successfully.</span></div>}
        {status === "error" && <div role="alert" className="rounded-xl border border-terracotta-500/30 bg-terracotta-500/10 px-4 py-3 text-sm text-ink-800">{serverError || "संदेश भेजने में समस्या हुई। कृपया कुछ देर बाद फिर प्रयास करें।"}</div>}
      </div>

      <button type="submit" disabled={status === "loading"} className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-forest-600 px-5 py-3 font-semibold text-cream-50 transition hover:bg-forest-700 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto" aria-busy={status === "loading"}>
        {status === "loading" ? <><Loader2 size={18} className="animate-spin" aria-hidden /> भेजा जा रहा है…</> : <><Send size={18} aria-hidden /> संदेश भेजें · Send Message</>}
      </button>
    </form>
  );
}

function Field({ label, htmlFor, error, children }: { label: string; htmlFor: string; error?: string; children: React.ReactNode }) {
  return <div className="md:col-span-2"><label htmlFor={htmlFor} className="text-sm font-semibold text-ink-800">{label}</label>{children}{error && <p className="mt-1 text-sm text-terracotta-600" role="alert">{error}</p>}</div>;
}
