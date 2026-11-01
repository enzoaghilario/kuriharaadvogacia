import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children }: { children: React.ReactNode }) => <a href="/">{children}</a>,
}));

import { PartnerForm } from "@/components/PartnerForm";

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe("Partner form privacy", () => {
  it("blocks email delivery until a real service is configured", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const { container } = render(<PartnerForm />);
    expect(screen.getByRole("button", { name: /Enviar relatório/ })).toBeDisabled();
    fireEvent.change(screen.getByLabelText(/Razão social/), { target: { value: "Empresa de teste" } });
    fireEvent.change(screen.getByLabelText(/CNPJ/), { target: { value: "11.222.333/0001-81" } });
    fireEvent.change(screen.getByLabelText(/Nome do responsável/), { target: { value: "Responsável de teste" } });
    fireEvent.change(screen.getByLabelText(/CPF/), { target: { value: "52998224725" } });
    fireEvent.change(screen.getByLabelText(/E-mail corporativo/), { target: { value: "teste@example.com" } });
    fireEvent.change(screen.getByLabelText(/Telefone/), { target: { value: "16988014617" } });
    fireEvent.change(screen.getByLabelText(/Área de interesse/), { target: { value: "Empresarial" } });
    fireEvent.click(screen.getByRole("checkbox"));
    const form = container.querySelector("form");
    if (!form) throw new Error("Partner form missing");
    fireEvent.submit(form);
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByLabelText(/Razão social/)).toHaveValue("Empresa de teste");
  });

  it("never persists entered information in browser storage", () => {
    const storageSpy = vi.spyOn(Storage.prototype, "setItem");
    render(<PartnerForm />);
    fireEvent.change(screen.getByLabelText(/Razão social/), { target: { value: "Empresa privada" } });
    fireEvent.change(screen.getByLabelText(/Resumo da necessidade/), { target: { value: "Informações privadas" } });
    expect(storageSpy).not.toHaveBeenCalled();
  });
});