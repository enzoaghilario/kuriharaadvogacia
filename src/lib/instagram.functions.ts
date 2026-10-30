import { createServerFn } from "@tanstack/react-start";

import type { InstagramPost } from "./instagram-core";

export type InstagramFeedDto = {
  posts: InstagramPost[];
  configured: boolean;
  lastSuccessAt: string | null;
};

/**
 * Publicações reais do perfil do escritório.
 * Quando a integração ainda não foi conectada, devolve lista vazia — nada é inventado.
 */
export const getInstagramFeed = createServerFn({ method: "GET" }).handler(async (): Promise<InstagramFeedDto> => {
  const { ensureFreshInstagramFeed, readInstagramFeed } = await import("@/lib/instagram.server");
  await ensureFreshInstagramFeed();
  const { posts, status } = await readInstagramFeed();
  return { posts, configured: status.configured, lastSuccessAt: status.lastSuccessAt };
});
