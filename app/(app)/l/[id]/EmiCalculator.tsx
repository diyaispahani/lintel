"use client";

// Home-loan EMI for homes on sale. Standard reducing-balance formula:
// EMI = P × r × (1 + r)^n / ((1 + r)^n − 1), r = monthly rate, n = months.

import { useState } from "react";

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

export default function EmiCalculator({ price }: { price: number }) {
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);

  const principal = price * (1 - downPct / 100);
  const r = rate / 12 / 100;
  const n = years * 12;
  const emi = r === 0 ? principal / n : (principal * r * (1 + r) ** n) / ((1 + r) ** n - 1);
  const total = emi * n;

  return (
    <div className="card emi">
      <h2 style={{ marginTop: 0 }}>Home loan EMI</h2>
      <div className="emi-grid">
        <div className="emi-inputs">
          <label htmlFor="down">Down payment: {downPct}% ({inr(price * downPct / 100)})</label>
          <input id="down" type="range" min={10} max={60} step={5} value={downPct} onChange={(e) => setDownPct(Number(e.target.value))} />
          <label htmlFor="rate">Interest rate: {rate.toFixed(2)}% a year</label>
          <input id="rate" type="range" min={7} max={12} step={0.05} value={rate} onChange={(e) => setRate(Number(e.target.value))} />
          <label htmlFor="years">Tenure: {years} years</label>
          <input id="years" type="range" min={5} max={30} step={1} value={years} onChange={(e) => setYears(Number(e.target.value))} />
        </div>
        <div className="emi-result">
          <span>Monthly EMI</span>
          <strong>{inr(emi)}</strong>
          <dl>
            <div><dt>Loan amount</dt><dd>{inr(principal)}</dd></div>
            <div><dt>Total interest</dt><dd>{inr(total - principal)}</dd></div>
            <div><dt>Total paid</dt><dd>{inr(total)}</dd></div>
          </dl>
        </div>
      </div>
      <p className="muted small" style={{ margin: "12px 0 0" }}>An estimate only. Your bank&apos;s rate, fees and eligibility will differ.</p>
    </div>
  );
}
