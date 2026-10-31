import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ServiceWhatsAppDialog } from "@/components/ServiceWhatsAppDialog";

afterEach(cleanup);

describe("diálogo de WhatsApp dos serviços", () => {
  it("pede o nome e não abre o WhatsApp com o campo vazio", () => {
    const abrir = vi.fn();
    vi.stubGlobal("open", abrir);
    render(<ServiceWhatsAppDialog service="Advocacia civil" onClose={() => {}} />);

    fireEvent.click(screen.getByRole("button", { name: /Continuar para WhatsApp/i }));

    expect(abrir).not.toHaveBeenCalled();
    expect(screen.getByText("Informe seu nome para continuar.")).toBeInTheDocument();
  });

  it("prepara a mensagem do WhatsApp com o nome informado", () => {
    const abrir = vi.fn();
    vi.stubGlobal("open", abrir);
    render(<ServiceWhatsAppDialog service="Advocacia civil" onClose={() => {}} />);

    fireEvent.change(screen.getByLabelText("Seu nome"), { target: { value: "Ana Souza" } });
    fireEvent.click(screen.getByRole("button", { name: /Continuar para WhatsApp/i }));

    expect(abrir).toHaveBeenCalledTimes(1);
    const url = abrir.mock.calls[0]?.[0] as string;
    expect(url.startsWith("https://wa.me/5516988014617?text=")).toBe(true);
    const mensagem = decodeURIComponent(url.split("?text=")[1] ?? "");
    expect(mensagem).toContain("Meu nome é Ana Souza.");
    expect(mensagem).toContain("Advocacia civil");
    vi.unstubAllGlobals();
  });
});
