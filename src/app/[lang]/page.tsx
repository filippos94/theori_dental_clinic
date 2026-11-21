import type { Metadata } from "next";
import Link from "next/link";
import { clinic } from "@/config/clinic";
import { getDictionary, t, type Locale } from "@/i18n";
import { getAllPosts } from "@/lib/posts";
import { pageMetadata, dentistJsonLd } from "@/lib/seo";
import { Section, SectionHeading } from "@/components/Section";
import { Picture } from "@/components/Picture";
import { Icon } from "@/components/Icon";
import { ToothMascot, Sparkle, Toothbrush, Blob } from "@/components/Illustrations";
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

export default async function Home({ params }: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await params;
  const d = getDictionary(lang);
  const latest = getAllPosts(lang).slice(0, 3);
  const rating = clinic.google.rating.toFixed(1);
  const services = clinic.services.map((s) => ({ ...s, ...d.services.items[s.id] }));
  const hoursStrings = { ...d.contact, days: d.contact.days };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: d.faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a.replace(CONFIRM, "") } })),
  };

  return (
    <>
      <JsonLd data={dentistJsonLd(lang, d.meta.homeDescription)} />
      <JsonLd data={faqJsonLd} />

      {/* ───────── 1. HERO ───────── */}
      <section id="home" aria-labelledby="hero-title" className="relative overflow-hidden bg-cream">
        <Blob className="pointer-events-none absolute -left-40 -top-40 size-[28rem] opacity-60" color="#CDEFF5" variant={1} />
        <div className="container-x relative grid items-center gap-12 pb-20 pt-8 sm:pt-12 lg:grid-cols-[1.05fr_1fr] lg:gap-8 lg:pb-28 lg:pt-16">
          <div className="animate-pop">
            <p className="pill bg-mint-100 text-mint-700">
              <Icon name="heart" className="size-4" /> {d.hero.eyebrow}
            </p>
            <h1 id="hero-title" className="h-display mt-5 text-ink">
              {d.hero.title.split(" ").slice(0, -3).join(" ")}{" "}
              <span className="relative whitespace-nowrap text-aqua-700">
                {d.hero.title.split(" ").slice(-3).join(" ")}
                <svg viewBox="0 0 300 20" preserveAspectRatio="none" className="absolute -bottom-2 left-0 h-3 w-full text-sun-300" aria-hidden="true">
                  <path d="M4 14C60 4 150 2 296 10" stroke="currentColor" strokeWidth="8" strokeLinecap="round" fill="none" />
                </svg>
              </span>
            </h1>
            <p className="lead mt-6 max-w-xl">{d.hero.subtitle}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <span className="wiggle">
                <a href="#book" className="btn btn-book w-full !min-h-14 !px-7 !text-lg sm:w-auto">
                  <Icon name="calendar" className="size-6" /> {d.hero.ctaBook}
                </a>
              </span>
              <a href={clinic.phone.href} className="btn btn-primary !min-h-14 !px-7 !text-lg">
                <Icon name="phone" className="size-6" /> {t(d.hero.ctaCall, { phone: clinic.phone.display })}
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={clinic.google.reviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-full bg-white py-2 pl-2 pr-5 shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5"
              >
                <span className="grid size-11 place-items-center rounded-full bg-sun-100" aria-hidden="true">
                  <svg viewBox="0 0 24 24" className="size-6"><path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h5.9a5 5 0 0 1-2.2 3.3v2.8h3.6c2-1.9 3.2-4.7 3.2-8.1Z"/><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.8c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.9A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M5.8 14.1a6.6 6.6 0 0 1 0-4.2V7H2.1a11 11 0 0 0 0 10l3.7-2.9Z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 7l3.7 2.9C6.7 7.3 9.1 5.4 12 5.4Z"/></svg>
                </span>
                <span className="leading-tight">
                  <span className="flex items-center gap-1 font-display font-extrabold text-ink">
                    {t(d.hero.googleBadge, { rating })}
                    <span className="flex text-sun-400" aria-hidden="true">
                      {Array.from({ length: 5 }).map((_, i) => <Icon key={i} name="star" className="size-4 fill-current" strokeWidth={1.5} />)}
                    </span>
                  </span>
                  <span className="text-sm text-aqua-800 group-hover:underline">{d.hero.googleBadgeSub} <span className="sr-only">{d.a11y.external}</span></span>
                </span>
              </a>
              <OpenBadge s={hoursStrings} />
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[34rem]">
            <Blob className="absolute -right-10 -top-10 size-[110%] text-sun-300" color="#FFD95E" variant={0} />
            <div className="relative overflow-hidden rounded-[42%_58%_55%_45%/48%_42%_58%_52%] border-[6px] border-white shadow-[var(--shadow-pop)]">
              <Picture name="hero-family" alt={d.hero.imageAlt} priority sizes="(min-width: 1024px) 540px, 92vw" className="aspect-[5/4]" placeholderLabel={d.common.placeholderPhoto} badgeClassName="top-[12%] left-1/2 -translate-x-1/2 whitespace-nowrap" />
            </div>
            <ToothMascot className="absolute -bottom-6 -left-4 size-24 drop-shadow-lg motion-safe:animate-float sm:size-32" />
            <Toothbrush className="absolute -right-2 bottom-6 h-28 rotate-[20deg] motion-safe:animate-float sm:h-36 [animation-delay:1.5s]" />
            <Sparkle className="absolute left-6 top-0 size-10 motion-safe:animate-float [animation-delay:.6s]" />
            <Sparkle className="absolute right-8 top-1/3 size-6 motion-safe:animate-float" color="#FF8A75" />
          </div>
        </div>
      </section>

      {/* ───────── 2. SERVICES ───────── */}
      <Section id="services" tone="aqua" labelledBy="services-title">
        <SectionHeading id="services-title" title={d.services.title} subtitle={d.services.subtitle} eyebrow={<PlaceholderNote className="mb-4">{d.services.placeholderNote}</PlaceholderNote>} />
        <ServicesGrid items={services} s={d.services} />
      </Section>

      {/* ───────── 3. FOR THE WHOLE FAMILY ───────── */}
      <Section tone="mint" flip labelledBy="family-title">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative order-last lg:order-first" data-reveal>
            <div className="overflow-hidden rounded-[2.5rem] border-[6px] border-white shadow-[var(--shadow-soft)]">
              <Picture name="family" alt={d.family.imageAlt} sizes="(min-width: 1024px) 560px, 92vw" className="aspect-[4/3]" placeholderLabel={d.common.placeholderPhoto} />
            </div>
            <Sparkle className="absolute -right-3 -top-4 size-12 motion-safe:animate-float" />
          </div>
          <div>
            <div data-reveal>
              <h2 id="family-title" className="h-section">{d.family.title}</h2>
              <p className="lead mt-3">{d.family.subtitle}</p>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                { icon: "balloon", title: d.family.kidsTitle, text: d.family.kidsText, cls: "bg-sun-100 text-ink" },
                { icon: "hand", title: d.family.nervousTitle, text: d.family.nervousText, cls: "bg-coral-100 text-ink" },
              ].map((c, i) => (
                <div key={c.title} className="card p-6" data-reveal style={{ "--reveal-delay": `${i * 120}ms` } as React.CSSProperties}>
                  <span className={`grid size-12 place-items-center rounded-2xl ${c.cls}`}><Icon name={c.icon} className="size-6" /></span>
                  <h3 className="mt-4 text-xl">{c.title}</h3>
                  <p className="mt-2 text-ink-soft">{c.text}</p>
                </div>
              ))}
            </div>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2" data-reveal>
              {d.family.points.map((p) => (
                <li key={p} className="flex items-start gap-2 font-semibold">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-mint-300 text-ink"><Icon name="check" className="size-4" strokeWidth={3} /></span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ───────── 4. MEET THE TEAM ───────── */}
      <Section id="about" tone="cream" labelledBy="team-title">
        <SectionHeading id="team-title" title={d.team.title} subtitle={d.team.subtitle} eyebrow={<PlaceholderNote className="mb-4">{d.team.placeholderNote}</PlaceholderNote>} />
        <ul className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-2">
          {clinic.team.map((m, i) => {
            const tm = (d.team.members as Record<string, { role: string; bio: string }>)[m.id];
            return (
              <li key={m.id} className="card overflow-hidden text-center" data-reveal style={{ "--reveal-delay": `${i * 120}ms` } as React.CSSProperties}>
                <Picture name={m.photo} alt={t(d.team.photoAlt, { name: m.name })} sizes="(min-width: 640px) 420px, 92vw" className="aspect-[4/5]" placeholderLabel={d.common.placeholderPhoto} />
                <div className="p-6 sm:p-8">
                  <h3 className="text-2xl">{m.name}</h3>
                  <p className="mt-1 font-display font-bold text-aqua-700">{tm.role}</p>
                  <p className="text-sm text-ink-soft">{m.qualifications}</p>
                  <p className="mt-4 text-ink-soft">{tm.bio}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* ───────── 5. DENTAL TIPS ───────── */}
      <Section id="tips" tone="sun" labelledBy="tips-title">
        <SectionHeading id="tips-title" title={d.tips.title} subtitle={d.tips.subtitle} />
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((p, i) => (
            <li key={p.slug} data-reveal style={{ "--reveal-delay": `${i * 100}ms` } as React.CSSProperties} className={i === 2 ? "sm:col-span-2 lg:col-span-1" : ""}>
              <TipCard post={p} />
            </li>
          ))}
        </ul>
        <div className="mt-10 text-center">
          <Link href={`/${lang}/tips/`} className="btn btn-primary">
            {d.tips.seeAll} <Icon name="arrowRight" className="size-5" />
          </Link>
        </div>
      </Section>

      {/* ───────── 6. REVIEWS ───────── */}
      <Section id="reviews" tone="coral" flip labelledBy="reviews-title">
        <SectionHeading
          id="reviews-title"
          title={d.reviews.title}
          subtitle={t(d.reviews.subtitle, { rating })}
          eyebrow={<PlaceholderNote className="mb-4">{d.reviews.placeholderNote}</PlaceholderNote>}
        />
        <ReviewsCarousel reviews={d.reviews.items} s={{ ...d.a11y, carouselLabel: d.reviews.carouselLabel }} />
        <div className="mt-8 text-center">
          <a href={clinic.google.reviewsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
            {d.reviews.readOnGoogle} <Icon name="external" className="size-4" /><span className="sr-only">{d.a11y.external}</span>
          </a>
        </div>
      </Section>

      {/* ───────── 7. FAQ ───────── */}
      <Section id="faq" tone="white" labelledBy="faq-title">
        <SectionHeading id="faq-title" title={d.faq.title} subtitle={d.faq.subtitle} eyebrow={<PlaceholderNote className="mb-4">{d.faq.placeholderNote}</PlaceholderNote>} />
        <div className="mx-auto grid max-w-3xl gap-3">
          {d.faq.items.map((f, i) => {
            const needsConfirm = CONFIRM.test(f.a);
            return (
              <details key={i} className="faq-item rounded-[1.5rem] bg-aqua-50 transition-shadow open:bg-white" data-reveal name="faq">
                <summary className="flex min-h-14 items-center justify-between gap-4 rounded-[1.5rem] px-5 py-4 font-display text-lg font-extrabold sm:px-6">
                  {f.q}
                  <span className="faq-chevron grid size-9 shrink-0 place-items-center rounded-full bg-white text-aqua-800 shadow-sm"><Icon name="chevronDown" className="size-5" /></span>
                </summary>
                <div className="px-5 pb-5 text-ink-soft sm:px-6">
                  {needsConfirm && clinic.showPlaceholderNotes && <span className="placeholder-note mb-2 !py-0.5">{d.common.toConfirm}</span>}
                  <p>{f.a.replace(CONFIRM, "")}</p>
                </div>
              </details>
            );
          })}
        </div>
      </Section>

      {/* ───────── 8. BOOK ───────── */}
      <Section id="book" tone="aqua" labelledBy="book-title">
        <div className="mx-auto max-w-4xl">
          <div className="relative">
            <ToothMascot className="absolute -top-6 right-0 hidden size-24 motion-safe:animate-float md:block" mood="wink" />
            <SectionHeading id="book-title" title={d.book.title} subtitle={d.book.subtitle} />
          </div>
          <div data-reveal>
            <BookingForm s={d.book} lang={lang} services={services.map(({ id, title }) => ({ id, title }))} />
          </div>
        </div>
      </Section>

      {/* ───────── 9. CONTACT & LOCATION ───────── */}
      <Section id="contact" tone="mint" flip labelledBy="contact-title">
        <SectionHeading id="contact-title" title={d.contact.title} subtitle={d.contact.subtitle} />
        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="grid gap-6">
            <div className="card grid gap-5 p-6 sm:p-8" data-reveal>
              <div className="flex items-start gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-coral-100 text-coral-700"><Icon name="pin" /></span>
                <div>
                  <h3 className="text-lg">{d.contact.address}</h3>
                  <address className="not-italic text-ink-soft">
                    {clinic.address.street[lang]}<br />
                    {clinic.address.locality[lang]} {clinic.address.postalCode}, {clinic.address.country[lang]}
                  </address>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-aqua-100 text-aqua-800"><Icon name="phone" /></span>
                <div>
                  <h3 className="text-lg">{d.contact.phone}</h3>
                  <a href={clinic.phone.href} className="inline-flex min-h-11 items-center text-lg font-bold text-aqua-700 underline-offset-4 hover:underline">{clinic.phone.display}</a>
                </div>
              </div>
              {clinic.email && (
                <div className="flex items-start gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-sun-100 text-sun-700"><Icon name="mail" /></span>
                  <div>
                    <h3 className="text-lg">{d.contact.email}</h3>
                    <a href={`mailto:${clinic.email}`} className="font-bold text-aqua-700 underline-offset-4 hover:underline">{clinic.email}</a>
                  </div>
                </div>
              )}
              <div className="flex flex-wrap gap-3">
                <a href={clinic.google.directionsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                  <Icon name="pin" className="size-5" /> {d.contact.directions}<span className="sr-only">{d.a11y.external}</span>
                </a>
                <a href={clinic.phone.href} className="btn btn-outline"><Icon name="phone" className="size-5" /> {d.common.call}</a>
                {clinic.whatsapp && (
                  <a href={`https://wa.me/${clinic.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline"><Icon name="whatsapp" className="size-5" /> {d.contact.whatsapp}</a>
                )}
              </div>
            </div>

            <div className="card p-6 sm:p-8" data-reveal>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h3 className="flex items-center gap-2 text-lg"><Icon name="clock" className="text-aqua-700" /> {d.contact.hoursTitle}</h3>
                <OpenBadge s={hoursStrings} />
              </div>
              <HoursTable s={hoursStrings} caption={d.contact.hoursTitle} />
              <p className="mt-3 text-sm text-ink-soft">{d.contact.timezoneNote}</p>
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
