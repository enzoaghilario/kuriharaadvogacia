// Autenticação da rota agendada do Instagram.
//
// Após a migração do Lovable, o segredo pode vir como CRON_SECRET.
// LOVABLE_CRON_SECRET continua aceito para não quebrar implantações já publicadas.
import { createHash, timingSafeEqual } from "node:crypto";

type Secrets = { current: string | undefined; previous: string | undefined };

function readSecrets(): Secrets {
  const env = process.env as unknown as Record<string, string | undefined>;
  return {
    current: env["CRON_SECRET"]?.trim() || env["LOVABLE_CRON_SECRET"]?.trim(),
    previous: env["CRON_SECRET_PREVIOUS"]?.trim() || env["LOVABLE_CRON_SECRET_PREVIOUS"]?.trim(),
  };
}

/**
 * Devolve null quando a chamada está autorizada.
 * Devolve uma resposta de erro quando não está: 500 sem segredo configurado, 401 com segredo errado.
 */
export async function authenticateCronRequest(request: Request): Promise<Response | null> {
  const { current, previous } = readSecrets();

  if (!current) {
    return new Response("Server configuration error", { status: 500 });
  }

  const match = /^Bearer ([^\s,]+)$/.exec(request.headers.get("authorization") ?? "");
  const token = match?.[1];
  if (!token) {
    return new Response("Unauthorized", { status: 401 });
  }

  const digest = (value: string) => createHash("sha256").update(value, "utf8").digest();
  const provided = digest(token);
  const matches = (secret: string | undefined) =>
    secret ? timingSafeEqual(provided, digest(secret)) : false;

  if (!matches(current) && !matches(previous)) {
    return new Response("Unauthorized", { status: 401 });
  }

  return null;
}
