import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Star, ShieldCheck, CheckCircle2, Quote, ArrowRight, MessageSquare, Send, ThumbsUp, Sparkles, Globe } from 'lucide-react';
import { getWhatsAppGeneralUrl } from '../../lib/whatsapp';

export const GoogleReviewsSection: React.FC = () => {
  const { reviews = [], saveReview, showToast, siteSettings, t, navigate } = useApp();

  // Only display verified, approved and published reviews on public page
  const publishedReviews = (reviews || []).filter(r => 
    r && 
    (r.is_published === true || r.status === 'approved') && 
    r.status !== 'rejected' && 
    r.status !== 'pending'
  );

  // Review submission state
  const [authorName, setAuthorName] = useState('');
  const [authorCountry, setAuthorCountry] = useState('');
  const [tripType, setTripType] = useState('Phnom Penh to Siem Reap Transfer');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim()) {
      showToast('Please enter your name', 'error');
      return;
    }
    if (!reviewText.trim()) {
      showToast('Please share a few words about your journey', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await saveReview({
        customer_name: authorName.trim(),
        country: authorCountry.trim() || 'International Traveler',
        trip_type: tripType,
        rating: rating,
        review: reviewText.trim(),
        source: 'website',
        status: 'pending',
        is_published: false,
        is_featured: false,
      });

      setSubmittedSuccess(true);
      setAuthorName('');
      setAuthorCountry('');
      setReviewText('');
      setRating(5);
    } catch {
      showToast('Failed to submit review. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingLabel = (val: number) => {
    switch (val) {
      case 5: return '5.0 - Outstanding Experience!';
      case 4: return '4.0 - Very Good & Reliable';
      case 3: return '3.0 - Satisfactory Trip';
      case 2: return '2.0 - Needs Improvement';
      case 1: return '1.0 - Poor Experience';
      default: return '5.0 - Outstanding Experience!';
    }
  };

  return (
    <section id="reviews" className="py-20 bg-[#FAF9F6] text-slate-900 relative border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Header with Google Reviews Badge */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-wider mb-4">
            <Star className="w-4 h-4 fill-red-600 text-red-600" />
            <span>{t.reviews.badge}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 font-sans tracking-tight">
            {t.reviews.title}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {t.reviews.subtitle}
          </p>

          {/* Rating Summary Bar */}
          <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-1.5">
              <div className="flex text-red-600">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-red-600 text-red-600" />
                ))}
              </div>
              <span className="font-extrabold text-lg text-slate-900 ml-1">5.0 / 5.0</span>
            </div>
            <div className="h-4 w-px bg-slate-300" />
            <div className="text-xs text-slate-600 font-medium">
              <span className="font-bold text-slate-900">420+</span> Verified International Travelers
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {publishedReviews.slice(0, 6).map((rev) => (
            <div
              key={rev.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between hover:border-red-500/60 transition"
            >
              <div>
                {/* Rating stars */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-red-600">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-red-600 text-red-600" />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    Verified Trip
                  </span>
                </div>

                <p className="text-sm text-slate-800 leading-relaxed italic relative">
                  "{rev.review}"
                </p>
              </div>

              {/* Author Details */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 border border-red-200 flex items-center justify-center font-bold text-xs uppercase">
                    {rev.customer_name.substring(0, 2)}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <span>{rev.customer_name}</span>
                      <CheckCircle2 className="w-3 h-3 text-red-600" />
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {rev.country || 'International Traveler'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* PUBLIC REVIEW SUBMISSION FORM / INPUT BOX */}
        <div id="submit-review-box" className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 mb-12 shadow-xs relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            {submittedSuccess ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Thank You for Your Review!</h3>
                <p className="text-sm text-slate-600 max-w-lg mx-auto">
                  Your feedback has been received and will be displayed on the homepage once approved. Thank you for supporting local drivers in Cambodia!
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSubmittedSuccess(false)}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-md shadow-red-600/20"
                  >
                    Submit Another Review
                  </button>
                  {(siteSettings.google_business_url || siteSettings.google_maps_url) && (
                    <a
                      href={siteSettings.google_business_url || siteSettings.google_maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold rounded-xl transition flex items-center gap-2"
                    >
                      <Star className="w-3.5 h-3.5 fill-red-600 text-red-600" />
                      <span>Also Rate on Google Maps</span>
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-wider mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-red-600" />
                      <span>Share Your Experience</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-950 font-sans">
                      Traveled with Us? Leave a Review
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                      Share your experience with future travelers. Website reviews are moderated before publication.
                    </p>
                  </div>

                  {siteSettings.google_maps_url && (
                    <a
                      href={siteSettings.google_maps_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 transition shrink-0"
                    >
                      <Star className="w-3.5 h-3.5 fill-red-600 text-red-600" />
                      <span>View Our Google Business Profile</span>
                    </a>
                  )}
                </div>

                <form onSubmit={handleSubmitReview} className="space-y-6">
                  {/* Rating Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Your Overall Rating
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((starVal) => (
                          <button
                            key={starVal}
                            type="button"
                            onClick={() => setRating(starVal)}
                            onMouseEnter={() => setHoverRating(starVal)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 rounded-lg transition hover:scale-110 focus:outline-none cursor-pointer"
                            aria-label={`Rate ${starVal} stars`}
                          >
                            <Star
                              className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                                (hoverRating || rating) >= starVal
                                  ? 'fill-red-600 text-red-600'
                                  : 'text-slate-200 hover:text-red-400'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg border border-red-100">
                        {getRatingLabel(hoverRating || rating)}
                      </span>
                    </div>
                  </div>

                  {/* Name, Country, and Trip Type Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Your Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        placeholder="e.g. David Miller"
                        className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-red-500 text-slate-900 placeholder-slate-400 rounded-xl px-4 py-2.5 text-sm outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Country / City of Origin
                      </label>
                      <input
                        type="text"
                        value={authorCountry}
                        onChange={(e) => setAuthorCountry(e.target.value)}
                        placeholder="e.g. Australia, London, USA"
                        className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-red-500 text-slate-900 placeholder-slate-400 rounded-xl px-4 py-2.5 text-sm outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Trip or Route Taken
                      </label>
                      <select
                        value={tripType}
                        onChange={(e) => setTripType(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-red-500 text-slate-900 rounded-xl px-4 py-2.5 text-sm outline-none transition"
                      >
                        <option value="Phnom Penh to Siem Reap Transfer">Phnom Penh to Siem Reap Transfer</option>
                        <option value="Siem Reap to Phnom Penh Transfer">Siem Reap to Phnom Penh Transfer</option>
                        <option value="Phnom Penh Airport Transfer">Phnom Penh Airport Transfer</option>
                        <option value="Siem Reap Angkor Airport Transfer">Siem Reap Angkor Airport Transfer</option>
                        <option value="Angkor Wat Private Day Tour">Angkor Wat Private Day Tour</option>
                        <option value="Phnom Penh to Sihanoukville Expressway">Phnom Penh to Sihanoukville Expressway</option>
                        <option value="Phnom Penh to Kampot / Kep">Phnom Penh to Kampot / Kep</option>
                        <option value="Multi-Day Private Driver Tour">Multi-Day Private Driver Tour</option>
                        <option value="Other Custom Route">Other Custom Route</option>
                      </select>
                    </div>
                  </div>

                  {/* Review Text Input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Your Review & Experience <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Share your experience: punctuality, driving safety, cleanliness of the vehicle, communication, or local tips our drivers provided..."
                      className="w-full bg-slate-50 border border-slate-300 focus:bg-white focus:border-red-500 text-slate-900 placeholder-slate-400 rounded-xl p-4 text-sm outline-none transition resize-y"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    <p className="text-xs text-slate-600 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-red-600 shrink-0" />
                      <span>Verified reviews: Submissions are moderated before displaying publicly.</span>
                    </p>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-extrabold text-sm rounded-xl transition shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? 'Submitting...' : 'Post Review'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Conversion Bar underneath reviews */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 font-sans">
              Ready for a smooth, stress-free ride in Cambodia?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Fixed transparent pricing. No deposit required. Fast WhatsApp confirmation.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/book')}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm rounded-xl transition shadow-lg shadow-red-600/25 flex items-center gap-2 cursor-pointer"
            >
              <span>{t.reviews.bookDirect}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href={getWhatsAppGeneralUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs sm:text-sm rounded-xl transition border border-slate-200 flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-red-600" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
