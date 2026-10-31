// Áreas de atuação confirmadas pelo escritório (texto "Sobre nós" do Grupo Kurihara & Figueiredo).
export type PracticeArea = { slug: string; name: string; description: string; topics: string[] };
export const AREAS: PracticeArea[] = [
  {
    slug: "civil",
    name: "Advocacia civil",
    description:
      "Cuida de conflitos do dia a dia, como contratos, cobranças, indenizações e direitos do consumidor, sempre em busca de uma solução justa e segura.",
    topics: ["Contratos", "Cobranças", "Indenizações", "Direito do consumidor"],
  },
  {
    slug: "trabalhista",
    name: "Advocacia trabalhista",
    description:
      "Atende empregados e empresas em questões do trabalho, como salários, verbas rescisórias, acordos e processos trabalhistas.",
    topics: ["Rescisões e verbas rescisórias", "Horas extras e salários", "Acordos trabalhistas", "Defesa de empresas"],
  },
  {
    slug: "empresarial",
    name: "Advocacia empresarial",
    description:
      "Orienta empresas em contratos, rotinas e decisões importantes, oferecendo segurança jurídica para o negócio crescer com tranquilidade.",
    topics: ["Contratos empresariais", "Abertura e alteração de empresas", "Consultoria preventiva"],
  },
  {
    slug: "previdenciaria",
    name: "Advocacia previdenciária",
    description:
      "Acompanha pedidos e revisões de benefícios do INSS, como aposentadoria, auxílio-doença e pensão, do requerimento até a concessão.",
    topics: ["Aposentadorias", "Auxílio-doença e auxílios", "Pensão por morte", "Revisão de benefícios do INSS"],
  },
  {
    slug: "imobiliaria",
    name: "Advocacia imobiliária",
    description:
      "Cuida da compra, venda e locação de imóveis, com análise de contratos e regularização de documentos para uma negociação tranquila.",
    topics: ["Compra e venda", "Locação", "Regularização de imóveis", "Análise de contratos"],
  },
  {
    slug: "familia-sucessoes",
    name: "Direito de família e sucessões",
    description:
      "Atende questões de divórcio, guarda, alimentos e inventários com atenção, discrição e respeito à história de cada família.",
    topics: ["Divórcio", "Guarda", "Pensão alimentícia", "Inventário e partilha"],
  },
  {
    slug: "recuperacao-credito",
    name: "Recuperação de crédito",
    description:
      "Ajuda a recuperar valores em aberto, por meio de negociações, acordos e, quando necessário, ações judiciais de cobrança.",
    topics: ["Negociação de dívidas", "Acordos", "Ações de cobrança e execução"],
  },
  {
    slug: "recuperacao-judicial",
    name: "Recuperação judicial",
    description:
      "Acompanha a empresa em todo o processo de recuperação judicial, protegendo o negócio e buscando equilíbrio entre as dívidas.",
    topics: ["Pedido de recuperação", "Plano de recuperação", "Acompanhamento do processo"],
  },
  {
    slug: "reestruturacao",
    name: "Reestruturação de empresas",
    description:
      "Orienta a empresa em momentos de dificuldade para reorganizar dívidas, contratos e operações e seguir funcionando com firmeza.",
    topics: ["Reorganização de dívidas", "Revisão de contratos", "Reestruturação de operações"],
  },
];
