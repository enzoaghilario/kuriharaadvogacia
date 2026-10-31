import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { authenticateCronRequest } from "@/lib/cron-auth";
import {
  ensureFreshInstagramFeed,
  readInstagramFeed,
  syncInstagramFeed,
} from "@/lib/instagram.server";

const BACKEND_VARS = [
  "SUPABASE_URL",
  "SUPABASE_PUBLISHABLE_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "INSTAGRAM_ACCESS_TOKEN",
  "INSTAGRAM_ACCOUNT_ID",
  "INSTAGRAM_PAGE_ID",
  "CRON_SECRET",
  "LOVABLE_CRON_SECRET",
];

const saved = new Map<string, string | undefined>();

beforeEach(() => {
  for (const key of BACKEND_VARS) {
    saved.set(key, process.env[key]);
    delete process.env[key];
  }
});

afterEach(() => {
  for (const [key, value] of saved) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  saved.clear();
});

describe("feed do Instagram sem backend configurado", () => {
  it("devolve lista vazia em vez de quebrar a página", async () => {
    const { posts, status } = await readInstagramFeed();

    expect(posts).toEqual([]);
    expect(status.configured).toBe(false);
    expect(status.lastSuccessAt).toBeNull();
  });

  it("não tenta atualizar o feed sozinho", async () => {
    await expect(ensureFreshInstagramFeed()).resolves.toBeUndefined();
  });

  it("explica que a integração ainda não está conectada", async () => {
    const result = await syncInstagramFeed();

    expect(result.ok).toBe(false);
    expect(result.posts).toBe(0);
    expect(result.error).toContain("token");
  });
});

describe("autenticação da rota agendada", () => {
  it("recusa a chamada quando não há segredo configurado", async () => {
    const response = await authenticateCronRequest(
      new Request("http://localhost/", { method: "POST" }),
    );

    expect(response?.status).toBe(500);
  });

  it("recusa a chamada sem header de autorização", async () => {
    process.env["CRON_SECRET"] = "segredo-de-teste";

    const response = await authenticateCronRequest(
      new Request("http://localhost/", { method: "POST" }),
    );

    expect(response?.status).toBe(401);
  });

  it("recusa a chamada com token errado", async () => {
    process.env["CRON_SECRET"] = "segredo-de-teste";

    const response = await authenticateCronRequest(
      new Request("http://localhost/", {
        method: "POST",
        headers: { Authorization: "Bearer outro-token" },
      }),
    );

    expect(response?.status).toBe(401);
  });

  it("aceita a chamada com o token correto", async () => {
    process.env["CRON_SECRET"] = "segredo-de-teste";

    const response = await authenticateCronRequest(
      new Request("http://localhost/", {
        method: "POST",
        headers: { Authorization: "Bearer segredo-de-teste" },
      }),
    );

    expect(response).toBeNull();
  });

  it("aceita também o nome antigo do segredo", async () => {
    process.env["LOVABLE_CRON_SECRET"] = "segredo-antigo";

    const response = await authenticateCronRequest(
      new Request("http://localhost/", {
        method: "POST",
        headers: { Authorization: "Bearer segredo-antigo" },
      }),
    );

    expect(response).toBeNull();
  });
});
