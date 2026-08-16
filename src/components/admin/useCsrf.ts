"use client";

import { useEffect, useState } from "react";

/** Fetch the CSRF token (paired with the HttpOnly mgd_csrf cookie). */
export function useCsrf(): string {
  const [csrf, setCsrf] = useState("");
  useEffect(() => {
    fetch("/api/csrf")
      .then((r) => r.json())
      .then((d) => setCsrf(d.token ?? ""))
      .catch(() => {});
  }, []);
  return csrf;
}
