/** Natural scenes retained for the homepage and editorial sections, separate from catalog artwork. */
export const businessSceneIds = [
  "hero-team",
  "diagnostico-rcp-360", "expediente-necesidad", "sop-documentacion",
  "modelo-operativo-raci", "experiencia-cliente", "identidad-empresarial", "cambio-adopcion",
  "iguala-contable", "control-financiero", "documentacion-empresarial", "riesgo-cumplimiento",
  "estrategia-marca", "redes-community", "seo-aeo", "campanas-digitales", "analitica-marketing",
  "papeleria-corporativa", "promocionales-impresos", "etiquetas-empaques", "gran-formato",
] as const;

export function businessScene(id: string): string | undefined {
  return (businessSceneIds as readonly string[]).includes(id) ? `/assets/business-scenes/${id}.webp` : undefined;
}
