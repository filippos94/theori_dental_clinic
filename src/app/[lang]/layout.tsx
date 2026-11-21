import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope/wght.css";
import "@fontsource-variable/inter/wght.css";
import "../globals.css";
import { notFound } from "next/navigation";
import { clinic } from "@/config/clinic";
import { getDictionary, isLocale, locales, localeInfo, type Locale } from "@/i18n";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBar } from "@/components/MobileBar";
import { CookieConsent } from "@/components/CookieConsent";
import { RevealObserver } from "@/components/RevealObserver";

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: "#fafaf7",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(clinic.siteUrl),
  applicationName: clinic.name,
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }], apple: "/apple-touch-icon.png" },
  formatDetection: { telephone: true, address: true },
  robots: clinic.allowSearchEngines ? { index: true, follow: true } : { index: false, follow: false },
  other: { "geo.region": "CY-06", "geo.placename": "Paphos", "geo.position": `${clinic.geo.lat};${clinic.geo.lng}`, ICBM: `${clinic.geo.lat}, ${clinic.geo.lng}` },
};

export default async function LangLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const d = getDictionary(lang);
  const headerStrings = { nav: d.nav, a11y: d.a11y, lang: d.lang };

  return (
    <html lang={localeInfo[lang as Locale].htmlLang} className="scroll-smooth">
      <head>
        {/* Enables scroll-reveal styles only when JS runs, so content is never hidden without JS */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body className="min-h-dvh">
        <Header lang={lang} s={headerStrings} />
        <main id="main" tabIndex={-1} className="outline-none">{children}</main>
        <Footer lang={lang} />
        <MobileBar lang={lang} callLabel={d.common.call} bookLabel={d.common.book} />
        <CookieConsent s={d.cookies} lang={lang} />
        <RevealObserver />
      </body>
    </html>
  );
}
