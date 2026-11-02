import { createFileRoute } from "@tanstack/react-router";

import { POSTS } from "@/content/posts";
import { originFromRequest, PUBLIC_PATHS } from "@/lib/seo";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const origin = originFromRequest(request);
        const paths = [...PUBLIC_PATHS, ...POSTS.map((p) => `/conteudos/${p.slug}`)];
        const xml =
          `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          paths.map((p) => `  <url><loc>${origin}${p}</loc></url>`).join("\n") +
          `\n</urlset>\n`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
