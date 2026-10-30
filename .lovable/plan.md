# Logo preta integrada à entrada, sem contorno branco

## Problema
Hoje a logo preta fica dentro de um retângulo claro recortado sobre o fundo escuro — parece um adesivo colado.

## Solução
- **A entrada inteira vira um campo claro (tom papel/marfim)**, não só um retângulo atrás da logo. Assim a logo preta original fica sobre o fundo dela sem nenhum contorno.
- Na parte de baixo da entrada, o tom claro **se dissolve num degradê suave para o azul escuro** do resto do site, unindo as duas partes sem corte.
- Detalhes em dourado discreto (fio fino abaixo do nome, botões) ligam a entrada ao restante.
- Nome, subtítulo e botões passam para tons escuros (grafite/azul) para ler bem no claro.
- **Logo segue independente com todos os efeitos:** gravação da esquerda para a direita com a linha de luz dourada, brilho dourado nas letras e respiração própria (mais forte que a da seção).

Quem tem "reduzir movimento" ativado vê tudo pronto, sem animação.

## Detalhes técnicos
- `src/routes/index.tsx`: hero recebe classe `hero-light` (fundo `--logo-ground` + gradiente inferior para `--background`); textos usam tokens escuros dedicados; logo `<img>` mantida.
- `src/styles.css`: remover fundo/padding do `.hero-logo-stage`; criar tokens `--hero-ink`, `--hero-ink-muted` e utilitário `hero-light`; manter keyframes atuais.
