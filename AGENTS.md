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

- The Instagram feed is served from `public.instagram_posts`; the only writer is the scheduled route `/api/public/jobs/instagram-sync`, and pages read the stored rows. Why: the site keeps working and never shows invented posts when the Meta API is unreachable or the access key expires.

