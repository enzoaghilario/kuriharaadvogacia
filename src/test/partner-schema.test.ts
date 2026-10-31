import { describe, expect, it } from "vitest";
import { PARTNER_AREAS, partnerSchema } from "@/lib/partner-schema";

const valid = { company: "Empresa de teste", cnpj: "11.222.333/0001-81", responsible: "Responsável de teste", email: "teste@example.com", phone: "16988014617", area: "Empresarial", privacy: true };

describe("Partner qualification", () => {
  for (const name of ["company", "cnpj", "responsible", "email", "phone", "area", "privacy"] as const) {
    it(`requires ${name}`, () => {
      expect(partnerSchema.safeParse({ ...valid, [name]: undefined }).success).toBe(false);
    });
  }
  it("allows all optional fields to be absent", () => {
    expect(partnerSchema.safeParse(valid).success).toBe(true);
  });
  it("requires explicit privacy authorization", () => {
    expect(partnerSchema.safeParse({ ...valid, privacy: false }).success).toBe(false);
  });
  it("accepts the six requested areas and rejects other areas", () => {
    expect(PARTNER_AREAS).toEqual(["Trabalhista", "Empresarial", "Contratual", "Cível", "Tributário", "Reestruturação Empresarial"]);
    for (const area of PARTNER_AREAS) expect(partnerSchema.safeParse({ ...valid, area }).success).toBe(true);
    expect(partnerSchema.safeParse({ ...valid, area: "Outro" }).success).toBe(false);
  });
  it("rejects an invalid CNPJ checksum", () => {
    expect(partnerSchema.safeParse({ ...valid, cnpj: "11.222.333/0001-82" }).success).toBe(false);
  });
  it("validates optional choices and limits observations", () => {
    expect(partnerSchema.safeParse({ ...valid, activeCases: "Talvez" }).success).toBe(false);
    expect(partnerSchema.safeParse({ ...valid, urgency: "Imediata" }).success).toBe(false);
    expect(partnerSchema.safeParse({ ...valid, observations: "a".repeat(2001) }).success).toBe(false);
  });
});