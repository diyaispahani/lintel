// Public listing page: no phone number, just an "I'm interested" chat.

import { notFound } from "next/navigation";
import { DEAL_LABEL, formatDate, formatPrice } from "@/lib/match";
import { getListing, toPublic } from "@/lib/store";
import Chat from "./Chat";

export const dynamic = "force-dynamic";

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = getListing(id);
  if (!listing) notFound();
  const l = toPublic(listing);

  return (
    <>
      <div className="row">
        <span className="badge deal">{DEAL_LABEL[l.dealType]}</span>
        {l.mygateVerified && <span className="badge mygate">✓ MyGate verified owner</span>}
        <span className="badge owner">Listed by {l.ownerName} (owner) · 0 brokers</span>
      </div>
      <h1 style={{ marginTop: 8 }}>{l.title}</h1>
      <p className="price" style={{ margin: 0 }}>{formatPrice(l.price, l.dealType)}</p>
      <p className="muted" style={{ marginTop: 4 }}>📍 {l.society}, {l.area}</p>
      <div className="card">
        <div>{l.bhk ? `${l.bhk} BHK` : "Commercial space"} · {l.furnishing} · available from {formatDate(l.availableFrom)}</div>
        {l.details && <p style={{ margin: "8px 0 0" }}>{l.details}</p>}
      </div>
      <p className="muted small">
        The owner&apos;s number is private. Answer a few quick questions; if the owner likes the fit, you both get each other&apos;s number.
      </p>
      <Chat listingId={l.id} dealType={l.dealType} />
    </>
  );
}
