/**
 * ─────────────────────────────────────────────────────────────
 *  THEORI DENTAL CLINIC — all clinic facts live in this file.
 *  Text that appears on the site (headings, bios, service copy)
 *  lives in src/i18n/en.json and src/i18n/el.json.
 *  Anything marked TODO is a placeholder — see PLACEHOLDERS.md.
 * ─────────────────────────────────────────────────────────────
 */

export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
export type Interval = { open: string; close: string }; // "HH:MM", 24h, Europe/Nicosia

export const clinic = {
  name: "Theori Dental Clinic",

  /**
   * Live address of the site (no trailing slash). Used for canonical URLs, sitemap and social previews.
   * TODO: change to the clinic's own domain (e.g. "https://www.theoridental.com") once it is connected in Netlify.
   */
  siteUrl: "https://theori-dental.netlify.app",

  /**
   * Search engines: while false, every page says "noindex" and robots.txt blocks crawlers, so Google
   * doesn't index placeholder content (sample reviews, placeholder dentists). Set to true at launch.
   */
  allowSearchEngines: false,

  /**
   * While true, the site shows small "placeholder" badges on sample photos,
   * sample reviews, unreviewed articles and missing details.
   * Set to false once everything in PLACEHOLDERS.md has been supplied.
   */
  showPlaceholderNotes: true,

  phone: {
    display: "+357 26 937970",
    href: "tel:+35726937970",
    e164: "+35726937970",
  },

  /** TODO: fill in. Leave null to hide. */
  email: null as string | null, // e.g. "hello@theoridental.com"
  /** TODO: WhatsApp number in international format without + or spaces, e.g. "35799123456". */
  whatsapp: null as string | null,

  /** TODO: social profile URLs. Leave null to hide. */
  social: {
    facebook: null as string | null,
    instagram: null as string | null,
  },

  address: {
    street: { en: "Leoforos Nikolaou I. Nikolaidi 19", el: "Λεωφ. Νικ. Ι. Νικολαΐδη 19" },
    locality: { en: "Paphos", el: "Πάφος" },
    postalCode: "8010",
    country: { en: "Cyprus", el: "Κύπρος" },
    countryCode: "CY",
  },

  geo: { lat: 34.7782304, lng: 32.4295863 },

  google: {
    placeId: "ChIJZ0Qte-oH5xQRiNBoO_TURwI",
    mapsUrl: "https://www.google.com/maps/place/?q=place_id:ChIJZ0Qte-oH5xQRiNBoO_TURwI",
    reviewsUrl: "https://search.google.com/local/reviews?placeid=ChIJZ0Qte-oH5xQRiNBoO_TURwI",
    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=34.7782304%2C32.4295863&destination_place_id=ChIJZ0Qte-oH5xQRiNBoO_TURwI",
    embedUrl: "https://www.google.com/maps?q=34.7782304,32.4295863&z=17&output=embed",
    /** Rating as shown on Google. We deliberately do not show a review count. */
    rating: 5.0,
  },

  timeZone: "Europe/Nicosia",

  /** Opening hours. Each day can have several intervals (lunch break = two intervals). */
  hours: {
    mon: [{ open: "08:00", close: "13:00" }, { open: "14:00", close: "19:00" }],
    tue: [{ open: "08:00", close: "13:00" }, { open: "14:00", close: "19:00" }],
    wed: [{ open: "08:00", close: "13:00" }],
    thu: [{ open: "08:00", close: "13:00" }, { open: "14:00", close: "19:00" }],
    fri: [{ open: "08:00", close: "13:00" }, { open: "14:00", close: "19:00" }],
    sat: [{ open: "08:00", close: "13:00" }],
    sun: [],
  } satisfies Record<Weekday, Interval[]>,

  /**
   * Services shown in the grid, in this order. Text for each id is in the
   * translation files under services.items.<id>. TODO: confirm the list.
   */
  services: [
    { id: "checkups", icon: "tooth", color: "aqua" },
    { id: "whitening", icon: "sparkle", color: "sun" },
    { id: "fillings", icon: "fill", color: "mint" },
    { id: "rootCanal", icon: "root", color: "coral" },
    { id: "crowns", icon: "crown", color: "aqua" },
    { id: "implants", icon: "implant", color: "sun" },
    { id: "cosmetic", icon: "smile", color: "mint" },
    { id: "kids", icon: "balloon", color: "coral" },
    { id: "emergency", icon: "bolt", color: "aqua" },
  ] as const,

  /**
   * Team members. Name/qualifications are not translated; bio and specialty
   * live in the translation files under team.members.<id>.
   * `photo` is a file name in assets/photos (without extension).
   * TODO: replace with real dentist details and photos.
   */
  team: [
    { id: "dentist1", name: "Dr. [Name Surname]", qualifications: "DDS — [University]", photo: "dentist-1" },
    { id: "dentist2", name: "Dr. [Name Surname]", qualifications: "DDS, MSc — [University]", photo: "dentist-2" },
  ],

  /**
   * Booking form delivery.
   *  - "netlify": uses Netlify Forms (zero setup when hosted on Netlify).
   *  - "endpoint": POSTs JSON to `endpoint` (e.g. a Formspree URL) — use this on Vercel.
   * In `npm run dev` submissions are simulated so you can test the flow.
   */
  booking: {
    provider: "netlify" as "netlify" | "endpoint",
    endpoint: "", // e.g. "https://formspree.io/f/xxxxxxx"
  },
} as const;

export type Clinic = typeof clinic;
export type ServiceId = (typeof clinic.services)[number]["id"];
