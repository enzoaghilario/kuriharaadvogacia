import { createServerFn } from "@tanstack/react-start";

import { bingNewsRssUrl, googleNewsRssUrl, mergeNews, parseRssItems, type Noticia } from "@/lib/news-core";

export type LegalNewsResult = { noticias: Noticia[]; ok: boolean };

const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
  Accept: "application/rss+xml, application/xml, text/xml, */*",
  "Accept-Language": "pt-BR,pt;q=0.9",
};

const FETCH_TIMEOUT_MS = 4000;
const CACHE_TTL_MS = 30 * 60 * 1000;

// Todas as fontes rodam em paralelo; o resultado é unido e filtrado igualmente.
export const NEWS_SOURCES: { name: string; url: () => string }[] = [
  { name: "ConJur", url: () => "https://www.conjur.com.br/feed/" },
  { name: "JOTA", url: () => "https://www.jota.info/feed" },
  { name: "Google News", url: () => googleNewsRssUrl() },
  { name: "Bing Notícias", url: () => bingNewsRssUrl() },
];

let cache: { at: number; value: LegalNewsResult } | null = null;

async function fetchSource(src: { name: string; url: () => string }): Promise<Noticia[]> {
  try {
    const res = await fetch(src.url(), { headers: HEADERS, signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
    if (!res.ok) {
      console.error(`[Jornal jurídico] ${src.name} falhou: HTTP ${res.status}`);
      return [];
    }
    return parseRssItems(await res.text(), 50, src.name);
  } catch (err) {
    const reason = err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError") ? "timeout de 4 s" : String(err);
    console.error(`[Jornal jurídico] ${src.name} falhou: ${reason}`);
    return [];
  }
}

export async function loadLegalNews(): Promise<LegalNewsResult> {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.value;
  const settled = await Promise.allSettled(NEWS_SOURCES.map(fetchSource));
  const noticias = mergeNews(settled.map((r) => (r.status === "fulfilled" ? r.value : [])));
  if (!noticias.length) return { noticias: [], ok: false }; // não guarda falha no cache
  const value = { noticias, ok: true };
  cache = { at: Date.now(), value };
  return value;
}

export const getLegalNews = createServerFn({ method: "GET" }).handler(loadLegalNews);
