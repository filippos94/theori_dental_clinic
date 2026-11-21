import { clinic } from "@/config/clinic";
import { Icon } from "./Icon";

/** Sticky bottom bar on small screens: Call + Book. */
export function MobileBar({ lang, callLabel, bookLabel }: { lang: string; callLabel: string; bookLabel: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/90 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-2 gap-2">
        <a href={clinic.phone.href} className="btn btn-outline !min-h-12 !px-3">
          <Icon name="phone" className="size-5" /> {callLabel}
        </a>
        <a href={`/${lang}/#book`} className="btn btn-book !min-h-12 !px-3">
          <Icon name="calendar" className="size-5" /> {bookLabel}
        </a>
      </div>
    </div>
  );
}
