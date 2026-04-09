'use strict';

/**
 * Default creatives pre-loaded on first run.
 * Each entry matches the Creative data shape expected by AppState.add().
 */
const SEED_CREATIVES = Object.freeze([
  {
    id:   'AD 02 · Criativo 01',
    name: 'Sua Fórmula Tão Boa',
    type: 'Vídeo',
    kpis: [
      { label: 'Investimento', value: 'R$ 4.836,57', color: 'white' },
      { label: 'CPL',          value: 'R$ 107,48',   color: 'red'   },
      { label: 'CTR',          value: '0,61%',        color: 'white' },
      { label: 'Faturamento',  value: 'R$ 12.700',   color: 'green' },
    ],
    funnel: [
      { label: 'Leads',   value: 45 },
      { label: 'MQL',     value: 12 },
      { label: 'Conexão', value: 5  },
      { label: 'SQL',     value: 3  },
      { label: 'Venda',   value: 2  },
    ],
  },
  {
    id:   'AD 01 · Criativo 02',
    name: 'Gerente de P&D',
    type: 'Vídeo',
    kpis: [
      { label: 'Investimento', value: 'R$ 744,03',  color: 'white' },
      { label: 'CPL',          value: 'R$ 106,29',  color: 'red'   },
      { label: 'CTR',          value: '1,06%',       color: 'white' },
      { label: 'Faturamento',  value: 'R$ 2.700',   color: 'green' },
    ],
    funnel: [
      { label: 'Leads',   value: 7 },
      { label: 'MQL',     value: 1 },
      { label: 'Conexão', value: 1 },
      { label: 'SQL',     value: 1 },
      { label: 'Venda',   value: 1 },
    ],
  },
  {
    id:   'AD 01 · Criativo 03',
    name: 'Cansado de Fornecedores Químicos',
    type: 'Vídeo',
    kpis: [
      { label: 'Investimento', value: 'R$ 1.575,27', color: 'white' },
      { label: 'CPL',          value: 'R$ 98,45',    color: 'red'   },
      { label: 'CTR',          value: '0,58%',        color: 'white' },
      { label: 'Faturamento',  value: '—',            color: 'muted' },
    ],
    funnel: [
      { label: 'Leads',   value: 16 },
      { label: 'MQL',     value: 3  },
      { label: 'Conexão', value: 2  },
      { label: 'SQL',     value: 0  },
      { label: 'Venda',   value: 0  },
    ],
  },
  {
    id:   'AD 01 · Criativo 04',
    name: 'Sua Formulação Nossa Expertise',
    type: 'Estático',
    kpis: [
      { label: 'Investimento', value: 'R$ 1.662,61', color: 'white' },
      { label: 'CPL',          value: 'R$ 166,26',   color: 'red'   },
      { label: 'CTR',          value: '0,70%',        color: 'white' },
      { label: 'Faturamento',  value: '—',            color: 'muted' },
    ],
    funnel: [
      { label: 'Leads',   value: 10 },
      { label: 'MQL',     value: 0  },
      { label: 'Conexão', value: 0  },
      { label: 'SQL',     value: 0  },
      { label: 'Venda',   value: 0  },
    ],
  },
  {
    id:   'AD 01 · Criativo 05',
    name: 'O Especialista Que Sua Formulação Precisa',
    type: 'Estático',
    kpis: [
      { label: 'Investimento', value: 'R$ 1.384,78', color: 'white' },
      { label: 'CPL',          value: 'R$ 92,32',    color: 'red'   },
      { label: 'CTR',          value: '1,18%',        color: 'white' },
      { label: 'Faturamento',  value: '—',            color: 'muted' },
    ],
    funnel: [
      { label: 'Leads',   value: 15 },
      { label: 'MQL',     value: 0  },
      { label: 'Conexão', value: 0  },
      { label: 'SQL',     value: 0  },
      { label: 'Venda',   value: 0  },
    ],
  },
  {
    id:   'AD 01 · Criativo 06',
    name: 'Qualidade Que Gera Resultados',
    type: 'Estático',
    kpis: [
      { label: 'Investimento', value: 'R$ 815,55',  color: 'white' },
      { label: 'CPL',          value: 'R$ 163,11',  color: 'red'   },
      { label: 'CTR',          value: '1,43%',       color: 'white' },
      { label: 'Faturamento',  value: '—',           color: 'muted' },
    ],
    funnel: [
      { label: 'Leads',   value: 5 },
      { label: 'MQL',     value: 0 },
      { label: 'Conexão', value: 0 },
      { label: 'SQL',     value: 0 },
      { label: 'Venda',   value: 0 },
    ],
  },
  {
    id:   'AD 01 · Criativo 07',
    name: 'No Setor Químico',
    type: 'Vídeo',
    kpis: [
      { label: 'Investimento', value: 'R$ 130,00', color: 'white' },
      { label: 'CPL',          value: '—',          color: 'muted' },
      { label: 'CTR',          value: '0,36%',      color: 'white' },
      { label: 'Faturamento',  value: '—',          color: 'muted' },
    ],
    funnel: [
      { label: 'Leads',   value: 0 },
      { label: 'MQL',     value: 0 },
      { label: 'Conexão', value: 0 },
      { label: 'SQL',     value: 0 },
      { label: 'Venda',   value: 0 },
    ],
  },
]);
