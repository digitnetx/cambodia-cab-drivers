import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Destination } from '../../types';
import { Plus, Edit, Trash2, MapPin, X } from 'lucide-react';
import { slugify } from '../../lib/utils';
import { ImageUploadField } from './ImageUploadField';

export const AdminDestinations: React.FC = () => {
  const { destinations, saveDestination, deleteDestination } = useApp();
  const [editingDest, setEditingDest] = useState<Partial<Destination> | null>(null);

  const handleCreateNew = () => {
    setEditingDest({
      name: '',
      slug: '',
      short_description: '',
      description: '',
      things_to_do: ['Sightseeing', 'Local Food Market'],
      travel_tips: '',
      sort_order: destinations.length + 1,
      featured_image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?q=80&w=1200&auto=format&fit=crop',
      gallery: [],
      is_featured: false,
      is_active: true,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDest) return;
    const finalSlug = editingDest.slug || slugify(editingDest.name || 'new-dest');
    await saveDestination({ ...editingDest, slug: finalSlug });
    setEditingDest(null);
  };

  return (
    <div className="space-y-6 font-sans text-slate-800 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <MapPin className="w-6 h-6 text-red-600" /> Destination Management
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage Cambodian cities, temple regions, and coastal provinces.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-md shadow-red-600/20 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Destination</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((dest) => (
          <div key={dest.id} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xs hover:border-red-300 transition">
            <div className="space-y-3">
              <div className="relative h-36 rounded-xl overflow-hidden bg-slate-100">
                <img src={dest.featured_image} alt={dest.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 flex gap-1">
                  {dest.is_featured && (
                    <span className="bg-red-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md shadow-md">
                      Featured
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 font-sans flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-red-600" />
                  {dest.name}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 mt-1">{dest.short_description}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingDest(dest)}
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete destination "${dest.name}"?`)) deleteDestination(dest.id);
                  }}
                  className="p-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-xs transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingDest && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative text-slate-800">
            <button
              type="button"
              onClick={() => setEditingDest(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-900 font-sans border-b border-slate-200 pb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-600" />
              {editingDest.id ? 'Edit Destination' : 'Add Destination'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={editingDest.name || ''}
                  onChange={(e) => setEditingDest({ ...editingDest, name: e.target.value, slug: slugify(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-red-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Slug URL</label>
                <input
                  type="text"
                  value={editingDest.slug || ''}
                  onChange={(e) => setEditingDest({ ...editingDest, slug: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-red-500 focus:bg-white font-mono"
                />
              </div>

              <div className="sm:col-span-2"><ImageUploadField label="Featured Image — URL or upload" value={editingDest.featured_image} onChange={(featured_image) => setEditingDest({ ...editingDest, featured_image })} /></div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={editingDest.short_description || ''}
                  onChange={(e) => setEditingDest({ ...editingDest, short_description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-red-500 focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Description</label>
                <textarea
                  rows={4}
                  value={editingDest.description || ''}
                  onChange={(e) => setEditingDest({ ...editingDest, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-red-500 focus:bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Things to Do (one per line)</label>
                <textarea rows={3} value={(editingDest.things_to_do || []).join('\n')} onChange={(e) => setEditingDest({ ...editingDest, things_to_do: e.target.value.split('\n').map(x => x.trim()).filter(Boolean) })} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-red-500 focus:bg-white" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Travel Tips</label>
                <textarea rows={3} value={editingDest.travel_tips || ''} onChange={(e) => setEditingDest({ ...editingDest, travel_tips: e.target.value })} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-red-500 focus:bg-white" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Display Order</label>
                <input type="number" min="1" value={editingDest.sort_order ?? 1} onChange={(e) => setEditingDest({ ...editingDest, sort_order: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-red-500 focus:bg-white" />
              </div>

              <div className="flex items-center gap-6 sm:col-span-2">
                <label className="flex items-center gap-2 text-xs text-slate-700 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingDest.is_featured || false}
                    onChange={(e) => setEditingDest({ ...editingDest, is_featured: e.target.checked })}
                    className="accent-red-600 w-4 h-4 bg-slate-50 border-slate-300"
                  />
                  <span>Feature on Homepage</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-700 font-semibold cursor-pointer">
                  <input type="checkbox" checked={editingDest.is_active ?? true} onChange={(e) => setEditingDest({ ...editingDest, is_active: e.target.checked })} className="accent-red-600 w-4 h-4" />
                  <span>Published / Active</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingDest(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs rounded-xl border border-slate-200 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md shadow-red-600/20 transition cursor-pointer"
              >
                Save Destination
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
