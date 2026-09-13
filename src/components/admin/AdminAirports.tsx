import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Airport } from '../../types';
import { Plane, Plus, Edit, Trash2, X, Search, CheckCircle2, MapPin } from 'lucide-react';
import { ImageUploadField } from './ImageUploadField';
import { imageSrc } from '../../lib/images';

export const AdminAirports: React.FC = () => {
  const { airports = [], saveAirport, deleteAirport, routes = [], siteSettings } = useApp();
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);

  const [formData, setFormData] = useState<Partial<Airport>>({});

  const filteredAirports = (airports || []).filter((a) =>
    a && (
      (a.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (a.code || '').toLowerCase().includes(search.toLowerCase()) ||
      (a.city || '').toLowerCase().includes(search.toLowerCase())
    )
  );

  const handleOpenCreate = () => {
    setSelectedAirport(null);
    setFormData({
      code: '',
      name: '',
      city: '',
      province: '',
      description: '',
      image_url: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=1000&auto=format&fit=crop',
      pickup_instructions: `${siteSettings.driver_name} monitors your flight number and waits inside the arrival gate holding a sign with your name.`,
      is_active: true,
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (a: Airport) => {
    setSelectedAirport(a);
    setFormData(a);
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) {
      alert('Please fill airport name and code');
      return;
    }
    await saveAirport(formData);
    setIsEditing(false);
    setSelectedAirport(null);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete airport "${name}"?`)) {
      await deleteAirport(id);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-slate-800">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Plane className="w-6 h-6 text-red-600" /> Airport Transfer Hubs
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Configure airport hubs (PNH, SAI, KOS), meet & greet instructions, and linked airport taxi routes.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-red-600/20 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Airport Hub
        </button>
      </div>

      {/* Grid of Airports */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAirports.map((a) => {
          return (
            <div 
              key={a.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-red-400 transition shadow-xs"
            >
              <div className="relative h-44 bg-slate-100 overflow-hidden">
                <img 
                  src={imageSrc(a)}
                  alt={a.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 bg-red-600 text-white font-mono font-black text-xs px-2.5 py-1 rounded-lg shadow-md">
                  {a.code}
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-bold text-base text-white truncate drop-shadow-md">
                    {a.name}
                  </h3>
                  <div className="text-[11px] text-red-300 flex items-center gap-1 font-semibold">
                    <MapPin className="w-3.5 h-3.5" /> {a.city}, Cambodia
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3 text-xs">
                <p className="text-slate-600 line-clamp-2">{a.description}</p>

                <div className="bg-[#FAF9F6] p-3 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider block">
                    Pickup Instructions
                  </span>
                  <p className="text-slate-600 text-[11px] line-clamp-3">
                    {a.pickup_instructions}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between">
                <span className={`text-[11px] font-semibold flex items-center gap-1.5 ${a.is_active ? 'text-emerald-600' : 'text-slate-400'}`}>
                  <span className={`w-2 h-2 rounded-full ${a.is_active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  {a.is_active ? 'Active on Site' : 'Inactive'}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(a)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition flex items-center gap-1 border border-slate-200 cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(a.id, a.name)}
                    className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition border border-red-200 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Edit / Create Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl max-h-[calc(100dvh-1.5rem)] overflow-y-auto overscroll-contain p-4 sm:p-6 shadow-2xl space-y-5 my-auto text-slate-800">
            
            <div className="sticky top-0 z-10 -mx-4 sm:-mx-6 -mt-4 sm:-mt-6 px-4 sm:px-6 pt-4 sm:pt-6 pb-4 bg-white flex items-center justify-between gap-3 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Plane className="w-5 h-5 text-red-600" />
                {selectedAirport ? `Edit Airport: ${selectedAirport.code}` : 'Add Airport Hub'}
              </h2>
              <button onClick={() => setIsEditing(false)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">IATA Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PNH"
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-mono uppercase font-bold focus:border-red-500 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">Airport Official Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Phnom Penh International Airport"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">City / Region</label>
                  <input
                    type="text"
                    placeholder="e.g. Phnom Penh"
                    value={formData.city || ''}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Province</label>
                  <input
                    type="text"
                    placeholder="e.g. Phnom Penh"
                    value={formData.province || ''}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <ImageUploadField label="Airport Image — URL, Storage, or Database" value={formData.image_url} binaryData={formData.image_data} binaryMime={formData.image_mime} onChange={(image_url) => setFormData({ ...formData, image_url })} onDatabaseImageChange={(image_data, image_mime) => setFormData({ ...formData, image_data, image_mime })} />

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Arrival Pickup Instructions for Passengers</label>
                <textarea
                  rows={3}
                  value={formData.pickup_instructions || ''}
                  onChange={(e) => setFormData({ ...formData, pickup_instructions: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="pt-2">
                <label className="block text-slate-700 font-semibold mb-1">Display Order</label>
                <input type="number" min="1" value={formData.sort_order ?? 1} onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })} className="w-full p-2.5 mb-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900" />
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.is_active ?? true}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 rounded-sm accent-red-600 bg-slate-50 border-slate-300"
                  />
                  <span>Active Airport Hub on Website</span>
                </label>
              </div>

              <div className="sticky bottom-0 -mx-4 sm:-mx-6 px-4 sm:px-6 pb-1 pt-4 bg-white flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 border-t border-slate-200">
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
                  Save Airport
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
