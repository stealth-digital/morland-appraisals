# Prompt for Claude Code

Paste this in Claude Code from an empty folder (or the folder where this handoff zip is unzipped).

---

I'm building the new Morland Real Estate Appraisals website in Astro from the design handoff in `design_handoff_morland_astro/`. Read `README.md` first, then the HTML and CSS in `design/`. Those are high-fidelity design references; recreate them in Astro, do not serve the HTML files directly.

Do the following, in order, and stop to show me after step 4:

1. Initialize a git repo and a new Astro project (`npm create astro@latest` minimal template, TypeScript strict, no integrations). Static output. No Tailwind, no UI framework.
2. Port `design/styles.css` to `src/styles/global.css` unchanged except for removing anything Astro scopes for you. Keep every custom property.
3. Build the layout and components listed in the README's "Suggested Astro structure" (BaseLayout, Header with mobile toggle script, Footer, PageHero, CtaBand, ContactForm, PhotoBand). Copy text verbatim from the design HTML. Use clean routes, not .html links. Add `aria-current="page"` on the active nav link.
4. Build the four designed pages: /, /residential-appraisals, /about-us, /contact-us. Check them against the design HTML at 1280px and 390px.
5. Build the remaining pages from the residential template using the images in the README: /commercial-appraisals, /hunting-fishing-lodge-appraisals, /sudbury-property-appraisals, and /service-area (page hero using the service-area banner, then the two-column copy + form). Use placeholder copy marked TODO where the handoff has none; I'll paste the copy from the current site.
6. Add per-page <title> and meta description, a sitemap (@astrojs/sitemap), robots.txt, favicon from the Cloudinary icon, and LocalBusiness JSON-LD on the home page (name Morland Real Estate Appraisals Ltd, 382 Fraser Street, North Bay, ON P1B 3W7, +1 705-474-3500, Mon–Fri 9:00–17:00).
7. Point the contact form at Netlify Forms (data-netlify="true", honeypot field) so it works on deploy without a backend.
8. Run `npm run build`, fix any errors, commit with a clear message, then create a public GitHub repo named `morland-appraisals` under my account with `gh repo create morland-appraisals --public --source=. --push`. Report the repo URL.

Constraints: only client JavaScript is the menu toggle. No shadows, no gradients, no pill buttons, 4px radius everywhere. Never re-host or substitute images; use the Cloudinary URLs exactly with transforms after /upload/.
