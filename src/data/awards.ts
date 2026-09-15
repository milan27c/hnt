import type { ImageMetadata } from 'astro';
import award2024 from '../assets/images/awards/2024.png';
import award2025 from '../assets/images/awards/2025.png';

export interface Award {
  id: string;
  year: number;
  /** Award name and result as printed on the supplied artwork. */
  name: string;
  result: string;
  image: ImageMetadata;
  alt: string;
}

export const awardsIntro = {
  eyebrow: 'Awards',
  title: 'Recognised for the way we work',
  lead: 'HNT Facility Services was named a finalist in the Australian Trades Small Business Champion Awards in 2024 and again in 2025.',
};

export const awards: Award[] = [
  {
    id: 'atsbc-2024',
    year: 2024,
    name: 'Australian Trades Small Business Champion Awards',
    result: 'Finalist',
    image: award2024,
    alt: 'Australian Trades Small Business Champion Awards 2024 Finalist emblem',
  },
  {
    id: 'atsbc-2025',
    year: 2025,
    name: 'Australian Trades Small Business Champion Awards',
    result: 'Finalist',
    image: award2025,
    alt: 'Australian Trades Small Business Champion Awards 2025 Finalist emblem',
  },
];

export const awardsInfo = {
  title: 'Finalist two years running',
  paragraphs: [
    'The Australian Trades Small Business Champion Awards recognise small businesses in the trades and services sector across Australia.',
    'Being named a finalist in consecutive years reflects the consistent quality, safe work practices and client focused service our team brings to every site.',
  ],
  highlights: ['Finalist 2024', 'Finalist 2025'],
  cta: { label: 'Get a Quote', href: '#quote' },
};
