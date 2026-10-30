import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageIntro } from "@/components/PageIntro";
import { AREAS } from "@/content/areas";

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

function AccordionV1() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <ul className="border-t">
      {AREAS.map((a) => {
        const isOpen = open === a.slug;
        return (
          <li key={a.slug} className="border-b">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : a.slug)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-6 py-5 text-left"
            >
              <span className="font-serif text-2xl text-foreground">{a.name}</span>
              <span aria-hidden className={`text-2xl leading-none text-bronze transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>
                +
              </span>
            </button>
            <div className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <p className="max-w-2xl pb-6 text-base leading-relaxed text-muted-foreground">{a.description}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function AccordionV2() {
  const [open, setOpen] = useState<string | null>(null);
  return (
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
              <span aria-hidden className={`text-base text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                ▾
              </span>
            </button>
            <div className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <div className="rule-bronze mb-5 ml-12 max-w-2xl !w-10" />
                <p className="ml-12 max-w-2xl pb-6 text-base leading-relaxed text-muted-foreground">{a.description}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function Atuacao() {
  return (
    <>
      <PageIntro eyebrow="Serviços" title="Áreas de atuação" />
      <section className="section-y">
        <div className="container-site max-w-3xl space-y-16">
          <div>
            <p className="eyebrow">Modelo 1</p>
            <AccordionV1 />
          </div>
          <div>
            <p className="eyebrow">Modelo 2</p>
            <AccordionV2 />
          </div>
          <p className="text-lg text-muted-foreground">
            Para saber se o escritório pode ajudar no seu caso,{" "}
            <Link to="/contato" className="text-primary underline underline-offset-4">entre em contato</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
