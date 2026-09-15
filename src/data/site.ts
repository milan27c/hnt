export interface NavLink {
  label: string;
  href: string;
}

export const site = {
  name: 'HNT Facility Services',
  shortName: 'HNTFS',
  tagline: 'Trusted. Professional. Reliable.',
  description:
    'Commercial cleaning and facility maintenance across South Australia and Western Australia. South Australian owned and family operated, with over 10 years of industry experience.',
  serviceAreas: ['South Australia', 'Western Australia'],
} as const;

export interface ContactDetail {
  id: 'phone' | 'email' | 'address' | 'areas';
  label: string;
  value: string;
  href?: string;
}

// PLACEHOLDER: email and address are dummy values until the client supplies them.
export const contact: ContactDetail[] = [
  { id: 'phone', label: 'Phone', value: '08 7083 0790', href: 'tel:+61870830790' },
  { id: 'email', label: 'Email', value: 'hello@example.com', href: 'mailto:hello@example.com' },
  { id: 'address', label: 'Office', value: 'Street address to be confirmed, South Australia' },
  { id: 'areas', label: 'Service areas', value: 'South Australia and Western Australia' },
];

export const credit = { label: 'Powered by', name: 'Azbow', href: 'https://azbow.com' };

// PLACEHOLDER: social profile links to be supplied by the client.
export const socials: { id: 'linkedin' | 'facebook' | 'instagram'; label: string; href: string }[] = [
  { id: 'linkedin', label: 'HNT Facility Services on LinkedIn', href: '#' },
  { id: 'facebook', label: 'HNT Facility Services on Facebook', href: '#' },
  { id: 'instagram', label: 'HNT Facility Services on Instagram', href: '#' },
];

// Only the home page exists, so every link points to an on page anchor.
export const primaryNav: NavLink[] = [
  { label: 'Home', href: '#top' },
  { label: 'Services', href: '#services' },
  { label: 'About Us', href: '#about' },
  { label: 'Contact Us', href: '#quote' },
];

export const footerNav: NavLink[] = [
  { label: 'About Us', href: '#about' },
  { label: 'Our Services', href: '#services' },
  { label: 'How We Work', href: '#how-we-work' },
  { label: 'Awards', href: '#awards' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact Us', href: '#quote' },
];

export const quoteCta: NavLink = { label: 'Get a Quote', href: '#quote' };
