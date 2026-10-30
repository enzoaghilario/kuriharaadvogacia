import { createFileRoute } from "@tanstack/react-router";
import { PageIntro } from "@/components/PageIntro";

const T = "Aviso de privacidade | Silva & Kurihara Advogados Associados";
const D = "Como o site do escritório Silva & Kurihara Advogados Associados trata informações de visitantes.";

export const Route = createFileRoute("/privacidade")({
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
      <PageIntro eyebrow="Privacidade" title="Aviso de privacidade" />
      <section className="section-y">
        <div className="container-site max-w-3xl space-y-6 text-lg leading-relaxed text-muted-foreground">
          <p>Este site tem caráter institucional e informativo. Não há formulários nem coleta de dados pessoais por meio dele.</p>
          <p>O mapa incorporado é fornecido pelo Google, e os links para Instagram e Facebook levam a serviços de terceiros, sujeitos às respectivas políticas de privacidade.</p>
          <p>Em caso de dúvidas sobre o tratamento de dados pessoais, entre em contato com o escritório pelo telefone (16) 3851-0303, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).</p>
        </div>
      </section>
    </>
  ),
});
