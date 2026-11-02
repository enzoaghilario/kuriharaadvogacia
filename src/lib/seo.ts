import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

/** Origem da requisição atual (o domínio próprio ainda pode mudar). */
export const getRequestOrigin = createServerFn({ method: "GET" }).handler(() => {
  const req = getRequest();
  const url = new URL(req.url);
  const sandboxHost = url.hostname === "localhost" ? req.headers.get("x-forwarded-host") : null;
  return sandboxHost ? `https://${sandboxHost}` : url.origin;
});

export function originFromRequest(request: Request): string {
  const url = new URL(request.url);
  const sandboxHost = url.hostname === "localhost" ? request.headers.get("x-forwarded-host") : null;
  return sandboxHost ? `https://${sandboxHost}` : url.origin;
}

export const PUBLIC_PATHS = [
  "/",
  "/escritorio",
  "/atuacao",
  "/conteudos",
  "/seja-parceiro",
  "/contato",
  "/privacidade",
] as const;

type PageHeadInput = {
  origin?: string;
  path: string;
  title: string;
  description: string;
  type?: "website" | "article";
};

/** Metadados de página: título, descrição, Open Graph, canonical e imagem de compartilhamento. */
export function pageHead({ origin = "", path, title, description, type = "website" }: PageHeadInput) {
  const url = `${origin}${path}`;
  const image = `${origin}/og-image.jpg`;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: image },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
