export const site = {
  name: "Arawali Textile",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://arawalitextile.com",
  email: "arawali007@gmail.com",
  phoneDisplay: "+91 78779 45556",
  phoneE164: "+917877945556",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "917877945556",
  address: {
    short: "717, Jagdish Colony, Amber Road, Jaipur",
    full: "717, Jagdish Colony, Ramgarh Mor, Amber Road, Jaipur, Rajasthan 302002, India",
    street: "717, Jagdish Colony, Ramgarh Mor, Amber Road",
    locality: "Jaipur",
    region: "Rajasthan",
    postalCode: "302002",
    country: "IN",
  },
  geo: { latitude: 26.91, longitude: 75.78 },
  founded: 1991,
  team: 200,
  // TODO(owner): add Instagram and Pinterest profile URLs.
  social: {
    instagram: "",
    pinterest: "",
  },
} as const;

export const whatsappUrl = (text?: string) =>
  `https://wa.me/${site.whatsappNumber}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

/*
 * TODO(owner) — facts still to confirm before launch:
 * - Minimum order quantity, sample lead time and sample charges
 * - Shipping terms (FOB / CIF) and which countries are shipped to
 * - Print styles offered (e.g. Sanganeri, Bagru, Dabu)
 * - Certifications, if any (GOTS, OEKO-TEX, azo-free)
 */
