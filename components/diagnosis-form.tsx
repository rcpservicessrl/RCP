"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import type { Locale, NeedId } from "@/lib/types";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import { TurnstileField } from "@/components/turnstile-field";
import { catalog, selectableCapabilities, t, technologySolutions } from "@/lib/content";

interface DiagnosisFormProps {
  locale: Locale;
  selectedServiceIds?: string[];
  selectedCapabilityId?: string;
  selectedSolutionId?: string;
  guided?: boolean;
  initialNeed?: NeedId;
}

type SubmitState = "idle" | "submitting" | "success" | "error";

const stepLabels = {
  es: ["Tu negocio", "Qué está pasando", "Qué vamos a evaluar", "Cómo contactarte"],
  en: ["Your business", "What is happening", "What we will assess", "How to contact you"],
};

export function DiagnosisForm({ locale, selectedServiceIds = [], selectedCapabilityId, selectedSolutionId, guided = false, initialNeed }: DiagnosisFormProps) {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const [reference, setReference] = useState("");
  const [handoffUrl, setHandoffUrl] = useState("");
  const [verificationReset, setVerificationReset] = useState(0);
  const [selectedNeed, setSelectedNeed] = useState<NeedId | "">(initialNeed ?? "");
  const fieldsets = useRef<Array<HTMLFieldSetElement | null>>([]);
  const selectedServices = selectedServiceIds.join(",");
  const selectedItems = catalog.filter((item) => selectedServiceIds.includes(item.id));
  const selectedCapability = selectableCapabilities.find((item) => item.id === selectedCapabilityId);
  const selectedSolution = technologySolutions.find((item) => item.id === selectedSolutionId);
  const labels = stepLabels[locale];

  useEffect(() => {
    if (initialNeed) setSelectedNeed(initialNeed);
  }, [initialNeed]);

  const validateStep = (currentStep: number) => {
    const controls = fieldsets.current[currentStep - 1]?.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input, select, textarea");
    if (!controls) return true;
    for (const control of controls) {
      if (!control.reportValidity()) return false;
    }
    return true;
  };

  const nextStep = () => {
    setMessage("");
    setState("idle");
    if (!validateStep(step)) return;
    const next = Math.min(4, step + 1);
    setStep(next);
    requestAnimationFrame(() => fieldsets.current[next - 1]?.focus());
  };

  const previousStep = () => {
    setMessage("");
    setState("idle");
    const previous = Math.max(1, step - 1);
    setStep(previous);
    requestAnimationFrame(() => fieldsets.current[previous - 1]?.focus());
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (guided && step < 4) {
      nextStep();
      return;
    }

    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    if (!email && !phone) {
      setState("error");
      setMessage(locale === "es" ? "Escribe un correo o un número de WhatsApp para poder responderte." : "Enter an email address or WhatsApp number so we can reply.");
      setStep(4);
      return;
    }

    setState("submitting");
    setMessage("");
    setHandoffUrl("");
    const payload = Object.fromEntries(data.entries());

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Idempotency-Key": crypto.randomUUID() },
        body: JSON.stringify(payload),
      });
      const result = await response.json() as { accepted?: boolean; recorded?: boolean; reference?: string; handoffUrl?: string; message?: string };
      setHandoffUrl(result.handoffUrl ?? "");
      if (!response.ok || result.accepted !== true || result.recorded !== true || !result.reference) throw new Error(result.message || "request_failed");
      setReference(result.reference ?? "");
      setState("success");
      form.reset();
      setStep(1);
    } catch {
      setVerificationReset((current) => current + 1);
      setState("error");
      setMessage(locale === "es" ? "No pudimos confirmar el envío todavía. Tus datos siguen en pantalla; puedes intentarlo de nuevo o continuar por WhatsApp." : "We could not confirm delivery yet. Your details remain on screen; try again or continue on WhatsApp.");
    }
  };

  if (state === "success") {
    return (
      <div className="diagnosis-success" role="status">
        <span><CheckIcon size={24} /></span>
        <small>{locale === "es" ? "Solicitud de evaluación recibida" : "Assessment request received"}</small>
        <h3>{locale === "es" ? "Ya tenemos un punto de partida." : "We now have a starting point."}</h3>
        {reference && <p>{locale === "es" ? "Referencia" : "Reference"}: <strong>{reference}</strong></p>}
        <p>{locale === "es" ? "Nuestro equipo revisará la necesidad y confirmará si podemos agendar la conversación inicial de 45 minutos. Si luego hace falta un Diagnóstico RCP 360, se propondrá por separado con alcance e inversión acordados." : "Our team will review the need and confirm whether we can schedule the 45-minute initial conversation. If an RCP 360 Diagnosis is later needed, it will be proposed separately with an agreed scope and investment."}</p>
        {handoffUrl && <a className="button button--primary" href={handoffUrl} target="_blank" rel="noreferrer">{locale === "es" ? "Abrir conversación en WhatsApp" : "Open WhatsApp conversation"}<ArrowIcon size={17} /></a>}
        <button type="button" className="text-button" onClick={() => setState("idle")}>{locale === "es" ? "Preparar otra solicitud" : "Prepare another request"}</button>
      </div>
    );
  }

  return (
    <form className={`diagnosis-form ${guided ? "diagnosis-form--guided" : ""}`} onSubmit={submit} noValidate={false}>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="selectedServices" value={selectedServices} />
      <input type="hidden" name="selectedCapability" value={selectedCapability?.id ?? ""} />
      <input type="hidden" name="selectedSolution" value={selectedSolution?.id ?? ""} />
      <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>

      {guided && (
        <div className="diagnosis-progress" aria-label={locale === "es" ? "Progreso de la solicitud de evaluación" : "Assessment request progress"}>
          <div><span>{locale === "es" ? "Paso" : "Step"} {step} / 4</span><strong>{labels[step - 1]}</strong></div>
          <ol>{labels.map((label, index) => <li key={label} className={step > index ? "is-active" : ""} aria-current={step === index + 1 ? "step" : undefined}><span>{index + 1}</span><small>{label}</small></li>)}</ol>
        </div>
      )}

      <fieldset ref={(node) => { fieldsets.current[0] = node; }} tabIndex={-1} hidden={guided && step !== 1} className="diagnosis-step">
        <legend>{locale === "es" ? "Empecemos por lo que más necesita atención" : "Start with what needs the most attention"}</legend>
        <div className="need-choice-grid">
          <label><input type="radio" name="need" value="ordenar" required checked={selectedNeed === "ordenar"} onChange={() => setSelectedNeed("ordenar")} /><span><strong>{locale === "es" ? "Ordenar el negocio" : "Organize the business"}</strong><small>{locale === "es" ? "Procesos, ventas, inventario o equipo" : "Processes, sales, inventory or team"}</small></span></label>
          <label><input type="radio" name="need" value="cumplir" required checked={selectedNeed === "cumplir"} onChange={() => setSelectedNeed("cumplir")} /><span><strong>{locale === "es" ? "Reducir riesgos" : "Reduce risks"}</strong><small>{locale === "es" ? "Impuestos, contabilidad, controles o documentos administrativos" : "Tax, accounting, controls or administrative documents"}</small></span></label>
          <label><input type="radio" name="need" value="crecer" required checked={selectedNeed === "crecer"} onChange={() => setSelectedNeed("crecer")} /><span><strong>{locale === "es" ? "Atraer más clientes" : "Attract more customers"}</strong><small>{locale === "es" ? "Marca, publicidad, web o seguimiento" : "Brand, advertising, web or follow-up"}</small></span></label>
        </div>
        <label><span>{locale === "es" ? "¿A qué se dedica tu negocio?" : "What does your business do?"}</span><select name="sector" required defaultValue=""><option value="" disabled>{locale === "es" ? "Selecciona una opción" : "Select an option"}</option><option value="imprenta">{locale === "es" ? "Imprenta y personalización" : "Print and personalization"}</option><option value="comercio">{locale === "es" ? "Comercio, inventario y punto de venta" : "Retail, inventory and point of sale"}</option><option value="servicios">{locale === "es" ? "Empresa de servicios" : "Service business"}</option><option value="otro">{locale === "es" ? "Otro sector" : "Other sector"}</option></select></label>
      </fieldset>

      <fieldset ref={(node) => { fieldsets.current[1] = node; }} tabIndex={-1} hidden={guided && step !== 2} className="diagnosis-step">
        <legend>{locale === "es" ? "Cuéntanos qué está frenando el negocio" : "Tell us what is holding the business back"}</legend>
        <label><span>{locale === "es" ? "¿Qué proceso o problema necesita mejorar?" : "Which process or problem needs improvement?"}</span><textarea name="problem" required minLength={20} maxLength={1000} rows={5} placeholder={locale === "es" ? "Ejemplo: perdemos ventas porque no damos seguimiento a tiempo…" : "Example: we lose sales because follow-up is late…"} /></label>
        <label><span>{locale === "es" ? "¿Qué te gustaría lograr?" : "What would you like to achieve?"}</span><textarea name="expectedOutcome" required minLength={10} maxLength={600} rows={3} placeholder={locale === "es" ? "Explícalo con tus propias palabras." : "Explain it in your own words."} /></label>
      </fieldset>

      <fieldset ref={(node) => { fieldsets.current[2] = node; }} tabIndex={-1} hidden={guided && step !== 3} className="diagnosis-step">
        <legend>{locale === "es" ? "Confirmemos qué vamos a evaluar" : "Confirm what we will assess"}</legend>
        {selectedItems.length > 0 || selectedCapability || selectedSolution ? (
          <div className="form-selection" role="status">
            <small>{locale === "es" ? "Lo que marcaste para evaluar" : "What you selected for assessment"}</small>
            <ul>
              {selectedSolution && <li><CheckIcon size={16} />{t(selectedSolution.title, locale)}</li>}
              {selectedCapability && <li><CheckIcon size={16} />{selectedCapability.acronym} · {t(selectedCapability.name, locale)}</li>}
              {selectedItems.map((item) => <li key={item.id}><CheckIcon size={16} />{t(item.title, locale)}</li>)}
            </ul>
            <p>{locale === "es" ? "Son una referencia. La evaluación inicial nos ayuda a entender qué necesitas y cuál debe ser el próximo paso." : "They are a reference. The initial assessment helps us understand what you need and what the next step should be."}</p>
          </div>
        ) : (
          <div className="form-selection form-selection--empty"><strong>{locale === "es" ? "No tienes que conocer el nombre del servicio." : "You do not need to know the service name."}</strong><p>{locale === "es" ? "Con lo que nos contaste podemos orientarte y seleccionar la ruta adecuada." : "What you shared is enough for us to guide you and choose the right route."}</p></div>
        )}
        <label><span>{locale === "es" ? "¿Cómo prefieres que te respondamos?" : "How would you like us to reply?"}</span><select name="contactPreference" required defaultValue="whatsapp"><option value="whatsapp">WhatsApp</option><option value="email">Email</option><option value="call">{locale === "es" ? "Llamada" : "Call"}</option></select></label>
        <div className="form-note"><strong>{locale === "es" ? "Todavía no envíes documentos sensibles." : "Do not send sensitive documents yet."}</strong><p>{locale === "es" ? "RNC, cédula, certificados, contratos y estados financieros se solicitan después, en un espacio protegido, solo si hacen falta." : "Tax IDs, identity documents, certificates, contracts and financial statements are requested later in a protected space, only if needed."}</p></div>
      </fieldset>

      <fieldset ref={(node) => { fieldsets.current[3] = node; }} tabIndex={-1} hidden={guided && step !== 4} className="diagnosis-step">
        <legend>{locale === "es" ? "¿A quién debemos contactar?" : "Who should we contact?"}</legend>
        <div className="form-row">
          <label><span>{locale === "es" ? "Tu nombre" : "Your name"}</span><input name="name" required minLength={2} maxLength={80} autoComplete="name" /></label>
          <label><span>{locale === "es" ? "Nombre del negocio" : "Business name"}</span><input name="company" required minLength={2} maxLength={120} autoComplete="organization" /></label>
        </div>
        <div className="form-row">
          <label><span>{locale === "es" ? "Correo" : "Email"} <small>{locale === "es" ? "(opcional si dejas WhatsApp)" : "(optional with WhatsApp)"}</small></span><input name="email" type="email" maxLength={120} autoComplete="email" /></label>
          <label><span>WhatsApp <small>{locale === "es" ? "(opcional si dejas correo)" : "(optional with email)"}</small></span><input name="phone" type="tel" inputMode="tel" minLength={7} maxLength={30} autoComplete="tel" /></label>
        </div>
        <label className="checkbox-label"><input type="checkbox" name="consent" value="true" required /><span>{locale === "es" ? "Autorizo a RCP Services a usar estos datos para responder esta solicitud, según su política de privacidad." : "I authorize RCP Services to use this data to respond to this request under its privacy policy."}</span></label>
      </fieldset>

      {state === "error" && <div className="form-error" role="alert"><p>{message}</p>{handoffUrl && <a href={handoffUrl} target="_blank" rel="noreferrer">{locale === "es" ? "Continuar por WhatsApp" : "Continue on WhatsApp"}<ArrowIcon size={15} /></a>}</div>}

      <TurnstileField locale={locale} resetSignal={verificationReset} />

      <div className="diagnosis-actions">
        {guided && step > 1 && <button type="button" className="button button--secondary" onClick={previousStep}>{locale === "es" ? "Volver" : "Back"}</button>}
        {guided && step < 4 ? <button type="button" className="button button--primary" onClick={nextStep}>{locale === "es" ? "Continuar" : "Continue"}<ArrowIcon size={18} /></button> : <button type="submit" className="button button--primary" disabled={state === "submitting"}>{state === "submitting" ? (locale === "es" ? "Enviando…" : "Sending…") : (locale === "es" ? "Solicitar evaluación sin costo" : "Request free assessment")}<ArrowIcon size={18} /></button>}
      </div>
    </form>
  );
}
