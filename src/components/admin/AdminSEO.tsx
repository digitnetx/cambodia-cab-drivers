import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SEOSettings } from '../../types';
import { Search, Save, Globe, Share2, Tag, X, Plus } from 'lucide-react';

export const AdminSEO: React.FC = () => {
  const { seoSettings, updateSEOSettings } = useApp();
  const [formData, setFormData] = useState<SEOSettings>(seoSettings);
  const [keywordInput, setKeywordInput] = useState('');

  const handleAddKeyword = () => {
    if (!keywordInput.trim()) return;
    const current = formData.keywords || [];
    setFormData({ ...formData, keywords: [...current, keywordInput.trim()] });
    setKeywordInput('');
  };

  const handleRemoveKeyword = (idx: number) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter((_, i) => i !== idx),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSEOSettings(formData);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-sans text-slate-800">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Search className="w-6 h-6 text-red-600" /> SEO & Social Metadata Manager
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Optimize meta tags, Google search snippets, OpenGraph social sharing previews, and target keywords.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-red-600/20 self-start sm:self-auto cursor-pointer"
        >
          <Save className="w-4 h-4" /> Save SEO Settings
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        
        {/* Google Search Preview */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
            <Globe className="w-4 h-4 text-red-600" /> Google Search SERP Snippet Preview
          </h2>

          <div className="bg-[#FAF9F6] p-4 rounded-xl border border-slate-200 font-sans space-y-1">
            <div className="text-[11px] text-slate-500 truncate">
              {formData.canonical_url || 'https://cambodiataxicab.com'}
            </div>
            <div className="text-base text-blue-700 font-bold hover:underline cursor-pointer truncate">
              {formData.meta_title || 'Cambodia Taxi Cab — Private Taxi Service'}
            </div>
            <p className="text-xs text-slate-600 line-clamp-2">
              {formData.meta_description || 'Direct door-to-door private transfers, airport pickups, and tours in Cambodia with professional drivers.'}
            </p>
          </div>
        </div>

        {/* Primary Meta Tags */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
            <Search className="w-4 h-4 text-red-600" /> Search Engine Meta Tags
          </h2>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Meta Title Tag (Recommended 50–60 characters)
            </label>
            <input
              type="text"
              required
              value={formData.meta_title}
              onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
            />
            <div className="text-[10px] text-slate-400 text-right mt-1">
              {formData.meta_title.length} characters
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Meta Description (Recommended 140–160 characters)
            </label>
            <textarea
              rows={3}
              required
              value={formData.meta_description}
              onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
            />
            <div className="text-[10px] text-slate-400 text-right mt-1">
              {formData.meta_description.length} characters
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Canonical Website URL</label>
            <input
              type="url"
              value={formData.canonical_url || ''}
              onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden font-mono"
            />
          </div>

          {/* Keywords */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <label className="block text-slate-700 font-semibold">Target SEO Keywords</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Phnom Penh airport taxi, Siem Reap private driver"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddKeyword(); } }}
                className="flex-1 p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddKeyword}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition border border-slate-200 cursor-pointer"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2">
              {formData.keywords?.map((k, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-xs">
                  <Tag className="w-3 h-3 text-red-600" />
                  {k}
                  <button type="button" onClick={() => handleRemoveKeyword(i)} className="text-slate-400 hover:text-red-600 ml-1 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* OpenGraph Social Tags */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-3">
            <Share2 className="w-4 h-4 text-red-600" /> Social Media Sharing (OpenGraph / Facebook / WhatsApp)
          </h2>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">OpenGraph Title</label>
            <input
              type="text"
              value={formData.og_title || ''}
              onChange={(e) => setFormData({ ...formData, og_title: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">OpenGraph Description</label>
            <textarea
              rows={2}
              value={formData.og_description || ''}
              onChange={(e) => setFormData({ ...formData, og_description: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Social Preview Share Image URL (1200x630)</label>
            <input
              type="url"
              value={formData.og_image || ''}
              onChange={(e) => setFormData({ ...formData, og_image: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden font-mono"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={formData.index_site ?? true}
                onChange={(e) => setFormData({ ...formData, index_site: e.target.checked })}
                className="w-4 h-4 rounded-sm accent-red-600"
              />
              <span>Allow Google & Search Engines to Index this Website (robots.txt index, follow)</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition shadow-md shadow-red-600/20 text-sm cursor-pointer"
          >
            Save All SEO Configurations
          </button>
        </div>

      </form>

    </div>
  );
};
