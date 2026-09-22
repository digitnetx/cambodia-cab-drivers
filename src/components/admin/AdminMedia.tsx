import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MediaItem } from '../../types';
import { Image as ImageIcon, Plus, Trash2, Copy, Check, X, Search, Filter } from 'lucide-react';
import { ImageUploadField } from './ImageUploadField';
import { featuredImageSrc } from '../../lib/images';

export const AdminMedia: React.FC = () => {
  const { mediaItems = [], saveMediaItem, deleteMediaItem, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAdding, setIsAdding] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<MediaItem>>({
    title: '',
    url: '',
    category: 'general',
  });

  const filteredMedia = (mediaItems || []).filter((m) => {
    if (!m) return false;
    const matchesSearch = (m.title || '').toLowerCase().includes(search.toLowerCase()) || (m.url || '').toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'all' || m.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast('Image URL copied to clipboard!', 'info');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || (!formData.url && !formData.binary_data)) {
      alert('Please provide an asset title and either an image URL or an uploaded image.');
      return;
    }
    await saveMediaItem(formData);
    setIsAdding(false);
    setFormData({ title: '', url: '', category: 'general' });
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Remove "${title}" from Media Library?`)) {
      await deleteMediaItem(id);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-slate-800">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <ImageIcon className="w-6 h-6 text-red-600" /> Media & Photo Library
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Store and organize high-resolution photos for vehicles, tours, destinations, and homepage banners.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-red-600/20 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Photo / Asset
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search photos by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-red-500 focus:bg-white"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 text-xs">
          {['all', 'hero', 'vehicles', 'tours', 'destinations', 'services', 'general'].map((cat) => {
            const count = cat === 'all' 
              ? mediaItems.length 
              : mediaItems.filter(m => m.category === cat).length;
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-bold capitalize whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

      </div>

      {/* Grid of Media Assets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredMedia.map((m) => {
          const isCopied = copiedId === m.id;
          return (
            <div 
              key={m.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-red-400 transition group shadow-xs"
            >
              <div className="relative h-44 bg-slate-100 overflow-hidden">
                <img 
                  src={featuredImageSrc({ featured_image: m.url, featured_image_data: m.binary_data, featured_image_mime: m.mime_type })}
                  alt={m.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
                
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-black/60 text-white backdrop-blur-xs">
                  {m.category}
                </span>

                <div className="absolute bottom-2 left-2 right-2">
                  <h3 className="font-bold text-xs text-white truncate drop-shadow-md">
                    {m.title}
                  </h3>
                </div>
              </div>

              <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => m.url ? handleCopy(m.url, m.id) : showToast('Database images are saved directly in Supabase and do not have a shareable URL.', 'info')}
                  className={`flex-1 flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    isCopied
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  }`}
                >
                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Copied' : m.url ? 'Copy URL' : 'BYTEA image'}</span>
                </button>

                <button
                  onClick={() => handleDelete(m.id, m.title)}
                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition border border-red-200 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add Media Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md max-h-[calc(100dvh-1.5rem)] overflow-y-auto overscroll-contain p-4 sm:p-6 shadow-2xl space-y-5 my-auto text-slate-800">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-red-600" />
                Add Image to Library
              </h2>
              <button onClick={() => setIsAdding(false)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Asset Title / Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Angkor Wat Sunrise Golden Hour"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <ImageUploadField
                label="Image — paste URL, upload to Storage, or store directly in Database"
                value={formData.url || ''}
                binaryData={formData.binary_data}
                binaryMime={formData.mime_type}
                onChange={(url) => setFormData({ ...formData, url, binary_data: null, mime_type: null, storage_type: 'url' })}
                onDatabaseImageChange={(binary_data, mime_type) => setFormData({
                  ...formData,
                  url: binary_data ? '' : formData.url,
                  binary_data,
                  mime_type,
                  storage_type: binary_data ? 'bytea' : 'url',
                })}
              />

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Category</label>
                <select
                  value={formData.category || 'general'}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
                >
                  <option value="hero">Hero / Banners</option>
                  <option value="vehicles">Vehicles</option>
                  <option value="tours">Tours</option>
                  <option value="destinations">Destinations</option>
                  <option value="services">Services</option>
                  <option value="general">General</option>
                </select>
              </div>

              {(formData.url || formData.binary_data) && (
                <div className="rounded-xl overflow-hidden border border-slate-200 h-32 bg-slate-100">
                  <img src={featuredImageSrc({ featured_image: formData.url, featured_image_data: formData.binary_data, featured_image_mime: formData.mime_type })} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition shadow-md shadow-red-600/20 cursor-pointer"
                >
                  Add Photo
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
