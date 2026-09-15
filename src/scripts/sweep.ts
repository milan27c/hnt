import { gsap } from 'gsap';
import type Lenis from 'lenis';
import { dur } from './tokens';

interface SweepOptions {
  hero: HTMLElement;
  stage: HTMLElement;
  lenis: Lenis | null;
  tl: gsap.core.Timeline;
  /** Timeline times where each scene's copy is fully in and at rest. */
  rests: readonly number[];
  /** Timeline length in story units. */
  end: number;
}

/** Story units covered by dragging across the full width of the frame, roughly one scene. */
const UNITS_PER_WIDTH = 3.1;
/** Pixels of movement before a press is read as a swipe, and which axis it follows. */
const AXIS_LOCK = 8;
/** Share of the frame width, or flick speed in px per ms, that moves on to the next scene. */
const COMMIT_DISTANCE = 0.12;
const COMMIT_VELOCITY = 0.35;

interface Drag {
  id: number;
  type: string;
  x: number;
  y: number;
  scroll: number;
  time: number;
  axis: 'x' | 'y' | null;
  lastX: number;
  lastT: number;
  velocity: number;
}

/**
 * Horizontal swipes, drags and trackpad gestures scrub the hero story the same way scrolling
 * does, then settle on the next scene like a slider. A broom follows the pointer across the frame.
 * Returns a cleanup for gsap.matchMedia.
 */
export function initSweep({ hero, stage, lenis, tl, rests, end }: SweepOptions): () => void {
  const st = () => tl.scrollTrigger!;
  const pxPerUnit = () => (st().end - st().start) / end;
  const scrollAt = (time: number) => st().start + pxPerUnit() * time;
  const timeAt = (scroll: number) => (scroll - st().start) / pxPerUnit();
  const clampScroll = (y: number) => gsap.utils.clamp(scrollAt(0), scrollAt(end), y);
  const currentScroll = () => lenis?.scroll ?? window.scrollY;
  /** Scroll pixels per pixel of horizontal movement. */
  const ratio = () => (pxPerUnit() * UNITS_PER_WIDTH) / Math.max(stage.clientWidth, 1);

  const scrollTo = (y: number, settle = false) => {
    const top = clampScroll(y);
    if (!lenis) {
      window.scrollTo({ top, behavior: settle ? 'smooth' : 'instant' });
      return;
    }
    if (settle) lenis.scrollTo(top, { duration: dur('xslow') * 1.6, easing: gsap.parseEase('hnt-inout') });
    else lenis.scrollTo(top, { lerp: 0.2 });
  };

  const broom = createBroom(hero, stage);
  let drag: Drag | null = null;
  let swallowClick = false;

  const onPointerDown = (e: PointerEvent) => {
    if (!e.isPrimary || e.button !== 0) return;
    const scroll = currentScroll();
    // Once the story has scrolled past, the frame belongs to the page again.
    if (timeAt(scroll) > end + 0.01) return;
    drag = { id: e.pointerId, type: e.pointerType, x: e.clientX, y: e.clientY, scroll, time: timeAt(scroll), axis: null, lastX: e.clientX, lastT: e.timeStamp, velocity: 0 };
    broom.press(true, e.pointerType);
  };

  const onPointerMove = (e: PointerEvent) => {
    broom.move(e);
    if (!drag || e.pointerId !== drag.id) return;

    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;

    if (!drag.axis) {
      if (Math.hypot(dx, dy) < AXIS_LOCK) return;
      drag.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (drag.axis === 'x') {
        stage.setPointerCapture(e.pointerId);
        hero.classList.add('is-sweeping');
      }
    }
    if (drag.axis !== 'x') return;

    const dt = Math.max(e.timeStamp - drag.lastT, 1);
    drag.velocity = gsap.utils.interpolate(drag.velocity, (e.clientX - drag.lastX) / dt, 0.4);
    drag.lastX = e.clientX;
    drag.lastT = e.timeStamp;

    // Sweeping left moves the story forward, like pulling the next slide in.
    scrollTo(drag.scroll - dx * ratio());
  };

  const onPointerUp = (e: PointerEvent) => {
    if (!drag || e.pointerId !== drag.id) return;
    const { axis, velocity, x, time, type } = drag;
    const dx = e.clientX - x;
    drag = null;
    broom.press(false, type);
    hero.classList.remove('is-sweeping');
    if (stage.hasPointerCapture(e.pointerId)) stage.releasePointerCapture(e.pointerId);
    if (axis !== 'x') return;

    swallowClick = true;
    requestAnimationFrame(() => (swallowClick = false));

    let dir = 0;
    if (Math.abs(velocity) > COMMIT_VELOCITY) dir = -Math.sign(velocity);
    else if (Math.abs(dx) > stage.clientWidth * COMMIT_DISTANCE) dir = -Math.sign(dx);

    let target: number;
    if (dir > 0) target = rests.find((r) => r > time + 0.05) ?? end;
    else if (dir < 0) target = [...rests].reverse().find((r) => r < time - 0.05) ?? 0;
    else {
      const now = timeAt(currentScroll());
      target = rests.reduce((best, r) => (Math.abs(r - now) < Math.abs(best - now) ? r : best), rests[0]);
    }
    scrollTo(scrollAt(target), true);
  };

  const onPointerCancel = (e: PointerEvent) => {
    if (!drag || e.pointerId !== drag.id) return;
    broom.press(false, drag.type);
    drag = null;
    hero.classList.remove('is-sweeping');
  };

  // A drag that ends over a call to action should not also follow the link.
  const onClick = (e: MouseEvent) => {
    if (!swallowClick) return;
    e.preventDefault();
    e.stopPropagation();
  };

  const onDragStart = (e: DragEvent) => e.preventDefault();

  // Two finger horizontal swipes on a trackpad scroll the story too.
  const onWheel = (e: WheelEvent) => {
    if (e.ctrlKey || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    const base = lenis ? lenis.targetScroll : window.scrollY;
    if (timeAt(base) > end + 0.01) return;
    const next = clampScroll(base + e.deltaX * ratio());
    if (next === base) return;
    e.preventDefault();
    // Stops Lenis handling the small vertical part of the same gesture.
    (e as WheelEvent & { lenisStopPropagation?: boolean }).lenisStopPropagation = true;
    if (lenis) lenis.scrollTo(next, { programmatic: false, lerp: lenis.options.lerp });
    else window.scrollTo({ top: next, behavior: 'instant' });
  };

  stage.addEventListener('pointerdown', onPointerDown);
  stage.addEventListener('pointermove', onPointerMove);
  stage.addEventListener('pointerup', onPointerUp);
  stage.addEventListener('pointercancel', onPointerCancel);
  stage.addEventListener('click', onClick, true);
  stage.addEventListener('dragstart', onDragStart);
  stage.addEventListener('wheel', onWheel, { passive: false });

  return () => {
    stage.removeEventListener('pointerdown', onPointerDown);
    stage.removeEventListener('pointermove', onPointerMove);
    stage.removeEventListener('pointerup', onPointerUp);
    stage.removeEventListener('pointercancel', onPointerCancel);
    stage.removeEventListener('click', onClick, true);
    stage.removeEventListener('dragstart', onDragStart);
    stage.removeEventListener('wheel', onWheel);
    broom.destroy();
    hero.classList.remove('is-sweeping');
  };
}

/** Broom that follows the pointer, leaning into the direction of travel and dipping while pressed. */
function createBroom(hero: HTMLElement, stage: HTMLElement) {
  const el = hero.querySelector<HTMLElement>('[data-broom]');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const noop = { move: (_e: PointerEvent) => {}, press: (_on: boolean, _type: string) => {}, destroy: () => {} };
  if (!el) return noop;

  const x = gsap.quickTo(el, 'x', { duration: 0.12, ease: 'power3.out' });
  const y = gsap.quickTo(el, 'y', { duration: 0.12, ease: 'power3.out' });
  const lean = gsap.quickTo(el, 'rotation', { duration: dur('slow'), ease: 'hnt-out' });
  let lastX = 0;
  let lastT = 0;
  let visible = false;
  let pressed = false;
  let overLink = false;

  if (finePointer) hero.classList.add('has-broom');

  const show = (on: boolean) => {
    if (on === visible) return;
    visible = on;
    gsap.to(el, { autoAlpha: on ? 1 : 0, duration: dur('fast'), ease: 'none', overwrite: 'auto' });
  };

  const move = (e: PointerEvent) => {
    // Touch shows the broom only while a swipe is under way.
    if (e.pointerType !== 'mouse' && !hero.classList.contains('is-sweeping')) return;
    const rect = stage.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;

    if (!visible) {
      gsap.set(el, { x: px, y: py });
      lastX = e.clientX;
      lastT = e.timeStamp;
    }
    x(px);
    y(py);

    const dt = Math.max(e.timeStamp - lastT, 1);
    lean(gsap.utils.clamp(-28, 28, ((e.clientX - lastX) / dt) * 14));
    lastX = e.clientX;
    lastT = e.timeStamp;

    overLink = e.pointerType === 'mouse' && Boolean((e.target as Element).closest('a, button'));
    show(!overLink || pressed);
  };

  const press = (on: boolean, type: string) => {
    pressed = on;
    gsap.to(el, { scale: on ? 0.9 : 1, duration: dur('base'), ease: 'hnt-out', overwrite: 'auto' });
    if (!on && type !== 'mouse') show(false);
  };

  const onLeave = (e: PointerEvent) => {
    if (e.pointerType === 'mouse') show(false);
    lean(0);
  };

  // Settle upright when the pointer stops.
  const onIdle = () => lean(0);
  let idle = 0;
  const onMoveIdle = () => {
    window.clearTimeout(idle);
    idle = window.setTimeout(onIdle, 90);
  };

  stage.addEventListener('pointerleave', onLeave);
  stage.addEventListener('pointermove', onMoveIdle);

  return {
    move,
    press,
    destroy: () => {
      stage.removeEventListener('pointerleave', onLeave);
      stage.removeEventListener('pointermove', onMoveIdle);
      window.clearTimeout(idle);
      hero.classList.remove('has-broom');
      gsap.set(el, { autoAlpha: 0 });
    },
  };
}
