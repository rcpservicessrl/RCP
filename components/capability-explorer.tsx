"use client";

import { useMemo, useState } from "react";
import type { KeyboardEvent } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/types";
import {
  commercialStateLabels,
  glossaryCapabilities,
  publicCapabilities,
  t,
  technicalMaturityLabels,
  technologySolutions,
} from "@/lib/content";
import { ArrowIcon, CheckIcon } from "@/components/icons";

interface CapabilityExplorerProps {
  locale: Locale;
  initialCapability?: string;
  compact?: boolean;
}

export function CapabilityExplorer({ locale, initialCapability, compact = false }: CapabilityExplorerProps) {
  const initialSolution = technologySolutions.find((solution) => initialCapability && solution.capabilityIds.includes(initialCapability)) ?? technologySolutions[0];
  const [solutionId, setSolutionId] = useState(initialSolution.id);
  const solution = technologySolutions.find((entry) => entry.id === solutionId) ?? technologySolutions[0];
  const relatedCapabilities = useMemo(
    () => solution.capabilityIds
      .map((id) => publicCapabilities.find((entry) => entry.id === id))
      .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry)),
    [solution],
  );

  const moveTab = (event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    const supportedKeys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
    if (!supportedKeys.includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? technologySolutions.length - 1
        : event.key === "ArrowRight" || event.key === "ArrowDown"
          ? (currentIndex + 1) % technologySolutions.length
          : (currentIndex - 1 + technologySolutions.length) % technologySolutions.length;
    const next = technologySolutions[nextIndex];
    setSolutionId(next.id);
    requestAnimationFrame(() => document.querySelector<HTMLButtonElement>(`[data-solution-id="${next.id}"]`)?.focus());
  };

  return (
    <div className={`capability-explorer ${compact ? "capability-explorer--compact" : ""}`}>
      <div className="capability-explorer__families" role="tablist" aria-label={locale === "es" ? "Soluciones por necesidad" : "Solutions by need"}>
        {technologySolutions.map((entry, index) => (
          <button
            type="button"
            id={`solution-tab-${entry.id}`}
            data-solution-id={entry.id}
            role="tab"
            aria-selected={entry.id === solution.id}
            aria-controls="solution-panel"
            tabIndex={entry.id === solution.id ? 0 : -1}
            key={entry.id}
            className={entry.id === solution.id ? "is-active" : ""}
            onClick={() => setSolutionId(entry.id)}
            onKeyDown={(event) => moveTab(event, index)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{t(entry.title, locale)}</strong>
          </button>
        ))}
      </div>

      <div id="solution-panel" role="tabpanel" aria-labelledby={`solution-tab-${solution.id}`} className="capability-card capability-card--solution">
        <header>
          <span className="capability-state capability-state--contextual">{locale === "es" ? "Software según tu necesidad" : "Software shaped to your need"}</span>
          <span className="capability-card__acronym">{String(technologySolutions.findIndex((entry) => entry.id === solution.id) + 1).padStart(2, "0")}</span>
        </header>
        <h3>{t(solution.title, locale)}</h3>
        <div className="capability-card__logic">
          <div><small>{locale === "es" ? "Lo que resolvemos" : "What we solve"}</small><p>{t(solution.description, locale)}</p></div>
          <ArrowIcon size={22} />
          <div><small>{locale === "es" ? "Resultado que buscamos" : "Outcome we pursue"}</small><p>{t(solution.outcome, locale)}</p></div>
        </div>
        <div className="capability-card__meta">
          <div>
            <small>{locale === "es" ? "Tecnologías que podemos combinar" : "Technologies we may combine"}</small>
            <ul>{relatedCapabilities.map((entry) => <li key={entry.id}><CheckIcon size={14} /><strong>{entry.acronym}</strong> · {t(entry.name, locale)}</li>)}</ul>
          </div>
        </div>
        <footer>
          <p>{locale === "es" ? "No vendemos una caja genérica. Primero entendemos el proceso y después definimos alcance, propiedad, alojamiento y soporte." : "We do not sell a generic box. We first understand the process, then define scope, ownership, hosting and support."}</p>
          <Link href={t(solution.href, locale)}>{locale === "es" ? "Explorar esta solución" : "Explore this solution"}<ArrowIcon size={16} /></Link>
        </footer>
      </div>

      {!compact && (
        <section className="technology-glossary" aria-labelledby="technology-glossary-title">
          <div>
            <p className="section-eyebrow">{locale === "es" ? "Glosario tecnológico" : "Technology glossary"}</p>
            <h3 id="technology-glossary-title">{locale === "es" ? "Las siglas ayudan a buscar. La necesidad decide la solución." : "Acronyms help you search. The need defines the solution."}</h3>
            <p>{locale === "es" ? "Estas 16 capacidades no son dieciséis productos listos. Son referencias para explicar qué tipo de problema puede atender un software a la medida." : "These 16 capabilities are not sixteen ready-made products. They are references that explain the kind of problem custom software can address."}</p>
          </div>
          <div className="technology-glossary__grid">
            {glossaryCapabilities.map((entry) => (
              <article key={entry.id} id={`capability-${entry.id}`}>
                <header><strong>{entry.acronym}</strong><span>{t(commercialStateLabels[entry.commercialState], locale)}</span></header>
                <h4>{t(entry.name, locale)}</h4>
                <p>{t(entry.result, locale)}</p>
                <small>{t(technicalMaturityLabels[entry.technicalMaturity], locale)}{entry.regulated ? ` · ${locale === "es" ? "Requiere límites y revisión profesional" : "Requires professional boundaries and review"}` : ""}</small>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
