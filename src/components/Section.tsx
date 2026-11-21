import { Wave } from "./Illustrations";

const tones = {
  cream: { bg: "bg-cream", wave: "text-cream" },
  white: { bg: "bg-white", wave: "text-white" },
  aqua: { bg: "bg-aqua-50", wave: "text-aqua-50" },
  mint: { bg: "bg-mint-50", wave: "text-mint-50" },
  sun: { bg: "bg-sun-50", wave: "text-sun-50" },
  coral: { bg: "bg-coral-50", wave: "text-coral-50" },
} as const;
export type Tone = keyof typeof tones;

/** A page section with a pastel tint and an optional wavy top edge. */
export function Section({
  id, tone = "cream", wave = true, flip = false, className = "", children, labelledBy,
}: { id?: string; tone?: Tone; wave?: boolean; flip?: boolean; className?: string; children: React.ReactNode; labelledBy?: string }) {
  const t = tones[tone];
  return (
    <section id={id} aria-labelledby={labelledBy} className={`relative ${t.bg} ${className}`}>
      {wave && <Wave flip={flip} className={`pointer-events-none absolute inset-x-0 bottom-[calc(100%-1px)] h-8 w-full sm:h-12 lg:h-16 ${t.wave}`} />}
      <div className="container-x py-16 sm:py-20 lg:py-24">{children}</div>
    </section>
  );
}

export function SectionHeading({ id, title, subtitle, eyebrow, center = true }: { id: string; title: string; subtitle?: string; eyebrow?: React.ReactNode; center?: boolean }) {
  return (
    <div className={`mb-10 sm:mb-14 ${center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`} data-reveal>
      {eyebrow}
      <h2 id={id} className="h-section text-ink">{title}</h2>
      {subtitle && <p className="lead mt-3">{subtitle}</p>}
    </div>
  );
}
