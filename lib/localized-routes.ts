export const localizedRoutes = [
  ["/", "/en"],
  ["/servicios", "/en/services"],
  ["/servicios/renovacion", "/en/services/renewal"],
  ["/servicios/consultoria", "/en/services/consulting"],
  ["/servicios/publicidad", "/en/services/advertising"],
  ["/catalogo", "/en/catalog"],
  ["/soluciones-tecnologicas", "/en/technology-solutions"],
  ["/software-a-la-medida", "/en/custom-software"],
  ["/facturacion-electronica", "/en/electronic-invoicing"],
  ["/como-trabajamos", "/en/how-we-work"],
  ["/sectores", "/en/sectors"],
  ["/soluciones/comercios", "/en/solutions/retail"],
  ["/soluciones/empresas-de-servicios", "/en/solutions/service-businesses"],
  ["/herramientas", "/en/tools"],
  ["/diagnostico", "/en/diagnosis"],
  ["/contacto", "/en/contact"],
  ["/recursos", "/en/resources"],
  ["/especialistas", "/en/specialists"],
  ["/especialistas/postular", "/en/specialists/apply"],
  ["/nosotros", "/en/about"],
  ["/media", "/en/media"],
  ["/privacidad", "/en/privacy"],
  ["/terminos", "/en/terms"],
  ["/cookies", "/en/cookies"],
  ["/accesibilidad", "/en/accessibility"],
  ["/portal", "/en/portal"],
  ["/checkout", "/en/request"],
  ["/carreras", "/en/careers"]
] as const;

export function alternateRoute(pathname: string, locale: "es" | "en", search = "") {
  const pair = localizedRoutes.find(paths => paths.some(path => path === pathname));
  const target = pair ? pair[locale === "es" ? 1 : 0] : locale === "es" ? "/en" : "/";
  const current = new URLSearchParams(search);
  const translated = new URLSearchParams();
  for (const [es, en] of [["servicio", "service"], ["servicios", "services"], ["necesidad", "need"], ["capacidad", "capability"], ["solucion", "solution"], ["sector", "sector"]]) {
    const value = current.get(locale === "es" ? es : en) ?? current.get(locale === "es" ? en : es);
    if (value && /^[a-z0-9,-]{1,250}$/i.test(value)) translated.set(locale === "es" ? en : es, value);
  }
  return `${target}${translated.size ? `?${translated}` : ""}`;
}
