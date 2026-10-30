import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import fachada from "@/assets/fachada.jpg.asset.json";
import fachadaRua from "@/assets/fachada-rua.jpg.asset.json";
import { ContactBlock } from "@/components/ContactBlock";
import { SectionHeading } from "@/components/PageIntro";
import { PostCard } from "./conteudos.index";
import { POSTS } from "@/content/posts";

const TITLE = "Silva & Kurihara Advogados Associados | Advocacia em Morro Agudo, SP";
const DESC =
  "Escritório de advocacia em Morro Agudo, São Paulo. Atuação jurídica pautada pela responsabilidade, ética e compromisso. Rua Maria Liporini Meireles, 731 — (16) 3851-0303.";

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
          src={fachada.url}
          alt="Fachada do escritório Silva & Kurihara em Morro Agudo"
          width={1600}
          height={900}
          fetchPriority="high"
          className="absolute inset-0 -z-20 h-full w-full scale-105 object-cover blur-[2px]"
        />
        <div className="bg-hero-overlay absolute inset-0 -z-10" />
        <div className="container-site pb-20 pt-36 sm:pb-28">
          <div className="max-w-3xl animate-rise">
            <p className="eyebrow">Morro Agudo — São Paulo</p>
            <h1 className="text-display mt-6 text-on-dark">
              Silva <span className="text-bronze">&amp;</span> Kurihara
            </h1>
            <p className="mt-4 text-sm uppercase tracking-[0.35em] text-on-dark-muted">Advogados Associados</p>
            <div className="rule-bronze my-8" />
            <p className="max-w-xl text-lg leading-relaxed text-on-dark-muted sm:text-xl">
              Atuação jurídica pautada pela responsabilidade, ética e compromisso com cada questão confiada ao escritório.
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
        <div className="container-site grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div className="relative order-2 lg:order-1">
            <img src={fachadaRua.url} alt="Vista da rua com a fachada do escritório" loading="lazy" width={1200} height={700} className="aspect-[4/3] w-full object-cover" />
            <div className="absolute -bottom-6 -right-4 hidden h-32 w-32 border border-bronze sm:block" aria-hidden />
          </div>
          <div className="order-1 lg:order-2">
            <SectionHeading eyebrow="O escritório" title="Conheça o escritório" />
            <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
              Silva &amp; Kurihara Advogados Associados é um escritório de advocacia localizado em Morro Agudo, São Paulo,
              orientado pelos princípios de ética, responsabilidade, discrição e profissionalismo.
            </p>
            <Link to="/escritorio" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary hover:text-bronze">
              Saiba mais <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

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
          <SectionHeading eyebrow="Contato" title="Visite ou ligue para o escritório" />
          <div className="mt-12"><ContactBlock /></div>
        </div>
      </section>
    </>
  );
}
