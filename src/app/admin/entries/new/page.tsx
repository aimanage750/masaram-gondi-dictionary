import { EntryForm } from "@/components/admin/EntryForm";

export default function NewEntryPage() {
  return (
    <div>
      <h1 className="font-display text-3xl">New entry</h1>
      <p className="mt-1 text-sm text-ink-700/70">
        Paste the source Gondi pronunciation. Masaram script is generated — do not invent a word.
      </p>
      <EntryForm />
    </div>
  );
}
