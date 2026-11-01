import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Phone } from "lucide-react";
import { SITE } from "@/content/site";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import logo from "@/assets/logo-hd-white.png";
import logoDark from "@/assets/logo-hd.png";
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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <section className="hero-breathe relative isolate flex min-h-[90svh] flex-col items-center justify-center overflow-hidden bg-background px-6 pb-16 pt-32 text-center">
        <div aria-hidden className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none -z-10" />
        <div className="hero-logo-stage relative w-full max-w-xl">
            <img
              src={logo}
              alt="Grupo Kurihara & Figueiredo"
              width={1314}
              height={514}
              fetchPriority="high"
              className="hero-logo-3d only-dark w-full"
            />
            <img
              src={logoDark}
              alt="Grupo Kurihara & Figueiredo"
              width={1314}
              height={514}
              fetchPriority="high"
              decoding="async"
              className="hero-logo-3d only-light w-full h-auto object-contain"
            />
          <span aria-hidden className="hero-logo-pen" />
          <span
            aria-hidden
            className="hero-logo-gloss"
            style={{ WebkitMaskImage: `url(${logo})`, maskImage: `url(${logo})` }}
          />
        </div>
        <h1 className="hero-rise-3d text-display mt-8 max-w-4xl text-foreground" style={{ animationDelay: "3.4s" }}>
          Kurihara & Figueiredo
        </h1>
        <p className="hero-rise-3d mt-2 text-lg text-muted-foreground" style={{ animationDelay: "3.65s" }}>Advogados Associados</p>
        <p style={{ animationDelay: "3.9s" }} className="hero-rise-3d mt-8 max-w-xl text-lg leading-relaxed text-foreground sm:text-xl">
          Soluções jurídicas ágeis e seguras para você e sua empresa. Fale com um especialista agora.
        </p>
        <div style={{ animationDelay: "3.85s" }} className="hero-rise-3d mt-10 flex flex-col gap-3 sm:flex-row">
          <a href={SITE.whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 bg-primary px-7 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground hover:bg-graphite">
            <WhatsAppIcon size={16} /> WhatsApp {SITE.whatsapp}
          </a>
          <a href={SITE.phoneHref} className="inline-flex items-center justify-center gap-3 border border-foreground/30 px-7 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-foreground hover:border-bronze hover:text-bronze">
            <Phone size={16} /> Ligar agora
          </a>
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-transparent via-background/50 to-background" />
      </section>

      <section className="section-y">
        <div className="container-site">
          <div>
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
