/** Minimal line marks used as brand accents (decorative, aria-hidden). */

export function ToothMark({ className = "", strokeWidth = 1.6 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" focusable="false">
      <path d="M12 5.2C10 3.8 6.2 3.4 5.1 6.8c-.8 2.6.5 4.8 1.2 7.3.7 2.6.9 6.4 2.5 6.4 1.7 0 1.4-4.6 3.2-4.6s1.5 4.6 3.2 4.6c1.6 0 1.8-3.8 2.5-6.4.7-2.5 2-4.7 1.2-7.3C17.8 3.4 14 3.8 12 5.2Z" />
      <path d="M9.2 7.6c.6-.8 1.6-1.1 2.6-.8" />
    </svg>
  );
}
