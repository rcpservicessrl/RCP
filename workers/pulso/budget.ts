export const DAILY_CALL_LIMIT = 100;
export const VISITOR_CALL_LIMIT = 6;
export const VISITOR_COOLDOWN_MS = 30000;
export const NEURONS_RESERVED_PER_CALL = 64;
export const DAILY_NEURON_BUDGET = DAILY_CALL_LIMIT * NEURONS_RESERVED_PER_CALL;
type BudgetState = {
  day: string; count: number; visitors: Record<string, { count: number; last: number }>;
  requests: string[]; blockedUntil: number; reason: string;
};
type Transaction = { get<T>(key: string): Promise<T | undefined>; put(key: string, value: unknown): Promise<void> };
export type BudgetStorage = { transaction<T>(action: (transaction: Transaction) => Promise<T>): Promise<T> };
const midnight = (now: number) => { const date = new Date(now); date.setUTCHours(24, 0, 0, 0); return date.getTime(); };

// One persistent SQLite DO shared by all isolates, not per-isolate RAM or KV.
// Reservations are never refunded: failed, late and invalid calls count too.
export async function changeBudget(storage: BudgetStorage, visitor: string, requestId: string, action = 'reserve', now = Date.now()) {
  return storage.transaction(async transaction => {
    const day = new Date(now).toISOString().slice(0, 10);
    let state = await transaction.get<BudgetState>('budget');
    if (!state || state.day !== day) state = { day, count: 0, visitors: {}, requests: [], blockedUntil: 0, reason: '' };
    const seconds = (until: number) => Math.max(1, Math.ceil((until - now) / 1000));
    if (action !== 'reserve') {
      const until = action === 'quota' || action === 'account' ? midnight(now) : now + 60000;
      state.blockedUntil = Math.max(state.blockedUntil, until);
      state.reason = action;
      await transaction.put('budget', state);
      return { allowed: false, reason: action, retryAfter: seconds(state.blockedUntil) };
    }
    if (state.blockedUntil > now) return { allowed: false, reason: state.reason, retryAfter: seconds(state.blockedUntil) };
    if (state.count >= DAILY_CALL_LIMIT) return { allowed: false, reason: 'daily_budget', retryAfter: seconds(midnight(now)) };
    if (state.requests.includes(requestId)) return { allowed: false, reason: 'duplicate', retryAfter: 0 };
    const usage = state.visitors[visitor];
    if (usage?.count >= VISITOR_CALL_LIMIT) return { allowed: false, reason: 'visitor_budget', retryAfter: seconds(midnight(now)) };
    if (usage && now - usage.last < VISITOR_COOLDOWN_MS) return { allowed: false, reason: 'cooldown', retryAfter: seconds(usage.last + VISITOR_COOLDOWN_MS) };
    state.count++;
    state.requests.push(requestId);
    state.visitors[visitor] = { count: (usage?.count ?? 0) + 1, last: now };
    await transaction.put('budget', state);
    return { allowed: true, reason: 'reserved', retryAfter: 0 };
  });
}
