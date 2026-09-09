import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SiteSettings } from '../../types';
import { Settings, Save, Phone, Mail, MapPin, Globe, DollarSign, Palette, CheckSquare, MessageSquare, Send, CheckCircle, AlertCircle, RefreshCw, ShieldCheck, Key, Eye, EyeOff, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { Logo } from '../common/Logo';
import { api } from '../../lib/api';

export const AdminSettings: React.FC = () => {
  const { siteSettings, updateSettings, showToast } = useApp();
  const [formData, setFormData] = useState<SiteSettings>({
    ...siteSettings,
    smtp_settings: {
      smtp_user: siteSettings.smtp_settings?.smtp_user || 'digitnetx@gmail.com',
      smtp_password: siteSettings.smtp_settings?.smtp_password || '',
      admin_notification_email: siteSettings.smtp_settings?.admin_notification_email || siteSettings.email || 'digitnetx@gmail.com',
      smtp_host: siteSettings.smtp_settings?.smtp_host || 'smtp.gmail.com',
      smtp_port: siteSettings.smtp_settings?.smtp_port || '465',
      is_enabled: siteSettings.smtp_settings?.is_enabled ?? true,
    }
  });

  // SMTP Status & Test State
  const [smtpStatus, setSmtpStatus] = useState<{
    configured: boolean;
    smtpUser: string | null;
    adminEmail: string | null;
    host: string;
    port: string;
  } | null>(null);
  const [testEmail, setTestEmail] = useState(
    siteSettings.smtp_settings?.admin_notification_email || siteSettings.email || 'digitnetx@gmail.com'
  );
  const [showPassword, setShowPassword] = useState(false);
  const [isTestingSmtp, setIsTestingSmtp] = useState(false);
  const [testResult, setTestResult] = useState<{ success?: boolean; message?: string; error?: string; hint?: string } | null>(null);

  const fetchSmtpStatus = async () => {
    try {
      const data = await api.getEmailStatus();
      if (data) {
        setSmtpStatus(data);
        if (data.adminEmail && !testEmail) {
          setTestEmail(data.adminEmail);
        }
      }
    } catch (err) {
      console.error('Failed to fetch SMTP status:', err);
    }
  };

  useEffect(() => {
    fetchSmtpStatus();
  }, [formData.smtp_settings?.smtp_user, formData.smtp_settings?.smtp_password]);

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail) return;

    setIsTestingSmtp(true);
    setTestResult(null);

    try {
      const data = await api.sendEmailTest(testEmail);

      if (data.success) {
        setTestResult({ success: true, message: data.message });
        showToast('Test email delivered successfully to ' + testEmail, 'success');
        setSmtpStatus(prev => ({
          configured: true,
          smtpUser: formData.smtp_settings?.smtp_user || prev?.smtpUser || null,
          adminEmail: testEmail,
          host: formData.smtp_settings?.smtp_host || 'smtp.gmail.com',
          port: formData.smtp_settings?.smtp_port || '465',
        }));
      } else {
        const errorMsg = data.error || data.message || 'SMTP delivery failed.';
        setTestResult({
          success: false,
          error: errorMsg,
          hint: data.hint || 'Make sure your 16-character Google App Password is correct.'
        });
        showToast(errorMsg, 'error');
      }
    } catch (err: any) {
      const msg = err.message || 'Connection error. Check your internet or server.';
      setTestResult({ success: false, error: msg });
      showToast('Error connecting to email service', 'error');
    } finally {
      setIsTestingSmtp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(formData);
    await fetchSmtpStatus();
  };


  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans text-slate-800">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-red-600" /> Website & Business Settings
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Global branding, contact phone numbers, WhatsApp, booking form inputs, currency, and footer texts.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-red-600/20 self-start sm:self-auto cursor-pointer"
        >
          <Save className="w-4 h-4" /> Save All Settings
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        
        {/* Business Identity */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
            <Globe className="w-4 h-4 text-red-600" /> Business Identity & Branding
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Business Name *</label>
              <input
                type="text"
                required
                value={formData.business_name}
                onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Primary Driver Name *</label>
              <input
                type="text"
                required
                value={formData.driver_name}
                onChange={(e) => setFormData({ ...formData, driver_name: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Tagline</label>
            <input
              type="text"
              value={formData.tagline || ''}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Business Description</label>
            <textarea
              rows={2}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
            />
          </div>

          {/* Official Website Logo & Visual Assets */}
          <div className="pt-3 border-t border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-slate-800 font-bold flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-red-600" />
                Official Website Logo & Emblem
              </label>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, logo_url: '/logo.svg', favicon_url: '/logo-icon.svg' })}
                className="text-[11px] text-red-600 hover:text-red-700 underline cursor-pointer"
              >
                Reset to Default Official Logo
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
              <div>
                <label className="block text-slate-700 font-semibold mb-1 text-[11px]">Logo Asset Path / URL</label>
                <input
                  type="text"
                  value={formData.logo_url || '/logo.svg'}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  placeholder="/logo.svg or https://..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden font-mono text-xs"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Default: <code className="text-red-600">/logo.svg</code> (Vector Angkor Wat + Sedan Emblem)
                </p>
              </div>

              {/* Live Logo Preview Box */}
              <div className="bg-[#FAF9F6] border border-slate-200 rounded-2xl p-3.5 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Live Logo Preview</span>
                <div className="bg-white rounded-xl p-2.5 border border-slate-200 shadow-xs max-w-[200px] w-full flex items-center justify-center">
                  <Logo variant="full" className="max-h-24 w-auto" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Numbers & Channels */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
            <Phone className="w-4 h-4 text-red-600" /> Contact Channels & Phone Numbers
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">WhatsApp Number *</label>
              <input
                type="text"
                required
                placeholder="+855 16 509 371"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Calling Phone Number *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Telegram Phone Number</label>
              <input
                type="text"
                value={formData.telegram || ''}
                onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Business Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Working Hours / Availability</label>
              <input
                type="text"
                value={formData.working_hours || ''}
                onChange={(e) => setFormData({ ...formData, working_hours: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Physical Address / Office Location</label>
            <input
              type="text"
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Google Maps Direct Link</label>
              <input
                type="url"
                value={formData.google_maps_url || ''}
                onChange={(e) => setFormData({ ...formData, google_maps_url: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Google Business Profile URL</label>
              <input
                type="url"
                value={formData.google_business_url || ''}
                onChange={(e) => setFormData({ ...formData, google_business_url: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden font-mono"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
            <Globe className="w-4 h-4 text-red-600" /> Social Media Links
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Facebook URL</label>
              <input
                type="url"
                value={formData.facebook_url || ''}
                onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Instagram URL</label>
              <input
                type="url"
                value={formData.instagram_url || ''}
                onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">TikTok URL</label>
              <input
                type="url"
                value={formData.tiktok_url || ''}
                onChange={(e) => setFormData({ ...formData, tiktok_url: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Booking Form Settings */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
            <CheckSquare className="w-4 h-4 text-red-600" /> Booking Form Field Configuration
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <input
                type="checkbox"
                checked={formData.booking_form_settings?.enable_flight_number ?? true}
                onChange={(e) => setFormData({
                  ...formData,
                  booking_form_settings: {
                    ...formData.booking_form_settings,
                    enable_flight_number: e.target.checked
                  }
                })}
                className="w-4 h-4 rounded-sm accent-red-600"
              />
              <span>Show Flight Number Field</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <input
                type="checkbox"
                checked={formData.booking_form_settings?.enable_hotel_name ?? true}
                onChange={(e) => setFormData({
                  ...formData,
                  booking_form_settings: {
                    ...formData.booking_form_settings,
                    enable_hotel_name: e.target.checked
                  }
                })}
                className="w-4 h-4 rounded-sm accent-red-600"
              />
              <span>Show Hotel / Drop-off Name Field</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <input
                type="checkbox"
                checked={formData.booking_form_settings?.enable_special_requests ?? true}
                onChange={(e) => setFormData({
                  ...formData,
                  booking_form_settings: {
                    ...formData.booking_form_settings,
                    enable_special_requests: e.target.checked
                  }
                })}
                className="w-4 h-4 rounded-sm accent-red-600"
              />
              <span>Show Special Requests Notes</span>
            </label>
          </div>
        </div>

        {/* Gmail SMTP Service & Email Notifications */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-red-600" /> Gmail SMTP Service & Automatic Notifications
            </h2>
            <div className="flex items-center gap-2">
              {smtpStatus?.configured || (formData.smtp_settings?.smtp_user && formData.smtp_settings?.smtp_password) ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-[11px] font-bold">
                  <CheckCircle className="w-3.5 h-3.5" /> Gmail SMTP Configured
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-full text-[11px] font-bold">
                  <AlertCircle className="w-3.5 h-3.5" /> Credentials Required
                </span>
              )}
              <button
                type="button"
                onClick={fetchSmtpStatus}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                title="Refresh Status"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            When enabled, the system automatically dispatches <strong>dual email notifications</strong> for every booking request and contact inquiry:
            a branded confirmation receipt to the public traveler, and an instant alert to the administrator inbox.
          </p>

          {/* SMTP secrets are intentionally never stored in browser-accessible settings. */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FAF9F6] p-4 rounded-xl border border-slate-200">
            <div className="md:col-span-2 flex gap-2.5 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-amber-700" />
              <span><strong>Secure server configuration:</strong> SMTP credentials are read from <code>SMTP_USER</code>, <code>SMTP_PASSWORD</code>, <code>SMTP_HOST</code>, <code>SMTP_PORT</code>, and <code>ADMIN_EMAIL</code> in the server environment.</span>
            </div>
            <div>
              <label className="block text-slate-700 text-xs font-semibold mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-red-600" /> Gmail Sender Address
              </label>
              <input
                type="email"
                placeholder="e.g. digitnetx@gmail.com"
                value={formData.smtp_settings?.smtp_user || ''}
                disabled
                onChange={(e) => setFormData({
                  ...formData,
                  smtp_settings: {
                    ...formData.smtp_settings,
                    smtp_user: e.target.value.trim(),
                  }
                })}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:outline-hidden text-xs font-mono"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                The Gmail account used to send automated booking receipts and alerts.
              </span>
            </div>

            <div>
              <label className="block text-slate-700 text-xs font-semibold mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-600" /> Gmail App Password (16 Letters)
                </span>
                <a
                  href="https://myaccount.google.com/apppasswords"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-red-600 hover:underline flex items-center gap-1 font-normal"
                >
                  Generate App Password <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </label>
              <div className="relative">
                <input
                type={showPassword ? "text" : "password"}
                placeholder="e.g. abcd efgh ijkl mnop"
                value={formData.smtp_settings?.smtp_password || ''}
                disabled
                  onChange={(e) => setFormData({
                    ...formData,
                    smtp_settings: {
                      ...formData.smtp_settings,
                      smtp_password: e.target.value,
                    }
                  })}
                  className="w-full p-2.5 pr-10 bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:outline-hidden text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                16-letter App Password generated under your Google Account 2-Step Verification.
              </span>
            </div>

            <div className="md:col-span-2">
              <label className="block text-slate-700 text-xs font-semibold mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Admin Alert Recipient Email
              </label>
              <input
                type="email"
                placeholder="e.g. info@cambodiataxicab.com or digitnetx@gmail.com"
                value={formData.smtp_settings?.admin_notification_email || ''}
                disabled
                onChange={(e) => setFormData({
                  ...formData,
                  smtp_settings: {
                    ...formData.smtp_settings,
                    admin_notification_email: e.target.value.trim(),
                  }
                })}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:outline-hidden text-xs font-mono"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                The driver/admin email where all new booking orders and contact alerts will be received immediately.
              </span>
            </div>
          </div>

          {/* Quick Guide */}
          <div className="bg-red-50 border border-red-100 p-3.5 rounded-xl text-slate-700 text-[11px] space-y-1.5">
            <strong className="text-red-900 block">💡 Configure the server’s 16-character Gmail App Password:</strong>
            <ol className="list-decimal list-inside space-y-1 text-slate-700 pl-1">
              <li>Open your Google Account: <a href="https://myaccount.google.com/security" target="_blank" rel="noreferrer" className="text-red-600 underline">myaccount.google.com/security</a></li>
              <li>Ensure <strong>2-Step Verification</strong> is turned ON.</li>
              <li>Go to <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" className="text-red-600 underline">myaccount.google.com/apppasswords</a></li>
              <li>Create a new App Password named <code className="text-red-800 font-bold">Cambodia Cab</code> and add it as <code className="text-red-800 font-bold">SMTP_PASSWORD</code> in your local <code>.env</code> or hosting environment variables.</li>
            </ol>
          </div>

          {/* Interactive SMTP Test Tool */}
          <div className="pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 block">Send Live Test Email</span>
              <span className="text-[11px] text-slate-500">Verifies live sending to any recipient</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter test recipient email..."
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="flex-1 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden text-xs"
              />
              <button
                type="button"
                onClick={handleSendTestEmail}
                disabled={isTestingSmtp || !testEmail}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition shadow-md shrink-0 cursor-pointer"
              >
                {isTestingSmtp ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>{isTestingSmtp ? 'Testing Delivery...' : 'Send Test Email'}</span>
              </button>
            </div>

            {testResult && (
              <div className={`mt-3 p-3.5 rounded-xl text-xs space-y-1 border ${
                testResult.success 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <div className="flex items-center gap-2 font-bold">
                  {testResult.success ? <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" /> : <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />}
                  <span>{testResult.message || testResult.error}</span>
                </div>
                {testResult.hint && (
                  <p className="text-[11px] text-slate-600 pl-6">{testResult.hint}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Currency & Footer */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
            <DollarSign className="w-4 h-4 text-red-600" /> Currency & Footer Copyright
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Default Base Currency</label>
              <select
                value={formData.currency_settings?.default_currency || 'USD'}
                onChange={(e) => setFormData({
                  ...formData,
                  currency_settings: {
                    ...formData.currency_settings,
                    default_currency: e.target.value,
                    currency_symbol: e.target.value === 'KHR' ? '៛' : e.target.value === 'EUR' ? '€' : '$'
                  }
                })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
              >
                <option value="USD">USD ($ - US Dollar)</option>
                <option value="KHR">KHR (៛ - Cambodian Riel)</option>
                <option value="EUR">EUR (€ - Euro)</option>
                <option value="GBP">GBP (£ - British Pound)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Copyright Line</label>
              <input
                type="text"
                value={formData.copyright_text || ''}
                onChange={(e) => setFormData({ ...formData, copyright_text: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Footer About Summary Description</label>
            <textarea
              rows={2}
              value={formData.footer_description || ''}
              onChange={(e) => setFormData({ ...formData, footer_description: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition shadow-md shadow-red-600/20 text-sm cursor-pointer"
          >
            Save All Settings
          </button>
        </div>

      </form>

    </div>
  );
};
