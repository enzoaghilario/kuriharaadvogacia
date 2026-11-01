import { describe, expect, it } from "vitest";
import { maskCpf, maskPhone } from "@/lib/masks";

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
  it("formats phone as (00) 00000-0000", () => {
    expect(maskPhone("16988014617")).toBe("(16) 98801-4617");
    expect(maskPhone("1638510303")).toBe("(16) 3851-0303");
    expect(maskPhone("16")).toBe("(16");
  });
  it("limits phone to 11 digits", () => {
    expect(maskPhone("16988014617999")).toBe("(16) 98801-4617");
  });
});
