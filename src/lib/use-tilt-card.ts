import { useEffect, useRef } from "react";

// Inclinação 3D interativa apenas em dispositivos com mouse (hover + pointer
// fino). Em telas de toque, o efeito vira um brilho de borda que ganha
// destaque quando o card entra na tela (classe .in-view), sem interferir
// na rolagem.
export function useTiltCard<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const hasMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (!hasMouse) {
      const io = new IntersectionObserver(
        ([entry]) => el.classList.toggle("in-view", entry?.isIntersecting ?? false),
        { threshold: 0.35 },
      );
      io.observe(el);
      return () => io.disconnect();
    }

    const onMove = (ev: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (ev.clientX - r.left) / r.width - 0.5;
      const y = (ev.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg) translateY(-4px)`;
    };
    const onLeave = () => {
      el.style.transform = "";
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return ref;
}
