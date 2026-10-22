"use client";

// SIMULATED KYC for the prototype: a phone OTP step and a "Verify with DigiLocker"
// step, both faked in the browser. No ID numbers are asked for, sent or stored.
// A real version would use a licensed provider (DigiLocker / Aadhaar OTP via a KUA).

import { useState } from "react";

export default function KycStep({ who, name, phone, verified, onVerified }: {
  who: "owner" | "seeker";
  name: string;
  phone: string;
  verified: boolean;
  onVerified: (ok: boolean) => void;
}) {
  const [code, setCode] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const [otpOk, setOtpOk] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const phoneOk = phone.replace(/\D/g, "").length >= 10;

  if (verified) {
    return (
      <div className="kyc kyc-done">
        <strong>KYC verified</strong>
        <span>{name || "You"} · phone confirmed · identity checked (demo)</span>
        <button type="button" className="btn-ghost btn-sm" onClick={() => onVerified(false)}>Undo</button>
      </div>
    );
  }

  return (
    <div className="kyc">
      <div className="row between">
        <strong>Verify your identity</strong>
        <span className="lchip lchip-sample">Demo</span>
      </div>
      <p className="muted small" style={{ margin: "4px 0 12px" }}>
        {who === "owner" ? "Seekers see a KYC-verified badge on your listing." : "Owners see a KYC-verified badge on your enquiry."} This prototype simulates
        the checks; no ID numbers are collected.
      </p>

      {!otpOk ? (
        <div className="kyc-step">
          <span className="kyc-n">1</span>
          {!code ? (
            <button type="button" className="btn-ghost btn-sm" disabled={!phoneOk} onClick={() => { setCode(String(Math.floor(1000 + Math.random() * 9000))); setError(""); }}>
              {phoneOk ? "Send OTP to my phone" : "Enter your phone number first"}
            </button>
          ) : (
            <div className="row" style={{ flex: 1 }}>
              <input value={typed} onChange={(e) => setTyped(e.target.value)} inputMode="numeric" placeholder="4-digit OTP" style={{ width: 130 }} aria-label="OTP" />
              <button type="button" className="btn-sm" onClick={() => (typed.trim() === code ? setOtpOk(true) : setError("That code doesn't match."))}>Confirm</button>
              <span className="muted small">Demo SMS: your code is <b>{code}</b></span>
            </div>
          )}
        </div>
      ) : (
        <div className="kyc-step">
          <span className="kyc-n">2</span>
          <button
            type="button"
            className="btn-sm"
            disabled={busy || !name.trim()}
            onClick={() => {
              setBusy(true);
              setTimeout(() => { setBusy(false); onVerified(true); }, 1400);
            }}
          >
            {busy ? "Checking with DigiLocker…" : name.trim() ? "Verify with DigiLocker" : "Enter your name first"}
          </button>
          <span className="muted small">Phone confirmed</span>
        </div>
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
}
