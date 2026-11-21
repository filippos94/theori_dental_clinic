import Link from "next/link";
import { clinic } from "@/config/clinic";
import { getDictionary, type Locale } from "@/i18n";
import { formatIntervals } from "@/lib/hours";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { Wave } from "./Illustrations";
import { CookieSettingsButton } from "./CookieConsent";

export function Footer({ lang }: { lang: Locale }) {
  const d = getDictionary(lang);
  const h = clinic.hours;
  const socials = [
    { key: "facebook", url: clinic.social.facebook, label: "Facebook" },
    { key: "instagram", url: clinic.social.instagram, label: "Instagram" },
    { key: "whatsapp", url: clinic.whatsapp ? `https://wa.me/${clinic.whatsapp}` : null, label: "WhatsApp" },
  ];
  const linkCls = "rounded-md underline-offset-4 hover:underline";
  return (
    <footer className="relative bg-aqua-900 pb-28 text-aqua-50 md:pb-10">
      <Wave className="pointer-events-none absolute inset-x-0 bottom-[calc(100%-1px)] h-10 w-full text-aqua-900 sm:h-14" />
      <div className="container-x grid gap-10 pt-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="inline-block rounded-2xl bg-cream px-3 py-2"><Logo /></span>
          <p className="mt-4 max-w-xs">{d.footer.tagline}</p>
          <p className="mt-3 inline-flex items-center gap-1.5 font-bold text-sun-300">
            <Icon name="star" className="size-5 fill-current" strokeWidth={1.5} /> {clinic.google.rating.toFixed(1)} Google
          </p>
        </div>

        <div>
          <h2 className="text-lg text-white">{d.footer.hours}</h2>
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-[0.95rem]">
            <dt>{d.footer.weekdays}</dt><dd className="tabular-nums">{formatIntervals(h.mon)}</dd>
            <dt>{d.footer.wed}</dt><dd className="tabular-nums">{formatIntervals(h.wed)}</dd>
            <dt>{d.footer.sat}</dt><dd className="tabular-nums">{formatIntervals(h.sat)}</dd>
            <dt>{d.footer.sun}</dt><dd>{d.contact.closed}</dd>
          </dl>
        </div>

        <div>
          <h2 className="text-lg text-white">{d.footer.contact}</h2>
          <address className="mt-3 grid gap-3 not-italic">
            <a href={clinic.phone.href} className={`inline-flex min-h-11 items-center gap-2 font-bold text-white ${linkCls}`}>
              <Icon name="phone" className="size-5 text-sun-300" /> {clinic.phone.display}
            </a>
            {clinic.email && (
              <a href={`mailto:${clinic.email}`} className={`inline-flex items-center gap-2 ${linkCls}`}>
                <Icon name="mail" className="size-5 text-sun-300" /> {clinic.email}
              </a>
            )}
            <a href={clinic.google.mapsUrl} target="_blank" rel="noopener noreferrer" className={`inline-flex items-start gap-2 ${linkCls}`}>
              <Icon name="pin" className="mt-0.5 size-5 shrink-0 text-sun-300" />
              <span>{clinic.address.street[lang]}<br />{clinic.address.locality[lang]} {clinic.address.postalCode}, {clinic.address.country[lang]}</span>
            </a>
          </address>
        </div>

        <div>
          <h2 className="text-lg text-white">{d.footer.follow}</h2>
          <ul className="mt-3 flex gap-2">
            {socials.map((sc) => (
              <li key={sc.key}>
                {sc.url ? (
                  <a href={sc.url} target="_blank" rel="noopener noreferrer" className="grid size-11 place-items-center rounded-full bg-aqua-800 text-white transition hover:-translate-y-0.5 hover:bg-aqua-700" aria-label={`${sc.label} ${d.a11y.external}`}>
                    <Icon name={sc.key} className="size-5" />
                  </a>
                ) : clinic.showPlaceholderNotes ? (
                  <span className="grid size-11 place-items-center rounded-full border-2 border-dashed border-aqua-700 text-aqua-200" title={`${sc.label}: ${d.common.comingSoon}`}>
                    <Icon name={sc.key} className="size-5" />
                    <span className="sr-only">{sc.label}: {d.common.comingSoon}</span>
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
          <ul className="mt-6 grid gap-1 text-[0.95rem]">
            <li><Link href={`/${lang}/privacy/`} className={`inline-flex min-h-11 items-center ${linkCls}`}>{d.footer.privacy}</Link></li>
            <li><Link href={`/${lang}/privacy/#cookies`} className={`inline-flex min-h-11 items-center ${linkCls}`}>{d.footer.cookies}</Link></li>
            <li><CookieSettingsButton label={d.footer.cookieSettings} className={`inline-flex min-h-11 items-center text-left ${linkCls}`} /></li>
          </ul>
        </div>
      </div>
      <div className="container-x mt-10 border-t border-aqua-800 pt-6 text-sm text-aqua-100">
        © {new Date().getFullYear()} {clinic.name}. {d.footer.rights}
      </div>
    </footer>
  );
}
