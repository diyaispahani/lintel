"use client";

// "Looking for…": a seeker posts what they want; matching owners can invite them.

import Link from "next/link";
import { useState } from "react";

export default function Wanted() {
  const [form, setForm] = useState({ dealType: "rent", area: "", maxBudget: "", bhk: "2", note: "", name: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<{ id: string; key: string } | null>(null);

  const set = (name: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [name]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    }).catch(() => null);
    const data = await res?.json().catch(() => null);
    setSaving(false);
    if (!res?.ok || !data) return setError(data?.error ?? "Couldn't save. Please try again.");
    setCreated(data);
  }

  if (created) {
    const link = `/wanted/${created.id}?key=${created.key}`;
    return (
      <>
        <h1>You&apos;re on the list ✅</h1>
        <p className="muted">Owners with a matching property can now invite you. Your number stays private.</p>
        <div className="card">
          <h2>Your private page</h2>
          <p className="muted small">Bookmark this. It shows matching properties and owners who invited you.</p>
          <p className="linkbox">{`${window.location.origin}${link}`}</p>
          <Link href={link}>Open my page →</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <h1>Tell owners what you&apos;re looking for</h1>
      <p className="muted">Can&apos;t find the right place? Post it here. Owners with a match can invite you directly, no brokers.</p>
      <form onSubmit={submit} className="card">
        <div className="two">
          <div>
            <label htmlFor="dealType">I want to</label>
            <select id="dealType" value={form.dealType} onChange={set("dealType")}>
              <option value="rent">Rent</option>
              <option value="sale">Buy</option>
              <option value="lease">Lease (commercial)</option>
            </select>
          </div>
          <div>
            <label htmlFor="area">Area</label>
            <input id="area" value={form.area} onChange={set("area")} placeholder="HSR Layout" />
          </div>
          <div>
            <label htmlFor="maxBudget">{form.dealType === "sale" ? "Max budget (₹ total)" : "Max budget (₹ per month)"}</label>
            <input id="maxBudget" value={form.maxBudget} onChange={set("maxBudget")} inputMode="numeric" placeholder={form.dealType === "sale" ? "20000000" : "35000"} />
          </div>
          <div>
            <label htmlFor="bhk">Size</label>
            <select id="bhk" value={form.bhk} onChange={set("bhk")}>
              {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n} BHK</option>)}
              <option value="0">Any / commercial</option>
            </select>
          </div>
        </div>
        <label htmlFor="note">About you (optional)</label>
        <textarea id="note" value={form.note} onChange={set("note")} placeholder="Couple with a dog, moving in December…" />
        <div className="two">
          <div>
            <label htmlFor="name">Your name</label>
            <input id="name" value={form.name} onChange={set("name")} placeholder="Kavya" />
          </div>
          <div>
            <label htmlFor="phone">Your phone</label>
            <input id="phone" value={form.phone} onChange={set("phone")} inputMode="tel" placeholder="98xxxxxxxx" />
          </div>
        </div>
        <p className="muted small">🔒 Owners see your first name and needs, never your number.</p>
        <button className="full" disabled={saving}>{saving ? "Saving…" : "Post my request"}</button>
        {error && <div className="error">{error}</div>}
      </form>
    </>
  );
}
