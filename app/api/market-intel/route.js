import { PREMARKET, IPOS } from "../../../lib/mockData";

function buildBrief() {
  const movers = PREMARKET || [];
  const ipos = IPOS || [];

  const highMove = movers.find((m) => Math.abs(m.change) >= 2.5);
  const wideSpreadLikely = Boolean(highMove); // demo logika

  const summaryCs = [
    "Denní přehled (demo):",
    movers.length
      ? `• V pre-market se hýbou: ${movers.map((m) => `${m.symbol} ${m.change}%`).join(", ")}`
      : "• V pre-market nejsou dostupné movers.",
    ipos.length
      ? `• IPO tento týden: ${ipos.map((i) => `${i.ticker}`).join(", ")}`
      : "• Tento týden nejsou známa žádná IPO.",
    wideSpreadLikely ? "• Pozor na širší spready (nižší likvidita)." : "• Spready by měly být standardní.",
  ].join("\n");

  const summaryEn = [
    "Daily brief (demo):",
    movers.length
      ? `• Pre-market movers: ${movers.map((m) => `${m.symbol} ${m.change}%`).join(", ")}`
      : "• No available movers in pre-market.",
    ipos.length
      ? `• IPO this week: ${ipos.map((i) => `${i.ticker}`).join(", ")}`
      : "• No IPOs this week.",
    wideSpreadLikely ? "• Watch for wider spreads (lower liquidity)." : "• Spreads likely standard.",
  ].join("\n");

  return { summaryCs, summaryEn, topMovers: movers, ipos, wideSpreadLikely };
}

export async function GET() {
  const brief = buildBrief();
  return Response.json(
    { ok: true, endpoint: "market-intel", timestamp: new Date().toISOString(), ...brief },
    { status: 200 }
  );
}

export async function POST(req) {
  // Přijmeme { lang: 'cs' | 'en' } a vrátíme správný summary
  let body = {};
  try {
    body = await req.json();
  } catch (_) {}

  const { lang = "cs" } = body;
  const brief = buildBrief();

  const summary = lang === "en" ? brief.summaryEn : brief.summaryCs;
  return Response.json(
    {
      ok: true,
      endpoint: "market-intel",
      lang,
      summary,
      wideSpreadLikely: brief.wideSpreadLikely,
      topMovers: brief.topMovers,
      ipos: brief.ipos,
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}
