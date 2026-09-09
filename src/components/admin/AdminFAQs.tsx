import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FAQ } from '../../types';
import { Plus, Edit, Trash2, HelpCircle, X } from 'lucide-react';

export const AdminFAQs: React.FC = () => {
  const { faqs, saveFAQ, deleteFAQ } = useApp();
  const [editingFAQ, setEditingFAQ] = useState<Partial<FAQ> | null>(null);

  const handleCreateNew = () => {
    setEditingFAQ({
      question: '',
      answer: '',
      category: 'general',
      sort_order: faqs.length + 1,
      is_published: true,
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFAQ) return;
    await saveFAQ(editingFAQ);
    setEditingFAQ(null);
  };

  return (
    <div className="space-y-6 font-sans text-slate-800 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <HelpCircle className="w-6 h-6 text-red-600" /> FAQ Management
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Manage frequently asked questions and answers for travelers.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-md shadow-red-600/20 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add FAQ</span>
        </button>
      </div>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.id} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 shadow-xs hover:border-red-300 transition">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 font-sans flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-red-600" />
                {faq.question}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingFAQ(faq)}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm('Delete FAQ?')) deleteFAQ(faq.id);
                  }}
                  className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-lg text-xs transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed bg-[#FAF9F6] p-3 rounded-xl border border-slate-200">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>

      {editingFAQ && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative text-slate-800">
            <button
              type="button"
              onClick={() => setEditingFAQ(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-lg font-bold text-slate-900 font-sans border-b border-slate-200 pb-3 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-red-600" />
              {editingFAQ.id ? 'Edit FAQ' : 'Add FAQ'}
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Question *</label>
              <input
                type="text"
                required
                value={editingFAQ.question || ''}
                onChange={(e) => setEditingFAQ({ ...editingFAQ, question: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-red-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Answer *</label>
              <textarea
                required
                rows={4}
                value={editingFAQ.answer || ''}
                onChange={(e) => setEditingFAQ({ ...editingFAQ, answer: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-red-500 focus:bg-white leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={editingFAQ.category || 'general'}
                onChange={(e) => setEditingFAQ({ ...editingFAQ, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-hidden focus:border-red-500 focus:bg-white"
              >
                <option value="general">General</option>
                <option value="booking">Booking</option>
                <option value="airport">Airport Transfers</option>
                <option value="tours">Sightseeing Tours</option>
                <option value="payment">Payment & Booking</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-xs font-semibold text-slate-700 mb-1">Display Order</label><input type="number" min="1" value={editingFAQ.sort_order ?? 1} onChange={(e) => setEditingFAQ({ ...editingFAQ, sort_order: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900" /></div>
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 pt-5"><input type="checkbox" checked={editingFAQ.is_published ?? true} onChange={(e) => setEditingFAQ({ ...editingFAQ, is_published: e.target.checked })} className="accent-red-600 w-4 h-4" />Published on website</label>
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingFAQ(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs rounded-xl border border-slate-200 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md shadow-red-600/20 transition cursor-pointer"
              >
                Save FAQ
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
