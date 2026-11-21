"use client";
import { useEffect, useState } from "react";
import { clinic, type Weekday } from "@/config/clinic";
import { getOpenStatus, nowInClinicTz, weekdays, type OpenStatus } from "@/lib/hours";

type S = {
  today: string; closed: string; openUntil: string; opensAt: string; opensOn: string; lunch: string; closedNow: string;
  days: Record<Weekday, string>;
};
const fill = (tpl: string, v: Record<string, string>) => tpl.replace(/\{(\w+)\}/g, (_, k) => v[k] ?? "");

/** Re-computes every 30s in Europe/Nicosia time. Renders nothing time-specific on the server (static HTML). */
function useClinicClock() {
  const [state, setState] = useState<{ status: OpenStatus; today: Weekday } | null>(null);
  useEffect(() => {
    const tick = () => setState({ status: getOpenStatus(), today: nowInClinicTz().day });
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);
  return state;
}

export function OpenBadge({ s, className = "" }: { s: S; className?: string }) {
  const clock = useClinicClock();
  if (!clock) return <span className={`pill invisible ${className}`} aria-hidden="true">·</span>;
  const st = clock.status;
  let text: string, open = false;
  if (st.state === "open") { text = fill(s.openUntil, { time: st.closesAt }); open = true; }
  else if (st.state === "lunch") text = fill(s.lunch, { time: st.reopensAt });
  else if (st.nextOpen && st.today) text = fill(s.opensAt, { time: st.nextOpen });
  else if (st.nextOpen && st.nextDay) text = fill(s.opensOn, { day: s.days[st.nextDay], time: st.nextOpen });
  else text = s.closedNow;
  return (
    <span role="status" className={`pill ${open ? "bg-mint-100 text-mint-700" : "bg-coral-100 text-coral-700"} ${className}`}>
      <span className="relative flex size-2.5">
        {open && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint-700 opacity-60 motion-reduce:hidden" />}
        <span className={`relative inline-flex size-2.5 rounded-full ${open ? "bg-mint-700" : "bg-coral-700"}`} />
      </span>
      {text}
    </span>
  );
}

export function HoursTable({ s, caption }: { s: S; caption: string }) {
  const clock = useClinicClock();
  return (
    <table className="w-full text-left">
      <caption className="sr-only">{caption}</caption>
      <tbody>
        {weekdays.map((d) => {
          const isToday = clock?.today === d;
          const ivs = clinic.hours[d];
          return (
            <tr key={d} className={`${isToday ? "bg-sun-100 font-bold" : ""} transition-colors`} aria-current={isToday ? "date" : undefined}>
              <th scope="row" className="rounded-l-2xl py-2.5 pl-4 pr-2 font-semibold">
                <span className="inline-flex items-center gap-2">
                  {s.days[d]}
                  {isToday && <span className="pill bg-sun-300 !px-2 !py-0 text-xs text-ink">{s.today}</span>}
                </span>
              </th>
              <td className="rounded-r-2xl py-2.5 pr-4 text-right tabular-nums">
                {ivs.length ? (
                  ivs.map((iv, i) => (
                    <span key={i} className="block sm:inline">
                      {i > 0 && <span className="hidden sm:inline" aria-hidden="true"> · </span>}
                      {iv.open}–{iv.close}
                    </span>
                  ))
                ) : (
                  <span className="text-coral-700">{s.closed}</span>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

