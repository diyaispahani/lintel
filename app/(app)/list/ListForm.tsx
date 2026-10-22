"use client";

// Owner form: list to rent, sell or lease, without showing your number.

import Link from "next/link";
import { useState } from "react";
import KycStep from "@/app/KycStep";
import type { MoveOutNotice } from "@/lib/mygate";
import { AMENITIES, type DealType } from "@/lib/store";

type Created = { id: string; ownerKey: string };

export default function ListForm({ notice }: { notice: MoveOutNotice | null }) {
  const [form, setForm] = useState({
    dealType: (notice?.suggestedDeal ?? "rent") as DealType,
    propertyType: "Apartment",
    title: notice ? `${notice.bhk}BHK in ${notice.society}` : "",
    society: notice?.society ?? "",
    area: notice?.area ?? "",
    price: "",
    bhk: notice ? String(notice.bhk) : "2",
    areaSqft: "",
    furnishing: "Semi-furnished",
    availableFrom: notice?.movingOut ?? "",
    depositMonths: "3",
    lockInMonths: "11",
    maintenance: "0",
    tenantPreference: "Any",
    carParking: "1",
    possession: "Ready to move",
    details: "",
    ownerName: notice?.ownerName ?? "",
    ownerPhone: notice?.ownerPhone ?? "",
  });
  const [petsAllowed, setPets] = useState(false);
  const [reraRegistered, setRera] = useState(false);
  const [kyc, setKyc] = useState(false);
  const [amenities, setAmenities] = useState<string[]>(["Lift", "Power backup", "24x7 security"]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState<Created | null>(null);

  const set = (name: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [name]: e.target.value });
  const toggleAmenity = (a: string) => setAmenities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));

  const isSale = form.dealType === "sale";
  const commercial = form.propertyType === "Office" || form.propertyType === "Shop";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch("/api/listings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, petsAllowed, reraRegistered, amenities, kyc, mygateId: notice?.id }),
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
        <p className="eyebrow">You&apos;re live</p>
        <h1>Your listing is published</h1>
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

  return (
    <>
      <p className="eyebrow">Free · No brokers</p>
      <h1>List your property</h1>
      <p className="muted">Your number stays hidden until you choose to connect.</p>

      {notice ? (
        <div className="demo-banner">Imported from MyGate: flat {notice.flat}, {notice.society}. Owner verified as a resident. (Demo data)</div>
      ) : (
        <p className="small">Live in a MyGate society? <Link href="/mygate">Import your flat from MyGate in one tap →</Link></p>
      )}

      <form onSubmit={submit} className="card">
        <fieldset>
          <legend>The basics</legend>
          <div className="two">
            <div>
              <label htmlFor="dealType">I want to</label>
              <select id="dealType" value={form.dealType} onChange={set("dealType")}>
                <option value="rent">Rent it out</option>
                <option value="sale">Sell it</option>
                <option value="lease">Lease it (commercial)</option>
              </select>
            </div>
            <div>
              <label htmlFor="propertyType">Property type</label>
              <select id="propertyType" value={form.propertyType} onChange={set("propertyType")}>
                {["Apartment", "Independent house", "Villa", "Office", "Shop"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
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
          </div>
        </fieldset>

        <fieldset>
          <legend>Size & features</legend>
          <div className="three">
            {!commercial && (
              <div>
                <label htmlFor="bhk">Bedrooms</label>
                <select id="bhk" value={form.bhk} onChange={set("bhk")}>
                  {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} BHK</option>)}
                </select>
              </div>
            )}
            <div>
              <label htmlFor="areaSqft">Carpet area (sq ft)</label>
              <input id="areaSqft" value={form.areaSqft} onChange={set("areaSqft")} inputMode="numeric" placeholder="1100" />
            </div>
            <div>
              <label htmlFor="carParking">Car parking</label>
              <select id="carParking" value={form.carParking} onChange={set("carParking")}>
                {[0, 1, 2, 3, 4].map((n) => <option key={n} value={n}>{n === 0 ? "None" : `${n} covered`}</option>)}
              </select>
            </div>
          </div>
          <div className="two">
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
          <label>Amenities</label>
          <div className="chips">
            {AMENITIES.map((a) => (
              <button key={a} type="button" className={`chip ${amenities.includes(a) ? "on" : ""}`} aria-pressed={amenities.includes(a)} onClick={() => toggleAmenity(a)}>
                {a}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>{isSale ? "Price & legal" : "Rent & terms"}</legend>
          <label htmlFor="price">{isSale ? "Asking price (₹ total)" : "Rent (₹ per month)"}</label>
          <input id="price" value={form.price} onChange={set("price")} inputMode="numeric" placeholder={isSale ? "18500000" : "32000"} />
          {isSale ? (
            <>
              <label htmlFor="possession">Possession</label>
              <select id="possession" value={form.possession} onChange={set("possession")}>
                <option>Ready to move</option>
                <option>Under construction</option>
              </select>
              <label className="check" style={{ marginTop: 14 }}>
                <input type="checkbox" checked={reraRegistered} onChange={(e) => setRera(e.target.checked)} /> RERA registered
              </label>
            </>
          ) : (
            <>
              <div className="three">
                <div>
                  <label htmlFor="depositMonths">Deposit (months)</label>
                  <select id="depositMonths" value={form.depositMonths} onChange={set("depositMonths")}>
                    {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((n) => <option key={n} value={n}>{n} month{n > 1 ? "s" : ""}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="lockInMonths">Lock-in</label>
                  <select id="lockInMonths" value={form.lockInMonths} onChange={set("lockInMonths")}>
                    {[0, 3, 6, 11, 12, 24, 36].map((n) => <option key={n} value={n}>{n === 0 ? "No lock-in" : `${n} months`}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="maintenance">Maintenance (₹/mo)</label>
                  <input id="maintenance" value={form.maintenance} onChange={set("maintenance")} inputMode="numeric" placeholder="0 = included" />
                </div>
              </div>
              <div className="two">
                <div>
                  <label htmlFor="tenantPreference">Preferred tenants</label>
                  <select id="tenantPreference" value={form.tenantPreference} onChange={set("tenantPreference")}>
                    <option value="Any">Anyone</option>
                    <option>Family</option>
                    <option>Bachelors</option>
                    <option value="Company">Company lease</option>
                  </select>
                </div>
                <label className="check" style={{ alignSelf: "end", marginBottom: 12 }}>
                  <input type="checkbox" checked={petsAllowed} onChange={(e) => setPets(e.target.checked)} /> Pets allowed
                </label>
              </div>
            </>
          )}
          <label htmlFor="details">Anything else (optional)</label>
          <textarea id="details" value={form.details} onChange={set("details")} placeholder="Floor, view, nearby metro, who it suits…" />
        </fieldset>

        <fieldset>
          <legend>Your contact (kept private)</legend>
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
          <KycStep who="owner" name={form.ownerName} phone={form.ownerPhone} verified={kyc} onVerified={setKyc} />
          <p className="muted small" style={{ marginTop: 10 }}>Never shown publicly and never sent to the AI. Shared only with people you Connect with.</p>
        </fieldset>

        <button className="full btn-lg" disabled={saving}>{saving ? "Publishing…" : "Publish listing"}</button>
        {error && <div className="error">{error}</div>}
      </form>
    </>
  );
}
