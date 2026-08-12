import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Montserrat, Space_Grotesk } from "next/font/google";
import { AudioProvider } from "@/components/audio-provider";
import "./globals.css";

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
  description: "Le damos nuevo impulso a tu negocio con Renovación, Consultoría y Publicidad, apoyadas por tecnología cuando aporta valor.",
  applicationName: "RCP Services",
  authors: [{ name: "RCP Services SRL", url: siteUrl }],
  creator: "RCP Services SRL",
  publisher: "RCP Services SRL",
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

const themeScript = `
  (() => {
    try {
      const stored = localStorage.getItem('rcp-theme');
      const theme = stored === 'light' || stored === 'dark'
        ? stored
        : (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
      document.documentElement.dataset.theme = theme;
      document.documentElement.style.colorScheme = theme;
      document.documentElement.lang = location.pathname === '/en' || location.pathname.startsWith('/en/') ? 'en-US' : 'es-DO';
    } catch (_) {}
  })();
`;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es-DO" data-theme="dark" suppressHydrationWarning className={`${montserrat.variable} ${spaceGrotesk.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body><AudioProvider>{children}</AudioProvider></body>
    </html>
  );
}
