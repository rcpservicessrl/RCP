"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Locale, PillarId } from "@/lib/types";
import { catalog, pillars, selectableCatalog, t } from "@/lib/content";
import { ArrowIcon, CheckIcon, CloseIcon, PlusIcon, SearchIcon } from "@/components/icons";
import { CatalogIcon } from "@/components/catalog-icon";
import { estimateForService, priceLabel } from "@/lib/pricing";

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
  const [selected, setSelected] = useState<string[]>(initialService && selectableCatalog.some(entry => entry.id === initialService) ? [initialService] : []);
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

  const selectedItems = selected.map((id) => selectableCatalog.find((entry) => entry.id === id)).filter((entry): entry is NonNullable<typeof entry> => Boolean(entry));
  const toggleSelection = (id: string) => {
    if (!selectableCatalog.some((entry) => entry.id === id)) return;
    setSelected((current) => current.includes(id) ? current.filter((entry) => entry !== id) : current.length < 4 ? [...current, id] : current);
  };

  const diagnosisHref = `${locale === "es" ? "/diagnostico?servicios=" : "/en/diagnosis?services="}${selected.join(",")}#solicitud`;

  return (
    <div className={`catalog-explorer ${compact ? "catalog-explorer--compact" : ""}`}>
      <div className="catalog-controls">
        <div className="catalog-filters" role="group" aria-label={locale === "es" ? "Filtrar catálogo" : "Filter catalog"}>
          {(["all", "renovacion", "consultoria", "publicidad"] as Filter[]).map((entry) => (
            <button type="button" key={entry} className={filter === entry ? "is-active" : ""} aria-pressed={filter === entry} onClick={() => setFilter(entry)}>{labels[entry]}</button>
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

      <p className="catalog-results" role="status">{locale === "es" ? `${visibleItems.length} ${visibleItems.length === 1 ? "opción" : "opciones"} · Selecciona hasta 4 para conversar con RCP.` : `${visibleItems.length} ${visibleItems.length === 1 ? "option" : "options"} · Choose up to 4 to discuss with RCP.`}</p>
      <div className="catalog-grid">
        {visibleItems.map((entry) => {
          const pillar = pillars.find((candidate) => candidate.id === entry.pillar)!;
          const isSelected = selected.includes(entry.id);
          const estimate = estimateForService(entry.id);
          return (
            <article className={`catalog-item catalog-item--${entry.pillar} ${isSelected ? "is-selected" : ""}`} key={entry.id} id={`service-${entry.id}`}>
              <header>
                <span>{t(pillar.title, locale)}</span>
                <small>{entry.kind === "entry" ? (locale === "es" ? "Punto de partida" : "Starting point") : entry.kind === "physical" ? (locale === "es" ? "Producto a medida" : "Custom product") : (locale === "es" ? "Servicio" : "Service")}</small>
              </header>
              <CatalogIcon id={entry.id} category={entry.category} pillar={entry.pillar} />
              <h3>{t(entry.title, locale)}</h3>
              <p>{t(entry.result, locale)}</p>
              {!compact && <ul>{entry.includes.slice(0, 3).map((include) => <li key={include.es}><CheckIcon size={14} />{t(include, locale)}</li>)}</ul>}
              {estimate && <details className="catalog-estimate"><summary>{priceLabel(estimate, locale)} <small>{estimate.cadence === "month" ? (locale === "es" ? "/ mes estimado" : "/ estimated month") : (locale === "es" ? "/ proyecto estimado" : "/ estimated project")}</small></summary><p>{estimate.scope[locale]}</p><p>{estimate.exclusions[locale]}</p><p>{locale === "es" ? "Impuestos aplicables aparte. Sujeto a cotización escrita." : "Applicable taxes excluded. Subject to a written quote."}</p></details>}
              <footer>
                <span>{entry.id === "diagnostico-rcp-360" ? (locale === "es" ? "45 min sin costo · por confirmar" : "45 min at no cost · to be confirmed") : (locale === "es" ? "Alcance a tu medida" : "Scope shaped to your need")}</span>
                <button type="button" aria-label={`${isSelected ? (locale === "es" ? "Quitar" : "Remove") : (locale === "es" ? "Agregar" : "Add")} ${t(entry.title, locale)}`} onClick={() => toggleSelection(entry.id)} aria-pressed={isSelected} disabled={!entry.selectable || (!isSelected && selected.length >= 4)}>
                  {isSelected ? <><CheckIcon size={16} />{locale === "es" ? "Seleccionado" : "Selected"}</> : <><PlusIcon size={16} />{locale === "es" ? "Agregar" : "Add"}</>}
                </button>
              </footer>
            </article>
          );
        })}
      </div>

      {visibleItems.length === 0 && <div className="catalog-empty"><strong>{locale === "es" ? "No encontramos esa combinación." : "We could not find that combination."}</strong><p>{locale === "es" ? "Prueba otra palabra o describe tu necesidad en el diagnóstico." : "Try another term or describe your need in the diagnosis."}</p><button className="button button--secondary" type="button" onClick={() => { setQuery(""); setFilter("all"); }}>{locale === "es" ? "Ver todo el catálogo" : "See the full catalog"}</button></div>}
      {!compact && <p className="catalog-image-note">{locale === "es" ? "Escenas e imágenes ilustrativas, algunas generadas con IA. No representan clientes, proyectos entregados ni integrantes de RCP." : "Illustrative scenes and images, some generated with AI. They do not depict RCP clients, delivered projects or team members."}</p>}

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
