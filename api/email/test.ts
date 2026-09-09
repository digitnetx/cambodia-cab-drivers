import { getSmtpCredentials, getTransporter } from "../_lib/smtp";
import { requireAdmin } from "../_lib/admin";

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    return res.status(200).json({ status: "ok" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Please use POST." });
  }
  try {
    if (!(await requireAdmin(req, res))) return;
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }
    body = body || {};

    const { targetEmail } = body;

    const { user: smtpUser, pass: smtpPass, adminEmail } = getSmtpCredentials();
    const recipient = targetEmail || adminEmail || smtpUser;

    if (!smtpUser || !smtpPass) {
      return res.status(400).json({
        success: false,
        error: "SMTP credentials missing.",
        message: "Please enter your Gmail address and 16-character App Password in Settings, or configure SMTP_USER and SMTP_PASSWORD in Vercel Environment Variables.",
      });
    }

    if (!recipient) {
      return res.status(400).json({
        success: false,
        error: "Recipient email is required.",
      });
    }

    const transporter = getTransporter();

    // Verify SMTP connection
    await transporter.verify();

    const mailOptions = {
      from: `"Cambodia Taxi Cab" <${smtpUser}>`,
      to: recipient,
      subject: "✅ Gmail SMTP Notification Test - Cambodia Taxi Cab",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0b0f19; color: #f8fafc; padding: 32px; border-radius: 18px; border: 1px solid #1e293b;">
          <div style="text-align: center; border-bottom: 1px solid #1e293b; padding-bottom: 20px; margin-bottom: 24px;">
            <span style="background: rgba(245, 158, 11, 0.15); color: #f59e0b; font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; padding: 4px 12px; border-radius: 20px; border: 1px solid rgba(245, 158, 11, 0.3);">
              Gmail SMTP Live
            </span>
            <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 12px 0 4px 0;">
              Cambodia Taxi Cab
            </h1>
            <p style="color: #94a3b8; font-size: 13px; margin: 0;">
              Live Email Delivery Verification
            </p>
          </div>

          <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 16px; margin-bottom: 20px;">
            <p style="color: #34d399; font-size: 15px; font-weight: 700; margin: 0 0 6px 0;">
              🎉 Gmail SMTP is Successfully Connected & Active!
            </p>
            <p style="color: #cbd5e1; font-size: 13px; line-height: 1.5; margin: 0;">
              Your Gmail App Password and notification settings are functionally verified.
            </p>
            <ul style="color: #cbd5e1; font-size: 13px; line-height: 1.6; margin: 8px 0 0 0; padding-left: 20px;">
              <li><strong>Travelers:</strong> Will automatically receive instant branded booking receipts & inquiries confirmation.</li>
              <li><strong>Driver Sareth:</strong> Will receive immediate notification alerts for every customer booking.</li>
            </ul>
          </div>

          <div style="background: #131b2e; padding: 18px; border-radius: 12px; border: 1px solid #1e293b; margin-bottom: 24px;">
            <table style="width: 100%; font-size: 13px; color: #e2e8f0; border-collapse: collapse;">
              <tr>
                <td style="padding: 5px 0; color: #64748b; width: 140px;">Sender Account:</td>
                <td style="padding: 5px 0; font-weight: 600; font-family: monospace;">${smtpUser}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #64748b;">Delivered To:</td>
                <td style="padding: 5px 0; font-weight: 600; font-family: monospace; color: #38bdf8;">${recipient}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #64748b;">Dispatched At:</td>
                <td style="padding: 5px 0;">${new Date().toLocaleString()}</td>
              </tr>
            </table>
          </div>

          <p style="font-size: 12px; color: #64748b; text-align: center; margin: 0;">
            Cambodia Cab Drivers • Driver Sareth
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return res.status(200).json({
      success: true,
      message: `Test email sent successfully to ${recipient}!`,
      messageId: info.messageId,
    });
  } catch (error: any) {
    console.error("Test email API error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to send test email.",
      hint: "Make sure you generated a 16-character App Password at myaccount.google.com/apppasswords with 2-Step Verification enabled.",
    });
  }
}
