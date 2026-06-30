/**
 * RCP Services — Unified i18n Loader
 * Replaces the ~850-line inline translations object in script.js
 * and the separate i18n-extra.js file.
 *
 * Loads translations from /scripts/es.json or /scripts/en.json
 * based on user preference (localStorage) or browser language.
 *
 * Usage: Just include this script. It auto-applies on DOMContentLoaded.
 */
(function () {
  'use strict';

  // Determine language
  let currentLang = localStorage.getItem('rcp-lang');
  if (!currentLang) {
    const browserLang = (navigator.language || 'es').toLowerCase();
    currentLang = browserLang.startsWith('en') ? 'en' : 'es';
    localStorage.setItem('rcp-lang', currentLang);
  }

  // Cache for loaded translations
  let translations = null;

  function applyTranslations(dict) {
    if (!dict) return;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key]) el.innerHTML = dict[key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) el.placeholder = dict[key];
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria-label');
      if (dict[key]) el.setAttribute('aria-label', dict[key]);
    });
  }

  async function loadAndApply(lang) {
    document.documentElement.lang = lang;
    try {
      const resp = await fetch('/scripts/' + lang + '.json');
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      translations = await resp.json();
      applyTranslations(translations);
    } catch (e) {
      console.warn('[i18n] Failed to load ' + lang + '.json:', e);
    }
  }

  // Initial load
  function init() {
    // Set lang selector if present
    var langSelect = document.querySelector('.lang-select');
    if (langSelect) {
      langSelect.value = currentLang;
      langSelect.addEventListener('change', function () {
        currentLang = langSelect.value;
        localStorage.setItem('rcp-lang', currentLang);
        loadAndApply(currentLang);
      });
    }
    loadAndApply(currentLang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
