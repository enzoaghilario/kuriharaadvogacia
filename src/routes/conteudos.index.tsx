import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

import { InstagramFeed } from "@/components/InstagramFeed";
import { LegalNews } from "@/components/LegalNews";
import { PageIntro, SectionHeading } from "@/components/PageIntro";
import { formatDate, POSTS, type Post } from "@/content/posts";
import { getInstagramFeed } from "@/lib/instagram.functions";
import { getLegalNews } from "@/lib/news.functions";

const T = "Conteúdos | Kurihara & Figueiredo Advogados Associados";
const D = "Publicações recentes do Instagram do escritório Kurihara & Figueiredo Advogados Associados, notícias jurídicas e artigos.";

const instagramFeedQueryOptions = queryOptions({
  queryKey: ["instagram-feed"],
  queryFn: () => getInstagramFeed(),
});

const legalNewsQueryOptions = queryOptions({
  queryKey: ["legal-news"],
  queryFn: () => getLegalNews(),
  staleTime: 15 * 60 * 1000,
});

export const Route = createFileRoute("/conteudos/")({
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
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(instagramFeedQueryOptions),
      context.queryClient.ensureQueryData(legalNewsQueryOptions),
    ]),
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
  const { data: feed } = useSuspenseQuery(instagramFeedQueryOptions);
  const { data: news } = useSuspenseQuery(legalNewsQueryOptions);
  const articles = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <PageIntro eyebrow="Conteúdos" title="Conteúdos jurídicos">
        Informações jurídicas apresentadas de forma clara e acessível.
      </PageIntro>

      <InstagramFeed posts={feed.posts} configured={feed.configured} lastSuccessAt={feed.lastSuccessAt} />

      <LegalNews noticias={news.noticias} ok={news.ok} />

      <section className="section-y border-t">
        <div className="container-site">
          <SectionHeading eyebrow="Artigos" title="Para ler com calma" />
          {articles.length === 0 ? (
            <div className="mt-12 border border-dashed p-10 text-center sm:p-16">
              <p className="font-serif text-2xl">Em breve</p>
              <p className="mt-3 text-muted-foreground">As primeiras publicações estão em preparação.</p>
            </div>
          ) : (
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((p) => <div key={p.slug} className="relative flex"><PostCard post={p} /></div>)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
