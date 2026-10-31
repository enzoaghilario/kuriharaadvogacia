import { describe, expect, it } from "vitest";

import { formatNewsDate, googleNewsRssUrl, parseRssItems } from "@/lib/news-core";

const RSS = `<?xml version="1.0"?>
<rss version="2.0"><channel>
<item>
  <title><![CDATA[STF decide sobre tema empresarial]]></title>
  <link>https://exemplo.com/materia-1</link>
  <pubDate>Thu, 30 Oct 2026 12:00:00 GMT</pubDate>
  <source url="https://exemplo.com">Portal Jurídico</source>
  <description><![CDATA[<p>Resumo da <b>matéria</b> &amp; detalhes.</p>]]></description>
</item>
<item>
  <title>Notícia sem descrição</title>
  <link>https://exemplo.com/materia-2</link>
  <pubDate>data inválida</pubDate>
  <description></description>
</item>
<item><title></title><link></link></item>
</channel></rss>`;

describe("parseRssItems", () => {
  it("extrai título, link, fonte e resumo sem tags HTML", () => {
    const items = parseRssItems(RSS);
    const first = items[0]!;
    expect(first.title).toBe("STF decide sobre tema empresarial");
    expect(first.link).toBe("https://exemplo.com/materia-1");
    expect(first.source).toBe("Portal Jurídico");
    expect(first.snippet).toContain("Resumo da matéria & detalhes.");
    expect(first.snippet).not.toContain("<b>");
  });

  it("usa fonte padrão e data vazia quando inválida", () => {
    const items = parseRssItems(RSS);
    const second = items[1]!;
    expect(second.source).toBe("Informativo Jurídico");
    expect(second.pubDate).toBe("");
  });

  it("descarta itens sem título ou link", () => {
    expect(parseRssItems(RSS)).toHaveLength(2);
  });

  it("respeita o limite de itens", () => {
    expect(parseRssItems(RSS, 1)).toHaveLength(1);
  });

  it("retorna vazio para XML sem itens", () => {
    expect(parseRssItems("<rss><channel></channel></rss>")).toEqual([]);
  });
});

describe("googleNewsRssUrl", () => {
  it("monta a URL do Google News em pt-BR", () => {
    const url = googleNewsRssUrl("direito empresarial");
    expect(url).toContain("news.google.com/rss/search");
    expect(url).toContain("hl=pt-BR");
    expect(url).toContain("direito%20empresarial");
  });
});

describe("formatNewsDate", () => {
  it("formata ISO em pt-BR e tolera vazio", () => {
    expect(formatNewsDate("")).toBe("");
    expect(formatNewsDate("2026-10-30T12:00:00.000Z")).toMatch(/out/i);
  });
});
