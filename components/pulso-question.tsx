"use client";

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import {
  publicTopics, predefinedReply, validatedReply, PULSO_VERSION,
  PULSO_CLIENT_TIMEOUT, PULSO_QUERY_LIMIT, type PulsoReply, type PulsoLocale,
} from '@/lib/pulso-public';
import { boundedJson } from '@/lib/pulso-http';
import { safePulsoEndpoint } from '@/lib/pulso-endpoint';

type Attempt = { ids: string[]; requestId: string };

export function PulsoQuestion({ locale }: { locale: PulsoLocale }) {
  const id = useId();
  const [query, setQuery] = useState('');
  const [reply, setReply] = useState<PulsoReply | null>(null);
  const [busy, setBusy] = useState(false);
  const [retry, setRetry] = useState<Attempt | null>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const es = locale === 'es';
  useEffect(() => () => controllerRef.current?.abort(), []);

  async function ask(attempt?: Attempt) {
    if (controllerRef.current || !query.trim()) return;
    const topics = publicTopics(query);
    const ids = attempt?.ids ?? topics.ids;
    const fallback = predefinedReply(ids, locale);
    setReply(fallback);
    setRetry(null);
    const endpoint = safePulsoEndpoint(process.env.NEXT_PUBLIC_PULSO_WORKER_URL);
    if (!topics.generative || !navigator.onLine || !endpoint) return;
    const current = attempt ?? { ids, requestId: crypto.randomUUID() };
    const controller = new AbortController();
    controllerRef.current = controller;
    setBusy(true);
    let timedOut = false;
    const timer = window.setTimeout(() => { timedOut = true; controller.abort(); }, PULSO_CLIENT_TIMEOUT);
    try {
      const response = await fetch(endpoint, {
        method: 'POST', cache: 'no-store', credentials: 'omit', redirect: 'error', signal: controller.signal,
        headers: { 'content-type': 'application/json' },
        // Question text stays in this component. No transcript or analytics.
        body: JSON.stringify({ ...current, locale, version: PULSO_VERSION }),
      });
      if (!response.ok) throw new Error('network');
      const result = validatedReply(await boundedJson(response, 6000, 1000), ids, locale);
      if (!result) throw new Error('invalid_response');
      if (!controller.signal.aborted) setReply(result);
    } catch {
      if (!controller.signal.aborted || timedOut) {
        setReply(predefinedReply(ids, locale, timedOut ? 'timeout' : 'network'));
        if (!attempt) setRetry(current);
      }
    } finally {
      window.clearTimeout(timer);
      if (controllerRef.current === controller) {
        controllerRef.current = null;
        // Closing unmounts this component; aborted requests never replace a
        // later question or initiate an automatic retry.
        if (!controller.signal.aborted || timedOut) setBusy(false);
      }
    }
  }

  return (
    <div className="pulso-question">
      <form onSubmit={event => { event.preventDefault(); void ask(); }}>
        <label htmlFor={id}>{es ? '¿Qué necesitas encontrar?' : 'What would you like to find?'}</label>
        <p id={`${id}-privacy`} className="pulso-question__privacy">{es ? 'Consulta nuestros servicios sin incluir datos personales.' : 'Ask about our services without including personal data.'}</p>
        <input id={id} value={query} onChange={event => { setQuery(event.target.value); setRetry(null); }} maxLength={PULSO_QUERY_LIMIT} autoComplete="off" aria-describedby={`${id}-privacy`} disabled={busy} placeholder={es ? 'Por ejemplo: necesito un sitio web' : 'For example: I need a website'} />
        <button type="submit" disabled={busy || !query.trim()}>{busy ? (es ? 'Consultando…' : 'Checking…') : (es ? 'Consultar a Pulso' : 'Ask Pulso')}</button>
      </form>
      <div className="pulso-question__reply" role="status" aria-live="polite" aria-busy={busy}>
        {reply && <>
          <strong>{reply.mode === 'generated' ? (es ? 'Respuesta con IA · verifica las fuentes' : 'AI answer · check the sources') : (es ? 'Información predefinida · respaldo local' : 'Predefined information · local fallback')}</strong>
          <p>{reply.answer}</p>
          {reply.mode === 'predefined' && reply.reason !== 'local' && <small>{es ? 'La ayuda con IA no está disponible para esta consulta. Puedes continuar con estas fuentes o con el equipo de RCP.' : 'AI help is unavailable for this request. You can continue with these sources or the RCP team.'}</small>}
          <ul>{reply.sources.map(source => <li key={source.id}><Link href={source.href}>{source.title}</Link></li>)}</ul>
          {retry && <button type="button" onClick={() => void ask(retry)} disabled={busy}>{es ? 'Reintentar una vez' : 'Retry once'}</button>}
        </>}
      </div>
      <Link href={es ? '/contacto' : '/en/contact'}>{es ? 'Hablar con el equipo de RCP' : 'Talk to the RCP team'}</Link>
      <details className="pulso-question__details">
        <summary>{es ? 'Privacidad y alcance' : 'Privacy and scope'}</summary>
        <p>{es ? 'No escribas datos personales ni confidenciales. Para la ayuda con IA se envían sólo temas públicos a Cloudflare; tu texto permanece en este panel. Pulso orienta; no emite diagnósticos legales, fiscales ni financieros.' : 'Do not enter personal or confidential data. AI help sends only public topics to Cloudflare; your text stays in this panel. Pulso guides; it does not issue legal, tax or financial diagnoses.'}</p>
      </details>
    </div>
  );
}
