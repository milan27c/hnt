import { CustomEase } from 'gsap/CustomEase';

const rootStyle = () => getComputedStyle(document.documentElement);

/** Reads a duration token such as --dur-xslow and returns seconds for GSAP. */
export function dur(name: 'fast' | 'base' | 'slow' | 'xslow' | 'stagger'): number {
  const token = name === 'stagger' ? '--stagger' : `--dur-${name}`;
  const raw = rootStyle().getPropertyValue(token).trim();
  const value = parseFloat(raw);
  if (Number.isNaN(value)) return 0;
  return raw.endsWith('ms') ? value / 1000 : value;
}

/** Registers the CSS easing tokens as named GSAP eases: hnt-out, hnt-inout, hnt-soft. */
export function registerEases(): void {
  const style = rootStyle();
  for (const name of ['out', 'inout', 'soft']) {
    const match = style.getPropertyValue(`--ease-${name}`).match(/cubic-bezier\(([^)]+)\)/);
    if (!match) continue;
    const [x1, y1, x2, y2] = match[1].split(',').map((n) => n.trim());
    CustomEase.create(`hnt-${name}`, `M0,0 C${x1},${y1} ${x2},${y2} 1,1`);
  }
}
