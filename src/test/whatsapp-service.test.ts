import { describe, it, expect } from "vitest";
import { buildServiceWhatsAppUrl } from "@/lib/whatsapp";

describe("buildServiceWhatsAppUrl", () => {
  it("uses office number and includes name and service", () => {
    const url = buildServiceWhatsAppUrl("  Ana Souza ", "Advocacia trabalhista");
    expect(url.startsWith("https://wa.me/5516988014617?text=")).toBe(true);
    const text = decodeURIComponent(url.split("?text=")[1]);
    expect(text).toContain("Meu nome é Ana Souza.");
    expect(text).toContain("na área de Advocacia trabalhista");
  });
});
