import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Menu, X, MessageSquare, Send } from 'lucide-react';
import { getWhatsAppGeneralUrl, getTelegramUrl } from '../../lib/whatsapp';
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
      className={`fixed top-0 left-0 right-0 z-40 border-b border-slate-200/80 bg-[#FAF9F6]/95 py-2.5 backdrop-blur-sm transition-shadow duration-300 ${
        isScrolled ? 'shadow-sm' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <a
            href="/"
            onClick={(event) => { event.preventDefault(); handleNavClick('/'); }}
            className="flex items-center text-left focus:outline-none cursor-pointer"
            aria-label="Cambodia Taxi Cab Home"
          >
            <Logo variant="horizontal" size="md" />
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden min-[900px]:flex items-center gap-0.5">
            {navLinks.map((link) => {
              const isActive = currentPath === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(event) => { event.preventDefault(); handleNavClick(link.href); }}
                  className={`px-2.5 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                    isActive
                      ? 'text-white bg-red-600 shadow-xs'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Desktop Right CTAs */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={toggleLanguage}
              className="min-[900px]:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white text-slate-800 text-xs font-bold border border-slate-200 shadow-2xs"
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

            <a
              href="/book"
              onClick={(event) => { event.preventDefault(); handleNavClick('/book'); }}
              className="px-4 py-2 text-xs font-extrabold rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20 transition transform active:scale-95 cursor-pointer"
            >
              {t.nav.bookRide}
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 min-[900px]:hidden">
            <button
              onClick={toggleLanguage}
              className="sm:hidden px-2 py-1 rounded-md bg-white text-slate-800 text-xs font-bold border border-slate-200"
            >
              <span>{language === 'en' ? '🇰🇭' : '🇺🇸'}</span>
            </button>

            <a
              href="/book"
              onClick={(event) => { event.preventDefault(); handleNavClick('/book'); }}
              className="sm:hidden px-3 py-1.5 text-xs font-extrabold rounded-lg bg-red-600 text-white shadow-xs"
            >
              {t.nav.bookRide}
            </a>

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
        <div className="min-[900px]:hidden fixed inset-x-0 top-[58px] bg-white border-b border-slate-200 p-6 shadow-2xl animate-in slide-in-from-top-2 duration-200 text-slate-900">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const isActive = currentPath === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(event) => { event.preventDefault(); handleNavClick(link.href); }}
                  className={`text-left px-4 py-3 rounded-xl font-bold text-sm transition cursor-pointer ${
                    isActive
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}

            <div className="pt-4 border-t border-slate-200 mt-2 flex flex-col gap-3">
              <a
                href="/book"
                onClick={(event) => { event.preventDefault(); handleNavClick('/book'); }}
                className="w-full py-3 text-center font-extrabold text-sm text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-md transition cursor-pointer"
              >
                {t.nav.bookRide}
              </a>

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
