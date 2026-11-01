import { createServerFn } from "@tanstack/react-start";

import { googleNewsRssUrl, parseRssItems, type Noticia } from "@/lib/news-core";

export type LegalNewsResult = { noticias: Noticia[]; ok: boolean };

export const getLegalNews = createServerFn({ method: "GET" }).handler(
  async (): Promise<LegalNewsResult> => {
    try {
      const res = await fetch(googleNewsRssUrl(), {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
          Accept: "application/rss+xml, application/xml, text/xml, */*",
          "Accept-Language": "pt-BR,pt;q=0.9",
        },
      });
      if (!res.ok) return { noticias: [], ok: false };
      const xml = await res.text();
      return { noticias: parseRssItems(xml), ok: true };
    } catch {
      return { noticias: [], ok: false };
    }
  },
);
