import { pageHead } from "@/lib/seo";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { formatDate, POSTS } from "@/content/posts";

export const Route = createFileRoute("/conteudos/$slug")({
  loader: ({ params }) => {
    const post = POSTS.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData, match, params }) =>
    loaderData
      ? pageHead({
          origin: match.context.origin,
          path: `/conteudos/${params.slug}`,
          title: `${loaderData.title} | Kurihara & Figueiredo`,
          description: loaderData.summary,
          type: "article",
        })
      : { meta: [
          { title: "Conteúdo indisponível | Kurihara & Figueiredo" },
          { name: "description", content: "Este conteúdo não está disponível. Consulte os conteúdos da Kurihara & Figueiredo Advogados Associados." },
          { property: "og:title", content: "Conteúdo indisponível | Kurihara & Figueiredo" },
          { property: "og:description", content: "Este conteúdo não está disponível. Consulte os conteúdos da Kurihara & Figueiredo Advogados Associados." },
          { property: "og:type", content: "website" },
          { name: "twitter:card", content: "summary_large_image" },
          { name: "robots", content: "noindex" },
        ] },
  notFoundComponent: () => (
    <div className="container-site pt-44 pb-24">
      <h1 className="text-h2">Conteúdo não encontrado</h1>
      <Link to="/conteudos" className="mt-6 inline-block text-primary underline">Ver todos os conteúdos</Link>
    </div>
  ),
  component: PostPage,
});

function PostPage() {
  const post = Route.useLoaderData();
  return (
    <article className="pt-36 pb-24 sm:pt-44">
      <div className="container-site max-w-3xl">
        <Link to="/conteudos" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft size={16} /> Conteúdos</Link>
        <p className="eyebrow mt-10">{post.category}</p>
        <h1 className="text-h2 mt-4">{post.title}</h1>
        <time dateTime={post.date} className="mt-4 block text-sm text-muted-foreground">{formatDate(post.date)}</time>
        <div className="rule-bronze my-10" />
        <div className="space-y-6 text-lg leading-relaxed">
          {post.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>
    </article>
  );
}
