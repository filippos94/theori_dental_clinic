import { clinic } from "@/config/clinic";

/** Visible "to be replaced" marker. Hidden once clinic.showPlaceholderNotes = false. */
export function PlaceholderNote({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  if (!clinic.showPlaceholderNotes) return null;
  return (
    <p className={`placeholder-note ${className}`}>
      <span aria-hidden="true">✎</span>
      {children}
    </p>
  );
}
