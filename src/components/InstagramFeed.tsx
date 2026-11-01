import { INSTAGRAM_PROFILE, type InstagramPost } from "@/lib/instagram-core";

const dateFmt = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

const VIDEO_TYPES = new Set(["VIDEO", "REELS", "STORY"]);

function PlayBadge() {
  return (
    <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center bg-primary/80" aria-hidden>
      <svg viewBox="0 0 12 12" className="h-3 w-3 fill-none stroke-bronze" strokeWidth="1.4">
        <path d="M3 2.2 9.4 6 3 9.8Z" />
      </svg>
    </span>
  );
}

function PostCard({ post }: { post: InstagramPost }) {
  const isVideo = VIDEO_TYPES.has(post.mediaType);
  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className="group card-glass flex flex-col"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
        {post.imageUrl ? (
          <img
            src={post.imageUrl}
            alt={post.caption ?? "Publicação do escritório no Instagram"}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="grid h-full place-items-center px-6 text-center text-sm text-muted-foreground">
            Publicação sem imagem
          </div>
        )}
        {isVideo && <PlayBadge />}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="line-clamp-2 min-h-[2.75rem] text-sm leading-relaxed text-muted-foreground">
          {post.caption ?? "Publicação no Instagram"}
        </p>
        <div className="mt-5 flex items-center justify-between gap-4 border-t pt-4">
          <time dateTime={post.publishedAt} className="text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground">
            {dateFmt.format(new Date(post.publishedAt))}
          </time>
          <span className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-bronze">Ver publicação</span>
        </div>
      </div>
    </a>
  );
}

export function InstagramFeed({
  posts,
  configured,
  lastSuccessAt,
}: {
  posts: InstagramPost[];
  configured: boolean;
  lastSuccessAt: string | null;
}) {
  return (
    <section className="section-y">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="eyebrow">Instagram</p>
            <h2 className="text-h2 mt-4">Do nosso perfil</h2>
            <div className="rule-bronze mt-6" />
          </div>
          <a
            href={INSTAGRAM_PROFILE}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-foreground/30 px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] hover:border-bronze hover:text-bronze"
          >
            Ver todas as publicações
          </a>
        </div>

        {posts.length === 0 ? (
          <div className="mt-12 border border-dashed p-10 text-center sm:p-16">
            <p className="font-serif text-2xl">
              {configured ? "Nenhuma publicação carregada ainda" : "As publicações do Instagram ainda não aparecem aqui"}
            </p>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted-foreground">
              {configured
                ? "Assim que a próxima atualização terminar, as postagens mais recentes entram nesta lista sozinhas."
                : "Enquanto a integração com o Instagram não estiver conectada, você pode ver as postagens direto no perfil do escritório."}
            </p>
            <a
              href={INSTAGRAM_PROFILE}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-3 bg-primary px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground hover:bg-graphite"
            >
              Ver o perfil no Instagram
            </a>
          </div>
        ) : (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {lastSuccessAt && (
          <p className="mt-8 text-xs text-muted-foreground">
            Atualizado automaticamente em {dateFmt.format(new Date(lastSuccessAt))}.
          </p>
        )}
      </div>
    </section>
  );
}
