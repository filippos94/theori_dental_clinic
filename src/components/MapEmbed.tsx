"use client";
import { useEffect, useState } from "react";
import { readConsent, writeConsent, onConsentChange } from "@/lib/consent";
import { clinic } from "@/config/clinic";
import { Icon } from "./Icon";
import { ToothMascot } from "./Illustrations";

type S = { mapTitle: string; mapConsentTitle: string; mapConsentText: string; mapConsentButton: string; openInMaps: string };

/** Google Maps iframe, loaded only after "Google Maps" consent (GDPR). */
export function MapEmbed({ s }: { s: S }) {
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    setAllowed(!!readConsent()?.media);
    return onConsentChange((c) => setAllowed(c.media));
  }, []);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.75rem] bg-aqua-100 shadow-[var(--shadow-soft)] sm:aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[26rem]">
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
        <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_30%_20%,#fff3c4_0,transparent_45%),radial-gradient(circle_at_80%_80%,#ddf5ea_0,transparent_45%)] p-6 text-center">
          <div className="max-w-sm">
            <div className="relative mx-auto mb-3 grid size-20 place-items-center rounded-full bg-white shadow-[var(--shadow-soft)]">
              <Icon name="pin" className="size-10 text-coral-700" />
              <ToothMascot className="absolute -right-4 -bottom-2 size-10" />
            </div>
            <p className="font-display text-lg font-extrabold text-ink">{s.mapConsentTitle}</p>
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
