"use client";

import { useEffect, useMemo, useState } from "react";
import type { KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Locale, NeedId, PillarId } from "@/lib/types";
import { methodSteps, needs, pillars, t } from "@/lib/content";
import { ArrowIcon, CheckIcon, LayersIcon, ShieldIcon, SparkIcon } from "@/components/icons";
import { SiteHeader } from "@/components/site-header";
import { SearchPalette } from "@/components/search-palette";
import { Pulso, type PulsoScene } from "@/components/pulso";
import { PulsoHelp } from "@/components/pulso-help";
import { ConsentBanner } from "@/components/consent-banner";
import { CapabilityExplorer } from "@/components/capability-explorer";
import { CatalogExplorer } from "@/components/catalog-explorer";
import { DiagnosisForm } from "@/components/diagnosis-form";
import { CursorHalo } from "@/components/cursor-halo";

interface HomeExperienceProps {
  locale: Locale;
}

const copy = {
  es: {
    signature: "Para pequeños negocios · República Dominicana",
    eyebrow: "Renovación · Consultoría · Publicidad",
    h1Before: "Le damos nuevo impulso",
    h1Accent: "a tu negocio.",
    hero: "Unimos Renovación, Consultoría y Publicidad para ordenar, proteger e impulsar tu negocio. Publicidad 360 integra lo digital, los impresos y la calle. Si hace falta software, lo adaptamos a tu forma de trabajar.",
    primary: "Solicitar evaluación sin costo",
    secondary: "Ver cómo funciona RCP",
    choose: "¿Qué necesita impulso hoy?",
    trust: ["Un equipo contigo", "Especialistas adecuados", "Entregas revisadas"],
    problemEyebrow: "Reconoce el síntoma",
    problemTitle: "Cuando el negocio pierde ritmo, se siente en todas partes.",
    problemText: "El corazón de tu negocio está en cómo trabaja, decide y conecta con la gente. Elige lo que más te preocupa y te mostramos una ruta sencilla, sin términos complicados.",
    routeLabel: "Tu ruta inicial",
    routeCta: "Empezar por esta necesidad",
    solutionsEyebrow: "Tu ruta con RCP",
    solutionsTitle: "Renovación, Consultoría y Publicidad en una sola ruta.",
    solutionsText: "Activamos uno o varios pilares según lo que tu negocio necesite. No te vendemos herramientas ni servicios que no aporten al resultado.",
    outcome: "Para qué te sirve",
    humanServices: "Cómo te ayudamos",
    techMay: "Herramientas que pueden apoyar",
    technologyEyebrow: "Tecnología a tu medida",
    technologyTitle: "Software que se adapta a tu negocio.",
    technologyText: "Podemos construir o adaptar seguimiento de clientes, caja y POS, inventario, portales y automatizaciones según la forma real en que trabajas.",
    technologyRule: "Tu proceso primero. La tecnología después.",
    exploreTechnology: "Ver soluciones de software",
    methodEyebrow: "Así trabajamos contigo",
    methodTitle: "Un paso claro a la vez.",
    methodText: "Tú sabes qué está pasando en tu negocio. Nosotros organizamos el camino, buscamos a las personas correctas y revisamos cada entrega contigo.",
    stepAction: "En este paso",
    stepOutcome: "Lo dejamos claro con",
    catalogEyebrow: "Todo lo que RCP puede activar",
    catalogTitle: "Encuentra ayuda para lo que tu negocio necesita hoy.",
    catalogText: "Renovación, Consultoría y Publicidad reunidas en un solo catálogo. Dentro de Publicidad 360 encuentras desde redes y páginas web hasta impresos y letreros. El alcance y el precio se definen después de entender bien tu caso.",
    fullCatalog: "Abrir catálogo completo",
    specialistsEyebrow: "Personas correctas, trabajo coordinado",
    specialistsTitle: "Buscamos al especialista. Tú sigues hablando con RCP.",
    specialistsText: "Primero entendemos tu necesidad. Luego buscamos el perfil adecuado, coordinamos el trabajo y revisamos contigo que la entrega esté bien hecha.",
    specialistPoints: ["Respuesta ágil y comunicación clara", "Calidad revisada antes de cada entrega", "Precio claro según el alcance acordado"],
    specialistCta: "Conocer cómo coordinamos especialistas",
    diagnosisEyebrow: "Evaluación Inicial RCP 360°",
    diagnosisTitle: "¿Qué necesita un nuevo impulso en tu negocio?",
    diagnosisText: "Responde cuatro pasos sencillos para solicitar una conversación de 45 minutos, sin costo y sujeta a confirmación. El diagnóstico profundo, si hace falta, se propone después por separado.",
  },
  en: {
    signature: "For small businesses · Dominican Republic",
    eyebrow: "Renewal · Consulting · Advertising",
    h1Before: "We give your business",
    h1Accent: "new momentum.",
    hero: "We unite Renewal, Consulting and Advertising to organize, protect and grow your business. 360 Advertising brings digital, print and street presence together. When software is needed, we adapt it to the way you work.",
    primary: "Request a free assessment",
    secondary: "See how RCP works",
    choose: "What needs momentum today?",
    trust: ["One team by your side", "The right specialists", "Reviewed deliveries"],
    problemEyebrow: "Recognize the symptom",
    problemTitle: "When a business loses rhythm, it shows everywhere.",
    problemText: "The heart of your business is how it works, decides and connects with people. Choose what concerns you most and we will show you a simple route, without complicated terms.",
    routeLabel: "Your starting route",
    routeCta: "Start with this need",
    solutionsEyebrow: "Your route with RCP",
    solutionsTitle: "Renewal, Consulting and Advertising in one route.",
    solutionsText: "We activate one or more pillars according to what your business needs. We do not sell tools or services that do not support the outcome.",
    outcome: "How it helps",
    humanServices: "How we help",
    techMay: "Tools that may support it",
    technologyEyebrow: "Technology made for you",
    technologyTitle: "Software that adapts to your business.",
    technologyText: "We can build or adapt customer follow-up, checkout and POS, inventory, portals and automation around the way you actually work.",
    technologyRule: "Your process first. Technology second.",
    exploreTechnology: "See software solutions",
    methodEyebrow: "How we work with you",
    methodTitle: "One clear step at a time.",
    methodText: "You know what is happening in your business. We organize the route, find the right people and review every delivery with you.",
    stepAction: "At this step",
    stepOutcome: "We make it clear with",
    catalogEyebrow: "Everything RCP can activate",
    catalogTitle: "Find help for what your business needs today.",
    catalogText: "Renewal, Consulting and Advertising in one catalog. Our 360 Advertising scope covers everything from social media and websites to print and signage. Scope and price are defined after we understand your case.",
    fullCatalog: "Open the full catalog",
    specialistsEyebrow: "The right people, coordinated work",
    specialistsTitle: "We find the specialist. You keep talking with RCP.",
    specialistsText: "We first understand your need. Then we find the right profile, coordinate the work and review with you that the delivery is done properly.",
    specialistPoints: ["Fast response and clear communication", "Quality reviewed before each delivery", "Clear price based on the agreed scope"],
    specialistCta: "See how we coordinate specialists",
    diagnosisEyebrow: "RCP 360° Initial Assessment",
    diagnosisTitle: "What needs fresh momentum in your business?",
    diagnosisText: "Complete four simple steps to request a free 45-minute conversation, subject to confirmation. A deeper paid diagnosis, if needed, is proposed separately later.",
  },
};

const sceneByNeed: Record<NeedId, PulsoScene> = {
  ordenar: "progress",
  cumplir: "analyze",
  crecer: "present",
};

export function HomeExperience({ locale }: HomeExperienceProps) {
  const c = copy[locale];
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeNeed, setActiveNeed] = useState<NeedId>("ordenar");
  const [previewNeed, setPreviewNeed] = useState<NeedId>("ordenar");
  const [autoPreview, setAutoPreview] = useState(true);
  const [activePillar, setActivePillar] = useState<PillarId>("renovacion");
  const [activeMethod, setActiveMethod] = useState(methodSteps[0].id);

  useEffect(() => {
    document.documentElement.lang = locale === "es" ? "es-DO" : "en-US";
  }, [locale]);

  useEffect(() => {
    if (!autoPreview) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setAutoPreview(false);
      return;
    }
    const interval = window.setInterval(() => {
      setPreviewNeed((current) => needs[(needs.findIndex((entry) => entry.id === current) + 1) % needs.length].id);
    }, 4_800);
    return () => window.clearInterval(interval);
  }, [autoPreview]);

  const selectedNeed = needs.find((entry) => entry.id === activeNeed) ?? needs[0];
  const selectedPillar = pillars.find((entry) => entry.id === activePillar) ?? pillars[0];
  const previewedNeed = needs.find((entry) => entry.id === previewNeed) ?? needs[0];
  const previewedPillar = pillars.find((entry) => entry.id === previewedNeed.pillar) ?? pillars[0];
  const selectedMethod = methodSteps.find((entry) => entry.id === activeMethod) ?? methodSteps[0];
  const helpContext = useMemo(() => locale === "es" ? `Estás explorando ${selectedPillar.title.es}. Puedo ayudarte a encontrar servicios relacionados.` : `You are exploring ${selectedPillar.title.en}. I can help you find related services.`, [locale, selectedPillar]);

  const selectNeed = (needId: NeedId) => {
    const nextNeed = needs.find((entry) => entry.id === needId);
    if (!nextNeed) return;
    setAutoPreview(false);
    setActiveNeed(needId);
    setPreviewNeed(needId);
    setActivePillar(nextNeed.pillar);
  };

  const moveNeedWithKeyboard = (event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    const supportedKeys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Home", "End"];
    if (!supportedKeys.includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? needs.length - 1
        : event.key === "ArrowRight" || event.key === "ArrowDown"
          ? (currentIndex + 1) % needs.length
          : (currentIndex - 1 + needs.length) % needs.length;
    const nextNeed = needs[nextIndex];
    selectNeed(nextNeed.id);
    requestAnimationFrame(() => document.querySelector<HTMLButtonElement>(`[data-need-id="${nextNeed.id}"]`)?.focus());
  };

  const movePillarWithKeyboard = (event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    const supportedKeys = ["ArrowRight", "ArrowLeft", "Home", "End"];
    if (!supportedKeys.includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? pillars.length - 1 : event.key === "ArrowRight" ? (currentIndex + 1) % pillars.length : (currentIndex - 1 + pillars.length) % pillars.length;
    const next = pillars[nextIndex];
    setActivePillar(next.id);
    requestAnimationFrame(() => document.querySelector<HTMLButtonElement>(`[data-pillar-id="${next.id}"]`)?.focus());
  };

  const moveMethodWithKeyboard = (event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    const supportedKeys = ["ArrowRight", "ArrowLeft", "Home", "End"];
    if (!supportedKeys.includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? methodSteps.length - 1 : event.key === "ArrowRight" ? (currentIndex + 1) % methodSteps.length : (currentIndex - 1 + methodSteps.length) % methodSteps.length;
    const next = methodSteps[nextIndex];
    setActiveMethod(next.id);
    requestAnimationFrame(() => document.querySelector<HTMLButtonElement>(`[data-method-id="${next.id}"]`)?.focus());
  };

  return (
    <>
      <SiteHeader locale={locale} onOpenSearch={() => setSearchOpen(true)} />
      <SearchPalette locale={locale} open={searchOpen} onClose={() => setSearchOpen(false)} />

      <main lang={locale === "es" ? "es-DO" : "en-US"}>
        <section className="hero page-scene" id="inicio">
          <div className="hero__ambient" aria-hidden="true"><span /><span /><span /></div>
          <div className="container hero__grid">
            <div className="hero__copy">
              <p className="signature-label"><span />{c.signature}</p>
              <p className="eyebrow">{c.eyebrow}</p>
              <h1>{c.h1Before} <em>{c.h1Accent}</em></h1>
              <p className="hero__lead">{c.hero}</p>
              <div className="hero__actions">
                <a className="button button--primary button--large" href={`#${locale === "es" ? "diagnostico" : "diagnosis"}`}>{c.primary}<ArrowIcon size={18} /></a>
                <a className="button button--secondary button--large" href="#necesidad">{c.secondary}</a>
              </div>
              <div className="hero__trust" aria-label={locale === "es" ? "Principios de entrega" : "Delivery principles"}>
                {c.trust.map((entry) => <span key={entry}><CheckIcon size={14} />{entry}</span>)}
              </div>
            </div>

            <div className={`hero-visual hero-visual--${previewNeed}`}>
              <div className="hero-visual__pulse" aria-hidden="true">
                <svg viewBox="0 0 640 260" preserveAspectRatio="none">
                  <path className="pulse-track" d="M0 150h126l28-54 42 112 38-148 44 90h78l26-40 34 72 34-32h190" />
                  <path className="pulse-active" d="M0 150h126l28-54 42 112 38-148 44 90h78l26-40 34 72 34-32h190" pathLength="100" />
                </svg>
              </div>
              <div className="hero-visual__orbit" aria-hidden="true"><span>R</span><span>C</span><span>P</span></div>
              <Pulso scene={sceneByNeed[previewNeed]} size="large" interactive label={locale === "es" ? "Pulso, Mascota Jaguar RCP" : "Pulso, RCP Jaguar Mascot"} />
              <div className="hero-visual__caption">
                <span>{t(previewedPillar.title, locale)}</span>
                <strong>{t(previewedNeed.capabilities.length ? previewedNeed.helper : previewedPillar.outcome, locale)}</strong>
                <ul>{previewedNeed.capabilities.map((entry) => <li key={entry}>{entry}</li>)}</ul>
              </div>
            </div>
          </div>

        </section>

        <section className="problem-section page-scene" id="necesidad">
          <div className="container problem-section__grid">
            <div>
              <p className="section-eyebrow">{c.problemEyebrow}</p>
              <h2>{c.problemTitle}</h2>
              <p className="section-lead">{c.problemText}</p>
            </div>
            <div className="need-selector need-selector--scene">
              <small>{c.choose}</small>
              <div role="radiogroup" aria-label={c.choose}>
                {needs.map((need, index) => (
                  <button type="button" role="radio" aria-checked={need.id === activeNeed} tabIndex={need.id === activeNeed ? 0 : -1} data-need-id={need.id} className={need.id === activeNeed ? "is-active" : ""} key={need.id} onClick={() => selectNeed(need.id)} onKeyDown={(event) => moveNeedWithKeyboard(event, index)}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span><strong>{t(need.label, locale)}</strong><small>{t(need.helper, locale)}</small></span>
                    <i aria-hidden="true" />
                  </button>
                ))}
              </div>
              <article className="need-route" aria-live="polite">
                <small>{c.routeLabel}</small>
                <div><strong>{t(selectedPillar.title, locale)}</strong><span aria-hidden="true">+</span><p>{selectedNeed.capabilities.join(" · ")}</p></div>
                <a className="text-link" href="#soluciones">{c.routeCta}<ArrowIcon size={17} /></a>
              </article>
            </div>
          </div>
        </section>

        <section className="solutions-section page-scene" id="soluciones">
          <div className="container section-heading section-heading--split">
            <div><p className="section-eyebrow">{c.solutionsEyebrow}</p><h2>{c.solutionsTitle}</h2></div>
            <p>{c.solutionsText}</p>
          </div>
          <div className="container pillar-explorer">
            <div className="pillar-tabs" role="tablist" aria-label={c.solutionsTitle}>
              {pillars.map((pillar, index) => <button type="button" key={pillar.id} id={`pillar-tab-${pillar.id}`} data-pillar-id={pillar.id} role="tab" aria-selected={pillar.id === activePillar} aria-controls="pillar-panel" tabIndex={pillar.id === activePillar ? 0 : -1} className={`pillar-tab pillar-tab--${pillar.id} ${pillar.id === activePillar ? "is-active" : ""}`} onClick={() => setActivePillar(pillar.id)} onKeyDown={(event) => movePillarWithKeyboard(event, index)}><span>0{index + 1}</span><strong>{t(pillar.title, locale)}</strong><small>{t(pillar.eyebrow, locale)}</small></button>)}
            </div>
            <div id="pillar-panel" role="tabpanel" aria-labelledby={`pillar-tab-${selectedPillar.id}`} className={`pillar-stage pillar-stage--${selectedPillar.id}`}>
              <div className="pillar-stage__index">{selectedPillar.id === "renovacion" ? "R" : selectedPillar.id === "consultoria" ? "C" : "P"}</div>
              <div className="pillar-stage__intro"><small>{t(selectedPillar.eyebrow, locale)}</small><h3>{t(selectedPillar.title, locale)}</h3><p>{t(selectedPillar.summary, locale)}</p></div>
              <div className="pillar-stage__detail">
                <div><small>{c.outcome}</small><strong>{t(selectedPillar.outcome, locale)}</strong></div>
                <div><small>{c.humanServices}</small><ul>{selectedPillar.services.map((service) => <li key={service.es}><CheckIcon size={14} />{t(service, locale)}</li>)}</ul></div>
                <div><small>{c.techMay}</small><ul className="tech-tags">{selectedPillar.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul></div>
              </div>
              <div className="pillar-stage__guide"><Pulso scene={selectedPillar.id === "consultoria" ? "analyze" : "present"} size="medium" /></div>
            </div>
          </div>
        </section>

        <section className="technology-section page-scene" id="tecnologia">
          <div className="technology-section__line" aria-hidden="true" />
          <div className="container section-heading section-heading--split section-heading--dark">
            <div><p className="section-eyebrow">{c.technologyEyebrow}</p><h2>{c.technologyTitle}</h2></div>
            <div><p>{c.technologyText}</p><span className="technology-rule"><LayersIcon size={17} />{c.technologyRule}</span></div>
          </div>
          <div className="container"><CapabilityExplorer locale={locale} compact /></div>
          <div className="container section-action"><Link className="text-link" href={locale === "es" ? "/soluciones-tecnologicas" : "/en/technology-solutions"}>{c.exploreTechnology}<ArrowIcon size={17} /></Link></div>
        </section>

        <section className="method-section page-scene" id={locale === "es" ? "metodo" : "method"}>
          <div className="container section-heading section-heading--split">
            <div><p className="section-eyebrow">{c.methodEyebrow}</p><h2>{c.methodTitle}</h2></div>
            <p>{c.methodText}</p>
          </div>
          <div className="container method-explorer">
            <div className="method-steps" role="tablist" aria-label={c.methodTitle}>
              {methodSteps.map((step, index) => <button type="button" id={`method-tab-${step.id}`} data-method-id={step.id} role="tab" aria-selected={step.id === activeMethod} aria-controls="method-panel" tabIndex={step.id === activeMethod ? 0 : -1} className={step.id === activeMethod ? "is-active" : ""} key={step.id} onClick={() => setActiveMethod(step.id)} onKeyDown={(event) => moveMethodWithKeyboard(event, index)}><span>{step.number}</span><strong>{t(step.title, locale)}</strong></button>)}
            </div>
            <div id="method-panel" role="tabpanel" aria-labelledby={`method-tab-${selectedMethod.id}`} className="method-stage">
              <div className="method-stage__number">{selectedMethod.number}</div>
              <div><small>{c.stepAction}</small><h3>{t(selectedMethod.title, locale)}</h3><p>{t(selectedMethod.action, locale)}</p></div>
              <div className="method-stage__evidence"><ShieldIcon size={20} /><span><small>{c.stepOutcome}</small><strong>{t(selectedMethod.outcome, locale)}</strong></span></div>
              <div className="method-stage__pulse" aria-hidden="true"><i style={{ width: `${((methodSteps.findIndex((entry) => entry.id === activeMethod) + 1) / methodSteps.length) * 100}%` }} /></div>
            </div>
          </div>
        </section>

        <section className="catalog-section page-scene" id="catalogo">
          <div className="container section-heading section-heading--split">
            <div><p className="section-eyebrow">{c.catalogEyebrow}</p><h2>{c.catalogTitle}</h2></div>
            <p>{c.catalogText}</p>
          </div>
          <div className="container"><CatalogExplorer locale={locale} limit={3} compact balanced /></div>
          <div className="container section-action"><Link className="button button--secondary" href={locale === "es" ? "/catalogo" : "/en/catalog"}>{c.fullCatalog}<ArrowIcon size={17} /></Link></div>
        </section>

        <section className="specialists-section page-scene" id="especialistas">
          <div className="container specialists-section__grid">
            <div className="specialists-visual">
              <div className="specialists-visual__logo"><Image src="/logo_rcp_simbolo.svg" width={108} height={108} alt="" /></div>
              <span className="specialist-node specialist-node--one">Legal</span><span className="specialist-node specialist-node--two">Contable</span><span className="specialist-node specialist-node--three">Marca</span><span className="specialist-node specialist-node--four">Tecnología</span>
              <div className="specialists-visual__orbit" aria-hidden="true" />
            </div>
            <div>
              <p className="section-eyebrow">{c.specialistsEyebrow}</p><h2>{c.specialistsTitle}</h2><p className="section-lead">{c.specialistsText}</p>
              <ul className="specialist-points">{c.specialistPoints.map((point) => <li key={point}><CheckIcon size={17} />{point}</li>)}</ul>
              <Link className="text-link" href={locale === "es" ? "/especialistas" : "/en/specialists"}>{c.specialistCta}<ArrowIcon size={17} /></Link>
            </div>
          </div>
        </section>

        <section className="diagnosis-section page-scene" id={locale === "es" ? "diagnostico" : "diagnosis"}>
          <div className="container diagnosis-section__grid">
            <div className="diagnosis-section__intro">
              <p className="section-eyebrow">{c.diagnosisEyebrow}</p><h2>{c.diagnosisTitle}</h2><p className="section-lead">{c.diagnosisText}</p>
              <div className="diagnosis-section__pulso"><Pulso scene="consider" size="medium" /><span><strong>Pulso</strong><small>{locale === "es" ? "Te acompaño a definir el punto de partida." : "I will help you define the starting point."}</small></span></div>
            </div>
            <DiagnosisForm locale={locale} guided initialNeed={activeNeed} />
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container site-footer__top">
          <div><Image className="footer-logo" src="/assets/brand/logos/logo_rcp_lockup_3p_oscuro.png" width={380} height={125} alt={locale === "es" ? "RCP Services · Renovación · Consultoría · Publicidad" : "RCP Services · Renewal · Consulting · Advertising"} /><p>{locale === "es" ? "Le damos nuevo impulso a tu negocio." : "We give your business new momentum."}</p></div>
          <div><small>{locale === "es" ? "Soluciones" : "Solutions"}</small><Link href={locale === "es" ? "/servicios" : "/en/services"}>{locale === "es" ? "Tres pilares" : "Three pillars"}</Link><Link href={locale === "es" ? "/catalogo" : "/en/catalog"}>{locale === "es" ? "Catálogo" : "Catalog"}</Link><Link href={locale === "es" ? "/software-a-la-medida" : "/en/custom-software"}>{locale === "es" ? "Software a la medida" : "Custom software"}</Link><Link href={locale === "es" ? "/facturacion-electronica" : "/en/electronic-invoicing"}>{locale === "es" ? "Facturación electrónica" : "Electronic invoicing"}</Link><Link href={locale === "es" ? "/sectores" : "/en/sectors"}>{locale === "es" ? "Sectores" : "Sectors"}</Link></div>
          <div><small>{locale === "es" ? "Empresa" : "Company"}</small><Link href={locale === "es" ? "/nosotros" : "/en/about"}>{locale === "es" ? "Nosotros" : "About"}</Link><Link href={locale === "es" ? "/como-trabajamos" : "/en/how-we-work"}>{locale === "es" ? "Cómo trabajamos" : "How we work"}</Link><Link href={locale === "es" ? "/recursos" : "/en/resources"}>{locale === "es" ? "Recursos" : "Resources"}</Link><Link href={locale === "es" ? "/especialistas" : "/en/specialists"}>{locale === "es" ? "Red de especialistas" : "Specialist network"}</Link></div>
          <div><small>{locale === "es" ? "Contacto" : "Contact"}</small><Link href={locale === "es" ? "/contacto" : "/en/contact"}>{locale === "es" ? "Hablar con RCP" : "Talk to RCP"}</Link><a href="mailto:info@rcp.services">info@rcp.services</a><a href="https://wa.me/18298068092" target="_blank" rel="noreferrer">+1 829 806 8092</a><span>Santo Domingo, República Dominicana</span></div>
        </div>
        <div className="container site-footer__bottom"><span>© {new Date().getFullYear()} RCP Services SRL · RNC 132-147103</span><nav><Link href={locale === "es" ? "/privacidad" : "/en/privacy"}>{locale === "es" ? "Privacidad" : "Privacy"}</Link><Link href={locale === "es" ? "/terminos" : "/en/terms"}>{locale === "es" ? "Términos" : "Terms"}</Link><Link href={locale === "es" ? "/cookies" : "/en/cookies"}>Cookies</Link><Link href={locale === "es" ? "/accesibilidad" : "/en/accessibility"}>{locale === "es" ? "Accesibilidad" : "Accessibility"}</Link></nav></div>
      </footer>

      <PulsoHelp locale={locale} scene={selectedPillar.id === "consultoria" ? "analyze" : "present"} contextLabel={helpContext} onOpenSearch={() => setSearchOpen(true)} />
      <ConsentBanner locale={locale} />
      <CursorHalo />
    </>
  );
}
