import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import logo from "@/assets/logo-hd.png";
import fachadaRua from "@/assets/fachada-rua-hd.jpg";
import { ContactBlock } from "@/components/ContactBlock";
import { SectionHeading } from "@/components/PageIntro";
import { PostCard } from "./conteudos.index";
import { POSTS } from "@/content/posts";
import { Faq } from "@/components/Faq";

const TITLE = "Silva & Kurihara Advogados Associados | Advocacia em Morro Agudo, SP";
const DESC =
  "Escritório de advocacia em Morro Agudo, São Paulo. Atuação jurídica pautada pela responsabilidade, ética e compromisso. WhatsApp (16) 98801-4617 — Rua Maria Liporini Meireles, 731.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-graphite">
        <img
          src={fachada}
          alt="Fachada do escritório Silva & Kurihara em Morro Agudo"
          width={1920}
          height={1080}
          fetchPriority="high"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[30%_center]"
        />
        <div className="bg-hero-overlay absolute inset-0 -z-10" />
        <div className="container-site pb-20 pt-36 sm:pb-28">
          <div className="max-w-3xl animate-rise">
            <p className="text-sm text-on-dark-muted">Rua Maria Liporini Meireles, 731 · Morro Agudo/SP</p>
            <h1 className="text-display mt-4 text-on-dark">
              Silva &amp; Kurihara
            </h1>
            <p className="mt-2 text-lg text-on-dark-muted">Advogados Associados</p>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-on-dark-muted sm:text-xl">
              Advocacia civil, trabalhista, empresarial, previdenciária, imobiliária, família e sucessões.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link to="/escritorio" className="bg-on-dark px-7 py-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-graphite hover:bg-secondary">
                Conheça o escritório
              </Link>
              <Link to="/contato" className="border border-on-dark/40 px-7 py-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-on-dark hover:border-bronze hover:text-bronze">
                Entre em contato
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-site grid items-start gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <img src={fachadaRua} alt="Vista da rua com a fachada do escritório" loading="lazy" width={1200} height={700} className="order-2 aspect-[4/3] w-full object-cover lg:order-1" />
          <div className="order-1 lg:order-2">
            <h2 className="text-h2">Sobre nós</h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              O Grupo Kurihara &amp; Figueiredo reúne experiência e dedicação para oferecer soluções jurídicas completas:
              advocacia civil, trabalhista, empresarial, previdenciária e imobiliária, direito de família e sucessões,
              recuperação de crédito, recuperação judicial e reestruturação de empresas.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Atuamos com transparência e compromisso, sempre ao lado de nossos clientes.
            </p>
            <Link to="/escritorio" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary underline underline-offset-4 hover:text-bronze">
              Conheça o escritório <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <Faq />

      {POSTS.length > 0 && (
        <section className="section-y border-t bg-secondary">
          <div className="container-site">
            <SectionHeading eyebrow="Conteúdos" title="Conteúdos jurídicos" />
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {POSTS.slice(0, 3).map((p) => <PostCard key={p.slug} post={p} />)}
            </div>
          </div>
        </section>
      )}

      <section className="section-y border-t">
        <div className="container-site">
          <SectionHeading eyebrow="Contato" title="Fale com o escritório" />
          <div className="mt-12"><ContactBlock /></div>
        </div>
      </section>
    </>
  );
}
