import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Service } from '../../types';
import { Layers, Plus, Edit, Trash2, X, Star, DollarSign, Check } from 'lucide-react';
import { ImageUploadField } from './ImageUploadField';

export const AdminServices: React.FC = () => {
  const { services, saveService, deleteService, siteSettings } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const [formData, setFormData] = useState<Partial<Service>>({});
  const [featureInput, setFeatureInput] = useState('');

  const handleOpenCreate = () => {
    setSelectedService(null);
    setFormData({
      name: '',
      slug: '',
      short_description: '',
      description: '',
      icon: 'Car',
      featured_image: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=1200&auto=format&fit=crop',
      starting_price: 15,
      currency: siteSettings.currency_settings.default_currency || 'USD',
      features: ['Air conditioning', 'English speaking driver', 'Cold water'],
      included_items: ['Vehicle with fuel', 'Tolls & parking', 'Flight monitoring'],
      cta_text: 'Book Service',
      cta_link: '/book',
      is_featured: true,
      is_active: true,
      sort_order: services.length + 1,
    });
    setFeatureInput('');
    setIsEditing(true);
  };

  const handleOpenEdit = (s: Service) => {
    setSelectedService(s);
    setFormData(s);
    setFeatureInput('');
    setIsEditing(true);
  };

  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    const current = formData.features || [];
    setFormData({ ...formData, features: [...current, featureInput.trim()] });
    setFeatureInput('');
  };

  const handleRemoveFeature = (idx: number) => {
    const current = formData.features || [];
    setFormData({ ...formData, features: current.filter((_, i) => i !== idx) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Please enter service name');
      return;
    }
    const slug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    await saveService({ ...formData, slug });
    setIsEditing(false);
    setSelectedService(null);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete service "${name}"?`)) {
      await deleteService(id);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-slate-800">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-red-600" /> Services CMS
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage your core transportation services: Airport Transfers, City Taxi, Overland Routes, and Private Driver Tours.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-red-600/20 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s) => (
          <div 
            key={s.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-red-400 transition shadow-xs"
          >
            <div className="relative h-48 bg-slate-100 overflow-hidden">
              <img 
                src={s.featured_image} 
                alt={s.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
              
              <div className="absolute top-3 left-3 flex gap-1.5">
                {s.is_featured && (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-red-600 text-white shadow-md">
                    Featured
                  </span>
                )}
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div>
                  <h3 className="font-bold text-base text-white drop-shadow-md">{s.name}</h3>
                  <div className="text-xs text-slate-200 font-mono">/{s.slug}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-200 uppercase block">From</span>
                  <span className="text-lg font-black text-white">${s.starting_price}</span>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <p className="text-slate-600 line-clamp-2">{s.short_description || s.description}</p>

              <div className="flex flex-wrap gap-1">
                {s.features?.slice(0, 3).map((f, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] text-slate-700">
                    ✓ {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between">
              <span className={`text-[11px] font-semibold flex items-center gap-1.5 ${s.is_active ? 'text-emerald-600' : 'text-slate-500'}`}>
                <span className={`w-2 h-2 rounded-full ${s.is_active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                {s.is_active ? 'Active' : 'Draft'}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(s)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition flex items-center gap-1 border border-slate-200 cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(s.id, s.name)}
                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition border border-red-200 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-5 my-8 text-slate-800">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-red-600" />
                {selectedService ? `Edit Service: ${selectedService.name}` : 'Add New Service'}
              </h2>
              <button onClick={() => setIsEditing(false)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Service Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Airport Transfers"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">URL Slug</label>
                  <input
                    type="text"
                    placeholder="e.g. airport-transfers"
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Starting Price ($ USD)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.starting_price || 0}
                    onChange={(e) => setFormData({ ...formData, starting_price: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:border-red-500 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2"><ImageUploadField label="Featured Image — URL or upload" value={formData.featured_image} onChange={(featured_image) => setFormData({ ...formData, featured_image })} /></div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Currency</label>
                  <input type="text" maxLength={10} value={formData.currency || 'USD'} onChange={(e) => setFormData({ ...formData, currency: e.target.value.toUpperCase() })} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden" />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Display Order</label>
                  <input type="number" min="1" value={formData.sort_order ?? 1} onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden" />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Short Description (for cards)</label>
                <input
                  type="text"
                  value={formData.short_description || ''}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Full Detailed Description</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* Features List */}
              <div className="space-y-2">
                <label className="block text-slate-700 font-semibold">Bullet Features</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Flight delay monitoring"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddFeature(); } }}
                    className="flex-1 p-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition border border-slate-200 cursor-pointer"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {formData.features?.map((f, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700">
                      {f}
                      <button type="button" onClick={() => handleRemoveFeature(i)} className="text-slate-400 hover:text-red-600 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.is_featured ?? false}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4 rounded-sm accent-red-600"
                  />
                  <span>Featured Service on Homepage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.is_active ?? true}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 rounded-sm accent-red-600"
                  />
                  <span>Active & Published</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition border border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition shadow-md cursor-pointer"
                >
                  Save Service
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
