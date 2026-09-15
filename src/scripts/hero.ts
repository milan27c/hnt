import { gsap } from 'gsap';
import type Lenis from 'lenis';
import { dur } from './tokens';
import { initSweep } from './sweep';

interface HeroOptions {
  lenis: Lenis | null;
  story: boolean;
}

interface Scene {
  el: HTMLElement;
  media: HTMLElement;
  img: HTMLElement;
  content: HTMLElement;
  rise: HTMLElement;
  items: HTMLElement[];
  panFrom: number;
  panTo: number;
}

/*
 * Story timeline, in abstract scroll units across the held frame.
 *
 *   0 ─ 1.0   before: the hook
 *   1.0 ─ 3.0 cloud pass, crew revealed at the peak (1.85)
 *   3.1 ─ 4.1 crew at work
 *   4.1 ─ 6.1 cloud pass, clean office revealed at the peak (4.95)
 *   6.2 ─ 7.0 spotless
 *   7.0 ─ 8.6 soft light crossfade to the same room, now full of people
 *   8.6 ─ 10  final message and calls to action
 */
const T = {
  end: 10,
  pass1: 1.0,
  pass2: 4.1,
  fade3: 7.0,
  reveal: [0, 1.85, 4.95, 7.25],
  motionStart: [0, 1.85, 4.95, 8.05],
  motionEnd: [1.9, 5.0, 7.25, 10],
  contentIn: [0, 2.5, 5.6, 8.1],
  contentOut: [1.0, 4.1, 7.0],
  scale: [
    [1, 1.08],
    [1.14, 1.02],
    [1.12, 1],
    [1, 1.06],
  ],
  // Final scene becomes interactive once its content has arrived.
  live: 8.3,
  // Where a swipe settles: each scene's copy fully in and not yet leaving.
  rest: [0, 3.55, 6.6, 9.3],
} as const;

export function initHero({ lenis, story }: HeroOptions): void {
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  // The stacked fallback needs no script.
  if (!hero || !story) return;

  const q = <E extends HTMLElement>(root: ParentNode, sel: string) => root.querySelector<E>(sel)!;
  const stage = q(hero, '[data-hero-stage]');
  const veil = q(hero, '[data-veil]');
  const glow = q(hero, '[data-glow]');
  const fills = gsap.utils.toArray<HTMLElement>(hero.querySelectorAll('[data-progress-fill]'));
  const cloudGroups = gsap.utils.toArray<HTMLElement>(hero.querySelectorAll('[data-clouds]'));

  const scenes: Scene[] = gsap.utils.toArray<HTMLElement>(hero.querySelectorAll('[data-scene]')).map((el) => ({
    el,
    media: q(el, '[data-media]'),
    img: q(el, '[data-img]'),
    content: q(el, '[data-content]'),
    rise: q(el, '[data-rise]'),
    items: gsap.utils.toArray<HTMLElement>(el.querySelectorAll('[data-item]')),
    panFrom: Number(el.dataset.panFrom ?? 50),
    panTo: Number(el.dataset.panTo ?? 50),
  }));

  if (scenes.length < 4) return;

  playIntro(hero, scenes[0]);

  const mm = gsap.matchMedia();

  mm.add({ mobile: '(max-width: 47.99rem)', desktop: '(min-width: 48rem)' }, (context) => {
    const mobile = Boolean(context.conditions?.mobile);

    /** Mobile pans a 16:9 image inside a 4:5 frame. Focal point percent to xPercent, clamped to the image edges. */
    const pan = (scene: Scene, focus: number) => {
      if (!mobile) return 0;
      const overflow = 50 * (1 - stage.clientWidth / Math.max(scene.img.offsetWidth, 1));
      return gsap.utils.clamp(-overflow, overflow, 50 - focus);
    };

    // Start states for everything the timeline animates.
    scenes.slice(1).forEach((scene) => {
      gsap.set(scene.rise, { yPercent: 105 });
      gsap.set(scene.items, { y: 32, opacity: 0 });
    });
    gsap.set(fills, { scaleX: 0 });
    cloudGroups.forEach((group) => setCloudStart(group));

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        invalidateOnRefresh: true,
        onUpdate: () => scenes[3].el.classList.toggle('is-live', tl.time() >= T.live),
      },
    });

    // Image motion: slow push in or out while each scene is on screen, panning on mobile.
    scenes.forEach((scene, i) => {
      const [scaleFrom, scaleTo] = T.scale[i];
      tl.set(scene.img, { scale: scaleFrom, xPercent: () => pan(scene, scene.panFrom) }, Math.max(0, T.reveal[i] - 0.05));
      tl.to(
        scene.img,
        {
          scale: scaleTo,
          xPercent: () => pan(scene, scene.panTo),
          duration: T.motionEnd[i] - T.motionStart[i],
          ease: i === 0 ? 'sine.in' : 'sine.out',
        },
        T.motionStart[i],
      );
    });

    // Copy leaving: the block lifts and fades.
    T.contentOut.forEach((at, i) => {
      tl.to(scenes[i].content, { y: -56, opacity: 0, duration: 0.6, ease: 'power1.in' }, at);
    });

    // Copy arriving: masked heading rise, then supporting lines.
    scenes.slice(1).forEach((scene, n) => {
      const at = T.contentIn[n + 1];
      tl.to(scene.content, { opacity: 1, duration: 0.01 }, at);
      tl.to(scene.rise, { yPercent: 0, duration: 0.6, ease: 'hnt-out' }, at);
      tl.to(scene.items, { y: 0, opacity: 1, duration: 0.6, stagger: 0.09, ease: 'hnt-out' }, at + 0.12);
    });

    // Cloud passes hide the swap between the messy office, the crew and the clean room.
    addCloudPass(tl, cloudGroups[0], T.pass1, veil);
    tl.to(scenes[1].media, { opacity: 1, duration: 0.2 }, T.reveal[1]);
    tl.to(scenes[0].media, { opacity: 0, duration: 0.01 }, T.reveal[1] + 0.3);

    addCloudPass(tl, cloudGroups[1], T.pass2, veil);
    tl.to(scenes[2].media, { opacity: 1, duration: 0.2 }, T.reveal[2]);
    tl.to(scenes[1].media, { opacity: 0, duration: 0.01 }, T.reveal[2] + 0.3);

    // Same camera, so a soft brightening crossfade lets the people appear in the room.
    tl.to(veil, { opacity: 0.18, duration: 0.45, ease: 'sine.inOut' }, T.fade3 + 0.2);
    tl.to(scenes[3].media, { opacity: 1, duration: 0.8, ease: 'sine.inOut' }, T.reveal[3]);
    tl.to(veil, { opacity: 0, duration: 0.6, ease: 'sine.inOut' }, T.fade3 + 0.75);

    // Brand glow warms up once the team arrives.
    tl.to(glow, { opacity: 1, duration: 0.8, ease: 'sine.inOut' }, T.contentIn[1] - 0.3);

    // Progress rail, one bar per scene.
    const bounds = [0, T.reveal[1], T.reveal[2], T.reveal[3] + 0.4, T.end];
    fills.forEach((fill, i) => tl.to(fill, { scaleX: 1, duration: bounds[i + 1] - bounds[i] }, bounds[i]));

    // Hold the final frame so the calls to action can be read before the page moves on.
    tl.to({}, { duration: 0.01 }, T.end - 0.01);

    // Keyboard users tabbing into the final calls to action are scrolled to where they are visible.
    const onFocus = () => {
      const st = tl.scrollTrigger;
      if (!st || tl.time() >= T.live) return;
      const target = st.start + (st.end - st.start) * ((T.live + 0.6) / T.end);
      if (lenis) lenis.scrollTo(target, { immediate: true });
      else window.scrollTo({ top: target });
      tl.progress(st.progress);
    };
    scenes[3].content.addEventListener('focusin', onFocus);

    const destroySweep = initSweep({ hero, stage, lenis, tl, rests: T.rest, end: T.end });

    return () => {
      scenes[3].content.removeEventListener('focusin', onFocus);
      destroySweep();
    };
  });
}

function playIntro(hero: HTMLElement, scene: Scene): void {
  const tl = gsap.timeline({ defaults: { ease: 'hnt-out', duration: dur('xslow') } });
  tl.fromTo(scene.media, { scale: 1.08 }, { scale: 1, duration: dur('xslow') * 1.8, ease: 'hnt-soft' }, 0)
    .fromTo(scene.rise, { yPercent: 105, opacity: 1 }, { yPercent: 0 }, 0.15)
    .fromTo(scene.items, { y: 32, opacity: 0 }, { y: 0, opacity: 1, stagger: dur('stagger') }, 0.35);
  hero.classList.add('is-ready');
}

const cloudStart: Record<string, gsap.TweenVars> = {
  bank: { yPercent: 45, scale: 1, opacity: 0 },
  left: { xPercent: -35, yPercent: 6, scale: 0.9, opacity: 0 },
  right: { xPercent: 35, yPercent: -4, scale: 0.9, opacity: 0 },
  wisp: { yPercent: -30, scale: 1, opacity: 0 },
  core: { scale: 0.5, opacity: 0 },
};

function setCloudStart(group: HTMLElement): void {
  group.querySelectorAll<HTMLElement>('[data-cloud]').forEach((cloud) => {
    gsap.set(cloud, { ...cloudStart[cloud.dataset.cloud ?? ''], transformOrigin: '50% 50%' });
  });
}

/** Clouds billow in from the edges, cover the frame at `at + 1`, then part outward and dissolve. */
function addCloudPass(tl: gsap.core.Timeline, group: HTMLElement, at: number, veil: HTMLElement): void {
  const layer = (key: string) => group.querySelector<HTMLElement>(`[data-cloud="${key}"]`)!;

  tl.to(layer('bank'), { yPercent: 0, scale: 1.15, opacity: 1, duration: 1, ease: 'sine.out' }, at)
    .to(layer('left'), { xPercent: 8, yPercent: 0, scale: 1.1, opacity: 1, duration: 0.95, ease: 'sine.out' }, at + 0.05)
    .to(layer('right'), { xPercent: -8, yPercent: 0, scale: 1.1, opacity: 1, duration: 0.95, ease: 'sine.out' }, at + 0.12)
    .to(layer('wisp'), { yPercent: 10, opacity: 0.9, duration: 1, ease: 'sine.out' }, at + 0.2)
    .to(layer('core'), { scale: 1.05, opacity: 1, duration: 0.8, ease: 'sine.inOut' }, at + 0.35)
    .to(veil, { opacity: 0.85, duration: 0.35, ease: 'sine.in' }, at + 0.62)
    // Part
    .to(veil, { opacity: 0, duration: 0.55, ease: 'sine.out' }, at + 1.02)
    .to(layer('core'), { scale: 2.2, opacity: 0, duration: 0.8, ease: 'sine.inOut' }, at + 1.02)
    .to(layer('left'), { xPercent: -48, yPercent: -10, scale: 1.4, opacity: 0, duration: 0.95, ease: 'sine.inOut' }, at + 1.05)
    .to(layer('right'), { xPercent: 48, yPercent: 8, scale: 1.4, opacity: 0, duration: 0.95, ease: 'sine.inOut' }, at + 1.1)
    .to(layer('bank'), { yPercent: 50, scale: 1.3, opacity: 0, duration: 1, ease: 'sine.inOut' }, at + 1.0)
    .to(layer('wisp'), { yPercent: -40, opacity: 0, duration: 0.9, ease: 'sine.inOut' }, at + 1.15);
}
