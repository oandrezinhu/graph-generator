'use strict';

/**
 * app.js — application entry point.
 *
 * Responsibilities:
 *  - Wire up static DOM event listeners.
 *  - Handle delegated events from sidebar and preview area.
 *  - Orchestrate mutations: state → renderer → UI feedback.
 *
 * No HTML strings or Chart.js code live here; those concerns
 * belong to renderer.js and chart-manager.js respectively.
 */

// ── Report Header ─────────────────────────────────────────────────

function syncReportHeader() {
  const title  = document.getElementById('rptTitle').value;
  const sub    = document.getElementById('rptSub').value;
  const period = document.getElementById('rptPeriod').value;

  document.getElementById('prevTitle').textContent = title;
  document.getElementById('prevSub').textContent   = `${sub} · ${period}`;
}

// ── Creative Management ───────────────────────────────────────────

function addCreative(data = {}) {
  const creative = AppState.add(data);
  buildSidebarItem(creative);
  buildCard(creative);
  updateCreativeCount();
  hideEmptyState();
}

function removeCreative(creativeId) {
  AppState.remove(creativeId);
  document.getElementById(`sb-${creativeId}`)?.remove();
  document.getElementById(`cw-${creativeId}`)?.remove();
  ChartManager.destroy(creativeId);
  updateCreativeCount();

  if (AppState.count() === 0) {
    showEmptyState();
  }
}

// ── KPI Management ────────────────────────────────────────────────

function addKpi(creativeId) {
  const creative = AppState.find(creativeId);
  if (!creative) return;

  const newIndex = creative.kpis.length;
  creative.kpis.push({ label: 'KPI', value: '—', color: 'white' });

  document.getElementById(`kpis-${creativeId}`)
    .insertAdjacentHTML('beforeend', kpiRowHTML(creativeId, newIndex, creative.kpis[newIndex]));

  rerenderCard(creative);
}

function removeKpi(creativeId, kpiIndex) {
  const creative = AppState.find(creativeId);
  if (!creative) return;

  creative.kpis.splice(kpiIndex, 1);
  document.getElementById(`kpis-${creativeId}`).innerHTML =
    creative.kpis.map((kpi, index) => kpiRowHTML(creativeId, index, kpi)).join('');

  rerenderCard(creative);
}

// ── Funnel Stage Management ───────────────────────────────────────

function addStage(creativeId) {
  const creative = AppState.find(creativeId);
  if (!creative) return;

  const newIndex = creative.funnel.length;
  creative.funnel.push({ label: 'Etapa', value: 0 });

  document.getElementById(`funnel-${creativeId}`)
    .insertAdjacentHTML('beforeend', funnelRowHTML(creativeId, newIndex, creative.funnel[newIndex]));

  rerenderCard(creative);
}

function removeStage(creativeId, stageIndex) {
  const creative = AppState.find(creativeId);
  if (!creative) return;

  creative.funnel.splice(stageIndex, 1);
  document.getElementById(`funnel-${creativeId}`).innerHTML =
    creative.funnel.map((stage, index) => funnelRowHTML(creativeId, index, stage)).join('');

  rerenderCard(creative);
}

// ── Field Setters ─────────────────────────────────────────────────

function setCreativeField(creativeId, field, value) {
  const creative = AppState.find(creativeId);
  if (!creative) return;

  creative[field] = value;

  if (field === 'name') {
    const nameLabel = document.getElementById(`sbname-${creativeId}`);
    if (nameLabel) nameLabel.textContent = value;
  }

  rerenderCard(creative);
}

function setKpiField(creativeId, kpiIndex, field, value) {
  const creative = AppState.find(creativeId);
  if (!creative || !creative.kpis[kpiIndex]) return;

  creative.kpis[kpiIndex][field] = value;
  rerenderCard(creative);
}

function setFunnelField(creativeId, stageIndex, field, rawValue) {
  const creative = AppState.find(creativeId);
  if (!creative || !creative.funnel[stageIndex]) return;

  creative.funnel[stageIndex][field] = field === 'value'
    ? (Number(rawValue) || 0)
    : rawValue;

  rerenderCard(creative);
}

// ── UI Helpers ────────────────────────────────────────────────────

function updateCreativeCount() {
  document.getElementById('cCount').textContent = AppState.count();
}

function hideEmptyState() {
  document.getElementById('emptyState').style.display = 'none';
}

function showEmptyState() {
  document.getElementById('emptyState').style.display = '';
}

function toggleSidebarItem(creativeId) {
  document.getElementById(`sb-${creativeId}`).classList.toggle('open');
}

// ── Event Delegation ──────────────────────────────────────────────

/**
 * Handles click events bubbled up from the sidebar list.
 * Reads data-action and data-* attributes to dispatch the correct action.
 */
function handleSidebarClick(event) {
  const target = event.target.closest('[data-action]');
  if (!target) return;

  const action     = target.dataset.action;
  const creativeId = parseInt(target.dataset.creativeId, 10);

  switch (action) {
    case 'toggle':
      toggleSidebarItem(creativeId);
      break;
    case 'remove-creative':
      removeCreative(creativeId);
      break;
    case 'add-kpi':
      addKpi(creativeId);
      break;
    case 'remove-kpi':
      removeKpi(creativeId, parseInt(target.dataset.kpiIndex, 10));
      break;
    case 'add-stage':
      addStage(creativeId);
      break;
    case 'remove-stage':
      removeStage(creativeId, parseInt(target.dataset.funnelIndex, 10));
      break;
  }
}

/**
 * Handles input/change events bubbled up from the sidebar list.
 */
function handleSidebarChange(event) {
  const target = event.target.closest('[data-action]');
  if (!target) return;

  const action     = target.dataset.action;
  const creativeId = parseInt(target.dataset.creativeId, 10);
  const field      = target.dataset.field;
  const value      = target.value;

  switch (action) {
    case 'set-field':
      setCreativeField(creativeId, field, value);
      break;
    case 'set-kpi':
      setKpiField(creativeId, parseInt(target.dataset.kpiIndex, 10), field, value);
      break;
    case 'set-funnel':
      setFunnelField(creativeId, parseInt(target.dataset.funnelIndex, 10), field, value);
      break;
  }
}

/**
 * Handles click events bubbled up from the cards preview area.
 */
function handlePreviewClick(event) {
  const target = event.target.closest('[data-action]');
  if (!target) return;

  if (target.dataset.action !== 'download-card') return;

  const creativeId = parseInt(target.dataset.creativeId, 10);
  const creative   = AppState.find(creativeId);
  if (creative) downloadCard(creativeId, creative.name);
}

// ── Initialisation ────────────────────────────────────────────────

function init() {
  // Report header inputs
  document.getElementById('rptTitle').addEventListener('input',  syncReportHeader);
  document.getElementById('rptSub').addEventListener('input',    syncReportHeader);
  document.getElementById('rptPeriod').addEventListener('input', syncReportHeader);

  // Global action buttons
  document.getElementById('addCreativeBtn').addEventListener('click', () => addCreative());
  document.getElementById('dlAllBtn').addEventListener('click',  downloadAll);
  document.getElementById('dlAllBtn2').addEventListener('click', downloadAll);

  // Event delegation — sidebar
  const sidebarList = document.getElementById('creativeList');
  sidebarList.addEventListener('click',  handleSidebarClick);
  sidebarList.addEventListener('input',  handleSidebarChange);
  sidebarList.addEventListener('change', handleSidebarChange);

  // Event delegation — preview cards
  document.getElementById('cardsArea').addEventListener('click', handlePreviewClick);

  // Populate with seed data
  SEED_CREATIVES.forEach(seedData => addCreative(seedData));
}

document.addEventListener('DOMContentLoaded', init);
