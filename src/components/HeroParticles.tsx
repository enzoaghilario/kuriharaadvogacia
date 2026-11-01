import { useEffect, useRef } from "react";

// Fundo de partículas douradas do hero. Performance primeiro:
// - mobile/tablet: no máximo 18 partículas e nenhuma interação de toque;
// - desktop: até 64 partículas com leve desvio do mouse (sem física pesada);
// - pausa fora da tela, respeita prefers-reduced-motion e limita o DPR a 1.5.
type Particle = { x: number; y: number; vx: number; vy: number; r: number; a: number };

export function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const hasMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = false;
    let particles: Particle[] = [];
    const mouse = { x: -9999, y: -9999 };

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = hasMouse ? 64 : 18;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.14,
        r: 0.8 + Math.random() * 1.8,
        a: 0.15 + Math.random() * 0.35,
      }));
    }

    function frame() {
      if (!running || !ctx) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        // Desktop: desvio suave do mouse, sem simulação de física.
        if (hasMouse) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 14400 && d2 > 0.01) {
            const d = Math.sqrt(d2);
            p.vx += (dx / d) * 0.02;
            p.vy += (dy / d) * 0.02;
          }
          p.vx *= 0.985;
          p.vy *= 0.985;
        }
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210, 179, 121, ${p.a})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Só anima enquanto o hero está visível — rolagem 100% fluida.
    const io = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) start();
      else stop();
    });
    io.observe(canvas);

    const onMove = hasMouse
      ? (ev: MouseEvent) => {
          const rect = canvas.getBoundingClientRect();
          mouse.x = ev.clientX - rect.left;
          mouse.y = ev.clientY - rect.top;
        }
      : null;
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    if (onMove) {
      canvas.addEventListener("mousemove", onMove);
      canvas.addEventListener("mouseleave", onLeave);
    }

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      if (onMove) {
        canvas.removeEventListener("mousemove", onMove);
        canvas.removeEventListener("mouseleave", onLeave);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-auto absolute inset-0 -z-10 h-full w-full"
    />
  );
}
