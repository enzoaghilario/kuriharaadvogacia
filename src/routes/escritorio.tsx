import { createFileRoute } from "@tanstack/react-router";
import fachada from "@/assets/fachada-hd.jpg";
import fachadaRua from "@/assets/fachada-rua-hd.jpg";
import { PageIntro } from "@/components/PageIntro";

const T = "O escritório | Silva & Kurihara Advogados Associados";
const D = "Conheça o escritório Silva & Kurihara Advogados Associados, em Morro Agudo, SP: ética, responsabilidade, discrição e profissionalismo.";

export const Route = createFileRoute("/escritorio")({
  head: () => ({
    meta: [
      { title: T },
      { name: "description", content: D },
      { property: "og:title", content: T },
      { property: "og:description", content: D },
    ],
  }),
  component: Escritorio,
});

const VALUES = ["Ética", "Responsabilidade", "Discrição", "Profissionalismo"];

function Escritorio() {
  return (
    <>
      <PageIntro eyebrow="O escritório" title="Conheça o escritório" />
      <section className="section-y">
        <div className="container-site grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
            <p>
              Silva &amp; Kurihara Advogados Associados é um escritório de advocacia localizado em Morro Agudo, São Paulo.
            </p>
            <p>
              Sua atuação reflete os princípios de ética, responsabilidade, discrição e profissionalismo que orientam o
              exercício da advocacia, com atendimento próximo e atento a cada questão confiada ao escritório.
            </p>
            <ul className="grid grid-cols-2 gap-px border bg-border pt-0 text-foreground">
              {VALUES.map((v, i) => (
                <li key={v} className="bg-background p-6">
                  <span className="text-xs text-bronze">0{i + 1}</span>
                  <p className="mt-2 font-serif text-xl">{v}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-5 gap-4">
            <img src={fachada} alt="Entrada do escritório com a inscrição Advocacia" loading="lazy" width={800} height={1000} className="col-span-3 aspect-[3/4] w-full object-cover" />
            <img src={fachadaRua} alt="Fachada do escritório vista da rua" loading="lazy" width={600} height={800} className="col-span-2 mt-16 aspect-[3/4] w-full object-cover" />
          </div>
        </div>
      </section>
    </>
  );
}
