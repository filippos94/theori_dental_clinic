import { clinic, type Weekday, type Interval } from "@/config/clinic";

export const weekdays: Weekday[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const jsDayToKey: Weekday[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** Current weekday + minutes-since-midnight in the clinic's time zone (Europe/Nicosia). */
export function nowInClinicTz(date = new Date()): { day: Weekday; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: clinic.timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const day = get("weekday").toLowerCase().slice(0, 3) as Weekday;
  return { day, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

export type OpenStatus =
  | { state: "open"; closesAt: string }
  | { state: "lunch"; reopensAt: string }
  | { state: "closed"; nextDay: Weekday | null; nextOpen: string | null; today: boolean };

export function getOpenStatus(date = new Date()): OpenStatus {
  const { day, minutes } = nowInClinicTz(date);
  const today: Interval[] = clinic.hours[day];

  for (const iv of today) {
    if (minutes >= toMinutes(iv.open) && minutes < toMinutes(iv.close)) {
      return { state: "open", closesAt: iv.close };
    }
  }
  const laterToday = today.find((iv) => toMinutes(iv.open) > minutes);
  if (laterToday) {
    const hadEarlier = today.some((iv) => toMinutes(iv.close) <= minutes);
    return hadEarlier
      ? { state: "lunch", reopensAt: laterToday.open }
      : { state: "closed", nextDay: day, nextOpen: laterToday.open, today: true };
  }
  // Look ahead up to 7 days
  const idx = weekdays.indexOf(day);
  for (let i = 1; i <= 7; i++) {
    const d = weekdays[(idx + i) % 7];
    if (clinic.hours[d].length) return { state: "closed", nextDay: d, nextOpen: clinic.hours[d][0].open, today: false };
  }
  return { state: "closed", nextDay: null, nextOpen: null, today: false };
}

export function weekdayOfDateString(yyyyMmDd: string): Weekday {
  const [y, m, d] = yyyyMmDd.split("-").map(Number);
  return jsDayToKey[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
}

const schemaDay: Record<Weekday, string> = {
  mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday", sun: "Sunday",
};

/** schema.org openingHoursSpecification, grouping days that share the same interval (handles split hours). */
export function openingHoursSpecification() {
  const groups = new Map<string, string[]>();
  for (const d of weekdays) {
    for (const iv of clinic.hours[d]) {
      const key = `${iv.open}-${iv.close}`;
      groups.set(key, [...(groups.get(key) ?? []), schemaDay[d]]);
    }
  }
  return [...groups.entries()].map(([key, days]) => {
    const [opens, closes] = key.split("-");
    return { "@type": "OpeningHoursSpecification", dayOfWeek: days, opens, closes };
  });
}

export const formatIntervals = (ivs: readonly Interval[]) => ivs.map((iv) => `${iv.open}–${iv.close}`).join(", ");
