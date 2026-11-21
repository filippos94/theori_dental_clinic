import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";
import type { Locale } from "@/i18n";

/**
 * Blog posts live in /content/tips as <slug>.<lang>.md
 * e.g. content/tips/how-to-brush-properly.en.md + content/tips/how-to-brush-properly.el.md
 */
const DIR = path.join(process.cwd(), "content", "tips");

export type PostMeta = {
  slug: string;
  lang: Locale;
  title: string;
  description: string; // meta description
  excerpt: string;
  date: string; // YYYY-MM-DD
  updated?: string;
  cover: string; // image name in assets/photos (without extension)
  coverAlt: string;
  tags: string[];
  readTime: number; // minutes
  reviewed: boolean; // false = draft, waiting for dentist approval
  author?: string;
};
export type Post = PostMeta & { html: string };

function readFile(slug: string, lang: Locale): Post | null {
  const file = path.join(DIR, `${slug}.${lang}.md`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  const words = content.split(/\s+/).filter(Boolean).length;
  const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date);
  return {
    slug,
    lang,
    title: data.title,
    description: data.description ?? data.excerpt,
    excerpt: data.excerpt,
    date,
    updated: data.updated ? (data.updated instanceof Date ? data.updated.toISOString().slice(0, 10) : String(data.updated)) : undefined,
    cover: data.cover,
    coverAlt: data.coverAlt ?? "",
    tags: data.tags ?? [],
    readTime: data.readTime ?? Math.max(1, Math.round(words / 200)),
    reviewed: data.reviewed === true,
    author: data.author,
    html: marked.parse(content, { async: false }) as string,
  };
}

export function getSlugs(): string[] {
  if (!fs.existsSync(DIR)) return [];
  return [...new Set(fs.readdirSync(DIR).filter((f) => f.endsWith(".md")).map((f) => f.split(".")[0]))];
}

export function getPost(slug: string, lang: Locale): Post | null {
  // Fall back to English if a translation hasn't been written yet
  return readFile(slug, lang) ?? readFile(slug, "en");
}

export function getAllPosts(lang: Locale): PostMeta[] {
  return getSlugs()
    .map((s) => getPost(s, lang))
    .filter((p): p is Post => !!p)
    .map(({ html: _html, ...meta }) => meta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getRelated(post: PostMeta, count = 3): PostMeta[] {
  const others = getAllPosts(post.lang).filter((p) => p.slug !== post.slug);
  const score = (p: PostMeta) => p.tags.filter((t) => post.tags.includes(t)).length;
  return others.sort((a, b) => score(b) - score(a) || (a.date < b.date ? 1 : -1)).slice(0, count);
}

export function getAllTags(lang: Locale): string[] {
  return [...new Set(getAllPosts(lang).flatMap((p) => p.tags))];
}
