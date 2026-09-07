/** Canonical 2026 artwork; original files are preserved without alteration. */
export const productArt = {
  erp: "/assets/products-2026/01_ERP.png",
  crm: "/assets/products-2026/02_CRM.png",
  pos: "/assets/products-2026/03_POS.png",
  print: "/assets/products-2026/04_Merchandising_Impresos.png",
  saas: "/assets/products-2026/05_SaaS.png",
  consulting: "/assets/products-2026/06_Consultoria.png",
  web: "/assets/products-2026/07_Pagina_Web.png",
  tax: "/assets/products-2026/08_Consultoria_Impositiva.png",
  processes: "/assets/catalog-editorial/processes.png",
  training: "/assets/catalog-editorial/training.png",
  branding: "/assets/catalog-editorial/branding.png",
  content: "/assets/catalog-editorial/content.png",
  signage: "/assets/catalog-editorial/signage.png",
  textiles: "/assets/catalog-editorial/textiles.png",
} as const;

export type ProductArtKind = keyof typeof productArt;

export function catalogArt(id: string, category: string, pillar: string): ProductArtKind {
  if (id === "diagnostico-rcp-360") return "consulting";
  if (/uniformes|textiles/.test(id)) return "textiles";
  if (/letreros|rotulacion|banners|gran-formato/.test(id)) return "signage";
  if (/contenido|fotografia|video/.test(id)) return "content";
  if (/branding|identidad|posicionamiento|estrategia-marca/.test(id)) return "branding";
  if (/formacion|capacitacion|cambio-adopcion/.test(id)) return "training";
  if (/procesos|sop-|modelo-operativo|blueprint|expediente|documentacion/.test(id)) return "processes";
  if (/impositiva|contable|financiero|tss|cumplimiento|facturacion/.test(id)) return "tax";
  if (/impresos|exterior|merchandising/.test(category)) return "print";
  if (/sitios-web|seo|web/.test(id)) return "web";
  if (/cliente|crm|community|campanas/.test(id)) return "crm";
  if (/tableros|automatizacion/.test(id)) return "saas";
  return pillar === "renovacion" ? "erp" : "consulting";
}

export const solutionArt: Record<string, ProductArtKind> = {
  "organiza-operacion": "erp", "ventas-inventario": "pos",
  "web-catalogo-tienda": "web", "software-medida": "saas",
  "automatizacion-datos": "erp", "operacion-administrada": "saas",
};
