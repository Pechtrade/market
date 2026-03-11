import { BASE_TEXTS, TEXTS_CS } from "../../../lib/translations";

function translateObject(obj, targetLang) {
  // Jednoduchý překlad pro CZ z našeho slovníku.
  // Pro ostatní jazyky zatím vrací původní texty (AI přidáme později).
  if (targetLang === "cs") {
    const out = {};
    for (const key of Object.keys(obj)) {
      out[key] = TEXTS_CS[key] ?? obj[key];
    }
    return out;
  }

  // EN → vrátíme BASE_TEXTS, pro cokoliv jiného zatím identity (AI-ready)
  if (targetLang === "en") {
    const out = {};
    for (const key of Object.keys(obj)) {
      out[key] = BASE_TEXTS[key] ?? obj[key];
    }
    return out;
  }

  // Placeholder pro ostatní jazyky – zatím bez AI
  return obj;
}

export async function POST(req) {
  let body = {};
  try {
    body = await req.json();
  } catch (_) {}

  const { targetLang = "en", texts = BASE_TEXTS } = body;

  // Pokud přijde řetězec místo objektu, vrať ho beze změny (zatím)
  if (typeof texts === "string") {
    return Response.json({ result: texts, targetLang }, { status: 200 });
  }

  const translated = translateObject(texts, targetLang);
  return Response.json({ result: translated, targetLang }, { status: 200 });
}

export async function GET() {
  return Response.json(
    { ok: true, endpoint: "translate", message: "Translate endpoint is running" },
    { status: 200 }
  );
}
