import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rcp.services";
  const lastModified = new Date("2026-08-11T00:00:00-04:00");
  const routes = [
    ["", 1, "weekly"],
    ["/servicios", 0.95, "weekly"],
    ["/servicios/renovacion", 0.9, "weekly"],
    ["/servicios/consultoria", 0.9, "weekly"],
    ["/servicios/publicidad", 0.9, "weekly"],
    ["/catalogo", 0.9, "weekly"],
    ["/soluciones-tecnologicas", 0.9, "weekly"],
    ["/software-a-la-medida", 0.85, "monthly"],
    ["/facturacion-electronica", 0.8, "monthly"],
    ["/como-trabajamos", 0.8, "monthly"],
    ["/sectores", 0.75, "monthly"],
    ["/diagnostico", 0.85, "monthly"],
    ["/contacto", 0.75, "monthly"],
    ["/recursos", 0.7, "monthly"],
    ["/especialistas", 0.7, "monthly"],
    ["/especialistas/postular", 0.55, "monthly"],
    ["/nosotros", 0.75, "monthly"],
    ["/media", 0.65, "monthly"],
    ["/privacidad", 0.3, "yearly"],
    ["/terminos", 0.3, "yearly"],
    ["/cookies", 0.3, "yearly"],
    ["/accesibilidad", 0.3, "yearly"],
    ["/en", 0.8, "weekly"],
    ["/en/services", 0.75, "weekly"],
    ["/en/services/renewal", 0.7, "weekly"],
    ["/en/services/consulting", 0.7, "weekly"],
    ["/en/services/advertising", 0.7, "weekly"],
    ["/en/catalog", 0.7, "weekly"],
    ["/en/technology-solutions", 0.7, "weekly"],
    ["/en/custom-software", 0.65, "monthly"],
    ["/en/electronic-invoicing", 0.6, "monthly"],
    ["/en/how-we-work", 0.6, "monthly"],
    ["/en/sectors", 0.55, "monthly"],
    ["/en/diagnosis", 0.65, "monthly"],
    ["/en/contact", 0.55, "monthly"],
    ["/en/resources", 0.5, "monthly"],
    ["/en/specialists", 0.5, "monthly"],
    ["/en/specialists/apply", 0.4, "monthly"],
    ["/en/about", 0.6, "monthly"],
    ["/en/media", 0.5, "monthly"],
    ["/en/privacy", 0.2, "yearly"],
    ["/en/terms", 0.2, "yearly"],
    ["/en/cookies", 0.2, "yearly"],
    ["/en/accessibility", 0.2, "yearly"],
  ] as const;

  return routes.map(([path, priority, changeFrequency]) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
