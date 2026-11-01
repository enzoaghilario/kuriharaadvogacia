import { Facebook, Instagram, MapPin, Phone } from "lucide-react";
import { FULL_ADDRESS, MAPS_EMBED, MAPS_URL, SITE } from "@/content/site";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function ContactBlock() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
      <div className="space-y-8">
        <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="group flex gap-4">
          <MapPin className="mt-1 shrink-0 text-bronze" size={20} aria-hidden />
          <span>
            <span className="eyebrow block">Endereço</span>
            <span className="mt-2 block leading-relaxed group-hover:text-primary group-hover:underline">{FULL_ADDRESS}</span>
          </span>
        </a>
        <a href={SITE.whatsappHref} target="_blank" rel="noopener noreferrer" className="group flex gap-4">
          <WhatsAppIcon size={20} className="mt-1 shrink-0 text-bronze" />
          <span>
            <span className="eyebrow block">WhatsApp</span>
            <span className="mt-2 block font-serif text-2xl tabular-nums lining-nums group-hover:text-primary">{SITE.whatsapp}</span>
          </span>
        </a>
        <a href={SITE.phoneHref} className="group flex gap-4">
          <Phone className="mt-1 shrink-0 text-bronze" size={20} aria-hidden />
          <span>
            <span className="eyebrow block">Telefone</span>
            <span className="mt-2 block font-serif text-2xl tabular-nums lining-nums group-hover:text-primary">{SITE.phone}</span>
          </span>
        </a>
        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href={SITE.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-primary px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground hover:bg-graphite"
          >
            <WhatsAppIcon size={16} />
            WhatsApp
          </a>
          <a href={SITE.phoneHref} className="border border-foreground/30 px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] hover:border-bronze hover:text-bronze">
            Ligar agora
          </a>
          <a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="border border-foreground/30 px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] hover:border-bronze hover:text-bronze">
            Como chegar
          </a>
        </div>
        <div className="flex gap-3">
          <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="grid h-11 w-11 place-items-center border hover:border-bronze hover:text-bronze"><Instagram size={18} /></a>
          <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="grid h-11 w-11 place-items-center border hover:border-bronze hover:text-bronze"><Facebook size={18} /></a>
        </div>
      </div>
      <div className="aspect-[4/3] w-full overflow-hidden border bg-muted">
        <iframe title={`Mapa — ${SITE.name}`} src={MAPS_EMBED} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-full w-full grayscale-[60%]" />
      </div>
    </div>
  );
}
