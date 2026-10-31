import { Clock, ExternalLink, RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { formatNewsDate, type Noticia } from "@/lib/news-core";
import { SectionHeading } from "@/components/PageIntro";

type Props = { noticias: Noticia[]; ok: boolean };

export function LegalNews({ noticias, ok }: Props) {
  const queryClient = useQueryClient();
  const refreshing = queryClient.isFetching({ queryKey: ["legal-news"] }) > 0;

  return (
    <section className="section-y border-t">
      <div className="container-site">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow="Atualizações" title="Jornal jurídico" />
          <button
            type="button"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["legal-news"] })}
            disabled={refreshing}
            className="inline-flex w-fit items-center gap-2 border border-foreground/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-foreground transition-colors hover:border-bronze hover:text-bronze disabled:opacity-50"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Atualizando…" : "Atualizar"}
          </button>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Notícias jurídicas e novidades legislativas reunidas automaticamente a partir de fontes públicas.
        </p>

        {!ok || noticias.length === 0 ? (
          <div className="mt-12 border border-dashed p-10 text-center sm:p-16">
            <p className="font-serif text-2xl">Indisponível no momento</p>
            <p className="mt-3 text-muted-foreground">
              Não foi possível carregar as notícias agora. Tente atualizar em instantes.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {noticias.map((item) => (
              <article
                key={item.link}
                className="group relative flex flex-col border bg-card p-7 transition-colors hover:border-bronze"
              >
                <p className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                  <Clock size={13} aria-hidden />
                  <time dateTime={item.pubDate}>{formatNewsDate(item.pubDate)}</time>
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
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
