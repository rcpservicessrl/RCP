import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import test from 'node:test';
import { businessScene, businessSceneIds } from '../lib/catalog-photography.ts';
import { catalog } from '../lib/content.ts';
import { catalogArt, catalogArtByService, productArt } from '../lib/product-art.ts';
import { priceEstimates, estimateForService, priceLabel, estimateTerms } from '../lib/pricing.ts';

test('all public services have distinct shipped 2.5D illustrations', async () => {
  assert.equal(catalog.length,31);
  const availableArtwork = new Set(Object.values(productArt));
  assert.equal(availableArtwork.size,32);
  assert.deepEqual(new Set(Object.keys(catalogArtByService)),new Set(catalog.map(entry=>entry.id)));
  for (const image of availableArtwork) await access(`public${image}`);
  const usedPaths = new Set();
  const usedHashes = new Set();
  for (const entry of catalog) {
    const image = productArt[catalogArt(entry.id,entry.category,entry.pillar)];
    assert.ok(availableArtwork.has(image),`Missing catalog artwork for ${entry.id}`);
    assert.match(image,/^\/assets\/(products-2026|catalog-editorial)\/[^/]+\.(png|webp)$/);
    assert.ok(!usedPaths.has(image),`Repeated artwork path for ${entry.id}`);
    usedPaths.add(image);
    const bytes = await readFile(`public${image}`);
    const hash = createHash('sha256').update(bytes).digest('hex');
    assert.ok(!usedHashes.has(hash),`Repeated image content for ${entry.id}`);
    usedHashes.add(hash);
    if (image.endsWith('.webp')) {
      assert.equal(bytes.toString('ascii',0,4),'RIFF');
      assert.equal(bytes.toString('ascii',8,12),'WEBP');
      assert.ok(bytes.length <= 150000,`Oversized catalog asset for ${entry.id}`);
    }
  }
  assert.equal(usedPaths.size,31);
  assert.equal(usedHashes.size,31);
});

test('natural business scenes remain available for homepage and editorial use', async () => {
  assert.equal(businessSceneIds.length,21);
  const shipped = (await readdir('public/assets/business-scenes')).filter(name=>name.endsWith('.webp'));
  assert.deepEqual(new Set(shipped),new Set(businessSceneIds.map(id=>`${id}.webp`)));
  for (const id of businessSceneIds) await access(`public${businessScene(id)}`);
  assert.equal(businessScene('hero-team'),'/assets/business-scenes/hero-team.webp');
  assert.equal(businessScene('missing'),undefined);
});

test('planning estimates separate cadence and scope and never include unavailable services', () => {
  assert.equal(new Set(priceEstimates.map(entry=>entry.serviceId)).size,priceEstimates.length);
  for (const estimate of priceEstimates) {
    assert.ok(estimate.min > 0 && estimate.max >= estimate.min);
    assert.ok(['project','month'].includes(estimate.cadence));
    for (const locale of ['es','en']) {
      assert.ok(estimate.scope[locale].length > 40);
      assert.ok(estimate.exclusions[locale].length > 20);
      assert.match(priceLabel(estimate,locale),/^RD\$ /);
    }
  }
  for (const id of ['crm-marketing','facturacion-electronica','legal-corporativa','missing']) assert.equal(estimateForService(id),undefined);
  assert.equal(estimateForService('redes-community').cadence,'month');
  assert.equal(estimateForService('sitios-web').cadence,'project');
  assert.match(estimateTerms.es,/Impuestos.*no incluidos/);
});
