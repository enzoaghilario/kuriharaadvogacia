// Auxiliares puros da integração com o Instagram.
// Sem rede, sem banco e sem segredos: pode ser importado pelo navegador e pelos testes.

export type InstagramPost = {
  id: string;
  permalink: string;
  caption: string | null;
  mediaType: string;
  imageUrl: string | null;
  publishedAt: string; // ISO
  likeCount: number | null;
  commentsCount: number | null;
};

export type GraphMedia = {
  id?: unknown;
  permalink?: unknown;
  caption?: unknown;
  media_type?: unknown;
  media_url?: unknown;
  thumbnail_url?: unknown;
  timestamp?: unknown;
  like_count?: unknown;
  comments_count?: unknown;
  children?: { data?: GraphMedia[] } | null;
};

const VIDEO_TYPES = new Set(["VIDEO", "REELS", "STORY"]);

function text(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function count(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? Math.trunc(value) : null;
}

function usableUrl(value: unknown): string | null {
  const url = text(value);
  return url && /^https?:\/\//i.test(url) ? url : null;
}

/**
 * Converte uma publicação devolvida pela API da Meta na linha usada pelo site.
 * Devolve null quando falta id, link ou data — nada é inventado.
 */
export function normalizeGraphMedia(raw: GraphMedia): InstagramPost | null {
  const id = text(raw.id);
  const permalink = text(raw.permalink);
  const timestamp = text(raw.timestamp);
  if (!id || !permalink || !timestamp) return null;

  const time = new Date(timestamp).getTime();
  if (Number.isNaN(time)) return null;

  const mediaType = (text(raw.media_type) ?? "IMAGE").toUpperCase();

  // Carrossel: a capa é a primeira mídia filhos que tenha imagem.
  const children = Array.isArray(raw.children?.data) ? raw.children.data : [];
  const firstChild = children.find((child) => usableUrl(child.media_url) || usableUrl(child.thumbnail_url));

  let imageUrl: string | null;
  if (mediaType === "CAROSEL") {
    imageUrl = usableUrl(firstChild?.media_url) ?? usableUrl(firstChild?.thumbnail_url) ?? usableUrl(raw.thumbnail_url) ?? usableUrl(raw.media_url);
  } else if (VIDEO_TYPES.has(mediaType)) {
    // Vídeo e Reels: a miniatura é a capa; o arquivo em si abre no Instagram.
    imageUrl = usableUrl(raw.thumbnail_url) ?? usableUrl(raw.media_url);
  } else {
    imageUrl = usableUrl(raw.media_url) ?? usableUrl(raw.thumbnail_url);
  }

  return {
    id,
    permalink,
    caption: text(raw.caption),
    mediaType,
    imageUrl,
    publishedAt: new Date(time).toISOString(),
    likeCount: count(raw.like_count),
    commentsCount: count(raw.comments_count),
  };
}

/** Lista a partir de { data: [...] }. Sem dados, lista vazia. */
export function parseGraphList(body: unknown): GraphMedia[] {
  if (body && typeof body === "object" && Array.isArray((body as { data?: unknown }).data)) {
    return (body as { data: GraphMedia[] }).data;
  }
  return [];
}

/** Remove repetições por id e ordena da mais recente para a mais antiga. */
export function dedupeAndSort(posts: InstagramPost[]): InstagramPost[] {
  const byId = new Map<string, InstagramPost>();
  for (const post of posts) {
    if (!byId.has(post.id)) byId.set(post.id, post);
  }
  return [...byId.values()].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/** Deve buscar de novo? Só quando nunca houve sucesso ou o intervalo venceu. */
export function shouldRefresh(lastSuccessAt: string | null, nowMs: number, intervalMinutes: number): boolean {
  if (!lastSuccessAt) return true;
  const last = new Date(lastSuccessAt).getTime();
  if (Number.isNaN(last)) return true;
  const intervalMs = Math.max(1, intervalMinutes) * 60_000;
  return nowMs - last >= intervalMs;
}

/** Falha da API da Meta em uma frase curta, com o código que a Meta informou. */
export function describeGraphError(body: unknown): string {
  const record = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const nested = (record["error"] && typeof record["error"] === "object" ? record["error"] : record) as Record<string, unknown>;
  const message = text(nested["message"]) ?? text(record["message"]) ?? "resposta inesperada da API da Meta";
  const code = typeof nested["code"] === "number" ? nested["code"] : null;

  const reason =
    code === 190
      ? "o token do Instagram expirou ou ficou inválido"
      : code === 613
        ? "o Instagram limitou temporariamente as requisições"
        : code === 4 || code === 17 || code === 32
          ? "a API da Meta limitou as requisições"
          : code === 10 || code === 200
            ? "a permissão para ler as publicações não foi concedida"
            : null;

  return reason ? `${reason} (código ${code ?? "não informado"})` : `${message}${code !== null ? ` (código ${code})` : ""}`;
}

/** O feed só pode buscar quando há token e conta para ler. */
export function isFeedConfigured(env: Record<string, string | undefined>): boolean {
  const token = text(env["INSTAGRAM_ACCESS_TOKEN"]);
  const account = text(env["INSTAGRAM_ACCOUNT_ID"]) ?? text(env["INSTAGRAM_PAGE_ID"]);
  return Boolean(token && account);
}

/** Minutos entre uma busca e outra. Configuração inválida volta para o padrão. */
export function syncIntervalMinutes(raw: string | undefined): number {
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 1) return 30;
  return Math.min(Math.trunc(parsed), 1440);
}

/** Quantas publicações buscar por vez (a API aceita de 1 a 50). */
export function syncLimit(raw: string | undefined): number {
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 1) return 12;
  return Math.min(Math.trunc(parsed), 50);
}

export const INSTAGRAM_PROFILE = "https://www.instagram.com/grupokuriharaefigueiredo/";
