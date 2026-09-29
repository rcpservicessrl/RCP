"use client";

import Image from "next/image";
import { useState } from "react";
import type { Locale } from "@/lib/types";
import styles from "./client-showcase.module.css";

type Copy = { es: string; en: string };
type ShowcaseId = "la-solucion" | "fenomeno" | "comedor" | "norcentral" | "moreno" | "ropa";
type Screen = { src: string; label: Copy; alt: Copy };
type Showcase = {
  id: ShowcaseId;
  shortName: string;
  name: Copy;
  eyebrow: Copy;
  product: Copy;
  summary: Copy;
  modules: Copy[];
  capabilities: Copy[];
  screens: Screen[];
  quote: Copy;
};

const showcases: Showcase[] = [
  {
    id: "la-solucion",
    shortName: "TE",
    name: { es: "Tienda de Embutidos", en: "Deli Store" },
    eyebrow: { es: "Punto de venta e inventario", en: "Point of sale and inventory" },
    product: { es: "POS especializado para venta por unidad y peso", en: "Specialized POS for unit and weight sales" },
    summary: { es: "Venta de mostrador, inventario, lotes, vencimientos, caja y compras en una experiencia rápida.", en: "Counter sales, inventory, batches, expirations, cash and purchasing in one fast experience." },
    modules: [{ es: "Punto de venta", en: "Point of sale" }, { es: "Inventario", en: "Inventory" }, { es: "Lotes", en: "Batches" }, { es: "Caja", en: "Cash" }],
    capabilities: [{ es: "Venta rápida", en: "Fast checkout" }, { es: "Control por peso", en: "Weight control" }, { es: "Inventario y lotes", en: "Inventory and batches" }, { es: "Compras y caja", en: "Purchasing and cash" }],
    screens: [
      { src: "/showcase/embutidos-pos.png", label: { es: "Punto de venta", en: "Point of sale" }, alt: { es: "Punto de venta demostrativo para tienda de embutidos", en: "Demo point of sale for a deli store" } },
      { src: "/showcase/embutidos-inventario.png", label: { es: "Inventario", en: "Inventory" }, alt: { es: "Inventario demostrativo para tienda de embutidos", en: "Demo inventory for a deli store" } },
    ],
    quote: { es: "El equipo encuentra productos y controla existencias sin salir del flujo de venta.", en: "The team finds products and controls stock without leaving the sales workflow." },
  },
  {
    id: "fenomeno",
    shortName: "LS",
    name: { es: "Liquor Store", en: "Liquor Store" },
    eyebrow: { es: "Operación comercial por roles", en: "Role-based retail operations" },
    product: { es: "Punto de venta y control operativo para liquor store", en: "Point of sale and operational control for a liquor store" },
    summary: { es: "Ventas, caja, compras, inventario físico, promociones, reportes y auditoría conectados.", en: "Sales, cash, purchasing, physical inventory, promotions, reporting and auditing connected." },
    modules: [{ es: "Punto de venta", en: "Point of sale" }, { es: "Inventario físico", en: "Physical inventory" }, { es: "Promociones", en: "Promotions" }, { es: "Auditoría", en: "Auditing" }],
    capabilities: [{ es: "POS y caja", en: "POS and cash" }, { es: "Conteo físico", en: "Physical counts" }, { es: "Promociones", en: "Promotions" }, { es: "Operación por roles", en: "Role-based operation" }],
    screens: [
      { src: "/showcase/liquor-pos.png", label: { es: "Punto de venta", en: "Point of sale" }, alt: { es: "Punto de venta demostrativo para liquor store", en: "Demo point of sale for a liquor store" } },
      { src: "/showcase/liquor-inventario.png", label: { es: "Inventario físico", en: "Physical inventory" }, alt: { es: "Conteo físico demostrativo para liquor store", en: "Demo physical count for a liquor store" } },
    ],
    quote: { es: "Cada rol encuentra sus tareas, desde la venta hasta el conteo y el cierre.", en: "Each role finds its tasks, from sales through counting and closing." },
  },
  {
    id: "comedor",
    shortName: "CD",
    name: { es: "Comedor", en: "Dining Service" },
    eyebrow: { es: "Operación móvil para alimentos", en: "Mobile food-service operations" },
    product: { es: "Punto de venta, menú y pedidos de catering", en: "Point of sale, menu and catering orders" },
    summary: { es: "Una experiencia móvil para tomar pedidos, organizar el menú, gestionar catering y mantener la operación conectada.", en: "A mobile experience to take orders, organize the menu, manage catering and keep operations connected." },
    modules: [{ es: "Panel operativo", en: "Operations dashboard" }, { es: "Punto de venta", en: "Point of sale" }, { es: "Pedidos de catering", en: "Catering orders" }, { es: "Reportes", en: "Reports" }, { es: "Configuración", en: "Settings" }, { es: "Manual", en: "Manual" }],
    capabilities: [{ es: "Menú por categorías", en: "Category menu" }, { es: "Pedidos de catering", en: "Catering orders" }, { es: "Caja y cierres", en: "Cash and closing" }, { es: "Paneles y reportes", en: "Dashboards and reports" }, { es: "Operación móvil", en: "Mobile operations" }],
    screens: [
      { src: "/showcase/mc-cuisine-panel.png", label: { es: "Panel operativo", en: "Operations dashboard" }, alt: { es: "Panel operativo móvil demostrativo para comedor", en: "Demo mobile operations dashboard for a dining service" } },
      { src: "/showcase/mc-cuisine-pos.png", label: { es: "Punto de venta móvil", en: "Mobile point of sale" }, alt: { es: "Punto de venta móvil demostrativo para comedor", en: "Demo mobile point of sale for a dining service" } },
      { src: "/showcase/mc-cuisine-menu.png", label: { es: "Menú e inventario", en: "Menu and inventory" }, alt: { es: "Menú móvil demostrativo para comedor", en: "Demo mobile menu for a dining service" } },
      { src: "/showcase/mc-cuisine-modulos.png", label: { es: "Módulos", en: "Modules" }, alt: { es: "Menú de módulos móvil demostrativo para comedor", en: "Demo mobile modules menu for a dining service" } },
      { src: "/showcase/mc-cuisine-catering.png", label: { es: "Pedidos catering", en: "Catering orders" }, alt: { es: "Pedidos de catering móviles demostrativos para comedor", en: "Demo mobile catering orders for a dining service" } },
      { src: "/showcase/mc-cuisine-analiticas.png", label: { es: "Analíticas", en: "Analytics" }, alt: { es: "Analíticas móviles demostrativas para comedor", en: "Demo mobile analytics for a dining service" } },
      { src: "/showcase/mc-cuisine-resumen.png", label: { es: "Resumen operativo", en: "Operations summary" }, alt: { es: "Resumen operativo móvil demostrativo para comedor", en: "Demo mobile operations summary for a dining service" } },
      { src: "/showcase/mc-cuisine-reportes.png", label: { es: "Reportes", en: "Reports" }, alt: { es: "Reportes móviles demostrativos para comedor", en: "Demo mobile reports for a dining service" } },
      { src: "/showcase/mc-cuisine-configuracion.png", label: { es: "Configuración", en: "Settings" }, alt: { es: "Configuración móvil demostrativa para comedor", en: "Demo mobile settings for a dining service" } },
      { src: "/showcase/mc-cuisine-manual.png", label: { es: "Manual operativo", en: "Operations manual" }, alt: { es: "Manual móvil demostrativo para comedor", en: "Demo mobile manual for a dining service" } },
    ],
    quote: { es: "El equipo puede encontrar el menú, tomar pedidos y consultar sus procesos desde una pantalla pensada para móvil.", en: "The team can find the menu, take orders and consult its processes from a mobile-first screen." },
  },
  {
    id: "norcentral",
    shortName: "IM",
    name: { es: "Imprenta", en: "Print Shop" },
    eyebrow: { es: "Producción gráfica", en: "Print production" },
    product: { es: "Gestión integral para impresión y personalización", en: "Integrated print and personalization management" },
    summary: { es: "Una operación conectada desde catálogo y cotización hasta producción, calidad y entrega.", en: "A connected operation from catalog and quotation through production, quality and delivery." },
    modules: [{ es: "Cotizaciones", en: "Quotations" }, { es: "Catálogo", en: "Catalog" }, { es: "Kanban", en: "Kanban" }, { es: "Calidad", en: "Quality" }],
    capabilities: [{ es: "Catálogo configurable", en: "Configurable catalog" }, { es: "Pedidos y cotizaciones", en: "Orders and quotations" }, { es: "Flujo Kanban", en: "Kanban workflow" }, { es: "Control de calidad", en: "Quality control" }],
    screens: [
      { src: "/showcase/imprenta-kanban.png", label: { es: "Producción Kanban", en: "Production Kanban" }, alt: { es: "Tablero Kanban demostrativo para imprenta", en: "Demo Kanban board for a print shop" } },
      { src: "/showcase/imprenta-catalogo.png", label: { es: "Catálogo configurable", en: "Configurable catalog" }, alt: { es: "Catálogo demostrativo para imprenta", en: "Demo catalog for a print shop" } },
    ],
    quote: { es: "Ventas, diseño y producción pueden seguir cada trabajo dentro del mismo recorrido.", en: "Sales, design and production can follow every job within the same workflow." },
  },
  {
    id: "moreno",
    shortName: "EM",
    name: { es: "Electromueble", en: "Home Appliances" },
    eyebrow: { es: "Catálogo digital y comercio conversacional", en: "Digital catalog and conversational commerce" },
    product: { es: "Catálogo de electrodomésticos, muebles y electrónica", en: "Home appliance, furniture and electronics catalog" },
    summary: { es: "Exploración por categorías, administración de productos y solicitud asistida por WhatsApp.", en: "Category browsing, product administration and WhatsApp-assisted requests." },
    modules: [{ es: "Catálogo", en: "Catalog" }, { es: "Categorías", en: "Categories" }, { es: "Ofertas", en: "Offers" }, { es: "Configuración", en: "Settings" }],
    capabilities: [{ es: "Catálogo por categorías", en: "Category catalog" }, { es: "Detalle de producto", en: "Product detail" }, { es: "Contenido editable", en: "Editable content" }, { es: "Conversión por WhatsApp", en: "WhatsApp conversion" }],
    screens: [
      { src: "/showcase/electromueble-catalogo.png", label: { es: "Catálogo público", en: "Public catalog" }, alt: { es: "Catálogo demostrativo para electromueble", en: "Demo catalog for a home-appliance store" } },
      { src: "/showcase/electromueble-configuracion.png", label: { es: "Configuración", en: "Settings" }, alt: { es: "Configuración demostrativa de un catálogo de electromuebles", en: "Demo settings for a home-appliance catalog" } },
    ],
    quote: { es: "El negocio actualiza su vitrina y el público descubre productos desde cualquier dispositivo.", en: "The business updates its storefront and customers discover products from any device." },
  },
  {
    id: "ropa",
    shortName: "TR",
    name: { es: "Tienda de Ropa", en: "Clothing Store" },
    eyebrow: { es: "Moda, variantes y apartados", en: "Fashion, variants and layaways" },
    product: { es: "Gestión comercial para tallas, colores y reservas", en: "Retail management for sizes, colors and reservations" },
    summary: { es: "Inventario por variantes, punto de venta, promociones y apartados con abonos y vencimientos.", en: "Variant inventory, point of sale, promotions and layaways with payments and due dates." },
    modules: [{ es: "Inventario", en: "Inventory" }, { es: "Tallas y colores", en: "Sizes and colors" }, { es: "Apartados", en: "Layaways" }, { es: "Promociones", en: "Promotions" }],
    capabilities: [{ es: "Tallas y colores", en: "Sizes and colors" }, { es: "Apartados y abonos", en: "Layaways and payments" }, { es: "Inventario visual", en: "Visual inventory" }, { es: "Promociones", en: "Promotions" }],
    screens: [
      { src: "/showcase/ropa-inventario.png", label: { es: "Inventario", en: "Inventory" }, alt: { es: "Inventario demostrativo para tienda de ropa", en: "Demo inventory for a clothing store" } },
      { src: "/showcase/ropa-apartados.png", label: { es: "Apartados", en: "Layaways" }, alt: { es: "Apartados demostrativos sin información de clientes", en: "Demo layaways without customer information" } },
    ],
    quote: { es: "Las variantes y los apartados se administran con claridad desde una sola operación.", en: "Variants and layaways are managed clearly from one operation." },
  },
];

export function ClientShowcase({ locale }: { locale: Locale }) {
  const [activeId, setActiveId] = useState<ShowcaseId>("la-solucion");
  const [screenIndex, setScreenIndex] = useState(0);
  const active = showcases.find((item) => item.id === activeId) ?? showcases[0];
  const text = (copy: Copy) => copy[locale === "en" ? "en" : "es"];
  const activeScreen = active.screens[Math.min(screenIndex, active.screens.length - 1)];

  const selectShowcase = (id: ShowcaseId) => {
    setActiveId(id);
    setScreenIndex(0);
  };

  return (
    <section id="experiencias" className={styles.section} aria-labelledby="experiencias-title">
      <div className={styles.heading}>
        <p className={styles.kicker}>{locale === "en" ? "RCP FAMILY · REAL INTERFACES" : "FAMILIA RCP · INTERFACES REALES"}</p>
        <h2 id="experiencias-title">{locale === "en" ? "See how each system adapts to the business" : "Mira cómo cada sistema se adapta al negocio"}</h2>
        <p>{locale === "en" ? "Real, anonymized views of systems developed by RCP Services. Names, users and operational values have been replaced with demonstration content." : "Vistas reales y anonimizadas de sistemas desarrollados por RCP Services. Los nombres, usuarios y valores operativos fueron sustituidos por contenido demostrativo."}</p>
      </div>

      <div className={styles.tabs} role="tablist" aria-label={locale === "en" ? "Business experiences" : "Experiencias por tipo de negocio"}>
        {showcases.map((item) => (
          <button key={item.id} id={`showcase-tab-${item.id}`} type="button" role="tab" aria-selected={active.id === item.id} aria-controls={`showcase-panel-${item.id}`} className={active.id === item.id ? styles.activeTab : styles.tab} onClick={() => selectShowcase(item.id)}>
            <span className={styles.tabMark}>{item.shortName}</span>
            <span><strong>{text(item.name)}</strong><small>{text(item.eyebrow)}</small></span>
          </button>
        ))}
      </div>

      <div id={`showcase-panel-${active.id}`} role="tabpanel" aria-labelledby={`showcase-tab-${active.id}`} className={`${styles.experience} ${styles[active.id]}`}>
        <div className={styles.browser}>
          <div className={styles.browserBar}>
            <span className={styles.browserDots} aria-hidden="true"><i /><i /><i /></span>
            <span className={styles.browserAddress}>{text(active.name)} · DEMO</span>
            <span className={styles.safeBadge}>{locale === "en" ? "ANONYMIZED VIEW" : "VISTA ANONIMIZADA"}</span>
          </div>
          {active.id === "comedor" ? (
            <div className={styles.mobileCollage} aria-label={locale === "en" ? "Mobile dining service modules" : "Módulos móviles para comedor"}>
              {active.screens.map((screen, index) => (
                <figure key={screen.src} className={styles.mobileShot}>
                  <Image src={screen.src} alt={text(screen.alt)} fill sizes="(max-width: 720px) 30vw, 22vw" className={styles.mobileShotImage} />
                  <figcaption><span>{String(index + 1).padStart(2, "0")}</span>{text(screen.label)}</figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <>
              <div className={styles.screenshotViewport}>
                <Image key={activeScreen.src} src={activeScreen.src} alt={text(activeScreen.alt)} fill sizes="(max-width: 900px) 96vw, 68vw" className={styles.screenshotImage} />
                <span className={styles.demoStamp}>{locale === "en" ? "REAL INTERFACE · DEMO DATA" : "INTERFAZ REAL · DATOS DEMO"}</span>
              </div>
              <div className={styles.screenRail} role="tablist" aria-label={locale === "en" ? "Available views" : "Vistas disponibles"}>
                {active.screens.map((screen, index) => (
                  <button key={screen.src} type="button" role="tab" aria-selected={screenIndex === index} className={screenIndex === index ? styles.activeScreen : styles.screenButton} onClick={() => setScreenIndex(index)}>
                    <span>{String(index + 1).padStart(2, "0")}</span>{text(screen.label)}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <aside className={styles.story}>
          <p className={styles.storyIndex}>{String(showcases.indexOf(active) + 1).padStart(2, "0")} / 06</p>
          <span className={styles.storyEyebrow}>{text(active.eyebrow)}</span>
          <h3>{text(active.name)}</h3><h4>{text(active.product)}</h4><p>{text(active.summary)}</p>
          <div className={styles.capabilities}>{active.capabilities.map((capability) => <span key={text(capability)}>{text(capability)}</span>)}</div>
          <div className={styles.moduleList}>{active.modules.map((module) => <span key={text(module)}>{text(module)}</span>)}</div>
          <blockquote>“{text(active.quote)}”</blockquote>
          <small className={styles.quoteLabel}>{locale === "en" ? "SIMULATED TESTIMONIAL · NOT ATTRIBUTED TO A CLIENT" : "TESTIMONIO SIMULADO · NO ATRIBUIDO A UN CLIENTE"}</small>
          <a href={locale === "en" ? "/en/diagnosis?need=ordenar#solicitud" : "/diagnostico?necesidad=ordenar#solicitud"}>{locale === "en" ? "Design my system" : "Diseñar mi sistema"}<span aria-hidden="true">↗</span></a>
        </aside>
      </div>

      <p className={styles.disclaimer}><strong>{locale === "en" ? "Privacy note:" : "Nota de privacidad:"}</strong>{" "}{locale === "en" ? "These are real product interfaces with fictional demonstration content. Client identities, users, contacts, prices and business statistics are not published." : "Estas son interfaces reales con contenido demostrativo ficticio. No se publican identidades de clientes, usuarios, contactos, precios ni estadísticas comerciales."}</p>
    </section>
  );
}
