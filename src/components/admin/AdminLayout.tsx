import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, Calendar, Compass, MapPin, Car, Star, 
  MessageSquare, HelpCircle, Settings, LogOut, ShieldCheck, Menu, X, ExternalLink,
  Layers, UserCheck, Shield, Plane, Route, Image as ImageIcon, Search as SearchIcon,
  Database, RefreshCw
} from 'lucide-react';
import { Logo } from '../common/Logo';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeTab }) => {
  const { 
    navigate, logoutAdmin, siteSettings, bookings = [], messages = [], reviews = [],
    dbStatus, refreshDatabase, showToast
  } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const unreadMessagesCount = (messages || []).filter(m => m && m.status === 'unread').length;
  const pendingBookingsCount = (bookings || []).filter(b => b && (b.status === 'pending' || b.status === 'new')).length;
  const pendingReviewsCount = (reviews || []).filter(r => r && (r.status === 'pending' || (!r.is_published && r.status !== 'rejected'))).length;

  const handleManualSync = async () => {
    setIsRefreshing(true);
    await refreshDatabase();
    setIsRefreshing(false);
    showToast('Synced fresh data with database');
  };

  const menuSections = [
    {
      group: 'Core Operations',
      items: [
        { id: 'dashboard', label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { id: 'bookings', label: 'Bookings', href: '/admin/bookings', icon: Calendar, badge: pendingBookingsCount },
        { id: 'messages', label: 'Messages', href: '/admin/messages', icon: MessageSquare, badge: unreadMessagesCount },
      ]
    },
    {
      group: 'Fleet & Pricing',
      items: [
        { id: 'routes', label: 'Routes & Pricing', href: '/admin/routes', icon: Route },
        { id: 'airports', label: 'Airport Transfers', href: '/admin/airports', icon: Plane },
        { id: 'vehicles', label: 'Vehicles Fleet', href: '/admin/vehicles', icon: Car },
        { id: 'services', label: 'Services', href: '/admin/services', icon: Layers },
      ]
    },
    {
      group: 'Content & CMS',
      items: [
        { id: 'homepage', label: 'Homepage Manager', href: '/admin/homepage', icon: Layers },
        { id: 'driver-profile', label: 'Driver / Fleet Profile', href: '/admin/driver-profile', icon: UserCheck },
        { id: 'why-choose-us', label: 'Why Choose Us', href: '/admin/why-choose-us', icon: Shield },
        { id: 'tours', label: 'Tours CMS', href: '/admin/tours', icon: Compass },
        { id: 'destinations', label: 'Destinations', href: '/admin/destinations', icon: MapPin },
        { id: 'reviews', label: 'Reviews Moderation', href: '/admin/reviews', icon: Star, badge: pendingReviewsCount },
        { id: 'faqs', label: 'FAQs', href: '/admin/faqs', icon: HelpCircle },
      ]
    },
    {
      group: 'System & Branding',
      items: [
        { id: 'settings', label: 'Website Settings', href: '/admin/settings', icon: Settings },
        { id: 'seo', label: 'SEO Settings', href: '/admin/seo', icon: SearchIcon },
        { id: 'media', label: 'Media Library', href: '/admin/media', icon: ImageIcon },
      ]
    }
  ];

  const handleNav = (href: string) => {
    navigate(href);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-800 flex flex-col md:flex-row font-sans">
      
      {/* Mobile Top Header */}
      <div className="md:hidden bg-white text-slate-900 border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-red-600" />
          <span className="font-extrabold text-sm text-slate-900">Admin Control Center</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-600 hover:text-slate-900"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {sidebarOpen && <button aria-label="Close navigation" onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-30 bg-slate-950/35 backdrop-blur-[1px] md:hidden" />}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-[min(18rem,calc(100vw-2rem))] md:w-72 bg-white text-slate-700 border-r border-slate-200 flex flex-col justify-between p-4 transition-transform duration-300 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } overflow-y-auto max-h-screen shadow-xs`}
      >
        <div className="space-y-5">
          
          {/* Logo / Brand Header */}
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <div className="w-10 h-10 rounded-xl bg-white p-1 border border-slate-200 flex items-center justify-center shadow-xs shrink-0">
              <Logo variant="icon" size="sm" className="w-full h-full" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-extrabold text-slate-900 tracking-tight truncate">
                {siteSettings.business_name || 'Cambodia Taxi Cab'}
              </h2>
              <span className="text-[11px] text-red-600 font-bold block uppercase tracking-wider">
                Fleet Management (Admin)
              </span>
            </div>
          </div>

          {/* Navigation Groupings */}
          <nav className="space-y-4">
            {menuSections.map((sec, idx) => (
              <div key={idx} className="space-y-1">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {sec.group}
                </div>
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.href)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl font-medium text-xs transition cursor-pointer ${
                        isActive
                          ? 'bg-red-600 text-white font-bold shadow-md shadow-red-600/20'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isActive ? 'bg-white text-red-600' : 'bg-red-50 text-red-600 border border-red-200'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>

        </div>

        {/* Footer Actions */}
        <div className="pt-4 mt-6 border-t border-slate-200 space-y-2.5">
          {/* Database Status Pill */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${
                dbStatus === 'connected' ? 'bg-emerald-500 animate-pulse' :
                dbStatus === 'syncing' ? 'bg-amber-500 animate-spin' : 'bg-rose-500'
              }`} />
              <div className="font-semibold text-slate-700 flex items-center gap-1">
                <Database className="w-3 h-3 text-slate-500" />
                <span>{dbStatus === 'connected' ? 'Database Live' : dbStatus === 'syncing' ? 'Syncing...' : 'Local Cache'}</span>
              </div>
            </div>
            <button
              onClick={handleManualSync}
              disabled={isRefreshing}
              title="Sync with Database"
              className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-md transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-red-600' : ''}`} />
            </button>
          </div>

          <button
            onClick={() => handleNav('/')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 text-red-600" />
            <span>Open Public Website</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>

      {/* Main Admin Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#FAF9F6] min-h-screen overflow-x-hidden">
        {children}
      </main>

    </div>
  );
};
