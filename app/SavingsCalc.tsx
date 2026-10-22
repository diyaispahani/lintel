"use client";

// "What would a broker cost you?" Brokers in India typically charge about one month's rent.

import { useState } from "react";

export default function SavingsCalc() {
  const [rent, setRent] = useState(35000);
  const fee = rent; // one month's rent
  const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  return (
    <div className="calc">
      <label htmlFor="rent" className="calc-label">Monthly rent</label>
      <div className="calc-value display">{inr(rent)}</div>
      <input id="rent" type="range" min={10000} max={200000} step={1000} value={rent} onChange={(e) => setRent(Number(e.target.value))} />
      <div className="calc-compare">
        <div>
          <span className="muted small">Typical broker fee</span>
          <strong className="calc-old">{inr(fee)}</strong>
        </div>
        <div>
          <span className="muted small">On GharDirect</span>
          <strong className="calc-new">₹0</strong>
        </div>
      </div>
      <p className="muted small" style={{ margin: 0 }}>Brokers usually charge about one month&apos;s rent from tenants, and often the same again from owners.</p>
    </div>
  );
}
