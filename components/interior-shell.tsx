"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { Locale } from "@/lib/types";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SearchPalette } from "@/components/search-palette";
import { PulsoHelp } from "@/components/pulso-help";
import { ConsentBanner } from "@/components/consent-banner";
import { InteriorMotion } from "@/components/interior-motion";
import { CursorHalo } from "@/components/cursor-halo";

export function InteriorShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  useEffect(() => {
    document.documentElement.lang = locale === "es" ? "es-DO" : "en-US";
  }, [locale]);
  return (
    <>
      <SiteHeader locale={locale} onOpenSearch={() => setSearchOpen(true)} />
      <SearchPalette locale={locale} open={searchOpen} onClose={() => setSearchOpen(false)} />
      <InteriorMotion language={locale === "es" ? "es-DO" : "en-US"}>{children}</InteriorMotion>
      <SiteFooter locale={locale} interior />
      <PulsoHelp locale={locale} onOpenSearch={() => setSearchOpen(true)} />
      <ConsentBanner locale={locale} />
      <CursorHalo />
    </>
  );
}
