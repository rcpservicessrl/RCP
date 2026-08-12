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
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    if (!siteKey || !ready || !containerRef.current || !window.turnstile) return;
    setToken("");
    const widgetId = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme: "auto",
      size: "flexible",
      appearance: "interaction-only",
      callback: (nextToken: string) => setToken(nextToken),
      "expired-callback": () => setToken(""),
      "error-callback": () => setToken(""),
    });
    return () => window.turnstile?.remove(widgetId);
  }, [ready, resetSignal, siteKey]);

  if (!siteKey) return <input type="hidden" name="turnstileToken" value="" readOnly />;

  return (
    <div className="turnstile-field">
      <Script
        id="rcp-turnstile"
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setReady(true)}
        onReady={() => setReady(true)}
      />
      <input type="hidden" name="turnstileToken" value={token} readOnly />
      <div ref={containerRef} />
      <small>{locale === "es" ? "Verificación contra envíos automatizados." : "Protection against automated submissions."}</small>
    </div>
  );
}
