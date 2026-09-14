import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { Breadcrumbs } from '../../layout/Breadcrumbs';
import { getWhatsAppGeneralUrl, PHONE_NUMBER } from '../../../lib/whatsapp';
import { submitToFormspree } from '../../../lib/formspree';
import { Phone, Mail, MapPin, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { siteSettings, addContactMessage, showToast } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setSubmitError('');
    try {
      const message = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject || 'General Inquiry',
        message: formData.message,
      };
      await submitToFormspree({
        _subject: `Website contact: ${message.subject}`,
        form_type: 'Contact message',
        ...message,
      });
      await addContactMessage(message);
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
      setSubmitError(err instanceof Error ? err.message : 'Message submission failed. Please try again or contact us on WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-28 pb-20 bg-[#FAF9F6] text-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        <Breadcrumbs />

        {/* Hero Section with taxi one.png */}
        <div className="mt-4 mb-14 relative rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-950 text-white">
          <div className="absolute inset-0 z-0">
            <img
              src={encodeURI('/taxi one.png')}
              alt="Cambodia Taxi Cab Booking & Dispatch Desk"
              className="w-full h-full object-cover object-center opacity-35 scale-105"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=1920&auto=format&fit=crop';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
          </div>

          <div className="relative z-10 p-8 sm:p-14 lg:p-16 max-w-3xl space-y-5">
            <span className="inline-block text-xs uppercase tracking-widest text-white font-bold bg-red-600 px-3.5 py-1.5 rounded-full shadow-md">
              24/7 Driver Coordination Desk
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-sans tracking-tight">
              Contact Cambodia Taxi Cab
            </h1>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
              Have a question about your Cambodia travel itinerary, airport transfers, or custom route pricing? Message our team directly for instant replies and quotes.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <span className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/15 text-slate-200 font-semibold">✓ &lt;15 Min Response Time</span>
              <span className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/15 text-slate-200 font-semibold">✓ WhatsApp & Telegram Ready</span>
              <span className="bg-white/10 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-white/15 text-slate-200 font-semibold">✓ Direct Driver Contact</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
              <h2 className="text-xl font-bold text-slate-900 font-sans border-b border-slate-100 pb-3">
                Contact Information
              </h2>

              <ul className="space-y-4 text-sm text-slate-700">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-sans text-sm">Business Address</strong>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{siteSettings.address}</p>
                  </div>
                </li>

                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-red-600 shrink-0" />
                  <div>
                    <strong className="text-slate-900 block font-sans text-sm">Phone / Call</strong>
                    <a href={`tel:${PHONE_NUMBER}`} className="text-xs text-red-600 font-bold hover:underline">
                      {siteSettings.phone}
                    </a>
                  </div>
                </li>

                <li className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-red-600 shrink-0" />
                  <div>
                    <strong className="text-slate-900 block font-sans text-sm">WhatsApp</strong>
                    <a
                      href={getWhatsAppGeneralUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-red-600 font-bold hover:underline"
                    >
                      {siteSettings.whatsapp}
                    </a>
                  </div>
                </li>

                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-red-600 shrink-0" />
                  <div>
                    <strong className="text-slate-900 block font-sans text-sm">Email</strong>
                    <a href={`mailto:${siteSettings.email}`} className="text-xs text-slate-600 hover:underline">
                      {siteSettings.email}
                    </a>
                  </div>
                </li>
              </ul>

              <div className="pt-4 border-t border-slate-100">
                <a
                  href={getWhatsAppGeneralUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => showToast('Opening WhatsApp chat with our driver team...', 'success')}
                  className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-red-600/20 transition flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Instant WhatsApp Chat</span>
                </a>
              </div>
            </div>

            {/* Google Maps Location Info Box */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center space-y-3 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 font-sans">Google Maps Location</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Boeung Keng Kang I (BKK1), Chamkarmon, Phnom Penh, Cambodia
              </p>
              <a
                href={siteSettings.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg border border-slate-200 transition"
              >
                <MapPin className="w-3.5 h-3.5 text-red-600" />
                <span>Open in Google Maps</span>
              </a>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
              <h2 className="text-xl font-bold text-slate-900 font-sans mb-6 border-b border-slate-100 pb-3">
                Send a Message
              </h2>

              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="text-xl font-bold text-slate-900 font-sans">Message Sent!</h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto">
                    Thank you for reaching out. Our team will respond to your email or WhatsApp as soon as possible.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:bg-white transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. sarah@example.com"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone / WhatsApp</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 555 0192"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:bg-white transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Subject</label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Inquiry about transfers"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Message *</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Share your travel dates, questions, or group requirements..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-red-500 focus:bg-white transition"
                    />
                  </div>

                  {submitError && (
                    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                      {submitError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-red-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
