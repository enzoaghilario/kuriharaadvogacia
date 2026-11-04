import { pageHead } from "@/lib/seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useQuery } from "@tanstack/react-query";

import { LegalNews } from "@/components/LegalNews";
import { PageIntro } from "@/components/PageIntro";
import { formatDate, type Post } from "@/content/posts";
import { getLegalNews } from "@/lib/news.functions";

const T = "Conteúdos | Kurihara & Figueiredo Advogados Associados";
const D = "Notícias jurídicas selecionadas do escritório Kurihara & Figueiredo Advogados Associados.";

const legalNewsQueryOptions = queryOptions({
  queryKey: ["legal-news"],
  queryFn: () => getLegalNews(),
  staleTime: 15 * 60 * 1000,
});

export const Route = createFileRoute("/conteudos/")({
  head: ({ match }) => pageHead({ origin: match.context.origin, path: "/conteudos", title: T, description: D }),
  // As notícias não bloqueiam a página: carregam no navegador depois da renderização.
  component: Conteudos,
});

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="group relative flex flex-col border bg-card p-7 transition-colors hover:border-bronze">
      <p className="eyebrow">{post.category}</p>
      <h3 className="mt-4 text-2xl leading-snug">
        <Link to="/conteudos/$slug" params={{ slug: post.slug }} className="after:absolute after:inset-0 group-hover:text-primary">{post.title}</Link>
      </h3>
      <p className="mt-3 flex-1 leading-relaxed text-muted-foreground">{post.summary}</p>
      <time dateTime={post.date} className="mt-6 text-xs uppercase tracking-widest text-muted-foreground">{formatDate(post.date)}</time>
    </article>
  );
}

function Conteudos() {
  const news = useQuery(legalNewsQueryOptions);

  return (
    <>
      <PageIntro eyebrow="Conteúdos" title="Conteúdos jurídicos">
        Informações jurídicas apresentadas de forma clara e acessível.
      </PageIntro>

      <LegalNews loading={news.isPending} noticias={news.data?.noticias ?? []} ok={news.data?.ok ?? !news.isError} />
    </>
  );
}
