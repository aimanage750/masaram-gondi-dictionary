"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function ReviewButtons({ id }: { id: string }) {
  const router = useRouter();
  const [csrf, setCsrf] = useState("");
  useEffect(() => {
    fetch("/api/csrf")
      .then((r) => r.json())
      .then((d) => setCsrf(d.token))
      .catch(() => {});
  }, []);

  async function act(decision: "approved" | "rejected") {
    await fetch(`/api/contributions/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision, csrf }),
    });
    router.refresh();
  }

  return (
    <div className="mt-2 flex gap-2">
      <button onClick={() => act("approved")} className="rounded-lg bg-forest-500 px-3 py-1 text-sm text-cream-50">
        Approve
      </button>
      <button onClick={() => act("rejected")} className="rounded-lg border px-3 py-1 text-sm">
        Reject
      </button>
    </div>
  );
}
