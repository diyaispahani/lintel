// Public listing page: no phone number, just an "I'm interested" chat.

import Link from "next/link";
import { notFound } from "next/navigation";
import { PropertyArt } from "@/app/ListingCard";
import { DEAL_LABEL, formatDate, formatPrice } from "@/lib/match";
import { getListing, toPublic } from "@/lib/store";
import Chat from "./Chat";

export const dynamic = "force-dynamic";

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = getListing(id);
  if (!listing) notFound();
  const l = toPublic(listing);
  const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  const facts: [string, string][] = [
    ["Type", l.bhk ? `${l.bhk} BHK ${l.propertyType.toLowerCase()}` : l.propertyType],
    ["Carpet area", `${l.areaSqft.toLocaleString("en-IN")} sq ft`],
    ["Furnishing", l.furnishing],
    ["Available from", formatDate(l.availableFrom)],
    ["Car parking", l.carParking ? `${l.carParking} covered` : "None"],
    ...(l.dealType === "sale"
      ? ([
          ["Possession", l.possession],
          ["RERA", l.reraRegistered ? "Registered" : "Not registered"],
        ] as [string, string][])
      : ([
          ["Security deposit", `${l.depositMonths} months (${inr((l.depositMonths ?? 0) * l.price)})`],
          ["Lock-in", l.lockInMonths ? `${l.lockInMonths} months` : "No lock-in"],
          ["Maintenance", l.maintenance ? `${inr(l.maintenance)}/month` : "Included"],
          ["Preferred", l.tenantPreference === "Any" ? "Anyone" : l.tenantPreference],
          ["Pets", l.petsAllowed ? "Allowed" : "Not allowed"],
        ] as [string, string][])),
  ];

  return (
    <>
      <Link href="/listings" className="muted small">← All homes</Link>
      <div className={`lcover detail-cover ${l.dealType}`}>
        <PropertyArt type={l.propertyType} />
      </div>
      <div className="detail-head">
        <div>
          <div className="row" style={{ marginBottom: 14 }}>
            <span className="badge deal">{DEAL_LABEL[l.dealType]}</span>
            {l.mygateVerified && <span className="badge mygate">MyGate verified owner</span>}
            <span className="badge owner">₹0 brokerage</span>
          </div>
          <h1 style={{ margin: 0 }}>{l.title}</h1>
          <p className="muted" style={{ margin: "6px 0 0" }}>{l.society} · {l.area} · Listed by {l.ownerName}, the owner</p>
        </div>
        <p className="price" style={{ margin: 0, fontSize: "2.2rem" }}>{formatPrice(l.price, l.dealType)}</p>
      </div>

      <div className="facts">
        {facts.map(([k, v]) => (
          <div key={k} className="fact"><span>{k}</span><strong>{v}</strong></div>
        ))}
      </div>

      {l.details && <p>{l.details}</p>}
      {l.amenities.length > 0 && (
        <div className="amenities">
          {l.amenities.map((a) => <span key={a} className="badge plain">{a}</span>)}
        </div>
      )}

      <div className="card" style={{ marginTop: 24 }}>
        <h2>Interested?</h2>
        <p className="muted small">
          The owner&apos;s number is private. Answer a few quick questions; if the owner likes the fit, you both get each other&apos;s number.
        </p>
        <Chat listingId={l.id} dealType={l.dealType} />
      </div>
    </>
  );
}
