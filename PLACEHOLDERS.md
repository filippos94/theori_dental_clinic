# Placeholder checklist: what the clinic needs to supply or approve

While `showPlaceholderNotes: true` (in `src/config/clinic.ts`), every item below is marked on the site with a yellow striped badge. Tick each one off, then set `showPlaceholderNotes: false`.

## A. Clinic details: `src/config/clinic.ts`

- [x] **Live site**: https://theori-dental-clinic.netlify.app (set as `siteUrl`).
- [ ] **Own domain** (e.g. `theoridental.com`): connect it in Netlify → Domain management, then update `siteUrl`.
- [ ] **Allow Google to index the site**: set `allowSearchEngines: true` once the placeholders below are replaced. Until then every page is marked "noindex" so sample content stays out of Google.
- [ ] **Email address** (`email`): hidden until filled in.
- [ ] **WhatsApp number** (`whatsapp`), international format without + or spaces, e.g. `35799123456`.
- [ ] **Facebook URL** (`social.facebook`).
- [ ] **Instagram URL** (`social.instagram`).
- [ ] **Confirm opening hours** (taken from Google Maps): Mon/Tue/Thu/Fri 08:00–13:00 & 14:00–19:00 · Wed 08:00–13:00 · Sat 08:00–13:00 · Sun closed.
- [ ] **Confirm address**: Leoforos Nikolaou I. Nikolaidi 19, Paphos 8010 (Greek: Λεωφ. Νικ. Ι. Νικολαΐδη 19, Πάφος 8010).
- [ ] **Booking form delivery: Formspree.** Create the form at formspree.io with the clinic's email, then put its address in `booking.formspreeUrl` (e.g. `https://formspree.io/f/abcd1234`). Until then the form shows an error and asks visitors to call.

## B. Logo & icons

- [ ] **Approve the logo.** A proposal (tooth + Θ-smile mark) is now live on the site; see `brand/`. If the clinic already has a logo, replace the files listed in the README's "Logo" note.
- [x] Favicon and Apple touch icon made from the proposed logo.

## C. Services: `clinic.services` + `services.items` in `src/i18n/*.json`

- [ ] **Confirm the list of services.** Current placeholder list: check-ups & cleaning, whitening, fillings, root canal, crowns & bridges, implants, cosmetic dentistry, children's dentistry, emergencies.
- [ ] **Approve the one-line and detail text** for each service (EN + EL).
- [ ] Remove the "Service list to be confirmed" note (it disappears automatically when `showPlaceholderNotes` is false).

## D. Team: `clinic.team` + `team.members` in `src/i18n/*.json`

For **each** dentist:
- [ ] Full name (e.g. "Dr. Maria Theori")
- [ ] Qualifications / university
- [ ] Specialty / role (EN + EL)
- [ ] A short friendly bio, 2–3 sentences (EN + EL)
- [ ] A portrait photo → `assets/photos/dentist-1.jpg`, `dentist-2.jpg`… (4:5 portrait, ≥1200 px wide, bright and smiling)
- [ ] How many dentists to show (add or remove entries in `clinic.team`)

## E. Photos: `assets/photos/` (currently illustrated placeholders)

- [ ] `hero-family`: smiling patients/family for the hero (5:4)
- [ ] `family`: parent and child, or a relaxed patient (4:3)
- [ ] `og-default`: the image shown when the site is shared on social media (1200×630). It could be the clinic exterior or the team.
- [ ] Optional: blog cover photos (`tip-brushing`, `tip-first-visit`, `tip-whitening`). The illustrations can stay if preferred.
- [ ] Confirm you have **consent / usage rights** for every photo of a real person.

## F. Reviews: `reviews.items` in `src/i18n/*.json`

- [ ] Replace the **4 sample reviews** (labelled "[Sample]") with real Google reviews, **with each patient's permission**. Use first name and initial only.
- [ ] Confirm the **5.0★** Google rating is still current before launch. No review count is shown, on purpose.

## G. FAQ: `faq.items` in `src/i18n/*.json`

Answers marked **[confirm]** / **[επιβεβαίωση]** need checking:
- [ ] **Payment**: which methods are accepted (cash, cards, instalments, insurance/GESY?)
- [ ] **Parking**: where patients can actually park
- [ ] **Languages**: which languages the team speaks (Greek, English, others?)
- [ ] Review the other answers (first visit, kids, emergencies) for accuracy.

## H. Blog articles: `content/tips/` (all 3 are marked `reviewed: false`, so they show a "Draft" badge)

A dentist should review **both the English and Greek versions** of each, then set `reviewed: true`:
- [ ] "How to brush properly: a 2-minute routine" / "Πώς να βουρτσίζετε σωστά"
- [ ] "Your child's first dental visit: what to expect" / "Η πρώτη επίσκεψη του παιδιού στον οδοντίατρο"
- [ ] "Teeth whitening: what actually works" / "Λεύκανση δοντιών: τι πραγματικά πιάνει"
- [ ] Optional: set `author:` to the reviewing dentist's name (good for credibility and SEO).
- [ ] Optional: set the publication `date:` to the actual launch date.

## I. Legal: `privacy` in `src/i18n/*.json`

- [ ] **Privacy policy** text is a template. Fill in: contact email, retention period "[X months]", the form processor (Netlify / Formspree), and the "Last updated" date. A legal adviser should ideally review it.
- [ ] Confirm the cookie notice matches reality. Today the only optional item is Google Maps, and there is no analytics. **If analytics is ever added, the cookie banner and policy must be updated first.**

## J. Copy & translation

- [ ] Overall tone and wording approved (EN).
- [ ] **Greek text checked by a native speaker** (all of `el.json` plus the `.el.md` articles).
- [ ] Hero headline: "Smile, you're in good hands." / "Χαμογελάστε, είστε σε καλά χέρια." OK?

## L. Kliniko connection (optional, built but off)

- [ ] Kliniko cleared for real patient data (backup tested, DPA signed): see Kliniko's `production-readiness.md`.
- [ ] Kliniko pull request merged and migration 0104 applied to Kliniko's Supabase project.
- [ ] Website key copied from Kliniko → Settings → Website requests into `booking.kliniko.websiteKey`, and `booking.provider` set to `"kliniko"`.
- [ ] Privacy policy updated to name Kliniko/Supabase as processor of booking requests.

## K. After launch

- [ ] Submit `https://<domain>/sitemap.xml` in Google Search Console.
- [ ] Add the website URL to the Google Business Profile.
- [ ] Send a test booking and confirm the notification email arrives.
