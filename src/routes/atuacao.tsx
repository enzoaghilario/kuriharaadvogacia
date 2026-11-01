import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageIntro } from "@/components/PageIntro";
import { AREAS, type PracticeArea } from "@/content/areas";
import { ServiceWhatsAppDialog } from "@/components/ServiceWhatsAppDialog";
import { useTiltCard } from "@/lib/use-tilt-card";

const T = "Áreas de atuação | Kurihara & Figueiredo Advogados Associados";
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
  const [open, setOpen] = useState<string | null>(null);
  const [service, setService] = useState<string | null>(null);
  return (
    <>
      <PageIntro eyebrow="Serviços" title="Áreas de atuação" />
      <section className="section-y">
        <div className="container-site max-w-3xl">
          <ul>
            {AREAS.map((a, i) => {
              const isOpen = open === a.slug;
              return (
                <li key={a.slug} className="border-b">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : a.slug)}
                    aria-expanded={isOpen}
                    className="group flex w-full items-baseline gap-6 py-5 text-left"
                  >
                    <span className="font-serif text-sm text-bronze">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 font-serif text-xl text-foreground transition-colors group-hover:text-bronze">{a.name}</span>
                    <span aria-hidden className={`text-base text-bronze transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                      ▾
                    </span>
                  </button>
                  <div className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <div className="rule-bronze mb-5 ml-12 max-w-2xl !w-10" />
                      <p className="ml-12 max-w-2xl pb-6 text-base leading-relaxed text-muted-foreground">{a.description}</p>
                      <ul className="mb-6 ml-12 max-w-2xl list-disc space-y-1 pl-5 text-base text-foreground marker:text-bronze">
                        {a.topics.map((t) => <li key={t}>{t}</li>)}
                      </ul>
                      {isOpen && (
                        <button type="button" onClick={() => setService(a.name)} className="mb-6 ml-12 text-sm text-bronze underline-offset-4 hover:underline">
                          Falar com o escritório sobre {a.name.toLowerCase()} →
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-10 text-lg text-muted-foreground">
            Para saber se o escritório pode ajudar no seu caso,{" "}
            <Link to="/contato" className="text-primary underline underline-offset-4">entre em contato</Link>.
          </p>
        </div>
      </section>
      <ServiceWhatsAppDialog service={service} onClose={() => setService(null)} />
    </>
  );
}
