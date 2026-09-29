import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Montserrat, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import { headers } from "next/headers";
import { AudioProvider } from "@/components/audio-provider";
import { JsonLd } from "@/components/json-ld";
import { homeDescriptions } from "@/lib/public-contact";
import { organizationJsonLd, websiteJsonLd } from "@/lib/structured-data";
import "./globals.css";
import "./editorial-system.css";
import "./customer-journey.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rcp.services";
const deploymentEnvironment = process.env.RCP_DEPLOYMENT_ENV ?? process.env.VERCEL_ENV ?? "development";
const isPublicProduction = deploymentEnvironment === "production";
const montserrat = Montserrat({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-montserrat", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-space-grotesk", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "RCP Services | Estrategia que transforma. Tecnología que impulsa.",
    template: "%s | RCP Services",
  },
  description: homeDescriptions.es,
  applicationName: "RCP Services",
  authors: [{ name: "RCP Services SRL", url: siteUrl }],
  creator: "RCP Services SRL",
  publisher: "RCP Services SRL",
  verification: {
    google: "pB_WF5BiCe7lQ-brB0yIEuzZh_15pKuQ7OUSJxm5UFY",
    other: { "msvalidate.01": "C79DA2E05C8B71C55756078EA7E5991D" },
  },
  formatDetection: { email: false, address: false, telephone: false },
  icons: {
    icon: [{ url: "/icono-rcp.png", sizes: "512x512", type: "image/png" }],
    apple: [{ url: "/icono-rcp.png", sizes: "512x512", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "es_DO",
    alternateLocale: "en_US",
    siteName: "RCP Services",
    title: "RCP Services | Estrategia que transforma. Tecnología que impulsa.",
    description: "Le damos nuevo impulso a tu negocio con Renovación, Consultoría y Publicidad.",
    url: siteUrl,
    images: [{ url: "/logo_rcp_fondo_claro.png", width: 2000, height: 788, alt: "RCP Services" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "RCP Services",
    description: "Le damos nuevo impulso a tu negocio con Renovación, Consultoría y Publicidad.",
    images: ["/logo_rcp_fondo_claro.png"],
  },
  robots: {
    index: isPublicProduction,
    follow: isPublicProduction,
    googleBot: { index: isPublicProduction, follow: isPublicProduction, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#FEFEFE" },
  ],
  colorScheme: "dark light",
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    <html data-scroll-behavior="smooth" lang="es-DO" data-theme="light" suppressHydrationWarning className={`${montserrat.variable} ${spaceGrotesk.variable}`}>
      <head>
        <Script src="/theme-init.js" strategy="beforeInteractive" nonce={nonce} />
      </head>
      <body><JsonLd data={organizationJsonLd} /><JsonLd data={websiteJsonLd} /><AudioProvider>{children}</AudioProvider></body>
    </html>
  );
}
