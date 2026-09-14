const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xljeyonl';

type FormspreeFields = Record<string, string | number | boolean | null | undefined>;

/** Sends a visitor enquiry to Formspree without navigating away from the website. */
export const submitToFormspree = async (fields: FormspreeFields): Promise<void> => {
  const response = await fetch(FORMSPREE_ENDPOINT, {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(fields),
  });

  if (response.ok) return;

  let message = 'Your request could not be delivered. Please try again or contact us on WhatsApp.';
  try {
    const payload = await response.json() as { errors?: Array<{ message?: string }> };
    message = payload.errors?.[0]?.message || message;
  } catch {
    // Formspree may return a non-JSON response for a configuration error.
  }
  throw new Error(message);
};
