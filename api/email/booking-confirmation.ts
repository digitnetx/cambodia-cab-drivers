import { getSmtpCredentials, getTransporter } from "../_lib/smtp";

export default async function handler(req: any, res: any) {
  // Allow CORS / preflight
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    return res.status(200).json({ status: "ok" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    let booking = req.body;
    if (typeof booking === "string") {
      try {
        booking = JSON.parse(booking);
      } catch {
        booking = {};
      }
    }
    booking = booking || {};

    if (!booking.customer_name || !booking.booking_reference) {
      return res.status(400).json({ error: "Missing required booking details." });
    }

    const { user: smtpUser, pass: smtpPass, adminEmail } = getSmtpCredentials();

    if (!smtpUser || !smtpPass) {
      console.warn("SMTP not configured in environment variables or settings.");
      return res.status(200).json({
        success: false,
        warning: "SMTP not configured. Email notification skipped.",
      });
    }

    const transporter = getTransporter();
    const sentResults: { customer?: boolean; admin?: boolean } = {};


    // 1. Email to Traveler / Public User
    if (booking.email) {
      try {
        const customerMail = {
          from: `"Cambodia Taxi Cab" <${smtpUser}>`,
          to: booking.email,
          subject: `🚗 Booking Request Confirmation #${booking.booking_reference} - Cambodia Taxi Cab`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0b0f19; color: #f8fafc; padding: 32px; border-radius: 18px; border: 1px solid #1e293b;">
              
              <!-- Header -->
              <div style="text-align: center; border-bottom: 1px solid #1e293b; padding-bottom: 20px; margin-bottom: 24px;">
                <span style="background: rgba(245, 158, 11, 0.15); color: #f59e0b; font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; padding: 4px 12px; border-radius: 20px; border: 1px solid rgba(245, 158, 11, 0.3);">
                  Booking Confirmation
                </span>
                <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 12px 0 4px 0;">
                  Cambodia Taxi Cab
                </h1>
                <p style="color: #94a3b8; font-size: 13px; margin: 0;">
                  Private Driver & Custom Tours with Sareth
                </p>
              </div>

              <!-- Greeting -->
              <h2 style="color: #34d399; font-size: 18px; font-weight: 700; margin: 0 0 8px 0;">
                Thank you for your booking request, ${booking.customer_name}!
              </h2>
              <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
                We have received your trip reservation <strong>#${booking.booking_reference}</strong>. Driver Sareth has been notified and will verify your pickup details and vehicle arrangement promptly.
              </p>

              <!-- Booking Details Card -->
              <div style="background: #131b2e; padding: 22px; border-radius: 14px; border: 1px solid #1e293b; margin-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; padding-bottom: 12px; margin-bottom: 14px;">
                  <span style="color: #f59e0b; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">
                    Trip Summary
                  </span>
                  <span style="color: #38bdf8; font-size: 13px; font-weight: 800; font-family: monospace;">
                    #${booking.booking_reference}
                  </span>
                </div>

                <table style="width: 100%; text-align: left; font-size: 13px; color: #e2e8f0; border-collapse: collapse;">
                  ${booking.service_name ? `<tr><td style="padding: 7px 0; color: #64748b; width: 140px;">Service / Route:</td><td style="padding: 7px 0; font-weight: 600; color: #ffffff;">${booking.service_name}</td></tr>` : ''}
                  ${booking.tour_title ? `<tr><td style="padding: 7px 0; color: #64748b;">Tour Package:</td><td style="padding: 7px 0; font-weight: 600; color: #ffffff;">${booking.tour_title}</td></tr>` : ''}
                  <tr><td style="padding: 7px 0; color: #64748b;">Pickup Location:</td><td style="padding: 7px 0; font-weight: 600; color: #ffffff;">${booking.pickup_location}</td></tr>
                  <tr><td style="padding: 7px 0; color: #64748b;">Destination:</td><td style="padding: 7px 0; font-weight: 600; color: #ffffff;">${booking.destination}</td></tr>
                  <tr><td style="padding: 7px 0; color: #64748b;">Date & Time:</td><td style="padding: 7px 0; font-weight: 600; color: #34d399;">${booking.travel_date} ${booking.pickup_time ? `at ${booking.pickup_time}` : ''}</td></tr>
                  <tr><td style="padding: 7px 0; color: #64748b;">Passengers:</td><td style="padding: 7px 0;">${booking.passengers || 1} Person(s) ${booking.luggage ? `• ${booking.luggage} Luggage` : ''}</td></tr>
                  ${booking.flight_number ? `<tr><td style="padding: 7px 0; color: #64748b;">Flight Number:</td><td style="padding: 7px 0; font-weight: 600; color: #f59e0b;">${booking.flight_number}</td></tr>` : ''}
                  ${booking.hotel_name ? `<tr><td style="padding: 7px 0; color: #64748b;">Hotel / Drop-off:</td><td style="padding: 7px 0; color: #ffffff;">${booking.hotel_name}</td></tr>` : ''}
                  ${booking.estimated_price ? `<tr><td style="padding: 7px 0; color: #64748b;">Estimated Rate:</td><td style="padding: 7px 0; font-weight: 800; color: #34d399; font-size: 15px;">$${booking.estimated_price} ${booking.currency || 'USD'}</td></tr>` : ''}
                  ${booking.special_requests ? `<tr><td style="padding: 7px 0; color: #64748b;">Special Requests:</td><td style="padding: 7px 0; color: #94a3b8; font-style: italic;">"${booking.special_requests}"</td></tr>` : ''}
                </table>
              </div>

              <!-- Instant WhatsApp Direct Action -->
              <div style="background: #064e3b; padding: 20px; border-radius: 14px; border: 1px solid #059669; margin-bottom: 24px; text-align: center;">
                <p style="color: #ecfdf5; font-size: 14px; margin: 0 0 12px 0; font-weight: 700;">
                  Need Instant Confirmation or Have Questions?
                </p>
                <a href="https://wa.me/85516509371?text=${encodeURIComponent(`Hello Sareth! I submitted booking #${booking.booking_reference} for ${booking.travel_date}.`)}"
                   style="display: inline-block; background: #10b981; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 800; font-size: 14px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);">
                  💬 Chat with Driver Sareth on WhatsApp (+855 16 509 371)
                </a>
              </div>

              <!-- Driver Information -->
              <div style="border-top: 1px solid #1e293b; padding-top: 20px; font-size: 12px; color: #94a3b8; text-align: center;">
                <p style="margin: 0 0 4px 0; font-weight: 600; color: #cbd5e1;">Cambodia Taxi Cab • Driver Sareth</p>
                <p style="margin: 0 0 4px 0;">Phone & WhatsApp: +855 16 509 371 | Email: cambodiacabdrivers@gmail.com</p>
                <p style="margin: 0; color: #64748b;">Siem Reap & Phnom Penh, Kingdom of Cambodia</p>
              </div>

            </div>
          `,
        };
        await transporter.sendMail(customerMail);
        sentResults.customer = true;
      } catch (err: any) {
        console.error("Failed to send customer booking confirmation:", err);
      }
    }

    // 2. Email Alert to Admin / Driver
    if (adminEmail) {
      try {
        const adminMail = {
          from: `"Booking System" <${smtpUser}>`,
          to: adminEmail,
          subject: `🚗 [NEW BOOKING] #${booking.booking_reference} - ${booking.customer_name} (${booking.travel_date})`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #090d16; color: #f8fafc; padding: 30px; border-radius: 18px; border: 1px solid #1e293b;">
              
              <div style="background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 12px; padding: 14px 18px; margin-bottom: 20px;">
                <h2 style="color: #f59e0b; margin: 0; font-size: 18px; font-weight: 800;">
                  🚨 New Booking Request Received!
                </h2>
                <p style="color: #cbd5e1; font-size: 13px; margin: 4px 0 0 0;">
                  A traveler has submitted a new booking request on your website.
                </p>
              </div>

              <!-- Customer & Trip Summary -->
              <div style="background: #111827; padding: 20px; border-radius: 14px; border: 1px solid #1f2937; margin-bottom: 20px;">
                <h3 style="color: #38bdf8; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 14px 0; border-bottom: 1px solid #1f2937; padding-bottom: 8px;">
                  Customer Information
                </h3>
                <table style="width: 100%; font-size: 13px; color: #e2e8f0; border-collapse: collapse;">
                  <tr><td style="padding: 6px 0; color: #94a3b8; width: 140px;">Booking Ref:</td><td style="padding: 6px 0; font-weight: 800; color: #f59e0b; font-family: monospace;">#${booking.booking_reference}</td></tr>
                  <tr><td style="padding: 6px 0; color: #94a3b8;">Customer Name:</td><td style="padding: 6px 0; font-weight: 700; color: #ffffff;">${booking.customer_name}</td></tr>
                  <tr><td style="padding: 6px 0; color: #94a3b8;">Email:</td><td style="padding: 6px 0;"><a href="mailto:${booking.email}" style="color: #38bdf8; text-decoration: none;">${booking.email || 'N/A'}</a></td></tr>
                  <tr><td style="padding: 6px 0; color: #94a3b8;">Phone:</td><td style="padding: 6px 0;"><a href="tel:${booking.phone}" style="color: #34d399; text-decoration: none;">${booking.phone || 'N/A'}</a></td></tr>
                  <tr><td style="padding: 6px 0; color: #94a3b8;">WhatsApp:</td><td style="padding: 6px 0; color: #34d399;">${booking.whatsapp || booking.phone || 'N/A'}</td></tr>
                </table>
              </div>

              <div style="background: #111827; padding: 20px; border-radius: 14px; border: 1px solid #1f2937; margin-bottom: 20px;">
                <h3 style="color: #38bdf8; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 14px 0; border-bottom: 1px solid #1f2937; padding-bottom: 8px;">
                  Itinerary Details
                </h3>
                <table style="width: 100%; font-size: 13px; color: #e2e8f0; border-collapse: collapse;">
                  <tr><td style="padding: 6px 0; color: #94a3b8; width: 140px;">Pickup Location:</td><td style="padding: 6px 0; font-weight: 600; color: #ffffff;">${booking.pickup_location}</td></tr>
                  <tr><td style="padding: 6px 0; color: #94a3b8;">Destination:</td><td style="padding: 6px 0; font-weight: 600; color: #ffffff;">${booking.destination}</td></tr>
                  <tr><td style="padding: 6px 0; color: #94a3b8;">Travel Date:</td><td style="padding: 6px 0; font-weight: 800; color: #f59e0b;">${booking.travel_date} ${booking.pickup_time ? `at ${booking.pickup_time}` : ''}</td></tr>
                  <tr><td style="padding: 6px 0; color: #94a3b8;">Passengers / Bags:</td><td style="padding: 6px 0;">${booking.passengers || 1} Passengers • ${booking.luggage || 0} Luggage</td></tr>
                  ${booking.flight_number ? `<tr><td style="padding: 6px 0; color: #94a3b8;">Flight Number:</td><td style="padding: 6px 0; font-weight: 700; color: #f59e0b;">${booking.flight_number}</td></tr>` : ''}
                  ${booking.hotel_name ? `<tr><td style="padding: 6px 0; color: #94a3b8;">Hotel / Drop:</td><td style="padding: 6px 0;">${booking.hotel_name}</td></tr>` : ''}
                  ${booking.estimated_price ? `<tr><td style="padding: 6px 0; color: #94a3b8;">Estimated Price:</td><td style="padding: 6px 0; font-weight: 800; color: #34d399; font-size: 15px;">$${booking.estimated_price}</td></tr>` : ''}
                  ${booking.special_requests ? `<tr><td style="padding: 6px 0; color: #94a3b8;">Notes:</td><td style="padding: 6px 0; color: #cbd5e1; font-style: italic;">"${booking.special_requests}"</td></tr>` : ''}
                </table>
              </div>

              <!-- Quick Action Links -->
              <div style="text-align: center; margin-top: 20px;">
                ${booking.phone ? `
                  <a href="https://wa.me/${(booking.whatsapp || booking.phone).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${booking.customer_name}, this is Sareth from Cambodia Cab Drivers regarding your booking #${booking.booking_reference}.`)}"
                     style="display: inline-block; background: #10b981; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 8px; font-weight: bold; font-size: 13px; margin: 4px;">
                    💬 Open Customer WhatsApp
                  </a>
                ` : ''}
                ${booking.email ? `
                  <a href="mailto:${booking.email}?subject=${encodeURIComponent(`Confirmation: Cambodia Cab Drivers Booking #${booking.booking_reference}`)}"
                     style="display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 8px; font-weight: bold; font-size: 13px; margin: 4px;">
                    ✉️ Reply via Email
                  </a>
                ` : ''}
              </div>

            </div>
          `,
        };
        await transporter.sendMail(adminMail);
        sentResults.admin = true;
      } catch (err: any) {
        console.error("Failed to send admin booking alert:", err);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Booking confirmation email processed.",
      results: sentResults,
    });
  } catch (error: any) {
    console.error("Booking API function error:", error);
    return res.status(500).json({
      error: error.message || "Failed to process booking email.",
    });
  }
}
