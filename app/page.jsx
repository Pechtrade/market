"use client";

import { useState } from "react";

export default function Page() {
  const [lang, setLang] = useState("cs");

  return (
    <main className="container py-10">
      <h1 className="text-3xl font-bold mb-4">Market True FULL</h1>

      <p className="text-slate-600 mb-4">
        Aplikace se úspěšně načetla. Toto je základní verze – nyní budeme
        postupně přidávat komponenty, AI asistenta, grafy a další části UI.
      </p>

      <button
        className="btn btn-primary"
        onClick={() => setLang(lang === "cs" ? "en" : "cs")}
      >
        Přepnout jazyk ({lang})
      </button>
    </main>
  );
}
