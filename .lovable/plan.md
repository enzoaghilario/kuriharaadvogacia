# Logo branca sobre o fundo escuro, sem contorno

## O que muda
- **Sai o retângulo/contorno claro** atrás da logo.
- **A logo fica branca**, direto sobre o mesmo fundo escuro atual. Letras e formato idênticos ao arquivo original (só a cor muda, nada redesenhado).
- O fundo e o restante da entrada continuam iguais.
- **A logo segue independente com os efeitos:** gravação da esquerda para a direita com a linha de luz dourada, brilho dourado passando pelas letras e respiração própria (um pouco mais forte que a da seção).

Quem tem "reduzir movimento" ativado vê tudo pronto, sem animação.

## Detalhes técnicos
- `src/styles.css`: remover `background: var(--logo-ground)` e o padding do `.hero-logo-stage`; aplicar `filter: brightness(0) invert(1)` na logo (combinado com o drop-shadow das animações de respiração); o brilho dourado já usa máscara da logo e continua funcionando.
- `mem://index.md`: registrar que na entrada a logo aparece em branco sobre o escuro.
