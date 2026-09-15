import type { ImageMetadata } from 'astro';
import industriesPhoto from '../assets/images/industries.png';

export type IndustryIcon = 'office' | 'retail' | 'education' | 'medical' | 'industrial' | 'strata';

export interface Industry {
  id: string;
  name: string;
  icon: IndustryIcon;
}

export const industriesIntro = {
  eyebrow: 'Industries we serve',
  title: 'Businesses we frequently serve',
  lead: 'Commercial cleaning and facility maintenance planned around how each site operates, from busy offices to warehouses across South Australia and Western Australia.',
};

// PLACEHOLDER: industry list to be confirmed by the client.
export const industries: Industry[] = [
  { id: 'offices', name: 'Offices and corporate', icon: 'office' },
  { id: 'retail', name: 'Retail and shopping centres', icon: 'retail' },
  { id: 'education', name: 'Schools and childcare', icon: 'education' },
  { id: 'medical', name: 'Medical and healthcare', icon: 'medical' },
  { id: 'industrial', name: 'Industrial and warehousing', icon: 'industrial' },
  { id: 'strata', name: 'Strata and body corporate', icon: 'strata' },
];

// Portrait source photo. focusY keeps the lead cleaner in frame when it crops to 4:3 and 16:9.
export const industriesImage: { src: ImageMetadata; alt: string; focusX: number; focusY: number; caption: string } = {
  src: industriesPhoto,
  alt: 'HNT Facility Services team in navy uniforms mopping floors and wiping glass shopfronts inside a shopping centre',
  focusX: 55,
  focusY: 35,
  caption: 'Trusted. Professional. Reliable.',
};

export const industriesCta = {
  text: 'Your industry not listed?',
  label: 'Talk to us about your site',
  href: '#quote',
};
