'use strict';

/**
 * ChartManager — thin wrapper around Chart.js.
 *
 * Responsibilities:
 *  - Create a horizontal bar chart for a given creative.
 *  - Destroy existing chart instances before re-creating them
 *    to prevent memory leaks.
 *
 * All chart configuration is kept here so that the rest of the
 * application has no direct dependency on Chart.js internals.
 */
const ChartManager = (() => {
  /** @type {Record<number, Chart>} */
  const instances = {};

  /**
   * Destroys the chart associated with `creativeId`, if one exists.
   *
   * @param {number} creativeId
   */
  function destroy(creativeId) {
    if (instances[creativeId]) {
      instances[creativeId].destroy();
      delete instances[creativeId];
    }
  }

  /**
   * Creates a new chart for the given creative and attaches it to
   * the canvas element `#chart-{creativeId}`.
   *
   * @param {Creative} creative
   */
  function init(creative) {
    const canvas = document.getElementById(`chart-${creative._id}`);
    if (!canvas) return;

    destroy(creative._id);

    const labels = creative.funnel.map(stage => stage.label);
    const values = creative.funnel.map(stage => Number(stage.value) || 0);

    instances[creative._id] = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: buildChartData(labels, values),
      options: buildChartOptions(values[0] ?? 0),
    });
  }

  // ── Private helpers ────────────────────────────────────────────

  function buildChartData(labels, values) {
    return {
      labels,
      datasets: [{
        label:           'Volume',
        data:            values,
        backgroundColor: RED_PALETTE.slice(0, values.length),
        borderColor:     'transparent',
        borderRadius:    CHART_CONFIG.BAR_BORDER_RADIUS,
        borderSkipped:   false,
        barThickness:    CHART_CONFIG.BAR_THICKNESS,
      }],
    };
  }

  function buildChartOptions(firstStageCount) {
    return {
      responsive:          true,
      maintainAspectRatio: false,
      indexAxis:           'y',
      animation:           { duration: CHART_CONFIG.ANIMATION_DURATION },
      plugins: {
        legend:  { display: false },
        tooltip: buildTooltipConfig(firstStageCount),
      },
      scales: {
        x: buildXAxisConfig(),
        y: buildYAxisConfig(),
      },
    };
  }

  function buildTooltipConfig(firstStageCount) {
    return {
      backgroundColor: '#111',
      titleColor:      '#e50914',
      bodyColor:       '#fff',
      borderColor:     '#222',
      borderWidth:     1,
      padding:         10,
      titleFont: { family: 'Montserrat', weight: '800', size: 13 },
      bodyFont:  { family: 'Montserrat', size: 12 },
      callbacks: {
        label(context) {
          const count = context.parsed.y;
          const conversionNote = firstStageCount > 0
            ? ` · ${Math.round((count / firstStageCount) * 100)}% dos leads`
            : '';
          return `  ${count} unidades${conversionNote}`;
        },
      },
    };
  }

  function buildXAxisConfig() {
    return {
      grid:        { color: 'rgba(255,255,255,0.05)', drawBorder: false },
      border:      { display: false },
      ticks:       { color: '#6b6b6b', font: { family: 'Montserrat', size: 11 }, precision: 0 },
      beginAtZero: true,
    };
  }

  function buildYAxisConfig() {
    return {
      grid:   { color: 'rgba(0,0,0,0)', drawBorder: false },
      border: { display: false },
      ticks:  { color: '#9a9a9a', font: { family: 'Montserrat', size: 12, weight: '700' }, maxRotation: 0 },
    };
  }

  return { init, destroy };
})();
