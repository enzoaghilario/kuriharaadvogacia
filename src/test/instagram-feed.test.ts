import { describe, expect, it } from "vitest";

import {
  dedupeAndSort,
  describeGraphError,
  isFeedConfigured,
  normalizeGraphMedia,
  parseGraphList,
  shouldRefresh,
  syncIntervalMinutes,
  syncLimit,
} from "@/lib/instagram-core";

const photo = {
  id: "17889",
  permalink: "https://www.instagram.com/p/C1ABC/",
  timestamp: "2026-03-01T12:00:00+0000",
  media_type: "IMAGE",
  media_url: "https://cdn.example/foto.jpg",
  caption: "  Direito do trabalhador: o que muda em 2026  ",
};

describe("normalizeGraphMedia", () => {
  it("mantém a publicação real com legenda, link e data", () => {
    const post = normalizeGraphMedia(photo);
    expect(post).toMatchObject({
      id: "17889",
      permalink: "https://www.instagram.com/p/C1ABC/",
      mediaType: "IMAGE",
      imageUrl: "https://cdn.example/foto.jpg",
      caption: "Direito do trabalhador: o que muda em 2026",
      publishedAt: "2026-03-01T12:00:00.000Z",
    });
  });

  it("usa a miniatura como capa de Reels, não o arquivo de vídeo", () => {
    const post = normalizeGraphMedia({
      ...photo,
      media_type: "REELS",
      media_url: "https://cdn.example/video.mp4",
      thumbnail_url: "https://cdn.example/capa.jpg",
    });
    expect(post?.imageUrl).toBe("https://cdn.example/capa.jpg");
  });

  it("usa a primeira mídia do carrossel como capa", () => {
    const post = normalizeGraphMedia({
      ...photo,
      media_type: "CAROUSEL_ALBUM",
      media_url: undefined,
      children: { data: [{ id: "c1", media_url: "https://cdn.example/foto2.jpg" }] },
    });
    expect(post?.imageUrl).toBe("https://cdn.example/foto2.jpg");
  });

  it("descarta publicação sem link original", () => {
    expect(normalizeGraphMedia({ ...photo, permalink: "" })).toBeNull();
  });

  it("descarta data que não existe", () => {
    expect(normalizeGraphMedia({ ...photo, timestamp: undefined })).toBeNull();
  });
});

describe("dedupeAndSort", () => {
  it("não repete a mesma publicação e traz a mais nova primeiro", () => {
    const older = normalizeGraphMedia({ ...photo, id: "1", timestamp: "2026-02-01T12:00:00+0000" })!;
    const newer = normalizeGraphMedia({ ...photo, id: "2", timestamp: "2026-03-05T12:00:00+0000" })!;
    const again = normalizeGraphMedia({ ...photo, id: "2", timestamp: "2026-03-05T12:00:00+0000" })!;

    const result = dedupeAndSort([older, newer, again]);
    expect(result.map((post) => post.id)).toEqual(["2", "1"]);
  });
});

describe("parseGraphList", () => {
  it("devolve lista vazia quando a Meta não mandou publicações", () => {
    expect(parseGraphList({ data: [] })).toEqual([]);
    expect(parseGraphList(null)).toEqual([]);
  });
});

describe("shouldRefresh", () => {
  const now = new Date("2026-03-01T12:00:00Z").getTime();

  it("busca quando nunca houve sincronização", () => {
    expect(shouldRefresh(null, now, 30)).toBe(true);
  });

  it("não busca de novo dentro do intervalo", () => {
    expect(shouldRefresh("2026-03-01T11:50:00.000Z", now, 30)).toBe(false);
  });

  it("busca quando o intervalo venceu", () => {
    expect(shouldRefresh("2026-03-01T11:29:00.000Z", now, 30)).toBe(true);
  });
});

describe("describeGraphError", () => {
  it("avisa quando o token expirou", () => {
    expect(describeGraphError({ error: { message: "Error validating access token", code: 190 } })).toContain("expirou");
  });

  it("avisa quando a Meta limitou as requisições", () => {
    expect(describeGraphError({ error: { message: "Calls to this graph api", code: 613 } })).toContain("limitou");
  });
});

describe("isFeedConfigured", () => {
  it("diz que falta configuração sem token", () => {
    expect(isFeedConfigured({ INSTAGRAM_ACCOUNT_ID: "1789" })).toBe(false);
  });

  it("diz que falta configuração sem conta", () => {
    expect(isFeedConfigured({ INSTAGRAM_ACCESS_TOKEN: "token" })).toBe(false);
  });

  it("diz que está pronto com token e conta", () => {
    expect(isFeedConfigured({ INSTAGRAM_ACCESS_TOKEN: "token", INSTAGRAM_ACCOUNT_ID: "1789" })).toBe(true);
  });
});

describe("syncIntervalMinutes e syncLimit", () => {
  it("mantém o intervalo configurado", () => {
    expect(syncIntervalMinutes("15")).toBe(15);
  });

  it("volta para 30 minutos quando a configuração é inválida", () => {
    expect(syncIntervalMinutes("abc")).toBe(30);
  });

  it("limita a busca ao que a API aceita", () => {
    expect(syncLimit("500")).toBe(50);
    expect(syncLimit(undefined)).toBe(12);
  });
});
