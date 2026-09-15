import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { dur } from './tokens';

interface CounterOptions {
  story: boolean;
}

/** Counts [data-counter] numbers up from zero when they scroll into view. Markup holds the final value. */
export function initCounters({ story }: CounterOptions): void {
  if (!story) return;

  gsap.utils.toArray<HTMLElement>('[data-counter]').forEach((el) => {
    const to = Number(el.dataset.to);
    if (!Number.isFinite(to)) return;

    const state = { value: 0 };
    el.textContent = '0';

    ScrollTrigger.create({
      trigger: el,
      start: 'top 82%',
      once: true,
      onEnter: () =>
        gsap.to(state, {
          value: to,
          duration: dur('xslow') * 1.6,
          delay: dur('stagger') * 2,
          ease: 'hnt-out',
          onUpdate: () => {
            el.textContent = String(Math.round(state.value));
          },
        }),
    });
  });
}
