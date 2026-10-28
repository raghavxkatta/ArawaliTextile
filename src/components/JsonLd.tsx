import { content } from "@/data/content";
import { site } from "@/data/site";

export function JsonLd() {
  const sameAs = Object.values(site.social).filter(Boolean);
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.url}/#organization`,
        name: site.name,
        url: site.url,
        logo: `${site.url}/icon.svg`,
        email: site.email,
        telephone: site.phoneE164,
        foundingDate: String(site.founded),
        numberOfEmployees: { "@type": "QuantitativeValue", value: site.team },
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        "@type": ["LocalBusiness", "ClothingStore"],
        "@id": `${site.url}/#business`,
        name: site.name,
        description: content.meta.description,
        url: site.url,
        image: `${site.url}/opengraph-image`,
        email: site.email,
        telephone: site.phoneE164,
        foundingDate: String(site.founded),
        parentOrganization: { "@id": `${site.url}/#organization` },
        address: {
          "@type": "PostalAddress",
          streetAddress: site.address.street,
          addressLocality: site.address.locality,
          addressRegion: site.address.region,
          postalCode: site.address.postalCode,
          addressCountry: site.address.country,
        },
        geo: { "@type": "GeoCoordinates", latitude: site.geo.latitude, longitude: site.geo.longitude },
        areaServed: "Europe",
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      // Escape "<" so the JSON can never close the script tag
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
