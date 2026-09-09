import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, Clock, MapPin, Users, ArrowRight, MessageSquare, Send, Sparkles } from 'lucide-react';
import { getWhatsAppGeneralUrl, getTelegramUrl } from '../../lib/whatsapp';

export const BookingWidget: React.FC = () => {
  const { navigate, t, services, language } = useApp();
  const [activeTab, setActiveTab] = useState<'airport' | 'city' | 'tour'>('airport');
  
  // Preset defaults based on selected tab
  const [pickup, setPickup] = useState('Phnom Penh Int. Airport (PNH)');
  const [destination, setDestination] = useState('Hotel in Phnom Penh (BKK1 / Riverside)');
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('10:00');
  const [passengers, setPassengers] = useState(2);

  const handleTabChange = (tab: 'airport' | 'city' | 'tour') => {
    setActiveTab(tab);
    if (tab === 'airport') {
      setPickup('Phnom Penh Int. Airport (PNH)');
      setDestination('Hotel in Phnom Penh (BKK1 / Riverside)');
    } else if (tab === 'city') {
      setPickup('Phnom Penh');
      setDestination('Siem Reap (Angkor Wat)');
    } else if (tab === 'tour') {
      setPickup('Hotel in Siem Reap');
      setDestination('Angkor Wat Sunrise Temple Tour');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const serviceName = activeTab === 'airport' 
      ? 'Airport Transfers' 
      : activeTab === 'city' 
      ? 'City-to-City Transfers' 
      : 'Angkor Wat Sunrise Tour';

    const query = new URLSearchParams({
      service: serviceName,
      pickup,
      destination,
      date,
      time,
      passengers: passengers.toString(),
    }).toString();
    
    navigate(`/book?${query}`);
  };

  const getDirectWhatsAppMsg = () => {
    const prefix = activeTab === 'airport' ? 'Airport Transfer' : activeTab === 'city' ? 'City Transfer' : 'Private Tour';
    const text = `Hello Cambodia Taxi Cab, I would like a quote for a ${prefix}:
📍 Pickup: ${pickup}
🏁 Destination: ${destination}
📅 Date: ${date} at ${time}
👥 Passengers: ${passengers}

Please let me know your availability and fixed price. Thank you!`;
    return getWhatsAppGeneralUrl(text);
  };

  const getDirectTelegramMsg = () => {
    const prefix = activeTab === 'airport' ? 'Airport Transfer' : activeTab === 'city' ? 'City Transfer' : 'Private Tour';
    const text = `Hello Cambodia Taxi Cab, I would like a quote for a ${prefix}:
📍 Pickup: ${pickup}
🏁 Destination: ${destination}
📅 Date: ${date} at ${time}
👥 Passengers: ${passengers}

Please let me know your availability and price.`;
    return getTelegramUrl(text);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xl relative text-slate-900">
      
      {/* Glow Highlight Badge */}
      <div className="absolute -top-3 right-6 bg-red-600 text-white text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-md shadow-red-600/30 flex items-center gap-1">
        <Sparkles className="w-3 h-3" />
        <span>Direct Driver Booking</span>
      </div>

      {/* Service Type Tab Bar */}
      <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-xl mb-5">
        <button
          type="button"
          onClick={() => handleTabChange('airport')}
          className={`py-2.5 px-2 text-xs sm:text-sm font-bold rounded-lg transition text-center flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'airport'
              ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <span>✈️</span>
          <span className="truncate">{language === 'km' ? 'ព្រលានយន្តហោះ' : 'Airport Transfer'}</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('city')}
          className={`py-2.5 px-2 text-xs sm:text-sm font-bold rounded-lg transition text-center flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'city'
              ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <span>🚗</span>
          <span className="truncate">{language === 'km' ? 'ឆ្លងខេត្ត' : 'City Transfer'}</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('tour')}
          className={`py-2.5 px-2 text-xs sm:text-sm font-bold rounded-lg transition text-center flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'tour'
              ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <span>🗺️</span>
          <span className="truncate">{language === 'km' ? 'ដំណើរកម្សាន្ត' : 'Private Tour'}</span>
        </button>
      </div>

      {/* Quick Select Quick Chips */}
      <div className="flex flex-wrap gap-1.5 mb-4 text-[11px]">
        {activeTab === 'airport' && (
          <>
            <button
              type="button"
              onClick={() => {
                setPickup('Phnom Penh Airport (PNH)');
                setDestination('Phnom Penh Hotel (BKK1)');
              }}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 transition cursor-pointer"
            >
              Phnom Penh Airport ➔ Hotel
            </button>
            <button
              type="button"
              onClick={() => {
                setPickup('Siem Reap Angkor Airport (SAI)');
                setDestination('Siem Reap City / Hotel');
              }}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 transition cursor-pointer"
            >
              Siem Reap SAI ➔ Hotel
            </button>
            <button
              type="button"
              onClick={() => {
                setPickup('Sihanoukville Airport (KOS)');
                setDestination('Koh Rong Ferry Pier');
              }}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 transition cursor-pointer"
            >
              KOS Airport ➔ Ferry Pier
            </button>
          </>
        )}
        {activeTab === 'city' && (
          <>
            <button
              type="button"
              onClick={() => {
                setPickup('Phnom Penh');
                setDestination('Siem Reap (Angkor)');
              }}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 transition cursor-pointer"
            >
              Phnom Penh ➔ Siem Reap ($75)
            </button>
            <button
              type="button"
              onClick={() => {
                setPickup('Phnom Penh');
                setDestination('Sihanoukville (Expressway)');
              }}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 transition cursor-pointer"
            >
              Phnom Penh ➔ Sihanoukville ($65)
            </button>
            <button
              type="button"
              onClick={() => {
                setPickup('Phnom Penh');
                setDestination('Kampot / Kep');
              }}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 transition cursor-pointer"
            >
              Phnom Penh ➔ Kampot ($55)
            </button>
          </>
        )}
        {activeTab === 'tour' && (
          <>
            <button
              type="button"
              onClick={() => {
                setPickup('Hotel in Siem Reap');
                setDestination('Angkor Wat Sunrise & Temples Tour');
              }}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 transition cursor-pointer"
            >
              Angkor Wat Sunrise Tour
            </button>
            <button
              type="button"
              onClick={() => {
                setPickup('Hotel in Phnom Penh');
                setDestination('Royal Palace, S-21 & Killing Fields');
              }}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 transition cursor-pointer"
            >
              Phnom Penh City Highlights
            </button>
          </>
        )}
      </div>

      {/* Main Conversion Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5">
        
        {/* Pickup */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-600" />
              {t.hero.pickupLabel}
            </span>
            <span className="text-[10px] text-slate-500 font-normal">Airport, Hotel, Street</span>
          </label>
          <input
            type="text"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            placeholder={t.hero.pickupPlaceholder}
            required
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition"
          />
        </div>

        {/* Destination */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-600" />
              {t.hero.destLabel}
            </span>
            <span className="text-[10px] text-slate-500 font-normal">City, Hotel, Pier, Temple</span>
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder={t.hero.destPlaceholder}
            required
            className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition"
          />
        </div>

        {/* Date & Time & Passengers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-red-600" />
              {t.hero.dateLabel}
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-red-600" />
              {t.hero.timeLabel}
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-red-600" />
              {t.hero.paxLabel}
            </label>
            <select
              value={passengers}
              onChange={(e) => setPassengers(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Passenger' : 'Passengers'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Main CTA Button */}
        <button
          type="submit"
          className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm sm:text-base rounded-xl shadow-lg shadow-red-600/30 transition transform active:scale-[0.98] flex items-center justify-center gap-2 mt-2 cursor-pointer"
        >
          <span>{t.hero.getQuoteBtn}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </form>

      {/* Direct Messaging Secondary CTAs */}
      <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
        <a
          href={getDirectWhatsAppMsg()}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-xl transition flex items-center justify-center gap-2 text-center"
        >
          <MessageSquare className="w-4 h-4 text-red-600" />
          <span>{t.hero.whatsAppCta}</span>
        </a>

        <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 pt-1">
          <span className="flex items-center gap-1 text-slate-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping inline-block" />
            {t.hero.responseSpeed}
          </span>
          <a
            href={getDirectTelegramMsg()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 hover:text-slate-900 transition flex items-center gap-1 font-medium"
          >
            <Send className="w-3 h-3 text-red-600" />
            <span>Telegram</span>
          </a>
        </div>
      </div>

    </div>
  );
};
