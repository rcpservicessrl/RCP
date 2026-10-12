// Metadata-only capability check. No inference, login, scopes, subscriptions,
// terms acceptance, credentials or resource creation are performed here.
const account = process.argv[process.argv.indexOf('--account') + 1];
const token = process.env.CLOUDFLARE_API_TOKEN;
if (!/^[a-f0-9]{32}$/.test(account ?? '') || !token) {
  console.log(JSON.stringify({ ready: false, reason: 'existing_account_and_token_required' }));
  process.exitCode = 1;
} else {
  const results = await Promise.all(['workers/account-settings', 'subscriptions', 'ai/models/search?search=llama-3.2-3b-instruct'].map(async endpoint => {
    try {
      const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${account}/${endpoint}`, {
        headers: { authorization: `Bearer ${token}` }, redirect: 'error', signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) return { endpoint, status: response.status, verified: false };
      const body = await response.json();
      if (!body.success) return { endpoint, status: response.status, verified: false };
      if (endpoint.startsWith('ai/')) return { endpoint, status: response.status, verified: true, models: Array.isArray(body.result) ? body.result.filter(row => row.name === '@cf/meta/llama-3.2-3b-instruct').map(row => row.name) : [] };
      if (endpoint === 'subscriptions') return { endpoint, status: response.status, verified: true, plans: Array.isArray(body.result) ? body.result.map(row => ({ name: row.rate_plan?.public_name, state: row.state })) : [] };
      return { endpoint, status: response.status, verified: true, usageModel: body.result?.default_usage_model };
    } catch { return { endpoint, verified: false, reason: 'read_failed' }; }
  }));
  console.log(JSON.stringify({ account, inferenceCalls: 0, results, activation: 'requires_explicit_free_plan_and_model_access_review' }, null, 2));
  if (results.some(result => !result.verified)) process.exitCode = 1;
}
