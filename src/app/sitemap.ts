import type { MetadataRoute } from "next";
import { locales } from "@/i18n";
import { getAllPosts, getSlugs } from "@/lib/posts";
import { absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const alt = (p: string) => ({ languages: { ...Object.fromEntries(locales.map((l) => [l, absoluteUrl(`/${l}${p}`)])), "x-default": absoluteUrl(`/en${p}`) } });
  const entries: MetadataRoute.Sitemap = [];
  for (const lang of locales) {
    entries.push({ url: absoluteUrl(`/${lang}/`), changeFrequency: "monthly", priority: 1, alternates: alt("/") });
    entries.push({ url: absoluteUrl(`/${lang}/tips/`), changeFrequency: "weekly", priority: 0.8, alternates: alt("/tips/") });
    const posts = getAllPosts(lang);
    for (const slug of getSlugs()) {
      const p = posts.find((x) => x.slug === slug);
      entries.push({ url: absoluteUrl(`/${lang}/tips/${slug}/`), lastModified: p?.updated ?? p?.date, changeFrequency: "yearly", priority: 0.7, alternates: alt(`/tips/${slug}/`) });
    }
    entries.push({ url: absoluteUrl(`/${lang}/privacy/`), changeFrequency: "yearly", priority: 0.2, alternates: alt("/privacy/") });
  }
  return entries;
}
