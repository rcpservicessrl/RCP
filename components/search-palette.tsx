"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/types";
import { searchRecords, t } from "@/lib/content";
import { ArrowIcon, CloseIcon, SearchIcon } from "@/components/icons";
import { Pulso } from "@/components/pulso";

interface SearchPaletteProps {
  locale: Locale;
  open: boolean;
  onClose: () => void;
}

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const typeLabels = {
  es: { pillar: "Pilar", service: "Servicio", solution: "Solución", capability: "Tecnología", route: "Ruta", resource: "Acceso" },
  en: { pillar: "Pillar", service: "Service", solution: "Solution", capability: "Technology", route: "Route", resource: "Access" },
};

export function SearchPalette({ locale, open, onClose }: SearchPaletteProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const paletteRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => inputRef.current?.focus(), 30);
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = paletteRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])');
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
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
      returnFocusRef.current?.focus();
    };
  }, [open]);

  const results = useMemo(() => {
    const normalizedQuery = normalize(query.trim());
    if (!normalizedQuery) return searchRecords.slice(0, 8);
    return searchRecords
      .map((record) => {
        const haystack = normalize([record.title.es, record.title.en, record.description.es, record.description.en, ...record.keywords].join(" "));
        const title = normalize(t(record.title, locale));
        const score = title.startsWith(normalizedQuery) ? 3 : title.includes(normalizedQuery) ? 2 : haystack.includes(normalizedQuery) ? 1 : 0;
        return { record, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map((entry) => entry.record);
  }, [locale, query]);

  if (!open) return null;

  return (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-labelledby="search-title" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div ref={paletteRef} className="search-palette">
        <header className="search-palette__header">
          <SearchIcon size={21} />
          <label className="sr-only" htmlFor="universal-search" id="search-title">{locale === "es" ? "Buscar en RCP Services" : "Search RCP Services"}</label>
          <input
            ref={inputRef}
            id="universal-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={locale === "es" ? "Describe lo que necesitas…" : "Describe what you need…"}
            autoComplete="off"
          />
          <button type="button" onClick={onClose} aria-label={locale === "es" ? "Cerrar búsqueda" : "Close search"}><CloseIcon size={18} /></button>
        </header>

        <div className="search-palette__body">
          <aside className="search-palette__guide">
            <Pulso scene={query ? "analyze" : "consider"} size="small" />
            <div>
              <strong>Pulso</strong>
              <p>{locale === "es" ? "Te ayudo a encontrar una ruta. La evaluación inicial confirma cuál puede ser el próximo paso." : "I can help you find a route. The initial assessment confirms what the next step may be."}</p>
            </div>
          </aside>
          <div className="search-results" aria-live="polite">
            <div className="search-results__meta">
              <span>{query ? (locale === "es" ? `${results.length} coincidencias` : `${results.length} matches`) : locale === "es" ? "Rutas frecuentes" : "Common routes"}</span>
              <kbd>ESC</kbd>
            </div>
            {results.length > 0 ? (
              <ul>
                {results.map((record) => (
                  <li key={record.id}>
                    <Link href={t(record.href, locale)} onClick={onClose}>
                      <span className="search-result__type">{typeLabels[locale][record.type]}</span>
                      <span className="search-result__copy"><strong>{t(record.title, locale)}</strong><small>{t(record.description, locale)}</small></span>
                      <ArrowIcon size={18} />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="search-empty">
                <strong>{locale === "es" ? "No encuentro una coincidencia exacta." : "I could not find an exact match."}</strong>
                <p>{locale === "es" ? "Puedes solicitar la Evaluación Inicial RCP 360° y describir el proceso con tus palabras." : "You can request an RCP 360° Initial Assessment and describe the process in your own words."}</p>
                <Link href={locale === "es" ? "/diagnostico" : "/en/diagnosis"} onClick={onClose}>{locale === "es" ? "Solicitar evaluación" : "Request assessment"}<ArrowIcon size={16} /></Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
