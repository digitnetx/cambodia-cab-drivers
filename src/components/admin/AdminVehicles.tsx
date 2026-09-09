import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Vehicle } from '../../types';
import { Car, Plus, Edit, Trash2, X, Users, Briefcase, Wind, Check } from 'lucide-react';

export const AdminVehicles: React.FC = () => {
  const { vehicles, saveVehicle, deleteVehicle, siteSettings } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const [formData, setFormData] = useState<Partial<Vehicle>>({});
  const [featureInput, setFeatureInput] = useState('');

  const handleOpenCreate = () => {
    setSelectedVehicle(null);
    setFormData({
      name: '',
      category: 'sedan',
      models: '',
      capacity_passengers: 3,
      capacity_luggage: 3,
      description: '',
      price_from: 15,
      currency: siteSettings.currency_settings.default_currency || 'USD',
      features: ['Air Conditioning', 'Cold Water', 'USB Mobile Charger'],
      image_url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1000&auto=format&fit=crop',
      has_air_con: true,
      is_popular: false,
      is_active: true,
      sort_order: vehicles.length + 1,
    });
    setFeatureInput('');
    setIsEditing(true);
  };

  const handleOpenEdit = (v: Vehicle) => {
    setSelectedVehicle(v);
    setFormData(v);
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
    if (!formData.name || !formData.models) {
      alert('Please fill in vehicle name and models');
      return;
    }
    await saveVehicle(formData);
    setIsEditing(false);
    setSelectedVehicle(null);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete vehicle "${name}" from fleet?`)) {
      await deleteVehicle(id);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-slate-800">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Car className="w-6 h-6 text-red-600" /> Vehicle Fleet Manager
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage your Sedan, SUV, and Minivan models, passenger capacity, luggage limits, and starting prices.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-red-600/20 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Vehicle
        </button>
      </div>

      {/* Grid of Vehicles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((v) => (
          <div 
            key={v.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:border-red-400 transition shadow-xs"
          >
            <div className="relative h-48 bg-slate-100 overflow-hidden">
              <img 
                src={v.image_url} 
                alt={v.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent" />
              
              <div className="absolute top-3 left-3 flex gap-1.5">
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold uppercase bg-red-600 text-white shadow-xs">
                  {v.category}
                </span>
                {v.is_popular && (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#C9A227] text-white shadow-xs">
                    Most Popular
                  </span>
                )}
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div>
                  <h3 className="font-bold text-base text-white drop-shadow-md">{v.name}</h3>
                  <div className="text-xs text-slate-200 font-medium drop-shadow-md">{v.models}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-200 uppercase block">From</span>
                  <span className="text-lg font-black text-white">${v.price_from}</span>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <div className="flex items-center gap-4 bg-[#FAF9F6] p-2.5 rounded-xl border border-slate-200 text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-red-600" /> {v.capacity_passengers} Pax Max
                </span>
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-slate-500" /> {v.capacity_luggage} Suitcases
                </span>
                <span className="flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-slate-600" /> Ice Cold AC
                </span>
              </div>

              <p className="text-slate-600 line-clamp-2">{v.description}</p>

              {/* Features Tags */}
              <div className="flex flex-wrap gap-1">
                {v.features?.map((f, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] text-slate-600">
                    ✓ {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between">
              <span className={`text-[11px] font-semibold flex items-center gap-1.5 ${v.is_active ? 'text-emerald-600' : 'text-slate-500'}`}>
                <span className={`w-2 h-2 rounded-full ${v.is_active ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                {v.is_active ? 'Active Fleet' : 'Inactive'}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(v)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition flex items-center gap-1 border border-slate-200 cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(v.id, v.name)}
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
                <Car className="w-5 h-5 text-red-600" />
                {selectedVehicle ? `Edit Vehicle: ${selectedVehicle.name}` : 'Add New Vehicle'}
              </h2>
              <button onClick={() => setIsEditing(false)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Category</label>
                  <select
                    value={formData.category || 'sedan'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
                  >
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV / Crossover</option>
                    <option value="van">Executive Van</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">Vehicle Display Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Comfort Sedan (1-3 Pax)"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Vehicle Models Description *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Toyota Camry / Prius Hybrid"
                    value={formData.models || ''}
                    onChange={(e) => setFormData({ ...formData, models: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Starting Price ($ USD)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.price_from || 0}
                    onChange={(e) => setFormData({ ...formData, price_from: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:border-red-500 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Currency</label>
                  <input value={formData.currency || 'USD'} maxLength={10} onChange={(e) => setFormData({ ...formData, currency: e.target.value.toUpperCase() })} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900" />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Display Order</label>
                  <input type="number" min="1" value={formData.sort_order ?? 1} onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })} className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900" />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Max Passenger Capacity</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formData.capacity_passengers || 3}
                    onChange={(e) => setFormData({ ...formData, capacity_passengers: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Max Suitcase Capacity</label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={formData.capacity_luggage || 3}
                    onChange={(e) => setFormData({ ...formData, capacity_luggage: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Photo / Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.image_url || ''}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* Features List */}
              <div className="space-y-2">
                <label className="block text-slate-700 font-semibold">Vehicle Features & Amenities</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Free Wi-Fi, Phone Charger, Leather Seats"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddFeature(); } }}
                    className="flex-1 p-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition border border-slate-300 cursor-pointer"
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
                    checked={formData.has_air_con ?? true}
                    onChange={(e) => setFormData({ ...formData, has_air_con: e.target.checked })}
                    className="w-4 h-4 rounded-sm accent-red-600"
                  />
                  <span>Air Conditioning Equipped</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.is_popular ?? false}
                    onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                    className="w-4 h-4 rounded-sm accent-red-600"
                  />
                  <span>Highlight as "Most Popular"</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.is_active ?? true}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 rounded-sm accent-red-600"
                  />
                  <span>Active in Fleet</span>
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
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition shadow-md shadow-red-600/20 cursor-pointer"
                >
                  Save Vehicle
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
