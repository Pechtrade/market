import { computeDCF } from "../../../lib/utils";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const ticker = (searchParams.get("ticker") || "").toUpperCase();

  // MOCK finanční data – demo
  const demoData = {
    fcf: 15_000_000_000,   // free cashflow
    growth: 0.05,
    wacc: 0.09,
    terminal: 0.02,
    shares: 18_000_000_000
  };

  const dcf = computeDCF(demoData);

  return Response.json(
    {
      ok: true,
      ticker,
      fairValue: dcf.perShare,
      inputs: demoData
    },
    { status: 200 }
  );
}
