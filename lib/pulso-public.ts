import knowledge from './pulso-knowledge.json' with { type: 'json' };

export type PulsoLocale = 'es' | 'en';
export type PulsoSource = { id: string; title: string; href: string };
export type PulsoReply = {
  mode: 'generated' | 'predefined';
  answer: string;
  sources: PulsoSource[];
  reason: string;
  retryAfter: number;
};
export const PULSO_VERSION = knowledge.version;
export const PULSO_QUERY_LIMIT = 400;
export const PULSO_OUTPUT_LIMIT = 1200;
export const PULSO_CLIENT_TIMEOUT = 10000;
const normalize = (value: string) => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const restricted = /\b(precio\w*|costo\w*|cuanto|tarifa\w*|price\w*|cost\w*|tax\w*|fiscal\w*|dgii|ecf|e-cf|factur\w*|invoice\w*|invoicing|certific\w*|certified|impuesto\w*|legal|contab\w*|accounting|financier\w*|financial|garanti\w*|guarantee\w*|dolar\w*|dollar\w*|peso\w*|euro\w*|gratis|free)\b/;
const privateRequest = /\b(cliente\s+\w+\s+(datos|expediente)|expediente|contrasena|password|secret\w*|credencial\w*|credential\w*|token|privad\w*|private|supabase|leads)\b|\S+@\S+|\d{7,}/;
const stopwords = new Set('que como para con una unos las los del por me mi necesito quiero puedes tienen cual what how can need want for the with and you your have'.split(' '));

export function publicTopics(query: string): { ids: string[]; generative: boolean } {
  const text = normalize(query.slice(0, PULSO_QUERY_LIMIT));
  if (privateRequest.test(text)) return { ids: ['route-contact'], generative: false };
  const words = [...new Set(text.match(/[a-z0-9-]+/g) ?? [])].filter(word => word.length > 2 && !stopwords.has(word));
  const ranked = knowledge.records.map(record => {
    const title = normalize(`${record.title.es} ${record.title.en}`);
    const keywords = normalize(record.keywords.join(' '));
    const body = normalize(`${record.description.es} ${record.description.en}`);
    return { record, score: words.reduce((score, word) => score + (title.includes(word) ? 3 : keywords.includes(word) ? 2 : body.includes(word) ? 1 : 0), 0) };
  }).filter(row => row.score > 0).sort((a, b) => b.score - a.score).slice(0, 2);
  const ids = ranked.map(row => row.record.id);
  return { ids, generative: ids.length > 0 && !restricted.test(text) && ranked.every(row => row.record.generative) };
}

export function approvedTopics(ids: unknown, generativeOnly = false): string[] | null {
  if (!Array.isArray(ids) || ids.length < 1 || ids.length > 2 || new Set(ids).size !== ids.length) return null;
  return ids.every(id => typeof id === 'string' && knowledge.records.some(row => row.id === id && (!generativeOnly || row.generative))) ? ids : null;
}

export function topicSources(ids: string[], locale: PulsoLocale): PulsoSource[] {
  return ids.flatMap(id => {
    const row = knowledge.records.find(record => record.id === id);
    return row ? [{ id: row.id, title: row.title[locale], href: row.href[locale] }] : [];
  });
}

export function predefinedReply(ids: string[], locale: PulsoLocale, reason = 'local', retryAfter = 0): PulsoReply {
  const rows = ids.flatMap(id => knowledge.records.filter(record => record.id === id));
  const answer = rows.length ? rows.map(row => `${row.title[locale]}: ${row.description[locale]}`).join('\n\n') : locale === 'es'
    ? 'No tengo información pública suficiente para esa pregunta. Puedes consultar los servicios o confirmar tu necesidad con el equipo de RCP.'
    : 'I do not have enough public information for that question. Explore our services or confirm your needs with the RCP team.';
  return { mode: 'predefined', answer, sources: topicSources(rows.length ? ids : ['resource-services', 'route-contact'], locale), reason, retryAfter };
}

// The model receives ONLY this versioned public projection, never the question,
// history, visitor identifier, URL, client-supplied context or remote documents.
export function modelMessages(ids: string[], locale: PulsoLocale) {
  if (!approvedTopics(ids, true)) throw new Error('unapproved_topics');
  return [
    { role: 'system', content: `You are Pulso, the RCP Services public guide. Write in ${locale === 'es' ? 'Spanish' : 'English'}. Briefly paraphrase only the supplied public descriptions, in at most 90 words. No new capabilities, promises, prices, numbers, certifications, fiscal, legal or financial advice. No links, HTML or Markdown. If the descriptions are insufficient, say so and suggest contacting RCP. Return JSON only: {"answer":"plain text","sourceIds":["provided id"]}.` },
    { role: 'user', content: JSON.stringify(knowledge.records.filter(row => ids.includes(row.id)).map(row => ({ id: row.id, title: row.title[locale], description: row.description[locale] }))) },
  ];
}

export function validatedGeneration(raw: unknown, ids: string[], locale: PulsoLocale): PulsoReply | null {
  if (!approvedTopics(ids, true) || !raw || typeof raw !== 'object') return null;
  const response = (raw as { response?: unknown }).response;
  try {
    // Workers AI JSON mode can return an already parsed response object.
    const encoded = typeof response === 'string' ? response : JSON.stringify(response);
    if (!encoded || encoded.length > 2400) return null;
    const value = JSON.parse(encoded) as { answer?: unknown; sourceIds?: unknown };
    if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
    const sources = approvedTopics(value.sourceIds, true);
    if (typeof value.answer !== 'string' || !sources || sources.some(id => !ids.includes(id))) return null;
    const answer = value.answer.trim();
    // Sensitive claims are excluded from generation even if a model ignores its prompt.
    if (answer.length < 20 || answer.length > PULSO_OUTPUT_LIMIT || answer.split(/\s+/).length > 90 || /[<>[\]{}\d$€]|https?:|www\.|@|\b(?:RD|USD)\b/i.test(answer)
      || restricted.test(normalize(answer)) || privateRequest.test(normalize(answer))) return null;
    return { mode: 'generated', answer, sources: topicSources(sources, locale), reason: 'ok', retryAfter: 0 };
  } catch { return null; }
}

// Validate the entire worker envelope at the site AND browser boundaries. Links
// are reconstructed from the local allowlist, never accepted from the model.
export function validatedReply(raw: unknown, ids: string[], locale: PulsoLocale): PulsoReply | null {
  if (!raw || typeof raw !== 'object') return null;
  const value = raw as PulsoReply;
  if (value.mode === 'generated' && Array.isArray(value.sources)) {
    return validatedGeneration({ response: JSON.stringify({ answer: value.answer, sourceIds: value.sources.map(row => row?.id) }) }, ids, locale);
  }
  if (value.mode === 'predefined' && typeof value.reason === 'string' && /^[a-z_]{1,32}$/.test(value.reason)) {
    return predefinedReply(ids, locale, value.reason, typeof value.retryAfter === 'number' && Number.isFinite(value.retryAfter) ? Math.max(0, Math.min(86400, value.retryAfter)) : 0);
  }
  return null;
}
