import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WhyChooseUsBenefit } from '../../types';
import { Shield, Plus, Edit, Trash2, X, DollarSign, MessageSquare, Award, Sparkles, Clock, ShieldCheck } from 'lucide-react';

export const AdminWhyChooseUs: React.FC = () => {
  const { whyChooseUs, saveWhyChooseUsBenefit, deleteWhyChooseUsBenefit } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBenefit, setSelectedBenefit] = useState<WhyChooseUsBenefit | null>(null);

  const [formData, setFormData] = useState<Partial<WhyChooseUsBenefit>>({});

  const handleOpenCreate = () => {
    setSelectedBenefit(null);
    setFormData({
      title: '',
      description: '',
      icon: 'ShieldCheck',
      badge: 'Direct Value',
      display_order: whyChooseUs.length + 1,
      is_active: true,
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (b: WhyChooseUsBenefit) => {
    setSelectedBenefit(b);
    setFormData(b);
    setIsEditing(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert('Please fill in title and description');
      return;
    }
    await saveWhyChooseUsBenefit(formData);
    setIsEditing(false);
    setSelectedBenefit(null);
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Delete benefit "${title}"?`)) {
      await deleteWhyChooseUsBenefit(id);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans text-white">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0F1C3F] p-6 rounded-2xl border border-[#1E2E5C] shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2.5">
            <Shield className="w-6 h-6 text-red-500" /> "Why Choose Us" Benefits Manager
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Control the key value propositions, direct booking savings, and safety badges shown to visitors.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-red-600/20 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Benefit Card
        </button>
      </div>

      {/* Grid of Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {whyChooseUs.map((b) => (
          <div 
            key={b.id}
            className="bg-[#0F1C3F] rounded-2xl border border-[#1E2E5C] p-5 flex flex-col justify-between hover:border-red-500/50 transition space-y-4 shadow-xl"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-red-600/10 text-red-500 border border-red-500/20 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                {b.badge && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-600/20 text-red-400 border border-red-500/30">
                    {b.badge}
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-bold text-base text-white">{b.title}</h3>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{b.description}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1E2E5C] flex items-center justify-between text-xs">
              <span className={`text-[11px] font-semibold flex items-center gap-1.5 ${b.is_active ? 'text-red-400' : 'text-slate-500'}`}>
                <span className={`w-2 h-2 rounded-full ${b.is_active ? 'bg-red-500' : 'bg-slate-600'}`} />
                {b.is_active ? 'Active' : 'Disabled'}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(b)}
                  className="px-3 py-1.5 bg-[#0A132C] hover:bg-[#1E2E5C] text-white border border-[#1E2E5C] text-xs font-bold rounded-lg transition flex items-center gap-1 cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(b.id, b.title)}
                  className="p-1.5 bg-red-950/30 hover:bg-red-900/50 text-red-400 border border-red-900/40 rounded-lg transition cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-[#070D1E]/80 backdrop-blur-xs flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-[#0F1C3F] border border-[#1E2E5C] rounded-2xl w-full max-w-lg max-h-[calc(100dvh-1.5rem)] overflow-y-auto overscroll-contain p-4 sm:p-6 shadow-2xl space-y-5 my-auto">
            
            <div className="flex items-center justify-between border-b border-[#1E2E5C] pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-500" />
                {selectedBenefit ? `Edit Benefit: ${selectedBenefit.title}` : 'Add Benefit Card'}
              </h2>
              <button onClick={() => setIsEditing(false)} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Benefit Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. No Platform Commissions"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 bg-[#0A132C] border border-[#1E2E5C] rounded-xl text-white focus:border-red-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Badge Tag</label>
                <input
                  type="text"
                  placeholder="e.g. Direct Savings, Fixed Rates, Safe Driver"
                  value={formData.badge || ''}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  className="w-full p-2.5 bg-[#0A132C] border border-[#1E2E5C] rounded-xl text-white focus:border-red-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain why this benefits the traveler..."
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-[#0A132C] border border-[#1E2E5C] rounded-xl text-white focus:border-red-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Icon Style</label>
                  <select
                    value={formData.icon || 'ShieldCheck'}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full p-2.5 bg-[#0A132C] border border-[#1E2E5C] rounded-xl text-white focus:border-red-500 focus:outline-hidden"
                  >
                    <option value="DollarSign" className="bg-[#0F1C3F] text-white">Dollar / Savings</option>
                    <option value="ShieldCheck" className="bg-[#0F1C3F] text-white">Shield / Trust</option>
                    <option value="MessageSquare" className="bg-[#0F1C3F] text-white">WhatsApp / Fast Reply</option>
                    <option value="Award" className="bg-[#0F1C3F] text-white">Award / English</option>
                    <option value="Sparkles" className="bg-[#0F1C3F] text-white">Sparkles / Comfort</option>
                    <option value="Clock" className="bg-[#0F1C3F] text-white">Clock / Flexibility</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Display Order</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.display_order || 1}
                    onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#0A132C] border border-[#1E2E5C] rounded-xl text-white focus:border-red-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={formData.is_active ?? true}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-4 h-4 rounded-sm accent-red-600 bg-[#0A132C] border-[#1E2E5C]"
                  />
                  <span>Active on Website</span>
                </label>
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-[#1E2E5C]">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-[#0A132C] hover:bg-[#1E2E5C] text-slate-300 border border-[#1E2E5C] font-bold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition shadow-lg shadow-red-600/20 cursor-pointer"
                >
                  Save Benefit
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
