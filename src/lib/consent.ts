"use client";
/** Tiny GDPR consent store (localStorage). Categories: essential (always) + media (Google Maps). */
export type Consent = { media: boolean; decidedAt: string; version: 1 };
const KEY = "theori-consent";
const EVENT = "consent-change";
export const OPEN_SETTINGS_EVENT = "open-cookie-settings";

export function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Consent) : null;
  } catch {
    return null;
  }
}

export function writeConsent(media: boolean) {
  const c: Consent = { media, decidedAt: new Date().toISOString(), version: 1 };
  try { localStorage.setItem(KEY, JSON.stringify(c)); } catch { /* storage blocked: consent lasts for this page view */ }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: c }));
}

export function onConsentChange(cb: (c: Consent) => void) {
  const h = (e: Event) => cb((e as CustomEvent<Consent>).detail);
  window.addEventListener(EVENT, h);
  return () => window.removeEventListener(EVENT, h);
}
