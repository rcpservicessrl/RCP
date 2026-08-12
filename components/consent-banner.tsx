"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/types";

type Consent = "essential" | "analytics" | null;

export function ConsentBanner({ locale }: { locale: Locale }) {
  const [consent, setConsent] = useState<Consent>("essential");

  useEffect(() => {
    const stored = localStorage.getItem("rcp-consent-v2");
    setConsent(stored === "essential" || stored === "analytics" ? stored : null);
  }, []);

  const save = (next: Exclude<Consent, null>) => {
    localStorage.setItem("rcp-consent-v2", next);
    setConsent(next);
    window.dispatchEvent(new CustomEvent("rcp:consent", { detail: next }));
  };

  if (consent) return null;

  return (
    <aside className="consent-banner" aria-label={locale === "es" ? "Preferencias de privacidad" : "Privacy preferences"}>
      <div>
        <strong>{locale === "es" ? "Tu experiencia, bajo tu control." : "Your experience, under your control."}</strong>
        <p>{locale === "es" ? "Guardamos tema, idioma y música en este dispositivo. La analítica solo se activa con tu permiso." : "We save theme, language and music on this device. Analytics only activates with your permission."} <Link href={locale === "es" ? "/cookies" : "/en/cookies"}>{locale === "es" ? "Ver política" : "View policy"}</Link>.</p>
      </div>
      <div className="consent-banner__actions">
        <button type="button" className="button button--secondary" onClick={() => save("essential")}>{locale === "es" ? "Solo esenciales" : "Essential only"}</button>
        <button type="button" className="button button--primary" onClick={() => save("analytics")}>{locale === "es" ? "Aceptar analítica" : "Accept analytics"}</button>
      </div>
    </aside>
  );
}
