import { gsap } from 'gsap';

/** Colour tokens the dust is tinted from, lightest first. */
const TINTS = ['--color-gray-100', '--color-navy-200', '--color-gray-300', '--color-primary-100'] as const;
/** Hard cap so fast scribbles never flood the frame. */
const MAX_PARTICLES = 160;
/** Stage pixels travelled per puff. */
const SPACING = 4;
/** Most puffs raised in a single frame. */
const MAX_PER_FRAME = 6;
/** Sprite resolution for one soft puff. */
const SPRITE = 64;
/**
 * Ends of the bristle edge relative to the broom's bristle tip, as a share of the broom's width.
 * Measured from assets/images/broom.png, so dust rises along the whole brush head.
 */
const EDGE_FROM = { x: -0.33, y: -0.135 };
const EDGE_TO = { x: 0.35, y: 0.13 };

/** Where the broom is this frame, in stage pixels. */
export interface BroomPose {
  x: number;
  y: number;
  /** Degrees, pivoting on the bristle tip. */
  rotation: number;
  /** Rendered broom width including its current scale. */
  width: number;
  pressed: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  grow: number;
  age: number;
  life: number;
  alpha: number;
  spin: number;
  /** Share of the broom's movement the puff still follows. Starts near 1 and lets go over its life. */
  cling: number;
  sprite: HTMLCanvasElement;
}

/** Pre renders a soft radial puff so each frame is a cheap drawImage. */
function makeSprite(hex: string): HTMLCanvasElement {
  const [r, g, b] = gsap.utils.splitColor(hex) as [number, number, number];
  const rgba = (a: number) => `rgba(${r},${g},${b},${a})`;
  const c = document.createElement('canvas');
  c.width = c.height = SPRITE;
  const ctx = c.getContext('2d')!;
  const mid = SPRITE / 2;
  const grad = ctx.createRadialGradient(mid, mid, 0, mid, mid, mid);
  grad.addColorStop(0, rgba(1));
  grad.addColorStop(0.45, rgba(0.55));
  grad.addColorStop(1, rgba(0));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, SPRITE, SPRITE);
  return c;
}

/**
 * Dust kicked up by the broom. Puffs spawn along the bristle edge, hang around the brush head,
 * drift upward and fade. The ticker only runs while dust is in the air.
 */
export function createDust(canvas: HTMLCanvasElement | null, stage: HTMLElement) {
  const noop = { sweep: (_pose: BroomPose) => {}, reset: () => {}, destroy: () => {} };
  const ctx = canvas?.getContext('2d');
  if (!canvas || !ctx) return noop;

  const style = getComputedStyle(document.documentElement);
  const sprites = TINTS.map((token) => style.getPropertyValue(token).trim())
    .filter(Boolean)
    .map(makeSprite);
  if (!sprites.length) return noop;
  const particles: Particle[] = [];
  let width = 0;
  let height = 0;
  let lastX: number | null = null;
  let lastY: number | null = null;
  let frameDx = 0;
  let frameDy = 0;
  let carry = 0;
  let running = false;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = stage.clientWidth;
    height = stage.clientHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(stage);

  const rand = gsap.utils.random;

  /** One puff somewhere along the bristle edge, drifting out gently so it hangs around the brush head. */
  const spawn = (pose: BroomPose) => {
    if (particles.length >= MAX_PARTICLES) particles.shift();
    const rad = (pose.rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const t = rand(0, 1);
    const ex = (EDGE_FROM.x + (EDGE_TO.x - EDGE_FROM.x) * t) * pose.width;
    const ey = (EDGE_FROM.y + (EDGE_TO.y - EDGE_FROM.y) * t) * pose.width;
    // Puffs start a touch either side of the bristles, weighted towards the floor below them.
    const offset = rand(-0.06, 0.14) * pose.width;
    const lx = ex - EDGE_TO.y * offset * 2;
    const ly = ey + offset;
    const x = pose.x + lx * cos - ly * sin;
    const y = pose.y + lx * sin + ly * cos;

    // Clings to the bristles at first, puffing gently outward from the brush head.
    const out = Math.atan2(y - pose.y, x - pose.x) + rand(-0.6, 0.6);
    const drift = rand(10, 30) * (pose.pressed ? 1.3 : 1);
    const cling = rand(0.8, 1);
    particles.push({
      // Already at the broom this frame, so undo the follow step the next draw adds.
      x: x - frameDx * cling,
      y: y - frameDy * cling,
      vx: Math.cos(out) * drift,
      vy: Math.sin(out) * drift - rand(4, 12),
      size: rand(0.12, 0.24) * pose.width * (pose.pressed ? 1.15 : 1),
      grow: rand(0.25, 0.5) * pose.width,
      age: 0,
      life: rand(0.4, 0.75),
      alpha: rand(0.45, 0.8),
      spin: rand(-1, 1),
      cling,
      sprite: sprites[Math.floor(rand(0, sprites.length))],
    });
  };

  const tick = (_time: number, deltaMs: number) => {
    const dt = Math.min(deltaMs, 50) / 1000;
    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.age += dt;
      if (p.age >= p.life) {
        particles.splice(i, 1);
        continue;
      }
      const drag = Math.pow(0.015, dt);
      p.vx = p.vx * drag + p.spin * 6 * dt;
      p.vy = p.vy * drag - 10 * dt;
      p.x += p.vx * dt + frameDx * p.cling;
      p.y += p.vy * dt + frameDy * p.cling;
      p.cling *= Math.pow(0.004, dt);
      p.size += p.grow * dt;

      const t = p.age / p.life;
      // Quick bloom in, long soft fade out.
      const fade = t < 0.15 ? t / 0.15 : 1 - Math.pow((t - 0.15) / 0.85, 1.6);
      ctx.globalAlpha = p.alpha * fade;
      const s = p.size;
      ctx.drawImage(p.sprite, p.x - s / 2, p.y - s / 2, s, s);
    }
    ctx.globalAlpha = 1;
    frameDx = frameDy = 0;

    if (!particles.length) stop();
  };

  const start = () => {
    if (running) return;
    running = true;
    gsap.ticker.add(tick);
  };

  function stop() {
    if (!running) return;
    running = false;
    gsap.ticker.remove(tick);
    ctx!.clearRect(0, 0, width, height);
  }

  /** Called every frame the broom is shown; puffs are raised in proportion to how far it moved. */
  const sweep = (pose: BroomPose) => {
    const { x, y, pressed } = pose;
    if (lastX === null || lastY === null) {
      lastX = x;
      lastY = y;
      return;
    }
    const dx = x - lastX;
    const dy = y - lastY;
    const dist = Math.hypot(dx, dy);
    if (dist < 0.5) return;
    // Only tracked while dust is in the air, so a stale move never lands on fresh puffs.
    if (running) {
      frameDx += dx;
      frameDy += dy;
    }

    carry += dist;
    // Pressing the broom to the floor raises noticeably more dust.
    const step = pressed ? SPACING * 0.6 : SPACING;
    let placed = 0;
    while (carry >= step && placed < MAX_PER_FRAME) {
      carry -= step;
      spawn(pose);
      placed++;
    }
    if (placed === MAX_PER_FRAME) carry = 0;
    lastX = x;
    lastY = y;
    if (placed) start();
  };

  /** Breaks the trail so the next move does not draw dust across a jump. */
  const reset = () => {
    lastX = lastY = null;
    carry = 0;
  };

  return {
    sweep,
    reset,
    destroy: () => {
      ro.disconnect();
      particles.length = 0;
      stop();
    },
  };
}
