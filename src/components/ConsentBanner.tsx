import { useEffect, useState } from "react";
import { CLARITY_PROJECT_ID, GA_MEASUREMENT_ID } from "@/content/analytics";
import { loadAnalytics, readConsent, saveConsent, type AnalyticsIds } from "@/lib/analytics";

export function ConsentBanner({ ids = { ga: GA_MEASUREMENT_ID, clarity: CLARITY_PROJECT_ID } }: { ids?: AnalyticsIds }) {
  const enabled = Boolean(ids.ga || ids.clarity);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const c = readConsent();
    if (c) loadAnalytics(ids, c);
    else setShow(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ids.ga, ids.clarity]);

  if (!enabled || !show) return null;

  const choose = (v: "aceito" | "recusado") => {
    saveConsent(v);
    setShow(false);
    loadAnalytics(ids, v);
  };

  return (
    <div
      role="region"
      aria-label="Consentimento de cookies de análise"
      className="fixed bottom-4 left-4 right-20 z-40 max-w-md border border-border bg-card/95 p-4 text-sm text-muted-foreground shadow-lg backdrop-blur sm:right-auto"
    >
      <p>
        Usamos ferramentas de análise para entender como o site é usado, apenas com sua permissão.{" "}
        <a href="/privacidade" className="text-primary underline underline-offset-4">Saiba mais</a>.
      </p>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => choose("aceito")} className="min-h-11 bg-primary px-4 text-primary-foreground">
          Aceitar
        </button>
        <button type="button" onClick={() => choose("recusado")} className="min-h-11 border border-border px-4 text-foreground">
          Recusar
        </button>
      </div>
    </div>
  );
}
