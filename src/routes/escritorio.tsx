import { pageHead } from "@/lib/seo";
import { createFileRoute } from "@tanstack/react-router";
const fachada = "/escritorio-fachada-original.png";
const atendimento = "/escritorio-atendimento.jpg";


const T = "Sobre nós | Kurihara & Figueiredo Advogados Associados";
const D =
  "Conheça o escritório Kurihara & Figueiredo Advogados Associados em Morro Agudo, SP: nossa história, a forma como atendemos e respostas às dúvidas mais frequentes.";

export const Route = createFileRoute("/escritorio")({
  head: ({ match }) => pageHead({ origin: match.context.origin, path: "/escritorio", title: T, description: D }),
  component: Escritorio,
});

function Escritorio() {
  return (
    <>
      <section className="relative overflow-hidden border-b">
        <div
          className="bg-parallax-dark absolute inset-0"
          style={{ backgroundImage: `url(${atendimento})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-navy/80" aria-hidden="true" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-background via-background/50 to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-transparent via-background/50 to-background" />
        <div className="container-site relative pt-36 pb-16 sm:pt-44 sm:pb-20">
          <div className="animate-rise max-w-3xl space-y-6 text-on-dark">
            <h1 className="text-h2">Venha conhecer o nosso escritório</h1>
            <div className="rule-bronze" />
          </div>
        </div>
      </section>
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
            <div className="relative">
              <img src={fachada} alt="Fachada do escritório com a inscrição Advocacia e as placas originais" loading="lazy" width={777} height={531} className="h-auto w-full" />
              <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-b from-transparent to-background" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
