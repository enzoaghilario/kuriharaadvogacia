import { useState } from "react";
import { Clock, ExternalLink, RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { formatNewsDate, NEWS_PAGE_SIZE, type Noticia } from "@/lib/news-core";
import { useTiltCard } from "@/lib/use-tilt-card";
import { SectionHeading } from "@/components/PageIntro";
import { Spotlight } from "@/components/Spotlight";

type Props = { noticias: Noticia[]; ok: boolean; loading?: boolean };

function NewsCard({ item }: { item: Noticia }) {
  const ref = useTiltCard<HTMLElement>();
  return (
    <article ref={ref} className="group card-glass tilt-card relative flex flex-col p-7">
      <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
        <Clock size={13} aria-hidden />
        <time dateTime={item.pubDate}>{formatNewsDate(item.pubDate)}</time>
        <span aria-hidden>·</span>
        <span>{item.source}</span>
      </p>
      <h3 className="mt-4 text-xl leading-snug">
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="after:absolute after:inset-0 group-hover:text-primary"
        >
          {item.title}
        </a>
      </h3>
      {item.snippet && (
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
          {item.snippet}
        </p>
      )}
      <p className="mt-6 inline-flex items-center gap-1.5 border-t pt-4 text-xs font-semibold uppercase tracking-widest text-bronze">
        Ler matéria completa <ExternalLink size={13} aria-hidden />
      </p>
    </article>
  );
}

export function LegalNews({ noticias, ok, loading = false }: Props) {
  const queryClient = useQueryClient();
  const refreshing = queryClient.isFetching({ queryKey: ["legal-news"] }) > 0;
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(noticias.length / NEWS_PAGE_SIZE));
  const current = noticias.slice(page * NEWS_PAGE_SIZE, (page + 1) * NEWS_PAGE_SIZE);

  function atualizar() {
    if (page + 1 < totalPages) {
      // Ainda há notícias do acervo: apenas rotaciona a vitrine.
      setPage(page + 1);
    } else {
      // Acervo esgotado: busca notícias novas e volta ao início.
      setPage(0);
      queryClient.invalidateQueries({ queryKey: ["legal-news"] });
    }
  }

  return (
    <section className="section-y border-t">
      <div className="container-site">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow="Atualizações" title="Jornal jurídico" />
          <button
            type="button"
            onClick={atualizar}
            disabled={refreshing || loading}
            className="inline-flex w-fit items-center gap-2 border border-foreground/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-foreground transition-colors hover:border-bronze hover:text-bronze disabled:opacity-50"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Atualizando…" : "Atualizar notícias"}
          </button>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Notícias jurídicas e novidades legislativas reunidas automaticamente a partir de fontes públicas.
        </p>

        {loading ? (
          <div aria-busy="true" aria-label="Carregando notícias" className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="card-glass flex animate-pulse flex-col gap-4 p-7">
                <div className="h-3 w-1/3 bg-muted" />
                <div className="h-5 w-full bg-muted" />
                <div className="h-5 w-4/5 bg-muted" />
                <div className="mt-2 h-3 w-full bg-muted" />
                <div className="h-3 w-2/3 bg-muted" />
              </div>
            ))}
          </div>
        ) : !ok || noticias.length === 0 ? (
          <div className="mt-12 border border-dashed p-10 text-center sm:p-16">
            <p className="font-serif text-2xl">Indisponível no momento</p>
            <p className="mt-3 text-muted-foreground">
              Não foi possível carregar as notícias agora. Tente atualizar em instantes.
            </p>
          </div>
        ) : (
          <Spotlight className="mt-12">
            <div
              key={page}
              className="grid animate-news-fade gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {current.map((item) => (
                <NewsCard key={item.link} item={item} />
              ))}
            </div>
          </Spotlight>
        )}
      </div>
    </section>
  );
}
