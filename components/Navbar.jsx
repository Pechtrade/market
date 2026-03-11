"use client";

import { Globe } from "lucide-react";

export default function Navbar({ lang, setLang }) {
  return (
    <header className="w-full bg-white dark:bg-slate-900 shadow-sm py-3 mb-5">
      <div className="container flex justify-between items-center">
        <h1 className="text-xl font-bold">Market True</h1>

        <button
          className="btn btn-primary"
          onClick={() => setLang(lang === "cs" ? "en" : "cs")}
        >
          <Globe size={18} className="mr-2" />
          Přepnout jazyk ({lang})
        </button>
      </div>
    </header>
  );
}
