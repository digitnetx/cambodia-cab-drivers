import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, CheckCircle2, Clock, 
  MapPin, Star, MessageSquare, Plus, ArrowRight, Route, ShieldCheck, Car, TrendingUp
} from 'lucide-react';
import { getWhatsAppBookingUrl } from '../../lib/whatsapp';

export const AdminDashboard: React.FC = () => {
  const { 
    bookings = [], messages = [], reviews = [], routes = [], vehicles = [], 
    siteSettings, adminDisplayName, navigate, updateBookingStatus, approveReview, rejectReview, resetToDefaults 
  } = useApp();

  const totalBookings = (bookings || []).length;
  const pendingBookings = (bookings || []).filter(b => b && (b.status === 'pending' || b.status === 'new'));
  const confirmedBookings = (bookings || []).filter(b => b && b.status === 'confirmed');
  const pendingReviews = (reviews || []).filter(r => r && (r.status === 'pending' || (!r.is_published && r.status !== 'rejected')));

  // Calculate estimated total revenue from confirmed & completed bookings
  const totalRevenue = (bookings || [])
    .filter(b => b && (b.status === 'confirmed' || b.status === 'completed'))
    .reduce((acc, curr) => acc + (curr.estimated_price || 0), 0);

  const recentBookings = [...(bookings || [])].slice(0, 5);
  const recentReviews = [...(reviews || [])].slice(0, 4);

  return (
    <div className="space-y-8 max-w-7xl mx-auto font-sans text-slate-800">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-red-600" /> Live Business Control Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Welcome, {adminDisplayName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            All prices, routes, bookings, vehicles, and website text are dynamically controlled from here.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => navigate('/admin/bookings')}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-red-600/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Manage Bookings
          </button>
          <button
            onClick={() => navigate('/admin/reviews')}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition border border-slate-300 cursor-pointer"
          >
            <Star className="w-4 h-4 text-red-600" /> Moderate Reviews {pendingReviews.length > 0 && `(${pendingReviews.length})`}
          </button>
          <button
            onClick={() => navigate('/admin/routes')}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition border border-slate-300 cursor-pointer"
          >
            <Route className="w-4 h-4 text-red-600" /> Edit Route Prices
          </button>
        </div>
      </div>

      {/* Pending Reviews Moderation Alert Banner */}
      {pendingReviews.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-red-700">
                {pendingReviews.length} Guest Review{pendingReviews.length > 1 ? 's' : ''} Awaiting Moderation
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                New submissions from website visitors require your approval before appearing on the homepage.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => navigate('/admin/reviews')}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>Moderate Reviews</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Pending Requests</span>
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-900">{pendingBookings.length}</span>
            <span className="text-xs text-red-600 block mt-1 font-bold">Awaiting driver confirmation</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Confirmed Rides</span>
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-900">{confirmedBookings.length}</span>
            <span className="text-xs text-slate-500 block mt-1 font-medium">Scheduled & active</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Active Fleet</span>
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-900">{vehicles.length}</span>
            <span className="text-xs text-slate-500 block mt-1 font-medium">{routes.length} Active Routes</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600">Confirmed Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-extrabold text-slate-900">${totalRevenue.toLocaleString()}</span>
            <span className="text-xs text-slate-500 block mt-1 font-medium">{totalBookings} Total Requests</span>
          </div>
        </div>

      </div>

      {/* Main Grid: Recent Bookings & Quick Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Recent Bookings Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-red-600" />
                <h3 className="font-extrabold text-base text-slate-900">Recent Booking Inquiries</h3>
              </div>
              <button 
                onClick={() => navigate('/admin/bookings')}
                className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                View All ({totalBookings}) <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {recentBookings.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-sm">
                  No booking inquiries yet.
                </div>
              ) : (
                recentBookings.map((b) => {
                  const waUrl = getWhatsAppBookingUrl(b, siteSettings);
                  return (
                    <div key={b.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 p-2 rounded-xl transition">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-red-600">{b.booking_reference}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            b.status === 'confirmed' ? 'bg-red-50 text-red-600 border border-red-200' :
                            b.status === 'pending' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            b.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {b.status}
                          </span>
                          <span className="text-xs font-bold text-slate-900">{b.customer_name}</span>
                        </div>
                        <p className="text-xs text-slate-600 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                          <span className="truncate max-w-[280px] sm:max-w-md">{b.pickup_location} → {b.destination}</span>
                        </p>
                        <div className="text-[11px] text-slate-500 flex items-center gap-3">
                          <span>📅 {b.travel_date} ({b.pickup_time})</span>
                          <span>👥 {b.passengers} Pax</span>
                          {b.estimated_price && <span className="text-slate-900 font-bold">${b.estimated_price}</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {b.status === 'pending' && (
                          <button
                            onClick={() => updateBookingStatus(b.id, 'confirmed')}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition shadow-xs cursor-pointer"
                          >
                            Confirm
                          </button>
                        )}
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition flex items-center gap-1.5 border border-slate-300"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-red-600" /> WhatsApp
                        </a>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>Showing latest {recentBookings.length} bookings</span>
            <button 
              onClick={() => navigate('/admin/bookings')}
              className="text-red-600 hover:underline font-bold cursor-pointer"
            >
              Open Full Bookings Manager →
            </button>
          </div>
        </div>

        {/* Right 1 Col: Quick Control Hub & Status */}
        <div className="space-y-6">
          
          {/* Quick Shortcuts */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-red-600" /> Admin Fast Shortcuts
            </h3>

            <div className="grid grid-cols-1 gap-2 text-xs">
              <button
                onClick={() => navigate('/admin/routes')}
                className="w-full text-left p-3 rounded-xl bg-[#FAF9F6] hover:bg-red-50/50 border border-slate-200 flex items-center justify-between transition group cursor-pointer"
              >
                <div>
                  <div className="font-bold text-slate-900 group-hover:text-red-600">Routes & Pricing</div>
                  <div className="text-[11px] text-slate-500">{routes.length} active routes with taxi rates</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 transition" />
              </button>

              <button
                onClick={() => navigate('/admin/airports')}
                className="w-full text-left p-3 rounded-xl bg-[#FAF9F6] hover:bg-red-50/50 border border-slate-200 flex items-center justify-between transition group cursor-pointer"
              >
                <div>
                  <div className="font-bold text-slate-900 group-hover:text-red-600">Airport Transfer Packages</div>
                  <div className="text-[11px] text-slate-500">PNH, SAI & KOS pickup instructions</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 transition" />
              </button>

              <button
                onClick={() => navigate('/admin/driver-profile')}
                className="w-full text-left p-3 rounded-xl bg-[#FAF9F6] hover:bg-red-50/50 border border-slate-200 flex items-center justify-between transition group cursor-pointer"
              >
                <div>
                  <div className="font-bold text-slate-900 group-hover:text-red-600">Driver & Bio Profile</div>
                  <div className="text-[11px] text-slate-500">Driver fleet experience, licenses & photos</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 transition" />
              </button>

              <button
                onClick={() => navigate('/admin/homepage')}
                className="w-full text-left p-3 rounded-xl bg-[#FAF9F6] hover:bg-red-50/50 border border-slate-200 flex items-center justify-between transition group cursor-pointer"
              >
                <div>
                  <div className="font-bold text-slate-900 group-hover:text-red-600">Homepage Layout Manager</div>
                  <div className="text-[11px] text-slate-500">Toggle sections, hero headline & CTA</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 transition" />
              </button>
            </div>
          </div>

          {/* Customer Reviews Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                <Star className="w-4 h-4 text-red-600 fill-red-600" /> Guest Reviews Moderation
              </h3>
              <button 
                onClick={() => navigate('/admin/reviews')}
                className="text-[11px] text-red-600 hover:underline font-bold cursor-pointer"
              >
                Open Moderation ({reviews.length})
              </button>
            </div>

            <div className="space-y-2.5">
              {recentReviews.map((r) => {
                const isPending = r.status === 'pending' || (!r.is_published && r.status !== 'rejected');
                const isApproved = (r.status === 'approved' || r.is_published) && r.status !== 'rejected' && r.status !== 'pending';

                return (
                  <div key={r.id} className="p-3 bg-[#FAF9F6] rounded-xl border border-slate-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">{r.customer_name}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          isPending ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          isApproved ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {isPending ? 'Pending' : isApproved ? 'Approved' : 'Rejected'}
                        </span>
                      </div>
                      <span className="text-red-600">{'★'.repeat(r.rating || 5)}</span>
                    </div>

                    <p className="text-slate-600 line-clamp-2 text-[11px] italic">"{r.review}"</p>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[10px] text-slate-500">
                      <span>{r.country}</span>
                      <div className="flex items-center gap-1.5">
                        {!isApproved && (
                          <button
                            onClick={() => approveReview(r.id)}
                            className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded text-[10px] transition cursor-pointer"
                          >
                            Approve
                          </button>
                        )}
                        {r.status !== 'rejected' && (
                          <button
                            onClick={() => rejectReview(r.id, 'Declined from Dashboard')}
                            className="px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded text-[10px] transition cursor-pointer"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reset / Demo Control */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center shadow-xs">
            <p className="text-[11px] text-slate-500 mb-2">
              Need to test clean defaults?
            </p>
            <button
              onClick={() => {
                if (confirm('Reset database to clean initial state?')) {
                  resetToDefaults();
                }
              }}
              className="text-xs text-red-600 hover:text-red-700 font-bold underline cursor-pointer"
            >
              Reset Database to Initial Defaults
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
