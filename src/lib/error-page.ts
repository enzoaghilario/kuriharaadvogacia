// Página de erro do servidor (SSR).
// Arquivo único, sem build: as cores seguem os mesmos tokens de src/styles.css.
export function renderErrorPage(): string {
  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>Não foi possível carregar esta página | Kurihara &amp; Figueiredo</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      :root { color-scheme: dark; }
      body {
        font: 15px/1.6 "Manrope", system-ui, -apple-system, sans-serif;
        background: oklch(0.205 0.025 258);
        color: oklch(0.94 0.013 85);
        display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem;
      }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-family: "Playfair Display", Georgia, serif; font-weight: 500; font-size: 1.5rem; margin: 0 0 0.75rem; }
      p { color: oklch(0.77 0.012 85); margin: 0 0 1.75rem; }
      .actions { display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; }
      a, button {
        padding: 0.75rem 1.25rem; border-radius: 2px; font: inherit; cursor: pointer;
        text-decoration: none; border: 1px solid transparent;
        font-size: 0.78rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase;
      }
      .primary { background: oklch(0.78 0.083 82); color: oklch(0.205 0.025 258); }
      .primary:hover { background: oklch(0.94 0.013 85); }
      .secondary { background: transparent; color: oklch(0.94 0.013 85); border-color: oklch(0.37 0.019 258); }
      .secondary:hover { border-color: oklch(0.78 0.083 82); color: oklch(0.78 0.083 82); }
      :focus-visible { outline: 2px solid oklch(0.78 0.083 82); outline-offset: 3px; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Esta página não carregou</h1>
      <p>Algo deu errado do nosso lado. Você pode tentar carregar de novo ou voltar ao início.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Tentar de novo</button>
        <a class="secondary" href="/">Voltar ao início</a>
      </div>
    </div>
  </body>
</html>`;
}
