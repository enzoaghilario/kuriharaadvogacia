import { createElement } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/components/PageIntro", () => ({ PageIntro: () => null }));
vi.mock("@/lib/use-tilt-card", () => ({ useTiltCard: () => ({ current: null }) }));
vi.mock("@/components/ServiceWhatsAppDialog", () => ({ ServiceWhatsAppDialog: () => null }));
vi.mock("@tanstack/react-router", async (importOriginal) => {
  const original = await importOriginal<typeof import("@tanstack/react-router")>();
  return { ...original, Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a> };
});

import { Route } from "@/routes/atuacao";

afterEach(cleanup);

describe("Service contact accessibility", () => {
  it("only allows contact with an open service, removing it on close or when another service opens", () => {
    const Component = Route.options.component;
    if (!Component) throw new Error("Services page component is missing");
    render(createElement(Component));

    expect(screen.queryAllByRole("button", { name: /Falar com o escritório sobre/ })).toHaveLength(0);

    const civil = screen.getByRole("button", { name: /01.*Advocacia civil/ });
    fireEvent.click(civil);
    const contact = screen.getByRole("button", { name: /Falar com o escritório sobre advocacia civil/ });
    contact.focus();
    expect(contact).toHaveFocus();

    fireEvent.click(civil);
    expect(contact.isConnected).toBe(false);
    expect(screen.queryAllByRole("button", { name: /Falar com o escritório sobre/ })).toHaveLength(0);

    fireEvent.click(civil);
    fireEvent.click(screen.getByRole("button", { name: /02.*Advocacia trabalhista/ }));
    expect(screen.queryByRole("button", { name: /Falar com o escritório sobre advocacia civil/ })).toBeNull();
    expect(screen.getByRole("button", { name: /Falar com o escritório sobre advocacia trabalhista/ })).toBeInTheDocument();
  });
});