"use client";
import { useEffect, useRef, useState } from "react";
import { Icon } from "./Icon";

type Review = { name: string; text: string };
type S = { previous: string; next: string; goToSlide: string; carouselLabel: string };

/** Swipeable, keyboard-accessible review carousel (CSS scroll-snap; no autoplay). */
export function ReviewsCarousel({ reviews, s }: { reviews: Review[]; s: S }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const items = [...el.children] as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setIndex(items.indexOf(e.target as HTMLElement)); }),
      { root: el, threshold: 0.6 }
    );
    items.forEach((i) => io.observe(i));
    return () => io.disconnect();
  }, []);

  const go = (i: number) => {
    const el = track.current;
    if (!el) return;
    const n = Math.max(0, Math.min(reviews.length - 1, i));
    const child = el.children[n] as HTMLElement;
    el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    setIndex(n);
  };

  return (
    <div role="region" aria-roledescription="carousel" aria-label={s.carouselLabel}>
      <div
        ref={track}
        className="snap-track -mx-4 flex gap-4 overflow-x-auto px-4 pb-6 pt-2 sm:-mx-2 sm:px-2"
        onKeyDown={(e) => { if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1); } if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1); } }}
      >
        {reviews.map((r, i) => (
          <div
            key={i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} / ${reviews.length}`}
            className="card relative flex w-[85%] shrink-0 flex-col p-7 sm:w-[calc(50%-0.5rem)] sm:p-8 lg:w-[calc(33.333%-0.7rem)]"
          >
                        <div className="flex gap-0.5 text-sun-400" role="img" aria-label="5/5">
              {Array.from({ length: 5 }).map((_, k) => <Icon key={k} name="star" className="size-5 fill-current" strokeWidth={1.5} />)}
            </div>
            <blockquote className="mt-4 flex-1 text-[1.05rem] leading-relaxed text-ink">{r.text}</blockquote>
            <p className="mt-6 flex items-center gap-3 border-t border-line pt-5 text-sm font-semibold text-ink"><span className="grid size-9 place-items-center rounded-full bg-aqua-50 font-display text-aqua-800" aria-hidden="true">{r.name.replace(/^\[[^\]]*\]\s*/, "").charAt(0)}</span>{r.name}</p>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-center gap-3">
        <button type="button" onClick={() => go(index - 1)} disabled={index === 0} className="grid size-12 place-items-center rounded-full border border-line bg-white text-ink transition hover:border-aqua-700 disabled:opacity-40" aria-label={s.previous}>
          <Icon name="chevronLeft" />
        </button>
        <div className="flex">
          {reviews.map((_, i) => (
            <button key={i} type="button" onClick={() => go(i)} className="grid size-11 place-items-center" aria-label={s.goToSlide.replace("{n}", String(i + 1))} aria-current={i === index}>
              <span className={`block h-1.5 rounded-full transition-all ${i === index ? "w-7 bg-ink" : "w-1.5 bg-ink/25"}`} />
            </button>
          ))}
        </div>
        <button type="button" onClick={() => go(index + 1)} disabled={index === reviews.length - 1} className="grid size-12 place-items-center rounded-full border border-line bg-white text-ink transition hover:border-aqua-700 disabled:opacity-40" aria-label={s.next}>
          <Icon name="chevronRight" />
        </button>
      </div>
    </div>
  );
}
