import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Menu, X, Phone, MessageSquare, Globe, Send } from 'lucide-react';
import { getWhatsAppGeneralUrl, getTelegramUrl, PHONE_NUMBER } from '../../lib/whatsapp';
import { Logo } from '../common/Logo';

export const Header: React.FC = () => {
  const { currentPath, navigate, language, setLanguage, siteSettings, t } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: t.nav.home, href: '/' },
    { label: t.nav.airportTransfers, href: '/airport-transfers' },
    { label: t.nav.popularRoutes, href: '/transfers' },
    { label: t.nav.vehicles, href: '/vehicles' },
    { label: t.nav.tours, href: '/tours' },
    { label: t.nav.destinations, href: '/destinations' },
    { label: t.nav.aboutDriver, href: '/private-driver' },
    { label: t.nav.contact, href: '/contact' },
  ];

  const handleNavClick = (href: string) => {
    navigate(href);
    setMobileMenuOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'km' : 'en');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm py-2'
          : 'bg-[#FAF9F6]/95 backdrop-blur-sm border-b border-slate-200/80 py-2.5'
      }`}
    >
      {/* Top Banner Contact Bar */}
      <div className="hidden lg:block border-b border-slate-200/80 pb-2 mb-2 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-900 hover:text-red-600 transition font-medium">
              <Phone className="w-3.5 h-3.5 text-red-600" />
              <a href={`tel:${PHONE_NUMBER}`}>{PHONE_NUMBER}</a>
            </span>
            <span className="flex items-center gap-1.5 text-slate-700 font-medium">
              <MessageSquare className="w-3.5 h-3.5 text-red-600" />
              WhatsApp Direct: +855 16 509 371
            </span>
            <a
              href={getTelegramUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition font-medium"
            >
              <Send className="w-3.5 h-3.5 text-red-600" />
              Telegram
            </a>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500">Direct Local English-Speaking Driver in Cambodia</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold transition shadow-2xs"
              title="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-red-600" />
              <span>{language === 'en' ? '🇰🇭 ភាសាខ្មែរ' : '🇺🇸 English'}</span>
            </button>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <button
            onClick={() => handleNavClick('/')}
            className="flex items-center text-left focus:outline-none cursor-pointer"
            aria-label="Cambodia Taxi Cab Home"
          >
            <Logo variant="horizontal" size="md" />
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = currentPath === link.href;
              return (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                    isActive
                      ? 'text-white bg-red-600 shadow-xs'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Desktop Right CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={toggleLanguage}
              className="xl:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white text-slate-800 text-xs font-bold border border-slate-200 shadow-2xs"
            >
              <span>{language === 'en' ? '🇰🇭' : '🇺🇸'}</span>
            </button>

            <a
              href={getWhatsAppGeneralUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl text-slate-800 bg-white hover:bg-slate-50 border border-slate-200 transition shadow-xs"
            >
              <MessageSquare className="w-4 h-4 text-red-600" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={() => handleNavClick('/book')}
              className="px-4 py-2 text-xs font-extrabold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 transition transform active:scale-95 cursor-pointer"
            >
              {t.nav.bookRide}
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              onClick={toggleLanguage}
              className="sm:hidden px-2 py-1 rounded-md bg-white text-slate-800 text-xs font-bold border border-slate-200"
            >
              <span>{language === 'en' ? '🇰🇭' : '🇺🇸'}</span>
            </button>

            <button
              onClick={() => handleNavClick('/book')}
              className="sm:hidden px-3 py-1.5 text-xs font-extrabold rounded-lg bg-red-600 text-white shadow-xs"
            >
              {t.nav.bookRide}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-slate-900" /> : <Menu className="w-6 h-6 text-slate-900" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-x-0 top-[58px] bg-white border-b border-slate-200 p-6 shadow-2xl animate-in slide-in-from-top-2 duration-200 text-slate-900">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = currentPath === link.href;
              return (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className={`text-left px-4 py-3 rounded-xl font-bold text-sm transition cursor-pointer ${
                    isActive
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}

            <div className="pt-4 border-t border-slate-200 mt-2 flex flex-col gap-3">
              <button
                onClick={() => handleNavClick('/book')}
                className="w-full py-3 text-center font-extrabold text-sm text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md transition cursor-pointer"
              >
                {t.nav.bookRide}
              </button>

              <a
                href={getWhatsAppGeneralUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 flex items-center justify-center gap-2 font-bold text-sm text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition"
              >
                <MessageSquare className="w-5 h-5 text-red-600" />
                Chat on WhatsApp (+855 16 509 371)
              </a>

              <a
                href={getTelegramUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 flex items-center justify-center gap-2 font-bold text-xs text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition"
              >
                <Send className="w-4 h-4 text-red-600" />
                Telegram Direct Chat
              </a>

            </div>
          </div>
        </div>
      )}
    </header>
  );
};
