// Bounded local measurement. No HTTP, provider, credentials or AI calls.
import assert from 'node:assert/strict';
import { AsyncLocalStorage } from 'node:async_hooks';
import { readdir, writeFile } from 'node:fs/promises';
import { registerHooks } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

globalThis.AsyncLocalStorage ??= AsyncLocalStorage;
const hooks = registerHooks({ resolve(specifier, context, nextResolve) {
  if (specifier === 'next/server') return nextResolve('next/server.js', context);
  if (specifier.startsWith('@/')) return nextResolve(pathToFileURL(path.join(process.cwd(), `${specifier.slice(2)}.ts`)).href, context);
  return nextResolve(specifier, context);
} });
try {
  const { default: nextTesting } = await import('next/experimental/testing/server.js');
  const { unstable_doesMiddlewareMatch: matches } = nextTesting;
  const { config, proxy } = await import('../proxy.ts');
  const { default: nextConfig } = await import('../next.config.ts');
  const before = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };
  const walk = async directory => (await Promise.all((await readdir(directory, { withFileTypes: true })).map(async entry => entry.isDirectory() ? walk(path.join(directory, entry.name)) : [path.join(directory, entry.name)]))).flat();
  const paths = (await walk('public')).map(file => '/' + path.relative('public', file).replaceAll('\\', '/'));
  const avoided = paths.filter(url => matches({ config: before, nextConfig, url }) && !matches({ config, nextConfig, url }));
  assert.ok(avoided.length >= 148);
  const request = { headers: new Headers() };
  // Precompute matcher decisions. Measures only the nonce/header work omitted,
  // not routing, network, CDN latency or billed Vercel Active CPU.
  const repetitions = 10;
  const start = process.cpuUsage();
  for (let i = 0; i < repetitions; i++) for (const _url of avoided) proxy(request);
  const cpu = process.cpuUsage(start);
  const result = {
    scope: 'local microbenchmark and Next matcher verification', measuredAt: new Date().toISOString(),
    resourcePathsAvoided: avoided.length, proxyCallsBeforePerInventory: avoided.length, proxyCallsAfterPerInventory: 0,
    repetitions, sampledBaselineProxyCalls: avoided.length * repetitions,
    nonceAndHeaderCpuMs: (cpu.user + cpu.system) / 1000,
    publicResourceCount: paths.length, avoidedPaths: avoided,
    productionRequests: 0, modelCalls: 0,
    limitation: 'Local CPU sample is not billed Active CPU and cannot predict a monthly percentage without a comparable production window.',
  };
  const output = process.argv[process.argv.indexOf('--output') + 1];
  if (process.argv.includes('--output')) await writeFile(output, JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify({ ...result, avoidedPaths: undefined }));
} finally { hooks.deregister(); }
