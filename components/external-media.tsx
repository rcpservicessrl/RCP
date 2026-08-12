"use client";

import { useState } from "react";
import type { Locale } from "@/lib/types";
import styles from "./external-media.module.css";

interface ExternalMediaProps {
  locale: Locale;
  title: string;
  embedSrc: string;
  externalHref: string;
  provider: "YouTube" | "Spotify";
  mode: "video" | "audio";
}

export function ExternalMedia({ locale, title, embedSrc, externalHref, provider, mode }: ExternalMediaProps) {
  const [enabled, setEnabled] = useState(false);

  if (enabled) {
    return (
      <iframe
        className={mode === "video" ? styles.video : styles.audio}
        src={embedSrc}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    );
  }

  return (
    <div className={`${styles.placeholder} ${mode === "audio" ? styles.placeholderAudio : ""}`}>
      <span className={styles.provider}>{provider}</span>
      <strong>{title}</strong>
      <p>{locale === "es" ? `El contenido de ${provider} se carga solo cuando lo autorizas.` : `${provider} content loads only when you choose to enable it.`}</p>
      <div>
        <button type="button" onClick={() => setEnabled(true)}>{locale === "es" ? "Reproducir aquí" : "Play here"}</button>
        <a href={externalHref} target="_blank" rel="noreferrer">{locale === "es" ? `Abrir en ${provider}` : `Open on ${provider}`}<span aria-hidden="true">↗</span></a>
      </div>
    </div>
  );
}
