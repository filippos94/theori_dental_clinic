"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { readConsent, writeConsent, OPEN_SETTINGS_EVENT } from "@/lib/consent";

type S = { title: string; text: string; accept: string; reject: string; customise: string; save: string; necessary: string; necessaryDesc: string; media: string; mediaDesc: string; learnMore: string };

export function CookieConsent({ s, lang }: { s: S; lang: string }) {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(false);
  const [media, setMedia] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const c = readConsent();
    if (!c) setOpen(true);
    else setMedia(c.media);
    const reopen = () => { setMedia(readConsent()?.media ?? false); setDetails(true); setOpen(true); setTimeout(() => ref.current?.focus(), 30); };
    window.addEventListener(OPEN_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, reopen);
  }, []);

  if (!open) return null;
  const decide = (m: boolean) => { writeConsent(m); setOpen(false); };

  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-title"
      className="fixed inset-x-3 bottom-[5.25rem] z-[60] mx-auto max-w-xl animate-pop rounded-[1.75rem] bg-white p-4 shadow-[0_20px_60px_-15px_rgba(23,49,59,0.45)] ring-2 ring-aqua-100 outline-none sm:p-6 md:bottom-5"
    >
      <h2 id="cookie-title" className="text-base text-ink sm:text-lg">{s.title}</h2>
      <p className="mt-1.5 text-sm text-ink-soft sm:text-[0.95rem]">
        {s.text}{" "}
        <Link href={`/${lang}/privacy/#cookies`} className="font-semibold text-aqua-700 underline underline-offset-2">{s.learnMore}</Link>
      </p>

      {details && (
        <fieldset className="mt-4 grid gap-3">
          <legend className="sr-only">{s.customise}</legend>
          <label className="flex items-start gap-3 rounded-2xl bg-aqua-50 p-3">
            <input type="checkbox" checked disabled className="mt-1 size-5 accent-aqua-700" />
            <span><strong>{s.necessary}</strong><br /><span className="text-sm text-ink-soft">{s.necessaryDesc}</span></span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-aqua-50 p-3">
            <input type="checkbox" checked={media} onChange={(e) => setMedia(e.target.checked)} className="mt-1 size-5 accent-aqua-700" />
            <span><strong>{s.media}</strong><br /><span className="text-sm text-ink-soft">{s.mediaDesc}</span></span>
          </label>
        </fieldset>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2">
        {details ? (
          <button type="button" className="btn btn-primary col-span-2 !min-h-11" onClick={() => decide(media)}>{s.save}</button>
        ) : (
          <>
            <button type="button" className="btn btn-primary !min-h-11 !px-3 !text-[0.95rem] !shadow-none" onClick={() => decide(true)}>{s.accept}</button>
            {/* Equal prominence for "reject", as required by EU guidance */}
            <button type="button" className="btn btn-primary !min-h-11 !px-3 !text-[0.95rem] !shadow-none" onClick={() => decide(false)}>{s.reject}</button>
            <button type="button" className="col-span-2 min-h-11 font-display font-bold text-aqua-700 underline underline-offset-4" onClick={() => setDetails(true)}>{s.customise}</button>
          </>
        )}
      </div>
    </div>
  );
}

export function CookieSettingsButton({ label, className = "" }: { label: string; className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT))}>
      {label}
    </button>
  );
}
