import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  typedRoutes: true,
  images: {
    formats: ["image/webp"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/assets/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/servicios.html", destination: "/servicios", permanent: true },
      { source: "/tienda.html", destination: "/catalogo", permanent: true },
      { source: "/diagnostico.html", destination: "/diagnostico", permanent: true },
      { source: "/nosotros.html", destination: "/nosotros", permanent: true },
      { source: "/media.html", destination: "/media", permanent: true },
      { source: "/carreras.html", destination: "/especialistas", permanent: true },
      { source: "/portal.html", destination: "/portal", permanent: true },
      { source: "/dashboard.html", destination: "/portal", permanent: true },
      { source: "/checkout.html", destination: "/checkout", permanent: true },
      { source: "/privacidad.html", destination: "/privacidad", permanent: true },
      { source: "/terminos.html", destination: "/terminos", permanent: true },
      { source: "/cookies.html", destination: "/cookies", permanent: true },
      { source: "/accesibilidad.html", destination: "/accesibilidad", permanent: true },
      { source: "/reembolsos.html", destination: "/terminos", permanent: true },
      { source: "/tienda", destination: "/catalogo", permanent: true },
      { source: "/carreras", destination: "/especialistas", permanent: true },
      { source: "/en/careers", destination: "/en/specialists", permanent: true },
      { source: "/dashboard", destination: "/portal", permanent: false },
      { source: "/onboarding", destination: "/portal", permanent: false },
      { source: "/formulario-contacto", destination: "/diagnostico", permanent: true },
      { source: "/reembolsos", destination: "/terminos", permanent: false },
      { source: "/propuesta-inversion", destination: "/", permanent: false },
      { source: "/quienes-somos", destination: "/nosotros", permanent: true },
      { source: "/renovacion", destination: "/servicios/renovacion", permanent: true },
      { source: "/consultoria", destination: "/servicios/consultoria", permanent: true },
      { source: "/publicidad", destination: "/servicios/publicidad", permanent: true },
      { source: "/tecnologia", destination: "/soluciones-tecnologicas", permanent: true },
      { source: "/productos", destination: "/catalogo", permanent: true },
      { source: "/evaluacion-rcp-360", destination: "/diagnostico", permanent: true },
      { source: "/recursos/facturacion-electronica", destination: "/facturacion-electronica", permanent: true },
      { source: "/productos/erp", destination: "/soluciones-tecnologicas?capacidad=erp", permanent: true },
      { source: "/productos/pos-inventario", destination: "/soluciones-tecnologicas?capacidad=pos", permanent: true },
      { source: "/productos/paginas-web-catalogos", destination: "/catalogo?servicio=sitios-web", permanent: true },
      { source: "/productos/software-a-la-medida", destination: "/software-a-la-medida", permanent: true },
      { source: "/productos/automatizacion", destination: "/soluciones-tecnologicas?capacidad=bpa", permanent: true },
    ];
  },
};

export default nextConfig;
