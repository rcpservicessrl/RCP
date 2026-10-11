"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/types";

type TurnstileApi = {
  render: (container: HTMLElement, options: Record<string, unknown>) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export function TurnstileField({ locale, resetSignal = 0 }: { locale: Locale; resetSignal?: number }) {
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
      return () => {
        try { window.turnstile?.remove(widgetId); } catch { /* The provider may have already removed the widget. */ }
      };
    } catch {
      setToken("");
      setUnavailable(true);
    }
  }, [ready, resetSignal, siteKey, unavailable]);

  if (!siteKey || unavailable) return <>
    <input type="hidden" name="turnstileToken" value="" readOnly />
    <div className="form-note" role="alert">
      <strong>{locale === "es" ? "La verificación no está disponible." : "Verification is unavailable."}</strong>
      <p>{locale === "es" ? "Tu solicitud no se ha enviado. Puedes contactar a RCP directamente." : "Your request has not been sent. You can contact RCP directly."}</p>
      <a href="https://wa.me/18298068092?text=Hola%20RCP%20Services%2C%20quiero%20mi%20evaluaci%C3%B3n%20inicial" target="_blank" rel="noopener noreferrer">{locale === "es" ? "Continuar por WhatsApp" : "Continue on WhatsApp"}</a>{" · "}
      <a href="mailto:info@rcp.services">{locale === "es" ? "Contactar por correo" : "Contact by email"}</a>
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
