import { getSmtpCredentials, getTransporter } from "../_lib/smtp";

export default async function handler(req: any, res: any) {
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
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }
    body = body || {};

    const { name, email, phone, subject, message } = body;

    if (!name || !message) {
      return res.status(400).json({ error: "Name and message are required." });
    }

    const { user: smtpUser, pass: smtpPass, adminEmail } = getSmtpCredentials();

    if (!smtpUser || !smtpPass) {
      console.warn("SMTP not configured in environment variables or settings.");
      return res.status(200).json({
        success: false,
        warning: "SMTP not configured. Contact notification skipped.",
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
                  Private Driver & Custom Tours with Sareth
                </p>
              </div>

              <h2 style="color: #f59e0b; font-size: 18px; font-weight: 700; margin: 0 0 10px 0;">
                Hello ${name},
              </h2>
              <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
                Thank you for contacting Cambodia Taxi Cab. We have received your inquiry regarding <strong>"${subject || 'General Inquiry'}"</strong>. Sareth will respond to you as soon as possible.
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
                <a href="https://wa.me/85516509371?text=${encodeURIComponent(`Hello Sareth! I sent a message regarding "${subject || 'travel inquiry'}".`)}"
                   style="display: inline-block; background: #10b981; color: #ffffff; text-decoration: none; padding: 10px 20px; border-radius: 8px; font-weight: 800; font-size: 13px;">
                  💬 Chat Directly on WhatsApp (+855 16 509 371)
                </a>
              </div>

              <div style="border-top: 1px solid #1e293b; padding-top: 20px; font-size: 12px; color: #64748b; text-align: center;">
                <p style="margin: 0;">Cambodia Cab Drivers • Siem Reap & Phnom Penh</p>
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

    return res.status(200).json({
      success: true,
      message: "Contact message email processed.",
      results: sentResults,
    });
  } catch (error: any) {
    console.error("Message API function error:", error);
    return res.status(500).json({
      error: error.message || "Failed to process contact email.",
    });
  }
}
