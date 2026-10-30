import { createFileRoute } from "@tanstack/react-router";
import { PageIntro } from "@/components/PageIntro";

const T = "Aviso de privacidade | Kurihara & Figueiredo Advogados Associados";
const D = "Como o site do escritório Kurihara & Figueiredo Advogados Associados trata informações de visitantes.";

export const Route = createFileRoute("/privacidade")({
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
      <PageIntro eyebrow="Privacidade" title="Aviso de privacidade" />
      <section className="section-y">
        <div className="container-site max-w-3xl space-y-6 text-lg leading-relaxed text-muted-foreground">
          <p>Este site tem caráter institucional e informativo. Ao solicitar contato sobre um serviço, apenas o seu nome é pedido antes do redirecionamento para o WhatsApp, para personalizar a mensagem destinada ao escritório. Você pode revisar a mensagem e decidir se deseja enviá-la.</p>
          <p>O mapa incorporado é fornecido pelo Google, e os links para Instagram e Facebook levam a serviços de terceiros, sujeitos às respectivas políticas de privacidade.</p>
          <p>Em caso de dúvidas sobre o tratamento de dados pessoais, entre em contato com o escritório pelo telefone (16) 3851-0303, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).</p>
        </div>
      </section>
    </>
  ),
});
