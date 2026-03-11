export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const ticker = searchParams.get("ticker")?.toUpperCase() || "N/A";

  return Response.json(
    {
      ok: true,
      ticker,
      spread: 0.17,
      liquidity: "Nízká",
      blockTrades: [
        { size: 120000, price: 183.2, side: "BUY" },
        { size: 95000, price: 182.9, side: "SELL" }
      ],
      sentiment: "Mírně pozitivní",
    },
    { status: 200 }
  );
}
