import js from '@eslint/js';
import ts from 'typescript-eslint';
import hooks from 'eslint-plugin-react-hooks';

export default ts.config(
  { ignores: ['lib/pulso-knowledge.json'] },
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    files: ['components/pulso-{help,question}.tsx', 'lib/pulso-*.ts', 'proxy.ts', 'workers/pulso/*.ts', 'scripts/pulso-*.mjs'],
    languageOptions: { globals: Object.fromEntries(['window', 'document', 'navigator', 'crypto', 'fetch', 'URL', 'Request', 'Response', 'Headers', 'AbortController', 'AbortSignal', 'TextEncoder', 'TextDecoder', 'setTimeout', 'clearTimeout', 'process', 'console', 'structuredClone'].map(name => [name, 'readonly'])) },
    plugins: { 'react-hooks': hooks },
    rules: { 'react-hooks/rules-of-hooks': 'error', 'react-hooks/exhaustive-deps': 'error' },
  },
);
