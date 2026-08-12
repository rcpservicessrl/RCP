import type { Metadata } from "next";
import type { ReactNode } from "react";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rcp.services";

export const metadata: Metadata = {
  description: "We give your business new momentum through Renewal, Consulting and Advertising, supported by technology when it adds value.",
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "es_DO",
    siteName: "RCP Services",
    title: "RCP Services | New momentum for your business",
    description: "We give your business new momentum through Renewal, Consulting and Advertising.",
    url: `${siteUrl}/en`,
    images: [{ url: "/logo_rcp_fondo_claro.png", width: 2000, height: 788, alt: "RCP Services" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "RCP Services",
    description: "We give your business new momentum through Renewal, Consulting and Advertising.",
    images: ["/logo_rcp_fondo_claro.png"],
  },
};

export default function EnglishLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
