import { AREAS } from "@/content/areas";
import { SITE } from "@/content/site";

/** Serializa JSON-LD com segurança para <script>: escapa "<" para evitar fechar a tag. */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/** Dados estruturados gerados a partir de SITE e AREAS (nada escrito à mão). */
export function buildStructuredData(origin = "") {
  const id = `${origin}/#escritorio`;
  const legalService = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "@id": id,
    name: SITE.name,
    url: `${origin}/`,
    logo: `${origin}/logo-hd.png`,
    image: `${origin}/og-image.jpg`,
    telephone: "+55 16 3851-0303",
    contactPoint: [
      { "@type": "ContactPoint", telephone: "+55 16 3851-0303", contactType: "customer service", availableLanguage: "Portuguese" },
      { "@type": "ContactPoint", telephone: "+55 16 98801-4617", contactType: "customer service", availableLanguage: "Portuguese" },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: `${SITE.street} - ${SITE.district}`,
      addressLocality: SITE.city,
      addressRegion: SITE.state,
      postalCode: SITE.zip,
      addressCountry: "BR",
    },
    areaServed: {
      "@type": "City",
      name: SITE.city,
      containedInPlace: { "@type": "State", name: "São Paulo" },
    },
    knowsAbout: AREAS.map((a) => a.name),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Áreas de atuação",
      itemListElement: AREAS.map((a) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: a.name, description: a.description },
      })),
    },
    sameAs: [SITE.instagram, SITE.facebook],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: SITE.hours.weekdays.map((d) => `https://schema.org/${d}`),
        opens: SITE.hours.opens,
        closes: SITE.hours.closes,
      },
    ],
  };
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: `${origin}/`,
    inLanguage: "pt-BR",
    publisher: { "@id": id },
  };
  return [legalService, website];
}
