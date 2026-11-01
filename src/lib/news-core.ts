// Núcleo puro do jornal jurídico: parsing de RSS e formatação. Sem I/O.
export type Noticia = {
  title: string;
  link: string;
  pubDate: string; // ISO
  source: string;
  snippet: string;
};

export const NEWS_QUERY =
  "direito empresarial OR advocacia OR STF OR legislacao trabalhista";
// Acervo maior que a página exibida: o botão "Atualizar" rotaciona as
// notícias em lotes sem novo fetch até esgotar o acervo.
export const NEWS_LIMIT = 24;
export const NEWS_PAGE_SIZE = 6;

export function googleNewsRssUrl(query: string = NEWS_QUERY): string {
  return `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;
}

function stripTags(html: string): string {
  // Decodifica entidades ANTES de remover tags: o Google News escapa o HTML
  // da descrição (&lt;a ...&gt;), que viraria tag visível se decodificado depois.
  return html
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/<[^>]*>?/gm, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pickTag(block: string, tag: string): string {
  const m = block.match(
    new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`, "i"),
  );
  return m?.[1]?.trim() ?? "";
}

// Parser mínimo de RSS (workerd não tem DOMParser).
export function parseRssItems(xml: string, limit: number = NEWS_LIMIT): Noticia[] {
  const items: Noticia[] = [];
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ?? [];
  for (const block of blocks.slice(0, limit)) {
    const title = stripTags(pickTag(block, "title"));
    let link = pickTag(block, "link").replace(/&amp;/g, "&");
    // Bing embrulha o link real em apiclick.aspx?url=...
    const real = link.includes("bing.com/news/apiclick") ? link.match(/[?&]url=([^&]+)/)?.[1] : undefined;
    if (real) link = decodeURIComponent(real);
    const pubDateRaw = pickTag(block, "pubDate");
    const source = stripTags(pickTag(block, "source") || pickTag(block, "News:Source")) || "Informativo Jurídico";
    const snippet = stripTags(pickTag(block, "description")).slice(0, 160);
    if (!title || !link) continue;
    const date = new Date(pubDateRaw);
    items.push({
      title,
      link,
      pubDate: isNaN(date.getTime()) ? "" : date.toISOString(),
      source,
      snippet: snippet ? snippet + (snippet.length >= 160 ? "…" : "") : "",
    });
  }
  return items;
}

export function formatNewsDate(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
