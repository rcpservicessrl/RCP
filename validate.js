#!/usr/bin/env node
/**
 * RCP Services — Ecosystem Validator
 * Runs automated checks on all web assets before deploy.
 * Usage: node validate.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
let errors = [];
let warnings = [];

function error(msg) { errors.push('❌ ' + msg); }
function warn(msg) { warnings.push('⚠️  ' + msg); }
function ok(msg) { console.log('  ✅ ' + msg); }

// ═══════════════════════════════════════
// 1. CHECK ALL INTERNAL LINKS EXIST
// ═══════════════════════════════════════
function checkInternalLinks() {
  console.log('\n🔗 Checking internal links...');
  const htmlFiles = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
  const existingFiles = new Set(fs.readdirSync(ROOT).map(f => f.toLowerCase()));

  htmlFiles.forEach(file => {
    const content = fs.readFileSync(path.join(ROOT, file), 'utf8');
    const linkRegex = /href="([^"#]+\.html)"/g;
    let match;
    while ((match = linkRegex.exec(content)) !== null) {
      const target = match[1].toLowerCase();
      if (!existingFiles.has(target) && !target.startsWith('http')) {
        error(`${file}: broken link → "${match[1]}"`);
      }
    }
  });
  ok('Internal links checked');
}

// ═══════════════════════════════════════
// 2. CHECK NO TUNNEL URLs REMAIN
// ═══════════════════════════════════════
function checkNoTunnelUrls() {
  console.log('\n🚇 Checking for stale tunnel URLs...');
  const files = fs.readdirSync(ROOT).filter(f => f.endsWith('.html') || f.endsWith('.js'));
  const tunnelPattern = /https?:\/\/[a-f0-9]+\.lhr\.life/g;

  files.forEach(file => {
    const content = fs.readFileSync(path.join(ROOT, file), 'utf8');
    const matches = content.match(tunnelPattern);
    if (matches) {
      matches.forEach(url => {
        error(`${file}: stale tunnel URL → "${url}"`);
      });
    }
  });
  ok('Tunnel URL check complete');
}

// ═══════════════════════════════════════
// 3. CHECK NO PLACEHOLDER CREDENTIALS
// ═══════════════════════════════════════
function checkNoPlaceholders() {
  console.log('\n🔑 Checking for placeholder credentials...');
  const files = fs.readdirSync(ROOT).filter(f => f.endsWith('.html') || f.endsWith('.js'));
  const placeholders = ['YOUR_EMAILJS_USER_ID', 'YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', 'pk_test_51Iq'];

  files.forEach(file => {
    const content = fs.readFileSync(path.join(ROOT, file), 'utf8');
    placeholders.forEach(ph => {
      if (content.includes(ph)) {
        error(`${file}: placeholder found → "${ph}"`);
      }
    });
  });
  ok('Placeholder check complete');
}

// ═══════════════════════════════════════
// 4. CHECK i18n KEYS HAVE BOTH TRANSLATIONS
// ═══════════════════════════════════════
function checkI18nKeys() {
  console.log('\n🌐 Checking i18n translation coverage...');
  const scriptContent = fs.readFileSync(path.join(ROOT, 'script.js'), 'utf8');
  
  // Extract ES keys
  const esMatch = scriptContent.match(/translations\s*=\s*\{[\s\S]*?es:\s*\{([\s\S]*?)\},\s*en:/);
  const enMatch = scriptContent.match(/en:\s*\{([\s\S]*?)\}\s*\};/);
  
  if (!esMatch || !enMatch) {
    warn('Could not parse translation objects from script.js');
    return;
  }

  const esKeys = new Set((esMatch[1].match(/'([^']+)':/g) || []).map(k => k.replace(/'/g, '').replace(':', '')));
  const enKeys = new Set((enMatch[1].match(/'([^']+)':/g) || []).map(k => k.replace(/'/g, '').replace(':', '')));

  // Find keys in HTML that might not have translations
  const htmlFiles = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
  const htmlKeys = new Set();
  
  htmlFiles.forEach(file => {
    const content = fs.readFileSync(path.join(ROOT, file), 'utf8');
    const keyRegex = /data-i18n="([^"]+)"/g;
    let match;
    while ((match = keyRegex.exec(content)) !== null) {
      htmlKeys.add(match[1]);
    }
  });

  let missingES = 0, missingEN = 0;
  htmlKeys.forEach(key => {
    if (!esKeys.has(key)) { warn(`i18n key "${key}" used in HTML but missing in ES translations`); missingES++; }
    if (!enKeys.has(key)) { warn(`i18n key "${key}" used in HTML but missing in EN translations`); missingEN++; }
  });

  ok(`i18n check: ${htmlKeys.size} keys found in HTML, ${missingES} missing ES, ${missingEN} missing EN`);
}

// ═══════════════════════════════════════
// 5. CHECK SVG PRODUCT ICONS EXIST
// ═══════════════════════════════════════
function checkProductIcons() {
  console.log('\n🎨 Checking product icon coverage...');
  const tiendaContent = fs.readFileSync(path.join(ROOT, 'tienda.js'), 'utf8');
  const skuRegex = /add\('([^']+)'/g;
  const productDir = path.join(ROOT, 'assets', 'products');
  let match, missing = 0, total = 0;

  while ((match = skuRegex.exec(tiendaContent)) !== null) {
    total++;
    const sku = match[1];
    const svgPath = path.join(productDir, sku + '.svg');
    const pngPath = path.join(productDir, sku + '.png');
    if (!fs.existsSync(svgPath) && !fs.existsSync(pngPath)) {
      warn(`Product ${sku}: no SVG or PNG icon found`);
      missing++;
    }
  }
  ok(`Product icons: ${total - missing}/${total} covered`);
}

// ═══════════════════════════════════════
// 6. CHECK SCRIPTS SYNTAX
// ═══════════════════════════════════════
function checkJSSyntax() {
  console.log('\n📜 Checking JS syntax...');
  const jsFiles = ['script.js', 'script.min.js', 'tienda.js'];
  const { execSync } = require('child_process');
  
  jsFiles.forEach(file => {
    try {
      execSync(`node --check "${path.join(ROOT, file)}"`, { stdio: 'pipe' });
      ok(`${file}: syntax OK`);
    } catch (e) {
      error(`${file}: SYNTAX ERROR — ${e.stderr.toString().split('\n')[0]}`);
    }
  });
}

// ═══════════════════════════════════════
// 7. CHECK NAV CTA CONSISTENCY
// ═══════════════════════════════════════
function checkNavCTAConsistency() {
  console.log('\n🎯 Checking nav CTA consistency...');
  const htmlFiles = fs.readdirSync(ROOT).filter(f => f.endsWith('.html'));
  const ctaTarget = 'diagnostico.html';

  htmlFiles.forEach(file => {
    const content = fs.readFileSync(path.join(ROOT, file), 'utf8');
    const ctaMatch = content.match(/class="btn-cta nav-cta"[^>]*href="([^"]+)"/);
    if (ctaMatch && !ctaMatch[1].includes(ctaTarget) && !ctaMatch[1].includes('diagnostico')) {
      error(`${file}: nav CTA points to "${ctaMatch[1]}" instead of "${ctaTarget}"`);
    }
  });
  ok('Nav CTA consistency checked');
}

// ═══════════════════════════════════════
// 8. CHECK LEAD URL CONSISTENCY
// ═══════════════════════════════════════
function checkLeadURLs() {
  console.log('\n📡 Checking lead/chatbot URL consistency...');
  const expectedLead = 'us-central1-chatbot-rcp.cloudfunctions.net/rcpLead';
  const expectedChat = 'us-central1-chatbot-rcp.cloudfunctions.net/rcpChat';
  
  ['script.js', 'script.min.js'].forEach(file => {
    const content = fs.readFileSync(path.join(ROOT, file), 'utf8');
    if (!content.includes(expectedLead)) {
      error(`${file}: Lead URL does not point to GCP Cloud Function`);
    }
    if (!content.includes(expectedChat)) {
      error(`${file}: Chat URL does not point to GCP Cloud Function`);
    }
  });
  ok('Lead/Chat URLs verified');
}

// ═══════════════════════════════════════
// RUN ALL CHECKS
// ═══════════════════════════════════════
console.log('═══════════════════════════════════════');
console.log('  🐆 RCP SERVICES — ECOSYSTEM VALIDATOR');
console.log('═══════════════════════════════════════');

checkInternalLinks();
checkNoTunnelUrls();
checkNoPlaceholders();
checkI18nKeys();
checkProductIcons();
checkJSSyntax();
checkNavCTAConsistency();
checkLeadURLs();

// ═══════════════════════════════════════
// REPORT
// ═══════════════════════════════════════
console.log('\n═══════════════════════════════════════');
console.log('  RESULTS');
console.log('═══════════════════════════════════════');

if (errors.length === 0 && warnings.length === 0) {
  console.log('\n  🎉 ALL CHECKS PASSED — Ecosystem is clean!\n');
} else {
  if (errors.length > 0) {
    console.log(`\n  ❌ ERRORS (${errors.length}) — Must fix before deploy:`);
    errors.forEach(e => console.log('    ' + e));
  }
  if (warnings.length > 0) {
    console.log(`\n  ⚠️  WARNINGS (${warnings.length}) — Should fix:`);
    warnings.forEach(w => console.log('    ' + w));
  }
  console.log('');
}

process.exit(errors.length > 0 ? 1 : 0);
