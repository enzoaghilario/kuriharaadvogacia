import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { AREAS } from "@/content/areas";
import { SITE } from "@/content/site";
import { WhatsAppIcon } from "./WhatsAppIcon";

export const NAV = [
  { to: "/", label: "Início" },
  { to: "/escritorio", label: "Escritório" },
  ...(AREAS.length ? [{ to: "/atuacao", label: "Serviços" }] : []),
  { to: "/conteudos", label: "Conteúdos" },
  { to: "/contato", label: "Contato" },
] as const;

export function Wordmark({ dark }: { dark: boolean }) {
  return (
    <Link to="/" className="flex flex-col leading-none" aria-label={`${SITE.name} — início`}>
      <span className={`font-serif text-xl sm:text-2xl ${dark ? "text-on-dark" : "text-foreground"}`}>
        Kurihara <span className="text-bronze">&</span> Figueiredo
      </span>
      <span className={`mt-1 text-[0.6rem] uppercase tracking-[0.3em] ${dark ? "text-on-dark-muted" : "text-muted-foreground"}`}>
        Advogados Associados
      </span>
    </Link>
  );
}

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b bg-background/95 backdrop-blur-sm">
      <div className="container-site grid h-20 grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <Wordmark dark={false} />
        <nav aria-label="Principal" className="hidden items-center gap-5 lg:flex xl:gap-8">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="text-sm tracking-wide text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-bronze"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <button
          className="grid h-11 w-11 place-items-center text-foreground lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <div
        id="menu-mobile"
        className={`overflow-hidden bg-background transition-[max-height] duration-500 lg:hidden ${open ? "max-h-[34rem]" : "max-h-0"}`}
      >
        <nav aria-label="Menu móvel" className="container-site flex flex-col pb-8">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setOpen(false)}
              activeOptions={{ exact: n.to === "/" }}
              className="border-b py-4 font-serif text-2xl text-foreground data-[status=active]:text-bronze"
            >
              {n.label}
            </Link>
          ))}
          <a
            href={SITE.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center gap-2 bg-primary py-4 text-center text-sm font-semibold uppercase tracking-[0.18em] text-primary-foreground"
          >
            <WhatsAppIcon size={17} />
            WhatsApp {SITE.whatsapp}
          </a>
          <a href={SITE.phoneHref} className="mt-3 border border-foreground/30 py-4 text-center text-sm font-semibold uppercase tracking-[0.18em] hover:border-bronze hover:text-bronze">
            Ligar {SITE.phone}
          </a>
        </nav>
      </div>
    </header>
  );
}
