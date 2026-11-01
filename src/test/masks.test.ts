import { describe, expect, it } from "vitest";
import { maskCnpj, maskCpf, maskPhone } from "@/lib/masks";

describe("Input masks", () => {
  it("formats CPF as 000.000.000-00 while typing", () => {
    expect(maskCpf("52998224725")).toBe("529.982.247-25");
    expect(maskCpf("529")).toBe("529");
    expect(maskCpf("5299822")).toBe("529.982.2");
  });
  it("limits CPF to 11 digits and strips letters", () => {
    expect(maskCpf("529.982.247-25999")).toBe("529.982.247-25");
    expect(maskCpf("abc529")).toBe("529");
  });
  it("formats CNPJ as 00.000.000/0000-00 while typing", () => {
    expect(maskCnpj("11222333000181")).toBe("11.222.333/0001-81");
    expect(maskCnpj("11222")).toBe("11.222");
    expect(maskCnpj("112223330001")).toBe("11.222.333/0001");
  });
  it("limits CNPJ to 14 digits and strips letters", () => {
    expect(maskCnpj("11.222.333/0001-81999")).toBe("11.222.333/0001-81");
    expect(maskCnpj("abc11222333000181")).toBe("11.222.333/0001-81");
  });
  it("formats phone as (00) 00000-0000", () => {
    expect(maskPhone("16988014617")).toBe("(16) 98801-4617");
    expect(maskPhone("1638510303")).toBe("(16) 3851-0303");
    expect(maskPhone("16")).toBe("(16");
  });
  it("limits phone to 11 digits", () => {
    expect(maskPhone("16988014617999")).toBe("(16) 98801-4617");
  });
});
