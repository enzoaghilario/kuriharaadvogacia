import { createServerFn } from "@tanstack/react-start";

import { googleNewsRssUrl, NEWS_QUERY, parseRssItems, type Noticia } from "@/lib/news-core";

export type LegalNewsResult = { noticias: Noticia[]; ok: boolean };

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  Accept: "application/rss+xml, application/xml, text/xml, */*",
  "Accept-Language": "pt-BR,pt;q=0.9",
};

// Fontes em ordem: o Google News às vezes bloqueia o servidor publicado,
// então caímos para o Bing Notícias.
function sources(): string[] {
  return [
    googleNewsRssUrl(),
    `https://www.bing.com/news/search?q=${encodeURIComponent(NEWS_QUERY)}&format=rss&setlang=pt-BR&cc=BR`,
  ];
}

export const getLegalNews = createServerFn({ method: "GET" }).handler(
  async (): Promise<LegalNewsResult> => {
    for (const url of sources()) {
      try {
        const res = await fetch(url, { headers: HEADERS });
        if (!res.ok) continue;
        const noticias = parseRssItems(await res.text());
        if (noticias.length) return { noticias, ok: true };
      } catch {
        // tenta a próxima fonte
      }
    }
    return { noticias: [], ok: false };
  },
);
