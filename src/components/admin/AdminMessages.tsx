import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  MessageSquare, Mail, Phone, Trash2, CheckCircle, Clock, 
  Search, Eye, Filter, Reply, ExternalLink, ShieldCheck, 
  Send, User, AlertCircle, Sparkles, Copy, Check
} from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { getWhatsAppGeneralUrl } from '../../lib/whatsapp';
import { ContactMessage } from '../../types';

export const AdminMessages: React.FC = () => {
  const { messages = [], updateMessageStatus, deleteContactMessage, showToast } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const totalCount = messages.length;
  const unreadCount = messages.filter(m => m.status === 'unread').length;
  const readCount = messages.filter(m => m.status === 'read').length;

  const filteredMessages = messages.filter(msg => {
    if (!msg) return false;
    const matchesFilter = 
      filterStatus === 'all' || 
      (filterStatus === 'unread' && msg.status === 'unread') ||
      (filterStatus === 'read' && msg.status !== 'unread');

    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      !searchTerm ||
      (msg.name && msg.name.toLowerCase().includes(searchLower)) ||
      (msg.email && msg.email.toLowerCase().includes(searchLower)) ||
      (msg.phone && msg.phone.toLowerCase().includes(searchLower)) ||
      (msg.subject && msg.subject.toLowerCase().includes(searchLower)) ||
      (msg.message && msg.message.toLowerCase().includes(searchLower));

    return matchesFilter && matchesSearch;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleRead = async (msg: ContactMessage) => {
    const nextStatus = msg.status === 'unread' ? 'read' : 'unread';
    await updateMessageStatus(msg.id, nextStatus);
    showToast(nextStatus === 'read' ? 'Marked as read' : 'Marked as unread');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      await deleteContactMessage(id);
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-red-600 uppercase tracking-wider mb-1">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Communications Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Contact Messages & Inquiries
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Direct messages submitted through your website contact form.
          </p>
        </div>

        {unreadCount > 0 && (
          <div className="bg-red-50 border border-red-200 px-3.5 py-2 rounded-xl flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
            <span className="text-xs font-bold text-red-600">
              {unreadCount} Unread Message{unreadCount > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs text-slate-500 font-semibold">Total Messages</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{totalCount}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs text-red-600 font-semibold">New / Unread</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-red-600 mt-1">{unreadCount}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-xs text-slate-500 font-semibold">Read / Handled</span>
            <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{readCount}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xs">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 shrink-0">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setFilterStatus('unread')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              filterStatus === 'unread'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 bg-white/30 text-white rounded-md text-[10px]">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilterStatus('read')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              filterStatus === 'read'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Read ({readCount})
          </button>
        </div>

        {/* Search Field */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search sender, email, subject, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 text-xs text-slate-900 placeholder-slate-400 pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-red-500 focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((msg) => {
            const isUnread = msg.status === 'unread';
            const whatsappText = `Hello ${msg.name}, thank you for contacting Cambodia Taxi Cab regarding "${msg.subject}".`;

            return (
              <div
                key={msg.id}
                className={`bg-white rounded-2xl border transition shadow-xs ${
                  isUnread
                    ? 'border-red-300 bg-red-50/30 ring-1 ring-red-200'
                    : 'border-slate-200 hover:border-slate-300'
                } p-4 sm:p-5`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isUnread ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <User className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900">
                          {msg.name}
                        </h3>
                        {isUnread && (
                          <span className="px-2 py-0.5 rounded-md bg-red-600 text-white font-black text-[10px] tracking-wider uppercase">
                            NEW INQUIRY
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                        <a
                          href={`mailto:${msg.email}`}
                          className="flex items-center gap-1 hover:text-red-600 transition"
                        >
                          <Mail className="w-3.5 h-3.5 text-red-500" />
                          <span>{msg.email}</span>
                        </a>

                        {msg.phone && (
                          <a
                            href={`tel:${msg.phone}`}
                            className="flex items-center gap-1 hover:text-red-600 transition"
                          >
                            <Phone className="w-3.5 h-3.5 text-red-500" />
                            <span>{msg.phone}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDate(msg.created_at)}</span>
                  </div>
                </div>

                {/* Subject & Message Preview */}
                <div className="py-3.5">
                  <div className="text-xs font-bold text-red-600 mb-1 flex items-center gap-1.5">
                    <span className="text-slate-500">Subject:</span>
                    <span>{msg.subject || 'General Inquiry'}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-[#FAF9F6] p-4 rounded-xl border border-slate-200 whitespace-pre-wrap">
                    {msg.message}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Reply on WhatsApp */}
                    <a
                      href={getWhatsAppGeneralUrl(whatsappText)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Reply on WhatsApp</span>
                    </a>

                    {/* Reply via Email */}
                    {msg.email && (
                      <a
                        href={`mailto:${msg.email}?subject=${encodeURIComponent(`Re: ${msg.subject || 'Your inquiry with Cambodia Taxi Cab'}`)}&body=${encodeURIComponent(`Hello ${msg.name},\n\nThank you for reaching out to Cambodia Taxi Cab regarding your inquiry.\n\nBest regards,\nCambodia Taxi Cab Team\n+855 16 509 371`)}`}
                        className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Reply via Email</span>
                      </a>
                    )}

                    {/* View Details */}
                    <button
                      onClick={() => setSelectedMessage(msg)}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>Inspect</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Mark Read/Unread Toggle */}
                    <button
                      onClick={() => handleToggleRead(msg)}
                      className={`px-3 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition border cursor-pointer ${
                        isUnread
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-500 border-slate-200'
                      }`}
                    >
                      <CheckCircle className={`w-3.5 h-3.5 ${isUnread ? 'text-red-600' : 'text-slate-400'}`} />
                      <span>{isUnread ? 'Mark as Read' : 'Mark as Unread'}</span>
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl border border-red-200 text-xs transition cursor-pointer"
                      title="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No Messages Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchTerm 
                ? `No contact messages match your search term "${searchTerm}".`
                : filterStatus !== 'all'
                ? `No ${filterStatus} messages in your inbox.`
                : 'Your contact message inbox is currently empty. Direct customer messages will appear here.'}
            </p>
            {(searchTerm || filterStatus !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('all');
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition inline-block cursor-pointer shadow-xs"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Message Inspection Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150 text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Message Details</h3>
                  <span className="text-[11px] text-slate-500">{formatDate(selectedMessage.created_at)}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-[#FAF9F6] p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Sender Name</span>
                  <span className="text-slate-900 font-semibold">{selectedMessage.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Status</span>
                  <span className={`font-bold ${selectedMessage.status === 'unread' ? 'text-red-600' : 'text-slate-700'}`}>
                    {selectedMessage.status === 'unread' ? 'Unread / New' : 'Read'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Email</span>
                  <div className="flex items-center gap-1.5">
                    <a href={`mailto:${selectedMessage.email}`} className="text-red-600 hover:underline truncate">
                      {selectedMessage.email}
                    </a>
                    <button 
                      onClick={() => handleCopy(selectedMessage.email, 'email')}
                      className="text-slate-400 hover:text-slate-700 cursor-pointer"
                      title="Copy email"
                    >
                      {copiedId === 'email' ? <Check className="w-3 h-3 text-red-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Phone / WhatsApp</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-900">{selectedMessage.phone || 'Not provided'}</span>
                    {selectedMessage.phone && (
                      <button 
                        onClick={() => handleCopy(selectedMessage.phone!, 'phone')}
                        className="text-slate-400 hover:text-slate-700 cursor-pointer"
                        title="Copy phone"
                      >
                        {copiedId === 'phone' ? <Check className="w-3 h-3 text-red-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold mb-1">Subject</span>
                <p className="text-slate-900 font-bold bg-[#FAF9F6] p-2.5 rounded-lg border border-slate-200">
                  {selectedMessage.subject || 'General Inquiry'}
                </p>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-bold mb-1">Full Message</span>
                <div className="text-slate-700 bg-[#FAF9F6] p-4 rounded-xl border border-slate-200 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-200">
              <button
                onClick={() => handleDelete(selectedMessage.id)}
                className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer border border-red-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={getWhatsAppGeneralUrl(`Hello ${selectedMessage.name}, thank you for contacting Cambodia Taxi Cab regarding "${selectedMessage.subject}".`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition border border-slate-300 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

