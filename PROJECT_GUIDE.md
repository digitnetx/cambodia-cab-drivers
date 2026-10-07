# Cambodia Taxi Cab Project Guide

This guide explains how the Cambodia Taxi Cab website is operated after deployment.

## Purpose

The project is a customer-facing transport website and a content-management dashboard for a Cambodia taxi and driver service. The public website helps visitors compare services and request rides. The dashboard lets the business update prices, pages, images, driver information, and customer-facing content.

## Public pages

| Area | Purpose |
| --- | --- |
| Home | Main service overview, booking widget, routes, vehicles, tours, destinations, FAQs, and trust content |
| Airport Transfers | Phnom Penh and Siem Reap airport pickup information |
| Popular Routes | Fixed-price intercity and airport route comparisons |
| Vehicles | Fleet categories, passenger capacity, luggage capacity, and starting prices |
| Services | Transportation services offered by the company |
| Tours | Private sightseeing and day-tour listings |
| Destinations | Cambodia destination guides |
| Private Driver | Driver profile, experience, qualifications, and direct contact information |
| Book / Contact | Booking and enquiry forms delivered through Formspree |

## Admin workflow

Sign in through `/admin/login`, then use the sidebar to manage content.

### Routes and pricing

Create or edit routes in **Routes & Pricing**. Each route can include:

- origin, destination, route name, duration, and distance
- Sedan, SUV, and Van prices
- route image from a URL, Supabase Storage, or database image data
- airport code and airport route status
- display-order and publication settings

Use the **Show Sedan**, **Show SUV**, and **Show Van** options to choose exactly which price categories appear publicly. At least one category must remain enabled.

### Vehicles, services, tours, and destinations

These areas work similarly: add a title, description, price or ordering details, and an image. Only active/published items appear on the public website.

For tours and destinations, keep short descriptions concise because they appear in cards and search previews. Put longer detail in the full-description field.

### Image choices

The image controls offer three options:

1. **Image URL** — paste a publicly accessible direct image URL.
2. **Upload to Storage** — recommended for normal site photos. The file is stored in Supabase Storage and the database saves its public URL.
3. **Store in Database** — stores a smaller file as BYTEA data in Supabase. Use this only for images within the stated size limit.

The Media Library provides the same options for reusable assets. If an upload appears in the form but does not save, check that the relevant database migration has been applied and that the Storage bucket policy allows the upload.

### Driver profile

Use **Driver / Fleet Profile** to update:

- driver name, headline, experience, completed trips, and rating
- professional license information
- profile and cover photographs
- biography, qualifications, service strengths, and reasons to book directly

Save changes before leaving the page. Profile image data requires the driver-profile image migration to be present in Supabase.

### Forms and email

Public booking and contact forms use Formspree. The endpoint is held in `src/lib/formspree.ts`.

The project also contains protected serverless email endpoints in `api/email/` for admin workflows. SMTP features require correct Vercel production environment variables. Many serverless platforms restrict direct SMTP connections, so Formspree is the dependable public-form delivery path unless an email API provider is configured.

## SEO operations

The project includes:

- `public/sitemap.xml`
- `public/robots.txt`
- `public/ads.txt`
- canonical, Open Graph, Twitter, and Search Console metadata in `index.html`
- structured LocalBusiness and TaxiService data

### Routine SEO checklist

1. Keep the sitemap public and submit it in Google Search Console.
2. Publish useful, original content about real routes, vehicles, pickup locations, and destinations.
3. Use descriptive image names and accurate alt text.
4. Add the official website link to Google Business Profile, Facebook, Tripadvisor, and genuine local travel directories.
5. Re-run Google PageSpeed Insights after large design or image changes.
6. Avoid purchased or automated backlink schemes.

PageSpeed’s SEO score is a technical check, not a ranking guarantee. Image size, user experience, original content, reviews, and reputable references continue to matter.

### Live Google Business Profile reviews

The footer-area Google review section can display live review data through Google Places when these **Vercel server-only** variables are configured:

- `GOOGLE_PLACES_API_KEY`
- `GOOGLE_PLACE_ID`

Enable the Google Places API for the key, restrict the key to the production server where possible, and use the official Google Place resource ID. Without these variables, the section displays only Google-source reviews that an administrator has approved in **Reviews Moderation**. The website does not scrape Google reviews.

## GoDaddy DNS notes

### Google Search Console domain verification

To verify the complete domain, create a TXT record in GoDaddy:

| Field | Value |
| --- | --- |
| Type | `TXT` |
| Name / Host | `@` |
| Value | The complete `google-site-verification=...` value supplied by Google |
| TTL | GoDaddy default |

Do not remove unrelated DNS records. DNS updates may take time to become visible.

### SPF and DMARC

SPF and DMARC records depend on the email provider that sends mail using `@cambodiataxicab.com`. Do not copy generic SPF values from the internet. Confirm the sending provider first, then use its official DNS instructions. A wrong SPF record can prevent legitimate mail delivery.

## Troubleshooting

| Symptom | First checks |
| --- | --- |
| Admin save returns a missing-column error | Apply the matching migration in `supabase/migrations/`, then allow Supabase schema cache to refresh |
| Image preview works but does not persist | Check database migration, Storage bucket setup, bucket policies, and image-size limit |
| Tour/service disappears after save | Confirm it is marked active/published and review the browser/network error for a database validation message |
| Public form does not deliver | Confirm the Formspree endpoint and Formspree dashboard settings |
| SMTP test fails only on Vercel | Verify Production environment variables and consider an email API provider because direct SMTP can be restricted in serverless environments |
| Google says a page is unknown | Submit the sitemap, use URL Inspection → Test Live URL, then request indexing once |
| Mobile PageSpeed is slow | Reduce image sizes, lazy-load below-the-fold images, avoid unnecessary scripts, and rerun the audit after deployment |

## Release checklist

Before publishing a production change:

1. Run `npm run lint`.
2. Run `npm run build`.
3. Confirm the changed public page works on a phone and desktop viewport.
4. Confirm relevant admin save actions work with the production Supabase database.
5. Check the live sitemap and robots files after Vercel deployment.
6. Request Google indexing only for major new or materially changed pages.
