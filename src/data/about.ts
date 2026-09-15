import type { ImageMetadata } from 'astro';
import aboutPhoto from '../assets/images/about.png';

export interface AboutStat {
  value: number;
  suffix?: string;
  label: string;
  detail?: string;
}

export const aboutIntro = {
  eyebrow: 'About us',
  title: 'Family operated cleaning and facility care you can rely on',
  lead: 'For over 10 years we have kept commercial sites across South Australia and Western Australia clean, safe and ready for business.',
};

// Square source photo. focusY keeps the team's faces in frame when it crops to 16:9 on tablet.
export const aboutImage: { src: ImageMetadata; alt: string; focusX: number; focusY: number; badge: string } = {
  src: aboutPhoto,
  alt: 'Five HNT Facility Services team members in navy uniforms standing outside a commercial building with cleaning equipment and a company van',
  focusX: 50,
  focusY: 30,
  badge: 'Servicing South Australia and Western Australia',
};

export const aboutStory = {
  title: 'Who we are',
  paragraphs: [
    'HNT Facility Services is a South Australian owned, family operated business delivering commercial cleaning and facility maintenance.',
    'We build long term partnerships with site and facility managers through consistent quality, safe work practices and attention to detail.',
  ],
  values: ['Trusted', 'Professional', 'Reliable'],
};

// Only facts confirmed in the brief. Add client supplied figures here once provided.
export const aboutStats = {
  title: 'At a glance',
  stats: [
    { value: 10, suffix: '+', label: 'Years of industry experience' },
    { value: 2, label: 'States served', detail: 'South Australia and Western Australia' },
  ] satisfies AboutStat[],
  highlights: ['South Australian owned', 'Family operated'],
};
