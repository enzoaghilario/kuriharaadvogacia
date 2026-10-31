import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [light, setLight] = useState(false);
  useEffect(() => setLight(document.documentElement.classList.contains("light")), []);

  const toggle = () => {
    const next = !light;
    setLight(next);
    document.documentElement.classList.toggle("light", next);
    try {
      localStorage.setItem("tema", next ? "claro" : "escuro");
    } catch {
      /* armazenamento indisponível */
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={light ? "Ativar modo escuro" : "Ativar modo claro"}
      title={light ? "Modo escuro" : "Modo claro"}
      className={`grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-bronze hover:text-bronze ${className}`}
    >
      {light ? <Moon size={16} strokeWidth={1.6} /> : <Sun size={16} strokeWidth={1.6} />}
    </button>
  );
}
