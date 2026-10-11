"use client";

import { useId, useState, type KeyboardEvent } from "react";
import type { Locale } from "@/lib/types";
import styles from "./transformation-canvas.module.css";
import { useScenePlayback } from "./use-scene-playback";

const content = {
  es: [
    { name: "Renovación", verb: "Ordenar para avanzar.", detail: "Procesos claros y herramientas que se adaptan a tu operación.", items: ["Consulta recibida", "Responsable asignado", "Entrega verificada"], label: "Tu operación", chart: "Continuidad del trabajo", note: "Cada paso tiene una persona y un próximo movimiento." },
    { name: "Consultoría", verb: "Decidir con claridad.", detail: "Convertimos las preguntas del negocio en prioridades y un plan realista.", items: ["Entender la necesidad", "Definir prioridades", "Acordar el siguiente paso"], label: "Tu estrategia", chart: "Prioridades del proyecto", note: "Primero entendemos la realidad. Después definimos la solución." },
    { name: "Publicidad", verb: "Conectar para crecer.", detail: "Una identidad coherente en tu vitrina, tus canales y cada conversación.", items: ["Una identidad", "Canales conectados", "Consultas con seguimiento"], label: "Tu presencia", chart: "Recorrido de una consulta", note: "Marca, contenido y atención trabajando en una dirección." },
  ],
  en: [
    { name: "Renewal", verb: "Organize to move forward.", detail: "Clear processes and tools adapted to your operation.", items: ["Inquiry received", "Owner assigned", "Delivery verified"], label: "Your operations", chart: "Work continuity", note: "Every step has an owner and a next move." },
    { name: "Consulting", verb: "Decide with clarity.", detail: "We turn business questions into priorities and a realistic plan.", items: ["Understand the need", "Define priorities", "Agree on the next step"], label: "Your strategy", chart: "Project priorities", note: "First, understand the reality. Then, define the solution." },
    { name: "Advertising", verb: "Connect to grow.", detail: "A consistent identity across your storefront, channels and conversations.", items: ["One identity", "Connected channels", "Inquiries followed up"], label: "Your presence", chart: "An inquiry's journey", note: "Brand, content and service moving in one direction." },
  ],
};

const iconPaths = [
  "M5 5h14v14H5zM8 9h8M8 13h5M8 17h3",
  "M5 19V5h14M8 15l4-4 3 2 4-6",
  "M4 10h4l10-5v14l-10-5H4zM8 14l2 6h3",
  "M5 12l4 4L19 6M4 4h16v16H4z",
  "M5 18V6M5 18h14M9 14l4-4 3 2 4-6",
];

function SceneIcon({ index }: { index: number }) {
  return <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={iconPaths[index % iconPaths.length]} /></svg>;
}

/** Process illustrations, without invented performance measurements. */
function ProcessDiagram({ index, locale }: { index: number; locale: Locale }) {
  const es = locale === "es";
  const labels = (es ? [["Consulta", "Responsable", "Entrega"], ["Entender", "Priorizar", "Planificar"], ["Marca", "Canales", "Atención"]] : [["Inquiry", "Owner", "Delivery"], ["Understand", "Prioritize", "Plan"], ["Brand", "Channels", "Service"]])[index];
  return <div className={styles.diagram}>
    <svg viewBox="0 0 360 180" aria-hidden="true" focusable="false" className={styles.chart}>
      <path className={styles.diagramGuide} d="M20 28H340M20 90H340M20 152H340" />
      {index === 0 ? <>
        <path className={styles.diagramRoute} d="M96 90H142M216 90H262" />
        <path className={styles.diagramArrow} d="M131 84l6 6-6 6M251 84l6 6-6 6" />
        {[20, 142, 264].map((x, i) => <g key={x}><rect x={x} y="50" width="76" height="80" rx="18" className={i === 2 ? styles.diagramActive : styles.diagramNode} /><svg x={x + 20} y="72" width="36" height="36" viewBox="0 0 24 24" className={styles.diagramIcon}><path d={iconPaths[[0, 1, 3][i]]} /></svg></g>)}
      </> : index === 1 ? <>
        <path className={styles.diagramRoute} d="M68 35V145M68 35H100M68 90H100M68 145H100" />
        {[15, 70, 125].map((y, i) => <g key={y}><rect x="100" y={y} width="220" height="40" rx="12" className={i === 1 ? styles.diagramActive : styles.diagramNode} /><circle cx="126" cy={y + 20} r="5" className={styles.diagramDot} /><path d={`M150 ${y + 15}H${230 + i * 20}M150 ${y + 25}H210`} className={styles.diagramDetail} /></g>)}
      </> : <>
        <path className={styles.diagramRoute} d="M72 90H152M208 90C240 90 228 40 282 40M208 90C240 90 228 140 282 140" />
        <circle cx="180" cy="90" r="34" className={styles.diagramActive} />
        <svg x="162" y="72" width="36" height="36" viewBox="0 0 24 24" className={styles.diagramIcon}><path d={iconPaths[2]} /></svg>
        {[[44, 90], [310, 40], [310, 140]].map(([x, y], i) => <g key={y}><rect x={x - 26} y={y - 26} width="52" height="52" rx="15" className={styles.diagramNode} /><svg x={x - 13} y={y - 13} width="26" height="26" viewBox="0 0 24 24" className={styles.diagramIcon}><path d={iconPaths[[0, 1, 3][i]]} /></svg></g>)}
      </>}
    </svg>
    <div className={styles.diagramLegend}>{labels.map(label => <span key={label}>{label}</span>)}</div>
  </div>;
}

export function TransformationCanvas({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const [active, setActive] = useState(0);
  const playback = useScenePlayback(setActive, 3, 8000);
  const id = useId();
  const es = locale === "es";
  const entries = content[locale];
  const current = entries[active];
  function move(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % 3;
    else if (event.key === "ArrowLeft") next = (index + 2) % 3;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = 2;
    else return;
    event.preventDefault(); playback.pause(); setActive(next);
    event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("button")[next]?.focus();
  }
  return <div ref={playback.rootRef} onFocusCapture={event => { if (!event.target.closest("[data-playback-control]")) playback.pause(); }} className={`${styles.canvas} ${compact ? styles.compact : ""}`}>
    <div className={styles.top}><span><i />{es ? "Tu negocio, conectado" : "Your business, connected"}</span><small>{es ? "Explora los 3 pilares" : "Explore the 3 pillars"}</small></div>
    <div className={styles.orbit}>
      <svg viewBox="0 0 540 280" preserveAspectRatio="none" aria-hidden="true" focusable="false" className={styles.connections}>
        <path className={styles.connectionGuide} d="M30 140H510M270 24V256" />
        <path d="M80 60V96Q80 140 174 140H220M460 60V96Q460 140 366 140H320M270 180V240" />
        <path key={active} className={styles.activePath} pathLength="1" d={["M80 60V96Q80 140 174 140H220", "M270 240V180", "M460 60V96Q460 140 366 140H320"][active]} />
      </svg>
      <span className={`${styles.orbitLabel} ${styles.orbitLabelOne}`} data-active={active === 0}>{es ? "Operación" : "Operations"}<b>R</b></span>
      <span className={`${styles.orbitLabel} ${styles.orbitLabelTwo}`} data-active={active === 2}><b>P</b>{es ? "Presencia" : "Presence"}</span>
      <div className={styles.core}><span>{es ? "EN EL CENTRO" : "AT THE CENTER"}</span><strong>{es ? "Tu negocio" : "Your business"}</strong><small>{es ? "Personas · Procesos · Tecnología" : "People · Processes · Technology"}</small></div>
      <span className={`${styles.orbitLabel} ${styles.orbitLabelThree}`} data-active={active === 1}><b>C</b>{es ? "Estrategia" : "Strategy"}</span>
    </div>
    <div className={styles.tabs} role="tablist" aria-label={es ? "Pilares de transformación" : "Transformation pillars"}>
      {entries.map((entry, i) => <button type="button" role="tab" key={entry.name} id={`${id}-tab-${i}`} aria-selected={active === i} aria-controls={`${id}-panel`} tabIndex={active === i ? 0 : -1} onClick={() => { playback.pause(); setActive(i); }} onKeyDown={event => move(event, i)}><span>0{i + 1}</span>{entry.name}</button>)}
    </div>
    <div className={styles.panel} role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-tab-${active}`} tabIndex={0}>
      <div className={styles.panelCopy} key={active}><small>{current.label}</small><h3>{current.verb}</h3><p>{current.detail}</p><ol>{current.items.map((item, i) => <li key={item}><span>0{i + 1}</span>{item}<b aria-hidden="true">✓</b></li>)}</ol></div>
      <div className={styles.insight}><span>{current.chart}</span><ProcessDiagram index={active} locale={locale} /><p>{current.note}</p><small>{es ? "Visualización conceptual · Sin datos de clientes" : "Concept visualization · No customer data"}</small></div>
    </div>
    <div className={styles.bottom}><span>RCP Services</span><button type="button" data-playback-control onClick={playback.toggle} aria-pressed={playback.playing}><span aria-hidden="true">{playback.playing ? "Ⅱ" : "▷"}</span>{playback.playing ? es ? "Pausar recorrido" : "Pause tour" : es ? "Reproducir recorrido" : "Play tour"}</button></div>
  </div>;
}

const journey = {
  es: [
    ["Consulta", "Una oportunidad llega a tu negocio.", "Vitrina digital", "La consulta queda registrada con su origen y su necesidad."],
    ["Propuesta", "Lo que ofreces se entiende.", "Oferta clara", "Productos, alcance y condiciones organizados para responder."],
    ["Trabajo", "El equipo sabe qué sigue.", "Responsables", "Las tareas y sus responsables acompañan cada compromiso."],
    ["Entrega", "El compromiso tiene seguimiento.", "Verificación", "Revisas lo acordado antes de cerrar el trabajo."],
    ["Aprendizaje", "La información ayuda a decidir.", "Próximo paso", "Observas el recorrido para mejorar el proceso y la atención."],
  ],
  en: [
    ["Inquiry", "An opportunity reaches your business.", "Digital storefront", "The inquiry is recorded with its source and need."],
    ["Proposal", "Your offer is understood.", "Clear offer", "Products, scope and terms organized to respond."],
    ["Work", "The team knows what comes next.", "Owners", "Tasks and owners accompany every commitment."],
    ["Delivery", "Commitments get follow-through.", "Verification", "Review the agreed work before completing delivery."],
    ["Learning", "Information helps you decide.", "Next step", "Review the journey to improve processes and service."],
  ],
};

export function ConnectedExperience({ locale }: { locale: Locale }) {
  const [step, setStep] = useState(0);
  const playback = useScenePlayback(setStep, 5);
  const [business, setBusiness] = useState("retail");
  const es = locale === "es";
  const stages = journey[locale];
  const current = stages[step];
  return <div ref={playback.rootRef} onFocusCapture={event => { if (!event.target.closest("[data-playback-control]")) playback.pause(); }} className={styles.demo}>
    <div className={styles.demoToolbar}><div><small>{es ? "EXPERIENCIA INTERACTIVA" : "INTERACTIVE EXPERIENCE"}</small><h3>{es ? "Del primer contacto al siguiente paso." : "From first contact to the next step."}</h3></div><div role="group" aria-label={es ? "Tipo de negocio del ejemplo" : "Example business type"}>{["retail", "services"].map(value => <button type="button" key={value} aria-pressed={business === value} onClick={() => { playback.pause(); setBusiness(value); setStep(0); }}>{value === "retail" ? es ? "Comercio" : "Retail" : es ? "Servicios" : "Services"}</button>)}</div></div>
    <div className={styles.demoGrid}>
      <div className={styles.journey}><p>{es ? "Toca cada etapa para explorar" : "Select a stage to explore"}</p><ol>{stages.map((stage, i) => <li key={stage[0]}><button type="button" aria-pressed={step === i} onClick={() => { playback.pause(); setStep(i); }}><span>0{i + 1}</span><div><strong>{stage[0]}</strong><small>{stage[1]}</small></div><b aria-hidden="true">↗</b></button></li>)}</ol></div>
      <div className={styles.workspace}>
        <div className={styles.workspaceBar}><span aria-hidden="true">● ● ●</span><span>{es ? "Espacio de trabajo · Ejemplo" : "Workspace · Example"}</span><b>RCP</b></div>
        <div className={styles.workspaceBody} key={`${business}-${step}`}>
          <div className={styles.workspaceHeading}><div><small>{current[2]}</small><h4>{business === "retail" ? es ? "Tu comercio" : "Your store" : es ? "Tu empresa de servicios" : "Your service business"}</h4></div><span>0{step + 1} / 05</span></div>
          <div className={styles.record}><span className={styles.recordIcon}><SceneIcon index={step} /></span><div><small>{es ? "EJEMPLO DEMOSTRATIVO" : "DEMONSTRATION EXAMPLE"}</small><strong>{business === "retail" ? es ? "Pedido de un producto" : "Product order" : es ? "Solicitud de un servicio" : "Service request"}</strong><p>{current[3]}</p></div></div>
          <div className={styles.flow}>{stages.map((stage, i) => <span key={stage[0]} data-complete={i <= step}><i>{i < step ? "✓" : i + 1}</i><small>{stage[0]}</small></span>)}</div>
          <div className={styles.workspaceCards}><div><small>{es ? "Lo que se conecta" : "What connects"}</small><strong>{[es ? "Marca + atención" : "Brand + service", es ? "Oferta + proceso" : "Offer + process", es ? "Personas + tareas" : "People + tasks", es ? "Entrega + calidad" : "Delivery + quality", es ? "Datos + decisiones" : "Data + decisions"][step]}</strong><p>{es ? "El alcance se define para cada proyecto." : "Scope is defined for each project."}</p></div><div><small>{es ? "Una ruta visible" : "A visible journey"}</small><ProcessDiagram index={step % 3} locale={locale} /></div></div>
        </div>
        <div className={styles.demoFooter}><span>{es ? "Simulación conceptual; no es una aplicación contratada." : "Concept simulation; not a subscribed application."}</span><button type="button" data-playback-control onClick={playback.toggle} aria-pressed={playback.playing}>{playback.playing ? es ? "Pausar" : "Pause" : es ? "Reproducir" : "Play"}</button><button type="button" onClick={() => { playback.pause(); setStep((step + 1) % stages.length); }}>{step === 4 ? es ? "Volver al inicio" : "Start again" : es ? "Siguiente etapa" : "Next stage"}<span aria-hidden="true">→</span></button></div>
      </div>
    </div>
  </div>;
}

export function MethodBlueprint({ locale, step }: { locale: Locale; step: number }) {
  const es = locale === "es";
  const names = es ? ["Necesidad", "Hallazgos", "Plan", "Equipo", "Entregas", "Pruebas", "Continuidad"] : ["Need", "Findings", "Plan", "Team", "Delivery", "Tests", "Continuity"];
  return <div className={styles.blueprint} aria-label={es ? `Mapa del método: ${names[step]}` : `Method map: ${names[step]}`}>
    <div className={styles.blueprintTop}><span>{es ? "DEL PROPÓSITO A LA PRÁCTICA" : "FROM PURPOSE TO PRACTICE"}</span><strong>0{step + 1} / 07</strong></div>
    <div className={styles.blueprintGrid} aria-hidden="true">{names.map((name, i) => <div key={name} data-current={i === step} data-complete={i < step}><span>{i < step ? "✓" : `0${i + 1}`}</span><SceneIcon index={i} /><strong>{name}</strong></div>)}</div>
    <p>{es ? "Un recorrido con entregables, responsables y revisión contigo." : "A journey with deliverables, owners and reviews with you."}</p>
  </div>;
}
