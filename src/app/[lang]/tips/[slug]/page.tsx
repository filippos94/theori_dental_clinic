import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { clinic } from "@/config/clinic";
import { getDictionary, locales, localeInfo, t, type Locale } from "@/i18n";
import { getPost, getRelated, getSlugs } from "@/lib/posts";
import { pageMetadata, absoluteUrl } from "@/lib/seo";
import { getImage } from "@/lib/images";
import { Picture } from "@/components/Picture";
import { TipCard, tagColor } from "@/components/TipCard";
import { Icon } from "@/components/Icon";
import { JsonLd } from "@/components/JsonLd";

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.flatMap((lang) => getSlugs().map((slug) => ({ lang, slug })));
}

type P = { params: Promise<{ lang: Locale; slug: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lang, slug } = await params;
  const post = getPost(slug, lang);
  if (!post) return {};
  return pageMetadata({
    lang,
    path: `/tips/${slug}/`,
    title: `${post.title} | ${clinic.name}`,
    description: post.description,
    image: post.cover,
    type: "article",
    publishedTime: post.date,
  });
}

export default async function TipPage({ params }: P) {
  const { lang, slug } = await params;
  const post = getPost(slug, lang);
  if (!post) notFound();
  const d = getDictionary(lang);
  const related = getRelated(post, 3);
  const date = new Intl.DateTimeFormat(localeInfo[lang].dateLocale, { dateStyle: "long" }).format(new Date(post.date));
  const tagLabels = d.tips.tags as Record<string, string>;
  const url = absoluteUrl(`/${lang}/tips/${slug}/`);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: [absoluteUrl(getImage(post.cover)?.og ?? "/images/og/og-default.jpg")],
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    inLanguage: lang,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: post.author ? { "@type": "Person", name: post.author } : { "@type": "Organization", name: clinic.name, url: absoluteUrl(`/${lang}/`) },
    publisher: { "@type": "Organization", name: clinic.name, logo: { "@type": "ImageObject", url: absoluteUrl("/apple-touch-icon.png") } },
    keywords: post.tags.map((tg) => tagLabels[tg] ?? tg).join(", "),
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: d.nav.home, item: absoluteUrl(`/${lang}/`) },
      { "@type": "ListItem", position: 2, name: d.tips.listTitle, item: absoluteUrl(`/${lang}/tips/`) },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  return (
    <>
      <JsonLd data={articleLd} />
      <JsonLd data={breadcrumbLd} />
      <article>
        <header className="border-b border-line bg-cream">
          <div className="container-x pb-10 pt-8 sm:pt-10">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm font-bold">
              <Link href={`/${lang}/`} className="inline-flex min-h-11 items-center gap-1.5 text-ink-soft hover:text-ink">
                <Icon name="arrowLeft" className="size-4" /> {d.nav.backHome}
              </Link>
              <span aria-hidden="true" className="text-line">/</span>
              <Link href={`/${lang}/tips/`} className="inline-flex min-h-11 items-center text-ink-soft hover:text-ink">{d.tips.listTitle}</Link>
            </nav>

            <div className="mx-auto mt-6 max-w-3xl text-center">
              {!post.reviewed && clinic.showPlaceholderNotes && <p className="placeholder-note mb-4">✎ {d.tips.draftNote}</p>}
              <div className="flex flex-wrap justify-center gap-2">
                {post.tags.map((tg) => (
                  <Link key={tg} href={`/${lang}/tips/#tag=${tg}`} className={`pill ${tagColor(tg)} hover:brightness-95`}>{tagLabels[tg] ?? tg}</Link>
                ))}
              </div>
              <h1 className="mt-5 text-[clamp(2.1rem,1.4rem+3vw,3.6rem)] leading-[1.06] tracking-[-0.035em]">{post.title}</h1>
              <p className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm text-ink-soft">
                <span className="inline-flex items-center gap-1.5"><Icon name="calendar" className="size-4" /><span className="sr-only">{d.tips.publishedOn}</span><time dateTime={post.date}>{date}</time></span>
                <span className="inline-flex items-center gap-1.5"><Icon name="clock" className="size-4" />{t(d.common.minRead, { n: post.readTime })}</span>
              </p>
            </div>
            <div className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-[2rem]">
              <Picture name={post.cover} alt={post.coverAlt} priority sizes="(min-width: 1024px) 896px, 94vw" className="aspect-[16/9]" />
            </div>
          </div>
        </header>

        <div className="container-x py-12 sm:py-16">
          <div className="article-body" dangerouslySetInnerHTML={{ __html: post.html }} />

          {/* Call to action */}
          <aside className="relative mx-auto mt-16 max-w-3xl overflow-hidden rounded-[2rem] bg-ink p-8 text-white sm:p-12" aria-labelledby="cta-title">
            <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[radial-gradient(closest-side,rgba(93,179,181,0.45),transparent)]" />
            <h2 id="cta-title" className="relative text-2xl sm:text-3xl">{d.tips.ctaTitle}</h2>
            <p className="relative mt-3 max-w-md text-[#c9d6d8]">{d.tips.ctaText}</p>
            <div className="relative mt-8 flex flex-wrap gap-3">
              <Link href={`/${lang}/#book`} className="btn bg-white text-ink hover:bg-aqua-50">{d.tips.ctaButton} <Icon name="arrowRight" className="size-4" /></Link>
              <a href={clinic.phone.href} className="btn text-white ring-1 ring-white/25 hover:ring-white/60"><Icon name="phone" className="size-4" /> {clinic.phone.display}</a>
            </div>
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="border-t border-line bg-cream">
          <div className="container-x py-14 sm:py-16">
            <h2 id="related-title" className="h-section mb-10">{d.tips.related}</h2>
            <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => <li key={p.slug}><TipCard post={p} /></li>)}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
