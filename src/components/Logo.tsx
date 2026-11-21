/**
 * Clinic logo (files generated in /brand, copied to /public).
 * Uses the outlined SVG logo, so it looks identical everywhere and needs no font.
 */
export function Logo({ className = "", inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={inverted ? "/logo-white.svg" : "/logo.svg"}
      alt="Theori Dental Clinic"
      width={164}
      height={40}
      className={`block h-10 w-auto ${className}`}
    />
  );
}
