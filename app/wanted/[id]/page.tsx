// A seeker's private page: owners who invited them, and every listing that matches.

import Link from "next/link";
import { DEAL_LABEL, formatPrice, matches } from "@/lib/match";
import { allListings, getRequest, requestToPublic, toPublic, type PublicListing } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function MyRequest({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ key?: string }>;
}) {
  const { id } = await params;
  const { key } = await searchParams;
  const request = getRequest(id);
  if (!request || key !== request.key) return <div className="error">This link isn&apos;t valid.</div>;

  const pub = requestToPublic(request);
  const listings = allListings().map(toPublic);
  const invited = listings.filter((l) => request.invitedTo.includes(l.id));
  const matching = listings.filter((l) => matches(pub, l) && !request.invitedTo.includes(l.id));

  return (
    <>
      <p className="muted small" style={{ margin: 0 }}>Your private page</p>
      <h1>Hi {request.name}</h1>
      <p className="muted" style={{ marginTop: 0 }}>
        Looking to {DEAL_LABEL[request.dealType].toLowerCase()} · {request.bhk ? `${request.bhk} BHK` : "any size"} · {request.area} · up to{" "}
        {formatPrice(request.maxBudget, request.dealType)}
      </p>

      <h2>✉️ Owners who invited you</h2>
      {invited.length === 0 ? <div className="card muted">No invites yet. Owners with a match will see your request.</div> : invited.map((l) => <ListingCard key={l.id} l={l} />)}

      <h2 style={{ marginTop: 24 }}>Other matching properties</h2>
      {matching.length === 0 ? <div className="card muted">Nothing else matches right now.</div> : matching.map((l) => <ListingCard key={l.id} l={l} />)}
    </>
  );
}

function ListingCard({ l }: { l: PublicListing }) {
  return (
    <Link href={`/l/${l.id}`} className="card">
      <div className="row between">
        <span className="price">{formatPrice(l.price, l.dealType)}</span>
        {l.mygateVerified && <span className="badge mygate">✓ MyGate verified</span>}
      </div>
      <strong>{l.title}</strong>
      <div className="muted">📍 {l.society}, {l.area}</div>
    </Link>
  );
}
