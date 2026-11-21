/** Original flat illustrations, used sparingly. All decorative (aria-hidden). */

export function ToothMascot({ className = "", mood = "happy" }: { className?: string; mood?: "happy" | "wink" | "sad" }) {
  return (
    <svg viewBox="0 0 120 130" className={className} aria-hidden="true" focusable="false">
      <path d="M60 18C38 4 10 14 10 46c0 22 11 33 14 60 2 22 19 25 22 6 3-17 7-25 14-25s11 8 14 25c3 19 20 16 22-6 3-27 14-38 14-60 0-32-28-42-50-28Z" fill="#fff" stroke="#17313B" strokeWidth="4.5" strokeLinejoin="round" />
      <path d="M28 34c3-8 10-12 18-11" stroke="#CDEFF5" strokeWidth="6" strokeLinecap="round" fill="none" />
      {mood === "wink" ? (
        <path d="M37 50q5-6 10 0" stroke="#17313B" strokeWidth="4" strokeLinecap="round" fill="none" />
      ) : (
        <circle cx="42" cy="50" r="5" fill="#17313B" />
      )}
      <circle cx="78" cy="50" r="5" fill="#17313B" />
      <circle cx="33" cy="63" r="7" fill="#FF8A75" opacity=".5" />
      <circle cx="87" cy="63" r="7" fill="#FF8A75" opacity=".5" />
      {mood === "sad" ? (
        <path d="M48 70q12-9 24 0" stroke="#17313B" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      ) : (
        <path d="M46 62q14 14 28 0" stroke="#17313B" strokeWidth="4.5" strokeLinecap="round" fill="none" />
      )}
    </svg>
  );
}

export function Sparkle({ className = "", color = "#FFD95E" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="-20 -20 40 40" className={className} aria-hidden="true" focusable="false">
      <path d="M0-20C2-6 6-2 20 0 6 2 2 6 0 20-2 6-6 2-20 0-6-2-2-6 0-20Z" fill={color} />
    </svg>
  );
}

export function Toothbrush({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 140" className={className} aria-hidden="true" focusable="false">
      <rect x="10" y="50" width="20" height="86" rx="10" fill="#FF8A75" stroke="#17313B" strokeWidth="3.5" />
      <rect x="7" y="14" width="26" height="40" rx="8" fill="#fff" stroke="#17313B" strokeWidth="3.5" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={9 + i * 6} y="2" width="4" height="16" rx="2" fill="#16AFC4" />
      ))}
    </svg>
  );
}

/** Soft blob shape for backgrounds. */
export function Blob({ className = "", color = "#FFD95E", variant = 0 }: { className?: string; color?: string; variant?: 0 | 1 | 2 }) {
  const d = [
    "M60-80c35 10 60 45 50 85S60 80 10 85-85 60-90 15-55-70 0-85c20-5 40-2 60 5Z",
    "M70-60c25 30 30 70 0 95S-40 95-70 60-95-30-60-65 45-90 70-60Z",
    "M50-85c40 5 50 50 40 85S40 90-10 85-90 45-85 0-35-90 50-85Z",
  ][variant];
  return (
    <svg viewBox="-100 -100 200 200" className={className} aria-hidden="true" focusable="false">
      <path d={d} fill={color} />
    </svg>
  );
}

/** Wavy section divider. Renders in `currentColor`; place at the top of a section. */
export function Wave({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className={className} style={flip ? { transform: "scaleX(-1)" } : undefined} aria-hidden="true" focusable="false">
      <path d="M0 48c120-26 240-38 360-30s240 40 360 42 240-26 360-36 240 0 360 20v36H0Z" fill="currentColor" />
    </svg>
  );
}
