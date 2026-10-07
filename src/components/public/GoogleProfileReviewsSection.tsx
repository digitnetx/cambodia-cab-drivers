import React from 'react';
import { ArrowUpRight, MapPin, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';

type LiveGoogleReview = {
  author: string;
  photoUrl: string | null;
  rating: number;
  text: string;
  published: string;
};

type LiveGoogleProfile = {
  name: string;
  rating: number;
  userRatingCount: number;
  googleMapsUri: string | null;
  reviews: LiveGoogleReview[];
};

const RatingStars: React.FC<{ rating: number }> = ({ rating }) => (
  <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
    {Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${index < Math.round(rating) ? 'fill-[#fbbc04] text-[#fbbc04]' : 'text-slate-200'}`}
      />
    ))}
  </div>
);

export const GoogleProfileReviewsSection: React.FC = () => {
  const { reviews = [], siteSettings } = useApp();
  const [liveProfile, setLiveProfile] = React.useState<LiveGoogleProfile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const googleReviews = reviews.filter((review) =>
    review &&
    review.source === 'google' &&
    (review.is_published || review.status === 'approved') &&
    review.status !== 'rejected' &&
    review.status !== 'pending',
  );
  const fallbackRating = googleReviews.length
    ? googleReviews.reduce((total, review) => total + Math.max(0, Math.min(5, review.rating || 0)), 0) / googleReviews.length
    : null;
  const reviewUrl = liveProfile?.googleMapsUri || siteSettings.google_business_url || siteSettings.google_maps_url;
  const displayedReviews: LiveGoogleReview[] = liveProfile?.reviews?.length
    ? liveProfile.reviews
    : googleReviews.map((review) => ({
        author: review.customer_name,
        photoUrl: review.image_url || null,
        rating: review.rating,
        text: review.review,
        published: review.country || 'Google traveler',
      }));
  const displayedRating = liveProfile?.rating || fallbackRating;
  const displayedCount = liveProfile?.userRatingCount || googleReviews.length;

  React.useEffect(() => {
    let mounted = true;
    const loadLiveReviews = async () => {
      try {
        const response = await fetch('/api/google-reviews');
        if (!response.ok) return;
        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) return;
        const profile = await response.json() as LiveGoogleProfile;
        if (mounted && profile?.reviews) setLiveProfile(profile);
      } catch {
        // The public section safely falls back to approved dashboard reviews.
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    loadLiveReviews();
    return () => { mounted = false; };
  }, []);

  return (
    <section className="border-y border-slate-200 bg-white py-16 text-slate-900 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700">
            <MapPin className="h-3.5 w-3.5" />
            Google Business Profile
          </div>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">What travelers say about Cambodia Taxi Cab</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
            Read feedback from travelers who booked airport pickups, private transfers, and tours with our driver team.
          </p>

          {displayedRating !== null && (
            <div className="mt-6 flex flex-col items-center gap-2">
              <RatingStars rating={displayedRating} />
              <p className="text-sm font-semibold text-slate-700">
                {displayedRating.toFixed(1)} out of 5 from {displayedCount} Google {displayedCount === 1 ? 'review' : 'reviews'}
              </p>
              {liveProfile && <p className="text-xs text-slate-500">Live from Google Business Profile</p>}
            </div>
          )}
        </div>

        {displayedReviews.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {displayedReviews.slice(0, 3).map((review, index) => (
              <article key={`${review.author}-${index}`} className="flex min-h-72 flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {review.photoUrl ? (
                      <img src={review.photoUrl} alt="" className="h-11 w-11 rounded-full object-cover" loading="lazy" decoding="async" />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-xs font-extrabold text-blue-700">
                        {review.author.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-950">{review.author}</h3>
                      <p className="text-xs text-slate-500">{review.published || 'Google traveler'}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-blue-700">Google</span>
                </div>

                <div className="mt-5">
                  <RatingStars rating={review.rating} />
                  <p className="mt-4 line-clamp-5 text-sm leading-relaxed text-slate-700">{review.text}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center sm:p-8">
            <p className="text-sm leading-relaxed text-slate-600">
              {isLoading ? 'Loading traveler feedback…' : 'Visit our Google Business Profile to read the latest traveler feedback and share your experience.'}
            </p>
          </div>
        )}

        {reviewUrl && (
          <div className="mt-8 text-center">
            <a
              href={reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#1a73e8] px-5 py-3 text-sm font-extrabold text-white shadow-md shadow-blue-600/20 transition hover:bg-[#1558b0]"
            >
              Read or write a Google review
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
};
