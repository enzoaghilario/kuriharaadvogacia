import { createFileRoute } from "@tanstack/react-router";

import { AREAS } from "@/content/areas";
import { FULL_ADDRESS, SITE } from "@/content/site";
import { originFromRequest, PUBLIC_PATHS } from "@/lib/seo";

const PAGE_INFO: Record<(typeof PUBLIC_PATHS)[number], [string, string]> = {
  "/": ["Início", "Apresentação do escritório e contatos rápidos."],
  "/escritorio": ["Escritório", "Quem somos e dúvidas frequentes."],
  "/atuacao": ["Serviços", "Áreas de atuação do escritório."],
  "/conteudos": ["Conteúdos", "Notícias jurídicas e publicações."],
  "/seja-parceiro": ["Seja parceiro", "Programa de parceria do escritório."],
  "/contato": ["Contato", "Endereço, telefone, WhatsApp e mapa."],
  "/privacidade": ["Aviso de privacidade", "Como o site trata informações de visitantes."],
};

export function buildLlmsTxt(origin: string): string {
  return [
    `# ${SITE.name}`,
    "",
    `> Escritório de advocacia em ${SITE.city}-${SITE.state}, com atuação em ${AREAS.length} áreas do direito.`,
    "",
    "## Contato",
    "",
    `- Endereço: ${FULL_ADDRESS}`,
    `- Telefone: ${SITE.phone}`,
    `- WhatsApp: ${SITE.whatsapp} (${SITE.whatsappHref})`,
    `- Horário: ${SITE.hours.label}`,
    "",
    "## Áreas de atuação",
    "",
    ...AREAS.map((a) => `- ${a.name} — ${a.description}`),
    "",
    "## Páginas",
    "",
    ...PUBLIC_PATHS.map((p) => `- [${PAGE_INFO[p][0]}](${origin}${p}): ${PAGE_INFO[p][1]}`),
    "",
  ].join("\n");
}

export const Route = createFileRoute("/llms.txt")({
  server: {
    handlers: {
      GET: ({ request }) =>
        new Response(buildLlmsTxt(originFromRequest(request)), {
          headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
        }),
    },
  },
});
