'use strict';

/**
 * export.js — PNG download logic.
 *
 * Keeps all html2canvas usage isolated here so no other module
 * needs to know about it (Dependency Inversion).
 */

/**
 * Captures a single card as a PNG and triggers a browser download.
 *
 * @param {number} creativeId   - The creative's internal _id.
 * @param {string} creativeName - Used to build the filename.
 */
async function downloadCard(creativeId, creativeName) {
  const card   = document.getElementById(`card-${creativeId}`);
  const button = document.getElementById(`dlbtn-${creativeId}`);
  const originalLabel = button.innerHTML;

  button.innerHTML = 'Gerando PNG…';
  button.disabled  = true;

  try {
    const canvas = await captureElement(card);
    triggerDownload(canvas, buildFilename(creativeId, creativeName));
  } catch (error) {
    console.error('Falha ao capturar card como PNG:', error);
    alert('Erro ao gerar PNG. Tente novamente.');
  } finally {
    button.innerHTML = originalLabel;
    button.disabled  = false;
  }
}

/**
 * Captures every creative card sequentially and triggers a download
 * for each. Downloads are spaced by EXPORT_CONFIG.DELAY_MS to
 * prevent browsers from silently dropping them.
 */
async function downloadAll() {
  const creatives = AppState.creatives;

  if (creatives.length === 0) {
    alert('Nenhum criativo para baixar.');
    return;
  }

  const downloadButtons = getDownloadAllButtons();
  setButtonsLoading(downloadButtons);

  try {
    for (const creative of creatives) {
      const card = document.getElementById(`card-${creative._id}`);
      if (!card) continue;

      const canvas = await captureElement(card);
      triggerDownload(canvas, buildFilename(creative._id, creative.name));
      await delay(EXPORT_CONFIG.DELAY_MS);
    }
  } finally {
    restoreDownloadAllButtons(downloadButtons);
  }
}

// ── Private helpers ────────────────────────────────────────────────

function captureElement(element) {
  return html2canvas(element, {
    backgroundColor: EXPORT_CONFIG.BACKGROUND,
    scale:           EXPORT_CONFIG.SCALE,
    useCORS:         true,
    logging:         false,
  });
}

function triggerDownload(canvas, filename) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function buildFilename(creativeId, creativeName) {
  return `v4-criativo-${creativeId}-${sanitizeFilename(creativeName)}.png`;
}

function getDownloadAllButtons() {
  return [
    document.getElementById('dlAllBtn'),
    document.getElementById('dlAllBtn2'),
  ];
}

function setButtonsLoading(buttons) {
  buttons.forEach(button => {
    button.textContent = 'Gerando…';
    button.disabled    = true;
  });
}

function restoreDownloadAllButtons(buttons) {
  const labels = ['↓ Baixar Todos', '↓ Baixar todos em PNG'];
  buttons.forEach((button, index) => {
    button.innerHTML = labels[index];
    button.disabled  = false;
  });
}
