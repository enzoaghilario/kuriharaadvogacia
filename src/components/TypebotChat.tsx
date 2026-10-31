import { useEffect } from "react";

const SCRIPT_ID = "typebot-bubble-script";

export function TypebotChat() {
  useEffect(() => {
    if (document.getElementById(SCRIPT_ID)) return;

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.type = "module";
    script.textContent = `
      import Typebot from 'https://cdn.jsdelivr.net/npm/@typebot.io/js@0/dist/web.js';
      if (document.getElementById('${SCRIPT_ID}')) {
        Typebot.initBubble({
          typebot: 'my-typebot-8fqmxb7',
          theme: {
            button: { backgroundColor: '#1D1D1D' },
            chatWindow: { backgroundColor: '#F8F8F8' },
          },
        });
      }
    `;
    document.body.append(script);

    return () => {
      script.remove();
      document.querySelector("typebot-bubble")?.remove();
    };
  }, []);

  return null;
}