import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { Picture } from "./Picture";
import { Icon } from "./Icon";
import { getDictionary, t } from "@/i18n";
import { clinic } from "@/config/clinic";

const tagColors = ["bg-aqua-100 text-aqua-900", "bg-coral-100 text-coral-700", "bg-mint-100 text-mint-700", "bg-sun-100 text-sun-700"];
export const tagColor = (tag: string) => tagColors[[...tag].reduce((a, c) => a + c.charCodeAt(0), 0) % tagColors.length];

export function TipCard({ post, headingLevel = "h3" }: { post: PostMeta; headingLevel?: "h2" | "h3" }) {
  const d = getDictionary(post.lang);
  const H = headingLevel;
  const tagLabels = d.tips.tags as Record<string, string>;
  return (
    <article className="card group relative flex h-full flex-col overflow-hidden transition-transform duration-300 hover:-translate-y-1.5 hover:rotate-[-0.5deg] focus-within:-translate-y-1.5 focus-within:ring-4 focus-within:ring-aqua-700">
      <Picture name={post.cover} alt="" sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" className="aspect-[16/10] overflow-hidden" imgClassName="transition-transform duration-500 group-hover:scale-105" />
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {post.tags.map((tag) => (
            <span key={tag} className={`pill ${tagColor(tag)}`}>{tagLabels[tag] ?? tag}</span>
          ))}
          {!post.reviewed && clinic.showPlaceholderNotes && <span className="placeholder-note !py-0.5">{d.tips.draftBadge}</span>}
        </div>
        <H className="text-xl text-ink">
          <Link href={`/${post.lang}/tips/${post.slug}/`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {post.title}
          </Link>
        </H>
        <p className="text-ink-soft">{post.excerpt}</p>
        <p className="mt-auto flex items-center gap-1.5 pt-2 text-sm font-semibold text-aqua-800">
          <Icon name="clock" className="size-4" /> {t(d.common.minRead, { n: post.readTime })}
          <span className="ml-auto inline-flex items-center gap-1 transition-transform group-hover:translate-x-1">
            {d.tips.readMore} <Icon name="arrowRight" className="size-4" />
          </span>
        </p>
      </div>
    </article>
  );
}
