"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Section from "../components/Section";
import Button from "../components/Button";
import { ASSETS, PREMARKET, IPOS } from "../lib/mockData";
import { currency } from "../lib/utils";

export default function Page() {
  // ---------- UI stav ----------
  const [lang, setLang] = useState("cs");
  const [active, setActive] = useState(ASSETS[0]);
  const [query, setQuery] = useState("");

  // Watchlist & portfolio (localStorage)
  const [watch, setWatch] = useState(["AAPL", "NVDA"]);
  const [portfolio, setPortfolio] = useState([
    { symbol: "AAPL", shares: 120, price: 188.4 },
    { symbol: "SPY", shares: 35, price: 504.1 },
  ]);

  // ---------- init localStorage ----------
  useEffect(() => {
    const w = localStorage.getItem("watch");
    if (w) setWatch(JSON.parse(w));
    const p = localStorage.getItem("portfolio");
    if (p) setPortfolio(JSON.parse(p));
  }, []);
  useEffect(() => localStorage.setItem("watch", JSON.stringify(watch)), [watch]);
  useEffect(() => localStorage.setItem("portfolio", JSON.stringify(portfolio)), [portfolio]);

  // ---------- Market Intel (Daily Brief) ----------
  const [brief, setBrief] = useState({ summary: "", movers: [], ipos: [], wide: false });
  useEffect(() => {
    const loadBrief = async () => {
      try {
        const res = await fetch("/api/market-intel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lang }),
        });
        const data = await res.json();
        setBrief({
          summary: data.summary || "",
          movers: data.topMovers || [],
          ipos: data.ipos || [],
          wide: !!data.wideSpreadLikely,
        });
      } catch (_) {
        // fallback – kdyby API nebylo k dispozici
        const movers = PREMARKET;
        const ipos = IPOS;
        setBrief({
          summary:
            lang === "cs"
              ? "Denní přehled (fallback): pre‑market movers a IPO viz níže."
              : "Daily brief (fallback): see pre‑market movers & IPO below.",
          movers,
          ipos,
          wide: Boolean(movers.find((m) => Math.abs(m.change) >= 2.5)),
        });
      }
    };
    loadBrief();
  }, [lang]);

  // ---------- Assistant (demo) ----------
  const [assistantQ, setAssistantQ] = useState("");
  const [assistantA, setAssistantA] = useState("");
  const askAssistant = async () => {
    setAssistantA("…");
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: assistantQ, lang }),
      });
      const data = await res.json();
      setAssistantA(data.answer || "(no answer)");
    } catch (_) {
      setAssistantA(
        lang === "cs"
          ? "Demo odpověď: Asistent běží, ale nepodařilo se načíst data."
          : "Demo answer: Assistant is running but failed to fetch data."
      );
    }
  };

  // ---------- filtrování & výpočty ----------
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ASSETS;
    return ASSETS.filter(
      (a) =>
        a.symbol.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q) ||
        a.sector.toLowerCase().includes(q)
    );
  }, [query]);

  const portfolioValue = useMemo(
    () => portfolio.reduce((sum, p) => sum + p.shares * p.price, 0),
    [portfolio]
  );

  return (
    <>
      <Navbar lang={lang} setLang={setLang} />

      <main className="container">
        {/* ---- Daily Brief ---- */}
        <Section title={lang === "cs" ? "Denní přehled" : "Daily Brief"}>
          <p className="text-sm whitespace-pre-line mb-3">{brief.summary}</p>
          {brief.wide && (
            <div className="text-xs text-amber-600 mb-2">
              {lang === "cs"
                ? "Upozornění: hrozí širší spready (nižší likvidita), zejména v pre‑marketu."
                : "Heads-up: Wider spreads likely (lower liquidity), especially in pre‑market."}
            </div>
          )}

          {/* Pre‑market movers */}
          <div className="mb-3">
            <h3 className="font-semibold mb-2">
              {lang === "cs" ? "Pre‑market movers" : "Pre‑market movers"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {(brief.movers?.length ? brief.movers : PREMARKET).map((m, i) => (
                <button
                  key={i}
                  onClick={() => {
                    const found = ASSETS.find((a) => a.symbol === m.symbol);
                    if (found) setActive(found);
                  }}
                  className="text-left px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition"
                >
                  <div className="font-semibold">{m.symbol}</div>
                  <div className={m.change >= 0 ? "text-emerald-600" : "text-rose-600"}>
                    {m.change}%
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* IPO list */}
          <div>
            <h3 className="font-semibold mb-2">{lang === "cs" ? "IPO tento týden" : "IPO this week"}</h3>
            <ul className="text-sm">
              {(brief.ipos?.length ? brief.ipos : IPOS).map((i, idx) => (
                <li key={idx} className="mb-1 flex justify-between gap-3">
                  <span className="font-medium">{i.ticker}</span>
                  <span className="flex-1 text-slate-500">{i.name}</span>
                  <span className="text-slate-400">{i.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* ---- Search + Detail ---- */}
        <Section title={lang === "cs" ? "Hledat & Detail" : "Search & Detail"}>
          <div className="mb-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={lang === "cs" ? "Zadej ticker / název / sektor…" : "Enter ticker / name / sector…"}
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Seznam výsledků */}
            <div className="space-y-1">
              {filtered.map((a) => (
                <button
                  key={a.symbol}
                  onClick={() => setActive(a)}
                  className={`w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition ${
                    active?.symbol === a.symbol ? "bg-slate-100 dark:bg-slate-800" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">{a.symbol}</div>
                    <div className="text-sm text-slate-500">{a.name}</div>
                  </div>
                  <div className="text-xs text-slate-500">
                    {a.type} • {a.sector}
                  </div>
                </button>
              ))}
            </div>

            {/* Detail aktiva */}
            <div className="md:col-span-2">
              <div className="card">
                <h3 className="text-lg font-semibold mb-1">
                  {active.symbol} — {active.name}
                </h3>
                <p className="text-sm text-slate-500 mb-3">
                  {lang === "cs"
                    ? "Ukázkový detail aktiva. Grafy a rozšířené fundamenty přidáme po prvním deployi."
                    : "Sample asset detail. Charts & extended fundamentals will be added after the first deploy."}
                </p>
                <div className="text-sm">
                  <div>
                    <span className="text-slate-500">{lang === "cs" ? "Sektor:" : "Sector:"}</span> {active.sector}
                  </div>
                  <div>
                    <span className="text-slate-500">{lang === "cs" ? "Typ:" : "Type:"}</span> {active.type}
                  </div>
                  <div>
                    <span className="text-slate-500">{lang === "cs" ? "Div. výnos:" : "Div. yield:"}</span>{" "}
                    {active.dividendYield ? `${(active.dividendYield * 100).toFixed(2)} %` : "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ---- Watchlist ---- */}
        <Section title="Watchlist">
          <div className="flex flex-wrap gap-2 mb-3">
            {ASSETS.map((a) => (
              <button
                key={a.symbol}
                onClick={() => setWatch((w) => (w.includes(a.symbol) ? w : [...w, a.symbol]))}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
              >
                + {a.symbol}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {watch.map((s, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl p-2 bg-slate-100 dark:bg-slate-800"
              >
                <div className="font-semibold">{s}</div>
                <Button variant="ghost" onClick={() => setWatch((w) => w.filter((x) => x !== s))}>
                  {lang === "cs" ? "Odebrat" : "Remove"}
                </Button>
              </div>
            ))}
          </div>
        </Section>

        {/* ---- Portfolio ---- */}
        <Section title={lang === "cs" ? "Portfolio" : "Portfolio"}>
          <div className="mb-2 text-sm text-slate-600">
            {lang === "cs" ? "Hodnota portfolia:" : "Portfolio value:"}{" "}
            <span className="font-semibold">{currency(portfolioValue)}</span>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="py-2">Ticker</th>
                <th>{lang === "cs" ? "Ks" : "Qty"}</th>
                <th>{lang === "cs" ? "Cena" : "Price"}</th>
                <th>{lang === "cs" ? "Hodnota" : "Value"}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {portfolio.map((p, i) => (
                <tr key={i} className="border-t border-slate-200 dark:border-slate-800">
                  <td className="py-2 font-semibold">{p.symbol}</td>
                  <td>{p.shares}</td>
                  <td>{currency(p.price)}</td>
                  <td>{currency(p.shares * p.price)}</td>
                  <td>
                    <Button variant="ghost" onClick={() => setPortfolio((arr) => arr.filter((_, idx) => idx !== i))}>
                      {lang === "cs" ? "Smazat" : "Delete"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {ASSETS.map((a) => (
              <Button
                key={a.symbol}
                variant="ghost"
                onClick={() =>
                  setPortfolio((arr) => [
                    ...arr,
                    { symbol: a.symbol, shares: 10, price: a.prices[a.prices.length - 1].p },
                  ])
                }
              >
                + {lang === "cs" ? "Přidat" : "Add"} {a.symbol}
              </Button>
            ))}
          </div>
        </Section>

        {/* ---- Assistant ---- */}
        <Section title={lang === "cs" ? "Asistent" : "Assistant"}>
          <p className="text-sm text-slate-600 mb-2">
            {lang === "cs"
              ? "Zeptej se na volatilitou, spready, co se dnes děje — odpověď je zatím demo."
              : "Ask about volatility, spreads, what’s happening today — answer is demo for now."}
          </p>
          <div className="flex gap-2">
            <input
              value={assistantQ}
              onChange={(e) => setAssistantQ(e.target.value)}
              placeholder={lang === "cs" ? "Napiš otázku…" : "Type a question…"}
              className="w-full px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 outline-none"
            />
            <Button onClick={askAssistant}>{lang === "cs" ? "Odeslat" : "Send"}</Button>
          </div>
          {assistantA && <div className="mt-3 text-sm bg-slate-100 dark:bg-slate-800 rounded-xl p-3">{assistantA}</div>}
        </Section>

        <div className="py-10 text-xs text-slate-500">
          © {new Date().getFullYear()} Market True • demo (UI + API). Žádné investiční poradenství.
        </div>
      </main>
    </>
  );
}
