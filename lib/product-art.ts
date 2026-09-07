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
  "modelo-operativo-raci": "/assets/catalog-editorial/modelo-operativo-raci.webp",
  "analitica-marketing": "/assets/catalog-editorial/analitica-marketing.webp",
  "expediente-necesidad": "/assets/catalog-editorial/expediente-necesidad.webp",
  "documentacion-empresarial": "/assets/catalog-editorial/documentacion-empresarial.webp",
  "sop-documentacion": "/assets/catalog-editorial/sop-documentacion.webp",
  "identidad-empresarial": "/assets/catalog-editorial/identidad-empresarial.webp",
  "cambio-adopcion": "/assets/catalog-editorial/cambio-adopcion.webp",
  "iguala-contable": "/assets/catalog-editorial/iguala-contable.webp",
  "control-financiero": "/assets/catalog-editorial/control-financiero.webp",
  "riesgo-cumplimiento": "/assets/catalog-editorial/riesgo-cumplimiento.webp",
  "estrategia-marca": "/assets/catalog-editorial/estrategia-marca.webp",
  "redes-community": "/assets/catalog-editorial/redes-community.webp",
  "seo-aeo": "/assets/catalog-editorial/seo-aeo.webp",
  "campanas-digitales": "/assets/catalog-editorial/campanas-digitales.webp",
  "papeleria-corporativa": "/assets/catalog-editorial/papeleria-corporativa.webp",
  "promocionales-impresos": "/assets/catalog-editorial/promocionales-impresos.webp",
  "etiquetas-empaques": "/assets/catalog-editorial/etiquetas-empaques.webp",
  "gran-formato": "/assets/catalog-editorial/gran-formato.webp",
} as const;

export type ProductArtKind = keyof typeof productArt;

/** Explicit assignments preserve a distinct illustration for every public service. */
export const catalogArtByService = {
  "diagnostico-rcp-360": "consulting",
  "expediente-necesidad": "expediente-necesidad",
  "blueprint-intervencion": "erp",
  "procesos-operativos": "processes",
  "sop-documentacion": "sop-documentacion",
  "modelo-operativo-raci": "modelo-operativo-raci",
  "experiencia-cliente": "crm",
  "identidad-empresarial": "identidad-empresarial",
  "cambio-adopcion": "cambio-adopcion",
  "formacion-intervencion": "training",
  "tableros-operacion": "saas",
  "consultoria-impositiva": "tax",
  "iguala-contable": "iguala-contable",
  "control-financiero": "control-financiero",
  "documentacion-empresarial": "documentacion-empresarial",
  "riesgo-cumplimiento": "riesgo-cumplimiento",
  "estrategia-marca": "estrategia-marca",
  "branding-identidad": "branding",
  "sitios-web": "web",
  "redes-community": "redes-community",
  "contenido-multimedia": "content",
  "seo-aeo": "seo-aeo",
  "campanas-digitales": "campanas-digitales",
  "analitica-marketing": "analitica-marketing",
  "papeleria-corporativa": "papeleria-corporativa",
  "promocionales-impresos": "promocionales-impresos",
  "etiquetas-empaques": "etiquetas-empaques",
  "gran-formato": "gran-formato",
  "letreros-rotulacion": "signage",
  "uniformes-textiles": "textiles",
  "merchandising-corporativo": "print",
} as const satisfies Record<string, ProductArtKind>;

export function catalogArt(id: string, category: string, pillar: string): ProductArtKind {
  if (Object.hasOwn(catalogArtByService, id)) {
    return catalogArtByService[id as keyof typeof catalogArtByService];
  }
  if (id === "blueprint-intervencion") return "erp";
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
