import { createFileRoute } from "@tanstack/react-router";
import fachada from "@/assets/fachada-hd.jpg";
import fachadaRua from "@/assets/fachada-rua-hd.jpg";
import { PageIntro } from "@/components/PageIntro";
import { Faq } from "@/components/Faq";


const T = "Sobre nós | Kurihara & Figueiredo Advogados Associados";
const D =
  "Advocacia civil, trabalhista, empresarial, previdenciária, imobiliária, família e sucessões, recuperação de crédito e recuperação judicial em Morro Agudo, SP.";

export const Route = createFileRoute("/escritorio")({
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
  component: Escritorio,
});

function Escritorio() {
  return (
    <>
      <PageIntro eyebrow="O escritório" title="Venha conhecer o nosso escritório" />
      <section className="section-y">
        <div className="container-site grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
            <p className="text-foreground">
              O Grupo Kurihara &amp; Figueiredo reúne experiência e dedicação para oferecer soluções jurídicas completas.
            </p>
            <p>
              Oferecemos atuação completa em advocacia civil, trabalhista, empresarial, previdenciária e imobiliária,
              direito de família e sucessões. Também cuidamos da recuperação de crédito, recuperação judicial e
              reestruturação de empresas.
            </p>
            <p>
              Atuamos com transparência e compromisso, sempre ao lado de nossos clientes para proteger seus interesses e
              garantir segurança em cada decisão.
            </p>
          </div>
          <div className="space-y-4">
            <img src={fachada} alt="Entrada do escritório com a inscrição Advocacia" loading="lazy" width={1200} height={800} className="aspect-[4/3] w-full object-cover" />
            <img src={fachadaRua} alt="Fachada do escritório vista da rua, na Rua Maria Liporini Meireles" loading="lazy" width={1200} height={700} className="aspect-[16/9] w-full object-cover" />
          </div>
        </div>
      </section>
      <Faq />
    </>
  );
}
