import nodemailer from "nodemailer";

export function getSmtpCredentials() {
  const user = (
    process.env.SMTP_USER ||
    process.env.EMAIL_USER ||
    process.env.GMAIL_USER ||
    ""
  ).trim();

  let pass = (
    process.env.SMTP_PASSWORD ||
    process.env.EMAIL_PASS ||
    process.env.SMTP_PASS ||
    process.env.GMAIL_PASSWORD ||
    process.env.GMAIL_APP_PASSWORD ||
    ""
  ).trim();

  // Strip spaces if user pasted 16-char Gmail App Password with spaces (e.g., "abcd efgh ijkl mnop")
  pass = pass.replace(/[\s"']/g, "");

  const adminEmail = (
    process.env.ADMIN_EMAIL ||
    process.env.ADMIN_NOTIFICATION_EMAIL ||
    user ||
    ""
  ).trim();

  const host = (process.env.SMTP_HOST || "smtp.gmail.com").trim();
  const rawPort = process.env.SMTP_PORT || (host === "smtp.gmail.com" ? "465" : "587");
  const port = parseInt(String(rawPort), 10) || 465;

  return { user, pass, adminEmail, host, port };
}

export function getTransporter() {
  const { user, pass, host, port } = getSmtpCredentials();

  if (!user || !pass) {
    throw new Error(
      "Gmail SMTP is not configured. Set SMTP_USER and SMTP_PASSWORD in the server environment."
    );
  }

  // Native Gmail service mode
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
