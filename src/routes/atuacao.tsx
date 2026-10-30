import { createFileRoute, Link } from "@tanstack/react-router";
import { PageIntro } from "@/components/PageIntro";
import { AREAS } from "@/content/areas";

const T = "Áreas de atuação | Silva & Kurihara Advogados Associados";
const D = "Advocacia civil, trabalhista, empresarial, previdenciária, imobiliária, família e sucessões e recuperação judicial em Morro Agudo, SP.";

export const Route = createFileRoute("/atuacao")({
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
  component: Atuacao,
});

function Atuacao() {
  return (
    <>
      <PageIntro eyebrow="Atuação" title="Áreas de atuação" />
      <section className="section-y">
        <div className="container-site max-w-3xl">
          <ul className="border-t">
            {AREAS.map((a) => (
              <li key={a.slug} className="border-b py-5 font-serif text-2xl">{a.name}</li>
            ))}
          </ul>
          <p className="mt-10 text-lg text-muted-foreground">
            Para saber se o escritório pode ajudar no seu caso, <Link to="/contato" className="text-primary underline underline-offset-4">entre em contato</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
