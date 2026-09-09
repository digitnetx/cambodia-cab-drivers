import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking, BookingStatus } from '../../types';
import { 
  Calendar, Search, Filter, MessageSquare, Check, X, 
  Trash2, Edit, Plus, Car, User, Clock, MapPin, DollarSign, 
  Plane, Eye, Phone, Mail, ShieldAlert
} from 'lucide-react';
import { getWhatsAppBookingUrl } from '../../lib/whatsapp';

export const AdminBookings: React.FC = () => {
  const { 
    bookings = [], updateBookingStatus, updateBookingDetails, deleteBooking, 
    addBooking, vehicles = [], routes = [], services = [], siteSettings 
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Edit / Create Form state
  const [formData, setFormData] = useState<Partial<Booking>>({});

  const filteredBookings = (bookings || []).filter((b) => {
    if (!b) return false;
    const matchesSearch = 
      (b.customer_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (b.booking_reference || '').toLowerCase().includes(search.toLowerCase()) ||
      (b.pickup_location || '').toLowerCase().includes(search.toLowerCase()) ||
      (b.destination || '').toLowerCase().includes(search.toLowerCase()) ||
      (b.phone && b.phone.includes(search)) ||
      (b.flight_number && b.flight_number.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenEdit = (b: Booking) => {
    setSelectedBooking(b);
    setFormData(b);
    setIsEditing(true);
  };

  const handleOpenCreate = () => {
    setFormData({
      customer_name: '',
      email: '',
      phone: '',
      whatsapp: '',
      service_name: 'Airport Transfer',
      pickup_location: 'Phnom Penh Airport (PNH)',
      destination: 'Hotel in City Center',
      travel_date: new Date().toISOString().split('T')[0],
      pickup_time: '12:00',
      passengers: 2,
      luggage: 2,
      vehicle_type: 'Sedan',
      estimated_price: 15,
      currency: 'USD',
      status: 'confirmed',
      assigned_driver: siteSettings.driver_name,
      admin_notes: 'Created manually via admin portal.',
    });
    setIsCreating(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;
    await updateBookingDetails(selectedBooking.id, formData);
    setIsEditing(false);
    setSelectedBooking(null);
  };

  const handleSaveCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_name || !formData.pickup_location || !formData.destination) {
      alert('Please fill in required booking details.');
      return;
    }
    await addBooking({
      customer_name: formData.customer_name || 'Guest',
      email: formData.email || 'customer@example.com',
      phone: formData.phone || '+85516509371',
      whatsapp: formData.whatsapp || formData.phone,
      service_name: formData.service_name,
      pickup_location: formData.pickup_location,
      destination: formData.destination,
      travel_date: formData.travel_date || new Date().toISOString().split('T')[0],
      pickup_time: formData.pickup_time || '10:00',
      passengers: Number(formData.passengers) || 1,
      luggage: Number(formData.luggage) || 0,
      vehicle_type: formData.vehicle_type,
      flight_number: formData.flight_number,
      hotel_name: formData.hotel_name,
      special_requests: formData.special_requests,
      estimated_price: Number(formData.estimated_price) || 0,
      currency: formData.currency || 'USD',
      assigned_driver: formData.assigned_driver || siteSettings.driver_name,
      assigned_vehicle: formData.assigned_vehicle,
      admin_notes: formData.admin_notes,
    });
    setIsCreating(false);
  };

  const handleDelete = async (id: string, ref: string) => {
    if (confirm(`Are you sure you want to delete booking #${ref}?`)) {
      await deleteBooking(id);
      if (selectedBooking?.id === id) {
        setSelectedBooking(null);
      }
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans text-slate-800">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2.5">
            <Calendar className="w-6 h-6 text-red-600" /> Bookings Management
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            View, track, confirm, assign, and communicate directly with customers on WhatsApp.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition shadow-md shadow-red-600/20 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Create Manual Booking
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search name, ref, hotel, flight..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-red-500 focus:bg-white"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 text-xs">
          {['all', 'pending', 'confirmed', 'assigned', 'in_progress', 'completed', 'cancelled'].map((status) => {
            const count = status === 'all' 
              ? bookings.length 
              : bookings.filter(b => b.status === status).length;
            const isActive = statusFilter === status;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl font-bold capitalize whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                {status.replace('_', ' ')} ({count})
              </button>
            );
          })}
        </div>

      </div>

      {/* Bookings List Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F6] text-slate-700 uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Ref / Date</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Route / Service</th>
                <th className="py-3.5 px-4">Vehicle & Pax</th>
                <th className="py-3.5 px-4">Price</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No bookings found matching your search and filter criteria.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  const waUrl = getWhatsAppBookingUrl(b, siteSettings);
                  return (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition">
                      
                      {/* Ref & Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-mono font-bold text-red-600">{b.booking_reference}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{b.travel_date} at {b.pickup_time}</div>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{b.customer_name}</div>
                        <div className="text-[11px] text-slate-500">{b.phone || b.whatsapp || b.email}</div>
                        {b.flight_number && (
                          <div className="text-[10px] text-red-600 font-mono mt-0.5">✈️ {b.flight_number}</div>
                        )}
                      </td>

                      {/* Route / Service */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-medium text-slate-900 truncate">{b.pickup_location} → {b.destination}</div>
                        <div className="text-[11px] text-slate-500 truncate">{b.service_name || b.tour_title || 'Private Ride'}</div>
                      </td>

                      {/* Vehicle & Pax */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-800">{b.vehicle_type || 'Sedan'}</div>
                        <div className="text-[11px] text-slate-500">{b.passengers} Pax • {b.luggage} Bags</div>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900 text-sm">
                          ${b.estimated_price || 0}
                        </div>
                        <div className="text-[10px] text-slate-500">Cash on arrival</div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={b.status}
                          onChange={(e) => updateBookingStatus(b.id, e.target.value as BookingStatus)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase border focus:outline-hidden cursor-pointer ${
                            b.status === 'confirmed' ? 'bg-red-50 text-red-600 border-red-200' :
                            b.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            b.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            b.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            b.status === 'cancelled' ? 'bg-slate-100 text-slate-600 border-slate-300' :
                            'bg-slate-50 text-slate-800 border-slate-300'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="assigned">Assigned</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Chat on WhatsApp"
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition border border-red-200"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>

                          <button
                            onClick={() => handleOpenEdit(b)}
                            title="Edit booking"
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition border border-slate-300 cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDelete(b.id, b.booking_reference)}
                            title="Delete booking"
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition border border-red-200 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Modal */}
      {(isEditing || isCreating) && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-5 my-8 text-slate-800">
            
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-red-600" />
                {isCreating ? 'Create Manual Booking' : `Edit Booking #${selectedBooking?.booking_reference}`}
              </h2>
              <button
                onClick={() => { setIsEditing(false); setIsCreating(false); }}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={isCreating ? handleSaveCreate : handleSaveEdit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.customer_name || ''}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value, whatsapp: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Flight Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. SQ158, K6810"
                    value={formData.flight_number || ''}
                    onChange={(e) => setFormData({ ...formData, flight_number: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Pickup Location *</label>
                  <input
                    type="text"
                    required
                    value={formData.pickup_location || ''}
                    onChange={(e) => setFormData({ ...formData, pickup_location: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Destination *</label>
                  <input
                    type="text"
                    required
                    value={formData.destination || ''}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Travel Date</label>
                  <input
                    type="date"
                    value={formData.travel_date || ''}
                    onChange={(e) => setFormData({ ...formData, travel_date: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Pickup Time</label>
                  <input
                    type="time"
                    value={formData.pickup_time || ''}
                    onChange={(e) => setFormData({ ...formData, pickup_time: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Passengers</label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={formData.passengers || 1}
                    onChange={(e) => setFormData({ ...formData, passengers: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Price ($ USD)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.estimated_price || 0}
                    onChange={(e) => setFormData({ ...formData, estimated_price: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Vehicle Type</label>
                  <select
                    value={formData.vehicle_type || 'Sedan'}
                    onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
                  >
                    <option value="Sedan">Sedan (1-3 Pax)</option>
                    <option value="SUV">SUV (1-4 Pax)</option>
                    <option value="Van">Executive Van (5-10 Pax)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Assigned Driver</label>
                  <input
                    type="text"
                    value={formData.assigned_driver || siteSettings.driver_name}
                    onChange={(e) => setFormData({ ...formData, assigned_driver: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Status</label>
                  <select
                    value={formData.status || 'pending'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as BookingStatus })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="assigned">Assigned</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Admin Notes (Private)</label>
                <textarea
                  rows={2}
                  placeholder="Notes for driver / coordination details..."
                  value={formData.admin_notes || ''}
                  onChange={(e) => setFormData({ ...formData, admin_notes: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:border-red-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => { setIsEditing(false); setIsCreating(false); }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition cursor-pointer border border-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition shadow-md cursor-pointer"
                >
                  {isCreating ? 'Create Booking' : 'Save Changes'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
