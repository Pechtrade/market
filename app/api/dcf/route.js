"use client";
import { useEffect, useState } from "react";
import Section from "../components/Section"; // případně "../../../components/Section"
import { currency } from "../lib/utils";     // případně "../../../lib/utils"

export default function AssetDetailLike({ active }) {
  const [dcfValue, setDcfValue] = useState(null);

  useEffect(() => {
    if (!active?.symbol) {
      setDcfValue(null);
      return;
    }
    let cancelled = false;
    const loadDCF = async () => {
      try {
        const res = await fetch(`/api/dcf?ticker=${active.symbol}`);
        const data = await res.json();
        if (!cancelled) {
          setDcfValue(data?.ok ? data.fairValue : null);
        }
      } catch {
        if (!cancelled) setDcfValue(null);
      }
    };
    loadDCF();
    return () => (cancelled = true);
  }, [active]);

  return (
    <Section title="Vnitřní hodnota (DCF)">
      {dcfValue != null ? (
        <div><b>Fair value:</b> {currency(dcfValue)}</div>
      ) : (
        <div className="text-slate-500">DCF není k dispozici.</div>
      )}
    </Section>
  );
}
