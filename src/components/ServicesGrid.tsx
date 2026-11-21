"use client";
import { useState } from "react";
import { Icon } from "./Icon";

export type ServiceCard = { id: string; icon: string; color: "aqua" | "sun" | "mint" | "coral"; title: string; short: string; detail: string };
type S = { bookThis: string; showMore: string; showLess: string };

const iconTone = {
  aqua: "bg-aqua-50 text-aqua-700",
  sun: "bg-sun-50 text-sun-700",
  mint: "bg-mint-50 text-mint-700",
  coral: "bg-coral-50 text-coral-700",
};

export const SELECT_SERVICE_EVENT = "select-service";

export function ServicesGrid({ items, s }: { items: ServiceCard[]; s: S }) {
  const [openId, setOpenId] = useState<string | null>(null);
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it, i) => {
        const open = openId === it.id;
        return (
          <li key={it.id} data-reveal style={{ "--reveal-delay": `${(i % 3) * 80}ms` } as React.CSSProperties}>
            <div className={`group h-full rounded-2xl border bg-white transition-all duration-300 ${open ? "border-aqua-700 shadow-[var(--shadow-pop)]" : "border-line hover:-translate-y-0.5 hover:border-aqua-200 hover:shadow-[var(--shadow-soft)]"}`}>
              <h3 className="text-lg">
                <button
                  type="button"
                  className="flex w-full items-start gap-4 rounded-2xl p-6 text-left"
                  aria-expanded={open}
                  aria-controls={`svc-${it.id}`}
                  onClick={() => setOpenId(open ? null : it.id)}
                >
                  <span className={`grid size-12 shrink-0 place-items-center rounded-xl ${iconTone[it.color]}`}>
                    <Icon name={it.icon} className="size-6" strokeWidth={1.6} />
                  </span>
                  <span className="flex-1">
                    <span className="block font-display font-semibold tracking-tight text-ink">{it.title}</span>
                    <span className="mt-1 block font-sans text-[0.95rem] font-normal tracking-normal text-ink-soft">{it.short}</span>
                  </span>
                  <span className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border border-line text-ink transition-all duration-300 group-hover:border-aqua-700 ${open ? "rotate-45 border-aqua-700 bg-aqua-700 text-white" : ""}`}>
                    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
                    <span className="sr-only">{open ? s.showLess : s.showMore}</span>
                  </span>
                </button>
              </h3>
              <div id={`svc-${it.id}`} hidden={!open} className="px-6 pb-6">
                <div className="border-t border-line pt-4">
                  <p className="text-[0.95rem] text-ink-soft">{it.detail}</p>
                  <a
                    href="#book"
                    className="mt-3 inline-flex min-h-11 items-center gap-1.5 font-semibold text-aqua-700 underline-offset-4 hover:underline"
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
