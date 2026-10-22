"use client";

// Owner form: list to rent, sell or lease, without showing your number.

import Link from "next/link";
import { useState } from "react";
import type { MoveOutNotice } from "@/lib/mygate";
import type { DealType } from "@/lib/store";

type Created = { id: string; ownerKey: string };

export default function ListForm({ notice }: { notice: MoveOutNotice | null }) {
  const [form, setForm] = useState({
    dealType: (notice?.suggestedDeal ?? "rent") as DealType,
    title: notice ? `${notice.bhk}BHK in ${notice.society}` : "",
    society: notice?.society ?? "",
    area: notice?.area ?? "",
    price: "",
    bhk: notice ? String(notice.bhk) : "2",
    furnishing: "Semi-furnished",
    availableFrom: notice?.movingOut ?? "",
    details: "",
    ownerName: notice?.ownerName ?? "",
    ownerPhone: notice?.ownerPhone ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<Created | null>(null);

  const set = (name: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [name]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, mygateId: notice?.id }),
    }).catch(() => null);
    const data = await res?.json().catch(() => null);
    setSaving(false);
    if (!res?.ok || !data) return setError(data?.error ?? "Couldn't save. Please try again.");
    setCreated(data);
  }

  if (created) {
    const origin = window.location.origin;
    const ownerLink = `${origin}/owner/${created.id}?key=${created.ownerKey}`;
    return (
      <>
        <h1>Your listing is live 🎉</h1>
        <p className="muted">Your number is hidden. Every enquiry is screened by AI, and you choose who to connect with.</p>
        <div className="card">
          <h2>Your public listing</h2>
          <p className="linkbox">{`${origin}/l/${created.id}`}</p>
          <Link href={`/l/${created.id}`}>Open listing →</Link>
        </div>
        <div className="card">
          <h2>Your private dashboard</h2>
          <p className="muted small">Keep this link to yourself. It shows screened enquiries and seekers who match your property.</p>
          <p className="linkbox">{ownerLink}</p>
          <Link href={`/owner/${created.id}?key=${created.ownerKey}`}>Open my dashboard →</Link>
        </div>
      </>
    );
  }

  const priceLabel = form.dealType === "sale" ? "Asking price (₹ total)" : "Rent (₹ per month)";

  return (
    <>
      <h1>List your property</h1>
      <p className="muted">Free, and no brokers. Your number stays hidden until you choose to connect.</p>

      {notice ? (
        <div className="demo-banner">✓ Imported from MyGate: flat {notice.flat}, {notice.society}. Owner verified as a resident. (Demo data)</div>
      ) : (
        <p className="small">Live in a MyGate society? <Link href="/mygate">Import your flat from MyGate in one tap →</Link></p>
      )}

      <form onSubmit={submit} className="card">
        <label htmlFor="dealType">I want to</label>
        <select id="dealType" value={form.dealType} onChange={set("dealType")}>
          <option value="rent">Rent it out</option>
          <option value="sale">Sell it</option>
          <option value="lease">Lease it (commercial)</option>
        </select>

        <label htmlFor="title">Title</label>
        <input id="title" value={form.title} onChange={set("title")} placeholder="Sunny 2BHK, semi-furnished" />

        <div className="two">
          <div>
            <label htmlFor="society">Society / building</label>
            <input id="society" value={form.society} onChange={set("society")} placeholder="Prestige Lakeside" />
          </div>
          <div>
            <label htmlFor="area">Area, city</label>
            <input id="area" value={form.area} onChange={set("area")} placeholder="HSR Layout, Bengaluru" />
          </div>
          <div>
            <label htmlFor="price">{priceLabel}</label>
            <input id="price" value={form.price} onChange={set("price")} inputMode="numeric" placeholder={form.dealType === "sale" ? "18500000" : "32000"} />
          </div>
          <div>
            <label htmlFor="bhk">Size</label>
            <select id="bhk" value={form.bhk} onChange={set("bhk")}>
              {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n} BHK</option>)}
              <option value="0">Commercial space</option>
            </select>
          </div>
          <div>
            <label htmlFor="furnishing">Furnishing</label>
            <select id="furnishing" value={form.furnishing} onChange={set("furnishing")}>
              {["Unfurnished", "Semi-furnished", "Fully furnished", "Bare shell"].map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="availableFrom">Available from</label>
            <input id="availableFrom" type="date" value={form.availableFrom} onChange={set("availableFrom")} />
          </div>
        </div>

        <label htmlFor="details">Details (optional)</label>
        <textarea id="details" value={form.details} onChange={set("details")} placeholder="Floor, parking, pets, who it suits…" />

        <div className="two">
          <div>
            <label htmlFor="ownerName">Your first name</label>
            <input id="ownerName" value={form.ownerName} onChange={set("ownerName")} placeholder="Priya" />
          </div>
          <div>
            <label htmlFor="ownerPhone">Your phone number</label>
            <input id="ownerPhone" value={form.ownerPhone} onChange={set("ownerPhone")} inputMode="tel" placeholder="98xxxxxxxx" />
          </div>
        </div>
        <p className="muted small">🔒 Never shown publicly and never sent to the AI. Shared only with people you Connect with.</p>

        <button className="full" disabled={saving}>{saving ? "Saving…" : "Publish listing"}</button>
        {error && <div className="error">{error}</div>}
      </form>
    </>
  );
}
