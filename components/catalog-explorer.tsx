"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Locale, PillarId } from "@/lib/types";
import { catalog, pillars, t } from "@/lib/content";
import { ArrowIcon, CheckIcon, CloseIcon, PlusIcon, SearchIcon } from "@/components/icons";
import { CatalogIcon } from "@/components/catalog-icon";

interface CatalogExplorerProps {
  locale: Locale;
  initialService?: string;
  limit?: number;
  compact?: boolean;
  balanced?: boolean;
}

type Filter = "all" | PillarId;

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const filterLabels = {
  es: { all: "Todo", renovacion: "Renovación", consultoria: "Consultoría", publicidad: "Publicidad" },
  en: { all: "All", renovacion: "Renewal", consultoria: "Consulting", publicidad: "Advertising" },
};

export function CatalogExplorer({ locale, initialService, limit, compact = false, balanced = false }: CatalogExplorerProps) {
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>(initialService ? [initialService] : []);
  const labels = filterLabels[locale];

  const visibleItems = useMemo(() => {
    const normalizedQuery = normalize(query.trim());
    const filtered = catalog.filter((entry) => {
      const matchesFilter = filter === "all" || entry.pillar === filter;
      if (!matchesFilter) return false;
      if (!normalizedQuery) return true;
      const haystack = normalize([entry.title.es, entry.title.en, entry.result.es, entry.result.en, entry.category, ...entry.tags].join(" "));
      return haystack.includes(normalizedQuery);
    });
    if (typeof limit !== "number") return filtered;
    if (!balanced || filter !== "all" || normalizedQuery) return filtered.slice(0, limit);

    const perPillar = Math.max(1, Math.floor(limit / pillars.length));
    const balancedItems = pillars.flatMap((pillar) => filtered.filter((entry) => entry.pillar === pillar.id && entry.kind !== "entry").slice(0, perPillar));
    return balancedItems.slice(0, limit);
  }, [balanced, filter, limit, query]);

  const selectedItems = selected.map((id) => catalog.find((entry) => entry.id === id)).filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
  const toggleSelection = (id: string) => {
    setSelected((current) => current.includes(id) ? current.filter((entry) => entry !== id) : current.length < 4 ? [...current, id] : current);
  };

  const diagnosisHref = `${locale === "es" ? "/diagnostico?servicios=" : "/en/diagnosis?services="}${selected.join(",")}`;

  return (
    <div className={`catalog-explorer ${compact ? "catalog-explorer--compact" : ""}`}>
      <div className="catalog-controls">
        <div className="catalog-filters" role="group" aria-label={locale === "es" ? "Filtrar catálogo" : "Filter catalog"}>
          {(["all", "renovacion", "consultoria", "publicidad"] as Filter[]).map((entry) => (
            <button type="button" key={entry} className={filter === entry ? "is-active" : ""} onClick={() => setFilter(entry)}>{labels[entry]}</button>
          ))}
        </div>
        {!compact && (
          <label className="catalog-search">
            <SearchIcon size={18} />
            <span className="sr-only">{locale === "es" ? "Buscar en el catálogo" : "Search catalog"}</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={locale === "es" ? "Buscar servicio o producto…" : "Search service or product…"} />
          </label>
        )}
      </div>

      <div className="catalog-grid" aria-live="polite">
        {visibleItems.map((entry) => {
          const pillar = pillars.find((candidate) => candidate.id === entry.pillar)!;
          const isSelected = selected.includes(entry.id);
          return (
            <article className={`catalog-item catalog-item--${entry.pillar} ${isSelected ? "is-selected" : ""}`} key={entry.id} id={`service-${entry.id}`}>
              <header>
                <span>{t(pillar.title, locale)}</span>
                <small>{entry.kind === "entry" ? (locale === "es" ? "Punto de partida" : "Starting point") : (locale === "es" ? "Servicio" : "Service")}</small>
              </header>
              <CatalogIcon id={entry.id} category={entry.category} pillar={entry.pillar} />
              <h3>{t(entry.title, locale)}</h3>
              <p>{t(entry.result, locale)}</p>
              {!compact && <ul>{entry.includes.slice(0, 3).map((include) => <li key={include.es}><CheckIcon size={14} />{t(include, locale)}</li>)}</ul>}
              <footer>
                <span>{locale === "es" ? "Alcance por diagnóstico" : "Scope by diagnosis"}</span>
                <button type="button" onClick={() => toggleSelection(entry.id)} aria-pressed={isSelected} disabled={!isSelected && selected.length >= 4}>
                  {isSelected ? <><CheckIcon size={16} />{locale === "es" ? "Seleccionado" : "Selected"}</> : <><PlusIcon size={16} />{locale === "es" ? "Agregar" : "Add"}</>}
                </button>
              </footer>
            </article>
          );
        })}
      </div>

      {visibleItems.length === 0 && <div className="catalog-empty"><strong>{locale === "es" ? "No encontramos esa combinación." : "We could not find that combination."}</strong><p>{locale === "es" ? "Prueba otra palabra o describe tu necesidad en el diagnóstico." : "Try another term or describe your need in the diagnosis."}</p></div>}

      {selectedItems.length > 0 && (
        <aside className="selection-tray" aria-label={locale === "es" ? "Selección para diagnóstico" : "Diagnosis selection"}>
          <div><small>{locale === "es" ? "Ruta a evaluar" : "Route to evaluate"}</small><strong>{selectedItems.length} / 4</strong></div>
          <ul>{selectedItems.map((entry) => <li key={entry.id}><span>{t(entry.title, locale)}</span><button type="button" onClick={() => toggleSelection(entry.id)} aria-label={`${locale === "es" ? "Quitar" : "Remove"} ${t(entry.title, locale)}`}><CloseIcon size={14} /></button></li>)}</ul>
          <Link className="button button--primary" href={diagnosisHref}>{locale === "es" ? "Preparar solicitud" : "Prepare request"}<ArrowIcon size={16} /></Link>
        </aside>
      )}
    </div>
  );
}
