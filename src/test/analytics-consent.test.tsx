import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { ConsentBanner } from "@/components/ConsentBanner";

const thirdParty = () => document.querySelectorAll("#ga4-script, #clarity-script").length;

beforeEach(() => {
  localStorage.clear();
  document.head.innerHTML = "";
});

describe("consentimento de análise", () => {
  it("com IDs vazios não mostra banner nem injeta scripts", () => {
    render(<ConsentBanner ids={{ ga: "", clarity: "" }} />);
    expect(screen.queryByRole("button", { name: "Aceitar" })).toBeNull();
    expect(thirdParty()).toBe(0);
  });

  it("com ID preenchido e sem consentimento nada carrega", () => {
    render(<ConsentBanner ids={{ ga: "G-TESTE", clarity: "abc" }} />);
    expect(screen.getByRole("button", { name: "Aceitar" })).toBeTruthy();
    expect(thirdParty()).toBe(0);
  });

  it("ao recusar nada carrega", () => {
    render(<ConsentBanner ids={{ ga: "G-TESTE", clarity: "abc" }} />);
    fireEvent.click(screen.getByRole("button", { name: "Recusar" }));
    expect(thirdParty()).toBe(0);
    expect(localStorage.getItem("consentimento-analise")).toBe("recusado");
  });

  it("após aceitar carrega GA4 e Clarity", () => {
    render(<ConsentBanner ids={{ ga: "G-TESTE", clarity: "abc" }} />);
    fireEvent.click(screen.getByRole("button", { name: "Aceitar" }));
    expect(document.getElementById("ga4-script")).not.toBeNull();
    expect(document.getElementById("clarity-script")).not.toBeNull();
    expect(screen.queryByRole("button", { name: "Aceitar" })).toBeNull();
  });
});
