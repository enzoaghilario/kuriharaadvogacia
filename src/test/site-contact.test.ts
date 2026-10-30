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
