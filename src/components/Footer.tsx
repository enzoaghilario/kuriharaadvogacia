import { Link } from "@tanstack/react-router";
import { Facebook, Instagram } from "lucide-react";
import { FULL_ADDRESS, MAPS_URL, SITE } from "@/content/site";
import { NAV, Wordmark } from "./Header";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function Footer() {
  return (
    <footer className="bg-graphite text-on-dark-muted">
      <div className="container-site grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Wordmark dark />
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="mt-6 flex min-h-11 max-w-xs items-center text-sm leading-relaxed hover:text-on-dark">
            {FULL_ADDRESS}
          </a>
          <a href={SITE.whatsappHref} target="_blank" rel="noopener noreferrer" className="mt-1 flex min-h-11 items-center gap-2 text-sm hover:text-on-dark">
            <WhatsAppIcon size={16} />
            WhatsApp {SITE.whatsapp}
          </a>
          <a href={SITE.phoneHref} className="flex min-h-11 items-center text-sm hover:text-on-dark">{SITE.phone}</a>
        </div>
        <div>
          <p className="eyebrow">Navegação</p>
          <ul className="mt-3 text-sm">
            {NAV.map((n) => (
              <li key={n.to}><Link to={n.to} className="flex min-h-11 items-center hover:text-on-dark">{n.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow">Redes sociais</p>
          <div className="mt-5 flex gap-3">
            <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid h-11 w-11 place-items-center border border-on-dark/20 hover:border-bronze hover:text-bronze"><Instagram size={18} /></a>
            <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="grid h-11 w-11 place-items-center border border-on-dark/20 hover:border-bronze hover:text-bronze"><Facebook size={18} /></a>
          </div>
        </div>
      </div>
      <div className="border-t border-on-dark/10">
        <div className="container-site flex flex-col gap-2 py-6 text-xs sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {SITE.name}. Todos os direitos reservados.</p>
          <Link to="/privacidade" className="flex min-h-11 items-center hover:text-on-dark">Aviso de privacidade</Link>
        </div>
      </div>
    </footer>
  );
}
