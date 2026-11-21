"use client";
import { useEffect, useState } from "react";
import { readConsent, writeConsent, onConsentChange } from "@/lib/consent";
import { clinic } from "@/config/clinic";
import { Icon } from "./Icon";

type S = { mapTitle: string; mapConsentTitle: string; mapConsentText: string; mapConsentButton: string; openInMaps: string };

/** Google Maps iframe, loaded only after "Google Maps" consent (GDPR). */
export function MapEmbed({ s }: { s: S }) {
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    setAllowed(!!readConsent()?.media);
    return onConsentChange((c) => setAllowed(c.media));
  }, []);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-line bg-aqua-50 sm:aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[26rem]">
      {allowed ? (
        <iframe
          title={s.mapTitle}
          src={clinic.google.embedUrl}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-[linear-gradient(#dceded_1px,transparent_1px),linear-gradient(90deg,#dceded_1px,transparent_1px)] bg-[size:32px_32px] p-6 text-center">
          <div className="max-w-sm">
            <div className="mx-auto mb-4 grid size-14 place-items-center rounded-full bg-ink text-white shadow-[var(--shadow-pop)]">
              <Icon name="pin" className="size-6" />
            </div>
            <p className="font-display text-lg font-semibold text-ink">{s.mapConsentTitle}</p>
            <p className="mt-1 text-sm text-ink-soft">{s.mapConsentText}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button type="button" className="btn btn-primary" onClick={() => writeConsent(true)}>{s.mapConsentButton}</button>
              <a href={clinic.google.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                {s.openInMaps} <Icon name="external" className="size-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
