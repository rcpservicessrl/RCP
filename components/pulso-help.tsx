"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/types";
import { ArrowIcon, CloseIcon, SearchIcon, SparkIcon } from "@/components/icons";
import { Pulso, type PulsoScene } from "@/components/pulso";

interface PulsoHelpProps {
  locale: Locale;
  scene?: PulsoScene;
  contextLabel?: string;
  onOpenSearch: () => void;
}

export function PulsoHelp({ locale, scene = "idle", contextLabel, onOpenSearch }: PulsoHelpProps) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    const timer = window.setTimeout(() => closeRef.current?.focus(), 30);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", handleKey);
      triggerRef.current?.focus();
    };
  }, [open]);

  return (
    <div className={`pulso-help ${open ? "is-open" : ""}`}>
      {open && (
        <section ref={panelRef} className="pulso-help__panel" role="dialog" aria-label={locale === "es" ? "Guía de Pulso" : "Pulso guide"}>
          <header>
            <div><small>{locale === "es" ? "Guía RCP" : "RCP guide"}</small><strong>Pulso</strong></div>
            <button ref={closeRef} type="button" onClick={() => setOpen(false)} aria-label={locale === "es" ? "Cerrar guía" : "Close guide"}><CloseIcon size={18} /></button>
          </header>
          <div className="pulso-help__intro">
            <Pulso scene={scene} size="small" />
            <p>{contextLabel || (locale === "es" ? "Puedo orientarte entre servicios, soluciones y la Evaluación Inicial RCP 360°." : "I can guide you through services, solutions and the RCP 360° Initial Assessment.")}</p>
          </div>
          <div className="pulso-help__actions">
            <button type="button" onClick={() => { setOpen(false); onOpenSearch(); }}><SearchIcon size={17} /><span><strong>{locale === "es" ? "Buscar una solución" : "Find a solution"}</strong><small>{locale === "es" ? "Describe tu necesidad" : "Describe your need"}</small></span><ArrowIcon size={16} /></button>
            <a href={locale === "es" ? "/#metodo" : "/en#method"} onClick={() => setOpen(false)}><SparkIcon size={17} /><span><strong>{locale === "es" ? "Ver cómo trabajamos" : "See how we work"}</strong><small>{locale === "es" ? "Del problema a la evidencia" : "From problem to evidence"}</small></span><ArrowIcon size={16} /></a>
            <Link href={locale === "es" ? "/diagnostico" : "/en/diagnosis"} onClick={() => setOpen(false)}><span className="pulso-help__dot" /><span><strong>{locale === "es" ? "Solicitar evaluación" : "Request an assessment"}</strong><small>{locale === "es" ? "45 minutos sin costo, sujeto a confirmación" : "45 minutes at no cost, subject to confirmation"}</small></span><ArrowIcon size={16} /></Link>
          </div>
          <p className="pulso-help__limit">{locale === "es" ? "Pulso orienta; no emite diagnósticos legales, fiscales ni financieros." : "Pulso guides; it does not issue legal, tax or financial diagnoses."}</p>
        </section>
      )}
      <button ref={triggerRef} type="button" className="pulso-help__trigger" onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-label={locale === "es" ? "Abrir guía de Pulso" : "Open Pulso guide"}>
        <span className="pulso-help__avatar"><Pulso scene="consider" size="small" /></span>
        <span className="pulso-help__name"><strong>Pulso</strong><small>{locale === "es" ? "¿Te oriento?" : "Need a route?"}</small></span>
      </button>
    </div>
  );
}
