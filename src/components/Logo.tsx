import { ToothMascot } from "./Illustrations";

/** Placeholder wordmark until the clinic supplies its logo (put it in /public/logo.svg and swap this component). */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="grid size-10 place-items-center rounded-2xl bg-aqua-100 sm:size-11">
        <ToothMascot className="size-7 sm:size-8" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-extrabold text-aqua-900 sm:text-xl">Theori</span>
        <span className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-ink-soft">Dental Clinic</span>
      </span>
    </span>
  );
}
