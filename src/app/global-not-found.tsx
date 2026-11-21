import type { Metadata } from "next";
import "@fontsource-variable/manrope/wght.css";
import "@fontsource-variable/inter/wght.css";
import "./globals.css";
import en from "@/i18n/en.json";
import el from "@/i18n/el.json";

export const metadata: Metadata = { title: "404 | Theori Dental Clinic", robots: { index: false } };

/** Friendly bilingual 404 (served as 404.html by static hosts). */
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="grid min-h-dvh place-items-center bg-cream p-6 text-center">
        <main className="relative max-w-xl">
          <img src="/logo.svg" alt="Theori Dental Clinic" width={164} height={40} className="mx-auto h-10 w-auto" />
          <p className="mt-4 font-display text-7xl font-bold tracking-tighter text-aqua-700">404</p>
          <h1 className="mt-4 text-3xl sm:text-4xl">{en.notFound.title}</h1>
          <p className="lead mt-2">{en.notFound.text}</p>
          <p lang="el" className="mt-8 border-t border-line pt-8 font-display text-xl font-semibold">{el.notFound.title}</p>
          <p lang="el" className="text-ink-soft">{el.notFound.text}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="/en/" className="btn btn-primary">{en.notFound.home}</a>
            <a href="/el/" lang="el" className="btn btn-book">{el.notFound.home}</a>
          </div>
        </main>
      </body>
    </html>
  );
}
