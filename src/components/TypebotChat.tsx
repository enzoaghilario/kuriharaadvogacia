import { useEffect } from "react";
import { KF_MONOGRAM_SVG } from "@/lib/kf-monogram";
import { attachChatDrag } from "@/lib/chat-drag";

const SCRIPT_ID = "typebot-bubble-script";

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
    /* O monograma precisa de mais espaço que o padrão do Typebot. */
    "button[part='button'] img { width: 72% !important; height: auto !important; }" +
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

/** Eventos que indicam interação real — carregam o chat na hora. */
const INTERACTION_EVENTS = ["pointerdown", "keydown", "touchstart", "scroll"] as const;
/** Sem interação, o chat carrega quando o navegador fica ocioso após este tempo. */
const IDLE_DELAY_MS = 4000;

function loadTypebot() {
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
              customIconSrc: 'data:image/svg+xml;base64,${btoa(KF_MONOGRAM_SVG)}',
            },
            chatWindow: { backgroundColor: '#070a5a' },
          },
        });
      }
    `;
    document.body.append(script);
  }
}

export function TypebotChat() {
  useEffect(() => {
    // O Typebot (~160 KB) não é necessário para o primeiro carregamento:
    // adia até a primeira interação ou até o navegador ficar ocioso.
    let loaded = false;
    let idleHandle: number | undefined;
    const triggerLoad = () => {
      if (loaded) return;
      loaded = true;
      INTERACTION_EVENTS.forEach((ev) => window.removeEventListener(ev, triggerLoad));
      loadTypebot();
    };
    INTERACTION_EVENTS.forEach((ev) => window.addEventListener(ev, triggerLoad, { passive: true, once: true }));
    const delayTimer = window.setTimeout(() => {
      if ("requestIdleCallback" in window) {
        idleHandle = window.requestIdleCallback(triggerLoad, { timeout: 2000 });
      } else {
        triggerLoad();
      }
    }, IDLE_DELAY_MS);

    let dragButton: HTMLButtonElement | undefined;
    let detachDrag: (() => void) | undefined;
    const updateBubble = () => {
      hideTypebotBadge();
      const button = document.querySelector("typebot-bubble")?.shadowRoot?.querySelector<HTMLButtonElement>("button[part='button']");
      if (button && button !== dragButton) {
        detachDrag?.();
        dragButton = button;
        detachDrag = attachChatDrag(button);
      }
    };
    // O botão e o selo são renderizados de forma tardia dentro do shadow DOM.
    const observer = new MutationObserver(updateBubble);
    observer.observe(document.body, { childList: true, subtree: true });
    const interval = window.setInterval(updateBubble, 1500);
    updateBubble();

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
      INTERACTION_EVENTS.forEach((ev) => window.removeEventListener(ev, triggerLoad));
      window.clearTimeout(delayTimer);
      if (idleHandle !== undefined && "cancelIdleCallback" in window) window.cancelIdleCallback(idleHandle);
      detachDrag?.();
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
