'use strict';

/**
 * Escapes HTML special characters to prevent XSS when injecting
 * user-supplied strings into innerHTML.
 *
 * @param {*} value - Any value; null/undefined become empty string.
 * @returns {string} HTML-safe string.
 */
function escapeHTML(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Converts a creative name into a URL/filename-safe slug.
 * Example: "Sua Fórmula & Tão Boa" → "sua-frmula--to-boa"
 *
 * @param {string} name - Raw creative name.
 * @returns {string} Sanitized lowercase slug.
 */
function sanitizeFilename(name) {
  return name
    .toLowerCase()
    .replace(/[\s&]/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/**
 * Calculates the percentage conversion between two funnel stages.
 *
 * @param {number} current  - Count at the current stage.
 * @param {number} previous - Count at the preceding stage.
 * @returns {string} Formatted percentage string, e.g. "25%" or "0%".
 */
function calculateConversionRate(current, previous) {
  if (previous <= 0) return '0%';
  return Math.round((current / previous) * 100) + '%';
}

/**
 * Returns a Promise that resolves after the given number of milliseconds.
 * Used to space out sequential file downloads so browsers don't drop them.
 *
 * @param {number} ms - Delay in milliseconds.
 * @returns {Promise<void>}
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
