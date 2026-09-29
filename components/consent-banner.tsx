"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/types";
import { readPreference, writePreference } from "@/lib/browser-preferences";
import { WhatsAppIcon } from "@/components/icons";
import { publicContact } from "@/lib/public-contact";

type Consent = "essential" | "analytics" | null;

export function ConsentBanner({ locale }: { locale: Locale }) {
  const [consent, setConsent] = useState<Consent>("essential");

  useEffect(() => {
    const stored = readPreference("rcp-consent-v2");
    setConsent(stored === "essential" || stored === "analytics" ? stored : null);
  }, []);

  const save = (next: Exclude<Consent, null>) => {
    writePreference("rcp-consent-v2", next);
    setConsent(next);
    window.dispatchEvent(new CustomEvent("rcp:consent", { detail: next }));
  };

  if (consent) return null;

  return (
    <aside className="consent-banner" aria-label={locale === "es" ? "Preferencias de privacidad" : "Privacy preferences"}>
      <div>
        <div className="consent-banner__heading">
          <strong>{locale === "es" ? "Tu experiencia, bajo tu control." : "Your experience, under your control."}</strong>
          <a className="consent-whatsapp" href={publicContact.whatsappHref} target="_blank" rel="noopener noreferrer" aria-label={locale === "es" ? "Contactar a RCP por WhatsApp (abre en otra pestaña)" : "Contact RCP on WhatsApp (opens in a new tab)"}><WhatsAppIcon size={24} /></a>
        </div>
        <p>{locale === "es" ? "Guardamos tema, idioma y música en este dispositivo. La analítica solo se activa con tu permiso." : "We save theme, language and music on this device. Analytics only activates with your permission."} <Link href={locale === "es" ? "/cookies" : "/en/cookies"}>{locale === "es" ? "Ver política" : "View policy"}</Link>.</p>
      </div>
      <div className="consent-banner__actions">
        <button type="button" className="button button--secondary" onClick={() => save("essential")}>{locale === "es" ? "Solo esenciales" : "Essential only"}</button>
        <button type="button" className="button button--primary" onClick={() => save("analytics")}>{locale === "es" ? "Aceptar analítica" : "Accept analytics"}</button>
      </div>
    </aside>
  );
}
