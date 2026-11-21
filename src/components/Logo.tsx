import { ToothMark } from "./Illustrations";

/** Placeholder wordmark until the clinic supplies its logo (put it in /public/logo.svg and swap this component). */
export function Logo({ className = "", inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span className={`grid size-10 place-items-center rounded-xl ${inverted ? "bg-white/10 text-white" : "bg-aqua-700 text-white"}`}>
        <ToothMark className="size-6" strokeWidth={1.8} />
      </span>
      <span className="flex flex-col leading-none">
        <span className={`font-display text-lg font-bold tracking-tight ${inverted ? "text-white" : "text-ink"}`}>Theori</span>
        <span className={`mt-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] ${inverted ? "text-aqua-200" : "text-ink-soft"}`}>Dental Clinic</span>
      </span>
    </span>
  );
}
