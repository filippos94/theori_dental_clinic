"use client";
import { useEffect, useState } from "react";

/**
 * Tag filter for the tips list. Cards are server-rendered (so they're all in the
 * static HTML for SEO); this only toggles their visibility. Supports #tag=kids links.
 */
export function TipsFilter({ tags, labels, allLabel, filterLabel, noResults, children }: {
  tags: string[]; labels: Record<string, string>; allLabel: string; filterLabel: string; noResults: string; children: React.ReactNode;
}) {
  const [active, setActive] = useState<string | null>(null);
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const m = location.hash.match(/tag=([\w-]+)/);
    if (m && tags.includes(m[1])) setActive(m[1]);
  }, [tags]);

  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>("[data-tags]");
    let n = 0;
    cards.forEach((c) => {
      const show = !active || (c.dataset.tags ?? "").split(",").includes(active);
      c.hidden = !show;
      if (show) n++;
    });
    setCount(n);
    if (active) history.replaceState(null, "", `#tag=${active}`);
    else if (location.hash) history.replaceState(null, "", location.pathname);
  }, [active]);

  const btn = (on: boolean) =>
    `min-h-11 rounded-full px-5 font-display font-bold transition ${on ? "bg-aqua-700 text-white shadow-[var(--shadow-pop)]" : "bg-white text-aqua-800 ring-2 ring-aqua-100 hover:ring-aqua-200"}`;

  return (
    <>
      <div role="group" aria-label={filterLabel} className="mb-10 flex flex-wrap justify-center gap-2">
        <button type="button" className={btn(!active)} aria-pressed={!active} onClick={() => setActive(null)}>{allLabel}</button>
        {tags.map((t) => (
          <button key={t} type="button" className={btn(active === t)} aria-pressed={active === t} onClick={() => setActive(t)}>{labels[t] ?? t}</button>
        ))}
      </div>
      {children}
      <p role="status" className="mt-8 text-center text-ink-soft">{count === 0 ? noResults : ""}</p>
    </>
  );
}
