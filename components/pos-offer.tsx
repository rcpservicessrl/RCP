import Link from "next/link";
import type { Locale } from "@/lib/types";
import { posOffer, posOfferDiagnosisHref } from "@/lib/pos-offer";
import styles from "./pos-offer.module.css";

export function PosOffer({ locale, showDetails = false }: { locale: Locale; showDetails?: boolean }) {
  const es = locale === "es";
  const number = new Intl.NumberFormat(es ? "es-DO" : "en-US");
  return <section className={styles.section} id="pos-ecf" aria-labelledby="pos-offer-title">
    <div className={`container ${styles.grid}`}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>{es ? "POS + facturación electrónica · Disponible" : "POS + electronic invoicing · Available"}</p>
        <h2 id="pos-offer-title">{es ? "Vende, controla tu inventario y factura electrónicamente." : "Sell, manage inventory and issue electronic invoices."}</h2>
        <p>{es ? "Implementamos sistemas de punto de venta integrados con e-CF para pequeños negocios en República Dominicana. Una operación conectada, con preparación, capacitación y acompañamiento de RCP." : "We implement point-of-sale systems integrated with e-CF for small businesses in the Dominican Republic. A connected operation with preparation, training and RCP support."}</p>
        <div className={styles.actions}>
          <Link className="button button--primary" href={posOfferDiagnosisHref(locale)}>{es ? "Solicitar mi oferta POS + e-CF" : "Request my POS + e-CF quote"} →</Link>
          <Link className="text-link" href={es ? "/demo" : "/en/demo"}>{es ? "Explorar la demo" : "Explore the demo"} →</Link>
          {showDetails && <Link className="text-link" href={es ? "/facturacion-electronica" : "/en/electronic-invoicing"}>{es ? "Ver el servicio e-CF" : "View the e-CF service"} →</Link>}
        </div>
        <p className={styles.note}>{es ? "La demo usa datos ficticios y simula documentos fiscales. La emisión real se habilita en la implementación de tu negocio." : "The demo uses fictional data and simulated fiscal documents. Actual issuance is enabled during your business implementation."}</p>
      </div>
      <article className={styles.card}>
        <p className={styles.eyebrow}>{es ? "Oferta de implementación POS Esencial" : "Essential POS implementation offer"}</p>
        <h3>{es ? "Implementación desde" : "Implementation from"}</h3>
        <p className={styles.price}>RD$ {number.format(posOffer.implementation.startingPrice)}</p>
        <p className={styles.cadence}>{es ? "Pago único · licencia y emisión aparte" : "One-time fee · license and issuance separate"}</p>
        <p>{posOffer.scope[locale]}</p>
        <div className={styles.support}>
          <h4>{es ? "Acompañamiento opcional" : "Optional ongoing support"}</h4>
          <p><strong>{es ? "Desde" : "From"} RD$ {number.format(posOffer.accompaniment.startingPrice)} / {es ? "mes" : "month"}</strong></p>
          <p>{es ? "Seguimiento operativo, orientación de uso y canal de soporte con alcance y horario acordados. Este importe corresponde al acompañamiento de RCP; no es el precio de la licencia POS." : "Operational follow-up, usage guidance and a support channel with agreed scope and hours. This fee covers RCP support; it is not the POS license price."}</p>
        </div>
        <h4>{es ? "Costos que se cotizan aparte" : "Costs quoted separately"}</h4>
        <p>{posOffer.separateCosts[locale]}</p>
        <h4>{es ? "Para activar e-CF" : "To activate e-CF"}</h4>
        <p>{posOffer.requirements[locale]}</p>
        <p className={styles.terms}>{posOffer.terms[locale]}</p>
      </article>
    </div>
  </section>;
}
