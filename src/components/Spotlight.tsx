import { useEffect, useRef, type ReactNode } from "react";

// Brilho ambiente sobre a grade: no desktop um ponto de luz dourado segue o
// mouse; em telas de toque o CSS fixa o brilho na base da grade (sem cursor).
export function Spotlight({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const onMove = (ev: MouseEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--spot-x", `${ev.clientX - r.left}px`);
      el.style.setProperty("--spot-y", `${ev.clientY - r.top}px`);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div ref={ref} className={`spotlight ${className}`}>
      <div aria-hidden className="spotlight-glow" />
      {children}
    </div>
  );
}
