import type { ImageMetadata } from 'astro';
// Temporary: reuses the hero crew shot as the video poster until the client video and poster are supplied.
import processPoster from '../assets/images/hero/2.png';

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
}

export const processIntro = {
  eyebrow: 'How we work',
  /** Heading split so the accent words can take the neon text treatment. */
  title: { lead: 'See how our team', accent: 'looks after your site' },
  lead: 'Trained crews, safe work practices and a careful eye for detail on every visit, across South Australia and Western Australia.',
};

export const processVideo: { poster: ImageMetadata; alt: string; focusX: number; src: string | null; label: string } = {
  poster: processPoster,
  alt: 'HNT Facility Services crew in navy uniforms cleaning glass, vacuuming carpet and wiping down desks in an office',
  focusX: 50,
  // Drop the file in public/videos/ and set this to '/videos/how-we-work.mp4' to enable playback.
  src: null,
  label: 'Play video: how HNT Facility Services works',
};

// PLACEHOLDER: process steps to be confirmed by the client.
export const processSteps: ProcessStep[] = [
  {
    id: 'walkthrough',
    title: 'Site walkthrough',
    description: 'We visit your site to understand the layout, the risks and how your people use the space.',
  },
  {
    id: 'scope',
    title: 'Tailored scope',
    description: 'You receive a clear scope and schedule built around your operating hours.',
  },
  {
    id: 'delivery',
    title: 'Consistent delivery',
    description: 'A dedicated crew follows safe work methods to the same standard on every visit.',
  },
  {
    id: 'review',
    title: 'Ongoing review',
    description: 'Regular check ins keep quality on track as your site and needs change.',
  },
];
