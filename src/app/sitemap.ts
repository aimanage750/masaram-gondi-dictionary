import type { MetadataRoute } from "next";
import { CATEGORY_META } from "@/data/raw-entries";
import { LESSONS } from "@/data/grammar/lessons";
import { listEntries } from "@/lib/data/store";

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL && process.env.NEXT_PUBLIC_SITE_URL !== "http://localhost:3000"
    ? process.env.NEXT_PUBLIC_SITE_URL
    : "https://masaram-gondi-script-platform.vercel.app";

/** Sitemap built exclusively from real project data: static public routes,
 * grammar lesson registry, category meta (count > 0) and the published
 * dictionary entries. Nothing is invented. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/browse",
    "/translator",
    "/converter",
    "/grammar",
    "/vakya",
    "/script",
    "/keyboard",
    "/about",
    "/contact",
    "/contribute",
    "/report",
  ].map((path) => ({
    url: `${SITE}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
    priority: path === "" ? 1 : path === "/browse" ? 0.9 : 0.7,
  }));

  const lessonRoutes: MetadataRoute.Sitemap = LESSONS.map((l) => ({
    url: `${SITE}/grammar/${l.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const entries = await listEntries();
  const published = entries.filter((e) => e.status === "published");

  // Only categories that actually contain published words.
  const usedCategories = new Set(published.map((e) => e.category));
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORY_META.filter((c) =>
    usedCategories.has(c.slug)
  ).map((c) => ({
    url: `${SITE}/browse/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const wordRoutes: MetadataRoute.Sitemap = published.map((e) => ({
    url: `${SITE}/word/${e.id}`,
    lastModified: e.updated_at ? new Date(e.updated_at) : now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...lessonRoutes, ...categoryRoutes, ...wordRoutes];
}
