"use client";
import { useState } from "react";
import { Icon } from "./Icon";

export type ServiceCard = { id: string; icon: string; color: "aqua" | "sun" | "mint" | "coral"; title: string; short: string; detail: string };
type S = { bookThis: string; showMore: string; showLess: string };

const palette = {
  aqua: { card: "bg-aqua-50 hover:bg-aqua-100", icon: "bg-aqua-200 text-aqua-900", ring: "ring-aqua-200" },
  sun: { card: "bg-sun-50 hover:bg-sun-100", icon: "bg-sun-300 text-ink", ring: "ring-sun-300" },
  mint: { card: "bg-mint-50 hover:bg-mint-100", icon: "bg-mint-300 text-ink", ring: "ring-mint-300" },
  coral: { card: "bg-coral-50 hover:bg-coral-100", icon: "bg-coral-300 text-ink", ring: "ring-coral-300" },
};

export const SELECT_SERVICE_EVENT = "select-service";

export function ServicesGrid({ items, s }: { items: ServiceCard[]; s: S }) {
  const [openId, setOpenId] = useState<string | null>(null);
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
      {items.map((it, i) => {
        const p = palette[it.color];
        const open = openId === it.id;
        return (
          <li key={it.id} data-reveal style={{ "--reveal-delay": `${(i % 3) * 90}ms` } as React.CSSProperties}>
            <div className={`group h-full rounded-[1.75rem] ring-2 transition-all duration-300 ${p.card} ${open ? `${p.ring} shadow-[var(--shadow-pop)]` : "ring-transparent hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]"}`}>
              <h3 className="text-xl">
                <button
                  type="button"
                  className="flex w-full items-start gap-4 rounded-[1.75rem] p-5 text-left sm:p-6"
                  aria-expanded={open}
                  aria-controls={`svc-${it.id}`}
                  onClick={() => setOpenId(open ? null : it.id)}
                >
                  <span className={`grid size-14 shrink-0 place-items-center rounded-2xl transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 ${p.icon}`}>
                    <Icon name={it.icon} className="size-7" />
                  </span>
                  <span className="flex-1">
                    <span className="block font-display font-extrabold text-ink">{it.title}</span>
                    <span className="mt-1 block font-sans text-base font-normal text-ink-soft">{it.short}</span>
                  </span>
                  <span className={`mt-1 grid size-8 shrink-0 place-items-center rounded-full bg-white text-aqua-800 transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
                    <Icon name="chevronDown" className="size-5" />
                    <span className="sr-only">{open ? s.showLess : s.showMore}</span>
                  </span>
                </button>
              </h3>
              <div id={`svc-${it.id}`} hidden={!open} className="px-5 pb-6 sm:px-6">
                <div className="rounded-2xl bg-white/80 p-4">
                  <p className="text-ink">{it.detail}</p>
                  <a
                    href="#book"
                    className="mt-3 inline-flex min-h-11 items-center gap-1.5 font-display font-extrabold text-aqua-700 underline-offset-4 hover:underline"
                    onClick={() => window.dispatchEvent(new CustomEvent(SELECT_SERVICE_EVENT, { detail: it.id }))}
                  >
                    {s.bookThis} <Icon name="arrowRight" className="size-4" />
                  </a>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
