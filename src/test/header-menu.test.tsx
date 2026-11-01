import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
vi.mock("@tanstack/react-router", () => ({
  useRouterState: ({ select }: { select: (state: { location: { pathname: string } }) => unknown }) => select({ location: { pathname: "/" } }),
  Link: ({ to, activeOptions: _activeOptions, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string; activeOptions?: unknown }) => <a href={to} {...props} />,
}));
import { Header } from "@/components/Header";
afterEach(cleanup);
it("keeps closed mobile navigation inert and releases it only while open", () => {
  render(<Header />);
  const menu = document.getElementById("menu-mobile");
  expect(menu).toHaveAttribute("inert");
  fireEvent.click(screen.getByRole("button", { name: "Abrir menu" }));
  expect(menu).not.toHaveAttribute("inert");
  fireEvent.click(screen.getByRole("button", { name: "Fechar menu" }));
  expect(menu).toHaveAttribute("inert");
});