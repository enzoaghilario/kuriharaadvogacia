import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro } from "@/components/PageIntro";
import { formatDate, POSTS, type Post } from "@/content/posts";

const T = "Conteúdos jurídicos | Kurihara & Figueiredo Advogados Associados";
const D = "Artigos e conteúdos informativos publicados pelo escritório Kurihara & Figueiredo Advogados Associados.";

export const Route = createFileRoute("/conteudos/")({
  head: () => ({
    meta: [
      { title: T },
      { name: "description", content: D },
      { property: "og:title", content: T },
      { property: "og:description", content: D },
    ],
  }),
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
  const posts = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <>
      <PageIntro eyebrow="Conteúdos" title="Conteúdos jurídicos">
        Informações jurídicas apresentadas de forma clara e acessível.
      </PageIntro>
      <section className="section-y">
        <div className="container-site">
          {posts.length === 0 ? (
            <div className="border border-dashed p-10 text-center sm:p-16">
              <p className="font-serif text-2xl">Em breve</p>
              <p className="mt-3 text-muted-foreground">As primeiras publicações estão em preparação.</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => <div key={p.slug} className="relative flex"><PostCard post={p} /></div>)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
