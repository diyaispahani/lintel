"use client";

// Owner form: list a flat without showing your number.

import { useState } from "react";

type Created = { id: string; ownerKey: string };

export default function Home() {
  const [form, setForm] = useState({ title: "", area: "", price: "", details: "", ownerPhone: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<Created | null>(null);

  const set = (name: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [name]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/listings", {
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
    const origin = window.location.origin;
    const publicLink = `${origin}/l/${created.id}`;
    const ownerLink = `${origin}/owner/${created.id}?key=${created.ownerKey}`;
    return (
      <>
        <h1>Your listing is live 🎉</h1>
        <p className="muted">Your number is hidden. Every enquiry is screened by AI first.</p>
        <div className="card">
          <h2>Share this with seekers</h2>
          <p className="linkbox">{publicLink}</p>
          <a href={publicLink} target="_blank" rel="noreferrer">Open listing page →</a>
        </div>
        <div className="card">
          <h2>Your private shortlist</h2>
          <p className="muted small">Keep this link to yourself. It's how you see screened enquiries.</p>
          <p className="linkbox">{ownerLink}</p>
          <a href={ownerLink}>Open my shortlist →</a>
        </div>
      </>
    );
  }

  return (
    <>
      <h1>Shush 🤫</h1>
      <p className="muted">List your flat without your phone number. AI questions every enquirer and filters out brokers and sales calls.</p>
      <form onSubmit={submit} className="card">
        <label htmlFor="title">Title</label>
        <input id="title" value={form.title} onChange={set("title")} placeholder="2BHK for rent, semi-furnished" />
        <label htmlFor="area">Area / city</label>
        <input id="area" value={form.area} onChange={set("area")} placeholder="HSR Layout, Bengaluru" />
        <label htmlFor="price">Rent or price</label>
        <input id="price" value={form.price} onChange={set("price")} placeholder="₹32,000 / month" />
        <label htmlFor="details">Details (optional)</label>
        <textarea id="details" value={form.details} onChange={set("details")} placeholder="Floor, parking, pets, family or bachelors…" />
        <label htmlFor="phone">Your phone number</label>
        <input id="phone" value={form.ownerPhone} onChange={set("ownerPhone")} placeholder="98xxxxxxxx" inputMode="tel" />
        <p className="muted small">🔒 Never shown on the listing and never sent to the AI. Shared only with people you pick.</p>
        <button className="full" disabled={saving}>{saving ? "Saving…" : "Create listing"}</button>
        {error && <div className="error">{error}</div>}
      </form>
    </>
  );
}
