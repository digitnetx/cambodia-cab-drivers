import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Review } from '../../types';
import { 
  Star, Trash2, Eye, EyeOff, CheckCircle2, XCircle, Clock, AlertTriangle, 
  Search, Plus, Filter, MessageSquare, ShieldCheck, ThumbsUp, ThumbsDown,
  Globe, Calendar, MapPin, Sparkles, Edit3, X, Check, ArrowRight
} from 'lucide-react';
import { formatDate } from '../../lib/utils';

export const AdminReviews: React.FC = () => {
  const { 
    reviews = [], 
    saveReview, 
    approveReview, 
    rejectReview, 
    toggleReviewPublish, 
    deleteReview, 
    siteSettings 
  } = useApp();

  // Filters & State
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  // Modals
  const [readingReview, setReadingReview] = useState<Review | null>(null);
  const [rejectingReview, setRejectingReview] = useState<Review | null>(null);
  const [rejectionReason, setRejectionReason] = useState('Duplicate or unverified submission');
  const [editingReview, setEditingReview] = useState<Partial<Review> | null>(null);

  // Computed counts
  const totalCount = reviews.length;
  const pendingReviews = reviews.filter(r => r.status === 'pending' || (!r.is_published && r.status !== 'rejected'));
  const approvedReviews = reviews.filter(r => (r.status === 'approved' || r.is_published) && r.status !== 'rejected' && r.status !== 'pending');
  const rejectedReviews = reviews.filter(r => r.status === 'rejected' || (r.is_published === false && r.status === 'rejected'));

  const pendingCount = pendingReviews.length;
  const approvedCount = approvedReviews.length;
  const rejectedCount = rejectedReviews.length;

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + (curr.rating || 5), 0) / reviews.length).toFixed(1)
    : '5.0';

  // Filtered reviews list
  const filteredReviews = reviews.filter((r) => {
    // Tab filter
    if (activeTab === 'pending') {
      const isPending = r.status === 'pending' || (!r.is_published && r.status !== 'rejected');
      if (!isPending) return false;
    } else if (activeTab === 'approved') {
      const isApproved = (r.status === 'approved' || r.is_published) && r.status !== 'rejected' && r.status !== 'pending';
      if (!isApproved) return false;
    } else if (activeTab === 'rejected') {
      const isRejected = r.status === 'rejected';
      if (!isRejected) return false;
    }

    // Rating filter
    if (ratingFilter !== 'all' && r.rating !== ratingFilter) {
      return false;
    }

    // Source filter
    if (sourceFilter !== 'all' && r.source !== sourceFilter) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (r.customer_name || '').toLowerCase().includes(q);
      const matchCountry = (r.country || '').toLowerCase().includes(q);
      const matchReview = (r.review || '').toLowerCase().includes(q);
      const matchTrip = (r.trip_type || '').toLowerCase().includes(q);
      if (!matchName && !matchCountry && !matchReview && !matchTrip) {
        return false;
      }
    }

    return true;
  });

  const handleApprove = (id: string) => {
    approveReview(id);
    if (readingReview && readingReview.id === id) {
      setReadingReview({ ...readingReview, status: 'approved', is_published: true });
    }
  };

  const handleConfirmReject = () => {
    if (rejectingReview) {
      rejectReview(rejectingReview.id, rejectionReason);
      if (readingReview && readingReview.id === rejectingReview.id) {
        setReadingReview({ ...readingReview, status: 'rejected', is_published: false, rejection_reason: rejectionReason });
      }
      setRejectingReview(null);
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview) return;
    await saveReview(editingReview);
    setEditingReview(null);
  };

  const getStatusBadge = (r: Review) => {
    if (r.status === 'pending' || (!r.is_published && r.status !== 'rejected')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>Pending Approval</span>
        </span>
      );
    }
    if (r.status === 'approved' || r.is_published) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Approved & Live</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-200">
        <XCircle className="w-3.5 h-3.5" />
        <span>Rejected / Hidden</span>
      </span>
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans text-slate-800">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-red-600" />
            <span>Customer Feedback Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Guest Reviews Moderation
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Read, approve, reject, or edit reviews submitted by website visitors before they appear live on the public homepage.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setEditingReview({
              customer_name: '',
              country: 'United States 🇺🇸',
              trip_type: 'Phnom Penh to Siem Reap Transfer',
              rating: 5,
              review: '',
              source: 'google',
              status: 'approved',
              is_published: true,
              is_featured: false,
            })}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-red-600/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Verified Review</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* Pending Card */}
        <div 
          onClick={() => setActiveTab('pending')}
          className={`p-5 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
            activeTab === 'pending'
              ? 'bg-white border-red-500 ring-2 ring-red-500/20 shadow-sm'
              : 'bg-white border-slate-200 hover:border-red-400 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Pending Moderation</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-amber-600">{pendingCount}</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              {pendingCount > 0 ? 'Requires your decision' : 'All reviews moderated'}
            </span>
          </div>
        </div>

        {/* Approved Card */}
        <div 
          onClick={() => setActiveTab('approved')}
          className={`p-5 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
            activeTab === 'approved'
              ? 'bg-white border-red-500 ring-2 ring-red-500/20 shadow-sm'
              : 'bg-white border-slate-200 hover:border-red-400 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Live on Homepage</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900">{approvedCount}</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">Visible to all travelers</span>
          </div>
        </div>

        {/* Rejected Card */}
        <div 
          onClick={() => setActiveTab('rejected')}
          className={`p-5 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
            activeTab === 'rejected'
              ? 'bg-white border-red-500 ring-2 ring-red-500/20 shadow-sm'
              : 'bg-white border-slate-200 hover:border-red-400 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Rejected / Hidden</span>
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-700">{rejectedCount}</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">Withheld from homepage</span>
          </div>
        </div>

        {/* Average Rating Card */}
        <div 
          onClick={() => setActiveTab('all')}
          className={`p-5 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
            activeTab === 'all'
              ? 'bg-white border-red-500 ring-2 ring-red-500/20 shadow-sm'
              : 'bg-white border-slate-200 hover:border-red-400 shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Average Score</span>
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Star className="w-4 h-4 fill-red-600 text-red-600" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-slate-900">{averageRating} ★</span>
            <span className="text-[11px] text-slate-500 block mt-0.5">{totalCount} Total Database Reviews</span>
          </div>
        </div>

      </div>

      {/* Pending Reviews Banner Alert if any pending */}
      {pendingCount > 0 && activeTab !== 'pending' && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                {pendingCount} New Review{pendingCount > 1 ? 's' : ''} Awaiting Approval
              </h4>
              <p className="text-xs text-amber-700">
                Public visitors have submitted reviews that need to be approved before displaying on the homepage.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('pending')}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition shrink-0 cursor-pointer shadow-xs"
          >
            Review Pending Submissions ({pendingCount})
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'all'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>All Reviews</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/10">{totalCount}</span>
          </button>

          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Approval</span>
            {pendingCount > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === 'pending' ? 'bg-black/20 text-white font-black' : 'bg-amber-100 text-amber-800 font-bold'
              }`}>
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('approved')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'approved'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approved & Live</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/10">{approvedCount}</span>
          </button>

          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${
              activeTab === 'rejected'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Rejected / Hidden</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-black/10">{rejectedCount}</span>
          </button>
        </div>

        {/* Search & Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search traveler name, country, route, or text..."
              className="w-full bg-slate-50 border border-slate-300 focus:border-red-500 focus:bg-white text-slate-900 placeholder-slate-400 rounded-xl pl-9 pr-4 py-2 text-xs outline-none transition"
            />
          </div>

          <div>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 focus:border-red-500 focus:bg-white text-slate-900 rounded-xl px-3 py-2 text-xs outline-none transition cursor-pointer"
            >
              <option value="all">All Star Ratings</option>
              <option value="5">⭐⭐⭐⭐⭐ (5 Stars Only)</option>
              <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
              <option value="3">⭐⭐⭐ (3 Stars)</option>
              <option value="2">⭐⭐ (2 Stars)</option>
              <option value="1">⭐ (1 Star)</option>
            </select>
          </div>

          <div>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 focus:border-red-500 focus:bg-white text-slate-900 rounded-xl px-3 py-2 text-xs outline-none transition cursor-pointer"
            >
              <option value="all">All Sources</option>
              <option value="website">Website Direct Submissions</option>
              <option value="google">Google Maps Reviews</option>
              <option value="tripadvisor">TripAdvisor</option>
            </select>
          </div>
        </div>

      </div>

      {/* Reviews Grid */}
      {filteredReviews.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-xs">
          <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
            <Star className="w-7 h-7 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No reviews matching current filter</h3>
          <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
            {activeTab === 'pending'
              ? 'Great news! There are currently no pending reviews waiting for moderation.'
              : 'Try clearing your search query or changing filter parameters.'}
          </p>
          {activeTab !== 'all' && (
            <button
              onClick={() => { setActiveTab('all'); setSearchQuery(''); setRatingFilter('all'); setSourceFilter('all'); }}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition cursor-pointer shadow-xs"
            >
              View All Reviews
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((review) => {
            const isPending = review.status === 'pending' || (!review.is_published && review.status !== 'rejected');
            const isApproved = (review.status === 'approved' || review.is_published) && review.status !== 'rejected' && review.status !== 'pending';
            const isRejected = review.status === 'rejected';

            return (
              <div
                key={review.id}
                className={`bg-white border rounded-2xl p-6 flex flex-col justify-between shadow-xs transition relative overflow-hidden ${
                  isPending
                    ? 'border-amber-300 ring-1 ring-amber-200'
                    : isRejected
                    ? 'border-slate-200 opacity-70 bg-slate-50/50'
                    : 'border-slate-200 hover:border-red-300'
                }`}
              >
                <div>
                  {/* Card Header: Author, Date, Status */}
                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-slate-900">{review.customer_name}</h3>
                        {review.is_featured && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-50 border border-red-200 text-red-600 text-[10px] font-extrabold rounded-md">
                            <Sparkles className="w-3 h-3 text-red-600" /> Featured
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
                        <span>{review.country || 'International'}</span>
                        <span>•</span>
                        <span>{review.trip_type || 'Private Route'}</span>
                        <span>•</span>
                        <span>{formatDate(review.created_at)}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      {getStatusBadge(review)}
                      <div className="flex items-center gap-1 text-red-600">
                        {[...Array(review.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-red-600 text-red-600" />
                        ))}
                        <span className="text-xs font-bold text-slate-900 ml-1">{review.rating}.0</span>
                      </div>
                    </div>
                  </div>

                  {/* Review Text Body */}
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-slate-700 leading-relaxed italic bg-[#FAF9F6] p-4 rounded-xl border border-slate-200">
                      "{review.review}"
                    </p>

                    {/* Source and Rejection reason banner */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Globe className="w-3 h-3 text-red-600" />
                        <span>Source: {review.source === 'website' ? 'Website Submission' : review.source === 'google' ? 'Google Maps' : 'Direct'}</span>
                      </span>

                      {review.rejection_reason && isRejected && (
                        <span className="text-red-600 font-medium truncate max-w-[200px]">
                          Note: {review.rejection_reason}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Actions: READ, APPROVE, REJECT, EDIT, DELETE */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  
                  {/* Left Action Buttons: READ MODAL */}
                  <button
                    onClick={() => setReadingReview(review)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-600" />
                    <span>Read Details</span>
                  </button>

                  {/* Right Action Cluster: APPROVE / REJECT / FEATURE / EDIT / DELETE */}
                  <div className="flex items-center gap-2 flex-wrap">
                    
                    {/* Approve Button */}
                    {!isApproved && (
                      <button
                        onClick={() => handleApprove(review.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                        title="Approve and display on public homepage"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Approve</span>
                      </button>
                    )}

                    {/* Reject Button */}
                    {!isRejected && (
                      <button
                        onClick={() => {
                          setRejectingReview(review);
                          setRejectionReason('Duplicate or unverified submission');
                        }}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
                        title="Reject and hide from homepage"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    )}

                    {/* Feature Pin Toggle */}
                    <button
                      onClick={() => saveReview({ id: review.id, is_featured: !review.is_featured })}
                      className={`p-1.5 rounded-xl border transition cursor-pointer ${
                        review.is_featured
                          ? 'bg-red-50 border-red-200 text-red-600'
                          : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-red-600'
                      }`}
                      title={review.is_featured ? 'Remove from Featured homepage spots' : 'Pin as Featured on homepage'}
                    >
                      <Star className={`w-3.5 h-3.5 ${review.is_featured ? 'fill-red-600 text-red-600' : ''}`} />
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => setEditingReview(review)}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-xl transition cursor-pointer"
                      title="Edit review content"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => {
                        if (confirm(`Permanently delete review by ${review.customer_name}?`)) {
                          deleteReview(review.id);
                        }
                      }}
                      className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl transition cursor-pointer"
                      title="Delete review"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 1. READ / INSPECT REVIEW MODAL */}
      {readingReview && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6 text-slate-800">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-bold text-slate-900">Review Details & Moderation</h3>
              </div>
              <button
                onClick={() => setReadingReview(null)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Author info card */}
            <div className="bg-[#FAF9F6] p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-slate-900">{readingReview.customer_name}</h4>
                  <p className="text-xs text-slate-600">{readingReview.country || 'International Traveler'}</p>
                </div>
                <div>{getStatusBadge(readingReview)}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-xs text-slate-700">
                <div>
                  <span className="font-bold text-slate-900">Route:</span> {readingReview.trip_type || 'Cambodia Transfer'}
                </div>
                <div>
                  <span className="font-bold text-slate-900">Date:</span> {formatDate(readingReview.created_at)}
                </div>
                <div>
                  <span className="font-bold text-slate-900">Source:</span> {readingReview.source === 'website' ? 'Website Form Submission' : 'Google Review'}
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-slate-900">Rating:</span>
                  <span className="text-red-600 font-bold">{'★'.repeat(readingReview.rating || 5)} ({readingReview.rating}/5)</span>
                </div>
              </div>
            </div>

            {/* Full review text */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Submitted Feedback / Testimonial:
              </label>
              <div className="p-4 bg-[#FAF9F6] border border-slate-200 rounded-xl text-sm leading-relaxed text-slate-800 italic">
                "{readingReview.review}"
              </div>
            </div>

            {readingReview.rejection_reason && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                <span className="font-bold">Rejection Note:</span> {readingReview.rejection_reason}
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setReadingReview(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer border border-slate-200"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                {readingReview.status !== 'approved' && (
                  <button
                    onClick={() => {
                      handleApprove(readingReview.id);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Approve for Homepage</span>
                  </button>
                )}

                {readingReview.status !== 'rejected' && (
                  <button
                    onClick={() => {
                      setRejectingReview(readingReview);
                      setRejectionReason('Duplicate or unverified submission');
                    }}
                    className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    <span>Reject Review</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. REJECTION REASON CONFIRMATION MODAL */}
      {rejectingReview && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-red-200 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-5 text-slate-800">
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Reject Review Submission</h3>
                <p className="text-xs text-slate-600">This review will NOT be shown on the homepage.</p>
              </div>
            </div>

            <div className="p-3 bg-[#FAF9F6] border border-slate-200 rounded-xl text-xs space-y-1">
              <span className="font-bold text-slate-900">{rejectingReview.customer_name}</span>
              <p className="text-slate-700 italic line-clamp-2">"{rejectingReview.review}"</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Select Reason for Rejection:
              </label>
              <select
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 focus:border-red-500 focus:bg-white text-slate-900 rounded-xl px-3 py-2 text-xs outline-none transition cursor-pointer"
              >
                <option value="Duplicate or unverified submission">Duplicate or unverified submission</option>
                <option value="Spam / Inappropriate or offensive content">Spam / Inappropriate or offensive content</option>
                <option value="Pricing / Booking dispute handled offline">Pricing / Booking dispute handled offline</option>
                <option value="Mistaken driver or incorrect location">Mistaken driver or incorrect location</option>
                <option value="Admin discretion">Admin discretion</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setRejectingReview(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer border border-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-red-600/20 flex items-center gap-1.5 cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Confirm Rejection</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 3. ADD / EDIT REVIEW MODAL */}
      {editingReview && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6 text-slate-800">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-bold text-slate-900">
                  {editingReview.id ? 'Edit Review' : 'Create Verified Review'}
                </h3>
              </div>
              <button
                onClick={() => setEditingReview(null)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Customer / Traveler Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingReview.customer_name || ''}
                    onChange={(e) => setEditingReview({ ...editingReview, customer_name: e.target.value })}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full bg-slate-50 border border-slate-300 focus:border-red-500 focus:bg-white text-slate-900 rounded-xl px-3.5 py-2 text-xs outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Country / City of Origin
                  </label>
                  <input
                    type="text"
                    value={editingReview.country || ''}
                    onChange={(e) => setEditingReview({ ...editingReview, country: e.target.value })}
                    placeholder="e.g. United Kingdom 🇬🇧"
                    className="w-full bg-slate-50 border border-slate-300 focus:border-red-500 focus:bg-white text-slate-900 rounded-xl px-3.5 py-2 text-xs outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Trip / Route
                  </label>
                  <input
                    type="text"
                    value={editingReview.trip_type || ''}
                    onChange={(e) => setEditingReview({ ...editingReview, trip_type: e.target.value })}
                    placeholder="e.g. Phnom Penh to Siem Reap"
                    className="w-full bg-slate-50 border border-slate-300 focus:border-red-500 focus:bg-white text-slate-900 rounded-xl px-3.5 py-2 text-xs outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Star Rating (1 - 5)
                  </label>
                  <select
                    value={editingReview.rating || 5}
                    onChange={(e) => setEditingReview({ ...editingReview, rating: Number(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-red-500 focus:bg-white text-slate-900 rounded-xl px-3.5 py-2 text-xs outline-none transition cursor-pointer"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5.0 - Excellent)</option>
                    <option value={4}>⭐⭐⭐⭐ (4.0 - Very Good)</option>
                    <option value={3}>⭐⭐⭐ (3.0 - Average)</option>
                    <option value={2}>⭐⭐ (2.0 - Poor)</option>
                    <option value={1}>⭐ (1.0 - Very Poor)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Review Text / Feedback *
                </label>
                <textarea
                  required
                  rows={4}
                  value={editingReview.review || ''}
                  onChange={(e) => setEditingReview({ ...editingReview, review: e.target.value })}
                  placeholder="Enter the full review feedback..."
                  className="w-full bg-slate-50 border border-slate-300 focus:border-red-500 focus:bg-white text-slate-900 rounded-xl p-3 text-xs outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Moderation Status
                  </label>
                  <select
                    value={editingReview.status || (editingReview.is_published ? 'approved' : 'pending')}
                    onChange={(e) => {
                      const st = e.target.value as 'approved' | 'pending' | 'rejected';
                      setEditingReview({
                        ...editingReview,
                        status: st,
                        is_published: st === 'approved',
                      });
                    }}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-red-500 focus:bg-white text-slate-900 rounded-xl px-3.5 py-2 text-xs outline-none transition cursor-pointer"
                  >
                    <option value="approved">Approved & Published (Live on Homepage)</option>
                    <option value="pending">Pending Moderation</option>
                    <option value="rejected">Rejected / Hidden</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Review Source
                  </label>
                  <select
                    value={editingReview.source || 'google'}
                    onChange={(e) => setEditingReview({ ...editingReview, source: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-red-500 focus:bg-white text-slate-900 rounded-xl px-3.5 py-2 text-xs outline-none transition cursor-pointer"
                  >
                    <option value="google">Google Maps Review</option>
                    <option value="website">Website Direct Submission</option>
                    <option value="tripadvisor">TripAdvisor</option>
                    <option value="direct">Direct WhatsApp Feedback</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="modal-featured"
                  checked={editingReview.is_featured || false}
                  onChange={(e) => setEditingReview({ ...editingReview, is_featured: e.target.checked })}
                  className="rounded bg-slate-50 border-slate-300 text-red-600 focus:ring-red-500"
                />
                <label htmlFor="modal-featured" className="text-xs font-medium text-slate-700 cursor-pointer">
                  Feature this review prominently in top spots on homepage
                </label>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingReview(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer border border-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-red-600/20 cursor-pointer"
                >
                  Save Review
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

