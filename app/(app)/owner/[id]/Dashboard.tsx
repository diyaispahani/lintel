"use client";

// Owner dashboard: AI-screened enquiries (brokers and sales hidden) with Connect,
// plus seekers whose "Looking for…" request matches this property, with Invite.

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { DEAL_LABEL, formatPrice } from "@/lib/match";
import type { Enquiry, PublicListing, PublicRequest } from "@/lib/store";

type Item = Omit<Enquiry, "transcript" | "phoneHash" | "seekerName" | "seekerPhone"> & {
  seeker: { name: string; phone: string } | null;
};
type MatchItem = PublicRequest & { invited: boolean };
type Data = { listing: PublicListing; enquiries: Item[]; matchingRequests: MatchItem[] };

export default function Dashboard({ listingId, ownerKey }: { listingId: string; ownerKey: string }) {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");
  const [showBlocked, setShowBlocked] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/listings/${listingId}?key=${encodeURIComponent(ownerKey)}`).catch(() => null);
    const body = await res?.json().catch(() => null);
    if (!res?.ok || !body) return setError(body?.error ?? "Couldn't load your dashboard.");
    setData(body);
  }, [listingId, ownerKey]);

  // Refresh every 5 s so new enquiries appear on their own.
  useEffect(() => {
    load();
    const timer = setInterval(load, 5000);
    return () => clearInterval(timer);
  }, [load]);

  async function post(url: string, extra: object = {}) {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: ownerKey, ...extra }),
    });
    load();
  }

  if (error) return <div className="error">{error}</div>;
  if (!data) return <p className="muted">Loading…</p>;

  const { listing, enquiries, matchingRequests } = data;
  const shown = enquiries.filter((e) => !e.hidden);
  const blocked = enquiries.filter((e) => e.hidden);
  const genuine = enquiries.filter((e) => e.label === "Genuine").length;
  const unclear = enquiries.filter((e) => e.label === "Unclear").length;

  return (
    <>
      <p className="muted small" style={{ margin: 0 }}>Owner dashboard · private</p>
      <h1>{listing.title}</h1>
      <p className="muted" style={{ marginTop: 0 }}>
        {DEAL_LABEL[listing.dealType]} · {formatPrice(listing.price, listing.dealType)} · {listing.society}, {listing.area} ·{" "}
        <Link href={`/l/${listing.id}`}>public page</Link>
      </p>

      <div className="card">
        {enquiries.length === 0 ? (
          <p className="stats">No enquiries yet. Your listing is live and your phone is quiet.</p>
        ) : (
          <p className="stats">
            {enquiries.length} {enquiries.length === 1 ? "enquiry" : "enquiries"}: {blocked.length} blocked as brokers or sales, {genuine} genuine
            {unclear > 0 && `, ${unclear} unclear`}. Your phone rang 0 times.
          </p>
        )}
      </div>

      {shown.map((e) => <EnquiryCard key={e.id} e={e} onConnect={() => post(`/api/enquiries/${e.id}/connect`)} />)}

      {blocked.length > 0 && (
        <>
          <button className="secondary full" onClick={() => setShowBlocked(!showBlocked)}>
            {showBlocked ? "Hide" : "Show"} {blocked.length} blocked
          </button>
          {showBlocked && blocked.map((e) => <EnquiryCard key={e.id} e={e} onConnect={() => post(`/api/enquiries/${e.id}/connect`)} />)}
        </>
      )}

      <h2 style={{ marginTop: 28 }}>Seekers looking for a place like yours</h2>
      <p className="muted small" style={{ marginTop: 0 }}>Matched on deal type, area, budget and size. Invite them to enquire.</p>
      {matchingRequests.length === 0 && <div className="card muted">No matching requests right now.</div>}
      {matchingRequests.map((r) => (
        <div key={r.id} className="card">
          <div className="row between">
            <strong>{r.name}</strong>
            <span className="muted small">
              {r.bhk ? `${r.bhk} BHK` : "Any size"} · up to {formatPrice(r.maxBudget, r.dealType)} · {r.area}
            </span>
          </div>
          {r.note && <p style={{ margin: "6px 0 10px" }}>{r.note}</p>}
          {r.invited ? (
            <span className="connected">Invited. They&apos;ll see your listing on their page.</span>
          ) : (
            <button onClick={() => post(`/api/requests/${r.id}/invite`, { listingId })}>Invite to enquire</button>
          )}
        </div>
      ))}
    </>
  );
}

function EnquiryCard({ e, onConnect }: { e: Item; onConnect: () => void }) {
  return (
    <div className="card">
      <span className={`badge ${e.label}`}>{e.label}</span>{" "}
      <span className="muted small">
        {Math.round(e.confidence * 100)}% sure{e.aiLabel !== e.label && ` (AI said ${e.aiLabel}, low confidence)`}
      </span>
      <p style={{ margin: "8px 0 0" }}>{e.summary}</p>
      <p className="reason">Why: {e.reason}</p>
      {e.seeker ? (
        <span className="connected">Connected: {e.seeker.name}, {e.seeker.phone}</span>
      ) : (
        <button onClick={onConnect}>Connect</button>
      )}
    </div>
  );
}
