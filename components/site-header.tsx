"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/types";
import { CloseIcon, GlobeIcon, MenuIcon, MoonIcon, SearchIcon, SunIcon } from "@/components/icons";
import { MusicControl } from "@/components/music-control";

interface SiteHeaderProps {
  locale: Locale;
  onOpenSearch: () => void;
}

const copy = {
  es: {
    solutions: "Soluciones",
    method: "Cómo trabajamos",
    catalog: "Catálogo",
    technology: "Tecnología",
    specialists: "Especialistas",
    diagnosis: "Evaluación sin costo",
    search: "Buscar",
    theme: "Cambiar tema",
    menu: "Abrir menú",
    close: "Cerrar menú",
  },
  en: {
    solutions: "Solutions",
    method: "How we work",
    catalog: "Catalog",
    technology: "Technology",
    specialists: "Specialists",
    diagnosis: "Free assessment",
    search: "Search",
    theme: "Change theme",
    menu: "Open menu",
    close: "Close menu",
  },
};

export function SiteHeader({ locale, onOpenSearch }: SiteHeaderProps) {
  const labels = copy[locale];
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const localePrefix = locale === "es" ? "" : "/en";
  const homeHref = locale === "es" ? "/" : "/en";
  const servicesHref = locale === "es" ? "/servicios" : "/en/services";
  const diagnosisHref = locale === "es" ? "/diagnostico" : "/en/diagnosis";
  const specialistsHref = locale === "es" ? "/especialistas" : "/en/specialists";

  useEffect(() => {
    const current = document.documentElement.dataset.theme === "light" ? "light" : "dark";
    setTheme(current);
  }, []);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onOpenSearch();
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, [onOpenSearch]);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const dialog = menuRef.current;
    const focusable = dialog?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
    focusable?.[0]?.focus();

    const handleDialogKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        return;
      }
      if (event.key !== "Tab" || !focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleDialogKey);
    return () => {
      document.removeEventListener("keydown", handleDialogKey);
      document.body.style.overflow = previous;
      menuButtonRef.current?.focus();
    };
  }, [menuOpen]);

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    localStorage.setItem("rcp-theme", nextTheme);
    setTheme(nextTheme);
  }, [theme]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
        <Link href={localePrefix || "/"} className="brand-link" aria-label="RCP Services">
          <Image className="brand-logo brand-logo--dark" src="/logo_rcp_compacto_fondo_oscuro.svg" width={260} height={86} alt="RCP Services" priority />
          <Image className="brand-logo brand-logo--light" src="/logo_rcp_compacto_fondo_claro.svg" width={260} height={86} alt="RCP Services" priority />
        </Link>

        <nav className="main-nav" aria-label={locale === "es" ? "Navegación principal" : "Main navigation"}>
          <Link href={servicesHref}>{labels.solutions}</Link>
          <a href={`${homeHref}#${locale === "es" ? "metodo" : "method"}`}>{labels.method}</a>
          <Link href={locale === "es" ? "/catalogo" : "/en/catalog"}>{labels.catalog}</Link>
          <Link href={locale === "es" ? "/soluciones-tecnologicas" : "/en/technology-solutions"}>{labels.technology}</Link>
          <Link href={specialistsHref}>{labels.specialists}</Link>
        </nav>

        <div className="header-actions">
          <button type="button" className="utility-button header-search" onClick={onOpenSearch} aria-label={labels.search}>
            <SearchIcon size={18} /><kbd>⌘K</kbd>
          </button>
          <Link className="utility-button desktop-only" href={locale === "es" ? "/en" : "/"} aria-label={locale === "es" ? "English" : "Español"}>
            <GlobeIcon size={17} /><span>{locale === "es" ? "EN" : "ES"}</span>
          </Link>
          <button type="button" className="utility-button desktop-only" onClick={toggleTheme} aria-label={labels.theme}>
            {theme === "dark" ? <SunIcon size={17} /> : <MoonIcon size={17} />}
          </button>
          <div className="desktop-only"><MusicControl locale={locale} compact /></div>
          <Link className="button button--primary header-cta" href={diagnosisHref}>{labels.diagnosis}</Link>
          <button ref={menuButtonRef} type="button" className="utility-button mobile-menu-button" onClick={() => setMenuOpen(true)} aria-label={labels.menu} aria-expanded={menuOpen} aria-controls="mobile-menu">
            <MenuIcon size={22} />
          </button>
        </div>
        </div>
      </header>

      {menuOpen && typeof document !== "undefined" && createPortal(
        <div ref={menuRef} id="mobile-menu" className="mobile-menu" role="dialog" aria-modal="true" aria-label={locale === "es" ? "Menú" : "Menu"}>
          <div className="mobile-menu__top">
            <span>RCP Services</span>
            <button type="button" onClick={closeMenu} aria-label={labels.close}><CloseIcon size={22} /></button>
          </div>
          <nav>
            <Link href={servicesHref} onClick={closeMenu}>{labels.solutions}</Link>
            <a href={`${homeHref}#${locale === "es" ? "metodo" : "method"}`} onClick={closeMenu}>{labels.method}</a>
            <Link href={locale === "es" ? "/catalogo" : "/en/catalog"} onClick={closeMenu}>{labels.catalog}</Link>
            <Link href={locale === "es" ? "/soluciones-tecnologicas" : "/en/technology-solutions"} onClick={closeMenu}>{labels.technology}</Link>
            <Link href={specialistsHref} onClick={closeMenu}>{labels.specialists}</Link>
          </nav>
          <div className="mobile-menu__utilities">
            <button type="button" onClick={() => { onOpenSearch(); closeMenu(); }}><SearchIcon size={18} />{labels.search}</button>
            <Link href={locale === "es" ? "/en" : "/"} onClick={closeMenu}><GlobeIcon size={18} />{locale === "es" ? "English" : "Español"}</Link>
            <button type="button" onClick={toggleTheme}>{theme === "dark" ? <SunIcon size={18} /> : <MoonIcon size={18} />}{labels.theme}</button>
            <MusicControl locale={locale} />
          </div>
          <Link className="button button--primary" href={diagnosisHref} onClick={closeMenu}>{labels.diagnosis}</Link>
        </div>,
        document.body,
      )}
    </>
  );
}
