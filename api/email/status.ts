import { getSmtpCredentials } from "../_lib/smtp";
import { requireAdmin } from "../_lib/admin";

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Authorization");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "OPTIONS") {
    return res.status(200).json({ status: "ok" });
  }
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed." });
  if (!(await requireAdmin(req, res))) return;

  const { user, pass, adminEmail, host, port } = getSmtpCredentials();
  const isConfigured = Boolean(user && pass);

  return res.status(200).json({
    configured: isConfigured,
    smtpUser: user ? user.replace(/(.{2})(.*)(?=@)/, "$1***") : null,
    adminEmail: adminEmail || null,
    host,
    port: String(port),
    runtime: "vercel-serverless",
  });
}
