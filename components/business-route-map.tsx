"use client";

import { useId, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/types";
import { estimateForService, priceLabel } from "@/lib/pricing";

const routes = [
  { id: "procesos-operativos", x: 100, y: 65, label: { es: "Ordenar", en: "Organize" }, title: { es: "Menos improvisación. Más control.", en: "Less guesswork. More control." }, steps: { es: ["Revisar un proceso contigo", "Definir responsables y controles", "Acordar el plan de implementación"], en: ["Review one process together", "Define owners and controls", "Agree on an implementation plan"] } },
  { id: "sitios-web", x: 370, y: 65, label: { es: "Atraer", en: "Attract" }, title: { es: "Que te encuentren y sepan cómo contactarte.", en: "Help people find and contact you." }, steps: { es: ["Entender a tu cliente", "Presentar tu oferta en una página", "Conectar la consulta con tu equipo"], en: ["Understand your customer", "Present your offer on one page", "Connect inquiries to your team"] } },
  { id: "redes-community", x: 235, y: 245, label: { es: "Dar continuidad", en: "Stay present" }, title: { es: "Una comunicación que acompaña al negocio.", en: "Communication that supports your business." }, steps: { es: ["Definir temas y calendario", "Preparar y aprobar el contenido", "Publicar y revisar lo aprendido"], en: ["Define topics and a calendar", "Prepare and approve content", "Publish and review what you learn"] } },
] as const;

export function BusinessRouteMap({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const [selected, setSelected] = useState(0);
  const unique = useId();
  const es = locale === "es";
  const route = routes[selected];
  const estimate = estimateForService(route.id)!;
  return <div className={`business-route-map ${compact ? "business-route-map--compact" : ""}`}>
    <div className="business-route-map__visual">
      <p>{es ? "Toca una prioridad y descubre tu ruta" : "Choose a priority to find your route"}</p>
      <div className="business-route-map__canvas" role="group" aria-label={es ? "Mapa interactivo de prioridades" : "Interactive priority map"}>
      <svg viewBox="0 0 470 295" aria-hidden="true" focusable="false">
        <circle cx="235" cy="143" r="75" fill="none" stroke="#a2b38d" strokeDasharray="3 7" />
        {routes.map((entry, index) => <path key={entry.id} d={`M235 143 L${entry.x} ${entry.y}`} className={selected === index ? "route-line is-selected" : "route-line"} />)}
        <circle cx="235" cy="143" r="45" fill="#203b2c" /><text x="235" y="140" textAnchor="middle" fill="#fff" fontSize={es ? 15 : 12} fontWeight="700">{es ? "Tu negocio" : "Your business"}</text><text x="235" y="159" textAnchor="middle" fill="#d4e4c9" fontSize="8.5">{es ? "Tu siguiente paso" : "Your next step"}</text>
      </svg>
      {routes.map((entry, index) => <button key={entry.id} type="button" aria-pressed={selected === index} aria-controls={`${unique}-result`} onClick={() => setSelected(index)} className="route-node" style={{ left: `${entry.x / 470 * 100}%`, top: `${entry.y / 295 * 100}%` }}>{entry.label[locale]}</button>)}
      </div>
    </div>
    <div className="business-route-map__result" id={`${unique}-result`} aria-live="polite" aria-atomic="true">
      <span className="section-eyebrow">{es ? "Tu ruta sugerida" : "Your suggested route"}</span><h3>{route.title[locale]}</h3>
      <ol>{route.steps[locale].map(step => <li key={step}>{step}</li>)}</ol>
      <p className="business-route-map__price">{priceLabel(estimate, locale)} <small>{estimate.cadence === "month" ? (es ? "/ mes estimado" : "/ estimated month") : (es ? "/ proyecto estimado" : "/ estimated project")}</small></p>
      <p className="business-route-map__terms">{es ? "Impuestos y gastos externos aparte. Alcance base y condiciones en la guía de precios." : "Taxes and external costs excluded. Base scope and terms in the pricing guide."}</p>
      <Link className="button button--primary" href={`${es ? "/diagnostico?servicios=" : "/en/diagnosis?services="}${route.id}#solicitud`}>{es ? "Preparar mi solicitud" : "Prepare my request"} ↗</Link>
      <Link className="text-link" href={`${es ? "/catalogo" : "/en/catalog"}#precios`}>{es ? "Ver alcance y precios" : "See scope and prices"} ↗</Link>
    </div>
  </div>;
}
