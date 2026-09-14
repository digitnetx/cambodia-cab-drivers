import React from 'react';
import { useApp } from '../../context/AppContext';
import { Phone, Mail, MapPin, MessageSquare, ArrowUpRight, Globe } from 'lucide-react';
import { getWhatsAppGeneralUrl, PHONE_NUMBER } from '../../lib/whatsapp';
import { Logo } from '../common/Logo';

export const Footer: React.FC = () => {
  const { navigate, siteSettings } = useApp();
  const bookingEmail = 'sarethtaxidriver@gmail.com';

  const handleNavClick = (href: string) => {
    navigate(href);
    window.scrollTo(0, 0);
  };

  const accountLinks = [
    { label: 'Google Business', url: siteSettings.google_business_url },
    { label: 'Facebook', url: siteSettings.facebook_url },
    ...(siteSettings.facebook_urls || []).map((url, index) => ({ label: `Facebook ${index + 2}`, url })),
    { label: 'TripAdvisor', url: siteSettings.tripadvisor_url },
  ].filter((link): link is { label: string; url: string } => Boolean(link.url));

  return (
    <footer className="bg-[#F5F4F0] text-slate-700 border-t border-slate-200 pt-16 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200">
          
          {/* Col 1 & 2: Branding & Intro */}
          <div className="lg:col-span-2 space-y-4">
            <button
              onClick={() => handleNavClick('/')}
              className="text-left focus:outline-none cursor-pointer"
              aria-label="Cambodia Taxi Cab Home"
            >
              <Logo variant="horizontal" size="lg" />
            </button>

            <p className="text-sm text-slate-600 leading-relaxed pr-4">
              {siteSettings.footer_description || `Welcome to ${siteSettings.business_name || 'Cambodia Taxi Cab'} (cambodiataxicab.com). Operating in Phnom Penh and providing private driver transportation, airport transfers, city-to-city travel, and customized sightseeing tours across Cambodia with our professional English-speaking driver fleet.`}
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href={getWhatsAppGeneralUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl bg-white text-slate-800 hover:bg-slate-50 border border-slate-200 transition shadow-xs"
              >
                <MessageSquare className="w-4 h-4 text-red-600" />
                WhatsApp Us
              </a>
              <button
                onClick={() => handleNavClick('/book')}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl bg-red-600 text-white hover:bg-red-700 transition shadow-md shadow-red-600/20 cursor-pointer"
              >
                Book Your Ride
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h3 className="text-slate-900 font-sans font-bold text-base mb-4 tracking-wide border-l-2 border-red-600 pl-2">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <button onClick={() => handleNavClick('/')} className="hover:text-red-600 transition cursor-pointer">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('/about')} className="hover:text-red-600 transition cursor-pointer">
                  About Our Fleet
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('/services')} className="hover:text-red-600 transition cursor-pointer">
                  Transportation Services
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('/transfers')} className="hover:text-red-600 transition cursor-pointer">
                  Airport & City Transfers
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('/tours')} className="hover:text-red-600 transition cursor-pointer">
                  Sightseeing Tours
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('/destinations')} className="hover:text-red-600 transition cursor-pointer">
                  Cambodia Destinations
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Services */}
          <div>
            <h3 className="text-slate-900 font-sans font-bold text-base mb-4 tracking-wide border-l-2 border-red-600 pl-2">
              Popular Services
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <button onClick={() => handleNavClick('/transfers')} className="hover:text-red-600 transition cursor-pointer">
                  Phnom Penh Airport Pickup
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('/private-driver')} className="hover:text-red-600 transition cursor-pointer">
                  Private Driver Hire
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('/tours/angkor-wat-sunrise-tour')} className="hover:text-red-600 transition cursor-pointer">
                  Angkor Wat Sunrise Tour
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('/transfers')} className="hover:text-red-600 transition cursor-pointer">
                  Phnom Penh to Siem Reap
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('/transfers')} className="hover:text-red-600 transition cursor-pointer">
                  Kampot & Kep Taxi
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Contact Info */}
          <div>
            <h3 className="text-slate-900 font-sans font-bold text-base mb-4 tracking-wide border-l-2 border-red-600 pl-2">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-600 shrink-0 mt-1" />
                <span className="text-xs leading-relaxed text-slate-700">{siteSettings.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-red-600 shrink-0" />
                <a href={`tel:${PHONE_NUMBER}`} className="hover:text-red-600 text-slate-700 transition">
                  {siteSettings.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-red-600 shrink-0" />
                <a
                  href={getWhatsAppGeneralUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-600 transition text-slate-700 font-medium"
                >
                  WhatsApp: {siteSettings.whatsapp}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-red-600 shrink-0" />
                <a href={`mailto:${bookingEmail}`} className="hover:text-red-600 text-slate-700 transition">
                  {bookingEmail}
                </a>
              </li>
              {accountLinks.length > 0 && (
                <li className="flex items-start gap-2.5">
                  <Globe className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs font-medium">
                    {accountLinks.map((link) => (
                      <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-red-600 transition underline-offset-2 hover:underline">
                        {link.label}
                      </a>
                    ))}
                  </div>
                </li>
              )}
            </ul>
          </div>

        </div>

        {/* Bottom copyright and legal links */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>{siteSettings.copyright_text || '© 2026 cambodiataxicab.com. All rights reserved.'}</p>
          <div className="flex items-center gap-6">
            <button onClick={() => handleNavClick('/privacy')} className="hover:text-slate-900 transition cursor-pointer">
              Privacy Policy
            </button>
            <button onClick={() => handleNavClick('/terms')} className="hover:text-slate-900 transition cursor-pointer">
              Terms & Conditions
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
