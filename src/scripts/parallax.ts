import { gsap } from 'gsap';

interface ParallaxOptions {
  story: boolean;
}

/** Total drift as a percentage of the image height. MediaFrame oversizes the image by 12 percent to cover it. */
const DEPTH = 10;

/** Drifts the image inside every [data-parallax] frame while it crosses the viewport. Tablet and up only. */
export function initParallax({ story }: ParallaxOptions): void {
  if (!story) return;

  const frames = gsap.utils.toArray<HTMLElement>('[data-parallax]');
  if (!frames.length) return;

  gsap.matchMedia().add('(min-width: 48rem)', () => {
    frames.forEach((frame) => {
      const img = frame.querySelector<HTMLElement>('img');
      if (!img) return;

      gsap.fromTo(
        img,
        { yPercent: -DEPTH / 2 },
        {
          yPercent: DEPTH / 2,
          ease: 'none',
          scrollTrigger: {
            trigger: frame,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
            onToggle: (self) => gsap.set(img, { willChange: self.isActive ? 'transform' : 'auto' }),
          },
        },
      );
    });
  });
}
