import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { Picture } from "./Picture";
import { Icon } from "./Icon";
import { getDictionary, t } from "@/i18n";
import { clinic } from "@/config/clinic";

const tagColors = ["bg-aqua-50 text-aqua-800", "bg-coral-50 text-coral-700", "bg-mint-100 text-mint-700", "bg-sun-50 text-sun-700"];
export const tagColor = (tag: string) => tagColors[[...tag].reduce((a, c) => a + c.charCodeAt(0), 0) % tagColors.length];

export function TipCard({ post, headingLevel = "h3" }: { post: PostMeta; headingLevel?: "h2" | "h3" }) {
  const d = getDictionary(post.lang);
  const H = headingLevel;
  const tagLabels = d.tips.tags as Record<string, string>;
  return (
    <article className="group relative flex h-full flex-col focus-within:rounded-2xl focus-within:ring-2 focus-within:ring-aqua-700 focus-within:ring-offset-4">
      <Picture name={post.cover} alt="" sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" className="aspect-[16/10] overflow-hidden rounded-2xl" imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
      <div className="flex flex-1 flex-col gap-3 pt-5">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {post.tags.map((tag) => (
            <span key={tag} className={`pill ${tagColor(tag)}`}>{tagLabels[tag] ?? tag}</span>
          ))}
          {!post.reviewed && clinic.showPlaceholderNotes && <span className="placeholder-note !py-0.5">{d.tips.draftBadge}</span>}
        </div>
        <H className="text-xl tracking-tight text-ink transition-colors group-hover:text-aqua-800">
          <Link href={`/${post.lang}/tips/${post.slug}/`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">
            {post.title}
          </Link>
        </H>
        <p className="text-[0.95rem] text-ink-soft">{post.excerpt}</p>
        <p className="mt-auto flex items-center gap-1.5 pt-1 text-sm font-medium text-ink-soft">
          <Icon name="clock" className="size-4" /> {t(d.common.minRead, { n: post.readTime })}
          <span className="ml-auto inline-flex items-center gap-1 font-semibold text-aqua-700 transition-transform group-hover:translate-x-1">
            {d.tips.readMore} <Icon name="arrowRight" className="size-4" />
          </span>
        </p>
      </div>
    </article>
  );
}
