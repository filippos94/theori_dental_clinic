"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { clinic } from "@/config/clinic";
import { weekdayOfDateString } from "@/lib/hours";
import { SELECT_SERVICE_EVENT } from "./ServicesGrid";
import { Icon } from "./Icon";
import type { Dictionary } from "@/i18n";

type S = Dictionary["book"];
type Fields = { name: string; phone: string; email: string; service: string; date: string; time: string; message: string; consent: boolean; "bot-field": string };
type Errors = Partial<Record<keyof Fields, string>>;

const empty: Fields = { name: "", phone: "", email: "", service: "", date: "", time: "any", message: "", consent: false, "bot-field": "" };
const FORM_NAME = "booking";

function todayInCyprus() {
  // YYYY-MM-DD in Europe/Nicosia (en-CA formats as ISO date)
  return new Intl.DateTimeFormat("en-CA", { timeZone: clinic.timeZone }).format(new Date());
}

export function BookingForm({ s, lang, services }: { s: S; lang: string; services: { id: string; title: string }[] }) {
  const [f, setF] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [minDate, setMinDate] = useState<string | undefined>(undefined);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [focusTick, setFocusTick] = useState(0);

  // After a failed submit has re-rendered, move focus to the first invalid field
  useEffect(() => {
    if (!focusTick) return;
    const first = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
    (first ?? summaryRef.current)?.focus();
  }, [focusTick]);

  useEffect(() => {
    setMinDate(todayInCyprus());
    const onSelect = (e: Event) => setF((p) => ({ ...p, service: (e as CustomEvent<string>).detail }));
    window.addEventListener(SELECT_SERVICE_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_SERVICE_EVENT, onSelect);
  }, []);

  const set = <K extends keyof Fields>(k: K, v: Fields[K]) => {
    setF((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  function validate(v: Fields): Errors {
    const e: Errors = {};
    if (v.name.trim().length < 2) e.name = s.errors.name;
    if (v.phone.replace(/[^\d]/g, "").length < 8 || !/^[+\d\s().-]+$/.test(v.phone.trim())) e.phone = s.errors.phone;
    if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = s.errors.email;
    if (v.date) {
      if (minDate && v.date < minDate) e.date = s.errors.date;
      else {
        const wd = weekdayOfDateString(v.date);
        if (clinic.hours[wd].length === 0) e.date = s.errors.sunday;
        else if (v.time === "afternoon" && !clinic.hours[wd].some((iv) => iv.open >= "13:00")) e.time = s.errors.afternoonClosed;
      }
    }
    if (!v.consent) e.consent = s.errors.consent;
    return e;
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate(f);
    setErrors(e);
    if (Object.keys(e).length) {
      setFocusTick((n) => n + 1);
      return;
    }
    if (f["bot-field"]) { setStatus("sent"); return; } // honeypot: silently drop bots

    setStatus("sending");
    const serviceTitle = services.find((x) => x.id === f.service)?.title ?? s.serviceNotSure;
    const payload = { ...f, service: serviceTitle, consent: "yes", language: lang };
    try {
      if (process.env.NODE_ENV === "development") {
        await new Promise((r) => setTimeout(r, 700)); // simulated in `npm run dev`
        console.info("[booking] simulated submission", payload);
      } else if (clinic.booking.provider === "netlify") {
        const body = new URLSearchParams({ "form-name": FORM_NAME, ...Object.fromEntries(Object.entries(payload).map(([k, v]) => [k, String(v)])) });
        const res = await fetch("/__forms.html", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body.toString() });
        if (!res.ok) throw new Error(String(res.status));
      } else {
        const res = await fetch(clinic.booking.endpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error(String(res.status));
      }
      setStatus("sent");
      requestAnimationFrame(() => successRef.current?.focus());
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="card relative animate-pop overflow-hidden p-8 text-center shadow-[var(--shadow-soft)] outline-none sm:p-12">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-mint-100 text-mint-700"><Icon name="check" className="size-8" strokeWidth={2} /></span>
        <h3 className="mt-5 text-2xl text-ink sm:text-3xl">{s.successTitle}</h3>
        <p className="lead mx-auto mt-3 max-w-md">{s.successText.replace("{name}", f.name.trim().split(" ")[0])}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a href={clinic.phone.href} className="btn btn-primary"><Icon name="phone" className="size-5" /> {clinic.phone.display}</a>
          <button type="button" className="btn btn-outline" onClick={() => { setF(empty); setStatus("idle"); }}>{s.successAgain}</button>
        </div>
      </div>
    );
  }

  const err = (k: keyof Fields) => errors[k] ? { "aria-invalid": true as const, "aria-describedby": `${k}-error` } : {};
  const ErrorMsg = ({ k }: { k: keyof Fields }) => errors[k] ? <p id={`${k}-error`} className="field-error flex items-center gap-1"><span aria-hidden="true">●</span>{errors[k]}</p> : null;
  const hasErrors = Object.values(errors).some(Boolean);

  return (
    <form
      ref={formRef}
      name={FORM_NAME}
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      noValidate
      onSubmit={submit}
      className="card grid gap-5 p-6 shadow-[var(--shadow-soft)] sm:grid-cols-2 sm:p-8 lg:p-10"
    >
      <input type="hidden" name="form-name" value={FORM_NAME} />
      <p className="hidden" aria-hidden="true">
        <label>Leave empty <input name="bot-field" tabIndex={-1} autoComplete="off" value={f["bot-field"]} onChange={(e) => set("bot-field", e.target.value)} /></label>
      </p>

      <div ref={summaryRef} tabIndex={-1} className="outline-none sm:col-span-2" aria-live="assertive">
        {hasErrors && <p className="rounded-2xl bg-coral-50 p-3 font-semibold text-coral-700">{s.errors.summary}</p>}
        {status === "error" && <p className="rounded-2xl bg-coral-50 p-3 font-semibold text-coral-700">{s.errors.send} <a className="underline" href={clinic.phone.href}>{clinic.phone.display}</a></p>}
      </div>

      <div>
        <label htmlFor="name" className="field-label">{s.name} <span className="text-coral-700" aria-hidden="true">*</span><span className="sr-only">({s.required})</span></label>
        <input id="name" name="name" className="field" autoComplete="name" required value={f.name} onChange={(e) => set("name", e.target.value)} {...err("name")} />
        <ErrorMsg k="name" />
      </div>
      <div>
        <label htmlFor="phone" className="field-label">{s.phone} <span className="text-coral-700" aria-hidden="true">*</span><span className="sr-only">({s.required})</span></label>
        <input id="phone" name="phone" type="tel" inputMode="tel" className="field" autoComplete="tel" placeholder="+357 …" required value={f.phone} onChange={(e) => set("phone", e.target.value)} {...err("phone")} />
        <ErrorMsg k="phone" />
      </div>
      <div>
        <label htmlFor="email" className="field-label">{s.email} <span className="font-normal text-ink-soft">({s.optional})</span></label>
        <input id="email" name="email" type="email" inputMode="email" className="field" autoComplete="email" value={f.email} onChange={(e) => set("email", e.target.value)} {...err("email")} />
        <ErrorMsg k="email" />
      </div>
      <div>
        <label htmlFor="service" className="field-label">{s.service}</label>
        <select id="service" name="service" className="field appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%230b7385%22 stroke-width=%222.5%22 stroke-linecap=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:1.25rem] bg-[right_1rem_center] bg-no-repeat pr-10" value={f.service} onChange={(e) => set("service", e.target.value)}>
          <option value="">{s.servicePlaceholder}</option>
          {services.map((x) => <option key={x.id} value={x.id}>{x.title}</option>)}
          <option value="other">{s.serviceNotSure}</option>
        </select>
      </div>
      <div>
        <label htmlFor="date" className="field-label">{s.date}</label>
        <input id="date" name="date" type="date" className="field" min={minDate} value={f.date} onChange={(e) => set("date", e.target.value)} {...err("date")} />
        <ErrorMsg k="date" />
      </div>
      <fieldset>
        <legend className="field-label">{s.time}</legend>
        <div className="grid gap-2" {...(errors.time ? { "aria-describedby": "time-error" } : {})}>
          {([["any", s.timeAny], ["morning", s.timeMorning], ["afternoon", s.timeAfternoon]] as const).map(([v, label]) => (
            <label key={v} className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border px-4 py-2 text-[0.95rem] transition ${f.time === v ? "border-aqua-700 bg-aqua-50" : "border-[#cfd8d6] bg-white hover:border-[#aab8b6]"}`}>
              <input type="radio" name="time" value={v} checked={f.time === v} onChange={() => set("time", v)} className="size-5 accent-aqua-700" aria-invalid={errors.time && v === "afternoon" ? true : undefined} />
              <span>{label}</span>
            </label>
          ))}
        </div>
        <ErrorMsg k="time" />
      </fieldset>
      <div className="sm:col-span-2">
        <label htmlFor="message" className="field-label">{s.message} <span className="font-normal text-ink-soft">({s.optional})</span></label>
        <textarea id="message" name="message" rows={4} className="field resize-y" placeholder={s.messageHint} value={f.message} onChange={(e) => set("message", e.target.value)} />
      </div>
      <div className="sm:col-span-2">
        <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-cream p-4">
          <input type="checkbox" name="consent" className="mt-1 size-5 shrink-0 accent-aqua-700" checked={f.consent} onChange={(e) => set("consent", e.target.checked)} {...err("consent")} />
          <span className="text-[0.95rem]">
            {s.consent}{" "}
            <Link href={`/${lang}/privacy/`} className="font-semibold text-aqua-700 underline underline-offset-2">{s.privacyLink}</Link>.
            <span className="text-coral-700" aria-hidden="true"> *</span>
          </span>
        </label>
        <ErrorMsg k="consent" />
      </div>
      <div className="flex flex-col items-start gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" className="btn btn-book w-full sm:w-auto" disabled={status === "sending"}>
          {status === "sending" ? <>{s.sending}</> : <>{s.submit} <Icon name="arrowRight" className="size-4" /></>}
        </button>
        <p className="text-ink-soft">
          {s.orCall}{" "}
          <a href={clinic.phone.href} className="whitespace-nowrap font-bold text-aqua-700 underline underline-offset-2">{clinic.phone.display}</a>
        </p>
      </div>
    </form>
  );
}
