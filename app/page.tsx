// Browse: every listing is from an owner. Filters are a plain HTML form (no JavaScript needed).

import Link from "next/link";
import { DEAL_LABEL, formatDate, formatPrice } from "@/lib/match";
import { allListings, toPublic, type DealType } from "@/lib/store";

export const dynamic = "force-dynamic";

type Filters = { deal?: string; area?: string; max?: string; bhk?: string };

export default async function Browse({ searchParams }: { searchParams: Promise<Filters> }) {
  const f = await searchParams;
  const max = Number(f.max) || 0;
  const bhk = Number(f.bhk) || 0;
  const area = (f.area ?? "").trim().toLowerCase();

  const results = allListings()
    .map(toPublic)
    .filter((l) => !f.deal || l.dealType === f.deal)
    .filter((l) => !area || `${l.area} ${l.society}`.toLowerCase().includes(area))
    .filter((l) => !max || l.price <= max)
    .filter((l) => !bhk || l.bhk === bhk);

  return (
    <>
      <div className="hero">
        <h1>Rent, buy or lease. Straight from the owner.</h1>
        <p className="muted">No brokers, no spam calls. An AI checks every enquiry, and owner and seeker connect only when both say yes.</p>
      </div>

      <form className="card filters" method="get">
        <div>
          <label htmlFor="deal">I want to</label>
          <select id="deal" name="deal" defaultValue={f.deal ?? ""}>
            <option value="">Any</option>
            {(Object.keys(DEAL_LABEL) as DealType[]).map((d) => (
              <option key={d} value={d}>{DEAL_LABEL[d]}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="area">Area</label>
          <input id="area" name="area" defaultValue={f.area ?? ""} placeholder="e.g. HSR" />
        </div>
        <div>
          <label htmlFor="max">Max price (₹)</label>
          <input id="max" name="max" defaultValue={f.max ?? ""} inputMode="numeric" placeholder="e.g. 35000" />
        </div>
        <div>
          <label htmlFor="bhk">BHK</label>
          <select id="bhk" name="bhk" defaultValue={f.bhk ?? ""}>
            <option value="">Any</option>
            {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n} BHK</option>)}
          </select>
        </div>
        <button>Search</button>
      </form>

      <p className="muted small">{results.length} {results.length === 1 ? "property" : "properties"} · all listed by owners</p>

      {results.map((l) => (
        <Link key={l.id} href={`/l/${l.id}`} className="card">
          <div className="row between">
            <span className="price">{formatPrice(l.price, l.dealType)}</span>
            <span className="row">
              <span className="badge deal">{DEAL_LABEL[l.dealType]}</span>
              {l.mygateVerified && <span className="badge mygate">✓ MyGate verified</span>}
            </span>
          </div>
          <h2 style={{ margin: "4px 0 0" }}>{l.title}</h2>
          <div className="muted">📍 {l.society}, {l.area}</div>
          <div className="muted small">
            {l.bhk ? `${l.bhk} BHK` : "Commercial"} · {l.furnishing} · from {formatDate(l.availableFrom)} · <span className="badge owner">Listed by owner · 0 brokers</span>
          </div>
        </Link>
      ))}

      {results.length === 0 && (
        <div className="card">
          Nothing matches yet. <Link href="/wanted">Post what you&apos;re looking for</Link> and owners can invite you.
        </div>
      )}
    </>
  );
}
