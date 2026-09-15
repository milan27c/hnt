import type { ImageMetadata } from 'astro';
import commercialCleaning from '../assets/images/services/Commercial Cleaning.png';
import facilityMaintenance from '../assets/images/services/Facility Maintenance.png';
import specialisedCleaning from '../assets/images/services/Specialised Cleaning.png';

export interface Service {
  id: string;
  title: string;
  description: string;
  image: ImageMetadata;
  alt: string;
  /** Service detail pages are not built yet, so this stays '#'. */
  href: string;
  /** False until the client confirms the service name and copy. */
  confirmed: boolean;
}

export const servicesIntro = {
  eyebrow: 'Our services',
  title: 'Commercial cleaning and facility maintenance',
  lead: 'Dependable services for offices, commercial sites and facilities across South Australia and Western Australia.',
};

export const serviceCta = 'View details';

export const services: Service[] = [
  {
    id: 'commercial-cleaning',
    title: 'Commercial Cleaning',
    description: 'Scheduled cleaning for offices and commercial sites, delivered to the same standard on every visit.',
    image: commercialCleaning,
    alt: 'HNT cleaners polishing a marble lobby floor, mopping and wiping glass doors in a commercial building',
    href: '#',
    confirmed: true,
  },
  {
    id: 'facility-maintenance',
    title: 'Facility Maintenance',
    description: 'Ongoing upkeep that keeps your facility safe, presentable and ready for work each day.',
    image: facilityMaintenance,
    alt: 'HNT technician on a stepladder replacing a ceiling light in an office building foyer',
    href: '#',
    confirmed: true,
  },
  {
    // PLACEHOLDER: service name and copy to be supplied by the client.
    id: 'specialised-cleaning',
    title: 'Specialised Cleaning',
    description: 'Periodic and one off deep cleans for sites that need extra attention.',
    image: specialisedCleaning,
    alt: 'HNT team deep cleaning office carpet with a scrubbing machine and extraction vacuum',
    href: '#',
    confirmed: false,
  },
];
