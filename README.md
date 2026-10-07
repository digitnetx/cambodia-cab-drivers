# Cambodia Taxi Cab

Cambodia Taxi Cab is a responsive private-transport and travel website for Cambodia. It lets visitors explore airport transfers, fixed-price routes, vehicles, private tours, destinations, and driver services, then contact the team or submit a booking request. A protected admin area lets the business team manage the site without editing code.

**Live website:** [www.cambodiataxicab.com](https://www.cambodiataxicab.com/)

## What the project includes

### Public website

- Cambodia private taxi, airport transfer, route-pricing, vehicle, tour, destination, and private-driver pages.
- Mobile-first design with a full desktop navigation experience.
- Booking and contact forms delivered through Formspree.
- WhatsApp and Telegram contact journeys.
- Search-engine metadata, structured data, sitemap, robots rules, AdSense support, and social sharing metadata.
- Responsive images from a direct URL, Supabase Storage, or database BYTEA fields.

### Admin control center

- Bookings and customer messages.
- Routes, airport transfers, vehicle fleet, and services.
- Tours, destinations, FAQs, reviews, homepage blocks, driver profile, and website settings.
- Media library for URL, Supabase Storage, and database image uploads.
- SEO and social-account settings.
- Route-level control over which vehicle prices are displayed: Sedan, SUV, and/or Van.

## Technology

- React 19 and TypeScript
- Vite and Tailwind CSS
- Supabase for data, authentication, and Storage
- Vercel for deployment and serverless email endpoints
- Formspree for public form delivery
- Nodemailer for optional SMTP-based admin email features

## Project layout

```text
api/                  Vercel serverless email endpoints
public/               Static public files: sitemap, robots, ads.txt, manifest
src/
  components/admin/   Admin CMS screens and reusable admin controls
  components/public/  Visitor-facing sections, cards, forms, and pages
  components/layout/  Shared header, footer, navigation, and alerts
  context/            Shared application state and content actions
  lib/                Supabase, API, forms, SEO, image, and route helpers
  types/              TypeScript content models
supabase/
  migrations/         Incremental schema updates
  seed.sql             Optional starter content
supabase_schema.sql   Complete base database schema
server.ts             Local development server
```

## Run locally

### Requirements

- Node.js 20 or newer
- A Supabase project
- Optional: Gmail SMTP credentials for the admin email test endpoint

### Install and start

```bash
npm install
npm run dev
```

Open the local address shown in the terminal, normally `http://localhost:3000`.

### Validate before deployment

```bash
npm run lint
npm run build
```

`npm run lint` runs TypeScript validation. Do not append words such as `passes` to the command, because TypeScript treats them as file paths.

## Environment variables

Create a local `.env` file. Never commit it or copy its secret values into the frontend.

| Variable | Used for |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Public Supabase browser key |
| `VITE_SITE_URL` | Canonical website URL |
| `VITE_WHATSAPP_NUMBER` | WhatsApp contact number |
| `VITE_TELEGRAM_USERNAME` | Telegram account name |
| `GOOGLE_PLACES_API_KEY` | Server-only Google Places API key for live Google Business Profile reviews |
| `GOOGLE_PLACE_ID` | Google Place resource ID for Cambodia Taxi Cab, such as `places/ChIJ...` |
| `SMTP_HOST` | SMTP host for serverless email |
| `SMTP_PORT` | SMTP port |
| `SMTP_USER` | SMTP username/email address |
| `SMTP_PASSWORD` | SMTP password or app password |
| `ADMIN_EMAIL` | Internal notification recipient |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only Supabase administrative key; never expose it in `VITE_*` variables |

Set the required production variables in **Vercel → Project → Settings → Environment Variables**, then redeploy. Public form submissions are currently sent to the Formspree endpoint configured in `src/lib/formspree.ts`.

## Database and content setup

1. In Supabase, run `supabase_schema.sql` for a new database.
2. Optionally run `supabase/seed.sql` to create starter content.
3. Apply every applicable file in `supabase/migrations/` in date order. These migrations add CMS features such as direct image storage, longer CMS text columns, driver-profile images, social links, media BYTEA support, and route price-display controls.
4. Refresh the Supabase schema cache or wait briefly after applying a migration before testing the admin dashboard.

For media uploads, configure the `site-media` storage bucket using `supabase/storage_site_media.sql` when using Supabase Storage. Database image mode stores smaller files directly in BYTEA columns; Storage is the better option for larger images.

## Deployment

The site is configured for Vercel.

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Add production environment variables.
4. Deploy from the `main` branch.
5. Confirm these URLs are public after deployment:

   - `/`
   - `/sitemap.xml`
   - `/robots.txt`
   - `/ads.txt`

`vercel.json` rewrites public SPA routes to `index.html` while preserving `/api/*` serverless endpoints.

## Search engine setup

- Add the Google Search Console verification meta tag to `index.html` when Google provides one.
- Submit `https://www.cambodiataxicab.com/sitemap.xml` in Google Search Console.
- Request indexing for the homepage and priority pages after major content changes.
- Maintain original route, destination, tour, and service content. Technical SEO helps discovery; helpful content, business profiles, reviews, and reputable links support rankings.

## Documentation

See [PROJECT_GUIDE.md](PROJECT_GUIDE.md) for the day-to-day admin, media, forms, deployment, and troubleshooting guide.

## Safety notes

- Do not commit `.env` files or SMTP/Supabase service-role credentials.
- Do not expose SMTP passwords or Supabase service-role keys in browser code.
- Test database migrations in a backup or staging project before using them on production.
- Use Supabase Storage for large images rather than embedding large image data in database rows.
