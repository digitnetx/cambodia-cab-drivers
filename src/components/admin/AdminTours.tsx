import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Tour } from '../../types';
import { Plus, Edit, Trash2, CheckCircle2, Star, Eye, X, Image as ImageIcon } from 'lucide-react';
import { slugify } from '../../lib/utils';
import { ImageUploadField } from './ImageUploadField';
import { api } from '../../lib/api';
import { featuredImageSrc } from '../../lib/images';

export const AdminTours: React.FC = () => {
  const { tours, saveTour, deleteTour } = useApp();
  const [editingTour, setEditingTour] = useState<Partial<Tour> | null>(null);
  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleCreateNew = () => {
    setSaveError('');
    setEditingTour({
      title: '',
      slug: '',
      short_description: '',
      description: '',
      duration: 'Full Day (8 Hours)',
      starting_price: 75,
      currency: 'USD',
      pickup_location: 'Hotel Pickup',
      vehicle_type: 'SUV',
      sort_order: tours.length + 1,
      departure_time: '08:00 AM',
      highlights: ['Temple highlights', 'Air-conditioned transfer'],
      itinerary: [{ title: '08:00 AM - Pickup', description: 'Hotel lobby pickup by professional English-speaking driver' }],
      included: ['Private air-conditioned car', 'Bottled water', 'Professional English-speaking driver'],
      excluded: ['Admission pass', 'Meals'],
      important_information: ['Respectful dress code required'],
      featured_image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
      gallery: [],
      is_featured: false,
      is_active: true,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTour || isSaving) return;
    setSaveError('');
    setIsSaving(true);
    const baseSlug = editingTour.slug || slugify(editingTour.title || 'new-tour');
    const usedSlugs = new Set(tours.filter(tour => tour.id !== editingTour.id).map(tour => tour.slug));
    let finalSlug = baseSlug;
    let suffix = 2;
    while (usedSlugs.has(finalSlug)) {
      finalSlug = `${baseSlug}-${suffix++}`;
    }
    try {
      const saved = await saveTour({ ...editingTour, slug: finalSlug });
      if (saved) setEditingTour(null);
      else setSaveError(api.getLastWriteError() || 'Supabase could not save this tour.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Tour Content Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create, edit, feature, and publish sightseeing tours.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Tour</span>
        </button>
      </div>

      {/* Tour List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tours.map((tour) => (
          <div key={tour.id} className="bg-white border border-slate-200/90 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xs hover:border-slate-300 transition">
            <div className="space-y-3">
              <div className="relative h-40 rounded-xl overflow-hidden bg-slate-100">
                <img src={featuredImageSrc(tour)} alt={tour.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 flex gap-1">
                  {tour.is_featured && (
                    <span className="bg-[#C9A227] text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md shadow-xs">
                      Featured
                    </span>
                  )}
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${tour.is_active ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-200'}`}>
                    {tour.is_active ? 'Active' : 'Draft'}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 font-sans">{tour.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{tour.short_description}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => { setSaveError(''); setEditingTour(tour); }}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs flex items-center gap-1 font-bold cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete tour "${tour.title}"?`)) deleteTour(tour.id);
                  }}
                  className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <span className="text-[11px] text-slate-400 font-medium">{tour.duration}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Editor Modal */}
      {editingTour && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSave} className="bg-white border border-slate-200/90 rounded-2xl max-w-3xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            
            <button
              type="button"
              onClick={() => setEditingTour(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-900 font-sans border-b border-slate-100 pb-3">
              {editingTour.id ? 'Edit Tour' : 'Create New Tour'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={editingTour.title || ''}
                  onChange={(e) => setEditingTour({ ...editingTour, title: e.target.value, slug: slugify(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Slug URL</label>
                <input
                  type="text"
                  value={editingTour.slug || ''}
                  onChange={(e) => setEditingTour({ ...editingTour, slug: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Duration</label>
                <input
                  type="text"
                  value={editingTour.duration || ''}
                  onChange={(e) => setEditingTour({ ...editingTour, duration: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pickup Location</label>
                <input
                  type="text"
                  value={editingTour.pickup_location || ''}
                  onChange={(e) => setEditingTour({ ...editingTour, pickup_location: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Starting Price</label>
                <input type="number" min="0" value={editingTour.starting_price ?? ''} onChange={(e) => setEditingTour({ ...editingTour, starting_price: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Currency</label>
                <input value={editingTour.currency || 'USD'} onChange={(e) => setEditingTour({ ...editingTour, currency: e.target.value.toUpperCase() })} maxLength={10} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Vehicle Type</label>
                <input value={editingTour.vehicle_type || ''} onChange={(e) => setEditingTour({ ...editingTour, vehicle_type: e.target.value })} placeholder="SUV, Sedan, Van..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Display Order</label>
                <input type="number" min="1" value={editingTour.sort_order ?? 1} onChange={(e) => setEditingTour({ ...editingTour, sort_order: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white" />
              </div>

              <div className="sm:col-span-2"><ImageUploadField label="Featured Image — URL, Storage, or Database" value={editingTour.featured_image} binaryData={editingTour.featured_image_data} binaryMime={editingTour.featured_image_mime} onChange={(featured_image) => setEditingTour({ ...editingTour, featured_image })} onDatabaseImageChange={(featured_image_data, featured_image_mime) => setEditingTour({ ...editingTour, featured_image_data, featured_image_mime })} /></div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Highlights (one per line)</label>
                <textarea rows={3} value={(editingTour.highlights || []).join('\n')} onChange={(e) => setEditingTour({ ...editingTour, highlights: e.target.value.split('\n').map(x => x.trim()).filter(Boolean) })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Included items (one per line)</label>
                <textarea rows={3} value={(editingTour.included || []).join('\n')} onChange={(e) => setEditingTour({ ...editingTour, included: e.target.value.split('\n').map(x => x.trim()).filter(Boolean) })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Excluded items (one per line)</label>
                <textarea rows={3} value={(editingTour.excluded || []).join('\n')} onChange={(e) => setEditingTour({ ...editingTour, excluded: e.target.value.split('\n').map(x => x.trim()).filter(Boolean) })} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={editingTour.short_description || ''}
                  onChange={(e) => setEditingTour({ ...editingTour, short_description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Description</label>
                <textarea
                  rows={4}
                  value={editingTour.description || ''}
                  onChange={(e) => setEditingTour({ ...editingTour, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:border-red-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-6 sm:col-span-2 pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-800 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingTour.is_featured || false}
                    onChange={(e) => setEditingTour({ ...editingTour, is_featured: e.target.checked })}
                    className="accent-red-600 w-4 h-4"
                  />
                  <span>Feature on Homepage</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-800 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingTour.is_active ?? true}
                    onChange={(e) => setEditingTour({ ...editingTour, is_active: e.target.checked })}
                    className="accent-red-600 w-4 h-4"
                  />
                  <span>Published / Active</span>
                </label>
              </div>
            </div>

            {saveError && (
              <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-medium text-red-700">
                Save failed: {saveError}
              </p>
            )}

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => { setSaveError(''); setEditingTour(null); }}
                disabled={isSaving}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer disabled:cursor-not-allowed"
              >
                {isSaving ? 'Saving…' : 'Save Tour'}
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
};
