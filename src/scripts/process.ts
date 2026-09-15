import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface ProcessOptions {
  story: boolean;
}

/**
 * Fills the How We Work rail as the stepper scrolls through the viewport and lights each
 * number as the fill reaches it. Without the script every step shows as complete.
 */
export function initProcess({ story }: ProcessOptions): void {
  const steps = document.querySelector<HTMLElement>('[data-steps]');
  if (!steps) return;

  const rail = steps.querySelector<HTMLElement>('.steps__rail');
  const fill = steps.querySelector<HTMLElement>('[data-steps-fill]');
  const items = gsap.utils.toArray<HTMLElement>(steps.querySelectorAll('[data-step]'));
  const last = items[items.length - 1];
  if (!rail || !fill || !last) return;

  // Vertical rail stops at the centre of the last number rather than the end of its text.
  const trimRail = () => {
    const num = last.firstElementChild as HTMLElement | null;
    const end = steps.offsetHeight - last.offsetTop - (num?.offsetHeight ?? 0) / 2;
    steps.style.setProperty('--rail-end', `${Math.max(end, 0)}px`);
  };
  trimRail();
  ScrollTrigger.addEventListener('refreshInit', trimRail);

  if (!story) return;

  steps.classList.add('is-tracking');

  gsap.matchMedia().add({ vertical: '(max-width: 63.99rem)', horizontal: '(min-width: 64rem)' }, (context) => {
    const axis = context.conditions?.vertical ? 'scaleY' : 'scaleX';
    const lastIndex = items.length - 1;

    const light = (progress: number) => {
      items.forEach((item, i) => item.classList.toggle('is-active', progress >= i / lastIndex - 0.02));
    };

    gsap.set(fill, { [axis]: 0 });
    light(0);

    const tween = gsap.to(fill, {
      [axis]: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: steps,
        start: 'top 78%',
        end: 'bottom 60%',
        scrub: 1,
      },
      onUpdate: () => light(tween.progress()),
    });

    return () => items.forEach((item) => item.classList.remove('is-active'));
  });
}
