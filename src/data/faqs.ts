export interface Faq {
  id: string;
  question: string;
  answer: string;
  /** False until the client confirms the answer. */
  confirmed: boolean;
}

export const faqIntro = {
  eyebrow: 'FAQ',
  title: 'Frequently asked questions',
  lead: 'Answers to the questions facility and site managers ask us most.',
};

export const faqFollowUp = {
  text: 'Still have a question?',
  link: { label: 'Contact our team', href: '#quote' },
};

// Answers marked confirmed: false start with "Placeholder answer." and need the client to confirm the details.
export const faqs: Faq[] = [
  {
    id: 'services',
    question: 'What services do you offer?',
    answer:
      'We deliver commercial cleaning and facility maintenance for offices, commercial sites and facilities. Every scope is set up around your site and how your business runs.',
    confirmed: true,
  },
  {
    id: 'areas',
    question: 'Which areas do you service?',
    answer:
      'We service businesses across South Australia and Western Australia. Share your site location in the quote form and we will confirm coverage.',
    confirmed: true,
  },
  {
    id: 'about',
    question: 'Who is HNT Facility Services?',
    answer:
      'HNT Facility Services is a South Australian owned, family operated business with over 10 years of experience in cleaning and facility maintenance.',
    confirmed: true,
  },
  {
    // PLACEHOLDER: confirm scheduling options with the client.
    id: 'hours',
    question: 'Can you clean outside business hours?',
    answer:
      'Placeholder answer. We schedule cleaning around your operating hours, including early mornings, evenings and weekends where required.',
    confirmed: false,
  },
  {
    // PLACEHOLDER: confirm training, insurance and compliance details with the client.
    id: 'insurance',
    question: 'Are your staff trained and insured?',
    answer:
      'Placeholder answer. Our team is trained in safe work practices and we hold the relevant insurances. Details are available on request.',
    confirmed: false,
  },
  {
    id: 'quote',
    question: 'How do I get a quote?',
    answer:
      'Send us your details through the form below, or call or email our team. We will talk through your site and what you need before preparing a quote.',
    confirmed: true,
  },
];
