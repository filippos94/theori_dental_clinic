import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary, type Locale } from "@/i18n";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { pageMetadata, absoluteUrl } from "@/lib/seo";
import { TipCard } from "@/components/TipCard";
import { TipsFilter } from "@/components/TipsFilter";
import { Icon } from "@/components/Icon";
import { Sparkle, ToothMascot } from "@/components/Illustrations";
import { JsonLd } from "@/components/JsonLd";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const d = getDictionary(lang);
  return pageMetadata({ lang, path: "/tips/", title: d.meta.tipsTitle, description: d.meta.tipsDescription });
}

export default async function TipsPage({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const d = getDictionary(lang);
  const posts = getAllPosts(lang);
  const tags = getAllTags(lang);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: d.tips.listTitle,
          url: absoluteUrl(`/${lang}/tips/`),
          inLanguage: lang,
          blogPost: posts.map((p) => ({ "@type": "BlogPosting", headline: p.title, url: absoluteUrl(`/${lang}/tips/${p.slug}/`), datePublished: p.date })),
        }}
      />
      <section className="relative overflow-hidden bg-sun-50">
        <Sparkle className="absolute left-[8%] top-10 size-8 motion-safe:animate-float" />
        <Sparkle className="absolute right-[12%] top-24 size-6 motion-safe:animate-float" color="#FF8A75" />
        <div className="container-x relative py-12 text-center sm:py-16">
          <Link href={`/${lang}/`} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 font-bold text-aqua-800 shadow-sm hover:bg-aqua-50">
            <Icon name="arrowLeft" className="size-5" /> {d.nav.backHome}
          </Link>
          <ToothMascot className="mx-auto mt-6 size-20 motion-safe:animate-float" />
          <h1 className="h-display mt-4">{d.tips.listTitle}</h1>
          <p className="lead mx-auto mt-3 max-w-xl">{d.tips.listIntro}</p>
        </div>
      </section>
      <div className="container-x py-12 sm:py-16">
        <TipsFilter tags={tags} labels={d.tips.tags} allLabel={d.tips.all} filterLabel={d.tips.filterLabel} noResults={d.tips.noResults}>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <li key={p.slug} data-tags={p.tags.join(",")}>
                <TipCard post={p} headingLevel="h2" />
              </li>
            ))}
          </ul>
        </TipsFilter>
      </div>
    </>
  );
}
