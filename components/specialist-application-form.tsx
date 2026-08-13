"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/types";
import { TurnstileField } from "@/components/turnstile-field";
import styles from "./specialist-application-page.module.css";

type SubmissionState = "idle" | "submitting" | "success" | "error";

type ApplicationResponse = {
  accepted?: boolean;
  recorded?: boolean;
  reference?: string;
  message?: string;
  fallbackUrl?: string;
};

const fallbackEmail = "info@rcp.services";

const copy = {
  es: {
    name: "Nombre completo",
    email: "Correo electrónico",
    category: "Área principal",
    categoryPlaceholder: "Selecciona una categoría",
    categories: [
      ["renovacion", "Renovación y operaciones"],
      ["consultoria", "Consultoría profesional"],
      ["publicidad", "Publicidad, marca y contenido"],
      ["tecnologia", "Tecnología, datos y automatización"],
    ],
    experience: "Experiencia relevante",
    experiencePlaceholder: "Cuéntanos brevemente qué haces, en qué tipo de proyectos has trabajado y qué resultados puedes demostrar.",
    portfolio: "Portafolio o perfil profesional público (opcional)",
    availability: "Disponibilidad general",
    availabilityPlaceholder: "Selecciona una opción",
    availabilityOptions: [
      ["por-proyecto", "Por proyecto"],
      ["parcial", "Disponibilidad parcial"],
      ["segun-alcance", "Según alcance y calendario"],
    ],
    privacyBefore: "Autorizo a RCP Services a usar estos datos para evaluar mi incorporación a la Red de Especialistas, según su ",
    privacyLink: "política de privacidad",
    submit: "Enviar postulación",
    submitting: "Confirmando registro…",
    noteTitle: "No envíes documentos sensibles.",
    note: "En esta etapa no solicitamos cédula, RNC, certificados, contratos, datos bancarios ni archivos adjuntos.",
    successTitle: "Postulación registrada.",
    successText: "RCP confirmó el registro en su sistema. Esto inicia una revisión y no garantiza empleo, incorporación ni asignaciones.",
    reference: "Referencia",
    errorTitle: "No pudimos confirmar el registro.",
    errorText: "Tus datos siguen en el formulario. Puedes intentarlo otra vez o enviarlos directamente al correo de talento.",
    emailFallback: "Escribir a info@rcp.services",
    genericError: "La conexión con el sistema de registro no está disponible en este momento.",
  },
  en: {
    name: "Full name",
    email: "Email address",
    category: "Primary area",
    categoryPlaceholder: "Select a category",
    categories: [
      ["renovacion", "Renewal and operations"],
      ["consultoria", "Professional consulting"],
      ["publicidad", "Advertising, brand and content"],
      ["tecnologia", "Technology, data and automation"],
    ],
    experience: "Relevant experience",
    experiencePlaceholder: "Briefly explain what you do, the kinds of projects you have worked on and the outcomes you can demonstrate.",
    portfolio: "Public portfolio or professional profile (optional)",
    availability: "General availability",
    availabilityPlaceholder: "Select an option",
    availabilityOptions: [
      ["por-proyecto", "Project-based"],
      ["parcial", "Part-time availability"],
      ["segun-alcance", "Based on scope and schedule"],
    ],
    privacyBefore: "I authorize RCP Services to use this information to evaluate my application to the Specialist Network under its ",
    privacyLink: "privacy policy",
    submit: "Submit application",
    submitting: "Confirming registration…",
    noteTitle: "Do not send sensitive documents.",
    note: "At this stage we do not request identity documents, tax IDs, certificates, contracts, banking data or file uploads.",
    successTitle: "Application registered.",
    successText: "RCP confirmed the record in its system. This begins a review and does not guarantee employment, network admission or assignments.",
    reference: "Reference",
    errorTitle: "We could not confirm the record.",
    errorText: "Your entries remain in the form. You can try again or send them directly to the talent inbox.",
    emailFallback: "Email info@rcp.services",
    genericError: "The registration system is currently unavailable.",
  },
} as const;

export function SpecialistApplicationForm({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const [state, setState] = useState<SubmissionState>("idle");
  const [reference, setReference] = useState("");
  const [message, setMessage] = useState("");
  const idempotencyKey = useRef<string | null>(null);
  const defaultFallbackHref = `mailto:${fallbackEmail}?subject=${encodeURIComponent(locale === "es" ? "Postulación a la Red de Especialistas RCP" : "RCP Specialist Network application")}`;
  const [fallbackHref, setFallbackHref] = useState(defaultFallbackHref);
  const [verificationReset, setVerificationReset] = useState(0);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      locale,
      name: data.get("name"),
      email: data.get("email"),
      category: data.get("category"),
      experience: data.get("experience"),
      portfolioUrl: data.get("portfolioUrl"),
      availability: data.get("availability"),
      consent: data.get("consent") === "true",
      website: data.get("website"),
      turnstileToken: data.get("turnstileToken"),
    };

    setState("submitting");
    setMessage("");
    idempotencyKey.current ??= crypto.randomUUID();

    try {
      const response = await fetch("/api/specialist-applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey.current,
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({})) as ApplicationResponse;
      if (typeof result.fallbackUrl === "string" && result.fallbackUrl.startsWith(`mailto:${fallbackEmail}`)) {
        setFallbackHref(result.fallbackUrl);
      }

      if (response.ok && result.accepted === true && result.recorded === true && result.reference) {
        setReference(result.reference);
        setState("success");
        form.reset();
        idempotencyKey.current = null;
        return;
      }

      setMessage(c.genericError);
      setState("error");
      setVerificationReset((current) => current + 1);
    } catch {
      setMessage(c.genericError);
      setState("error");
      setVerificationReset((current) => current + 1);
    }
  };

  if (state === "success") {
    return (
      <section className={`${styles.resultCard} ${styles.successCard}`} role="status">
        <p className={styles.eyebrow}>{c.successTitle}</p>
        <p>{c.successText}</p>
        <strong>{c.reference}: {reference}</strong>
        <Link className="button button--secondary" href={locale === "es" ? "/especialistas" : "/en/specialists"}>
          {locale === "es" ? "Volver a la Red de Especialistas" : "Back to the Specialist Network"}
        </Link>
      </section>
    );
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <label className={styles.honeypot} aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      <div className={styles.fieldGrid}>
        <label className={styles.field}>
          <span>{c.name}</span>
          <input name="name" required minLength={2} maxLength={80} autoComplete="name" />
        </label>
        <label className={styles.field}>
          <span>{c.email}</span>
          <input name="email" type="email" required maxLength={120} autoComplete="email" />
        </label>
      </div>

      <div className={styles.fieldGrid}>
        <label className={styles.field}>
          <span>{c.category}</span>
          <select name="category" required defaultValue="">
            <option value="" disabled>{c.categoryPlaceholder}</option>
            {c.categories.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
          </select>
        </label>
        <label className={styles.field}>
          <span>{c.availability}</span>
          <select name="availability" required defaultValue="">
            <option value="" disabled>{c.availabilityPlaceholder}</option>
            {c.availabilityOptions.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
          </select>
        </label>
      </div>

      <label className={styles.field}>
        <span>{c.experience}</span>
        <textarea name="experience" required minLength={40} maxLength={900} rows={6} placeholder={c.experiencePlaceholder} />
      </label>

      <label className={styles.field}>
        <span>{c.portfolio}</span>
        <input name="portfolioUrl" type="url" maxLength={300} inputMode="url" placeholder="https://" />
      </label>

      <aside className={styles.safetyNote}>
        <strong>{c.noteTitle}</strong>
        <p>{c.note}</p>
      </aside>

      <label className={styles.consent}>
        <input type="checkbox" name="consent" value="true" required />
        <span>
          {c.privacyBefore}<Link href={locale === "es" ? "/privacidad" : "/en/privacy"}>{c.privacyLink}</Link>.
        </span>
      </label>

      {state === "error" && (
        <div className={styles.errorCard} role="alert">
          <strong>{c.errorTitle}</strong>
          <p>{message || c.genericError}</p>
          <p>{c.errorText}</p>
          <a href={fallbackHref}>{c.emailFallback}</a>
        </div>
      )}

      <TurnstileField locale={locale} resetSignal={verificationReset} />

      <div className={styles.formActions}>
        <button className="button button--primary button--large" type="submit" disabled={state === "submitting"}>
          {state === "submitting" ? c.submitting : c.submit}
        </button>
        <a className={styles.emailLink} href={fallbackHref}>{fallbackEmail}</a>
      </div>
    </form>
  );
}
