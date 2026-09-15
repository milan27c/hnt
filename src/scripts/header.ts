import type Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface HeaderOptions {
  lenis: Lenis | null;
  story: boolean;
}

/** Transparent over the hero, solid white once the hero has scrolled past the bar. */
export function initHeader({ story }: HeaderOptions): void {
  const header = document.querySelector<HTMLElement>('[data-header]');
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (!header) return;

  if (!hero) {
    header.classList.add('is-solid');
    return;
  }

  // In the stacked fallback the scenes are separate frames, so turn solid after the first one.
  const trigger = story ? hero : (hero.querySelector<HTMLElement>('[data-scene]') ?? hero);

  ScrollTrigger.create({
    trigger,
    start: () => `bottom top+=${header.offsetHeight}`,
    end: 'max',
    invalidateOnRefresh: true,
    onToggle: (self) => header.classList.toggle('is-solid', self.isActive),
  });
}

export function initMobileNav({ lenis }: HeaderOptions): void {
  const header = document.querySelector<HTMLElement>('[data-header]');
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const panel = document.querySelector<HTMLElement>('[data-mobile-nav]');
  const label = toggle?.querySelector<HTMLElement>('[data-menu-label]');
  const main = document.getElementById('main');
  if (!header || !toggle || !panel) return;

  const desktop = window.matchMedia('(min-width: 64rem)');
  let open = false;
  let hideTimer = 0;

  const setOpen = (next: boolean, { restoreFocus = true } = {}) => {
    if (next === open) return;
    open = next;
    window.clearTimeout(hideTimer);

    toggle.setAttribute('aria-expanded', String(next));
    if (label) label.textContent = next ? 'Close menu' : 'Open menu';
    header.classList.toggle('menu-open', next);
    if (main) main.inert = next;

    if (next) {
      panel.hidden = false;
      // Commit the hidden start state before transitioning in.
      void panel.offsetHeight;
      panel.classList.add('is-open');
      lenis?.stop();
      document.documentElement.style.overflow = 'hidden';
    } else {
      panel.classList.remove('is-open');
      const fade = parseFloat(getComputedStyle(panel).transitionDuration) * 1000 || 0;
      hideTimer = window.setTimeout(() => (panel.hidden = true), fade);
      lenis?.start();
      document.documentElement.style.overflow = '';
      if (restoreFocus) toggle.focus();
    }
  };

  toggle.addEventListener('click', () => setOpen(!open));

  panel.addEventListener('click', (event) => {
    if ((event.target as HTMLElement).closest('[data-menu-link]')) setOpen(false, { restoreFocus: false });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && open) setOpen(false);
  });

  desktop.addEventListener('change', (event) => {
    if (event.matches) setOpen(false, { restoreFocus: false });
  });
}
