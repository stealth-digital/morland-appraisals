# Morland Real Estate Appraisals

Website for Morland Real Estate Appraisals Ltd, North Bay, Ontario. Live at https://morlandappraisals.org.

Static Astro site with one Vercel Function for the contact form. Hosted on Vercel (team `stealth-digital`, project `morland-appraisals`). Pushes to `main` deploy to production.

## Develop

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # outputs dist/
```

The contact form posts to a Vercel Function, which `astro dev` does not run. Test the form on a Vercel preview deployment.

## Layout

- `src/pages/` one file per route. Service pages share `src/layouts/ServicePage.astro`.
- `src/components/` header, footer, hero, form, photo band, icons.
- `src/styles/global.css` the only stylesheet. Tokens are custom properties in `:root`.
- `api/contact.ts` contact form handler.
- `vercel.json` redirects from the old WordPress URLs and security headers.
- `design/` the original design handoff, for reference only.

Images are served from Cloudinary (`res.cloudinary.com/dj76bnpni`). Add new images there, not to the repo, and put transforms after `/upload/`.

## Contact form

`api/contact.ts` checks the request came from the site, drops honeypot submissions, validates the fields, and emails the office through Resend.

Production environment variables, set in the Vercel project:

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Sending-only key for `morlandappraisals.org`, from the Resend account created directly on resend.com |
| `CONTACT_TO` | Recipient, `info@morlandappraisals.org`. Comma-separate for more than one. |
| `CONTACT_FROM` | Sender on the verified domain |

Successful posts land on `/thank-you`. Failures return to the originating page at `#form-error`.

## Firewall

Custom rules on the Vercel project, manage with `vercel firewall`:

- **Rate limit contact form**: 10 POSTs to `/api/contact` per IP per 10 minutes.
- **Block WordPress probes**: denies `/wp-admin*`, `/wp-login.php`, `/xmlrpc.php`.

## Domain and tracking

- `morlandappraisals.org` is primary. `www` 308-redirects to it. DNS is on Vercel and also holds Google Workspace mail and Resend records.
- Google Tag Manager container `GTM-WZVDN8LM` loads on every page from `src/layouts/BaseLayout.astro`. For speed it waits for the first scroll, tap or key press, or 3.5 seconds after load. `/thank-you` loads it immediately so form conversions record.
- Fonts are self-hosted from `@fontsource/public-sans`. Hero images are preloaded through `src/lib/cloudinary.ts`, which the hero and photo band components also use, so preload and image URLs always match.
- Google Search Console: domain property `morlandappraisals.org`, verified by a `google-site-verification` TXT record on the apex. Removing that record drops verification. The sitemap `https://morlandappraisals.org/sitemap-index.xml` is submitted there.

## Open items

- Golf course hero is a 1024px image. Replace with a larger original when available.
- Warren page hero uses the service-area banner as a stand-in.
- Structured data in `src/lib/schema.ts` is waiting on the Google Business Profile URL.
