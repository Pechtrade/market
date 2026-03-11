"use client";

import { useEffect, useState } from "react";
import Section from "../../../components/Section";
import Button from "../../../components/Button";
import { currency } from "../../../lib/utils";

export default function AssetDetail({ params }) {
  const ticker = params.ticker.toUpperCase();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [aiSummary, setAiSummary] = useState("");
  const [aiMarket, setAiMarket] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/asset?ticker=${ticker}`);
        const d = await res.json();
        setData(d);
      } catch (e) {
        setData({ ok: false, error: "Nepodařilo se načíst data." });
      }
      setLoading(false);
    };
    load();
  }, [ticker]);

  const fetchAICompany = async () => {
    try {
      const res = await fetch("/api/company-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker }),
      });
      const d = await res.json();
      setAiSummary(d.result);
    } catch {
      setAiSummary("AI selhalo.");
    }
  };

  const fetchAIMarket = async () => {
    try {
      const res = await fetch("/api/market-ai", { method: "GET" });
      const d = await res.json();
      setAiMarket(d.summary);
    } catch {
      setAiMarket("AI selhalo.");
    }
  };

  if (loading) return <main className="container py-10">Načítám...</main>;

  if (!data || !data.ok)
    return (
      <main className="container py-10">
        <h1 className="text-3xl font-bold">Ticker {ticker}</h1>
        <p>Nepodařilo se načíst data.</p>
      </main>
    );

  const fx = data;

  return (
    <main className="container py-10">
      <h1 className="text-3xl font-bold mb-4">
        {fx.ticker} — {fx.name ?? ""}
      </h1>

      {/* Zaklad */}
      <Section title="Základní info">
        <p><b>Sektor:</b> {fx.sector}</p>
        <p><b>Industry:</b> {fx.industry}</p>
        <p><b>Dividenda:</b> {fx.dividendYield ? (fx.dividendYield * 100).toFixed(2) + "%" : "—"}</p>
        <p className="mt-3 whitespace-pre-line">{fx.description || "Popis firmy není dostupný."}</p>
      </Section>

      {/* Fundamentals */}
      <Section title="Fundamenty">
        {fx.fundamentals ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div><b>P/E:</b> {fx.fundamentals.pe ?? "—"}</div>
            <div><b>P/S:</b> {fx.fundamentals.ps ?? "—"}</div>
            <div><b>P/B:</b> {fx.fundamentals.pb ?? "—"}</div>
            <div><b>Beta:</b> {fx.fundamentals.beta ?? "—"}</div>
            <div><b>Revenue:</b> {fx.fundamentals.revenue ? currency(fx.fundamentals.revenue) : "—"}</div>
            <div><b>Net income:</b> {fx.fundamentals.netIncome ? currency(fx.fundamentals.netIncome) : "—"}</div>
            <div><b>Dluh:</b> {fx.fundamentals.debt ? currency(fx.fundamentals.debt) : "—"}</div>
            <div><b>Hotovost:</b> {fx.fundamentals.cash ? currency(fx.fundamentals.cash) : "—"}</div>
          </div>
        ) : (
          <p>Bez dat.</p>
        )}
      </Section>

      {/* DCF */}
      <Section title="Vnitřní hodnota (DCF)">
        {fx.dcf ? (
          <>
            <p><b>Fair value:</b> {currency(fx.dcf.perShare)}</p>
            <p><b>Equity value:</b> {currency(fx.dcf.equityValueMld * 1_000_000_000)}</p>
          </>
        ) : (
          <p>DCF nelze spočítat.</p>
        )}
      </Section>

      {/* Pre / After market */}
      <Section title="Pre / After Market">
        <p><b>Pre-market:</b> {fx.extended?.preMarketPrice ?? "—"} ({fx.extended?.preMarketChange ?? "—"}%)</p>
        <p><b>After-hours:</b> {fx.extended?.postMarketPrice ?? "—"} ({fx.extended?.postMarketChange ?? "—"}%)</p>
      </Section>

      {/* Historie */}
      <Section title="Historická cena (demo)">
        <p>Po připojení Yahoo API zobrazíme graf.</p>
        {fx.history && fx.history.map((h, i) => (
          <div key={i}>
            Den {h.d}: {h.p}
          </div>
        ))}
      </Section>

      {/* AI firmy */}
      <Section title="AI shrnutí firmy">
        <Button onClick={fetchAICompany}>Získat shrnutí AI</Button>
        {aiSummary && <p className="mt-3 whitespace-pre-line">{aiSummary}</p>}
      </Section>

      {/* AI trh */}
      <Section title="AI tržní komentář">
        <Button onClick={fetchAIMarket}>AI komentář dne</Button>
        {aiMarket && <p className="mt-3 whitespace-pre-line">{aiMarket}</p>}
      </Section>

      <div className="py-10 text-xs text-slate-500">
        Detail generován z mock / šablonovaných dat.  
        Reálné API funkce doplníš později přidáním fetch().
      </div>
    </main>
  );
}
