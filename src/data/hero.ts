import type { ImageMetadata } from 'astro';
import sceneBefore from '../assets/images/hero/1.png';
import sceneCrew from '../assets/images/hero/2.png';
import sceneClean from '../assets/images/hero/3.png';
import sceneThriving from '../assets/images/hero/4.png';
import mobileBefore from '../assets/images/hero/mobile/1.png';
import mobileCrew from '../assets/images/hero/mobile/2.png';
import mobileThriving from '../assets/images/hero/mobile/3.png';
import mobileClean from '../assets/images/hero/mobile/4.png';
import broom from '../assets/images/broom.png';

export interface HeroScene {
  id: string;
  image: ImageMetadata;
  /** 3:4 portrait of the same shot, served below 768px. Held still, never panned. */
  mobileImage: ImageMetadata;
  alt: string;
  /** Heading split so the accent words can take the cyan treatment. */
  heading: { lead: string; accent?: string };
  body: string;
  hint?: string;
  /** Final scene carries the calls to action. */
  showActions?: boolean;
}

export const heroScenes: HeroScene[] = [
  {
    id: 'before',
    image: sceneBefore,
    mobileImage: mobileBefore,
    alt: 'Neglected open plan office with smeared glass partitions, rubbish across the carpet and an overflowing bin',
    heading: { lead: 'Does your workplace look like this?' },
    body: 'Smudged glass, rubbish on the floor and bins left overflowing. It is not the first impression your team or your clients deserve.',
    hint: 'Sweep to clean it up',
  },
  {
    id: 'crew',
    image: sceneCrew,
    mobileImage: mobileCrew,
    alt: 'HNT Facility Services cleaners in navy uniforms wiping glass, vacuuming the carpet and sanitising desks',
    heading: { lead: 'Then our team', accent: 'steps in.' },
    body: 'HNT crews work through glass, floors, desks and bins with safe methods and a careful eye for detail.',
  },
  {
    id: 'clean',
    image: sceneClean,
    mobileImage: mobileClean,
    alt: 'The same office after cleaning, with clear glass, fresh carpet and tidy workstations in natural light',
    heading: { lead: 'Every surface,', accent: 'reset.' },
    body: 'Clear glass, fresh carpet and tidy workstations. The same standard on every visit, across South Australia and Western Australia.',
  },
  {
    id: 'thriving',
    image: sceneThriving,
    mobileImage: mobileThriving,
    alt: 'Office staff meeting and working at their desks in the freshly cleaned, bright workspace',
    heading: { lead: 'A space your people', accent: 'enjoy working in.' },
    body: 'Commercial cleaning and facility maintenance for businesses across South Australia and Western Australia.',
    showActions: true,
  },
];

/** Broom used for the sweep hint and as the pointer across the hero. */
export const heroBroom = {
  image: broom,
  /** Centre of the bristle edge, in percent of the image, so sweeping lines up with the pointer. */
  tip: { x: 41, y: 85 },
};

export const heroActions = {
  primary: { label: 'Get a Quote', href: '#quote' },
  secondary: { label: 'Our Services', href: '#services' },
};
