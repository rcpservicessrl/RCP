"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/types";
import { ArrowIcon } from "@/components/icons";
import styles from "./editorial-intro.module.css";

const stories = {
  es: [["Primero, entenderte.", "Tu realidad, antes de recomendar una solución."], ["Conectar lo que importa.", "Personas, procesos y herramientas en una misma dirección."], ["Avanzar por etapas.", "Prioridades claras. Entregas que revisamos contigo."]],
  en: [["First, understand you.", "Your reality, before recommending a solution."], ["Connect what matters.", "People, processes and tools moving in one direction."], ["Move forward in stages.", "Clear priorities. Deliveries we review together."]],
};

export function EditorialIntro({ locale }: { locale: Locale }) {
  const [story, setStory] = useState(0);
  const es = locale === "es";
  return <section className={styles.intro} id="inicio">
    <div className={`container ${styles.grid}`}>
      <div className={styles.copy}>
        <p className={styles.kicker}><span />{es ? "Transformación empresarial · República Dominicana" : "Business transformation · Dominican Republic"}</p>
        <h1>{es ? "Tu negocio," : "Your business,"}<br />{es ? "en su mejor" : "at its"}<br /><em>{es ? "versión." : "best."}</em></h1>
        <p className={styles.description}>{es ? "Estrategia para decidir. Tecnología para avanzar. Una marca que conecta." : "Strategy to decide. Technology to move forward. A brand that connects."}<br /><strong>{es ? "Todo, con una sola dirección." : "All moving in one direction."}</strong></p>
        <div className={styles.actions}><a className="button button--primary" href="#necesidad">{es ? "Descubrir mi siguiente paso" : "Discover my next step"}<ArrowIcon size={18} /></a><Link href={es ? "/servicios" : "/en/services"}>{es ? "Explorar soluciones" : "Explore solutions"} ↗</Link></div>
        <p className={styles.reassurance}>{es ? "Sin contratarlo todo. Sin empezar desde cero." : "Without buying everything. Without starting from scratch."}</p>
        <div className={styles.audiences}><span>{es ? "Hecho para" : "Made for"}</span><a href="#sectores">{es ? "Comercios" : "Retail businesses"} ↗</a><a href="#sectores">{es ? "Empresas de servicios" : "Service businesses"} ↗</a></div>
      </div>
      <div className={styles.scene}>
        <figure className={styles.portrait}><Image src="/assets/business-scenes/hero-team.webp" width={1000} height={1250} alt={es ? "Escena ilustrativa de una comerciante y dos asesores trabajando juntos en su negocio" : "Illustrative scene of a shop owner and two advisors working together in her business"} priority sizes="(max-width: 760px) 90vw, 43vw" /><figcaption>{es ? "El negocio real." : "Real business."}<br /><strong>{es ? "En el centro de todo." : "At the center of everything."}</strong></figcaption></figure>
        <div className={styles.stamp} aria-hidden="true"><span>{es ? "Una sola" : "One clear"}</span><strong>{es ? "dirección." : "direction."}</strong><b>↗</b></div>
        <div className={styles.story}>
          <div className={styles.storyTop}><span>{es ? "Así empieza el cambio" : "Where change begins"}</span><span>0{story + 1} / 03</span></div>
          <div aria-live="polite"><p className={styles.storyTitle}>{stories[locale][story][0]}</p><p className={styles.storyDescription}>{stories[locale][story][1]}</p></div>
          <div className={styles.storyBottom}><div role="group" aria-label={es ? "Explorar el recorrido" : "Explore the journey"}>{stories[locale].map((entry, i) => <button key={i} type="button" aria-pressed={story === i} aria-label={entry[0]} onClick={() => setStory(i)}>0{i + 1}</button>)}</div><a href={es ? "#metodo" : "#method"}>{es ? "Conoce el método" : "Our method"} ↗</a></div>
        </div>
      </div>
    </div>
    <div className={`container ${styles.ribbon}`}><p>{es ? "Conservamos el propósito." : "The same purpose."}<br /><strong>{es ? "Cambiamos las posibilidades." : "New possibilities."}</strong></p><Link href={es ? "/servicios/renovacion" : "/en/services/renewal"}>{es ? "Renovación" : "Renewal"} ↗</Link><Link href={es ? "/servicios/consultoria" : "/en/services/consulting"}>{es ? "Consultoría" : "Consulting"} ↗</Link><Link href={es ? "/servicios/publicidad" : "/en/services/advertising"}>{es ? "Publicidad" : "Advertising"} ↗</Link></div>
  </section>;
}

export function EditorialSectors({ locale }: { locale: Locale }) {
  const es = locale === "es";
  return <section className={styles.sectors} id="sectores"><div className="container"><p className="section-eyebrow">{es ? "Tu realidad es el punto de partida" : "Your reality is our starting point"}</p><h2>{es ? "Distintos negocios. Una misma necesidad de avanzar." : "Different businesses. The same need to move forward."}</h2><div className={styles.sectorGrid}>
    <article><Image src="/assets/editorial-v32/commerce.webp" width={1200} height={800} sizes="(max-width: 760px) 90vw, 44vw" alt={es ? "Escena ilustrativa de la atención en un comercio" : "Illustrative retail service scene"} /><div><small>{es ? "Vender. Atender. Tener el control." : "Sell. Serve. Stay in control."}</small><h3>{es ? "Comercios" : "Retail businesses"}</h3><p>{es ? "Conecta ventas, inventario y presencia digital para que el día a día dependa menos de la improvisación." : "Connect sales, inventory and digital presence so your day depends less on improvisation."}</p><Link className="text-link" href={es ? "/soluciones/comercios" : "/en/solutions/retail"}>{es ? "Explorar mi negocio" : "Explore my business"} ↗</Link></div></article>
    <article><Image src="/assets/editorial-v32/team.webp" width={1200} height={800} sizes="(max-width: 760px) 90vw, 44vw" alt={es ? "Escena ilustrativa de planificación en una empresa de servicios" : "Illustrative planning scene in a service business"} /><div><small>{es ? "Coordinar. Entregar. Crecer." : "Coordinate. Deliver. Grow."}</small><h3>{es ? "Empresas de servicios" : "Service businesses"}</h3><p>{es ? "Da continuidad a cada consulta y organiza propuestas, tareas y entregas con una forma clara de trabajar." : "Follow through on inquiries and organize proposals, tasks and delivery with a clear way of working."}</p><Link className="text-link" href={es ? "/soluciones/empresas-de-servicios" : "/en/solutions/service-businesses"}>{es ? "Explorar mi negocio" : "Explore my business"} ↗</Link></div></article>
  </div><p className={styles.imageNote}>{es ? "Fotografías ilustrativas; no representan clientes ni integrantes de RCP." : "Illustrative photography; not RCP clients or team members."}</p></div></section>;
}
