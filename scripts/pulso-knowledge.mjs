import { readFile, writeFile } from 'node:fs/promises';
import { catalog, searchRecords } from '../lib/content.ts';

// Explicit review boundary. No crawling, remote catalog, client graph or archive.
const approved = new Map([
  ['service-sitios-web', true], ['service-branding-identidad', true],
  ['service-redes-community', true], ['route-custom-software', true],
  ['route-method', true], ['route-sectors', true], ['resource-about', true],
  ['resource-services', true], ['resource-specialists', true],
  ['resource-diagnosis', false], ['route-electronic-invoicing', false],
  ['route-contact', false],
]);
const records = [...approved].map(([id, generative]) => {
  const row = searchRecords.find(record => record.id === id);
  if (!row) throw new Error(`Public source missing: ${id}`);
  if (id.startsWith('service-')) {
    const item = catalog.find(entry => `service-${entry.id}` === id);
    if (!item || item.commercialState !== 'public' || !item.selectable || item.regulated || item.requiresProfessionalReview) throw new Error(`Public generation gate failed: ${id}`);
  }
  return { ...row, generative };
});
const output = `${JSON.stringify({ version: 'pulso-public-v1', source: 'lib/content.ts (integrated master PR32)', records }, null, 2)}\n`;
const destination = new URL('../lib/pulso-knowledge.json', import.meta.url);
if (process.argv.includes('--check')) {
  if (await readFile(destination, 'utf8') !== output) throw new Error('Pulso snapshot drift: review public changes and regenerate');
} else {
  await writeFile(destination, output);
}
