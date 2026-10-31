import { createFileRoute } from "@tanstack/react-router";
import { PageIntro } from "@/components/PageIntro";
import { PartnerForm } from "@/components/PartnerForm";

const title = "Seja Parceiro | Kurihara & Figueiredo Advogados Associados";
const description = "Programa de Assessoria Jurídica Empresarial da Kurihara & Figueiredo Advogados Associados: solicite a análise das necessidades jurídicas da sua empresa.";

export const Route = createFileRoute("/seja-parceiro")({
  head: () => ({ meta: [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: () => <>
    <PageIntro eyebrow="Seja Parceiro" title="Seja Parceiro">
      <p className="font-serif text-2xl text-foreground">Programa de Assessoria Jurídica Empresarial</p>
      <p>Conte-nos sobre a sua empresa e o suporte jurídico de que ela precisa.</p>
    </PageIntro>
    <section className="section-y">
      <div className="container-site max-w-4xl">
        <PartnerForm />
      </div>
    </section>
  </>,
});