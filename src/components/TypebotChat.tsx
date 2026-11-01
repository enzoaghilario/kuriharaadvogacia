import { useEffect } from "react";

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
    /* No celular: balão menor e mais alto para não cobrir os botões de contato. */
    "@media (max-width: 640px) {" +
    "div[class*='fixed'][class*='right-5'] {" +
    "--container-bottom: 96px !important;" +
    "--button-size: 44px !important;" +
    "--bot-max-height: 62dvh !important;" +
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
        import Typebot from 'https://cdn.jsdelivr.net/npm/@typebot.io/js@0/dist/web.js';
        if (document.getElementById('${SCRIPT_ID}')) {
          Typebot.initBubble({
            typebot: 'my-typebot-8fqmxb7',
            theme: {
              button: { backgroundColor: '#D2B379', iconColor: '#101723', size: 'medium' },
              chatWindow: { backgroundColor: '#101723' },
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

    return () => {
      observer.disconnect();
      window.clearInterval(interval);
      document.getElementById(SCRIPT_ID)?.remove();
      document.querySelector("typebot-bubble")?.remove();
    };
  }, []);

  return null;
}
