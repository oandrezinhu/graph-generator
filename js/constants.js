'use strict';

/**
 * Red color palette used for funnel bar charts.
 * Each index corresponds to a funnel stage (darkest first).
 */
const RED_PALETTE = Object.freeze([
  '#e50914', '#c4080f', '#a3060c',
  '#80050b', '#400306', '#200103', '#100102',
]);

/**
 * Chart rendering configuration.
 */
const CHART_CONFIG = Object.freeze({
  HEIGHT_PER_STAGE:    42,   // pixels added per funnel stage
  HEIGHT_MIN:         160,   // minimum chart height in pixels
  HEIGHT_MAX:         320,   // maximum chart height in pixels
  BAR_THICKNESS:       24,   // bar width in pixels
  BAR_BORDER_RADIUS:    5,   // bar corner rounding in pixels
  ANIMATION_DURATION: 250,   // transition duration in ms
});

/**
 * PNG export configuration.
 */
const EXPORT_CONFIG = Object.freeze({
  SCALE:      3,         // render scale (3× for high-DPI exports)
  BACKGROUND: '#0d0d0d', // card background colour used during capture
  DELAY_MS:   400,       // delay between sequential downloads (ms)
});
