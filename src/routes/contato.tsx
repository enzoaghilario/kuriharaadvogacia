import { createFileRoute } from "@tanstack/react-router";
import { ContactBlock } from "@/components/ContactBlock";
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
    </>
  ),
});
