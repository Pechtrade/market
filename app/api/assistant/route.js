export async function POST(req) {
  let body = {};
  try {
    body = await req.json();
  } catch (_) {
    // nic - ponecháme defaulty
  }

  const { question = "", lang = "cs" } = body;

  const canned = {
    cs:
      "Toto je demo odpověď Market True Assistenta. " +
      "Po nasazení přidáme skutečné AI odpovědi a zdroje (news, makro, fundamenty).",
    en:
      "This is a demo response from Market True Assistant. " +
      "After deployment, we’ll add real AI answers and data sources (news, macro, fundamentals).",
  };

  const answer = canned[lang] ?? canned.cs;

  return Response.json({ answer, echo: { question, lang } }, { status: 200 });
}

export async function GET() {
  return Response.json(
    { ok: true, endpoint: "assistant", message: "Assistant endpoint is running" },
    { status: 200 }
  );
}
