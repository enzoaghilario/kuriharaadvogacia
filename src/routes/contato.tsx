import { createFileRoute } from "@tanstack/react-router";
import { ContactBlock } from "@/components/ContactBlock";
import { ContactForm } from "@/components/ContactForm";
import { PageIntro } from "@/components/PageIntro";

const T = "Contato | Kurihara & Figueiredo Advogados Associados — Morro Agudo";
const D = "Fale com o escritório: WhatsApp (16) 98801-4617, telefone (16) 3851-0303, Rua Maria Liporini Meireles, 731, Centro, Morro Agudo — SP.";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: T },
      { name: "description", content: D },
      { property: "og:title", content: T },
      { property: "og:description", content: D },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <>
      <PageIntro eyebrow="Contato" title="Fale com o escritório">
        Atendimento presencial em Morro Agudo, pelo WhatsApp ou pelo telefone.
      </PageIntro>
      <section className="section-y">
        <div className="container-site"><ContactBlock /></div>
      </section>
      <section className="section-y border-t">
        <div className="container-site max-w-3xl">
          <h2 className="text-h2">Prefere escrever?</h2>
          <p className="mt-4 mb-10 text-lg text-muted-foreground">Conte brevemente o seu caso e o escritório retorna o contato.</p>
          <ContactForm />
        </div>
      </section>
    </>
  ),
});
