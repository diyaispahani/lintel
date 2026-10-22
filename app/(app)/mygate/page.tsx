// SIMULATED MyGate screen: flats being vacated, one tap to list them on GharDirect.

import Link from "next/link";
import { formatDate } from "@/lib/match";
import { moveOutNotices } from "@/lib/mygate";

export default function MyGatePage() {
  return (
    <>
      <h1>MyGate × GharDirect</h1>
      <p className="demo-banner">Demo: simulated MyGate data. This shows how a MyGate partnership would work.</p>
      <p className="muted">
        MyGate already knows when a resident is moving out, and who really owns or lives in each flat. GharDirect turns that into a
        verified, broker-free listing in one tap.
      </p>

      <h2>Moving out soon</h2>
      {moveOutNotices.map((n) => (
        <div key={n.id} className="card">
          <div className="row between">
            <strong>{n.flat} · {n.society}</strong>
            <span className="badge mygate">Vacating {formatDate(n.movingOut)}</span>
          </div>
          <div className="muted">{n.area} · {n.bhk} BHK · Owner: {n.ownerName} (verified resident)</div>
          <Link href={`/list?mygate=${n.id}`} className="button" style={{ marginTop: 10 }}>
            List on GharDirect →
          </Link>
        </div>
      ))}

      <div className="card small muted">
        <strong>What a real integration would add:</strong> move-out alerts from the society&apos;s exit pass, the owner verified by
        their MyGate flat record, and a &quot;MyGate verified&quot; badge buyers and tenants can trust.
      </div>
    </>
  );
}
