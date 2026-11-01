import { fireEvent, render, screen, waitFor, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
const send = vi.hoisted(() => vi.fn());
vi.mock("@/lib/contact.functions", () => ({ submitContact: send }));
vi.mock("@tanstack/react-start", () => ({ useServerFn: () => send }));
import { ContactForm } from "@/components/ContactForm";

afterEach(() => { cleanup(); send.mockReset(); });
describe("contact form", () => {
  it("blocks invalid fields and focuses the first error", () => {
    render(<ContactForm />);
    fireEvent.click(screen.getByRole("button", { name: "Enviar mensagem" }));
    expect(send).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Nome")).toHaveFocus();
    expect(screen.getByLabelText("Telefone / WhatsApp")).toHaveAttribute("aria-invalid", "true");
  });
  it("only confirms after a successful response", async () => {
    send.mockResolvedValue({ ok: true });
    render(<ContactForm />);
    fireEvent.change(screen.getByLabelText("Nome"), { target: { value: "André" } });
    fireEvent.change(screen.getByLabelText("Telefone / WhatsApp"), { target: { value: "(16) 98801-4617" } });
    fireEvent.change(screen.getByLabelText("Área de interesse"), { target: { value: "Outro assunto" } });
    fireEvent.change(screen.getByLabelText("Mensagem"), { target: { value: "Solicito contato." } });
    fireEvent.click(screen.getByRole("button", { name: "Enviar mensagem" }));
    await waitFor(() => expect(send).toHaveBeenCalledOnce());
    expect(await screen.findByText(/Mensagem recebida/)).toBeInTheDocument();
  });
});