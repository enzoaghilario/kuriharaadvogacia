<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules

- Mount the external Typebot bubble once in the shared root using a browser-only effect, never during SSR. Why: the chat persists across page navigation without executing DOM operations on the server.

- Keep partner applications in a standalone, browser-memory-only form with a shared validation schema; enable submission only after its dedicated external email delivery is configured and verified. Why: this flow must never reuse stored contact submissions or claim delivery before a real send succeeds.

- Keep site-wide palette and interaction styling in semantic CSS tokens; page components consume role classes rather than literal colors. Why: shared changes remain consistent across navigation, disclosures, dialogs and content pages.

- Share contact validation through a browser-safe schema used by the form and server input validator. Why: submitted fields must follow the same rules even when client checks are bypassed.

- The Instagram feed is served from `public.instagram_posts`; the only writer is the scheduled route `/api/public/jobs/instagram-sync`, and pages read the stored rows. Why: the site keeps working and never shows invented posts when the Meta API is unreachable or the access key expires.


- Legal news come only from specialized legal outlets via Google News, filtered by a keyword blocklist and http(s)-only links, with a 4s fetch timeout and 30-min server cache; /conteudos never awaits them in its loader. Why: keep partisan/crime news off the firm's site and keep the page fast.

- Canonical, og:url, og:image, sitemap.xml and robots.txt are built from the request origin through `pageHead` in src/lib/seo.ts and server routes. Why: the custom domain will change and URLs must follow it automatically.

- Security headers are added to every response in src/server.ts without overwriting existing ones; frame-ancestors must keep allowing Lovable hosts. Why: hardening without breaking the editor preview.
