// Servidor: busca publicações na API oficial da Meta e grava no banco do site.
// Este módulo só roda no servidor — é importado de dentro de handlers.
import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/types";
import {
  dedupeAndSort,
  describeGraphError,
  isFeedConfigured,
  normalizeGraphMedia,
  parseGraphList,
  shouldRefresh,
  syncIntervalMinutes,
  syncLimit,
  type InstagramPost,
} from "./instagram-core";

const GRAPH_BASE = "https://graph.facebook.com/v21.0";
const MEDIA_FIELDS =
  "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count,children{fields=id,media_type,media_url,thumbnail_url,permalink,timestamp}";
const MAX_PAGES = 5;
const LOCK_MS = 90_000;

export type FeedStatus = {
  configured: boolean;
  lastSuccessAt: string | null;
  posts: number;
};

function readEnv(): Record<string, string | undefined> {
  return process.env as unknown as Record<string, string | undefined>;
}

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

function publicClient() {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("Backend não configurado");
  return createClient<Database>(url, key, {
    auth: { persistSession: false },
    // Chaves sb_ não são JWTs: vão como apikey, não como bearer.
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) headers.delete("Authorization");
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

type GraphResult = { ok: true; body: unknown } | { ok: false; message: string };

async function graphJson(url: string): Promise<GraphResult> {
  let response: Response;
  try {
    response = await fetch(url, { headers: { Accept: "application/json" } });
  } catch (cause) {
    return { ok: false, message: `a API da Meta não respondeu (${String(cause)})` };
  }

  const raw = await response.text();
  let body: unknown = null;
  try {
    body = raw ? JSON.parse(raw) : null;
  } catch {
    body = null;
  }

  if (!response.ok) {
    const message = describeGraphError(body ?? raw);
    console.error(`Instagram Graph API falhou [${response.status}]: ${message}`);
    return { ok: false, message };
  }
  return { ok: true, body };
}

async function markState(patch: Record<string, unknown>): Promise<void> {
  const supabaseAdmin = await admin();
  const { error } = await supabaseAdmin.from("instagram_state").upsert({ id: 1, ...patch }, { onConflict: "id" });
  if (error) console.error("instagram_state:", error.message);
}

/** ID da conta: vem direto da configuração ou é lido a partir da página da Meta. */
async function resolveAccountId(token: string, env: Record<string, string | undefined>): Promise<string | null> {
  const direct = env.INSTAGRAM_ACCOUNT_ID?.trim();
  if (direct) return direct;

  const page = env.INSTAGRAM_PAGE_ID?.trim();
  if (!page) return null;

  const url = new URL(`${GRAPH_BASE}/${encodeURIComponent(page)}`);
  url.searchParams.set("fields", "instagram_business_account{id}");
  url.searchParams.set("access_token", token);

  const result = await graphJson(url.toString());
  if (!result.ok) return null;
  const account = (result.body as { instagram_business_account?: { id?: unknown } })?.instagram_business_account;
  return typeof account?.id === "string" && account.id ? account.id : null;
}

async function fetchMedia(token: string, accountId: string, limit: number) {
  const first = new URL(`${GRAPH_BASE}/${encodeURIComponent(accountId)}/media`);
  first.searchParams.set("fields", MEDIA_FIELDS);
  first.searchParams.set("limit", String(limit));
  first.searchParams.set("access_token", token);

  const collected: InstagramPost[] = [];
  let url: string | null = first.toString();

  for (let page = 0; page < MAX_PAGES && url; page += 1) {
    const result = await graphJson(url);
    if (!result.ok) return { posts: collected, complete: false, error: result.message };

    const body = result.body as { data?: unknown; paging?: { next?: unknown } } | null;
    for (const raw of parseGraphList(body)) {
      const post = normalizeGraphMedia(raw);
      if (post) collected.push(post);
    }

    const next = body?.paging?.next;
    url = typeof next === "string" && next.startsWith("http") ? next : null;
  }

  return { posts: collected, complete: url === null, error: null as string | null };
}

/** Busca as publicações mais recentes na Meta e grava no banco, sem duplicar. */
export async function syncInstagramFeed(): Promise<{ ok: boolean; posts: number; error: string | null }> {
  const env = readEnv();

  if (!isFeedConfigured(env)) {
    const message = "integração ainda não conectada: faltam o token e a conta do Instagram";
    await markState({ status: "not_configured", last_error: message });
    return { ok: false, posts: 0, error: message };
  }

  const token = env.INSTAGRAM_ACCESS_TOKEN!.trim();
  await markState({ status: "running", last_attempt_at: new Date().toISOString() });

  const accountId = await resolveAccountId(token, env);
  if (!accountId) {
    const message = "não foi possível identificar a conta do Instagram do escritório";
    await markState({ status: "error", last_error: message });
    return { ok: false, posts: 0, error: message };
  }

  const limit = syncLimit(env.INSTAGRAM_SYNC_LIMIT);
  const fetched = await fetchMedia(token, accountId, limit);

  if (fetched.error) {
    await markState({ status: "error", last_error: fetched.error });
    return { ok: false, posts: 0, error: fetched.error };
  }

  const posts = dedupeAndSort(fetched.posts);
  const supabaseAdmin = await admin();

  if (posts.length) {
    const { error } = await supabaseAdmin.from("instagram_posts").upsert(
      posts.map((post) => ({
        id: post.id,
        permalink: post.permalink,
        caption: post.caption,
        media_type: post.mediaType,
        image_url: post.imageUrl,
        published_at: post.publishedAt,
        like_count: post.likeCount,
        comments_count: post.commentsCount,
        synced_at: new Date().toISOString(),
      })),
    );
    if (error) {
      console.error("gravação em instagram_posts:", error.message);
      await markState({ status: "error", last_error: error.message });
      return { ok: false, posts: 0, error: error.message };
    }
  }

  // Só remove publicações que saíram do Instagram quando a lista recebida é a completa.
  if (fetched.complete && posts.length) {
    const ids = posts.map((post) => post.id);
    const { error } = await supabaseAdmin.from("instagram_posts").delete().not("id", "in", `(${ids.join(",")})`);
    if (error) console.error("limpeza de publicações removidas:", error.message);
  }

  const message = `última atualização em ${new Date().toISOString()}`;
  await markState({ status: "ok", last_error: null, last_success_at: new Date().toISOString(), posts_count: posts.length });
  console.log(`Instagram: ${posts.length} publicações sincronizadas. ${message}`);

  return { ok: true, posts: posts.length, error: null };
}

/** Atualiza o feed quando o intervalo venceu, sem deixar duas buscas correrem juntas. */
export async function ensureFreshInstagramFeed(): Promise<void> {
  const env = readEnv();
  const interval = syncIntervalMinutes(env.INSTAGRAM_SYNC_INTERVAL_MINUTES);
  const supabaseAdmin = await admin();

  const { data } = await supabaseAdmin
    .from("instagram_state")
    .select("status, last_success_at, last_attempt_at")
    .eq("id", 1)
    .maybeSingle();

  const now = Date.now();
  if (!shouldRefresh(data?.last_success_at ?? null, now, interval)) return;

  const lastAttempt = data?.last_attempt_at ? new Date(data.last_attempt_at).getTime() : 0;
  if (data?.status === "running" && now - lastAttempt < LOCK_MS) return;

  await syncInstagramFeed();
}

/** Lê o que está no banco. Nada é inventado quando o feed ainda não foi conectado. */
export async function readInstagramFeed(): Promise<{ posts: InstagramPost[]; status: FeedStatus }> {
  const env = readEnv();
  const supabase = publicClient();

  const [{ data: rows }, { data: state }] = await Promise.all([
    supabase
      .from("instagram_posts")
      .select("id, permalink, caption, media_type, image_url, published_at, like_count, comments_count")
      .order("published_at", { ascending: false })
      .limit(24),
    admin().then((client) => client.from("instagram_state").select("status, last_success_at").eq("id", 1).maybeSingle()),
  ]);

  const posts: InstagramPost[] = (rows ?? []).map((row) => ({
    id: row.id,
    permalink: row.permalink,
    caption: row.caption ?? null,
    mediaType: row.media_type,
    imageUrl: row.image_url ?? null,
    publishedAt: row.published_at,
    likeCount: row.like_count ?? null,
    commentsCount: row.comments_count ?? null,
  }));

  return {
    posts,
    status: {
      configured: isFeedConfigured(env),
      lastSuccessAt: state?.last_success_at ?? null,
      posts: posts.length,
    },
  };
}
