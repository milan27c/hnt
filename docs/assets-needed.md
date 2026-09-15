# Assets needed

Every image on the home page that still needs a final photo from the client. Each placeholder already sits at its final aspect ratio, so swapping in the real file causes no layout shift.

| Section | File | Ratio | Shot brief |
|---|---|---|---|
| Testimonials | `src/assets/images/testimonials/sample-1.jpg` to `sample-3.jpg` (Pexels stock portraits, not HNT clients, must not go live) | 1:1, 192 × 192 minimum | Head and shoulders photo of each client who supplies a testimonial, with their permission |
| How We Work | `src/assets/images/hero/2.png` (temporary reuse of the hero crew shot, used as the video poster) | 16:9, 1920 × 1080 minimum. Crops taller on mobile, so keep the subject near the centre | Poster frame taken from the final video: HNT crew at work on site in uniform |
| How We Work | Video, not supplied yet | 16:9, 1920 × 1080, MP4 (H.264), under 30 MB | Short showcase of how the team works on site. Place it at `public/videos/how-we-work.mp4` and set `processVideo.src` in `src/data/process.ts` to enable the play button |

## Copy to confirm

- **Our Services:** the third service ("Specialised Cleaning") is a placeholder name and description. Confirm the full list of services and their one line descriptions.
- **Businesses We Frequently Serve:** the six industries are placeholders. Confirm the industries HNT regularly services.
- **Testimonials:** all three quotes, names, roles and sites are invented and the photos are Pexels stock models, sample content for the prototype only (marked `sample: true` in `src/data/testimonials.ts`, and `astro build` warns while any remain). They must not go live. Supply real client testimonials with permission to publish.
- **How We Work:** the four process steps (site walkthrough, tailored scope, consistent delivery, ongoing review) are placeholders. Confirm the steps and wording.
- **About Us stats:** only confirmed facts are shown (10+ years, two states). Supply any further figures, such as sites serviced or team size, to add more stats.
- **Awards:** the award name and results (Australian Trades Small Business Champion Awards, Finalist 2024 and 2025) are taken from the supplied emblems in `src/assets/images/awards/`. Confirm the short description of the awards program in `src/data/awards.ts`, and supply any further awards or accreditations.
- **FAQ:** two answers are placeholders (outside business hours, staff training and insurance). Confirm the details, and any extra questions to add, in `src/data/faqs.ts`.
- **Contact details:** email and office address are dummy values in `src/data/site.ts`. Supply the real details. Phone (08 7083 0790) is confirmed.
- **Footer:** the LinkedIn, Facebook and Instagram links are placeholders in `src/data/site.ts`.
- **Quote form:** there is no backend yet, so the form simulates a successful send. Set `quoteForm.endpoint` in `src/data/quote.ts` to a form service or serverless function URL to receive real enquiries. Confirm the options in the Reason dropdown.
