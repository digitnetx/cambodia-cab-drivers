import React from 'react';
import { useApp } from '../../../context/AppContext';
import { Breadcrumbs } from '../../layout/Breadcrumbs';
import { TourCard } from '../TourCard';
import { DestinationCard } from '../DestinationCard';
import { getWhatsAppGeneralUrl } from '../../../lib/whatsapp';
import { MapPin, CheckCircle2, MessageSquare, ArrowRight, Compass, Car } from 'lucide-react';

export const DestinationDetailPage: React.FC<{ slug: string }> = ({ slug }) => {
  const { destinations = [], tours = [], navigate } = useApp();

  const destination = (destinations || []).find(d => d && d.slug === slug);

  if (!destination) {
    return (
      <div className="pt-32 pb-20 bg-[#FAF9F6] text-center text-slate-800">
        <h1 className="text-3xl font-bold font-sans mb-4 text-slate-900">Destination Not Found</h1>
        <button
          onClick={() => navigate('/destinations')}
          className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-xl shadow-md cursor-pointer"
        >
          View All Destinations
        </button>
      </div>
    );
  }

  // Find related tours matching this destination
  const relatedTours = (tours || []).filter(t => 
    t && t.is_active && (
      t.title?.toLowerCase().includes(destination.name.toLowerCase()) ||
      t.description?.toLowerCase().includes(destination.name.toLowerCase()) ||
      t.pickup_location?.toLowerCase().includes(destination.name.toLowerCase())
    )
  );

  const otherDestinations = (destinations || []).filter(d => d && d.id !== destination.id && d.is_active).slice(0, 3);

  return (
    <div className="pt-28 pb-20 bg-[#FAF9F6] text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <Breadcrumbs
          customItems={[
            { label: 'Destinations', href: '/destinations' },
            { label: destination.name },
          ]}
        />

        {/* Hero Section */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs uppercase tracking-widest text-red-600 font-bold bg-red-50 px-3 py-1 rounded-full border border-red-200">
              Cambodia Destination Guide
            </span>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-sans tracking-tight flex items-center gap-3">
              <MapPin className="w-8 h-8 text-red-600" />
              {destination.name}
            </h1>

            <p className="text-base text-slate-600 leading-relaxed">
              {destination.short_description}
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => navigate(`/book?destination=${encodeURIComponent(destination.name)}`)}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-red-600/20 transition flex items-center gap-2 cursor-pointer"
              >
                <span>Book Transfer to {destination.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={getWhatsAppGeneralUrl(`Hello Cambodia Taxi Cab, I am planning a trip to ${destination.name} and would like driver details.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-sm rounded-xl transition flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Ask on WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl overflow-hidden border border-slate-200 shadow-md h-80 bg-slate-100">
            <img
              src={destination.featured_image}
              alt={destination.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Overview & Things To Do */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-8 border-t border-slate-200">
          
          <div className="lg:col-span-8 space-y-8">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 font-sans mb-4">
                About {destination.name}
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                {destination.description}
              </p>
            </div>

            {destination.things_to_do && destination.things_to_do.length > 0 && (
              <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-xs">
                <h3 className="text-lg font-bold text-slate-900 font-sans flex items-center gap-2">
                  <Compass className="w-5 h-5 text-red-600" />
                  Top Things to Do in {destination.name}
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
                  {destination.things_to_do.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Related Tours for this destination */}
            {relatedTours.length > 0 && (
              <div className="space-y-6 pt-6 border-t border-slate-200">
                <h2 className="text-2xl font-extrabold text-slate-900 font-sans">
                  Tours & Sightseeing in {destination.name}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {relatedTours.map((t) => (
                    <TourCard key={t.id} tour={t} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar CTA */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 sticky top-28 shadow-xs">
              <h3 className="text-lg font-bold text-slate-900 font-sans border-b border-slate-100 pb-3">
                Need a Driver in {destination.name}?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Whether you need a private transfer from Phnom Penh or full day sightseeing around {destination.name}, our professional team provides reliable driver service.
              </p>

              <button
                onClick={() => navigate(`/book?destination=${encodeURIComponent(destination.name)}`)}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm rounded-xl shadow-md shadow-red-600/20 transition text-center block cursor-pointer"
              >
                Book Travel to {destination.name}
              </button>

              <a
                href={getWhatsAppGeneralUrl(`Hello Cambodia Taxi Cab, I need private driver service for ${destination.name}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold text-sm rounded-xl transition flex items-center justify-center gap-2 text-center"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Driver Team</span>
              </a>
            </div>
          </div>

        </div>

        {/* Other Destinations */}
        {otherDestinations.length > 0 && (
          <div className="mt-20 pt-12 border-t border-slate-200 space-y-6">
            <h2 className="text-2xl font-extrabold text-slate-900 font-sans">
              Other Popular Cambodian Destinations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherDestinations.map((od) => (
                <DestinationCard key={od.id} destination={od} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
