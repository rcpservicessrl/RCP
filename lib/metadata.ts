import type { Metadata } from "next";
import type { Locale } from "@/lib/types";

type LocalizedPaths = {
  es: string;
  en: string;
};

type PublicPageMetadataInput = {
  locale: Locale;
  title: string;
  description: string;
  canonical: string;
  paths: LocalizedPaths;
};

const socialImage = {
  url: "/logo_rcp_fondo_claro.png",
  width: 2000,
  height: 788,
  alt: "RCP Services",
};

export function createPublicPageMetadata({
  locale,
  title,
  description,
  canonical,
  paths,
}: PublicPageMetadataInput): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical,
      languages: { "es-DO": paths.es, "en-US": paths.en },
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
      locale: locale === "es" ? "es_DO" : "en_US",
      alternateLocale: locale === "es" ? "en_US" : "es_DO",
      siteName: "RCP Services",
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage.url],
    },
  };
}
