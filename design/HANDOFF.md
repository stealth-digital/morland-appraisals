# Handoff: Morland Real Estate Appraisals website refresh (Astro)

## Overview
Light modernization of morlandappraisals.org, a residential and commercial appraisal firm in North Bay, Ontario. Same pages, same section order, same copy; new type, spacing, colour and components. Audience: homeowners, investors, banks, credit unions, lawyers, accountants. Tone: established, trustworthy, local.

## About the design files
Files in `design/` are **design references written in plain HTML + one CSS file**. They are not the production site. Recreate them in Astro using its component and layout conventions. The CSS is deliberately framework-free with every token as a custom property, so `styles.css` can be adopted almost verbatim as the global stylesheet.

## Fidelity
**High-fidelity.** Match colours, type, spacing and layout exactly. Copy text is final and must not be reworded.

## Target stack
- Astro (latest), static output, no UI framework, no Tailwind.
- One global stylesheet (`src/styles/global.css`, ported from `design/styles.css`).
- Only client JavaScript: the mobile menu toggle (inline script in the header component).
- Images: Cloudinary URLs as given (see Assets). Never download or re-host; append transforms after `/upload/`.
- Fonts: Public Sans 400/600/700 from Google Fonts, preconnect + stylesheet link in the base layout.
- Deploy target: static hosting (Netlify/Vercel/Cloudflare Pages). Include a `.nojekyll`-free, standard Astro build.

## Suggested Astro structure
```
src/
  layouts/BaseLayout.astro      head, fonts, global.css, <Header/>, <slot/>, <Footer/>
  components/Header.astro       logo, nav with two dropdowns, phone, CTA button, menu toggle + script
  components/Footer.astro       3 columns, AIC logo row, legal line
  components/PageHero.astro     props: image, alt, title, lede
  components/CtaBand.astro
  components/ContactForm.astro  props: heading, intro
  components/PhotoBand.astro    props: image, alt
  pages/index.astro
  pages/residential-appraisals.astro
  pages/commercial-appraisals.astro          (reuse residential template; images listed below)
  pages/hunting-fishing-lodge-appraisals.astro (reuse residential template)
  pages/service-area.astro                    (page hero + copy; banner image listed below)
  pages/sudbury-property-appraisals.astro     (reuse residential template)
  pages/about-us.astro
  pages/contact-us.astro
  styles/global.css
```
Nav links in the design point at `*.html`; in Astro use clean routes (`/residential-appraisals` etc.).

## Pages and sections (see the HTML for exact markup and copy)
**Home** (`index.html`): hero (photo, dark overlay, h1, lede, primary + outlined-light button) → "How we help." two-column, numbered 01–07 list → About Us on warm-stone ground with square photo and three stats → "Why Choose Us?" 4×2 grid of black tiles with gold line icons (inline SVG in the HTML) → black Institute panel with AIC logo → CTA band → footer.

**Residential Appraisals** (template for Commercial, Lodge, Sudbury): page hero → two-column copy (left) + form card (right) → full-width photo band → footer.

**About Us**: page hero → "Who we are?" copy beside team photo → "Meet Our Team!" 3-column grid on warm-stone ground (circular 140px headshots, name, title, bio, cell/office) → CTA band → footer.

**Contact Us**: page hero → left: large phone, hours, address + directions link, email; right: form card → footer.

## Components
- **Header**: sticky, black (#000), 84px tall (72px ≤1120px). Logo 48px high left. Nav right: Home, Our Services ▾, Service Area ▾, About Us, Contact Us; 15px/600, white 86%, hover/current = 2px gold inset underline. Dropdowns: white panel, 3px gold top border, 4px radius, open on hover/focus-within. Then phone (18px/600 white) and "Request an appraisal" button.
- **Mobile menu** (≤1120px): hamburger (3 bars → X), panel drops below header, black, full width; dropdown groups become uppercase muted labels with their links listed; phone and CTA stacked at bottom. Toggle adds `.nav-open` on `.site-header` and flips `aria-expanded`.
- **Buttons**: 48px min height, 4px radius, 1.5px border, 18px/600. Primary: gold #B8964E bg, black text, hover #C9A85F. Secondary: transparent, steel blue border/text; light variant white border/text on dark grounds, hover white 12%.
- **Hero**: min-height 720px (560 mobile), image object-fit cover, overlay rgba(10,12,16,.6), copy max-width 820px with 3px gold left rule and 32px left padding. h1 64px/700/1.05. Page heroes: 420px min-height, h1 40px.
- **Numbered list**: 56px + 1fr grid, "01" 15px/600 gold-deep, item 24px/600, 1px stone borders between.
- **Stats**: 2px gold top rule, number clamp(32px, 3.2vw, 56px) 700 black, label 15px uppercase muted.
- **Reason tile**: 56px black square, 4px radius, 28px SVG stroke 1.75 in gold; h3 20px below; 1px top border per item.
- **Form card**: warm-stone bg, 3px gold top border, 32px padding; 2-col grid (1-col ≤600px); inputs 12px padding, 1px stone border, focus steel blue border + tint ring; full-width Send button.
- **CTA band**: #1C3048, 96px vertical padding, h2 40px white, primary + light secondary buttons.
- **Footer**: black with 3px gold top border. Grid 5/3/3: about + logo, Contact (address, phone, email, hours), Pages. AIC logo row (220px) with caption, then legal line 14px white 55%.

## Interactions
- Dropdowns: CSS hover/focus-within, 120ms fade/translate.
- Menu toggle: click toggles `.nav-open`; close on route change.
- Buttons/links: 120ms colour transitions; 3px steel-blue focus-visible outline.
- Form: HTML5 required on name, phone, email; wire to the client's form handler (Netlify Forms or existing endpoint) — no client validation library.
- Smooth scroll for `#request` anchor on contact page.

## Responsive
Breakpoints: 1120px (mobile nav, logo 40px), 1024px (reasons + team to 2 cols, footer 2 cols, h1 40/h2 32), 900px (all two-column grids stack, section padding 64px, photo band 320px, CTA stacks), 600px (single-column grids, stacked full-width buttons, h1 44px).

## Design tokens
See `design/tokens.md` and `:root` in `design/styles.css`. Summary:
- Colour: primary #2E4A6B, primary-dark #1C3048, primary-tint #E6EBF1, accent #B8964E, accent-deep #8C7035, ink #111417, ink-muted #5C5F63, neutral #F6F4EF, border #DCD8CF, white #FFFFFF, black #000000.
- Type: Public Sans 400/600/700; 15/18/20/24/32/40/64px; line-heights 1.05 / 1.3 / 1.6; headings letter-spacing -0.02em.
- Space: 4, 8, 12, 16, 24, 32, 48, 64, 96. Section padding 96 (64 mobile).
- Radius 4px. Container 1120px, gutter 24px. No shadows anywhere.

## Assets (Cloudinary, use exactly; transforms go after /upload/)
Base: https://res.cloudinary.com/dj76bnpni/image/upload/
- Logo: c_crop,w_378,h_72,x_4,y_4/f_auto,q_auto,w_756/v1788982277/morland-appraisals-logo-dark_phj6wc.jpg (crop trims a light JPEG edge)
- Favicon: v1788982278/morland-appraisals-icon_nnzy1j.png
- AIC logo (white wordmark, always on black): v1788982278/appraisal-institute-of-canada-logo_phh8tr.png
- Home hero: v1788982278/lakefront-cottage-deck-alt_llkcny.jpg
- Downtown North Bay: v1788982280/downtown-north-bay-main-street_pw20b3.png
- Residential hero: v1788982280/residential-property-appraisal-north-bay_r1jgej.jpg; band: v1788982282/waterfront-home-lake-view_cy7kdl.jpg
- Commercial hero: v1788982280/commercial-property-appraisal-north-bay_u0mexx.jpg; band: v1788982280/commercial-property-appraisal-banner_oohxex.png
- Lodge hero: v1788982279/hunting-fishing-lodge-appraisal-northern-ontario-banner_redsft.jpg; band: v1788982278/hunting-fishing-lodge-appraisal-northern-ontario-aerial_rjhjom.jpg
- Service area banner (blue overlay baked in): v1788982281/service-area-map-banner_rncejg.png; Sudbury: v1788982282/sudbury-property-appraisals-downtown_gv1jju.jpg
- About hero: v1788982283/modern-office-building_bl1clt.png; team: v1788982284/business-team-group_b49nuo.png
- Contact hero: v1788982278/lakefront-dock-patio-banner_clq6tq.png
- Headshots (use w_240,h_240,c_fill,g_face): brad-minogue-morland-appraisals_tivqsa.jpg (v1788982286), gord-morland-morland-appraisals_j5prye.jpg (v1788982286), tom-stone-morland-appraisals_gnf8tl.jpg (v1788982284), steve-johnson-morland-appraisals_artqum.jpg (v1788982284), joey-boulet-morland-appraisals_c8znyp.jpg (v1788982284)
- Why Choose Us icons: inline SVG in `design/index.html` (move to `src/components/icons/` or an Astro icon component).

Content to confirm with client before launch: footer email address (info@morlandappraisals.org assumed), Joey Boulet bio (none on current site).

## Files
- `design/styles.css` — complete stylesheet, all tokens in :root
- `design/index.html`, `residential-appraisals.html`, `about-us.html`, `contact-us.html`
- `design/tokens.md` — token list
- `CLAUDE_CODE_PROMPT.md` — paste-ready instructions
