import type { Metadata } from "next";
import { clinic } from "@/config/clinic";
import { locales, localeInfo, type Locale } from "@/i18n";
import { openingHoursSpecification } from "./hours";
import { getImage } from "./images";

export const absoluteUrl = (p: string) => `${clinic.siteUrl}${p.startsWith("/") ? p : `/${p}`}`;

/** Builds canonical + hreflang alternates for a path that exists in every language, e.g. "/tips/". */
export function alternates(lang: Locale, pathAfterLang: string): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[localeInfo[l].htmlLang] = absoluteUrl(`/${l}${pathAfterLang}`);
  languages["x-default"] = absoluteUrl(`/en${pathAfterLang}`);
  return { canonical: absoluteUrl(`/${lang}${pathAfterLang}`), languages };
}

export function ogImageFor(name: string) {
  const img = getImage(name);
  return img ? [{ url: absoluteUrl(img.og), width: 1200, height: 630 }] : undefined;
}

export function pageMetadata(opts: {
  lang: Locale;
  path: string;
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article";
  keywords?: string;
  publishedTime?: string;
}): Metadata {
  const images = ogImageFor(opts.image ?? "og-default");
  return {
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords,
    alternates: alternates(opts.lang, opts.path),
    openGraph: {
      type: opts.type ?? "website",
      title: opts.title,
      description: opts.description,
      url: absoluteUrl(`/${opts.lang}${opts.path}`),
      siteName: clinic.name,
      locale: localeInfo[opts.lang].ogLocale,
      alternateLocale: locales.filter((l) => l !== opts.lang).map((l) => localeInfo[l].ogLocale),
      images,
      ...(opts.publishedTime ? { publishedTime: opts.publishedTime } : {}),
    },
    twitter: { card: "summary_large_image", title: opts.title, description: opts.description, images: images?.map((i) => i.url) },
  };
}

export function dentistJsonLd(lang: Locale, description: string) {
  const sameAs = [clinic.google.mapsUrl, clinic.social.facebook, clinic.social.instagram].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "@id": `${clinic.siteUrl}/#dentist`,
    name: clinic.name,
    description,
    url: absoluteUrl(`/${lang}/`),
    telephone: clinic.phone.e164,
    ...(clinic.email ? { email: clinic.email } : {}),
    image: absoluteUrl(getImage("og-default")?.og ?? "/favicon.svg"),
    logo: absoluteUrl("/favicon.svg"),
    address: {
      "@type": "PostalAddress",
      streetAddress: clinic.address.street[lang],
      addressLocality: clinic.address.locality[lang],
      postalCode: clinic.address.postalCode,
      addressCountry: clinic.address.countryCode,
    },
    geo: { "@type": "GeoCoordinates", latitude: clinic.geo.lat, longitude: clinic.geo.lng },
    hasMap: clinic.google.mapsUrl,
    areaServed: { "@type": "City", name: clinic.address.locality[lang] },
    openingHoursSpecification: openingHoursSpecification(),
    availableLanguage: ["en", "el"],
    sameAs,
  };
}
