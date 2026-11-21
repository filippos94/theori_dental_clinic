import type { Metadata } from "next";
import Link from "next/link";
import { clinic } from "@/config/clinic";
import { getDictionary, t, type Locale } from "@/i18n";
import { getAllPosts } from "@/lib/posts";
import { pageMetadata, dentistJsonLd } from "@/lib/seo";
import { Section, SectionHeading } from "@/components/Section";
import { Picture } from "@/components/Picture";
import { Icon } from "@/components/Icon";
import { PlaceholderNote } from "@/components/PlaceholderNote";
import { ServicesGrid } from "@/components/ServicesGrid";
import { ReviewsCarousel } from "@/components/ReviewsCarousel";
import { BookingForm } from "@/components/BookingForm";
import { HoursTable, OpenBadge } from "@/components/Hours";
import { MapEmbed } from "@/components/MapEmbed";
import { TipCard } from "@/components/TipCard";
import { JsonLd } from "@/components/JsonLd";

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
  const { lang } = await params;
  const d = getDictionary(lang);
  return pageMetadata({ lang, path: "/", title: d.meta.homeTitle, description: d.meta.homeDescription, keywords: d.meta.keywords });
}

/** "[confirm]" markers in FAQ answers: shown as a badge while placeholders are on, stripped otherwise. */
const CONFIRM = /^\[(confirm|επιβεβαίωση)\]\s*/i;

const Stars = ({ className = "size-4" }: { className?: string }) => (
  <span className="flex text-sun-400" aria-hidden="true">
    {Array.from({ length: 5 }).map((_, i) => <Icon key={i} name="star" className={`${className} fill-current`} strokeWidth={1.5} />)}
  </span>
);

export default async function Home({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const d = getDictionary(lang);
  const latest = getAllPosts(lang).slice(0, 3);
  const rating = clinic.google.rating.toFixed(1);
  const services = clinic.services.map((s) => ({ ...s, ...d.services.items[s.id] }));
  const hoursStrings = { ...d.contact, days: d.contact.days };
  const delay = (ms: number) => ({ "--reveal-delay": `${ms}ms` }) as React.CSSProperties;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: d.faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a.replace(CONFIRM, "") } })),
  };
  const [titleA, titleB] = (() => {
    const w = d.hero.title.split(" ");
    return [w.slice(0, -3).join(" "), w.slice(-3).join(" ")];
  })();

  return (
    <>
      <JsonLd data={dentistJsonLd(lang, d.meta.homeDescription)} />
      <JsonLd data={faqJsonLd} />

      {/* ───────── 1. HERO ───────── */}
      <section id="home" aria-labelledby="hero-title" className="relative overflow-hidden bg-cream">
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 size-[44rem] rounded-full bg-[radial-gradient(closest-side,#dceded,transparent)] opacity-80" />
        <div className="container-x relative grid items-center gap-14 pb-16 pt-10 sm:pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:pb-24 lg:pt-20">
          <div className="animate-pop">
            <p className="eyebrow">{d.hero.eyebrow}</p>
            <h1 id="hero-title" className="h-display mt-6">
              {titleA} <span className="text-aqua-700">{titleB}</span>
            </h1>
            <p className="lead mt-6 max-w-xl">{d.hero.subtitle}</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href="#book" className="btn btn-book !min-h-14 !px-7">
                {d.hero.ctaBook} <Icon name="arrowRight" className="size-4" />
              </a>
              <a href={clinic.phone.href} className="btn btn-outline !min-h-14 !px-7">
                <Icon name="phone" className="size-4" /> {t(d.hero.ctaCall, { phone: clinic.phone.display })}
              </a>
            </div>
            <ul className="mt-10 grid gap-3 border-t border-line pt-6 text-sm text-ink-soft sm:grid-cols-3">
              {d.hero.trust.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Icon name="check" className="size-4 shrink-0 text-aqua-700" strokeWidth={2.2} /> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-[30rem] lg:max-w-none">
            <div className="overflow-hidden rounded-[2rem]">
              <Picture name="hero-family" alt={d.hero.imageAlt} priority sizes="(min-width: 1024px) 520px, 92vw" className="aspect-[4/5]" placeholderLabel={d.common.placeholderPhoto} badgeClassName="top-4 left-4" />
            </div>
            {/* Floating Google rating card */}
            <a
              href={clinic.google.reviewsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute -left-4 bottom-10 flex items-center gap-3 rounded-2xl border border-line bg-white/95 p-4 pr-5 shadow-[var(--shadow-pop)] backdrop-blur transition hover:-translate-y-0.5 sm:-left-10"
            >
              <svg viewBox="0 0 24 24" className="size-8 shrink-0" aria-hidden="true"><path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h5.9a5 5 0 0 1-2.2 3.3v2.8h3.6c2-1.9 3.2-4.7 3.2-8.1Z"/><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.8c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.9A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M5.8 14.1a6.6 6.6 0 0 1 0-4.2V7H2.1a11 11 0 0 0 0 10l3.7-2.9Z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 7l3.7 2.9C6.7 7.3 9.1 5.4 12 5.4Z"/></svg>
              <span className="leading-tight">
                <span className="flex items-center gap-2 font-display text-xl font-bold text-ink">{rating} <Stars /></span>
                <span className="text-xs font-medium text-ink-soft">{d.hero.ratingCard} · {d.hero.googleBadgeSub}<span className="sr-only"> {d.a11y.external}</span></span>
              </span>
            </a>
            {/* Floating open-now card */}
            <div className="absolute -right-2 top-8 rounded-2xl border border-line bg-white/95 p-3 shadow-[var(--shadow-pop)] backdrop-blur sm:-right-6">
              <OpenBadge s={hoursStrings} />
            </div>
          </div>
        </div>
      </section>

      {/* ───────── 2. SERVICES ───────── */}
      <Section id="services" tone="white" labelledBy="services-title">
        <SectionHeading
          id="services-title"
          eyebrow={d.services.eyebrow}
          title={d.services.title}
          subtitle={d.services.subtitle}
          note={<PlaceholderNote>{d.services.placeholderNote}</PlaceholderNote>}
        />
        <ServicesGrid items={services} s={d.services} />
      </Section>

      {/* ───────── 3. FOR THE WHOLE FAMILY ───────── */}
      <Section tone="cream" labelledBy="family-title">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="order-last lg:order-first" data-reveal>
            <div className="overflow-hidden rounded-[2rem]">
              <Picture name="family" alt={d.family.imageAlt} sizes="(min-width: 1024px) 560px, 92vw" className="aspect-[4/3]" placeholderLabel={d.common.placeholderPhoto} />
            </div>
          </div>
          <div>
            <div data-reveal>
              <p className="eyebrow mb-4">{d.family.eyebrow}</p>
              <h2 id="family-title" className="h-section">{d.family.title}</h2>
              <p className="lead mt-4">{d.family.subtitle}</p>
            </div>
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {[
                { icon: "smile", title: d.family.kidsTitle, text: d.family.kidsText },
                { icon: "hand", title: d.family.nervousTitle, text: d.family.nervousText },
              ].map((c, i) => (
                <div key={c.title} data-reveal style={delay(i * 100)}>
                  <span className="grid size-11 place-items-center rounded-xl bg-white text-aqua-700 ring-1 ring-line"><Icon name={c.icon} className="size-5" strokeWidth={1.7} /></span>
                  <h3 className="mt-4 text-lg">{c.title}</h3>
                  <p className="mt-2 text-[0.95rem] text-ink-soft">{c.text}</p>
                </div>
              ))}
            </div>
            <ul className="mt-10 grid gap-3 border-t border-line pt-8 sm:grid-cols-2" data-reveal>
              {d.family.points.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-[0.95rem] font-medium">
                  <Icon name="check" className="mt-0.5 size-5 shrink-0 text-aqua-700" strokeWidth={2.2} />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ───────── 4. MEET THE TEAM ───────── */}
      <Section id="about" tone="white" labelledBy="team-title">
        <SectionHeading
          id="team-title"
          eyebrow={d.team.eyebrow}
          title={d.team.title}
          subtitle={d.team.subtitle}
          note={<PlaceholderNote>{d.team.placeholderNote}</PlaceholderNote>}
        />
        <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {clinic.team.map((m, i) => {
            const tm = (d.team.members as Record<string, { role: string; bio: string }>)[m.id];
            return (
              <li key={m.id} data-reveal style={delay(i * 100)}>
                <div className="overflow-hidden rounded-2xl">
                  <Picture name={m.photo} alt={t(d.team.photoAlt, { name: m.name })} sizes="(min-width: 1024px) 380px, (min-width: 640px) 46vw, 92vw" className="aspect-[4/5]" placeholderLabel={d.common.placeholderPhoto} />
                </div>
                <h3 className="mt-5 text-xl">{m.name}</h3>
                <p className="mt-1 text-sm font-semibold text-aqua-700">{tm.role}</p>
                <p className="text-sm text-ink-soft">{m.qualifications}</p>
                <p className="mt-3 text-[0.95rem] text-ink-soft">{tm.bio}</p>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* ───────── 5. DENTAL TIPS ───────── */}
      <Section id="tips" tone="cream" labelledBy="tips-title">
        <SectionHeading
          id="tips-title"
          eyebrow={d.tips.eyebrow}
          title={d.tips.title}
          subtitle={d.tips.subtitle}
          action={
            <Link href={`/${lang}/tips/`} className="btn btn-outline shrink-0 self-start md:self-auto">
              {d.tips.seeAll} <Icon name="arrowRight" className="size-4" />
            </Link>
          }
        />
        <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((p, i) => (
            <li key={p.slug} data-reveal style={delay(i * 100)}>
              <TipCard post={p} />
            </li>
          ))}
        </ul>
      </Section>

      {/* ───────── 6. REVIEWS ───────── */}
      <Section id="reviews" tone="aqua" labelledBy="reviews-title">
        <SectionHeading
          id="reviews-title"
          eyebrow={d.reviews.eyebrow}
          title={d.reviews.title}
          subtitle={t(d.reviews.subtitle, { rating })}
          note={<PlaceholderNote>{d.reviews.placeholderNote}</PlaceholderNote>}
          action={
            <a href={clinic.google.reviewsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline shrink-0 self-start md:self-auto">
              {d.reviews.readOnGoogle} <Icon name="external" className="size-4" /><span className="sr-only">{d.a11y.external}</span>
            </a>
          }
        />
        <ReviewsCarousel reviews={d.reviews.items} s={{ ...d.a11y, carouselLabel: d.reviews.carouselLabel }} />
      </Section>

      {/* ───────── 7. FAQ ───────── */}
      <Section id="faq" tone="white" labelledBy="faq-title">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div data-reveal>
            <PlaceholderNote className="mb-4">{d.faq.placeholderNote}</PlaceholderNote>
            <p className="eyebrow mb-4">{d.faq.eyebrow}</p>
            <h2 id="faq-title" className="h-section">{d.faq.title}</h2>
            <p className="lead mt-4">{d.faq.subtitle}</p>
            <a href={clinic.phone.href} className="btn btn-outline mt-8"><Icon name="phone" className="size-4" /> {clinic.phone.display}</a>
          </div>
          <div className="border-t border-line">
            {d.faq.items.map((f, i) => {
              const needsConfirm = CONFIRM.test(f.a);
              return (
                <details key={i} className="faq-item border-b border-line" data-reveal name="faq">
                  <summary className="flex min-h-16 items-center justify-between gap-6 py-5 font-display text-lg font-semibold tracking-tight">
                    {f.q}
                    <span className="faq-chevron grid size-8 shrink-0 place-items-center rounded-full border border-line text-ink">
                      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
                    </span>
                  </summary>
                  <div className="max-w-2xl pb-6 text-ink-soft">
                    {needsConfirm && clinic.showPlaceholderNotes && <span className="placeholder-note mb-2">{d.common.toConfirm}</span>}
                    <p>{f.a.replace(CONFIRM, "")}</p>
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ───────── 8. BOOK ───────── */}
      <Section id="book" tone="cream" labelledBy="book-title">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div data-reveal>
            <p className="eyebrow mb-4">{d.book.eyebrow}</p>
            <h2 id="book-title" className="h-section">{d.book.title}</h2>
            <p className="lead mt-4">{d.book.subtitle}</p>
            <div className="mt-8 rounded-2xl border border-line bg-white p-6">
              <p className="text-sm text-ink-soft">{d.book.orCall}</p>
              <a href={clinic.phone.href} className="mt-1 inline-flex min-h-11 items-center gap-2 font-display text-2xl font-bold tracking-tight text-ink hover:text-aqua-700">
                {clinic.phone.display}
              </a>
              <div className="mt-3"><OpenBadge s={hoursStrings} /></div>
            </div>
          </div>
          <div data-reveal>
            <BookingForm s={d.book} lang={lang} services={services.map(({ id, title }) => ({ id, title }))} />
          </div>
        </div>
      </Section>

      {/* ───────── 9. CONTACT & LOCATION ───────── */}
      <Section id="contact" tone="white" labelledBy="contact-title">
        <SectionHeading id="contact-title" eyebrow={d.contact.eyebrow} title={d.contact.title} subtitle={d.contact.subtitle} />
        <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
          <div className="grid gap-6">
            <div className="card grid gap-6 p-6 sm:p-8" data-reveal>
              <div className="flex items-start gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-aqua-50 text-aqua-700"><Icon name="pin" className="size-5" /></span>
                <div>
                  <h3 className="text-base">{d.contact.address}</h3>
                  <address className="not-italic text-ink-soft">
                    {clinic.address.street[lang]}<br />
                    {clinic.address.locality[lang]} {clinic.address.postalCode}, {clinic.address.country[lang]}
                  </address>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-aqua-50 text-aqua-700"><Icon name="phone" className="size-5" /></span>
                <div>
                  <h3 className="text-base">{d.contact.phone}</h3>
                  <a href={clinic.phone.href} className="inline-flex min-h-11 items-center font-semibold text-aqua-700 underline-offset-4 hover:underline">{clinic.phone.display}</a>
                </div>
              </div>
              {clinic.email && (
                <div className="flex items-start gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-aqua-50 text-aqua-700"><Icon name="mail" className="size-5" /></span>
                  <div>
                    <h3 className="text-base">{d.contact.email}</h3>
                    <a href={`mailto:${clinic.email}`} className="font-semibold text-aqua-700 underline-offset-4 hover:underline">{clinic.email}</a>
                  </div>
                </div>
              )}
              <div className="flex flex-wrap gap-3 border-t border-line pt-6">
                <a href={clinic.google.directionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-book">
                  {d.contact.directions} <Icon name="arrowRight" className="size-4" /><span className="sr-only">{d.a11y.external}</span>
                </a>
                <a href={clinic.phone.href} className="btn btn-outline"><Icon name="phone" className="size-4" /> {d.common.call}</a>
                {clinic.whatsapp && (
                  <a href={`https://wa.me/${clinic.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline"><Icon name="whatsapp" className="size-4" /> {d.contact.whatsapp}</a>
                )}
              </div>
            </div>

            <div className="card p-6 sm:p-8" data-reveal>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-base">{d.contact.hoursTitle}</h3>
                <OpenBadge s={hoursStrings} />
              </div>
              <HoursTable s={hoursStrings} caption={d.contact.hoursTitle} />
              <p className="mt-3 text-xs text-ink-soft">{d.contact.timezoneNote}</p>
            </div>
          </div>
          <div data-reveal>
            <MapEmbed s={d.contact} />
          </div>
        </div>
      </Section>
    </>
  );
}
