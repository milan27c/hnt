export interface QuoteField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'select' | 'textarea';
  autocomplete?: string;
  placeholder?: string;
  options?: string[];
  /** Half width fields pair up from tablet. */
  width: 'half' | 'full';
  errors: { required: string; format?: string };
}

export const quoteIntro = {
  eyebrow: 'Get a quote',
  /** Heading split so the accent words can take the neon text treatment. */
  title: { lead: 'Tell us about', accent: 'your site' },
  lead: 'Share a few details and our team will be in touch to talk through your cleaning and maintenance needs.',
};

export const quoteContactTitle = 'Prefer to talk to us directly?';

export const quoteForm = {
  // No backend yet. Set to a form service URL (for example Formspree or a serverless function) to send real enquiries.
  // While this is null the script simulates a successful send so the states can be reviewed.
  endpoint: null as string | null,
  title: 'Send an enquiry',
  note: 'All fields are required.',
  submit: 'Send enquiry',
  sending: 'Sending',
  invalidSummary: (count: number) =>
    count === 1 ? 'Please check the highlighted field.' : `Please check the ${count} highlighted fields.`,
  success: {
    title: 'Thank you, your enquiry has been sent',
    body: 'Our team will be in touch using the details you provided.',
    reset: 'Send another enquiry',
  },
  error: 'Your enquiry could not be sent. Please try again, or call or email us directly.',
};

export const quoteFields: QuoteField[] = [
  {
    id: 'quote-name',
    name: 'name',
    label: 'Name',
    type: 'text',
    autocomplete: 'name',
    placeholder: 'Your full name',
    width: 'half',
    errors: { required: 'Enter your name.' },
  },
  {
    id: 'quote-email',
    name: 'email',
    label: 'Email',
    type: 'email',
    autocomplete: 'email',
    placeholder: 'you@company.com.au',
    width: 'half',
    errors: { required: 'Enter your email address.', format: 'Enter an email address like name@company.com.au.' },
  },
  {
    id: 'quote-phone',
    name: 'phone',
    label: 'Phone',
    type: 'tel',
    autocomplete: 'tel',
    placeholder: 'Your best contact number',
    width: 'half',
    errors: { required: 'Enter your phone number.', format: 'Enter a phone number with at least 8 digits.' },
  },
  {
    id: 'quote-reason',
    name: 'reason',
    label: 'Reason',
    type: 'select',
    placeholder: 'Select a reason',
    options: ['Request a quote', 'Commercial cleaning', 'Facility maintenance', 'General enquiry'],
    width: 'half',
    errors: { required: 'Select a reason for your enquiry.' },
  },
  {
    id: 'quote-message',
    name: 'message',
    label: 'Message',
    type: 'textarea',
    placeholder: 'Tell us about your site, its location and what you need',
    width: 'full',
    errors: { required: 'Enter a short message about what you need.' },
  },
];
