"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { Icon } from "./Icon";
import type { Locale } from "@/i18n";

type Strings = {
  nav: { services: string; about: string; tips: string; reviews: string; contact: string; book: string; home: string };
  a11y: { openMenu: string; closeMenu: string; mainNav: string; languageSwitcher: string; skipToContent: string };
  lang: { short: string; switchTo: string };
};

const SECTIONS = ["services", "about", "tips", "reviews", "contact"] as const;

export function Header({ lang, s }: { lang: Locale; s: Strings }) {
  const pathname = usePathname() ?? `/${lang}/`;
  const isHome = /^\/(en|el)\/?$/.test(pathname);
  const otherLang: Locale = lang === "en" ? "el" : "en";
  const switchHref = pathname.replace(/^\/(en|el)(?=\/|$)/, `/${otherLang}`);

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const menuBtn = useRef<HTMLButtonElement>(null);

  const href = (id: string) => (isHome ? `#${id}` : `/${lang}/#${id}`);

  // Highlight the section currently in view
  useEffect(() => {
    if (!isHome) { setActive(pathname.includes("/tips") ? "tips" : null); return; }
    const els = SECTIONS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visible.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0));
        const best = [...visible.entries()].sort((a, b) => b[1] - a[1])[0];
        setActive(best && best[1] > 0 ? best[0] : null);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.01, 0.5, 1] }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [isHome, pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on Escape, lock background scroll while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); menuBtn.current?.focus(); } };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  const linkCls = (id: string) =>
    `relative rounded-full px-3.5 py-2 font-display font-bold transition-colors min-h-11 inline-flex items-center ${
      active === id ? "bg-aqua-100 text-aqua-900" : "text-ink hover:bg-aqua-50 hover:text-aqua-800"
    }`;

  return (
    <>
      <a href="#main" className="sr-only z-[100] rounded-full bg-aqua-700 px-5 py-3 font-bold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        {s.a11y.skipToContent}
      </a>
      <header className={`sticky top-0 z-[70] transition-[background-color,box-shadow] duration-300 ${scrolled || open ? "bg-cream/95 shadow-[0_6px_24px_-14px_rgba(23,49,59,0.35)] backdrop-blur" : "bg-cream"}`}>
        <div className="container-x flex h-[4.5rem] items-center justify-between gap-3">
          <Link href={`/${lang}/`} className="shrink-0 rounded-2xl">
            <Logo />
          </Link>

          <nav aria-label={s.a11y.mainNav} className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {SECTIONS.map((id) => (
                <li key={id}>
                  <a href={href(id)} className={linkCls(id)} aria-current={active === id ? (isHome ? "location" : "page") : undefined}>
                    {s.nav[id === "about" ? "about" : id]}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href={switchHref}
              hrefLang={otherLang}
              lang={otherLang}
              onClick={() => { try { localStorage.setItem("theori-lang", otherLang); } catch {} }}
              className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 font-bold text-aqua-800 ring-2 ring-aqua-100 transition hover:bg-aqua-50 hover:ring-aqua-200"
              title={`${s.a11y.languageSwitcher}: ${s.lang.switchTo}`}
            >
              <Icon name="globe" className="size-5" />
              <span>{otherLang === "el" ? "ΕΛ" : "EN"}</span>
              <span className="sr-only">({s.lang.switchTo})</span>
            </Link>
            <span className="wiggle hidden sm:inline-flex">
              <a href={href("book")} className="btn btn-book !min-h-11 !px-5">
                <Icon name="calendar" className="size-5" />
                {s.nav.book}
              </a>
            </span>
            <button
              ref={menuBtn}
              type="button"
              className="inline-grid size-11 place-items-center rounded-full bg-aqua-700 text-white xl:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? s.a11y.closeMenu : s.a11y.openMenu}
              onClick={() => setOpen((o) => !o)}
            >
              <Icon name={open ? "close" : "menu"} className="size-6" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div id="mobile-menu" hidden={!open} className="xl:hidden">
          <nav aria-label={s.a11y.mainNav} className="container-x max-h-[calc(100dvh-4.5rem)] overflow-y-auto pb-6">
            <ul className="grid gap-2 rounded-[1.75rem] bg-white p-3 shadow-[var(--shadow-soft)]">
              {!isHome && (
                <li>
                  <Link href={`/${lang}/`} onClick={() => setOpen(false)} className="flex min-h-12 items-center gap-3 rounded-2xl px-4 font-display text-lg font-bold hover:bg-aqua-50">
                    <Icon name="arrowLeft" className="size-5 text-aqua-700" /> {s.nav.home}
                  </Link>
                </li>
              )}
              {SECTIONS.map((id) => (
                <li key={id}>
                  <a
                    href={href(id)}
                    onClick={() => setOpen(false)}
                    className={`flex min-h-12 items-center rounded-2xl px-4 font-display text-lg font-bold ${active === id ? "bg-aqua-100 text-aqua-900" : "hover:bg-aqua-50"}`}
                  >
                    {s.nav[id]}
                  </a>
                </li>
              ))}
              <li className="pt-1">
                <a href={href("book")} onClick={() => setOpen(false)} className="btn btn-book w-full">
                  <Icon name="calendar" className="size-5" /> {s.nav.book}
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}
