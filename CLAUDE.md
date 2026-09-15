@AGENTS.md

# HNT Facility Services — Home Page

Project instructions for the HNT Facility Services (HNTFS) marketing site. Read this before writing any markup, style or motion code. If a request conflicts with something here, ask before deviating.

---

## 1. The client

HNT Facility Services is a South Australian owned, family operated business delivering cleaning and facility maintenance solutions across South Australia and Western Australia. Over 10 years of industry experience. The positioning is consistent quality, safety and client focused service, building long term partnerships through dependable delivery and attention to detail.

Brand line: **Trusted. Professional. Reliable.**

The audience is facility managers, site managers, procurement leads and business owners who buy recurring commercial services. They are risk averse. Everything on the page must read as competent, compliant and dependable. Nothing playful, nothing gimmicky.

**Scope for now: the home page only.** Do not build other routes. Nav links to pages that do not exist yet point to `#` or to on page anchors, never to dead routes.

---

## 2. Stack

- **Astro 7** + TypeScript (strict), existing scaffold in this repo
- **Tailwind CSS v4** with the CSS first `@theme` token block in `src/styles/global.css`. No `tailwind.config.js`
- **GSAP + ScrollTrigger** for scroll, parallax and timeline work
- **Lenis** for smooth scrolling, driving ScrollTrigger via its scroll callback
- Zero UI framework components. Astro components and vanilla TS only. No React, Vue or Svelte unless a specific need is agreed first
- Static output, no SSR adapter

### Rules

- Every visual value comes from a token. No raw hex, px font sizes or ad hoc durations in component files
- Ship one `main.ts` motion entry that registers plugins once and initialises per section modules. Never re register ScrollTrigger per component
- Astro islands only where behaviour is needed. Prefer `client:visible` over `client:load`
- Lighthouse targets: Performance 90+, Accessibility 100, no CLS from the loader or scroll effects

### Commands

```
astro dev --background     # start; manage with astro dev stop|status|logs
astro build                # production build
astro preview              # preview the build
```

---

## 3. Design tokens

Defined once in `src/styles/global.css` under `@theme`. These scales are the whole palette. Do not introduce new colours.

### Primary — HNT Cyan

Brand primary is `#05CDD5` at the 500 step.

```
--color-primary-50:  #F2FCFD
--color-primary-100: #E1F9FA
--color-primary-200: #BEF2F4
--color-primary-300: #91E9ED
--color-primary-400: #50DCE2
--color-primary-500: #05CDD5   /* brand primary */
--color-primary-600: #04B0B7
--color-primary-700: #049095
--color-primary-800: #036F73
--color-primary-900: #024E51
--color-primary-950: #013133
```

Contrast note: primary 500 and 600 fail text contrast on light backgrounds. Use them for fills, strokes, glows and large display type only. For cyan **text** on `#F3F2F2` use 800 (5.33:1) or 900 (8.5:1). On dark navy, primary 400 and 500 are both safe (10.7:1 and 9.1:1). Buttons filled with primary 500 take navy 900 text, never white.

### Secondary — HNT Navy

Brand secondary `#02163B` sits at the 900 step because it is already near black.

```
--color-navy-50:  #F5F6F7
--color-navy-100: #E8EAED
--color-navy-200: #D1D5DC
--color-navy-300: #AEB4C0
--color-navy-400: #868FA1
--color-navy-500: #5D6A82
--color-navy-600: #3A4966
--color-navy-700: #203253
--color-navy-800: #0F2245
--color-navy-900: #02163B   /* brand secondary */
--color-navy-950: #010E26
```

### Gray — text and UI

A navy tinted neutral so grays sit in the same family as the brand. All body copy uses this ramp.

```
--color-gray-50:  #F7F8F9
--color-gray-100: #EDEFF2
--color-gray-200: #DDE1E7   /* hairlines, dividers, card borders */
--color-gray-300: #C2C8D1   /* disabled, decorative rules */
--color-gray-400: #99A1AE   /* placeholder only, never body copy */
--color-gray-500: #6E7684   /* muted labels, captions, 4.1:1 */
--color-gray-600: #545B68   /* secondary body copy, 6.1:1 */
--color-gray-700: #3F4550   /* body copy default, 8.6:1 */
--color-gray-800: #2B303A
--color-gray-900: #1A1E26
--color-gray-950: #0E1116
```

### Surfaces

```
--color-bg:          #F3F2F2   /* page background, light sections */
--color-surface:     #FFFFFF   /* cards, panels, inputs */
--color-surface-alt: #F7F8F9   /* nested surfaces inside a white card */
--color-bg-dark:     #02163B   /* dark section ground */
--color-surface-dark:#0F2245   /* cards on dark */
```

### Text roles

```
--text-primary:     var(--color-gray-800)   /* headings on light */
--text-body:        var(--color-gray-700)   /* paragraphs */
--text-muted:       var(--color-gray-500)   /* captions, meta */
--text-on-dark:     #FFFFFF
--text-on-dark-mut: var(--color-navy-300)
--text-accent:      var(--color-primary-800)  /* cyan text on light */
```

Headings on light backgrounds use navy 900 when they need weight and gray 800 when they sit inside dense copy. Never pure black.

### Gradients

The brand gradient runs primary into a darker shade of itself. Three approved gradients, nothing else:

```
--grad-brand:  linear-gradient(135deg, #50DCE2 0%, #05CDD5 45%, #049095 100%);
--grad-deep:   linear-gradient(160deg, #02163B 0%, #0F2245 55%, #036F73 100%);
--grad-text:   linear-gradient(100deg, #05CDD5 0%, #91E9ED 50%, #04B0B7 100%);
```

- `--grad-brand` for primary buttons, icon tiles, accent bars and section dividers
- `--grad-deep` for dark section grounds, always paired with a soft radial cyan glow (`radial-gradient` of `#05CDD5` at 12 to 18 percent opacity, heavy blur) behind the content
- `--grad-text` for the neon vibe text treatment. Clipped to text, **dark sections only**, one instance per section at most, and never on a full paragraph. Always set a solid fallback colour first

### Radius

The brand reads modern and rounded but not soft.

```
--radius-sm:   8px    /* inputs, chips inside cards */
--radius-md:   14px   /* small cards, icon tiles */
--radius-lg:   20px   /* standard cards */
--radius-xl:   28px   /* feature cards, media frames */
--radius-2xl:  40px   /* section wells, hero media */
--radius-pill: 999px  /* buttons, tags, badges */
```

All buttons, tags, chips and badges are fully pill shaped.

### Shadows

Very subtle, navy tinted, used sparingly. Elevation comes from surface contrast first, shadow second.

```
--shadow-xs:    0 1px 2px rgba(2,22,59,0.04);
--shadow-sm:    0 2px 8px rgba(2,22,59,0.05);
--shadow-md:    0 8px 24px rgba(2,22,59,0.06);
--shadow-lg:    0 20px 48px rgba(2,22,59,0.08);
--shadow-glow:  0 12px 36px rgba(5,205,213,0.22);  /* hover on cyan elements only */
```

### Spacing and layout

4px base scale. Section rhythm:

```
--section-y:    clamp(88px, 10vw, 168px);   /* vertical padding per section */
--container:    1280px;
--container-nr: 1120px;   /* narrow, for text heavy blocks */
--gutter:       clamp(20px, 5vw, 48px);
```

Breakpoints: 480 / 768 / 1024 / 1280 / 1536. Mobile first, every section verified at 375px width.

---

## 4. Typography

**Font: SF Pro via a system stack.** Do not self host and do not load a webfont.

```css
--font-sans: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text",
             "Inter", "Segoe UI", system-ui, sans-serif;
```

Inter is the non Apple fallback and is close enough in metrics that no layout shift compensation is needed. Set `font-feature-settings: "ss01", "cv11"` and `-webkit-font-smoothing: antialiased` on `body`.

### Scale

Fluid, tight tracking on large sizes, generous leading on body. Modern means large display sizes, restrained weights.

| Token | Size | Line height | Tracking | Weight |
|---|---|---|---|---|
| `display` | `clamp(3rem, 6.5vw, 5.25rem)` | 0.98 | -0.035em | 600 |
| `h1` | `clamp(2.5rem, 5vw, 4rem)` | 1.04 | -0.03em | 600 |
| `h2` | `clamp(2rem, 3.6vw, 3.25rem)` | 1.08 | -0.025em | 600 |
| `h3` | `clamp(1.5rem, 2.2vw, 2rem)` | 1.18 | -0.02em | 600 |
| `h4` | `1.25rem` | 1.3 | -0.015em | 600 |
| `body-lg` | `clamp(1.0625rem, 1.2vw, 1.1875rem)` | 1.62 | -0.005em | 400 |
| `body` | `1rem` | 1.68 | 0 | 400 |
| `body-sm` | `0.9375rem` | 1.6 | 0 | 400 |
| `caption` | `0.8125rem` | 1.45 | 0.005em | 500 |
| `stat` | `clamp(2.75rem, 4.5vw, 4rem)` | 1 | -0.04em | 700 |
| `button` | `0.9375rem` | 1 | -0.005em | 500 |

### Weight discipline

Only 400, 500, 600 and 700. 400 body, 500 UI and labels, 600 all headings, 700 reserved for stat numbers. Never 300, never 800 or 900. Never use italic for emphasis; use weight or colour.

### Rules

- Paragraph measure capped at 68 characters (`max-width: 62ch`)
- **Eyebrows only on section intros.** A section's main heading may carry one eyebrow via `SectionHeading`: a sentence case pill (caption size, weight 500, primary 800 text on primary 50, primary 200 border, small gradient dot). Never small uppercase, never more than one per section, never above headings inside cards
- Numerals in stats and pricing use `font-variant-numeric: tabular-nums`
- One `--grad-text` treatment per dark section maximum, applied to a few words inside a heading, not a whole heading block

---

## 5. Motion system

The site must feel smooth and expensive. Every motion value comes from a token.

```
--dur-fast:   160ms   /* micro states: colour, opacity */
--dur-base:   280ms   /* hover transforms, small reveals */
--dur-slow:   520ms   /* card and panel reveals */
--dur-xslow:  900ms   /* hero and section entrances */

--ease-out:   cubic-bezier(0.16, 1, 0.3, 1);      /* default, expo out */
--ease-inout: cubic-bezier(0.65, 0, 0.35, 1);
--ease-soft:  cubic-bezier(0.33, 1, 0.68, 1);
```

### Loading animation

A brief branded preloader on first visit only (session flagged, never repeats within a session). Navy 900 ground, centred HNT mark, a thin cyan progress rule that fills with `--grad-brand`, then the overlay clips upward with a `clip-path` wipe while the hero content is already staggering in underneath. Full sequence under 1.4s. Never block paint for longer, and never gate the hero behind it if assets are slow.

### Scroll

- Lenis: `lerp: 0.085`, `wheelMultiplier: 1`, `smoothWheel: true`, touch untouched (native scrolling on mobile)
- ScrollTrigger driven from Lenis' scroll event, `ScrollTrigger.update` in the Lenis callback, `lenis.raf` in `gsap.ticker`
- Default reveal: `y: 32px, opacity: 0` to `y: 0, opacity: 1`, `--dur-xslow`, `--ease-out`, `start: "top 82%"`, `once: true`
- Stagger grouped children at 0.07s to 0.09s
- Headings may split by line (not by character) for a masked line rise. Use masked overflow, never per letter confetti

### Parallax

Approved on: hero background layers, the videography frame, the industries strip and the awards band. Nothing else. Depth range capped at 12 percent of the element height so it never reads as jitter. All parallax `yPercent` driven with `scrub: 1`. Disable parallax below 768px.

### Hover

- Cards: `translateY(-6px)`, shadow `--shadow-sm` to `--shadow-md`, border `gray-200` to `primary-200`, `--dur-base`, `--ease-out`
- Primary buttons: gradient position shifts, `--shadow-glow` fades in, arrow icon slides 4px
- Links: cyan underline that wipes in from left, `transform: scaleX()` on a pseudo element
- Images inside a frame: `scale(1.04)` with `overflow: hidden` on the frame
- Every interactive element has a visible `:focus-visible` ring: 2px primary 700, 2px offset

### Non negotiables

- Animate `transform` and `opacity` only. Never animate layout properties
- `will-change` applied only during an active tween and removed after
- Full `prefers-reduced-motion: reduce` path: all reveals become instant, parallax off, Lenis off, loader skipped. Content must be complete and readable with zero JavaScript
- No element is invisible without JavaScript. Set reveal start states from the motion script, not in base CSS

---

## 6. Home page structure

Order is fixed. Sections may be added between these, not reordered.

The page is light overall on `#F3F2F2` with two dark navy sections for rhythm and emphasis: **How We Work** and **Book a Quote**, plus the footer. Do not add further dark sections without agreeing it first.

1. **Header** — Sticky, transparent over the hero, condenses to a frosted white bar with a hairline border after 80px of scroll. Logo left, links centre, pill "Book a Quote" button right. Mobile: full screen overlay menu with staggered link entrance.

2. **Hero** — Full viewport on the light `#F3F2F2` ground. Display heading built on the positioning, a support line naming the two states served, two CTAs (primary "Book a Quote", ghost "Our Services"), and a trust row (10+ years, South Australian owned, family operated). Layered parallax background plus a soft cyan radial glow. Media is a placeholder frame.

3. **About Us** — Centred eyebrow, heading and lead. Below, a 12 column grid from 1280px: a cleaning image frame on 5 columns, and 7 columns split into two equal vertical white cards (left: the family operated story and SA and WA footprint, right: stats with a counter animation when they scroll into view). Tablet: image full width over the two cards. Mobile: stacked.

4. **Our Services** — Centred eyebrow, heading and lead. Card grid, 3 up on desktop, 2 up at tablet, 1 up on mobile. Each card: inset 4:3 image at the top, title, one line description, a "View details" ghost button. Staggered reveal, lift on hover. Service names must come from the client, not invented; use clearly marked placeholders until supplied.

5. **How We Work / Videography** — The process section. A large 16:9 video frame with a poster placeholder and a cyan play affordance, paired with a numbered stepper. A gradient progress rule fills between steps as the section scrolls. Parallax on the video frame. Dark section, `--grad-deep`.

6. **Businesses We Frequently Serve** — The industries covered. Either a horizontal marquee of industry cards with parallax drift, or a bento grid. Pauses on hover if it is a marquee.

7. **Testimonials** — White cards on the `#F3F2F2` ground. Quote, name, role, company, and a placeholder avatar. Carousel on mobile, 2 or 3 up on desktop. Testimonials are real client words only. Use obviously marked placeholder copy until the client supplies them and never invent a named customer.

8. **Awards** — A restrained band of award and accreditation marks with a subtle parallax drift. Grayscale at rest, full colour on hover. Placeholder marks until the real ones arrive, and never invent an award name or year.

9. **FAQ** — Accordion, single column, narrow container. Height animated open and close with `--ease-inout`, icon rotates, one item may be open by default.

10. **Book a Quote** — The conversion section. Dark `--grad-deep` ground with a cyan glow. Heading, short reassurance line, and a form: name, business, email, phone, service type, site location (SA or WA), message. Pill inputs, gradient submit button, inline validation, clear success and error states. Also show phone and email as a direct alternative.

11. **Footer** — Navy 900. Logo and one line descriptor, link columns, service areas, contact details, ABN placeholder, socials, copyright. Hairline divider at navy 700.

---

## 7. Content rules

- Australian English throughout the copy (organise, specialise, licence as a noun). Code identifiers stay US English
- Copy is minimal, concrete and SEO aware. Front load the service and the location. Target terms include commercial cleaning South Australia, facility maintenance Adelaide, commercial cleaning Western Australia
- **No dash characters in copy.** No em dash, en dash or hyphen used as punctuation. Rewrite the sentence instead
- Eyebrows only as described in section 4: one sentence case pill per section intro
- No exclamation marks, no hype adjectives, no stock phrases like "we go the extra mile"
- Do not invent facts. Client names, awards, certifications, staff counts, site counts and testimonials are placeholders clearly marked as such until the client supplies them. The only hard facts available are the ones in section 1 of this file
- Every image needs meaningful `alt` text. Decorative images get `alt=""`

---

## 8. Assets

All imagery and video are **placeholders** for now and get swapped later.

- Images: use a local placeholder component that renders a navy to cyan gradient block at the correct aspect ratio with a small label naming the intended shot, or a neutral stock image at the right ratio. Never spend time sourcing matching photography
- Video: poster image placeholder plus play affordance. No real video file yet, no autoplaying background video
- Every placeholder gets the exact final aspect ratio and explicit `width`/`height` so swapping in real assets causes no layout shift
- Keep all placeholders under `src/assets/placeholders/` and list them in `docs/assets-needed.md` with the shot brief and the ratio, so the client can be given one clear list

---

## 9. File structure

```
src/
  assets/
    placeholders/
  components/
    layout/        Header.astro, Footer.astro, MobileNav.astro
    sections/      Hero, About, Services, Process, Industries,
                   Testimonials, Awards, Faq, Quote  (.astro)
    ui/            Button, Card, SectionHeading, Accordion,
                   StatCounter, MediaFrame, Reveal  (.astro)
  data/            site.ts, services.ts, industries.ts, process.ts,
                   testimonials.ts, awards.ts, faqs.ts
  layouts/         Layout.astro
  pages/           index.astro
  scripts/         main.ts, lenis.ts, reveal.ts, parallax.ts,
                   loader.ts, counters.ts, accordion.ts, form.ts
  styles/          global.css   (@theme tokens live here)
docs/
  assets-needed.md
```

All section content lives in `src/data/*.ts` as typed arrays, never hardcoded in markup, so copy can be swapped without touching layout.

---

## 10. Accessibility

- WCAG 2.1 AA. Verify contrast against the notes in section 3 before shipping any cyan text
- Semantic landmarks: one `h1`, ordered heading levels, `<nav>`, `<main>`, `<footer>`
- Full keyboard path through the header, accordion, carousel and form. Visible focus everywhere
- Accordion uses `aria-expanded` and `aria-controls`; carousel exposes real buttons with labels
- Form inputs have real `<label>` elements, errors linked with `aria-describedby` and announced via `aria-live`
- Touch targets 44px minimum
- Test the whole page with motion reduced and with JavaScript disabled

---

## 11. Build order

Do not jump ahead. Confirm each stage before starting the next.

1. Tokens, global CSS, base layout, font stack, reset
2. UI primitives: Button, Card, SectionHeading, MediaFrame, Reveal
3. Motion foundation: Lenis, ScrollTrigger wiring, reveal utility, reduced motion path
4. Header and mobile nav
5. Hero
6. Remaining sections in page order
7. Loader
8. Parallax pass, hover polish, form states
9. Responsive audit at 375 / 768 / 1024 / 1440, accessibility audit, Lighthouse
