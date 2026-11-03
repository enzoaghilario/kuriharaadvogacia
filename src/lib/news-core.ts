// Núcleo puro do jornal jurídico: parsing de RSS e formatação. Sem I/O.
export type Noticia = {
  title: string;
  link: string;
  pubDate: string; // ISO
  source: string;
  snippet: string;
};

export const NEWS_SITES = [
  "conjur.com.br",
  "migalhas.com.br",
  "jota.info",
  "stj.jus.br",
  "tst.jus.br",
  "portal.stf.jus.br",
];
export const NEWS_TOPICS = [
  "direito trabalhista",
  "previdenciário",
  "direito civil",
  "direito empresarial",
  "consumidor",
  "tributário",
  "direito de família",
];
export const NEWS_QUERY = `(${NEWS_SITES.map((s) => `site:${s}`).join(" OR ")}) (${NEWS_TOPICS.map((t) => `"${t}"`).join(" OR ")})`;

// Notícias com qualquer destes termos (título ou resumo) são descartadas:
// política partidária e crimes não combinam com o site do escritório.
export const NEWS_BLOCKLIST = [
  "lula", "bolsonaro", "eleição", "eleições", "eleito", "eleita", "reeleito", "reeleita",
  "partido", "deputado", "deputada", "senador", "senadora", "candidato", "candidata",
  "estupro", "homicídio", "assassinato", "preso", "presa", "prisão", "condenado", "condenada",
  "tráfico", "facção", "robinho", "crime", "crimes",
];

function normalize(text: string): string {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
const BLOCK_RE = new RegExp(
  `(^|[^a-z0-9])(${NEWS_BLOCKLIST.map(normalize).join("|")})(?=$|[^a-z0-9])`,
);

export function isBlockedNews(title: string, snippet = ""): boolean {
  return BLOCK_RE.test(normalize(`${title} ${snippet}`));
}

export function isHttpUrl(link: string): boolean {
  try {
    const u = new URL(link);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}
// Acervo maior que a página exibida: o botão "Atualizar" rotaciona as
// notícias em lotes sem novo fetch até esgotar o acervo.
export const NEWS_LIMIT = 24;
export const NEWS_PAGE_SIZE = 6;

export function bingNewsRssUrl(): string {
  const q = `(${NEWS_SITES.map((s) => `site:${s}`).join(" OR ")})`;
  return `https://www.bing.com/news/search?q=${encodeURIComponent(q)}&format=rss&setlang=pt-BR&cc=BR`;
}

/** Junta listas, remove duplicados por link ou título e ordena da mais recente. */
export function mergeNews(lists: Noticia[][], limit: number = NEWS_LIMIT): Noticia[] {
  const seenLinks = new Set<string>();
  const seenTitles = new Set<string>();
  const out: Noticia[] = [];
  for (const n of lists.flat()) {
    const t = normalize(n.title).replace(/\s+/g, " ").trim();
    if (seenLinks.has(n.link) || seenTitles.has(t)) continue;
    seenLinks.add(n.link);
    seenTitles.add(t);
    out.push(n);
  }
  out.sort((a, b) => (b.pubDate || "").localeCompare(a.pubDate || ""));
  return out.slice(0, limit);
}

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
export function parseRssItems(
  xml: string,
  limit: number = NEWS_LIMIT,
  defaultSource = "Informativo Jurídico",
): Noticia[] {
  const items: Noticia[] = [];
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ?? [];
  for (const block of blocks) {
    if (items.length >= limit) break;
    const title = stripTags(pickTag(block, "title"));
    let link = pickTag(block, "link").replace(/&amp;/g, "&");
    // Bing embrulha o link real em apiclick.aspx?url=...
    const real = link.includes("bing.com/news/apiclick") ? link.match(/[?&]url=([^&]+)/)?.[1] : undefined;
    if (real) link = decodeURIComponent(real);
    const pubDateRaw = pickTag(block, "pubDate");
    const source = stripTags(pickTag(block, "source")) || defaultSource;
    const snippet = stripTags(pickTag(block, "description")).slice(0, 160);
    if (!title || !link || !isHttpUrl(link)) continue;
    if (isBlockedNews(title, snippet)) continue;
    // Páginas de índice/arquivo dos portais não são notícias.
    if (/^arquivo de |p[áa]gina \d+ de \d+|term browse/i.test(title)) continue;
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
