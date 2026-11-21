import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary, type Locale } from "@/i18n";
import { pageMetadata } from "@/lib/seo";
import { Icon } from "@/components/Icon";
import { PlaceholderNote } from "@/components/PlaceholderNote";
import { CookieSettingsButton } from "@/components/CookieConsent";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const d = getDictionary(lang);
  return pageMetadata({ lang, path: "/privacy/", title: d.meta.privacyTitle, description: d.meta.privacyDescription });
}

export default async function Privacy({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const d = getDictionary(lang);
  return (
    <div className="container-x py-10 sm:py-14">
      <Link href={`/${lang}/`} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 font-bold text-aqua-800 shadow-sm hover:bg-aqua-50">
        <Icon name="arrowLeft" className="size-5" /> {d.nav.backHome}
      </Link>
      <div className="article-body mt-8">
        <PlaceholderNote>{d.privacy.draftNote}</PlaceholderNote>
        <h1 className="h-section">{d.privacy.title}</h1>
        <p className="text-ink-soft">{d.privacy.updated}</p>
        {d.privacy.sections.map((s) => (
          <section key={s.h}>
            <h2>{s.h}</h2>
            <p>{s.p}</p>
          </section>
        ))}
        <section id="cookies" className="scroll-mt-28 rounded-[1.75rem] bg-aqua-50 p-6">
          <h2 className="!mt-0">{d.privacy.cookiesTitle}</h2>
          <p>{d.privacy.cookiesText}</p>
          <CookieSettingsButton label={d.footer.cookieSettings} className="btn btn-primary mt-4" />
        </section>
      </div>
    </div>
  );
}
