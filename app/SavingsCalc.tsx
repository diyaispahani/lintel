"use client";

// "What would a broker cost you?" Brokers in India typically charge about one month's rent.

import { useState } from "react";

export default function SavingsCalc() {
  const [rent, setRent] = useState(45000);
  const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  return (
    <div className="calc">
      <label htmlFor="rent" className="calc-label">Monthly rent</label>
      <div className="calc-value display">{inr(rent)}</div>
      <input id="rent" type="range" min={10000} max={250000} step={1000} value={rent} onChange={(e) => setRent(Number(e.target.value))} />
      <div className="calc-compare">
        <div>
          <span>Typical broker fee</span>
          <strong className="calc-old">{inr(rent)}</strong>
        </div>
        <div>
          <span>On Lintel</span>
          <strong className="calc-new">₹0</strong>
        </div>
      </div>
      <p className="muted small" style={{ margin: 0 }}>Brokers usually charge tenants about one month&apos;s rent, and often charge owners the same again.</p>
    </div>
  );
}
