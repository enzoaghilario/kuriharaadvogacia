# Nova entrada da página inicial

## O que muda
- **Fim do bloco claro atrás da logo.** A logo deixa de ficar "recortada" num retângulo branco e passa a fazer parte do fundo escuro.
- **Logo em dourado metálico.** Usando o próprio arquivo da logo como molde (sem redesenhar letras), ela aparece preenchida com dourado escovado, combinando com os detalhes do site.
- **Fundo com profundidade:** azul profundo com um halo dourado muito suave atrás da logo, leve textura de grão e uma vinheta escura nas bordas — sério, nada de efeito chamativo.

## Animação de entrada (cerca de 4s)
1. A tela começa escura; um fio dourado fino se desenha na horizontal, no centro.
2. O fio se abre como uma fresta de luz e a logo surge de dentro dele, vindo levemente de trás (profundidade 3D, sem giro exagerado).
3. Um brilho dourado atravessa as letras uma vez, como luz batendo em metal gravado.
4. Nome, subtítulo, texto e botões sobem em sequência.
5. Depois: respiração suave contínua da seção e da logo (mantida), um reflexo dourado discreto passando a cada ~10s e um leve acompanhamento do mouse (parallax sutil) no computador.

Quem tem "reduzir movimento" ativado no aparelho vê tudo pronto, sem animação.

## Observação
Isso substitui a regra anterior de manter a logo preta sobre fundo claro; atualizo essa preferência na memória do projeto.

## Detalhes técnicos
- `src/routes/index.tsx`: remover `<img>` visível; usar `<div role="img" aria-label>` com `mask-image: url(logo)` e fundo em gradiente dourado; adicionar camadas do fio de luz, halo e grão; pequeno handler de pointermove (variáveis CSS, desativado em toque/reduced-motion).
- `src/styles.css`: remover `--logo-ground` do stage; novos keyframes (hero-thread, hero-aperture, hero-metal-sweep), manter hero-sway/hero-breathe; tokens `--gold-metal` gradient.
- Atualizar `mem://index.md` (logo agora em dourado sobre escuro na entrada) e DESIGN.md.
