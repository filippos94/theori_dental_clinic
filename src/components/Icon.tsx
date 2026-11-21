/** Friendly rounded line icons (24×24, stroke = currentColor). */
const paths: Record<string, React.ReactNode> = {
  tooth: <path d="M12 5.5C10 4 6 3.5 5 7c-.8 2.8.6 5 1.3 7.5.7 2.5.8 6 2.4 6s1.5-4.5 3.3-4.5 1.7 4.5 3.3 4.5 1.7-3.5 2.4-6c.7-2.5 2.1-4.7 1.3-7.5-1-3.5-5-3-7-1.5Z" />,
  sparkle: <><path d="M12 3c.6 4.2 2.8 6.4 7 7-4.2.6-6.4 2.8-7 7-.6-4.2-2.8-6.4-7-7 4.2-.6 6.4-2.8 7-7Z" /><path d="M19 15.5c.3 1.6 1 2.3 2.5 2.5-1.5.3-2.2 1-2.5 2.5-.3-1.5-1-2.2-2.5-2.5 1.5-.2 2.2-.9 2.5-2.5Z" /></>,
  fill: <><path d="M12 5.5C10 4 6 3.5 5 7c-.8 2.8.6 5 1.3 7.5.7 2.5.8 6 2.4 6s1.5-4.5 3.3-4.5 1.7 4.5 3.3 4.5 1.7-3.5 2.4-6c.7-2.5 2.1-4.7 1.3-7.5-1-3.5-5-3-7-1.5Z" /><circle cx="12" cy="10" r="2.2" /></>,
  root: <><path d="M12 4.5C10.3 3.3 7 3 6.2 6c-.6 2.2.3 4 .9 5.6" /><path d="M12 4.5c1.7-1.2 5-1.5 5.8 1.5.6 2.2-.3 4-.9 5.6" /><path d="M7 11.6c.7 3 .5 8.4 2 8.4 1.3 0 1-4.6 3-4.6s1.7 4.6 3 4.6c1.5 0 1.3-5.4 2-8.4" /><path d="M10 9.5v4M14 9.5v4" /></>,
  crown: <path d="M4 17.5 3 7.5l5 4 4-6.5 4 6.5 5-4-1 10ZM4 20.5h16" />,
  implant: <><path d="M8 4.5c0-1 1.8-1.5 4-1.5s4 .5 4 1.5c0 2-1.5 3.5-4 3.5S8 6.5 8 4.5Z" /><path d="M9.5 8.5h5M10 11h4M10 13.5h4M10.5 16h3M11 18.5h2L12 21" /></>,
  smile: <><circle cx="12" cy="12" r="9" /><path d="M8 14c1 1.8 2.4 2.7 4 2.7s3-.9 4-2.7" /><path d="M9 9.5v.5M15 9.5v.5" /></>,
  balloon: <><path d="M12 15c-3.3 0-6-3-6-6.5S8.7 2.5 12 2.5s6 2.5 6 6-2.7 6.5-6 6.5Z" /><path d="m11 15 1 1.5 1-1.5M12 16.5c0 2-2 2.5-1 5" /></>,
  bolt: <path d="M13 2.5 5 13.5h6l-1 8 8-11h-6Z" />,
  phone: <path d="M6.6 3.5h2.6l1.4 4.2-2 1.4a12 12 0 0 0 6.3 6.3l1.4-2 4.2 1.4v2.6A2.1 2.1 0 0 1 18.4 19.5 15 15 0 0 1 4.5 5.6 2.1 2.1 0 0 1 6.6 3.5Z" />,
  calendar: <><rect x="3.5" y="5" width="17" height="15.5" rx="3.5" /><path d="M3.5 10h17M8 3v4M16 3v4" /><path d="M8.5 14.5h.01M12 14.5h.01M15.5 14.5h.01" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  pin: <><path d="M12 21s7-6.2 7-11.5a7 7 0 1 0-14 0C5 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  star: <path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9Z" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronLeft: <path d="m15 6-6 6 6 6" />,
  chevronRight: <path d="m9 6 6 6-6 6" />,
  arrowLeft: <path d="M19 12H5m6-6-6 6 6 6" />,
  arrowRight: <path d="M5 12h14m-6-6 6 6-6 6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  heart: <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20Z" />,
  hand: <path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V11m0-6.5a1.5 1.5 0 0 1 3 0V11m0-5a1.5 1.5 0 0 1 3 0v7.5c0 4-2.5 7-6.5 7-3 0-4.6-1.6-6-4l-2-3.5a1.5 1.5 0 0 1 2.6-1.5L8 13" />,
  chat: <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 3.5V17A2.5 2.5 0 0 1 4 14.5Z" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 7 8 6 8-6" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9s-1 6.5-3.5 9c-2.5-2.5-3.5-5.5-3.5-9s1-6.5 3.5-9Z" /></>,
  external: <path d="M14 4h6v6M20 4l-9 9M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4" />,
  shield: <path d="M12 3 5 6v5.5c0 4.4 3 8 7 9.5 4-1.5 7-5.1 7-9.5V6Z" />,
  facebook: <path d="M14.5 8.5H17V5h-2.5C12.5 5 11 6.6 11 8.6V11H8.5v3.5H11V21h3.5v-6.5H17l.5-3.5h-3v-2c0-.3.2-.5.5-.5Z" />,
  instagram: <><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17 7h.01" /></>,
  whatsapp: <><path d="M4 20.5 5.3 16A8.5 8.5 0 1 1 8.4 19Z" /><path d="M9 8.5c0 3.5 2.5 6.5 6.5 6.5l1-1.6-2-1-1 .8c-1-.4-2.2-1.6-2.6-2.6l.8-1-1-2Z" /></>,
};

export type IconName = keyof typeof paths;

export function Icon({ name, className = "size-6", strokeWidth = 2 }: { name: IconName | string; className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" focusable="false">
      {paths[name] ?? paths.tooth}
    </svg>
  );
}
