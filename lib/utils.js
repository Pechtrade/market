// Helper: formát měny
export const currency = (value) =>
  new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "USD",
  }).format(value);

// Demo DCF výpočet
export function computeDCF({ fcf, growth, wacc, terminal, shares }) {
  if (!fcf || !growth || !wacc || !terminal || !shares) return null;

  const years = 5;
  let pv = 0;
  let f = fcf;

  for (let t = 1; t <= years; t++) {
    f = f * (1 + growth);
    pv += f / Math.pow(1 + wacc, t);
  }

  const tv = (f * (1 + terminal)) / (wacc - terminal);
  const pvTv = tv / Math.pow(1 + wacc, years);

  return {
    equityValueMld: pv + pvTv,
    perShare: ((pv + pvTv) * 1000) / shares,
  };
}
