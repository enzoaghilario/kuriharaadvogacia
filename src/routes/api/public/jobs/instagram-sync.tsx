import { createFileRoute } from "@tanstack/react-router";

import { authenticateCronRequest } from "@/lib/cron-auth";

/**
 * Atualização automática do feed do Instagram.
 * Chamada pela agenda do backend; o chamador é verificado antes de qualquer busca.
 */
export const Route = createFileRoute("/api/public/jobs/instagram-sync")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const authFailure = await authenticateCronRequest(request);
        if (authFailure) return authFailure;

        const { syncInstagramFeed } = await import("@/lib/instagram.server");
        const result = await syncInstagramFeed();
        return Response.json(
          { ok: result.ok, posts: result.posts, error: result.error },
          { headers: { "content-type": "application/json; charset=utf-8" } },
        );
      },
    },
  },
});
