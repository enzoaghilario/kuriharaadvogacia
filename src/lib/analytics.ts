export const CONSENT_KEY = "consentimento-analise";
export type Consent = "aceito" | "recusado";
export type AnalyticsIds = { ga: string; clarity: string };

export function readConsent(): Consent | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "aceito" || v === "recusado" ? v : null;
  } catch {
    return null;
  }
}

export function saveConsent(v: Consent) {
  try {
    localStorage.setItem(CONSENT_KEY, v);
  } catch {
    /* ignore */
  }
}

type W = Window & { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void; clarity?: unknown };

/** Injeta GA4/Clarity somente com ID preenchido e consentimento "aceito". Chamar só no navegador. */
export function loadAnalytics(ids: AnalyticsIds, consent: Consent | null) {
  if (consent !== "aceito") return;
  const w = window as W;
  if (ids.ga && !document.getElementById("ga4-script")) {
    const s = document.createElement("script");
    s.id = "ga4-script";
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ids.ga)}`;
    document.head.appendChild(s);
    w.dataLayer = w.dataLayer || [];
    w.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      w.dataLayer!.push(arguments);
    };
    w.gtag("js", new Date());
    w.gtag("config", ids.ga, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
  }
  if (ids.clarity && !document.getElementById("clarity-script")) {
    // Snippet oficial do Microsoft Clarity.
    type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[] };
    const c = w as unknown as { clarity?: ClarityFn };
    if (!c.clarity) {
      const fn: ClarityFn = (...args: unknown[]) => {
        (fn.q ||= []).push(args);
      };
      c.clarity = fn;
    }
    const s = document.createElement("script");
    s.id = "clarity-script";
    s.async = true;
    s.src = `https://www.clarity.ms/tag/${encodeURIComponent(ids.clarity)}`;
    document.head.appendChild(s);
  }
}
