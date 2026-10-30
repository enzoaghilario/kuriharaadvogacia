import { SITE } from "@/content/site";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

export function Faq() {
  return (
    <section className="section-y border-t bg-secondary">
      <div className="container-site grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <h2 className="text-h2">Dúvidas frequentes</h2>
        <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
          <p>
            No Grupo Kurihara &amp; Figueiredo você encontra respostas claras para as perguntas sobre serviços jurídicos e
            processos judiciais e administrativos.
          </p>
          <p>Nosso objetivo é garantir que você esteja sempre informado e seguro.</p>
          <p className="font-semibold text-foreground">Tem alguma dúvida? Envie para nós!</p>
          <a
            href={SITE.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            <WhatsAppIcon size={16} /> Enviar dúvida pelo WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
