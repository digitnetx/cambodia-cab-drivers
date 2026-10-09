import React, { useState } from 'react';
import { ChevronDown, MessageCircle, MessageSquare, Send, X } from 'lucide-react';
import { getWhatsAppGeneralUrl } from '../../lib/whatsapp';
import { submitToFormspree } from '../../lib/formspree';
import { useApp } from '../../context/AppContext';

export const FloatingWhatsApp: React.FC = () => {
  const { addContactMessage, showToast } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });

  const closeMessage = () => {
    setIsMessageOpen(false);
    setIsOpen(false);
  };

  const handleMessageSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSending(true);
    try {
      const message = { ...formData, subject: 'Quick website inquiry' };
      await submitToFormspree({
        _subject: 'Website quick inquiry',
        form_type: 'Quick contact popup',
        ...message,
      });
      await addContactMessage(message);
      setFormData({ name: '', email: '', phone: '', message: '' });
      closeMessage();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Your message could not be sent. Please try WhatsApp instead.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-24 right-4 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
        {isOpen && (
          <div className="w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/20">
            <a
              href={getWhatsAppGeneralUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => showToast('Opening WhatsApp to message our driver team...', 'success')}
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold text-slate-800 transition hover:bg-emerald-50 hover:text-emerald-800"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white"><MessageCircle className="h-5 w-5" /></span>
              WhatsApp us
            </a>
            <button
              type="button"
              onClick={() => { setIsMessageOpen(true); setIsOpen(false); }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-slate-800 transition hover:bg-red-50 hover:text-red-700"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white"><MessageSquare className="h-5 w-5" /></span>
              Send a message
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-label="Open contact options"
          className="group flex items-center gap-2 rounded-full bg-red-600 px-4 py-3 text-sm font-extrabold text-white shadow-2xl shadow-red-600/30 transition hover:scale-105 hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/30"
        >
          <MessageSquare className="h-5 w-5" />
          <span>Contact us</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isMessageOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 p-4 backdrop-blur-sm sm:items-center" role="dialog" aria-modal="true" aria-label="Send a quick message">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-7">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-600"><MessageSquare className="h-6 w-6" /></div>
                <h2 className="mt-3 text-xl font-extrabold text-slate-950">Send a quick message</h2>
                <p className="mt-1 text-sm text-slate-600">Tell us your travel plan and our driver team will reply soon.</p>
              </div>
              <button type="button" onClick={closeMessage} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-800" aria-label="Close message form"><X className="h-5 w-5" /></button>
            </div>

            <form onSubmit={handleMessageSubmit} className="space-y-3">
              <input required value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} placeholder="Your name *" className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-red-500 focus:bg-white" />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input required type="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} placeholder="Email address *" className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-red-500 focus:bg-white" />
                <input value={formData.phone} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} placeholder="Phone / WhatsApp" className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-red-500 focus:bg-white" />
              </div>
              <textarea required rows={4} value={formData.message} onChange={(event) => setFormData({ ...formData, message: event.target.value })} placeholder="How can we help with your Cambodia trip? *" className="w-full resize-none rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-red-500 focus:bg-white" />
              <button type="submit" disabled={isSending} className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-400">
                <Send className="h-4 w-4" />
                {isSending ? 'Sending message…' : 'Send message'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
