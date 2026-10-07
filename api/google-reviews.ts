type GoogleReview = {
  authorAttribution?: { displayName?: string; photoUri?: string };
  rating?: number;
  text?: { text?: string };
  relativePublishTimeDescription?: string;
};

const maxRating = (value: unknown) => Math.max(0, Math.min(5, Number(value) || 0));

export default async function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return res.status(204).end();
  }

  try {
    const response = await fetch(`https://places.googleapis.com/v1/${placeId}`, {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'displayName,rating,userRatingCount,googleMapsUri,reviews',
      },
    });

    if (!response.ok) {
      console.warn('Google Places review request failed:', response.status);
      return res.status(502).json({ error: 'Google Business Profile reviews are temporarily unavailable.' });
    }

    const place = await response.json() as {
      displayName?: { text?: string };
      rating?: number;
      userRatingCount?: number;
      googleMapsUri?: string;
      reviews?: GoogleReview[];
    };

    return res.status(200).json({
      name: place.displayName?.text || 'Cambodia Taxi Cab',
      rating: maxRating(place.rating),
      userRatingCount: Number(place.userRatingCount) || 0,
      googleMapsUri: place.googleMapsUri || null,
      reviews: (place.reviews || []).slice(0, 5).map((review) => ({
        author: review.authorAttribution?.displayName || 'Google traveler',
        photoUrl: review.authorAttribution?.photoUri || null,
        rating: maxRating(review.rating),
        text: review.text?.text || '',
        published: review.relativePublishTimeDescription || '',
      })),
    });
  } catch (error) {
    console.warn('Google Places review request failed:', error);
    return res.status(502).json({ error: 'Google Business Profile reviews are temporarily unavailable.' });
  }
}
