import { createFileRoute } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { PageIntro } from "@/components/PageIntro";
import { AREAS } from "@/content/areas";

const T = "Áreas de atuação | Silva & Kurihara Advogados Associados";
const D = "Áreas de atuação do escritório Silva & Kurihara Advogados Associados, em Morro Agudo, SP.";

export const Route = createFileRoute("/atuacao")({
  head: () => ({
    meta: [
      { title: T },
      { name: "description", content: D },
      { property: "og:title", content: T },
      { property: "og:description", content: D },
      ...(AREAS.length ? [] : [{ name: "robots", content: "noindex" }]),
    ],
  }),
  component: Atuacao,
});

function Atuacao() {
  return (
    <>
      <PageIntro eyebrow="Atuação" title="Áreas de atuação" />
      <section className="section-y">
        <div className="container-site">
          {AREAS.length === 0 ? (
            <p className="max-w-xl text-lg text-muted-foreground">As áreas de atuação serão publicadas em breve.</p>
          ) : (
            <div className="grid gap-px border bg-border sm:grid-cols-2 lg:grid-cols-3">
              {AREAS.map((a) => (
                <article key={a.slug} className="bg-background p-8 transition-colors hover:bg-card">
                  <BookOpen className="text-bronze" size={22} strokeWidth={1.25} aria-hidden />
                  <h2 className="mt-6 text-2xl">{a.name}</h2>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{a.description}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
