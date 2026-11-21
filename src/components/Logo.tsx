/**
 * Clinic logo (files generated in /brand, copied to /public).
 * Greek pages use the version with "ΟΔΟΝΤΙΑΤΡΕΙΟ"; inverted = white version for dark backgrounds.
 * The SVGs have outlined lettering, so they look identical everywhere and need no font.
 */
const files = {
  en: { light: "/logo.svg", dark: "/logo-white.svg", alt: "Theori Dental Clinic", width: 164 },
  el: { light: "/logo-el.svg", dark: "/logo-el-white.svg", alt: "Theori Οδοντιατρείο", width: 164 },
} as const;

/** `heightClass` sets the logo height (width follows). Default 40px. */
export function Logo({ lang = "en", inverted = false, className = "", heightClass = "h-10" }: { lang?: string; inverted?: boolean; className?: string; heightClass?: string }) {
  const f = lang === "el" ? files.el : files.en;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={inverted ? f.dark : f.light} alt={f.alt} lang={lang} width={f.width} height={40} className={`block w-auto ${heightClass} ${className}`} />
  );
}
