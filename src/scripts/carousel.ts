interface CarouselOptions {
  story: boolean;
}

/**
 * Previous and next buttons for [data-carousel] scroll snap tracks. Swiping works natively;
 * the buttons only appear with JavaScript and are hidden by CSS where every slide is visible.
 */
export function initCarousels({ story }: CarouselOptions): void {
  document.querySelectorAll<HTMLElement>('[data-carousel]').forEach((root) => {
    const track = root.querySelector<HTMLElement>('[data-carousel-track]');
    const slides = Array.from(root.querySelectorAll<HTMLElement>('[data-carousel-slide]'));
    const prev = root.querySelector<HTMLButtonElement>('[data-carousel-prev]');
    const next = root.querySelector<HTMLButtonElement>('[data-carousel-next]');
    const status = root.querySelector<HTMLElement>('[data-carousel-status]');
    if (!track || !slides.length || !prev || !next) return;

    const step = () => (slides[1] ? slides[1].offsetLeft - slides[0].offsetLeft : track.clientWidth);
    const maxScroll = () => track.scrollWidth - track.clientWidth;
    const current = () => Math.round(track.scrollLeft / Math.max(step(), 1));

    const sync = () => {
      prev.setAttribute('aria-disabled', String(track.scrollLeft <= 2));
      next.setAttribute('aria-disabled', String(track.scrollLeft >= maxScroll() - 2));
    };

    const go = (direction: -1 | 1) => {
      const target = Math.min(Math.max(current() + direction, 0), slides.length - 1);
      track.scrollTo({ left: Math.min(target * step(), maxScroll()), behavior: story ? 'smooth' : 'auto' });
      if (status) status.textContent = `Testimonial ${target + 1} of ${slides.length}`;
    };

    prev.addEventListener('click', () => prev.getAttribute('aria-disabled') !== 'true' && go(-1));
    next.addEventListener('click', () => next.getAttribute('aria-disabled') !== 'true' && go(1));

    let frame = 0;
    const scheduleSync = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(sync);
    };
    track.addEventListener('scroll', scheduleSync, { passive: true });
    window.addEventListener('resize', scheduleSync);
    sync();
  });
}
