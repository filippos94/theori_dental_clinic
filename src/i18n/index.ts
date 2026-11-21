import en from "./en.json";
import el from "./el.json";

export const locales = ["en", "el"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export type Dictionary = typeof en;
const dictionaries: Record<Locale, Dictionary> = { en, el };

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function getDictionary(lang: string): Dictionary {
  return dictionaries[isLocale(lang) ? lang : defaultLocale];
}

/** Replace {placeholders} in a translation string. */
export function t(template: string, vars: Record<string, string | number> = {}): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}

/** BCP-47 tags for <html lang>, og:locale and date formatting. */
export const localeInfo: Record<Locale, { htmlLang: string; ogLocale: string; dateLocale: string }> = {
  en: { htmlLang: "en", ogLocale: "en_GB", dateLocale: "en-GB" },
  el: { htmlLang: "el", ogLocale: "el_GR", dateLocale: "el-GR" },
};
