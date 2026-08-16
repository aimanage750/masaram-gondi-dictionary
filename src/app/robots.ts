import type { MetadataRoute } from "next";

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL && process.env.NEXT_PUBLIC_SITE_URL !== "http://localhost:3000"
    ? process.env.NEXT_PUBLIC_SITE_URL
    : "https://masaram-gondi-script-platform.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Admin/auth surfaces must never be indexed.
        disallow: ["/admin", "/admin/", "/login", "/api/"],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
  };
}
