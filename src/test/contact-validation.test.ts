import { describe, expect, it } from "vitest";
import { contactSchema } from "@/lib/contact.functions";

const valid = { name: "André", phone: "(16) 98801-4617", area: "Outro assunto", message: "Solicito um contato." };

describe("contact validation", () => {
  it("accepts a complete Brazilian mobile or landline with DDD", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
    expect(contactSchema.safeParse({ ...valid, phone: "(16) 3851-0303" }).success).toBe(true);
  });
  it("rejects missing DDD, incomplete numbers and punctuation without digits", () => {
    for (const phone of ["988014617", "(16) 98801", "--------", "(00) 98801-4617", "(16) 11111-1111"])
      expect(contactSchema.safeParse({ ...valid, phone }).success).toBe(false);
  });
  it("rejects an area not offered by the form", () => {
    expect(contactSchema.safeParse({ ...valid, area: "inventada" }).success).toBe(false);
  });
});