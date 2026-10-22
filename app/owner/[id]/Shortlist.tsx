"use client";

// Screened enquiries for the owner, with blocked ones hidden and a Share number button.

import { useCallback, useEffect, useState } from "react";
import type { Enquiry, PublicListing } from "@/lib/store";

type Item = Omit<Enquiry, "transcript">;
type Data = { listing: PublicListing; enquiries: Item[] };

export default function Shortlist({ listingId, ownerKey }: { listingId: string; ownerKey: string }) {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");
  const [showBlocked, setShowBlocked] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/listings/${listingId}?key=${encodeURIComponent(ownerKey)}`).catch(() => null);
    const body = await res?.json().catch(() => null);
    if (!res?.ok || !body) return setError(body?.error ?? "Couldn't load your shortlist.");
    setData(body);
  }, [listingId, ownerKey]);

  // Refresh every 5 s so new enquiries appear on their own.
  useEffect(() => {
    load();
    const timer = setInterval(load, 5000);
    return () => clearInterval(timer);
  }, [load]);

  async function share(id: string) {
    await fetch(`/api/enquiries/${id}/share`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: ownerKey }),
    });
    load();
  }

  if (error) return <div className="error">{error}</div>;
  if (!data) return <p className="muted">Loading…</p>;

  const all = data.enquiries;
  const shown = all.filter((e) => !e.hidden);
  const blocked = all.filter((e) => e.hidden);
  const genuine = all.filter((e) => e.label === "Genuine").length;
  const unclear = all.filter((e) => e.label === "Unclear").length;
  const publicLink = typeof window === "undefined" ? "" : `${window.location.origin}/l/${listingId}`;

  return (
    <>
      <h1>Your shortlist</h1>
      <p className="muted">{data.listing.title} · {data.listing.area}</p>

      <div className="card">
        {all.length === 0 ? (
          <p>No enquiries yet. Share your listing link: <span className="linkbox">{publicLink}</span></p>
        ) : (
          <p className="stats">
            {all.length} {all.length === 1 ? "enquiry" : "enquiries"}: {blocked.length} blocked as sales or brokers, {genuine} genuine
            {unclear > 0 && `, ${unclear} unclear`}. 📵 Your phone rang 0 times.
          </p>
        )}
      </div>

      {shown.map((e) => <EnquiryCard key={e.id} e={e} onShare={share} />)}

      {blocked.length > 0 && (
        <>
          <button className="secondary full" onClick={() => setShowBlocked(!showBlocked)}>
            {showBlocked ? "Hide" : "Show"} {blocked.length} blocked
          </button>
          {showBlocked && blocked.map((e) => <EnquiryCard key={e.id} e={e} onShare={share} />)}
        </>
      )}
    </>
  );
}

function EnquiryCard({ e, onShare }: { e: Item; onShare: (id: string) => void }) {
  return (
    <div className="card">
      <span className={`badge ${e.label}`}>{e.label}</span>{" "}
      <span className="muted small">
        {Math.round(e.confidence * 100)}% sure{e.aiLabel !== e.label && ` (AI said ${e.aiLabel}, low confidence)`}
      </span>
      <p style={{ margin: "8px 0 0" }}>{e.summary}</p>
      <p className="reason">Why: {e.reason}</p>
      {e.shared ? (
        <span className="shared">✅ Number shared</span>
      ) : (
        <button onClick={() => onShare(e.id)}>Share my number</button>
      )}
    </div>
  );
}
