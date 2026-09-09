import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const projectRoot = process.cwd();
const databasePath = path.join(projectRoot, "data", "database.json");
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Set VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env before running this migration.");
}
if (!fs.existsSync(databasePath)) {
  throw new Error(`Local database not found: ${databasePath}`);
}

const localData = JSON.parse(fs.readFileSync(databasePath, "utf8"));
const { bookings = [], messages = [], _metadata: _metadata, ...cmsContent } = localData;
if (cmsContent.siteSettings?.smtp_settings) {
  const { smtp_password: _password, ...safeSmtpSettings } = cmsContent.siteSettings.smtp_settings;
  cmsContent.siteSettings.smtp_settings = safeSmtpSettings;
}
const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
const isUuid = (value: unknown) => typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);

const { error: cmsError } = await supabase
  .from("cms_content")
  .upsert({ id: "main", content: cmsContent }, { onConflict: "id" });
if (cmsError) throw cmsError;

// Local IDs are not valid UUIDs, so Supabase creates new IDs while preserving
// every transferable booking/message field and booking reference.
const bookingRows = bookings.map(({ id: _id, route_id: _routeId, service_id, tour_id, ...booking }: Record<string, unknown>) => ({
  ...booking,
  service_id: isUuid(service_id) ? service_id : null,
  tour_id: isUuid(tour_id) ? tour_id : null,
}));
if (bookingRows.length) {
  const { error } = await supabase.from("bookings").upsert(bookingRows, { onConflict: "booking_reference" });
  if (error) throw error;
}

const messageRows = messages.map(({ id: _id, ...message }: Record<string, unknown>) => message);
if (messageRows.length) {
  const { error } = await supabase.from("contact_messages").insert(messageRows);
  if (error) throw error;
}

console.log(`Migrated CMS content, ${bookingRows.length} booking(s), and ${messageRows.length} message(s) to Supabase.`);
