import { useEffect, useRef, useState } from "react";
import { MapPin, Navigation, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { DIRECTIONS_URL, FULL_ADDRESS, MAPS_EMBED, MAPS_URL, SITE } from "@/content/site";
import type { LocationScene, LocationSceneInfo } from "./scene";

const INFO: LocationSceneInfo = {
  kind: "Escritório de advocacia",
  name: SITE.short,
  nameLine2: "Advogados Associados",
  street: SITE.street,
  cityLine: `${SITE.district} · ${SITE.city} — ${SITE.state}`,
  hours: SITE.hours.label,
  signs: [
    { sub: `${SITE.city} · ${SITE.district}`, title: "Siga em frente" },
    { sub: "Vire à direita", title: "R. Maria Liporini Meireles" },
  ],
  arrivedSub: `${SITE.street} · ${SITE.city}`,
  directionsUrl: DIRECTIONS_URL,
  whatsappUrl: SITE.whatsappHref,
  monogram: "K&F",
  facade: ["Kurihara & Figueiredo", "ADVOGADOS ASSOCIADOS"],
};

type Status = "idle" | "loading" | "ready" | "error";

/**
 * Localização animada: cidade 3D com a rota até o escritório.
 * Só carrega o Three.js quando a seção chega perto da tela, pausa fora dela,
 * respeita prefers-reduced-motion (quadro estático com botão para assistir) e
 * cai no mapa do Google se o WebGL não estiver disponível ou falhar.
 */
export function LocationShowcase({ className = "" }: { className?: string }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<LocationScene | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [sound, setSound] = useState(false);
  // Movimento reduzido no sistema: mostra o quadro parado até a pessoa pedir.
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let disposed = false;
    let started = false;
    let visible = false;
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setPaused(isReduced);

    const boot = async () => {
      started = true;
      setStatus("loading");
      try {
        const { createLocationScene } = await import("./scene");
        if (disposed) return;
        const engine = await createLocationScene(stage, {
          info: INFO,
          light: document.documentElement.classList.contains("light"),
          reducedMotion: isReduced,
          onError: (err) => {
            console.warn("Mapa 3D interrompido, usando o mapa do Google.", err);
            engineRef.current?.destroy();
            engineRef.current = null;
            if (!disposed) setStatus("error");
          },
        });
        if (disposed) {
          engine.destroy();
          return;
        }
        engineRef.current = engine;
        engine.setActive(visible);
        setStatus("ready");
      } catch (err) {
        console.warn("Mapa 3D indisponível, usando o mapa do Google.", err);
        if (!disposed) setStatus("error");
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (!entry) return;
        visible = entry.isIntersecting;
        if (visible && !started) void boot();
        engineRef.current?.setActive(visible);
      },
      { rootMargin: "240px 0px" },
    );
    io.observe(stage);

    const mo = new MutationObserver(() => {
      engineRef.current?.setTheme(document.documentElement.classList.contains("light"));
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      disposed = true;
      io.disconnect();
      mo.disconnect();
      engineRef.current?.destroy();
      engineRef.current = null;
    };
  }, []);

  const toggleSound = () => {
    const next = !sound;
    setSound(next);
    engineRef.current?.setSound(next);
    if (next) setPaused(false);
  };

  const play = () => {
    setPaused(false);
    engineRef.current?.play();
  };

  const restart = () => {
    setPaused(false);
    engineRef.current?.restart();
  };

  return (
    <figure className={`flex flex-col border bg-muted ${className}`}>
      <div
        ref={stageRef}
        className="locmap aspect-[4/5] w-full sm:aspect-[4/3]"
        role="img"
        aria-label={`Animação do mapa: rota até o escritório ${SITE.name}, ${FULL_ADDRESS}.`}
      >
        {status !== "ready" && status !== "error" && (
          <div className="absolute inset-0 grid place-items-center p-6 text-center">
            <div className="flex flex-col items-center gap-3">
              <MapPin className="text-bronze" size={34} aria-hidden />
              <p className="font-serif text-xl">{SITE.street}</p>
              <p className="text-sm text-muted-foreground">
                {SITE.district} · {SITE.city} — {SITE.state}
              </p>
              {status === "loading" && <p className="eyebrow mt-2 animate-pulse">Carregando mapa</p>}
            </div>
          </div>
        )}
        {status === "ready" && paused && (
          <button
            type="button"
            onClick={play}
            className="absolute bottom-4 left-1/2 z-10 inline-flex min-h-11 -translate-x-1/2 items-center gap-2 bg-primary px-5 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground shadow-lg hover:bg-graphite"
          >
            <Play size={14} aria-hidden />
            Ver o trajeto
          </button>
        )}
        {status === "error" && (
          <iframe
            title={`Mapa — ${SITE.name}`}
            src={MAPS_EMBED}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full grayscale-[60%]"
          />
        )}
      </div>
      <figcaption className="flex flex-wrap items-center gap-2 border-t bg-card p-3">
        <a
          href={DIRECTIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 bg-primary px-4 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground hover:bg-graphite"
        >
          <Navigation size={14} aria-hidden />
          Como chegar
        </a>
        <a
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center border border-foreground/30 px-4 text-xs font-semibold uppercase tracking-[0.16em] hover:border-bronze hover:text-bronze"
        >
          Abrir no Google Maps
        </a>
        {status === "ready" && (
          <span className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={restart}
              aria-label="Reiniciar animação"
              title="Reiniciar animação"
              className="grid h-11 w-11 place-items-center border hover:border-bronze hover:text-bronze"
            >
              <RotateCcw size={16} aria-hidden />
            </button>
            <button
              type="button"
              onClick={toggleSound}
              aria-pressed={sound}
              aria-label={sound ? "Desligar som" : "Ligar som"}
              title={sound ? "Desligar som" : "Ligar som"}
              className="grid h-11 w-11 place-items-center border hover:border-bronze hover:text-bronze"
            >
              {sound ? <Volume2 size={16} aria-hidden /> : <VolumeX size={16} aria-hidden />}
            </button>
          </span>
        )}
      </figcaption>
    </figure>
  );
}
