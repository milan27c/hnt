import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { quoteForm } from '../data/quote';

type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const MIN_PHONE_DIGITS = 8;

/** Returns the error message for a field, or an empty string when it is valid. */
function validate(control: Control): string {
  const value = control.value.trim();
  const { errorRequired = '', errorFormat = '' } = control.dataset;

  if (!value) return errorRequired;
  if (control.type === 'email' && (control as HTMLInputElement).validity.typeMismatch) return errorFormat;
  if (control.type === 'tel' && (value.replace(/\D/g, '').length < MIN_PHONE_DIGITS || /[^\d\s()+.-]/.test(value))) return errorFormat;
  return '';
}

/**
 * Quote form: inline validation on blur and submit, a sending state, then success or error.
 * Without JavaScript the browser's native required and type checks still apply.
 */
export function initQuoteForm(): void {
  const form = document.querySelector<HTMLFormElement>('[data-quote-form]');
  const card = document.querySelector<HTMLElement>('[data-quote-form-card]');
  const success = card?.querySelector<HTMLElement>('[data-form-success]');
  if (!form || !card || !success) return;

  const controls = Array.from(form.querySelectorAll<Control>('[data-field]'));
  const submit = form.querySelector<HTMLButtonElement>('[data-form-submit]');
  const submitLabel = form.querySelector<HTMLElement>('[data-form-submit-label]');
  const status = form.querySelector<HTMLElement>('[data-form-status]');
  const successTitle = success.querySelector<HTMLElement>('[data-form-success-title]');
  const reset = success.querySelector<HTMLButtonElement>('[data-form-reset]');
  const endpoint = form.dataset.endpoint;
  let sending = false;

  form.noValidate = true;

  const show = (control: Control, message: string) => {
    const error = document.getElementById(`${control.id}-error`);
    if (error) error.textContent = message;
    if (message) control.setAttribute('aria-invalid', 'true');
    else control.removeAttribute('aria-invalid');
  };

  const check = (control: Control) => {
    const message = validate(control);
    show(control, message);
    return !message;
  };

  controls.forEach((control) => {
    // Only judge a field once the visitor has left it with something typed, then keep it live.
    control.addEventListener('blur', () => {
      if (control.value.trim() || control.hasAttribute('aria-invalid')) check(control);
    });
    const live = () => control.hasAttribute('aria-invalid') && check(control);
    control.addEventListener('input', live);
    control.addEventListener('change', live);
  });

  const setSending = (next: boolean) => {
    sending = next;
    submit?.setAttribute('aria-disabled', String(next));
    if (submitLabel) submitLabel.textContent = next ? quoteForm.sending : quoteForm.submit;
  };

  const send = async (): Promise<boolean> => {
    if (!endpoint) {
      // Prototype mode: no backend configured yet, so simulate a short round trip.
      await new Promise((resolve) => setTimeout(resolve, 900));
      return true;
    }
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      return response.ok;
    } catch {
      return false;
    }
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending) return;

    const invalid = controls.filter((control) => !check(control));
    if (invalid.length) {
      if (status) status.textContent = quoteForm.invalidSummary(invalid.length);
      invalid[0].focus();
      return;
    }

    if (status) status.textContent = '';
    setSending(true);
    const ok = await send();
    setSending(false);

    if (!ok) {
      if (status) status.textContent = quoteForm.error;
      return;
    }

    // Hold the card height so swapping in the shorter success panel causes no layout shift.
    card.style.minHeight = `${card.offsetHeight}px`;
    form.hidden = true;
    success.hidden = false;
    successTitle?.focus();
    form.reset();
  });

  reset?.addEventListener('click', () => {
    controls.forEach((control) => show(control, ''));
    success.hidden = true;
    form.hidden = false;
    card.style.minHeight = '';
    ScrollTrigger.refresh();
    controls[0]?.focus();
  });
}
