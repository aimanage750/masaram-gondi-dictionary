import { listSentences } from "@/lib/data/store";
import { VakyaAdmin } from "@/components/admin/VakyaAdmin";

export const dynamic = "force-dynamic";

export default async function AdminVakyaPage() {
  const sentences = await listSentences(true);
  return (
    <div>
      <h1 className="font-display text-3xl">वाक्यांश जोड़ें</h1>
      <p className="mt-2 font-deva text-ink-700">
        किताब या PDF से वाक्य लिखो। गोंडी वाक्य किताब जैसा ही रखो — अनुमान से न बनाओ।
      </p>
      <VakyaAdmin initial={sentences} />
    </div>
  );
}
