import { useEffect } from "react";

const SCRIPT_ID = "typebot-bubble-script";

/**
 * Ícone do balão: aspas tipográficas em azul-marinho.
 * O símbolo padrão do Typebot é uma bolha de conversa que lembrava o
 * ícone do WhatsApp; as aspas combinam com a identidade sóbria do site.
 */
const BUBBLE_ICON_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">' +
  '<g fill="#070a5a">' +
  '<circle cx="8.4" cy="8.6" r="4"/>' +
  '<path d="M5.0 10.6 L9.6 11.6 L4.2 17.8 Z"/>' +
  '<circle cx="17.4" cy="8.6" r="4"/>' +
  '<path d="M14.0 10.6 L18.6 11.6 L13.2 17.8 Z"/>' +
  "</g></svg>";

/**
 * Esconde o selo "Made with Typebot" que vive dentro do shadow DOM do balão.
 * O Typebot reescreve o estilo inline do selo, então injetamos uma folha de
 * estilo com !important dentro do próprio shadow root — ela vence o inline.
 */
function hideTypebotBadge() {
  const bubble = document.querySelector("typebot-bubble");
  const root = bubble?.shadowRoot;
  if (!root || root.getElementById("kf-hide-typebot-badge")) return;
  const style = document.createElement("style");
  style.id = "kf-hide-typebot-badge";
  style.textContent =
    "a.lite-badge, typebot-badge, a[href*='typebot.io'] { display: none !important; }" +
    /* Caixa de texto e botão Enviar mais compactos. */
    ".typebot-input-form .typebot-input { min-height: 0 !important; padding: 0 4px !important; }" +
    ".typebot-input-form input, .typebot-input-form textarea { font-size: 13px !important; padding: 6px 8px !important; min-height: 0 !important; }" +
    ".typebot-input-form .typebot-button { font-size: 13px !important; padding: 4px 12px !important; min-height: 0 !important; height: 32px !important; }" +
    /* No celular: balão menor e mais alto para não cobrir os botões de contato. */
    "@media (max-width: 640px) {" +
    "div[class*='fixed'][class*='right-5'] {" +
    "--container-bottom: 96px !important;" +
    "--button-size: 44px !important;" +
    "--bot-max-height: 80dvh !important;" +
    "}" +
    "}";
  root.append(style);
}

export function TypebotChat() {
  useEffect(() => {
    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.type = "module";
      script.textContent = `
        import Typebot from 'https://cdn.jsdelivr.net/npm/@typebot.io/js@0.10.11/dist/web.js';
        if (document.getElementById('${SCRIPT_ID}')) {
          window.__kfTypebot = Typebot;
          Typebot.initBubble({
            typebot: 'my-typebot-8fqmxb7',
            onOpen: () => window.dispatchEvent(new CustomEvent('kf-chat', { detail: true })),
            onClose: () => window.dispatchEvent(new CustomEvent('kf-chat', { detail: false })),
            theme: {
              button: {
                backgroundColor: '#D2B379',
                iconColor: '#070a5a',
                customIconSrc: 'data:image/svg+xml;base64,${btoa(BUBBLE_ICON_SVG)}',
              },
              chatWindow: { backgroundColor: '#070a5a' },
            },
          });
        }
      `;
      document.body.append(script);
    }

    // O selo é renderizado de forma tardia dentro do shadow DOM; observa até esconder.
    const observer = new MutationObserver(() => {
      hideTypebotBadge();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    const interval = window.setInterval(hideTypebotBadge, 1500);
    hideTypebotBadge();

    // No celular: fundo escuro bloqueia toques acidentais nos botões do site.
    const backdrop = document.createElement("div");
    backdrop.className = "kf-chat-backdrop";
    backdrop.setAttribute("aria-hidden", "true");
    backdrop.addEventListener("click", () => {
      (window as unknown as { __kfTypebot?: { close: () => void } }).__kfTypebot?.close();
    });
    const onChat = (e: Event) => {
      const open = (e as CustomEvent<boolean>).detail;
      if (open && window.matchMedia("(max-width: 640px)").matches) {
        document.body.append(backdrop);
        document.documentElement.classList.add("kf-chat-open");
      } else {
        backdrop.remove();
        document.documentElement.classList.remove("kf-chat-open");
      }
    };
    window.addEventListener("kf-chat", onChat);

    return () => {
      window.removeEventListener("kf-chat", onChat);
      backdrop.remove();
      document.documentElement.classList.remove("kf-chat-open");
      observer.disconnect();
      window.clearInterval(interval);
      document.getElementById(SCRIPT_ID)?.remove();
      document.querySelector("typebot-bubble")?.remove();
    };
  }, []);

  return null;
}
