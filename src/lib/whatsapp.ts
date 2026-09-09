import { Booking, RoutePricing, Vehicle, Tour, SiteSettings } from '../types';

export const PHONE_NUMBER = '+855 16 509 371';
export const WHATSAPP_NUMBER = '+855 16 509 371';
export const DRIVER_NAME = 'Cambodia Taxi Cab';

export function getWhatsAppBookingUrl(booking: Partial<Booking>, settings?: Partial<SiteSettings>): string {
  const businessName = settings?.business_name || 'Cambodia Taxi Cab';
  const rawNumber = settings?.whatsapp || '+855 16 509 371';
  const cleanNumber = rawNumber.replace(/[^0-9]/g, '');

  const message = `Hello ${businessName},

I would like to confirm my booking with ${businessName}:

📌 Booking Ref: ${booking.booking_reference || 'Pending'}
🚕 Service / Route: ${booking.service_name || booking.tour_title || 'Private Driver Service'}
📍 Pickup: ${booking.pickup_location || 'Not specified'}
🏁 Destination: ${booking.destination || 'Not specified'}
📅 Date: ${booking.travel_date || 'TBD'}
⏰ Time: ${booking.pickup_time || 'TBD'}
👥 Passengers: ${booking.passengers || 1}
🧳 Luggage: ${booking.luggage ?? 0} bags
🚗 Vehicle: ${booking.vehicle_type || 'Standard'}
${booking.flight_number ? `✈️ Flight No: ${booking.flight_number}\n` : ''}${booking.hotel_name ? `🏨 Hotel: ${booking.hotel_name}\n` : ''}👤 Customer Name: ${booking.customer_name || 'Guest'}
📞 Phone / WhatsApp: ${booking.phone || booking.whatsapp || 'N/A'}
${booking.estimated_price ? `💵 Quoted Price: $${booking.estimated_price}\n` : ''}${booking.special_requests ? `📝 Special Notes: ${booking.special_requests}\n` : ''}
Please confirm availability and pickup details. Thank you!`;

  return `https://wa.me/${cleanNumber || '85516509371'}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppAirportUrl(airportName: string = 'Phnom Penh Airport (PNH)', hotel: string = 'Hotel in City', settings?: Partial<SiteSettings>): string {
  const businessName = settings?.business_name || 'Cambodia Taxi Cab';
  const rawNumber = settings?.whatsapp || '+855 16 509 371';
  const cleanNumber = rawNumber.replace(/[^0-9]/g, '');

  const message = `Hello ${businessName}, I would like to book a private airport transfer in Cambodia.

✈️ Airport: ${airportName}
🏨 Destination / Hotel: ${hotel}
👥 Passengers: 2
🧳 Luggage: 2 bags

Could you please confirm your availability and the fixed rate? Thank you!`;
  return `https://wa.me/${cleanNumber || '85516509371'}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppRouteUrl(route: RoutePricing, vehicleType: string = 'Sedan', settings?: Partial<SiteSettings>): string {
  const businessName = settings?.business_name || 'Cambodia Taxi Cab';
  const rawNumber = settings?.whatsapp || '+855 16 509 371';
  const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
  const price = vehicleType === 'SUV' ? route.suv_price : vehicleType === 'Van' ? route.van_price : route.sedan_price;

  const message = `Hello ${businessName}, I would like to book a private transfer for:

🛣️ Route: ${route.route_name}
🚗 Vehicle: ${vehicleType} (Starting ~$${price} ${route.currency || 'USD'})
📍 Pickup: ${route.origin}
🏁 Destination: ${route.destination}

Please let me know availability and booking details. Thank you!`;
  return `https://wa.me/${cleanNumber || '85516509371'}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppVehicleUrl(vehicle: Vehicle, settings?: Partial<SiteSettings>): string {
  const businessName = settings?.business_name || 'Cambodia Taxi Cab';
  const rawNumber = settings?.whatsapp || '+855 16 509 371';
  const cleanNumber = rawNumber.replace(/[^0-9]/g, '');

  const message = `Hello ${businessName}, I am interested in booking your ${vehicle.name} (${vehicle.models}) for private transportation in Cambodia.

🚗 Vehicle: ${vehicle.name} (up to ${vehicle.capacity_passengers} passengers, ${vehicle.capacity_luggage} bags)
💵 Starting from: $${vehicle.price_from} ${vehicle.currency || 'USD'}

Please let me know the best rate for my travel dates. Thank you!`;
  return `https://wa.me/${cleanNumber || '85516509371'}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppTourUrl(tour: Tour, settings?: Partial<SiteSettings>): string {
  const businessName = settings?.business_name || 'Cambodia Taxi Cab';
  const rawNumber = settings?.whatsapp || '+855 16 509 371';
  const cleanNumber = rawNumber.replace(/[^0-9]/g, '');

  const message = `Hello ${businessName}, I am interested in booking the private tour:

🗺️ Tour: ${tour.title}
⏳ Duration: ${tour.duration}
📍 Pickup Location: ${tour.pickup_location}
💵 Price: Starting from $${tour.starting_price || 40}

Could you please provide availability and itinerary details for our group? Thank you!`;
  return `https://wa.me/${cleanNumber || '85516509371'}?text=${encodeURIComponent(message)}`;
}

export function getWhatsAppGeneralUrl(customMessage?: string, settings?: Partial<SiteSettings>): string {
  const businessName = settings?.business_name || 'Cambodia Taxi Cab';
  const rawNumber = settings?.whatsapp || '+855 16 509 371';
  const cleanNumber = rawNumber.replace(/[^0-9]/g, '');

  const defaultText = `Hello ${businessName}, I am planning a trip to Cambodia and would like to inquire about your private taxi and driver services.`;
  const text = customMessage || defaultText;
  return `https://wa.me/${cleanNumber || '85516509371'}?text=${encodeURIComponent(text)}`;
}

export function getTelegramUrl(customMessage?: string, settings?: Partial<SiteSettings>): string {
  const businessName = settings?.business_name || 'Cambodia Taxi Cab';
  const rawNumber = settings?.telegram || settings?.phone || '85516509371';
  const cleanNumber = rawNumber.replace(/[^0-9]/g, '');
  const defaultText = `Hello ${businessName}, I would like to inquire about your private driver services in Cambodia.`;
  const text = customMessage || defaultText;
  return `https://t.me/+${cleanNumber}?text=${encodeURIComponent(text)}`;
}
