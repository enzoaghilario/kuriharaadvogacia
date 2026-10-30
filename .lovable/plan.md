# Logo integrada à entrada, sem o contorno branco

## O que muda
- **Sai o retângulo/contorno branco** atrás da logo. Ela passa a ficar direto sobre o fundo escuro, junto com o resto da entrada.
- Como a logo original é preta e sumiria no escuro, ela aparece **na cor clara do texto do site (creme)**, usando o próprio arquivo como molde — letras e formato idênticos, nada redesenhado.
- **Continua independente e com os mesmos efeitos:** gravação da esquerda para a direita com a linha de luz dourada, brilho dourado passando pelas letras e a respiração própria (um pouco mais forte que a do resto da seção).
- Um halo dourado bem suave atrás dela para dar profundidade, sem formar caixa.

Quem tem "reduzir movimento" ativado vê tudo pronto, sem animação.

## Detalhes técnicos
- `src/routes/index.tsx`: trocar o `<img>` por `<div role="img" aria-label>` com `mask-image: url(logo)` preenchido com `--foreground`; manter `hero-logo-pen` e `hero-logo-gloss`.
- `src/styles.css`: remover `background: var(--logo-ground)` e o padding do `.hero-logo-stage`; aplicar as animações existentes (engrave, sway) ao novo elemento; halo via `::before` radial com `--bronze`.
- Atualizar `mem://index.md` (logo em tom claro sobre o escuro na entrada).
