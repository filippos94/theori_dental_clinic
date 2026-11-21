# Theori Dental Clinic — website

A bright, friendly, bilingual (English / Greek) one-page website with a "Dental Tips" blog for **Theori Dental Clinic, Paphos**.

- **Stack:** Next.js 16 (App Router, static export) + Tailwind CSS 4 + TypeScript
- **Output:** a plain static site in `/out`, so any host works (Netlify and Vercel configs are included)
- **Fonts:** self-hosted *Manrope* (headings) and *Inter* (body), both with Greek. No requests go to Google Fonts, which helps with GDPR.
- **Measured (Lighthouse, mobile, gzip on):** Performance 94–98 · Accessibility 100 · Best Practices 100 · SEO 100

```
/en/                    one-page home  (/el/ for Greek)
/en/tips/               tips list with topic filter
/en/tips/<slug>/        article
/en/privacy/            privacy & cookie policy
/sitemap.xml  /robots.txt  /404.html
/                       redirects to /el/ for Greek browsers, /en/ for everyone else
```

---

## 1. Run it locally

You need **Node.js 20 or newer** (22 recommended).

```bash
npm install
```

```bash
npm run dev
```

Then open <http://localhost:3000/en/>. In dev mode the booking form **simulates** a successful send so you can test the whole flow.

To build and preview the real static site:

```bash
npm run build
```

```bash
npm run serve
```

`npm run build` first runs `npm run images` (see §4), then writes the finished site to `/out`.

---

## 2. Where things live

| What | File |
|---|---|
| **All clinic facts**: phone, address, hours, map, Google links, services list, team, booking setup, site URL | `src/config/clinic.ts` |
| **All site text** (EN / EL) | `src/i18n/en.json`, `src/i18n/el.json` |
| **Blog posts** | `content/tips/<slug>.en.md` and `<slug>.el.md` |
| **Photos and illustrations** (source files) | `assets/photos/` |
| Colours, fonts, animations (calm teal / sand / sage palette) | `src/app/globals.css` (`@theme` block) |
| Sections of the home page | `src/app/[lang]/page.tsx` |

**Turning off the "placeholder" badges:** once everything in `PLACEHOLDERS.md` is supplied, set `showPlaceholderNotes: false` in `src/config/clinic.ts`. That hides every placeholder badge, "draft" label and "[confirm]" marker in one go.

**Changing opening hours:** edit `hours` in `clinic.ts`. The hours table, footer, live "Open now" badge, booking-form checks and Google structured data all update from that one place.

---

## 3. Add a new dental tip

1. Choose a short URL slug, e.g. `flossing-made-easy`.
2. Create **`content/tips/flossing-made-easy.en.md`**:

   ```markdown
   ---
   title: "Flossing made easy"
   description: "Meta description for Google (about 150 characters)."
   excerpt: "One or two friendly sentences shown on the card."
   date: 2026-12-01
   cover: tip-flossing        # an image name in assets/photos (no extension)
   coverAlt: "Describe the image for screen readers"
   tags: [daily-care]         # existing: daily-care, kids, whitening, cosmetic
   readTime: 3                # optional; worked out automatically if left out
   reviewed: true             # false shows a "Draft" badge
   author: "Dr. Name Surname" # optional; otherwise the clinic is the author
   ---

   Write the article in **Markdown** here. Use `## Headings`, lists, **bold**, > quotes…
   ```

3. Create **`content/tips/flossing-made-easy.el.md`** with the same front matter, translated. The slug stays the same. If the Greek file is missing, the Greek site shows the English version.
4. Add a cover image `assets/photos/tip-flossing.jpg`, ideally at least 1600 px wide and 16:10 or wider.
5. **New tag?** Add its label to `tips.tags` in **both** `en.json` and `el.json`.
6. Run `npm run build` (or just push, and the host rebuilds). The article page, list page, home-page "latest 3", sitemap, Open Graph image and Article JSON-LD are all generated automatically.

---

## 4. Images

Put source images in **`assets/photos/`** (JPG, PNG, WebP, AVIF or SVG). `npm run images` runs automatically before `dev` and `build` and generates:

- `public/images/opt/<name>-{480,800,1200,1600}.avif|webp`: responsive versions used through `<picture>` with `srcset`/`sizes`. They are lazy-loaded and have a fixed aspect ratio, so the layout doesn't jump.
- `public/images/og/<name>.jpg`: a 1200×630 Open Graph (social share) image.

**To replace a placeholder**, drop in a photo with the **same name** (e.g. `dentist-1.jpg`) and delete the matching `.svg`. Real photos lose the "placeholder photo" badge automatically.

| Name | Used for | Ideal shape |
|---|---|---|
| `hero-family` | Hero | 4:5 portrait |
| `family` | "For the whole family" | 4:3 |
| `dentist-1`, `dentist-2` | Team (add more in `clinic.ts`) | 4:5 portrait |
| `tip-*` | Blog covers | 16:10 / 16:9 |
| `og-default` | Default social-share image | 1200×630 |

**Logo:** the logo set lives in `brand/` (see `brand/README.md` and the brand guide `brand/brand-guide.html`). The site uses copies in `public/`: `logo.svg` / `logo-el.svg` (header, English / Greek pages), `logo-white.svg` / `logo-el-white.svg` (footer), `favicon.svg`, `apple-touch-icon.png` and `logo-mark.png` (Google structured data). To change the logo, replace those files with the same names.

---

## 5. Deploy

**Live now:** https://theori-dental-clinic.netlify.app (deployed from `main` on Netlify; every push redeploys automatically).

- **`siteUrl`** in `src/config/clinic.ts` is the address used for canonical URLs, hreflang, the sitemap and social images. Change it when the clinic's own domain is connected.
- **`allowSearchEngines`** is `false` while the site still has placeholder content: pages are `noindex` and `robots.txt` blocks crawlers. Set it to `true` at launch, then submit the sitemap in Google Search Console.

### Netlify (recommended: the booking form works with zero setup)

1. Push this folder to a GitHub/GitLab repository.
2. In Netlify, choose **Add new site → Import an existing project**, then pick the repo. `netlify.toml` already sets the build command (`npm run build`), the publish folder (`out`), the language redirect, cache headers and security headers.
3. Booking requests then appear under **Site → Forms → booking**. Turn on email notifications under **Forms → Form notifications**.
   - The form is detected through `public/__forms.html`. Keep that file, and keep its field names in sync if you change the form.
4. Add your domain under **Domain management**.

### Vercel

1. Import the repo in Vercel. `vercel.json` sets the build command and output folder, plus the `/` language redirect.
2. Vercel has no built-in forms, so create a free form endpoint (e.g. [Formspree](https://formspree.io)), then in `clinic.ts` set:

   ```ts
   booking: { provider: "endpoint", endpoint: "https://formspree.io/f/XXXXXXX" },
   ```

### Any other static host

Upload the contents of `/out`. Make `/` redirect to `/en/` (the included `out/index.html` also redirects in the browser) and use `404.html` as the error page.

---

## 6. What's built in

- **Accessibility (WCAG 2.1 AA):** skip link, landmarks, one `h1` per page, labelled form fields with linked error messages, focus moved to the first error, visible focus rings, ≥44 px tap targets, keyboard-operable menu (Esc closes it), accordion and carousel. All colour pairs were checked at ≥4.5:1. Animations switch off under `prefers-reduced-motion`.
- **Local SEO:** per-page title/description/keywords ("dentist Paphos", "οδοντίατρος Πάφος"); `Dentist` JSON-LD with address, geo, phone and split opening hours; `FAQPage`, `Article`, `Blog` and `BreadcrumbList` JSON-LD; hreflang EN/EL/x-default; Open Graph and Twitter cards; a sitemap with language alternates.
- **GDPR:** a cookie banner where "Essential only" has the same prominence as "Accept all", plus a "Cookie settings" link in the footer. Google Maps loads **only** after consent; until then a click-to-load panel is shown. There is no analytics. The booking form needs explicit consent and links to the privacy policy. Fonts are self-hosted.
- **Live hours:** the "Open now / Closed / Lunch break" badge and today's highlighted row are calculated in **Europe/Nicosia** time, whatever the visitor's own time zone. They cover the 13:00–14:00 lunch break and the Wednesday/Saturday afternoon closures. The booking form refuses Sundays and Wednesday/Saturday afternoon requests.
- **Minimal JavaScript:** pages are static HTML. Only the small interactive parts (menu, services cards, carousel, form, hours badge, cookie banner, map, tips filter) hydrate. The FAQ uses native `<details>`, so it needs no JS at all.
