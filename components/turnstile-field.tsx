"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/types";
import { publicContact } from "@/lib/public-contact";

type TurnstileApi = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export function TurnstileField({ locale, resetSignal = 0, contact = "inquiry" }: { locale: Locale; resetSignal?: number; contact?: "inquiry" | "specialist" }) {
  const configuredSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  const siteKey = configuredSiteKey && configuredSiteKey !== "[SENSITIVE]" ? configuredSiteKey : undefined;
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState("");
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    if (!siteKey || !ready || unavailable || !containerRef.current || !window.turnstile) return;
    setToken("");
    try {
      const widgetId = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme: "auto",
        size: "flexible",
        appearance: "interaction-only",
        callback: (nextToken: string) => setToken(nextToken),
        "expired-callback": () => setToken(""),
        "error-callback": () => { setToken(""); setUnavailable(true); },
      });
      return () => { try { window.turnstile?.remove(widgetId); } catch { /* The provider may have already removed the widget. */ } };
    } catch {
      setUnavailable(true);
    }
  }, [ready, unavailable, resetSignal, siteKey]);

  if (!siteKey || unavailable) return <>
    <input type="hidden" name="turnstileToken" value="" readOnly />
    <div className="form-note" role="alert">
      <strong>{locale === "es" ? "Puedes continuar por otro canal." : "You can continue through another channel."}</strong>
      <p>{locale === "es" ? "La verificación de seguridad está pendiente o no está disponible. Puedes contactar a RCP directamente; el formulario no ha confirmado el envío." : "Security verification is pending or unavailable. You can contact RCP directly; the form has not confirmed delivery."}</p>
      <div className="diagnosis-actions">
        {contact === "inquiry" && <a className="button button--secondary" href={publicContact.whatsappHref} target="_blank" rel="noopener noreferrer">{locale === "es" ? "Continuar por WhatsApp" : "Continue on WhatsApp"}</a>}
        <a className="button button--secondary" href={contact === "specialist" ? "mailto:info@rcp.services?subject=Red%20de%20Especialistas%20RCP" : "mailto:info@rcp.services"}>{locale === "es" ? "Contactar por correo" : "Contact by email"}</a>
      </div>
    </div>
  </>;

  return (
    <div className="turnstile-field">
      <Script
        id="rcp-turnstile"
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setReady(true)}
        onReady={() => setReady(true)}
        onError={() => { setToken(""); setUnavailable(true); }}
      />
      <input type="hidden" name="turnstileToken" value={token} readOnly />
      <div ref={containerRef} />
      <small>{locale === "es" ? "Verificación contra envíos automatizados." : "Protection against automated submissions."}</small>
    </div>
  );
}
