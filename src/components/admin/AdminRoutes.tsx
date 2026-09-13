import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RoutePricing } from '../../types';
import { Route, Plus, Edit, Trash2, Check, X, Search, DollarSign, Clock, MapPin, Sparkles } from 'lucide-react';
import { ImageUploadField } from './ImageUploadField';
import { imageSrc } from '../../lib/images';

export const AdminRoutes: React.FC = () => {
  const { routes = [], saveRoute, deleteRoute, siteSettings } = useApp();
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<RoutePricing | null>(null);

  const [formData, setFormData] = useState<Partial<RoutePricing>>({});

  const filteredRoutes = (routes || []).filter((r) =>
    r && (
      (r.route_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.origin || '').toLowerCase().includes(search.toLowerCase()) ||
      (r.destination || '').toLowerCase().includes(search.toLowerCase())
    )
  );

  const handleOpenCreate = () => {
    setSelectedRoute(null);
    setFormData({
      route_name: '',
      slug: '',
      origin: '',
      destination: '',
      estimated_duration: '3 hours',
      distance_km: 150,
      sedan_price: 50,
      suv_price: 70,
      van_price: 100,
      currency: siteSettings.currency_settings.default_currency || 'USD',
      is_popular: true,
      is_airport: false,
      description: '',
      highlights: ['Air conditioned', 'Door-to-door transfer', 'Complimentary cold water'],
      image_url: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=800&auto=format&fit=crop',
      is_published: true,
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (r: RoutePricing) => {
    setSelectedRoute(r);
    setFormData(r);
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.origin || !formData.destination) {
      alert('Please enter origin and destination');
      return;
    }
    const slug = formData.slug || `${formData.origin}-to-${formData.destination}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const route_name = formData.route_name || `${formData.origin} ↔ ${formData.destination}`;

    await saveRoute({
      ...formData,
      slug,
      route_name,
    });
    setIsEditing(false);
    setSelectedRoute(null);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete route "${name}"?`)) {
      await deleteRoute(id);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-slate-800">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Route className="w-6 h-6 text-red-600" /> Routes & Pricing Manager
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage fixed transparent taxi fares between cities, provinces, and airports across Cambodia.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-red-600/20 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add New Route
        </button>
      </div>

      {/* Search & Stats Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search routes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-red-500 focus:bg-white"
          />
        </div>

        <div className="text-xs text-slate-600 flex items-center gap-4">
          <span>Total Routes: <strong className="text-slate-900">{routes.length}</strong></span>
          <span>Airport Routes: <strong className="text-slate-900">{routes.filter(r => r.is_airport).length}</strong></span>
          <span>Popular Routes: <strong className="text-red-600">{routes.filter(r => r.is_popular).length}</strong></span>
        </div>
      </div>

      {/* Routes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRoutes.map((r) => (
          <div 
            key={r.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-red-400 transition group shadow-xs"
          >
            {/* Image Preview & Badges */}
            <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
              <img 
                src={imageSrc(r) || 'https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=800&auto=format&fit=crop'}
                alt={r.route_name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
              
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                {r.is_popular && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-red-600 text-white shadow-md">
                    Popular Route
                  </span>
                )}
                {r.is_airport && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-black/60 text-white backdrop-blur-xs">
                    ✈️ Airport ({r.airport_code || 'Apt'})
                  </span>
                )}
              </div>

              <div className="absolute bottom-3 left-3 right-3">
                <h3 className="font-bold text-base text-white truncate drop-shadow-md">
                  {r.route_name}
                </h3>
                <div className="flex items-center gap-3 text-[11px] text-slate-200 mt-0.5">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-red-400" /> {r.estimated_duration}</span>
                  <span>•</span>
                  <span>{r.distance_km} km</span>
                </div>
              </div>
            </div>

            {/* Pricing Matrix */}
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-3 gap-2 bg-[#FAF9F6] p-2.5 rounded-xl border border-slate-200 text-center">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Sedan</span>
                  <span className="text-sm font-black text-slate-900">${r.sedan_price}</span>
                </div>
                <div className="border-x border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">SUV</span>
                  <span className="text-sm font-black text-slate-900">${r.suv_price}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Van</span>
                  <span className="text-sm font-black text-slate-900">${r.van_price}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2">
                {r.description || `${r.origin} to ${r.destination} private door-to-door taxi transfer.`}
              </p>
            </div>

            {/* Footer Actions */}
            <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className={`w-2 h-2 rounded-full ${r.is_published ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                <span className="text-slate-600">{r.is_published ? 'Published' : 'Hidden'}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(r)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(r.id, r.route_name)}
                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[calc(100dvh-1.5rem)] overflow-y-auto overscroll-contain p-4 sm:p-6 shadow-2xl space-y-5 my-auto text-slate-800">
            
            <div className="sticky top-0 z-10 -mx-4 sm:-mx-6 -mt-4 sm:-mt-6 px-4 sm:px-6 pt-4 sm:pt-6 pb-4 bg-white flex items-center justify-between gap-3 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Route className="w-5 h-5 text-red-600" />
                {selectedRoute ? `Edit Route: ${selectedRoute.route_name}` : 'Add New Route & Pricing'}
              </h2>
              <button onClick={() => setIsEditing(false)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Origin (Pickup City / Point) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Phnom Penh"
                    value={formData.origin || ''}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Destination (Drop-off) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Siem Reap (Angkor Wat)"
                    value={formData.destination || ''}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Route Display Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Phnom Penh ↔ Siem Reap"
                    value={formData.route_name || ''}
                    onChange={(e) => setFormData({ ...formData, route_name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">URL Slug</label>
                  <input
                    type="text"
                    placeholder="e.g. phnom-penh-to-siem-reap-taxi"
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Estimated Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 5 - 6 hours"
                    value={formData.estimated_duration || ''}
                    onChange={(e) => setFormData({ ...formData, estimated_duration: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Distance (km)</label>
                  <input
                    type="number"
                    value={formData.distance_km || 0}
                    onChange={(e) => setFormData({ ...formData, distance_km: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-slate-700 font-semibold mb-1">Airport Code (If Airport Route)</label>
                  <input
                    type="text"
                    placeholder="PNH, SAI, or KOS"
                    value={formData.airport_code || ''}
                    onChange={(e) => setFormData({ ...formData, airport_code: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              {/* Price Matrix */}
              <div className="bg-[#FAF9F6] p-4 rounded-xl border border-slate-200 space-y-3">
                <label className="block text-slate-900 font-bold uppercase tracking-wider text-[11px]">
                  Fixed Vehicle Pricing ($ USD)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1">Sedan Rate ($)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.sedan_price || 0}
                      onChange={(e) => setFormData({ ...formData, sedan_price: Number(e.target.value) })}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-bold focus:border-red-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1">SUV Rate ($)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.suv_price || 0}
                      onChange={(e) => setFormData({ ...formData, suv_price: Number(e.target.value) })}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-bold focus:border-red-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1">Executive Van Rate ($)</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.van_price || 0}
                      onChange={(e) => setFormData({ ...formData, van_price: Number(e.target.value) })}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-bold focus:border-red-500 focus:outline-hidden"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="block text-slate-600 text-[11px] mb-1">Currency</label><input value={formData.currency || 'USD'} maxLength={10} onChange={(e) => setFormData({ ...formData, currency: e.target.value.toUpperCase() })} className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900" /></div>
                  <div><label className="block text-slate-600 text-[11px] mb-1">Display Order</label><input type="number" min="1" value={formData.sort_order ?? 1} onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })} className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-900" /></div>
                </div>
              </div>

              <ImageUploadField label="Route Image — URL, Storage, or Database" value={formData.image_url} binaryData={formData.image_data} binaryMime={formData.image_mime} onChange={(image_url) => setFormData({ ...formData, image_url })} onDatabaseImageChange={(image_data, image_mime) => setFormData({ ...formData, image_data, image_mime })} />

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Route Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief overview of road conditions, stops, scenery..."
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.is_popular ?? false}
                    onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                    className="w-4 h-4 rounded-sm accent-red-600"
                  />
                  <span>Popular / Highlight Route</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.is_airport ?? false}
                    onChange={(e) => setFormData({ ...formData, is_airport: e.target.checked })}
                    className="w-4 h-4 rounded-sm accent-red-600"
                  />
                  <span>Airport Transfer Route</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.is_published ?? true}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="w-4 h-4 rounded-sm accent-red-600"
                  />
                  <span>Published on Website</span>
                </label>
              </div>

              <div className="sticky bottom-0 -mx-4 sm:-mx-6 px-4 sm:px-6 pb-1 pt-4 bg-white flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition shadow-md shadow-red-600/20 cursor-pointer"
                >
                  Save Route
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
