// MOCK VERZE /api/asset – funguje okamžitě BEZ API klíčů
// =====================================================

import { ASSETS } from "../../../lib/mockData";
import { computeDCF } from "../../../lib/utils";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const ticker = (searchParams.get("ticker") || "").toUpperCase();

  // Vyhledání v mock datech
  const mock = ASSETS.find((a) => a.symbol === ticker);

  if (!mock) {
    return Response.json(
      {
        ok: false,
        message: `Ticker '${ticker}' nenalezen v mock datech (zatím!).`,
        hint: "Po implementaci Yahoo API bude možno vyhledat jakýkoli ticker.",
      },
      { status: 404 }
    );
  }

  // DCF demo
  const dcf = computeDCF({
    fcf: 10_000_000_000, // demo hodnoty
    growth: 0.06,
    wacc: 0.09,
    terminal: 0.02,
    shares: 15_000_000_000,
  });

  // MOCK premarket/aftermarket
  const extended = {
    preMarketPrice: mock.prices[mock.prices.length - 1].p * 1.01,
    preMarketChange: +1.0,
    postMarketPrice: mock.prices[mock.prices.length - 1].p * 0.998,
    postMarketChange: -0.2,
  };

  return Response.json(
    {
      ok: true,
      ticker,
      name: mock.name,
      sector: mock.sector,
      type: mock.type,
      dividendYield: mock.dividendYield,
      description: "Demo popis firmy. Po připojení Yahoo API se zobrazí skutečný popis.",
      fundamentals: {
        pe: 30.5,
        ps: 7.3,
        pb: 12.1,
        beta: 1.18,
        revenue: 383_000_000_000,
        netIncome: 96_000_000_000,
        debt: 104_000_000_000,
        cash: 56_000_000_000
      },
      extended,
      dcf,
      history: mock.prices,
    },
    { status: 200 }
  );
}
