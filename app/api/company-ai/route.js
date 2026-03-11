export async function POST(req) {
  let body = {};
  try { body = await req.json(); } catch (_) {}

  const ticker = body.ticker || "N/A";

  const demo = `
${ticker} – AI demo shrnutí:
• Firma má stabilní základní fundamenty.
• Riziko: střední (beta ~1.1).
• Sektor stále roste.
• Sleduj volatilitu po earnings.
`;

  return Response.json({ ok: true, result: demo });
}

export async function GET() {
  return Response.json({ ok: true });
}
