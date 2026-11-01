# Chat no celular sem toques acidentais

## Problema
Com o chat aberto no celular, os botões "WhatsApp" e "Ligar agora" continuam visíveis e clicáveis ao redor da janela. Um toque fora da caixa pode abrir o WhatsApp ou uma ligação sem querer.

## O que muda (só no celular)
1. **Fundo escurecido enquanto o chat está aberto**: uma camada escura cobre o site atrás da janela. Os botões ficam apagados e não respondem ao toque.
2. **Tocar no fundo escuro fecha o chat**: o mesmo gesto que a pessoa já espera de outros apps.
3. **Janela ocupando quase toda a tela**, com margens pequenas, para não sobrar área do site exposta perto dos dedos.
4. **A rolagem do site trava** enquanto o chat está aberto, para a página não se mexer por baixo.
5. Ao fechar o chat, tudo volta ao normal. No computador nada muda.

## Detalhes técnicos
- Em `TypebotChat.tsx`, escutar os eventos `onOpen`/`onClose` do `Typebot.initBubble` (disparados via `window` CustomEvent) para saber quando a janela abre.
- Ao abrir em telas ≤ 640px: inserir uma div fixa de fundo (token `--background` com opacidade, `z-index` logo abaixo do balão) e adicionar uma classe em `html` que aplica `overflow: hidden`.
- Clique no fundo chama `Typebot.close()`.
- No shadow root, ajustar `--bot-max-height` e largura para ~92dvh / 94vw no celular.
- Verificar com Playwright em 393px: abrir chat, tocar onde estava o botão do WhatsApp e confirmar que nada abre e que o chat fecha.
