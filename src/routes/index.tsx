import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import logo from "@/assets/logo-hd.png";
import fachadaRua from "@/assets/fachada-rua-hd.jpg";
import { ContactBlock } from "@/components/ContactBlock";
import { SectionHeading } from "@/components/PageIntro";
import { PostCard } from "./conteudos.index";
import { POSTS } from "@/content/posts";
import { Faq } from "@/components/Faq";

const TITLE = "Kurihara & Figueiredo Advogados Associados | Advocacia em Morro Agudo, SP";
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
      <section className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-background px-6 pb-16 pt-32 text-center">
        <div className="hero-logo-stage relative w-full max-w-xl">
          <img
            src={logo}
            alt="Grupo Kurihara & Figueiredo"
            width={1314}
            height={514}
            fetchPriority="high"
            className="hero-logo-3d w-full"
          />
          <span aria-hidden className="hero-logo-pen" />
          <span
            aria-hidden
            className="hero-logo-gloss"
            style={{ WebkitMaskImage: `url(${logo})`, maskImage: `url(${logo})` }}
          />
        </div>
        <h1 className="hero-rise-3d text-display mt-4 text-foreground" style={{ animationDelay: "3.4s" }}>
          Kurihara & Figueiredo
        </h1>
        <p className="hero-rise-3d mt-2 text-lg text-muted-foreground" style={{ animationDelay: "3.65s" }}>Advogados Associados</p>
        <p style={{ animationDelay: "3.9s" }} className="hero-rise-3d mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
          Advocacia civil, trabalhista, empresarial, previdenciária, imobiliária, família e sucessões.
        </p>
        <div style={{ animationDelay: "3.85s" }} className="hero-rise-3d mt-10 flex flex-col gap-3 sm:flex-row">
          <Link to="/escritorio" className="bg-primary px-7 py-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground hover:bg-graphite">
            Conheça o escritório
          </Link>
          <Link to="/contato" className="border border-foreground/30 px-7 py-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-foreground hover:border-bronze hover:text-bronze">
            Entre em contato
          </Link>
        </div>
      </section>

      <section className="section-y">
        <div className="container-site grid items-start gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <img src={fachadaRua} alt="Vista da rua com a fachada do escritório" loading="lazy" width={1200} height={700} className="order-2 aspect-[4/3] w-full object-cover lg:order-1" />
          <div className="order-1 lg:order-2">
            <h2 className="text-h2">Sobre nós</h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              O Grupo Kurihara & Figueiredo reúne experiência e dedicação para oferecer soluções jurídicas completas:
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
