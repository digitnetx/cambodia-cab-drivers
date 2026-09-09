import express from "express";
import path from "path";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";
import { createServer as createViteServer } from "vite";
import { db } from "./server/db";

// Load environment variables
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabaseAdmin = supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, { auth: { persistSession: false } })
  : null;

const publicSubmissionCollections = new Set(["bookings", "messages"]);
const validCollections = new Set([
  "whyChooseUs", "services", "tours", "destinations", "bookings", "reviews",
  "messages", "faqs", "vehicles", "routes", "airports", "mediaItems",
]);
const validSingletons = new Set(["siteSettings", "homepageSettings", "driverProfile", "seoSettings"]);

async function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (!supabaseAdmin) {
    return res.status(503).json({ success: false, error: "Admin API is unavailable until Supabase server credentials are configured." });
  }

  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "").trim();
  if (!token) return res.status(401).json({ success: false, error: "Admin sign-in required." });

  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
  if (userError || !userData.user) return res.status(401).json({ success: false, error: "Your admin session has expired. Please sign in again." });

  const { data: admin, error: adminError } = await supabaseAdmin
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (adminError || !admin) return res.status(403).json({ success: false, error: "This account is not an approved administrator." });
  next();
}

function assertCollection(name: string, res: express.Response) {
  if (!validCollections.has(name)) {
    res.status(404).json({ success: false, error: "Unknown collection." });
    return false;
  }
  return true;
}

// -------------------------------------------------------------
// PERSISTENT DATABASE API ENDPOINTS (No Hardcoding, Real Database)
// -------------------------------------------------------------

// 1. Get Database Health & Live Record Statistics
app.get("/api/db/status", (req, res) => {
  try {
    const stats = db.getStats();
    res.json({ success: true, ...stats });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Fetch Entire Database (All Collections & Settings)
app.get("/api/db/public", (req, res) => {
  try {
    const { bookings, messages, siteSettings, ...publicData } = db.getDatabase();
    // SMTP credentials belong in environment variables only. Never send them to browsers.
    const { smtp_password: _smtpPassword, ...safeSmtpSettings } = siteSettings.smtp_settings || {};
    res.json({
      success: true,
      data: {
        ...publicData,
        siteSettings: { ...siteSettings, smtp_settings: safeSmtpSettings },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/db/all", requireAdmin, (req, res) => {
  try {
    const fullDb = db.getDatabase();
    const { smtp_password: _smtpPassword, ...safeSmtpSettings } = fullDb.siteSettings.smtp_settings || {};
    res.json({
      success: true,
      data: {
        ...fullDb,
        siteSettings: { ...fullDb.siteSettings, smtp_settings: safeSmtpSettings },
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Reset Database to Factory Defaults
app.post("/api/db/reset", requireAdmin, async (req, res) => {
  try {
    const fresh = await db.resetDatabase();
    res.json({ success: true, message: "Database reset to factory defaults.", data: fresh });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Get a Single Collection (e.g. /api/db/bookings, /api/db/tours)
app.get("/api/db/collection/:name", (req, res) => {
  try {
    const name = req.params.name as any;
    if (!assertCollection(name, res)) return;
    if (["bookings", "messages"].includes(name)) {
      return res.status(401).json({ success: false, error: "Admin sign-in required for this collection." });
    }
    const items = db.getCollection(name);
    if (items === undefined) {
      return res.status(404).json({ success: false, error: `Collection ${name} not found` });
    }
    res.json({ success: true, collection: name, data: items });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. Insert Item into Collection (e.g. Tours, Vehicles, Destinations, Reviews, etc.)
app.post("/api/db/collection/:name", (req, res, next) => {
  const name = req.params.name;
  return publicSubmissionCollections.has(name) ? next() : requireAdmin(req, res, next);
}, async (req, res) => {
  try {
    const name = req.params.name as any;
    if (!assertCollection(name, res)) return;
    const item = req.body;
    if (!item) {
      return res.status(400).json({ success: false, error: "Item payload required" });
    }
    const inserted = await db.insertItem(name, item);
    res.json({ success: true, collection: name, data: inserted });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. Update Single Item in Collection
app.put("/api/db/collection/:name/:id", requireAdmin, async (req, res) => {
  try {
    const name = req.params.name as any;
    if (!assertCollection(name, res)) return;
    const id = req.params.id;
    const updates = req.body;
    const updated = await db.updateItem(name, id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, error: `Item ${id} not found in ${name}` });
    }
    res.json({ success: true, collection: name, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 7. Delete Item from Collection
app.delete("/api/db/collection/:name/:id", requireAdmin, async (req, res) => {
  try {
    const name = req.params.name as any;
    if (!assertCollection(name, res)) return;
    const id = req.params.id;
    await db.deleteItem(name, id);
    res.json({ success: true, collection: name, message: `Item ${id} deleted` });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 8. Batch Replace/Reorder Entire Collection
app.put("/api/db/batch/:name", requireAdmin, async (req, res) => {
  try {
    const name = req.params.name as any;
    if (!assertCollection(name, res)) return;
    const items = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, error: "Array of items required" });
    }
    await db.setCollection(name, items as any);
    res.json({ success: true, collection: name, count: items.length });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 9. Update Singleton Settings (siteSettings, homepageSettings, driverProfile, seoSettings)
app.put("/api/db/singleton/:name", requireAdmin, async (req, res) => {
  try {
    const name = req.params.name as any;
    if (!validSingletons.has(name)) return res.status(404).json({ success: false, error: "Unknown settings collection." });
    const updates = req.body;
    if (name === "siteSettings" && updates?.smtp_settings) {
      // Credentials are read exclusively from server environment variables.
      delete updates.smtp_settings.smtp_password;
    }
    const updated = await db.updateSingleton(name, updates);
    res.json({ success: true, singleton: name, data: updated });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Helper to resolve SMTP user and password with all alias and override support
function getSmtpCredentials() {
  const user = (process.env.SMTP_USER || process.env.EMAIL_USER || process.env.GMAIL_USER || "").trim();
  let pass = (process.env.SMTP_PASSWORD || process.env.EMAIL_PASS || process.env.SMTP_PASS || process.env.GMAIL_PASSWORD || process.env.GMAIL_APP_PASSWORD || "").trim();
  // Strip spaces & quotes if user pasted 16-char Gmail App Password with spaces (e.g. "abcd efgh ijkl mnop")
  pass = pass.replace(/[\s"']/g, "");

  const adminEmail = (process.env.ADMIN_EMAIL || process.env.ADMIN_NOTIFICATION_EMAIL || user || "").trim();
  const host = (process.env.SMTP_HOST || "smtp.gmail.com").trim();
  const rawPort = process.env.SMTP_PORT || (host === "smtp.gmail.com" ? "465" : "587");
  const port = parseInt(String(rawPort), 10) || 465;
  return { user, pass, adminEmail, host, port };
}

// Create nodemailer transporter helper
function getTransporter() {
  const { user, pass, host, port } = getSmtpCredentials();

  if (!user || !pass) {
    throw new Error(
      "Gmail SMTP is not configured. Please set SMTP_USER and SMTP_PASSWORD with your 16-character Gmail App Password."
    );
  }

  // If using Gmail, nodemailer's native service mode is exceptionally stable
  if (host === "smtp.gmail.com" || user.toLowerCase().endsWith("@gmail.com")) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user,
        pass,
      },
    });
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}


// Check SMTP Configuration Status
app.get("/api/email/status", requireAdmin, (req, res) => {
  const { user, pass, adminEmail, host, port } = getSmtpCredentials();
  const isConfigured = Boolean(user && pass);

  res.json({
    configured: isConfigured,
    smtpUser: user ? user.replace(/(.{2})(.*)(?=@)/, "$1***") : null,
    adminEmail: adminEmail || null,
    host,
    port: String(port),
  });
});

// Test SMTP Connection and Send Test Email
app.post("/api/email/test", requireAdmin, async (req, res) => {
  try {
    const { targetEmail } = req.body;
    const { user: smtpUser, adminEmail } = getSmtpCredentials();
    const recipient = targetEmail || adminEmail || smtpUser;

    if (!recipient) {
      return res.status(400).json({
        error: "Recipient email is required.",
      });
    }

    const transporter = getTransporter();

    // Verify connection configuration
    await transporter.verify();

    const mailOptions = {
      from: `"Cambodia Taxi Cab" <${smtpUser}>`,
      to: recipient,
      subject: "✅ Gmail SMTP Notification Test - Cambodia Taxi Cab",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0b0f19; color: #f8fafc; padding: 32px; border-radius: 18px; border: 1px solid #1e293b;">
          <div style="text-align: center; border-bottom: 1px solid #1e293b; padding-bottom: 20px; margin-bottom: 24px;">
            <span style="background: rgba(245, 158, 11, 0.15); color: #f59e0b; font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; padding: 4px 12px; border-radius: 20px; border: 1px solid rgba(245, 158, 11, 0.3);">
              Gmail SMTP Active
            </span>
            <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 12px 0 4px 0;">
              Cambodia Taxi Cab
            </h1>
            <p style="color: #94a3b8; font-size: 13px; margin: 0;">
              cambodiataxicab.com • Private Driver & Custom Tours
            </p>
          </div>

          <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 16px; margin-bottom: 20px;">
            <p style="color: #34d399; font-size: 15px; font-weight: 700; margin: 0 0 6px 0;">
              🎉 Gmail SMTP Connection Verified!
            </p>
            <p style="color: #cbd5e1; font-size: 13px; line-height: 1.5; margin: 0;">
              Your Gmail App Password is configured correctly. Automatic dual notifications are active:
            </p>
            <ul style="color: #cbd5e1; font-size: 13px; line-height: 1.6; margin: 8px 0 0 0; padding-left: 20px;">
              <li><strong>Public Travelers:</strong> Will receive booking & message receipts instantly.</li>
              <li><strong>Administrator (${adminEmail}):</strong> Will receive immediate booking requests & customer inquiries.</li>
            </ul>
          </div>

          <div style="background: #131b2e; padding: 18px; border-radius: 12px; border: 1px solid #1e293b; margin-bottom: 24px;">
            <h3 style="color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px 0;">
              Configuration Details
            </h3>
            <table style="width: 100%; font-size: 13px; color: #e2e8f0; border-collapse: collapse;">
              <tr>
                <td style="padding: 5px 0; color: #64748b; width: 140px;">Sender Account:</td>
                <td style="padding: 5px 0; font-weight: 600; font-family: monospace;">${smtpUser}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #64748b;">Admin Recipient:</td>
                <td style="padding: 5px 0; font-weight: 600; font-family: monospace;">${recipient}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #64748b;">Dispatched At:</td>
                <td style="padding: 5px 0;">${new Date().toLocaleString()}</td>
              </tr>
            </table>
          </div>

          <p style="font-size: 12px; color: #64748b; text-align: center; margin: 0;">
            Cambodia Taxi Cab • cambodiataxicab.com
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    res.json({
      success: true,
      message: `Test email sent successfully to ${recipient}`,
      messageId: info.messageId,
    });
  } catch (error: any) {
    console.error("SMTP Test Error:", error);
    res.status(500).json({
      error: error.message || "Failed to send test email.",
      details:
        "Please make sure you generated a 16-character Gmail App Password from Google Account Security (myaccount.google.com/apppasswords).",
    });
  }
});

// Send Booking Confirmation (To Traveler) & Alert (To Admin)
app.post("/api/email/booking-confirmation", async (req, res) => {
  try {
    const booking = req.body;

    if (!booking || !booking.booking_reference) {
      return res.status(400).json({ error: "Invalid booking data provided." });
    }

    const { user: smtpUser, pass: smtpPass, adminEmail } = getSmtpCredentials();

    if (!smtpUser || !smtpPass) {
      console.warn("SMTP not configured. Booking saved without Gmail dispatch.");
      return res.json({
        success: false,
        warning: "SMTP not configured. Booking saved locally.",
      });
    }

    const transporter = getTransporter();
    const sentResults: { customer?: boolean; admin?: boolean; error?: string } = {};

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
                  cambodiataxicab.com • Professional Driver Fleet
                </p>
              </div>

              <!-- Greeting -->
              <h2 style="color: #34d399; font-size: 18px; font-weight: 700; margin: 0 0 8px 0;">
                Thank you for your booking request, ${booking.customer_name}!
              </h2>
              <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
                We have received your trip reservation <strong>#${booking.booking_reference}</strong>. Our dispatch team has been notified and will verify your pickup details and vehicle arrangement promptly.
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
                <a href="https://wa.me/85516509371?text=${encodeURIComponent(`Hello Cambodia Taxi Cab! I submitted booking #${booking.booking_reference} for ${booking.travel_date}.`)}"
                   style="display: inline-block; background: #10b981; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 800; font-size: 14px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);">
                  💬 Chat on WhatsApp (+855 16 509 371)
                </a>
              </div>

              <!-- Driver Information -->
              <div style="border-top: 1px solid #1e293b; padding-top: 20px; font-size: 12px; color: #94a3b8; text-align: center;">
                <p style="margin: 0 0 4px 0; font-weight: 600; color: #cbd5e1;">Cambodia Taxi Cab • cambodiataxicab.com</p>
                <p style="margin: 0 0 4px 0;">Phone & WhatsApp: +855 16 509 371 | Email: digitnetx@gmail.com</p>
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

    res.json({
      success: true,
      message: "Booking emails processed.",
      results: sentResults,
    });
  } catch (error: any) {
    console.error("Booking email error:", error);
    res.status(500).json({ error: error.message || "Failed to dispatch booking emails." });
  }
});

// Send Contact Message Receipt (To Traveler) & Alert (To Admin)
app.post("/api/email/message-confirmation", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({ error: "Name and message are required." });
    }

    const { user: smtpUser, pass: smtpPass, adminEmail } = getSmtpCredentials();

    if (!smtpUser || !smtpPass) {
      console.warn("SMTP not configured. Message saved without Gmail dispatch.");
      return res.json({
        success: false,
        warning: "SMTP not configured. Message saved locally.",
      });
    }

    const transporter = getTransporter();
    const sentResults: { customer?: boolean; admin?: boolean } = {};

    // 1. Send receipt to sender if customer email provided
    if (email) {
      try {
        await transporter.sendMail({
          from: `"Cambodia Taxi Cab" <${smtpUser}>`,
          to: email,
          subject: `📩 We received your inquiry, ${name} - Cambodia Taxi Cab`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0b0f19; color: #f8fafc; padding: 32px; border-radius: 18px; border: 1px solid #1e293b;">
              
              <div style="text-align: center; border-bottom: 1px solid #1e293b; padding-bottom: 20px; margin-bottom: 24px;">
                <span style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; padding: 4px 12px; border-radius: 20px; border: 1px solid rgba(56, 189, 248, 0.3);">
                  Message Received
                </span>
                <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 12px 0 4px 0;">
                  Cambodia Taxi Cab
                </h1>
                <p style="color: #94a3b8; font-size: 13px; margin: 0;">
                  cambodiataxicab.com • Private Driver & Custom Tours
                </p>
              </div>

              <h2 style="color: #f59e0b; font-size: 18px; font-weight: 700; margin: 0 0 10px 0;">
                Hello ${name},
              </h2>
              <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
                Thank you for contacting Cambodia Taxi Cab. We have received your inquiry regarding <strong>"${subject || 'General Inquiry'}"</strong>. Our team will respond to you as soon as possible.
              </p>

              <div style="background: #131b2e; padding: 18px; border-radius: 12px; border: 1px solid #1e293b; margin-bottom: 24px;">
                <p style="margin: 0 0 8px 0; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 1px;">
                  Your Message:
                </p>
                <p style="margin: 0; font-size: 13px; color: #e2e8f0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
              </div>

              <div style="background: #064e3b; padding: 18px; border-radius: 12px; border: 1px solid #059669; margin-bottom: 24px; text-align: center;">
                <p style="color: #ecfdf5; font-size: 13px; margin: 0 0 10px 0; font-weight: 700;">
                  Need an Immediate Response?
                </p>
                <a href="https://wa.me/85516509371?text=${encodeURIComponent(`Hello! I sent an inquiry regarding "${subject || 'travel inquiry'}" on cambodiataxicab.com.`)}"
                   style="display: inline-block; background: #10b981; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 800; font-size: 13px;">
                  💬 Chat Directly on WhatsApp (+855 16 509 371)
                </a>
              </div>

              <div style="border-top: 1px solid #1e293b; padding-top: 20px; font-size: 12px; color: #64748b; text-align: center;">
                <p style="margin: 0;">Cambodia Taxi Cab • cambodiataxicab.com</p>
              </div>

            </div>
          `,
        });
        sentResults.customer = true;
      } catch (err: any) {
        console.error("Failed to send customer message receipt:", err);
      }
    }

    // 2. Send notification alert to Admin
    if (adminEmail) {
      try {
        await transporter.sendMail({
          from: `"Website Contact Form" <${smtpUser}>`,
          to: adminEmail,
          subject: `📩 [NEW INQUIRY] ${name}: ${subject || 'General Inquiry'}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #090d16; color: #f8fafc; padding: 28px; border-radius: 18px; border: 1px solid #1e293b;">
              
              <div style="background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 12px; padding: 14px 18px; margin-bottom: 20px;">
                <h3 style="color: #38bdf8; margin: 0; font-size: 17px; font-weight: 800;">
                  ✉️ New Contact Form Message
                </h3>
                <p style="color: #cbd5e1; font-size: 13px; margin: 4px 0 0 0;">
                  A visitor has submitted a new inquiry through your website contact page.
                </p>
              </div>

              <div style="background: #111827; padding: 18px; border-radius: 12px; border: 1px solid #1f2937; margin-bottom: 20px;">
                <table style="width: 100%; font-size: 13px; color: #e2e8f0; border-collapse: collapse;">
                  <tr><td style="padding: 6px 0; color: #94a3b8; width: 130px;">Sender Name:</td><td style="padding: 6px 0; font-weight: 700; color: #ffffff;">${name}</td></tr>
                  <tr><td style="padding: 6px 0; color: #94a3b8;">Email:</td><td style="padding: 6px 0;"><a href="mailto:${email}" style="color: #38bdf8; text-decoration: none;">${email || 'Not provided'}</a></td></tr>
                  <tr><td style="padding: 6px 0; color: #94a3b8;">Phone:</td><td style="padding: 6px 0;"><a href="tel:${phone}" style="color: #34d399; text-decoration: none;">${phone || 'Not provided'}</a></td></tr>
                  <tr><td style="padding: 6px 0; color: #94a3b8;">Subject:</td><td style="padding: 6px 0; font-weight: 700; color: #f59e0b;">${subject || 'General Inquiry'}</td></tr>
                </table>
              </div>

              <div style="background: #111827; padding: 18px; border-radius: 12px; border: 1px solid #1f2937; margin-bottom: 20px;">
                <p style="margin: 0 0 8px 0; font-size: 11px; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 1px;">Message Content:</p>
                <div style="font-size: 13px; color: #f3f4f6; line-height: 1.6; white-space: pre-wrap; background: #0b0f19; padding: 14px; border-radius: 8px; border: 1px solid #1e293b;">${message}</div>
              </div>

              <div style="text-align: center;">
                ${phone ? `
                  <a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${name}, thank you for your inquiry regarding "${subject || 'Cambodia travel'}".`)}"
                     style="display: inline-block; background: #10b981; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 8px; font-weight: bold; font-size: 13px; margin: 4px;">
                    💬 Reply on WhatsApp
                  </a>
                ` : ''}
                ${email ? `
                  <a href="mailto:${email}?subject=${encodeURIComponent(`Re: ${subject || 'Your inquiry with Cambodia Cab Drivers'}`)}"
                     style="display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; padding: 10px 18px; border-radius: 8px; font-weight: bold; font-size: 13px; margin: 4px;">
                    ✉️ Reply via Email
                  </a>
                ` : ''}
              </div>

            </div>
          `,
        });
        sentResults.admin = true;
      } catch (err: any) {
        console.error("Failed to send admin message alert:", err);
      }
    }

    res.json({
      success: true,
      message: "Contact message emails processed.",
      results: sentResults,
    });
  } catch (error: any) {
    console.error("Message email error:", error);
    res.status(500).json({ error: error.message || "Failed to send message email." });
  }
});

// Start Express Server with Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
