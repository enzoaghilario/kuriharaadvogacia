import { describe, expect, it } from "vitest";

import { SITE } from "@/content/site";

// The WhatsApp line is contact information the firm supplied; a wrong number or
// link sends clients to someone else's phone.
describe("WhatsApp contact", () => {
  it("shows the number the firm supplied", () => {
    expect(SITE.whatsapp).toBe("(16) 98801-4617");
  });

  it("links to that same number on wa.me with the country code", () => {
    expect(SITE.whatsappHref).toBe("https://wa.me/5516988014617");
  });
});

// Opening hours the firm supplied: weekdays only, 07:00–18:00, closed weekends.
describe("Opening hours", () => {
  it("is weekday-only, 07:00 to 18:00", () => {
    expect(SITE.hours.opens).toBe("07:00");
    expect(SITE.hours.closes).toBe("18:00");
    expect([...SITE.hours.weekdays]).toEqual(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
  });

  it("does not list Saturday or Sunday", () => {
    expect(SITE.hours.weekdays).not.toContain("Saturday");
    expect(SITE.hours.weekdays).not.toContain("Sunday");
  });

  it("publishes the hours in the structured data as Monday to Friday", async () => {
    const { buildStructuredData, safeJsonLd } = await import("@/lib/structured-data");
    const items = JSON.parse(safeJsonLd(buildStructuredData("https://example.test"))) as Array<
      Record<string, unknown>
    >;
    const legalService = items.find((item) => item["@type"] === "LegalService");
    expect(legalService?.["openingHoursSpecification"]).toEqual([
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "https://schema.org/Monday",
          "https://schema.org/Tuesday",
          "https://schema.org/Wednesday",
          "https://schema.org/Thursday",
          "https://schema.org/Friday",
        ],
        opens: "07:00",
        closes: "18:00",
      },
    ]);
  });

  it("shows the hours in llms.txt under the contact section", async () => {
    const { buildLlmsTxt } = await import("@/routes/llms[.]txt");
    const text = buildLlmsTxt("https://example.test");
    const contact = text.slice(text.indexOf("## Contato"), text.indexOf("## Áreas"));
    expect(contact).toContain(`- Horário: ${SITE.hours.label}`);
  });
});
