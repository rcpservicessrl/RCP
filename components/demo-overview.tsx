import { InteriorShell } from "@/components/interior-shell";
import type { Locale } from "@/lib/types";
import styles from "./demo-overview.module.css";

export function DemoOverview({ locale }: { locale: Locale }) {
  const es = locale === "es";
  const features = es ? [
    ["Vende y cobra", "Punto de venta, clientes por RNC ficticio, efectivo, tarjeta, transferencia, crédito y recibos."],
    ["Controla la mercancía", "Productos, compras, proveedores, movimientos, mermas, lotes, vencimientos y temperaturas."],
    ["Revisa tu dinero", "Apertura y cierre de caja, cuentas por cobrar y pagar, asientos contables y reportes."],
    ["Prueba la facturación", "Series B01/B02 y E31/E32/E34, conexión ficticia, aceptación, rechazo, consulta y reintentos."],
    ["Explora la administración", "Usuarios, permisos, bitácora, promociones, alertas, configuración e impresión."],
    ["Empieza otra vez", "Exporta los datos de tu prueba o reiníciala. Los cambios se conservan en tu pestaña."],
  ] : [
    ["Sell and collect", "Checkout, customers by fictional tax ID, cash, card, transfer, credit and receipts."],
    ["Manage inventory", "Products, purchases, suppliers, stock movements, losses, batches, expiry and temperatures."],
    ["Review your money", "Cash opening and closing, receivables, payables, journal entries and reports."],
    ["Try invoicing", "B01/B02 and E31/E32/E34 sequences, fictional connection, acceptance, rejection, status and retries."],
    ["Explore administration", "Users, permissions, activity log, promotions, alerts, settings and printing."],
    ["Start again", "Export your test data or reset the demo. Changes remain in your browser tab."],
  ];
  return <InteriorShell locale={locale}>
    <main>
      <section className="interior-hero interior-hero--technology"><div className="container">
        <p className="section-eyebrow">{es ? "Demo interactiva · Mercado Aurora" : "Interactive demo · Mercado Aurora"}</p>
        <h1>{es ? "Prueba una operación completa, de la venta al reporte." : "Try a complete workflow, from checkout to reports."}</h1>
        <p>{es ? "Entra sin registro y explora un comercio ficticio. Puedes hacer ventas, registrar compras y probar cómo se conectan inventario, caja y contabilidad." : "Enter without signing up and explore a fictional shop. Make sales, record purchases and try how inventory, cash and accounting work together."}</p>
        <div className="editorial-hero-actions"><a className="button button--primary" href="https://mercadodemo.rcp.services" target="_blank" rel="noopener noreferrer">{es ? "Abrir demo sin registro ↗" : "Open demo without signing up ↗"}</a><a className="button" href={es ? "/diagnostico" : "/en/diagnosis"}>{es ? "Quiero un sistema para mi negocio" : "I want a system for my business"}</a></div>
        <p><small>{es ? "El sistema está en español. Usa únicamente datos ficticios. La consulta de RNC y la facturación electrónica son simuladas, sin conexión a DGII ni validez fiscal." : "The app is in Spanish. Use fictional data only. Tax ID lookup and electronic invoicing are simulated, without a DGII connection or fiscal validity."}</small></p>
      </div></section>
      <section className={`technology-page-section ${styles.features}`}><div className="container">
        <h2>{es ? "Qué puedes probar" : "What you can try"}</h2>
        <div className={styles.grid}>{features.map(([title, text]) => <article key={title} className={styles.card}><h3>{title}</h3><p>{text}</p></article>)}</div>
        <p className="section-lead">{es ? "Recorrido sugerido: crea un cliente con RNC 000000004, vende con B01, registra una compra, revisa la caja y activa la simulación electrónica. Encontrarás una guía dentro de la demo." : "Suggested tour: create a customer with tax ID 000000004, issue B01, record a purchase, review cash and activate the electronic simulation. A guide is available inside the demo."}</p>
        <p>{es ? "Cada visitante tiene su propia prueba. Al cerrar la pestaña se descartan los cambios. La implementación real se adapta y valida según los procesos y requisitos de tu negocio." : "Each visitor has their own demo session. Closing the tab discards changes. A real implementation is adapted and validated for your business processes and requirements."}</p>
      </div></section>
    </main>
  </InteriorShell>;
}
