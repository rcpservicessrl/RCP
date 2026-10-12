import { approvedTopics, modelMessages, predefinedReply, validatedGeneration, PULSO_VERSION } from '../../lib/pulso-public';
import { boundedJson, pulsoJson } from '../../lib/pulso-http';
import { changeBudget, type BudgetStorage } from './budget';
import { PULSO_MODEL, AI_TIMEOUT_MS } from './model';

// Candidate only: account/model access and terms must be verified before enabling.
export type PulsoEnv = {
  AI_ENABLED: string; ACCOUNT_TIER: string; VISITOR_HMAC_SECRET?: string; ALLOWED_ORIGINS: string;
  AI: { run(model: string, input: unknown, options?: unknown): Promise<unknown> };
  PULSO_BUDGET: { idFromName(name: string): unknown; get(id: unknown): { fetch(request: Request): Promise<Response> } };
};

export class PulsoBudget {
  private storage: BudgetStorage;
  constructor(state: { storage: BudgetStorage }) { this.storage = state.storage; }
  async fetch(request: Request) {
    const value = await boundedJson(request, 1024) as { visitor: string; requestId: string; action: string };
    return pulsoJson(await changeBudget(this.storage, value.visitor, value.requestId, value.action));
  }
}

async function answer(request: Request, env: PulsoEnv) {
  if (!request.headers.get('content-type')?.startsWith('application/json')) return pulsoJson({ error: 'content_type' }, 415);
  let value: Record<string, unknown>;
  try { value = await boundedJson(request, 1024) as Record<string, unknown>; } catch { return pulsoJson({ error: 'invalid_request' }, 400); }
  const ids = approvedTopics(value?.ids, true);
  if (!ids || (value.locale !== 'es' && value.locale !== 'en')
    || typeof value.requestId !== 'string' || !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(value.requestId)
    || Object.keys(value).some(key => !['ids', 'locale', 'requestId', 'version'].includes(key))) return pulsoJson({ error: 'invalid_request' }, 400);
  const locale = value.locale as 'es' | 'en';
  const fallback = (reason: string, retryAfter = 0) => pulsoJson(predefinedReply(ids, locale, reason, retryAfter));
  if (value.version !== PULSO_VERSION) return fallback('version');
  if (env.AI_ENABLED !== 'true' || env.ACCOUNT_TIER !== 'workers-free') return fallback('disabled');
  // Cloudflare sets CF-Connecting-IP at its public edge. Client payloads and
  // X-Forwarded-For never select a quota identity. No raw IP goes to the model.
  const ip = request.headers.get('cf-connecting-ip');
  if (!ip || ip.length > 45 || !/^[a-f0-9:.]+$/i.test(ip) || !env.VISITOR_HMAC_SECRET || env.VISITOR_HMAC_SECRET.length < 32) return fallback('identity_unavailable');
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.VISITOR_HMAC_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const digest = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${new Date().toISOString().slice(0, 10)}:${ip}`)));
  const visitor = [...digest].map(byte => byte.toString(16).padStart(2, '0')).join('');
  const requestId = value.requestId;
  const budget = async (action: string) => {
    const stub = env.PULSO_BUDGET.get(env.PULSO_BUDGET.idFromName('pulso-global-v1'));
    const response = await stub.fetch(new Request('https://budget.internal/', { method: 'POST', body: JSON.stringify({ visitor, requestId, action }) }));
    if (!response.ok) throw new Error('budget_unavailable');
    return await boundedJson(response, 1024) as { allowed: boolean; reason: string; retryAfter: number };
  };
  const messages = modelMessages(ids, locale);
  if (new TextEncoder().encode(JSON.stringify(messages)).byteLength > 8192) return fallback('context_limit');
  try {
    const reservation = await budget('reserve');
    if (!reservation.allowed) return fallback(reservation.reason, reservation.retryAfter);
  } catch { return fallback('budget_unavailable'); }
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    // Timeout bounds the visitor wait; the binding may continue inference. Its
    // reservation remains spent and there is NEVER an automatic second call.
    const output = await Promise.race([
      env.AI.run(PULSO_MODEL, { messages, max_tokens: 256, temperature: 0.1, response_format: { type: 'json_object' } }, { rejectIfBusy: true }),
      new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error('pulso_timeout')), AI_TIMEOUT_MS); }),
    ]);
    const reply = validatedGeneration(output, ids, locale);
    if (reply) return pulsoJson(reply);
    await budget('invalid_response');
    return fallback('invalid_response', 60);
  } catch (error) {
    const code = error && typeof error === 'object' ? (error as { code?: unknown }).code : undefined;
    const message = `${typeof code === 'number' ? code : ''} ${error instanceof Error ? error.message : ''}`.trim();
    // Provider codes, not public error text or an assumption that all 429s are quota.
    const reason = /\b3036\b/.test(message) ? 'quota' : /\b(5016|5018|3023|3041|5035)\b/.test(message) ? 'account' : message === 'pulso_timeout' ? 'timeout' : 'provider';
    try { const result = await budget(reason); return fallback(reason, result.retryAfter); }
    catch { return fallback(reason, 60); }
  } finally { clearTimeout(timer); }
}

export async function handlePulso(request: Request, env: PulsoEnv) {
  if (new URL(request.url).pathname !== '/answer') return pulsoJson({ error: 'not_found' }, 404);
  const origin = request.headers.get('origin') ?? '';
  const allowed = env.ALLOWED_ORIGINS.split(',').map(value => value.trim()).filter(value => /^https:\/\//.test(value));
  if (!allowed.includes(origin)) return pulsoJson({ error: 'origin' }, 403);
  const headers = {
    'access-control-allow-origin': origin,
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
    vary: 'Origin', 'cache-control': 'no-store',
  };
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (request.method !== 'POST') return pulsoJson({ error: 'method' }, 405);
  let response: Response;
  try { response = await answer(request, env); }
  catch { response = pulsoJson({ error: 'unavailable' }, 503); }
  for (const [name, value] of Object.entries(headers)) response.headers.set(name, value);
  return response;
}

export default { fetch: handlePulso };
