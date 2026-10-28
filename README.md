# Arawali Textile website

Single-page site for Arawali Textile, Jaipur. Its main job is to turn European buyers into enquiries. Each enquiry is saved to Supabase, emailed to the owner, and acknowledged to the buyer by email, and the buyer gets a prefilled WhatsApp link as a fallback.

Stack: Next.js 16 (App Router, Cache Components), TypeScript, Tailwind CSS 4, Supabase, Resend, Zod and Playwright.

## Run it locally

```bash
npm install
cp .env.example .env.local   # fill in the keys (see below)
npm run dev                  # http://localhost:3000
```

If neither Supabase nor Resend is configured, the enquiry API logs each enquiry to the terminal in development and reports success, so you can work on the form without keys. In production it returns an error in that case.

Other scripts:

| Command | What it does |
| --- | --- |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` / `npm run typecheck` | ESLint and TypeScript |
| `npm test` | Playwright tests. They build and start the app on port 3100. Run `npx playwright install chromium` once first. |

## Environment variables

| Variable | Notes |
| --- | --- |
| `SUPABASE_URL` | Supabase → Project settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only. Never prefix it with `NEXT_PUBLIC_`. |
| `RESEND_API_KEY` | resend.com → API keys |
| `ENQUIRY_TO_EMAIL` | Where owner notifications go (default `arawali007@gmail.com`) |
| `ENQUIRY_FROM_EMAIL` | Sender address. It must be on a domain verified in Resend. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Digits only, with country code, e.g. `917877945556` |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL, used for metadata, sitemap and JSON-LD |

**Email sender:** until `arawalitextile.com` is verified in Resend (Resend → Domains, then add the DNS records it shows), set `ENQUIRY_FROM_EMAIL="Arawali Textile <onboarding@resend.dev>"`. Resend's test sender only delivers to the address that owns the Resend account, so buyer auto-replies won't arrive until the domain is verified.

## Database

Run [`supabase/schema.sql`](supabase/schema.sql) once in the Supabase SQL editor. It creates the `leads` table with row-level security on and no public policies, so only the server, using the service role key, can write to it. `status` (`new`, `quoted`, `sample`, `won`, `lost`) is there for a future admin panel.

## How an enquiry flows

1. [`EnquiryForm`](src/components/EnquiryForm.tsx) validates in the browser with the shared Zod schema in [`src/lib/validation.ts`](src/lib/validation.ts) and shows errors inline.
2. It POSTs to [`/api/enquiry`](src/app/api/enquiry/route.ts). The route validates again, silently accepts honeypot hits (the hidden `website` field) without saving them, and rate-limits each IP to 5 enquiries per 10 minutes.
3. The lead is saved to Supabase and emailed to the owner at the same time. The request succeeds if either one works.
4. The buyer gets an auto-reply ([`BuyerAutoReply.tsx`](src/emails/BuyerAutoReply.tsx)). A failure here is logged but doesn't fail the request.
5. The owner email ([`OwnerEnquiry.tsx`](src/emails/OwnerEnquiry.tsx)) sets reply-to to the buyer's address, and it includes a **Reply on WhatsApp** button when the buyer gave a phone number.

The rate limiter keeps its counts in memory on each server instance. That's enough for a contact form. If spam becomes a problem, swap it for Upstash or Vercel KV in [`src/lib/rate-limit.ts`](src/lib/rate-limit.ts).

## Editing content

All content lives in `src/data/`, not in components:

- **Products:** [`src/data/products.ts`](src/data/products.ts). Add an object to `products`, and it appears in the grid, the quick view, the filters and the enquiry form's product list. `category` must be one of `home`, `table`, `wear` or `fabric`.
- **Photos:** [`src/data/images.ts`](src/data/images.ts) holds every image path, plus the showroom gallery. To swap a photo, replace the file in `public/images/` under the same name, or change the path here. Use photos at least 1600px wide; Next.js resizes them automatically.
- **Contact details:** [`src/data/site.ts`](src/data/site.ts) holds the email, phone, WhatsApp number, address and social links.
- **Page copy:** [`src/data/content.ts`](src/data/content.ts) holds every heading, paragraph, label and error message. To add French or German later, copy it to `content.fr.ts` or `content.de.ts` with the same shape and pick one by locale.

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repository. The framework is detected as Next.js, so there's nothing to configure.
3. Add the environment variables above under **Settings → Environment Variables**, for Production and Preview.
4. Deploy, then add the domain `arawalitextile.com` under **Settings → Domains** and follow the DNS instructions.
5. Send a test enquiry from the live site. Check that the row appears in Supabase, the owner email arrives, and the auto-reply arrives.

## Still to confirm with the owner

These are marked `TODO(owner)` in the code:

- Real product photos (the current ones are low-resolution placeholders)
- Minimum order quantity, sample lead time and sample charges
- Shipping terms (FOB / CIF) and which countries he ships to
- Print styles offered (e.g. Sanganeri, Bagru, Dabu)
- Certifications, if any (GOTS, OEKO-TEX, azo-free)
- Instagram and Pinterest links (in `site.ts`; they'll also be added to the JSON-LD automatically)
- Whether `enquiries@arawalitextile.com` can be set up for Resend
