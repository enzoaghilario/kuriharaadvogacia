import { useEffect } from "react";

const SCRIPT_ID = "typebot-bubble-script";

/** Esconde o selo "Made with Typebot" que vive dentro do shadow DOM do balão. */
function hideTypebotBadge() {
  const bubble = document.querySelector("typebot-bubble");
  const root = bubble?.shadowRoot;
  if (!root) return false;
  let found = false;
  root.querySelectorAll("typebot-badge, a[href*='typebot.io']").forEach((el) => {
    (el as HTMLElement).style.display = "none";
    found = true;
  });
  root.querySelectorAll("*").forEach((el) => {
    if (el.children.length === 0 && (el.textContent || "").toLowerCase().includes("made with typebot")) {
      const host = (el.closest("a, div, span") ?? el) as HTMLElement;
      host.style.display = "none";
      found = true;
    }
  });
  return found;
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
