// Áreas de atuação confirmadas pelo escritório (texto "Sobre nós" do Grupo Kurihara & Figueiredo).
export type PracticeArea = { slug: string; name: string; description: string };
export const AREAS: PracticeArea[] = [
  { slug: "civil", name: "Advocacia civil", description: "" },
  { slug: "trabalhista", name: "Advocacia trabalhista", description: "" },
  { slug: "empresarial", name: "Advocacia empresarial", description: "" },
  { slug: "previdenciaria", name: "Advocacia previdenciária", description: "" },
  { slug: "imobiliaria", name: "Advocacia imobiliária", description: "" },
  { slug: "familia-sucessoes", name: "Direito de família e sucessões", description: "" },
  { slug: "recuperacao-credito", name: "Recuperação de crédito", description: "" },
  { slug: "recuperacao-judicial", name: "Recuperação judicial", description: "" },
  { slug: "reestruturacao", name: "Reestruturação de empresas", description: "" },
];
