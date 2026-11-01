# Kurihara & Figueiredo Advogados Associados — site institucional

Site institucional completo (dark/serious legal identity, PT-BR) construído com TanStack Start v1.

## Stack

- **Framework:** TanStack Start v1 (React 19, SSR + server functions, TanStack Router/Query)
- **Build:** Vite 7 + Nitro (config em `vite.config.ts`, plugin `@lovable.dev/vite-tanstack-config` — pacote público no npm)
- **Estilo:** Tailwind CSS v4 (`src/styles.css`, tokens semânticos, tema escuro padrão + claro)
- **Backend:** Supabase (Lovable Cloud) — Postgres + RLS, clientes gerados em `src/integrations/supabase/`
- **Testes:** Vitest + Testing Library (`src/test/`)

## Comandos

```bash
npm install        # ou: bun install
npm run dev        # dev server (http://localhost:8080)
npm run build      # build de produção
npm run test       # roda toda a suíte de testes
```

Use Node 20+. Não edite `src/routeTree.gen.ts` (gerado automaticamente pelo router plugin).

## Variáveis de ambiente (arquivo `.env` incluído no pacote)

```
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
VITE_SUPABASE_PROJECT_ID=
SUPABASE_URL=
SUPABASE_PUBLISHABLE_KEY=
SUPABASE_PROJECT_ID=
```

A chave incluída é a publishable (anon) — pública por design, vai no bundle do cliente. Não há chave de service role neste projeto; operações privilegiadas usam o cliente admin apenas server-side.

## Regras do projeto (obrigatórias)

- Monte o balão Typebot uma única vez no root compartilhado (`src/routes/__root.tsx`) com efeito browser-only, nunca durante SSR.
- Formulário "Seja Parceiro": entrega exclusivamente por e-mail, zero armazenamento (nada de banco, localStorage ou cookies); limpar estado após sucesso confirmado.
- Paleta e estilos de interação ficam em tokens CSS semânticos em `src/styles.css`; componentes usam classes de papel, nunca cores literais (`bg-[#...]`, `text-white`).
- Feed do Instagram lê apenas linhas de `public.instagram_posts`; o único escritor é a rota agendada `/api/public/jobs/instagram-sync`. Nunca mostrar posts inventados quando a API da Meta falha.
- Não inventar: e-mail, ano de fundação, tamanho da equipe, artigos, dados da OAB, perguntas/answers de FAQ.
- Nunca prometer resultados; sem clichês de martelo/balança.

## Estrutura essencial

```
src/routes/            rotas (index, escritorio, atuacao, conteudos, contato, seja-parceiro, privacidade)
src/components/        Header, Footer, TypebotChat, ContactForm, PartnerForm, LegalNews, InstagramFeed, etc.
src/content/           conteúdo textual do site (site.ts, areas.ts)
src/lib/               máscaras/validação (masks.ts, partner-schema.ts), instagram-core/server, news
src/integrations/supabase/  clientes gerados — NÃO editar
src/test/              testes (Vitest)
supabase/              config do projeto
```

## Notas de deploy

- Server functions: `createServerFn` de `@tanstack/react-start`. Rotas públicas externas: `src/routes/api/public/*`.
- O feed de notícias (Jornal Jurídico) busca Google News RSS server-side com fallback Bing.
- O agendamento do sync do Instagram (cron 30 min) é provisionado pela plataforma Lovable; fora dela, configure um cron que chame a rota `/api/public/jobs/instagram-sync`.
