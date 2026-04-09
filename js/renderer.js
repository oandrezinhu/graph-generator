'use strict';

/**
 * Renderer — pure HTML-generation functions for sidebar items and
 * preview cards.
 *
 * Rules followed (Clean Code):
 *  - Each function does one thing.
 *  - No inline event handlers; all interactivity uses data-action
 *    attributes handled via event delegation in app.js.
 *  - All user-supplied strings pass through escapeHTML() before
 *    being placed into innerHTML.
 */

// ── Sidebar ───────────────────────────────────────────────────────

/**
 * Creates and appends a sidebar item for the given creative.
 *
 * @param {Creative} creative
 */
function buildSidebarItem(creative) {
  const element = document.createElement('div');
  element.className = 'creative-item';
  element.id = `sb-${creative._id}`;
  element.innerHTML = sidebarItemHTML(creative);
  document.getElementById('creativeList').appendChild(element);
}

function sidebarItemHTML(creative) {
  const { _id: id, name, id: creativeLabel, type, kpis, funnel } = creative;

  return `
    <div class="creative-header" data-action="toggle" data-creative-id="${id}">
      <div class="creative-hd-left">
        <span class="creative-idx">#${id}</span>
        <span class="creative-hd-name" id="sbname-${id}">${escapeHTML(name)}</span>
      </div>
      <span class="toggle-arrow">›</span>
    </div>
    <div class="creative-body">
      <div class="form-group">
        <label class="form-label">Identificador (ID)</label>
        <input class="form-input" type="text" value="${escapeHTML(creativeLabel)}"
               data-action="set-field" data-creative-id="${id}" data-field="id">
      </div>
      <div class="form-row2">
        <div class="form-group">
          <label class="form-label">Nome</label>
          <input class="form-input" type="text" value="${escapeHTML(name)}"
                 data-action="set-field" data-creative-id="${id}" data-field="name">
        </div>
        <div class="form-group">
          <label class="form-label">Tipo</label>
          <select class="form-input"
                  data-action="set-field" data-creative-id="${id}" data-field="type">
            <option ${type === 'Vídeo'    ? 'selected' : ''}>Vídeo</option>
            <option ${type === 'Estático' ? 'selected' : ''}>Estático</option>
          </select>
        </div>
      </div>

      <div class="sub-label">KPIs</div>
      <div id="kpis-${id}">
        ${kpis.map((kpi, index) => kpiRowHTML(id, index, kpi)).join('')}
      </div>
      <div class="row-actions">
        <button class="btn btn-add"
                data-action="add-kpi" data-creative-id="${id}">+ KPI</button>
      </div>

      <div class="sub-label">Etapas do Funil</div>
      <div id="funnel-${id}">
        ${funnel.map((stage, index) => funnelRowHTML(id, index, stage)).join('')}
      </div>
      <div class="row-actions">
        <button class="btn btn-add"
                data-action="add-stage" data-creative-id="${id}">+ Etapa</button>
      </div>

      <hr class="divider">
      <button class="btn btn-danger"
              data-action="remove-creative" data-creative-id="${id}">
        ✕ Remover Criativo
      </button>
    </div>`;
}

/**
 * Returns the HTML for a single KPI input row.
 *
 * @param {number} creativeId
 * @param {number} index
 * @param {KPI} kpi
 * @returns {string}
 */
function kpiRowHTML(creativeId, index, kpi) {
  return `
    <div class="inline-row" style="grid-template-columns:1fr 1fr 72px auto;"
         id="kr-${creativeId}-${index}">
      <input class="form-input" type="text" placeholder="Label"
             value="${escapeHTML(kpi.label)}"
             data-action="set-kpi" data-creative-id="${creativeId}"
             data-kpi-index="${index}" data-field="label">
      <input class="form-input" type="text" placeholder="Valor"
             value="${escapeHTML(kpi.value)}"
             data-action="set-kpi" data-creative-id="${creativeId}"
             data-kpi-index="${index}" data-field="value">
      <select class="form-input"
              data-action="set-kpi" data-creative-id="${creativeId}"
              data-kpi-index="${index}" data-field="color">
        <option value="white" ${kpi.color === 'white' ? 'selected' : ''}>Branco</option>
        <option value="red"   ${kpi.color === 'red'   ? 'selected' : ''}>Vermelho</option>
        <option value="green" ${kpi.color === 'green' ? 'selected' : ''}>Verde</option>
        <option value="muted" ${kpi.color === 'muted' ? 'selected' : ''}>Cinza</option>
      </select>
      <button class="btn btn-rm"
              data-action="remove-kpi" data-creative-id="${creativeId}"
              data-kpi-index="${index}">✕</button>
    </div>`;
}

/**
 * Returns the HTML for a single funnel stage input row.
 *
 * @param {number} creativeId
 * @param {number} index
 * @param {FunnelStage} stage
 * @returns {string}
 */
function funnelRowHTML(creativeId, index, stage) {
  return `
    <div class="inline-row" style="grid-template-columns:1fr 70px auto;"
         id="fr-${creativeId}-${index}">
      <input class="form-input" type="text" placeholder="Etapa"
             value="${escapeHTML(stage.label)}"
             data-action="set-funnel" data-creative-id="${creativeId}"
             data-funnel-index="${index}" data-field="label">
      <input class="form-input" type="number" placeholder="0"
             value="${stage.value}"
             data-action="set-funnel" data-creative-id="${creativeId}"
             data-funnel-index="${index}" data-field="value">
      <button class="btn btn-rm"
              data-action="remove-stage" data-creative-id="${creativeId}"
              data-funnel-index="${index}">✕</button>
    </div>`;
}

// ── Card Preview ───────────────────────────────────────────────────

/**
 * Creates and appends a preview card for the given creative, then
 * initialises its Chart.js instance.
 *
 * @param {Creative} creative
 */
function buildCard(creative) {
  const wrapper = document.createElement('div');
  wrapper.id = `cw-${creative._id}`;
  wrapper.innerHTML = cardHTML(creative);
  document.getElementById('cardsArea').appendChild(wrapper);
  ChartManager.init(creative);
}

/**
 * Destroys the existing chart, re-renders the card HTML, and
 * re-initialises the chart. Called after any state mutation.
 *
 * @param {Creative} creative
 */
function rerenderCard(creative) {
  const wrapper = document.getElementById(`cw-${creative._id}`);
  if (!wrapper) return;
  ChartManager.destroy(creative._id);
  wrapper.innerHTML = cardHTML(creative);
  ChartManager.init(creative);
}

function cardHTML(creative) {
  const { _id: id, name, id: creativeLabel, type, kpis, funnel } = creative;
  const isVideo  = type === 'Vídeo';
  const values   = funnel.map(stage => Number(stage.value) || 0);
  const chartHeight = calculateChartHeight(funnel.length);

  return `
    <div class="card" id="card-${id}">
      <div class="card-head">
        <div class="card-meta">
          <div class="card-num">${escapeHTML(creativeLabel)}</div>
          <div class="card-name">${escapeHTML(name)}</div>
        </div>
        <div class="type-badge ${isVideo ? 'video' : 'static'}">${escapeHTML(type)}</div>
      </div>

      <div class="kpis">${kpiCardsHTML(kpis)}</div>

      <div class="chart-area" style="height:${chartHeight}px;">
        <canvas id="chart-${id}"></canvas>
      </div>

      <div class="stage-row">${stageRowHTML(funnel, values)}</div>

      <button class="dl-btn" id="dlbtn-${id}"
              data-action="download-card" data-creative-id="${id}">
        ↓ &nbsp;Baixar PNG — ${escapeHTML(name)}
      </button>
    </div>`;
}

function kpiCardsHTML(kpis) {
  return kpis.map(kpi => `
    <div class="kpi">
      <div class="kpi-lbl">${escapeHTML(kpi.label)}</div>
      <div class="kpi-val ${kpi.color}">${escapeHTML(kpi.value)}</div>
    </div>`).join('');
}

function stageRowHTML(funnel, values) {
  return funnel.map((stage, index) => {
    const conversionRate = index > 0
      ? calculateConversionRate(values[index], values[index - 1])
      : null;

    const arrowHTML      = index > 0 ? `<div class="stage-arrow">›</div>` : '';
    const conversionHTML = conversionRate
      ? `<span class="stage-pct">↓ ${conversionRate}</span>`
      : '';

    return `
      ${arrowHTML}
      <div class="stage-item">
        <span class="stage-val">${values[index]}</span>
        <span class="stage-lbl">${escapeHTML(stage.label)}</span>
        ${conversionHTML}
      </div>`;
  }).join('');
}

/**
 * Computes chart height based on the number of funnel stages,
 * clamped between HEIGHT_MIN and HEIGHT_MAX.
 *
 * @param {number} stageCount
 * @returns {number} Height in pixels.
 */
function calculateChartHeight(stageCount) {
  return Math.min(
    CHART_CONFIG.HEIGHT_MAX,
    Math.max(CHART_CONFIG.HEIGHT_MIN, stageCount * CHART_CONFIG.HEIGHT_PER_STAGE),
  );
}
