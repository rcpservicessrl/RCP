import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/types";
import { FacebookIcon, InstagramIcon, LinkedInIcon, ThreadsIcon } from "@/components/icons";
import { publicContact } from "@/lib/public-contact";

export function SiteFooter({ locale, interior = false }: { locale: Locale; interior?: boolean }) {
  return (
      <footer className={`site-footer${interior ? " site-footer--interior" : ""}`}>
        <div className="container site-footer__top">
          <div><Image className="footer-logo" src="/assets/brand/logos/logo_rcp_lockup_3p_oscuro.png" width={380} height={125} alt={locale === "es" ? "RCP Services · Renovación · Consultoría · Publicidad" : "RCP Services · Renewal · Consulting · Advertising"} /><p>{locale === "es" ? "Le damos nuevo impulso a tu negocio." : "We give your business new momentum."}</p>
            <nav className="social-links" aria-label={locale === "es" ? "Redes sociales de RCP" : "RCP social profiles"}>
              {publicContact.socialProfiles.map((profile) => (
                <a key={profile.name} href={profile.href} target="_blank" rel="noopener noreferrer" aria-label={`${profile.name} (${locale === "es" ? "abre en otra pestaña" : "opens in a new tab"})`}>
                  {profile.icon === "instagram" ? <InstagramIcon /> : profile.icon === "facebook" ? <FacebookIcon /> : profile.icon === "linkedin" ? <LinkedInIcon /> : <ThreadsIcon />}
                  <span>{profile.name}</span>
                </a>
              ))}
            </nav>
          </div>
          <div><small>{locale === "es" ? "Explorar" : "Explore"}</small><Link href={locale === "es" ? "/herramientas" : "/en/tools"}>{locale === "es" ? "Encuentra tu ruta" : "Find your route"}</Link><Link href={locale === "es" ? "/servicios" : "/en/services"}>{locale === "es" ? "Servicios" : "Services"}</Link><Link href={locale === "es" ? "/catalogo" : "/en/catalog"}>{locale === "es" ? "Catálogo" : "Catalog"}</Link><Link href={locale === "es" ? "/#experiencias" : "/en#experiencias"}>{locale === "es" ? "Sistemas en acción" : "Systems in action"}</Link><Link href={locale === "es" ? "/software-a-la-medida" : "/en/custom-software"}>{locale === "es" ? "Software a la medida" : "Custom software"}</Link><Link href={locale === "es" ? "/facturacion-electronica" : "/en/electronic-invoicing"}>{locale === "es" ? "Facturación electrónica" : "Electronic invoicing"}</Link><Link href={locale === "es" ? "/sectores" : "/en/sectors"}>{locale === "es" ? "Sectores" : "Sectors"}</Link></div>
          <div><small>{locale === "es" ? "Empresa" : "Company"}</small><Link href={locale === "es" ? "/nosotros" : "/en/about"}>{locale === "es" ? "Nosotros" : "About"}</Link><Link href={locale === "es" ? "/como-trabajamos" : "/en/how-we-work"}>{locale === "es" ? "Cómo trabajamos" : "How we work"}</Link><Link href={locale === "es" ? "/recursos" : "/en/resources"}>{locale === "es" ? "Recursos" : "Resources"}</Link><Link href={locale === "es" ? "/media" : "/en/media"}>{locale === "es" ? "Media" : "Media"}</Link><Link href={locale === "es" ? "/carreras" : "/en/careers"}>{locale === "es" ? "Carreras" : "Careers"}</Link><Link href={locale === "es" ? "/especialistas" : "/en/specialists"}>{locale === "es" ? "Red de especialistas" : "Specialist network"}</Link></div>
          <div><small>{locale === "es" ? "Contacto" : "Contact"}</small><Link href={locale === "es" ? "/contacto" : "/en/contact"}>{locale === "es" ? "Hablar con RCP" : "Talk to RCP"}</Link><a href="mailto:info@rcp.services">info@rcp.services</a><a href={publicContact.telephoneHref}>+1 829 806 8092</a><span>Santo Domingo, República Dominicana</span></div>
        </div>
        <div className="container site-footer__bottom"><span>© {new Date().getFullYear()} RCP Services SRL · RNC 132-147103</span><nav><Link href={locale === "es" ? "/privacidad" : "/en/privacy"}>{locale === "es" ? "Privacidad" : "Privacy"}</Link><Link href={locale === "es" ? "/terminos" : "/en/terms"}>{locale === "es" ? "Términos" : "Terms"}</Link><Link href={locale === "es" ? "/cookies" : "/en/cookies"}>Cookies</Link><Link href={locale === "es" ? "/accesibilidad" : "/en/accessibility"}>{locale === "es" ? "Accesibilidad" : "Accessibility"}</Link></nav></div>
      </footer>
  );
}
