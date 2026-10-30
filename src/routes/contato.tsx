import { createFileRoute } from "@tanstack/react-router";
import { ContactBlock } from "@/components/ContactBlock";
import { PageIntro } from "@/components/PageIntro";

const T = "Contato | Silva & Kurihara Advogados Associados — Morro Agudo";
const D = "Rua Maria Liporini Meireles, 731, Centro, Morro Agudo — SP. Telefone (16) 3851-0303.";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: T },
      { name: "description", content: D },
      { property: "og:title", content: T },
      { property: "og:description", content: D },
    ],
  }),
  component: () => (
    <>
      <PageIntro eyebrow="Contato" title="Fale com o escritório">
        Atendimento presencial em Morro Agudo ou pelo telefone.
      </PageIntro>
      <section className="section-y">
        <div className="container-site"><ContactBlock /></div>
      </section>
    </>
  ),
});
