import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "RCP Services",
    short_name: "RCP Services",
    description: "Le damos nuevo impulso a tu negocio con Renovación, Consultoría y Publicidad, apoyadas por tecnología cuando aporta valor.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#FCB53F",
    lang: "es-DO",
    categories: ["business", "productivity"],
    icons: [
      { src: "/icono-rcp.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icono-rcp.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
