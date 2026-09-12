export interface FeaturedImageRecord {
  featured_image?: string | null;
  featured_image_data?: string | null;
  featured_image_mime?: string | null;
}

const byteaToDataUrl = (value?: string | null, mimeType?: string | null): string | null => {
  if (!value) return null;
  if (value.startsWith('data:image/')) return value;

  // PostgREST returns PostgreSQL BYTEA values in hexadecimal form: \\xFFD8...
  const hex = value.startsWith('\\x') ? value.slice(2) : '';
  if (!hex || hex.length % 2 !== 0 || !/^[0-9a-f]+$/i.test(hex)) return null;

  let binary = '';
  for (let index = 0; index < hex.length; index += 2) {
    binary += String.fromCharCode(parseInt(hex.slice(index, index + 2), 16));
  }
  return `data:${mimeType || 'image/jpeg'};base64,${btoa(binary)}`;
};

/** Prefer an image saved directly in PostgreSQL, otherwise use the normal URL. */
export const featuredImageSrc = (image: FeaturedImageRecord): string =>
  byteaToDataUrl(image.featured_image_data, image.featured_image_mime) || image.featured_image || '';
