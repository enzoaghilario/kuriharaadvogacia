import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Briefcase, Blocks, Building2, HandCoins, Handshake, Home, RefreshCw, Umbrella, Users } from "lucide-react";
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

const ICONS: Record<string, typeof Handshake> = {
  civil: Handshake,
  trabalhista: Briefcase,
  empresarial: Building2,
  previdenciaria: Umbrella,
  imobiliaria: Home,
  "familia-sucessoes": Users,
  "recuperacao-credito": HandCoins,
  "recuperacao-judicial": RefreshCw,
  reestruturacao: Blocks,
};

function Atuacao() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <>
      <PageIntro eyebrow="Serviços" title="Áreas de atuação" />
      <section className="section-y">
        <div className="container-site max-w-3xl">
          <ul>
            {AREAS.map((a, i) => {
              const isOpen = open === a.slug;
              const Icon = ICONS[a.slug] ?? Briefcase;
              return (
                <li key={a.slug} className="border-b">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : a.slug)}
                    aria-expanded={isOpen}
                    className="group flex w-full items-center gap-6 py-5 text-left"
                  >
                    <Icon aria-hidden size={20} strokeWidth={1.75} className="shrink-0 text-bronze" />
                    <span className="font-serif text-sm text-bronze">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 font-serif text-xl text-foreground transition-colors group-hover:text-bronze">{a.name}</span>
                    <span aria-hidden className={`text-base text-muted-foreground transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                      ▾
                    </span>
                  </button>
                  <div className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <div className="rule-bronze mb-5 ml-[4.4rem] max-w-2xl !w-10" />
                      <p className="ml-[4.4rem] max-w-2xl pb-6 text-base leading-relaxed text-muted-foreground">{a.description}</p>
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
    </>
  );
}
