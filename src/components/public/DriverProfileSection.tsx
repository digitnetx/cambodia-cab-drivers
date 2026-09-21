import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Award, MessageSquare, Send, CheckCircle2, Phone, Star } from 'lucide-react';
import { getWhatsAppGeneralUrl, getTelegramUrl } from '../../lib/whatsapp';
import { featuredImageSrc } from '../../lib/images';

export const DriverProfileSection: React.FC = () => {
  const { driverProfile, siteSettings, t } = useApp();
  const [photoError, setPhotoError] = React.useState(false);

  const profileImage = featuredImageSrc({ featured_image: driverProfile.profile_photo_url, featured_image_data: driverProfile.profile_photo_data, featured_image_mime: driverProfile.profile_photo_mime });
  const photoSrc = (!photoError && profileImage)
    ? profileImage
    : (!photoError ? '/sareth.jpeg' : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop');

  React.useEffect(() => {
    setPhotoError(false);
  }, [profileImage]);

  return (
    <section id="meet-driver" className="py-20 bg-white text-slate-900 relative overflow-hidden border-b border-slate-200">
      {/* Background Accent */}
      <div className="absolute -bottom-20 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Driver Photo & Trust Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-slate-200 shadow-xl bg-slate-900 text-white">
              <img
                src={photoSrc}
                alt={`${driverProfile.driver_name} - Professional Private Driver in Cambodia`}
                className="w-full h-[460px] object-cover object-center"
                referrerPolicy="no-referrer"
                onError={() => setPhotoError(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              
              {/* Overlay Driver Name */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-1 text-red-500 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-red-500 text-red-500" />
                  ))}
                  <span className="text-white text-xs font-bold ml-2">
                    {driverProfile.rating} ({driverProfile.trips_completed}+ Trips)
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white font-sans">
                  {driverProfile.driver_name}
                </h3>
                <p className="text-xs text-slate-300">
                  {driverProfile.title}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-red-600/30 text-red-300 border border-red-500/40 text-[11px] font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    Available For Booking
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white/10 text-white border border-white/20 text-[11px] font-bold">
                    English Speaking
                  </span>
                </div>
              </div>
            </div>

            {/* Float badge */}
            <div className="absolute -top-4 -right-4 bg-red-600 text-white px-4 py-2 rounded-2xl font-black text-xs shadow-xl border-2 border-white hidden sm:flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>Recommended Local Driver</span>
            </div>
          </div>

          {/* Bio & Details */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
              <span>{driverProfile.greeting || t.driver.badge}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-sans tracking-tight leading-tight">
              Cambodia Taxi Cab — Trusted Private Transport in Cambodia
            </h2>

            <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
              <p>
                {driverProfile.bio_paragraph_1 || t.driver.bio1}
              </p>
              <p>
                {driverProfile.bio_paragraph_2 || t.driver.bio2}
              </p>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {driverProfile.qualifications?.map((qual, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 shadow-2xs">
                  <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 border border-red-100 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 font-sans">{qual}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Verified Experience & Quality</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href={getWhatsAppGeneralUrl(`Hello, I'd like to ask a few questions about booking private driver service for my Cambodia trip.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm rounded-xl transition flex items-center gap-2 shadow-lg shadow-red-600/20"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Driver Team</span>
              </a>

              <a
                href={getTelegramUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-xl border border-slate-200 transition flex items-center gap-2"
              >
                <Send className="w-4 h-4 text-red-600" />
                <span>Telegram</span>
              </a>

              <a
                href={`tel:${siteSettings.phone.replace(/[^0-9+]/g, '')}`}
                className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-xl border border-slate-200 transition flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-red-600" />
                <span>{siteSettings.phone}</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
