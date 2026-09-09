import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DriverProfile } from '../../types';
import { UserCheck, Save, Award, ShieldCheck, Phone, MessageSquare, Star, Plus, X, Image as ImageIcon } from 'lucide-react';

export const AdminDriverProfile: React.FC = () => {
  const { driverProfile, updateDriverProfile, siteSettings, updateSettings } = useApp();
  const [formData, setFormData] = useState<DriverProfile>(driverProfile);

  const [newQualification, setNewQualification] = useState('');
  const [newReason, setNewReason] = useState('');

  const handleAddQualification = () => {
    if (!newQualification.trim()) return;
    setFormData({
      ...formData,
      qualifications: [...(formData.qualifications || []), newQualification.trim()],
    });
    setNewQualification('');
  };

  const handleRemoveQualification = (index: number) => {
    setFormData({
      ...formData,
      qualifications: formData.qualifications.filter((_, i) => i !== index),
    });
  };

  const handleAddReason = () => {
    if (!newReason.trim()) return;
    setFormData({
      ...formData,
      why_choose_driver: [...(formData.why_choose_driver || []), newReason.trim()],
    });
    setNewReason('');
  };

  const handleRemoveReason = (index: number) => {
    setFormData({
      ...formData,
      why_choose_driver: (formData.why_choose_driver || []).filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateDriverProfile(formData);
    // Keep driver_name in sync with site settings if changed
    if (formData.driver_name !== siteSettings.driver_name) {
      await updateSettings({ driver_name: formData.driver_name });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans text-slate-800">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <UserCheck className="w-6 h-6 text-red-600" /> Driver & Bio Profile Manager
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage your personal profile, credentials, background story, and license details displayed across the website.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-red-600/20 self-start sm:self-auto cursor-pointer"
        >
          <Save className="w-4 h-4" /> Save Driver Profile
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        
        {/* Core Personal Details */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
            <Award className="w-4 h-4 text-red-600" /> Personal & Professional Credentials
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Driver Name *</label>
              <input
                type="text"
                required
                value={formData.driver_name}
                onChange={(e) => setFormData({ ...formData, driver_name: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Professional Title / Headline *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Years of Experience</label>
              <input
                type="number"
                min="1"
                max="50"
                value={formData.years_experience}
                onChange={(e) => setFormData({ ...formData, years_experience: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Completed Trips Count</label>
              <input
                type="number"
                min="0"
                value={formData.trips_completed}
                onChange={(e) => setFormData({ ...formData, trips_completed: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Customer Rating (out of 5.0)</label>
              <input
                type="number"
                step="0.1"
                min="1.0"
                max="5.0"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Official License & Authority Information</label>
            <input
              type="text"
              value={formData.license_info}
              onChange={(e) => setFormData({ ...formData, license_info: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Driver Profile Photo URL</label>
              <input
                type="url"
                value={formData.profile_photo_url}
                onChange={(e) => setFormData({ ...formData, profile_photo_url: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">About Section Cover Photo URL</label>
              <input
                type="url"
                value={formData.cover_photo_url || ''}
                onChange={(e) => setFormData({ ...formData, cover_photo_url: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden font-mono"
              />
            </div>
          </div>
        </div>

        {/* Story & Biography */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
            <ShieldCheck className="w-4 h-4 text-red-600" /> Driver Bio & Introduction
          </h2>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Greeting Headline</label>
            <input
              type="text"
              value={formData.greeting}
              onChange={(e) => setFormData({ ...formData, greeting: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Bio — Paragraph 1 (Introduction & Background)</label>
            <textarea
              rows={3}
              value={formData.bio_paragraph_1}
              onChange={(e) => setFormData({ ...formData, bio_paragraph_1: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Bio — Paragraph 2 (Commitment to Service & Comfort)</label>
            <textarea
              rows={3}
              value={formData.bio_paragraph_2}
              onChange={(e) => setFormData({ ...formData, bio_paragraph_2: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden leading-relaxed"
            />
          </div>
        </div>

        {/* Qualifications & Driver Advantages List */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
            <Award className="w-4 h-4 text-red-600" /> Qualifications & Key Driver Strengths
          </h2>

          {/* Qualifications */}
          <div className="space-y-2">
            <label className="block text-slate-700 font-semibold">Key Certifications & Qualifications</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. 10+ Years Professional Driving Record"
                value={newQualification}
                onChange={(e) => setNewQualification(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddQualification(); } }}
                className="flex-1 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddQualification}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition border border-slate-200 cursor-pointer"
              >
                Add
              </button>
            </div>

            <div className="space-y-1.5 pt-2">
              {formData.qualifications?.map((q, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-[#FAF9F6] rounded-xl border border-slate-200 text-slate-800">
                  <span className="font-medium text-emerald-700">✓ {q}</span>
                  <button type="button" onClick={() => handleRemoveQualification(i)} className="text-slate-400 hover:text-red-600 p-1 cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Why Book Direct */}
          <div className="space-y-2 pt-3 border-t border-slate-200">
            <label className="block text-slate-700 font-semibold">Why Book Direct With Driver (Bulleted Points)</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Always on time with flight delay monitoring"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddReason(); } }}
                className="flex-1 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddReason}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition border border-slate-200 cursor-pointer"
              >
                Add
              </button>
            </div>

            <div className="space-y-1.5 pt-2">
              {formData.why_choose_driver?.map((r, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-[#FAF9F6] rounded-xl border border-slate-200 text-slate-800">
                  <span className="text-red-600">★</span> <span className="flex-1 ml-1 font-medium">{r}</span>
                  <button type="button" onClick={() => handleRemoveReason(i)} className="text-slate-400 hover:text-red-600 p-1 cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition shadow-md shadow-red-600/20 text-sm cursor-pointer"
          >
            Save All Profile Updates
          </button>
        </div>

      </form>

    </div>
  );
};
