"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/lib/types";
import { ArrowIcon, CloseIcon, WhatsAppIcon } from "@/components/icons";
import { publicContact } from "@/lib/public-contact";
import type { PulsoScene } from "@/components/pulso";
import { PulsoQuestion } from "@/components/pulso-question";

interface PulsoHelpProps {
  locale: Locale;
  scene?: PulsoScene;
  contextLabel?: string;
  onOpenSearch: () => void;
}

export function PulsoHelp({ locale, onOpenSearch }: PulsoHelpProps) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = Array.from(panelRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), summary, [tabindex]:not([tabindex="-1"])') ?? []).filter(element => element.getClientRects().length > 0);
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
      trigger?.focus();
    };
  }, [open]);

  return (
    <div className={`pulso-help ${open ? "is-open" : ""}`}>
      {open && (
        <section ref={panelRef} className="pulso-help__panel" role="dialog" aria-label={locale === "es" ? "Guía de Pulso" : "Pulso guide"}>
          <header>
            <strong>Pulso</strong>
            <button ref={closeRef} type="button" onClick={() => setOpen(false)} aria-label={locale === "es" ? "Cerrar guía" : "Close guide"}><CloseIcon size={18} /></button>
          </header>
          <PulsoQuestion locale={locale} />
          <div className="pulso-help__actions">
            <button type="button" onClick={() => { setOpen(false); onOpenSearch(); }}><span>{locale === "es" ? "Buscar una solución" : "Find a solution"}</span><ArrowIcon size={16} /></button>
            <a href={locale === "es" ? "/#metodo" : "/en#method"} onClick={() => setOpen(false)}><span>{locale === "es" ? "Cómo trabajamos" : "How we work"}</span><ArrowIcon size={16} /></a>
            <Link href={locale === "es" ? "/diagnostico" : "/en/diagnosis"} onClick={() => setOpen(false)}><span>{locale === "es" ? "Solicitar evaluación" : "Request an assessment"}</span><ArrowIcon size={16} /></Link>
          </div>
        </section>
      )}
      <div className="contact-dock">
      <button ref={triggerRef} type="button" className="pulso-help__trigger" onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-label={locale === "es" ? "Abrir guía de Pulso" : "Open Pulso guide"}>
        <span className="pulso-help__avatar"><Image src="/icono-rcp.png" width={48} height={48} alt="" sizes="48px" /></span>
        <span className="pulso-help__name"><strong>Pulso</strong><small>{locale === "es" ? "¿Te oriento?" : "Need a route?"}</small></span>
      </button>
      <a className="whatsapp-float" href={publicContact.whatsappHref} target="_blank" rel="noopener noreferrer" aria-label={locale === "es" ? "Contactar a RCP por WhatsApp (abre en otra pestaña)" : "Contact RCP on WhatsApp (opens in a new tab)"}>
        <WhatsAppIcon size={28} />
      </a>
      </div>
    </div>
  );
}
