import { createServerFn } from "@tanstack/react-start";

import { googleNewsRssUrl, parseRssItems, type Noticia } from "@/lib/news-core";

export type LegalNewsResult = { noticias: Noticia[]; ok: boolean };

export const getLegalNews = createServerFn({ method: "GET" }).handler(
  async (): Promise<LegalNewsResult> => {
    try {
      const res = await fetch(googleNewsRssUrl(), {
        headers: { "User-Agent": "KuriharaFigueiredo-Site/1.0" },
      });
      if (!res.ok) return { noticias: [], ok: false };
      const xml = await res.text();
      return { noticias: parseRssItems(xml), ok: true };
    } catch {
      return { noticias: [], ok: false };
    }
  },
);
