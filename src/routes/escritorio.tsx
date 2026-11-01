import { createFileRoute } from "@tanstack/react-router";
import fachada from "@/assets/escritorio-fachada-original.png.asset.json";
import atendimento from "@/assets/escritorio-atendimento.jpg.asset.json";
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
            <img src={fachada.url} alt="Fachada do escritório com a inscrição Advocacia e as placas originais" loading="lazy" width={777} height={531} className="h-auto w-full" />
          </div>
        </div>
      </section>
      <section className="relative overflow-hidden border-y">
        <img
          src={atendimento.url}
          alt=""
          aria-hidden="true"
          loading="lazy"
          width={1408}
          height={768}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-background/80" aria-hidden="true" />
        <div className="container-site relative section-y">
          <div className="max-w-2xl space-y-6">
            <div className="rule-bronze" />
            <p className="text-h2">
              Cada caso é ouvido com atenção e tratado com a seriedade que merece.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Atendimento próximo, linguagem clara e compromisso com os seus interesses — do primeiro contato à
              conclusão do caso.
            </p>
          </div>
        </div>
      </section>
      <Faq />
    </>
  );
}
