// Mock data pro Market True FULL

export const ASSETS = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Technology',
    type: 'Stock',
    dividendYield: 0.006,
    prices: [
      { d: 1, p: 185 },
      { d: 2, p: 186.2 },
      { d: 3, p: 184.7 },
      { d: 4, p: 187.1 },
      { d: 5, p: 188.4 },
    ],
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA',
    sector: 'Technology',
    type: 'Stock',
    dividendYield: 0.0003,
    prices: [
      { d: 1, p: 858 },
      { d: 2, p: 866 },
      { d: 3, p: 842 },
      { d: 4, p: 875 },
      { d: 5, p: 889 },
    ],
  },
  {
    symbol: 'SPY',
    name: 'S&P 500 ETF',
    sector: 'Index',
    type: 'ETF',
    dividendYield: 0.015,
    prices: [
      { d: 1, p: 501 },
      { d: 2, p: 503 },
      { d: 3, p: 504.1 },
    ],
  },
];

export const PREMARKET = [
  { symbol: "NVDA", change: +2.9 },
  { symbol: "AAPL", change: +1.3 },
  { symbol: "TSLA", change: -1.1 },
  { symbol: "MSFT", change: +0.9 }
];

export const IPOS = [
  {
    ticker: "MMED",
    name: "MiniMed Group",
    date: "2026-03-06",
    info: "Medtech firma vstupující na Nasdaq."
  },
  {
    ticker: "MWH",
    name: "SOLV Energy",
    date: "2026-02-11",
    info: "Solar energy růstová společnost."
  }
];
