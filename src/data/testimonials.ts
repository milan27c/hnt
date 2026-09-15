import type { ImageMetadata } from 'astro';
// Stock portraits from Pexels, used for the prototype only:
// sample-1 https://www.pexels.com/photo/1181686/
// sample-2 https://www.pexels.com/photo/3785079/
// sample-3 https://www.pexels.com/photo/1181519/
import avatarSample1 from '../assets/images/testimonials/sample-1.jpg';
import avatarSample2 from '../assets/images/testimonials/sample-2.jpg';
import avatarSample3 from '../assets/images/testimonials/sample-3.jpg';

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar: ImageMetadata;
  /** True for invented prototype content. The production build warns while any remain. */
  sample: boolean;
  /** False until the client supplies the real quote and gives permission to publish it. */
  confirmed: boolean;
}

export const testimonialsIntro = {
  eyebrow: 'Client testimonials',
  title: 'What our clients say',
  lead: 'Long term partnerships built on consistent quality and dependable delivery.',
};

// SAMPLE CONTENT FOR THE PROTOTYPE ONLY. The quotes, names and sites are invented and the photos are stock models
// who have never been HNT clients. Publishing them would present fake reviews and imply endorsement by the people
// pictured, which the Pexels licence does not allow. Replace with real client words and photos before launch.
export const testimonials: Testimonial[] = [
  {
    id: 'sample-1',
    quote:
      'The team arrives on schedule, works safely around our staff and leaves the office to the same standard every week. We have not had to raise a cleaning issue in months.',
    name: 'Sarah M.',
    role: 'Facility manager',
    company: 'Corporate office, Adelaide',
    avatar: avatarSample1,
    sample: true,
    confirmed: false,
  },
  {
    id: 'sample-2',
    quote:
      'Communication is clear and any issue is sorted the same day. Having one provider for cleaning and maintenance across our Perth sites has made life much simpler.',
    name: 'David K.',
    role: 'Operations manager',
    company: 'Warehouse and logistics, Perth',
    avatar: avatarSample2,
    sample: true,
    confirmed: false,
  },
  {
    id: 'sample-3',
    quote:
      'They took the time to understand our clinic and built a cleaning schedule around patient hours. The standard is consistent and the staff are respectful and reliable.',
    name: 'Grace T.',
    role: 'Practice manager',
    company: 'Medical centre, Adelaide',
    avatar: avatarSample3,
    sample: true,
    confirmed: false,
  },
];
