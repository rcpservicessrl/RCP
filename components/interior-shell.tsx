"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/types";
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
      <footer className="site-footer site-footer--interior">
        <div className="container site-footer__top">
          <div><Image className="footer-logo" src="/assets/brand/logos/logo_rcp_lockup_3p_oscuro.png" width={380} height={125} alt={locale === "es" ? "RCP Services · Renovación · Consultoría · Publicidad" : "RCP Services · Renewal · Consulting · Advertising"} /><p>{locale === "es" ? "Le damos nuevo impulso a tu negocio." : "We give your business new momentum."}</p></div>
          <div><small>{locale === "es" ? "Explorar" : "Explore"}</small><Link href={locale === "es" ? "/servicios" : "/en/services"}>{locale === "es" ? "Servicios" : "Services"}</Link><Link href={locale === "es" ? "/catalogo" : "/en/catalog"}>{locale === "es" ? "Catálogo" : "Catalog"}</Link><Link href={locale === "es" ? "/software-a-la-medida" : "/en/custom-software"}>{locale === "es" ? "Software a la medida" : "Custom software"}</Link><Link href={locale === "es" ? "/facturacion-electronica" : "/en/electronic-invoicing"}>{locale === "es" ? "Facturación electrónica" : "Electronic invoicing"}</Link><Link href={locale === "es" ? "/sectores" : "/en/sectors"}>{locale === "es" ? "Sectores" : "Sectors"}</Link></div>
          <div><small>{locale === "es" ? "Empresa" : "Company"}</small><Link href={locale === "es" ? "/nosotros" : "/en/about"}>{locale === "es" ? "Nosotros" : "About"}</Link><Link href={locale === "es" ? "/como-trabajamos" : "/en/how-we-work"}>{locale === "es" ? "Cómo trabajamos" : "How we work"}</Link><Link href={locale === "es" ? "/recursos" : "/en/resources"}>{locale === "es" ? "Recursos" : "Resources"}</Link><Link href={locale === "es" ? "/especialistas" : "/en/specialists"}>{locale === "es" ? "Red de especialistas" : "Specialist network"}</Link></div>
          <div><small>{locale === "es" ? "Contacto" : "Contact"}</small><Link href={locale === "es" ? "/contacto" : "/en/contact"}>{locale === "es" ? "Hablar con RCP" : "Talk to RCP"}</Link><a href="mailto:info@rcp.services">info@rcp.services</a><a href="https://wa.me/18298068092" target="_blank" rel="noreferrer">+1 829 806 8092</a><span>Santo Domingo, República Dominicana</span></div>
        </div>
        <div className="container site-footer__bottom"><span>© {new Date().getFullYear()} RCP Services SRL · RNC 132-147103</span><nav><Link href={locale === "es" ? "/privacidad" : "/en/privacy"}>{locale === "es" ? "Privacidad" : "Privacy"}</Link><Link href={locale === "es" ? "/terminos" : "/en/terms"}>{locale === "es" ? "Términos" : "Terms"}</Link><Link href={locale === "es" ? "/cookies" : "/en/cookies"}>Cookies</Link><Link href={locale === "es" ? "/accesibilidad" : "/en/accessibility"}>{locale === "es" ? "Accesibilidad" : "Accessibility"}</Link></nav></div>
      </footer>
      <PulsoHelp locale={locale} onOpenSearch={() => setSearchOpen(true)} />
      <ConsentBanner locale={locale} />
      <CursorHalo />
    </>
  );
}
