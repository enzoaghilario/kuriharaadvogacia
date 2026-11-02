import { createServerFn } from "@tanstack/react-start";

import { googleNewsRssUrl, parseRssItems, type Noticia } from "@/lib/news-core";

export type LegalNewsResult = { noticias: Noticia[]; ok: boolean };

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  Accept: "application/rss+xml, application/xml, text/xml, */*",
  "Accept-Language": "pt-BR,pt;q=0.9",
};

const FETCH_TIMEOUT_MS = 4000;
const CACHE_TTL_MS = 30 * 60 * 1000;

// Cache em memória por instância do servidor: evita refazer a busca a cada visita.
let cache: { at: number; value: LegalNewsResult } | null = null;

export const getLegalNews = createServerFn({ method: "GET" }).handler(
  async (): Promise<LegalNewsResult> => {
    if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.value;
    try {
      const res = await fetch(googleNewsRssUrl(), {
        headers: HEADERS,
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });
      if (res.ok) {
        const noticias = parseRssItems(await res.text());
        if (noticias.length) {
          const value = { noticias, ok: true };
          cache = { at: Date.now(), value };
          return value;
        }
      }
    } catch {
      // timeout ou falha de rede: cai no estado "indisponível"
    }
    return { noticias: [], ok: false };
  },
);
