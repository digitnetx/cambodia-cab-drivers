import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking } from '../../types';
import { z } from 'zod';
import { Calendar, Clock, MapPin, Users, Phone, Mail, User, Luggage, Plane, Building, MessageSquare, CheckCircle, ArrowRight } from 'lucide-react';
import { getWhatsAppBookingUrl } from '../../lib/whatsapp';
import { submitToFormspree } from '../../lib/formspree';

const bookingSchema = z.object({
  customer_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(6, 'Please enter a valid phone number'),
  whatsapp: z.string().optional(),
  service_name: z.string().min(1, 'Please select a service'),
  pickup_location: z.string().min(2, 'Pickup location is required'),
  destination: z.string().min(2, 'Destination is required'),
  travel_date: z.string().min(1, 'Travel date is required'),
  pickup_time: z.string().min(1, 'Pickup time is required'),
  passengers: z.number().min(1, 'At least 1 passenger required'),
  luggage: z.number().min(0),
  flight_number: z.string().optional(),
  hotel_name: z.string().optional(),
  special_requests: z.string().optional(),
});

type FormErrors = Partial<Record<keyof z.infer<typeof bookingSchema>, string>>;

interface BookingFormProps {
  initialService?: string;
  initialTourId?: string;
  initialPickup?: string;
  initialDestination?: string;
  initialDate?: string;
  initialTime?: string;
  initialPassengers?: number;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  initialService,
  initialTourId,
  initialPickup,
  initialDestination,
  initialDate,
  initialTime,
  initialPassengers,
}) => {
  const { services, tours, addBooking, navigate, showToast } = useApp();

  const selectedTour = tours.find(t => t.id === initialTourId);

  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    phone: '',
    whatsapp: '',
    service_name: initialService || (selectedTour ? selectedTour.title : 'Airport Transfers'),
    tour_id: initialTourId || '',
    tour_title: selectedTour ? selectedTour.title : '',
    pickup_location: initialPickup || (selectedTour ? selectedTour.pickup_location : 'Phnom Penh International Airport'),
    destination: initialDestination || (selectedTour ? 'Angkor Wat / Siem Reap' : 'Hotel in Phnom Penh'),
    travel_date: initialDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
    pickup_time: initialTime || '09:00',
    passengers: initialPassengers || 2,
    luggage: 2,
    flight_number: '',
    hotel_name: '',
    special_requests: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedBooking, setCompletedBooking] = useState<Booking | null>(null);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (initialTourId) {
      const t = tours.find(tour => tour.id === initialTourId);
      if (t) {
        setFormData(prev => ({
          ...prev,
          tour_id: t.id,
          tour_title: t.title,
          service_name: t.title,
          pickup_location: prev.pickup_location || t.pickup_location,
        }));
      }
    }
  }, [initialTourId, tours]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'passengers' || name === 'luggage' ? Number(value) : value,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSubmitError('');

    const result = bookingSchema.safeParse(formData);
    if (!result.success) {
      const formattedErrors: FormErrors = {};
      result.error.issues.forEach(issue => {
        if (issue.path[0]) {
          formattedErrors[issue.path[0] as keyof FormErrors] = issue.message;
        }
      });
      setErrors(formattedErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await submitToFormspree({
        _subject: 'New booking request',
        form_type: 'Booking request',
        customer_name: formData.customer_name,
        email: formData.email,
        phone: formData.phone,
        whatsapp: formData.whatsapp || formData.phone,
        service_or_tour: formData.service_name,
        pickup_location: formData.pickup_location,
        destination: formData.destination,
        travel_date: formData.travel_date,
        pickup_time: formData.pickup_time,
        passengers: formData.passengers,
        luggage: formData.luggage,
        flight_number: formData.flight_number,
        hotel_name: formData.hotel_name,
        special_requests: formData.special_requests,
      });

      const created = await addBooking({
        customer_name: formData.customer_name,
        email: formData.email,
        phone: formData.phone,
        whatsapp: formData.whatsapp || formData.phone,
        service_name: formData.service_name,
        tour_id: formData.tour_id,
        tour_title: formData.tour_title,
        pickup_location: formData.pickup_location,
        destination: formData.destination,
        travel_date: formData.travel_date,
        pickup_time: formData.pickup_time,
        passengers: formData.passengers,
        luggage: formData.luggage,
        flight_number: formData.flight_number,
        hotel_name: formData.hotel_name,
        special_requests: formData.special_requests,
      });

      setCompletedBooking(created);
    } catch (err) {
      console.error(err);
      setSubmitError(err instanceof Error ? err.message : 'Booking submission failed. Please try again or contact us on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (completedBooking) {
    return (
      <div className="bg-white border border-emerald-500/40 rounded-2xl p-6 sm:p-10 shadow-xl text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Booking Request Received
        </span>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans mt-3 mb-2">
          Thank You, {completedBooking.customer_name}!
        </h2>

        <p className="text-sm text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
          Your request has been submitted. Our team will confirm your availability and price shortly.
        </p>

        {/* Booking Reference Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-8 text-left space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-xs text-slate-500 font-medium">Booking Reference</span>
            <span className="text-base font-mono font-black text-red-600">
              {completedBooking.booking_reference}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block">Service / Tour</span>
              <span className="text-slate-900 font-bold">{completedBooking.service_name || completedBooking.tour_title}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Date & Time</span>
              <span className="text-slate-900 font-bold">{completedBooking.travel_date} at {completedBooking.pickup_time}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Pickup</span>
              <span className="text-slate-900 font-bold">{completedBooking.pickup_location}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Destination</span>
              <span className="text-slate-900 font-bold">{completedBooking.destination}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Passengers / Luggage</span>
              <span className="text-slate-900 font-bold">{completedBooking.passengers} Pax, {completedBooking.luggage} Luggage</span>
            </div>
            <div>
              <span className="text-slate-500 block">Status</span>
              <span className="text-amber-600 font-bold uppercase">Pending Confirmation</span>
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={getWhatsAppBookingUrl(completedBooking)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => showToast(`Opening WhatsApp to send booking #${completedBooking.booking_reference}...`, 'success')}
            className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl shadow-lg shadow-red-600/20 transition flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-5 h-5 fill-white text-red-600" />
            Contact via WhatsApp
          </a>
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl border border-slate-200 transition cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-8">
      
      {/* Section 1: Trip Details */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 font-sans mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
          <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center">
            1
          </span>
          Trip Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Service */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Select Service or Tour *
            </label>
            <select
              name="service_name"
              value={formData.service_name}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white transition"
            >
              <optgroup label="Services">
                {services.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </optgroup>
              <optgroup label="Tours">
                {tours.map(t => (
                  <option key={t.id} value={t.title}>{t.title}</option>
                ))}
              </optgroup>
            </select>
            {errors.service_name && <p className="text-xs text-rose-500 mt-1">{errors.service_name}</p>}
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-red-600" />
              Travel Date *
            </label>
            <input
              type="date"
              name="travel_date"
              value={formData.travel_date}
              min={new Date().toISOString().split('T')[0]}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white transition"
            />
            {errors.travel_date && <p className="text-xs text-rose-500 mt-1">{errors.travel_date}</p>}
          </div>

          {/* Pickup */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-red-600" />
              Pickup Location *
            </label>
            <input
              type="text"
              name="pickup_location"
              value={formData.pickup_location}
              onChange={handleChange}
              placeholder="e.g. Phnom Penh Airport / Hotel Name"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:bg-white transition"
            />
            {errors.pickup_location && <p className="text-xs text-rose-500 mt-1">{errors.pickup_location}</p>}
          </div>

          {/* Destination */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-red-600" />
              Destination Location *
            </label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="e.g. Siem Reap / Kampot / Address"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:bg-white transition"
            />
            {errors.destination && <p className="text-xs text-rose-500 mt-1">{errors.destination}</p>}
          </div>

          {/* Time & Passengers & Luggage */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-red-600" />
              Pickup Time *
            </label>
            <input
              type="time"
              name="pickup_time"
              value={formData.pickup_time}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white transition"
            />
            {errors.pickup_time && <p className="text-xs text-rose-500 mt-1">{errors.pickup_time}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-red-600" />
                Passengers *
              </label>
              <select
                name="passengers"
                value={formData.passengers}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white transition"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                  <option key={n} value={n}>{n} Passengers</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <Luggage className="w-3.5 h-3.5 text-red-600" />
                Luggage
              </label>
              <select
                name="luggage"
                value={formData.luggage}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white transition"
              >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                  <option key={n} value={n}>{n} Suitcases</option>
                ))}
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* Section 2: Contact Details */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 font-sans mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
          <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center">
            2
          </span>
          Your Contact Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-red-600" />
              Full Name *
            </label>
            <input
              type="text"
              name="customer_name"
              value={formData.customer_name}
              onChange={handleChange}
              placeholder="e.g. David Smith"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:bg-white transition"
            />
            {errors.customer_name && <p className="text-xs text-rose-500 mt-1">{errors.customer_name}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-red-600" />
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. david@example.com"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:bg-white transition"
            />
            {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-red-600" />
              Phone Number (with country code) *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +1 415 555 0199"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:bg-white transition"
            />
            {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              WhatsApp Number (Optional)
            </label>
            <input
              type="tel"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              placeholder="Same as phone if left blank"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:bg-white transition"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Optional Flight & Special Requests */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 font-sans mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
          <span className="w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center">
            3
          </span>
          Additional Travel Details (Optional)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <Plane className="w-3.5 h-3.5 text-red-600" />
              Flight Number (for Airport Pickups)
            </label>
            <input
              type="text"
              name="flight_number"
              value={formData.flight_number}
              onChange={handleChange}
              placeholder="e.g. SQ 158 or TG 584"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-red-600" />
              Hotel Name / Drop-off Hotel
            </label>
            <input
              type="text"
              name="hotel_name"
              value={formData.hotel_name}
              onChange={handleChange}
              placeholder="e.g. Rosewood / FCC Angkor"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:bg-white transition"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Special Requests or Custom Itinerary Notes
            </label>
            <textarea
              name="special_requests"
              rows={3}
              value={formData.special_requests}
              onChange={handleChange}
              placeholder="Specify child seat requirements, preferred stops along the way, extra luggage space, etc."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:bg-white transition"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100">
        {submitError && (
          <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {submitError}
          </div>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 px-6 bg-red-600 hover:bg-red-700 text-white font-extrabold text-base rounded-xl shadow-lg shadow-red-600/20 transition flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? (
            <span>Generating Booking Request...</span>
          ) : (
            <>
              <span>Submit Booking Request</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
        <p className="text-xs text-slate-500 text-center mt-2">
          No prepayment required. Our team will review your request and confirm availability and pricing.
        </p>
      </div>

    </form>
  );
};
