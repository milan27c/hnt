import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { dur } from './tokens';

interface RevealOptions {
  story: boolean;
}

/**
 * Default reveal for every [data-reveal] element. Start states are set here, never in CSS,
 * so content stays visible without JavaScript or with reduced motion.
 * Put data-reveal on a wrapper, not on an element that has its own CSS transform transition.
 */
export function initReveal({ story }: RevealOptions): void {
  if (!story) return;

  const items = gsap.utils.toArray<HTMLElement>('[data-reveal]');
  if (!items.length) return;

  gsap.set(items, { y: 32, opacity: 0 });

  ScrollTrigger.batch(items, {
    start: 'top 82%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        y: 0,
        opacity: 1,
        duration: dur('xslow'),
        ease: 'hnt-out',
        stagger: dur('stagger'),
        overwrite: true,
        onStart: () => gsap.set(batch, { willChange: 'transform, opacity' }),
        clearProps: 'transform,opacity,willChange',
      }),
  });
}
