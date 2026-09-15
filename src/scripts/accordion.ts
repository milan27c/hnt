import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Toggles [data-accordion] items. The open and close height animation lives in CSS;
 * this only flips state, then refreshes ScrollTrigger once the page height has settled.
 */
export function initAccordions(): void {
  document.querySelectorAll<HTMLElement>('[data-accordion]').forEach((root) => {
    root.querySelectorAll<HTMLElement>('[data-accordion-item]').forEach((item) => {
      const trigger = item.querySelector<HTMLButtonElement>('[data-accordion-trigger]');
      const panel = item.querySelector<HTMLElement>('[data-accordion-panel]');
      if (!trigger || !panel) return;

      trigger.addEventListener('click', () => {
        const open = trigger.getAttribute('aria-expanded') !== 'true';
        trigger.setAttribute('aria-expanded', String(open));
        item.classList.toggle('is-open', open);
      });

      panel.addEventListener('transitionend', (event) => {
        if (event.target === panel && event.propertyName === 'grid-template-rows') ScrollTrigger.refresh();
      });
    });
  });
}
