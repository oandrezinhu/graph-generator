'use strict';

/**
 * AppState — centralised, encapsulated state module.
 *
 * All mutations go through this module so that the rest of the
 * application never touches the raw array directly. This follows
 * the Single Responsibility and Encapsulation principles from
 * Clean Code / SOLID.
 */
const AppState = (() => {
  /** @type {Creative[]} */
  const creatives = [];

  /** Auto-incrementing ID counter. */
  let nextId = 0;

  const DEFAULT_KPIS = Object.freeze([
    { label: 'Investimento', value: 'R$ 0', color: 'white' },
    { label: 'CPL',          value: '—',    color: 'red'   },
    { label: 'CTR',          value: '0%',   color: 'white' },
    { label: 'Faturamento',  value: '—',    color: 'green' },
  ]);

  const DEFAULT_FUNNEL = Object.freeze([
    { label: 'Leads', value: 0 },
    { label: 'MQL',   value: 0 },
    { label: 'Venda', value: 0 },
  ]);

  /**
   * Builds a new Creative object with a unique internal ID.
   *
   * @param {Partial<Creative>} data - Optional seed data.
   * @returns {Creative}
   */
  function createCreative(data) {
    const id = ++nextId;
    return {
      _id:    id,
      id:     data.id   ?? `Criativo ${id}`,
      name:   data.name ?? `Criativo ${id}`,
      type:   data.type ?? 'Vídeo',
      kpis:   (data.kpis   ?? DEFAULT_KPIS  ).map(kpi   => ({ ...kpi   })),
      funnel: (data.funnel ?? DEFAULT_FUNNEL ).map(stage => ({ ...stage })),
    };
  }

  return {
    /** Read-only view of the creatives list. */
    get creatives() { return creatives; },

    /**
     * Creates a new creative and appends it to the list.
     *
     * @param {Partial<Creative>} [data={}] - Initial values.
     * @returns {Creative} The newly created creative.
     */
    add(data = {}) {
      const creative = createCreative(data);
      creatives.push(creative);
      return creative;
    },

    /**
     * Removes the creative with the given internal ID.
     *
     * @param {number} internalId
     */
    remove(internalId) {
      const index = creatives.findIndex(c => c._id === internalId);
      if (index !== -1) creatives.splice(index, 1);
    },

    /**
     * Returns the creative with the given internal ID, or undefined.
     *
     * @param {number} internalId
     * @returns {Creative | undefined}
     */
    find(internalId) {
      return creatives.find(c => c._id === internalId);
    },

    /** @returns {number} Total number of creatives. */
    count() {
      return creatives.length;
    },
  };
})();
