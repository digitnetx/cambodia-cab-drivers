import { createClient } from "@supabase/supabase-js";

export async function requireAdmin(req: any, res: any): Promise<boolean> {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  const token = req.headers?.authorization?.replace(/^Bearer\s+/i, "").trim();

  if (!url || !serviceRoleKey) {
    res.status(503).json({ error: "Admin API is unavailable until Supabase server credentials are configured." });
    return false;
  }
  if (!token) {
    res.status(401).json({ error: "Admin sign-in required." });
    return false;
  }

  const supabase = createClient(url, serviceRoleKey, { auth: { persistSession: false } });
  const { data: userData, error: userError } = await supabase.auth.getUser(token);
  if (userError || !userData.user) {
    res.status(401).json({ error: "Your admin session has expired. Please sign in again." });
    return false;
  }

  const { data: admin, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userData.user.id)
    .maybeSingle();
  if (adminError || !admin) {
    res.status(403).json({ error: "This account is not an approved administrator." });
    return false;
  }
  return true;
}
