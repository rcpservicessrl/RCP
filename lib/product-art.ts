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
} as const;

export type ProductArtKind = keyof typeof productArt;

export function catalogArt(id: string, category: string, pillar: string): ProductArtKind {
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
