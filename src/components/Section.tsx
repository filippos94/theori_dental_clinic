const tones = {
  cream: "bg-cream",
  white: "bg-white",
  aqua: "bg-aqua-50",
  mint: "bg-mint-50",
  sun: "bg-sun-50",
  coral: "bg-coral-50",
  dark: "bg-ink text-white",
} as const;
export type Tone = keyof typeof tones;

/** A full-width page section with a calm tinted background. */
export function Section({ id, tone = "cream", className = "", children, labelledBy }: { id?: string; tone?: Tone; className?: string; children: React.ReactNode; labelledBy?: string }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={`relative ${tones[tone]} ${className}`}>
      <div className="container-x py-20 sm:py-24 lg:py-28">{children}</div>
    </section>
  );
}

export function SectionHeading({ id, title, subtitle, eyebrow, note, center = false, action }: {
  id: string; title: string; subtitle?: string; eyebrow?: string; note?: React.ReactNode; center?: boolean; action?: React.ReactNode;
}) {
  return (
    <div className={`mb-12 sm:mb-14 ${center ? "mx-auto max-w-2xl text-center" : "flex flex-col gap-6 md:flex-row md:items-end md:justify-between"}`} data-reveal>
      <div className={center ? "" : "max-w-2xl"}>
        {note && <div className="mb-4">{note}</div>}
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <h2 id={id} className="h-section">{title}</h2>
        {subtitle && <p className="lead mt-4">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
