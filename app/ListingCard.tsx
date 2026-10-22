// A listing card with a line-art cover drawn for its property type (no stock photos needed).

import Link from "next/link";
import { DEAL_LABEL, formatDate, formatPrice } from "@/lib/match";
import type { PropertyType, PublicListing } from "@/lib/store";

export default function ListingCard({ l }: { l: PublicListing }) {
  return (
    <Link href={`/l/${l.id}`} className="lcard">
      <div className={`lcover ${l.dealType}`}>
        <PropertyArt type={l.propertyType} />
        <span className="badge deal lcover-tl">{DEAL_LABEL[l.dealType]}</span>
        {l.mygateVerified && <span className="badge mygate lcover-tr">✓ MyGate verified</span>}
      </div>
      <div className="lbody">
        <div className="price">{formatPrice(l.price, l.dealType)}</div>
        <h3 className="ltitle">{l.title}</h3>
        <div className="muted small">{l.society} · {l.area}</div>
        <div className="lmeta">
          <span>{l.bhk ? `${l.bhk} BHK` : l.propertyType}</span>
          <span>{l.areaSqft.toLocaleString("en-IN")} sq ft</span>
          <span>{l.furnishing}</span>
        </div>
        <div className="lterms">
          {l.dealType === "sale" ? (
            <>
              <span>{l.possession}</span>
              {l.reraRegistered && <span>RERA ✓</span>}
            </>
          ) : (
            <>
              <span>Deposit {l.depositMonths} mo</span>
              <span>{l.lockInMonths ? `Lock-in ${l.lockInMonths} mo` : "No lock-in"}</span>
            </>
          )}
          <span>From {formatDate(l.availableFrom)}</span>
        </div>
        <div className="lfoot">
          <span>Owner · {l.ownerName}</span>
          <span className="brass">₹0 brokerage</span>
        </div>
      </div>
    </Link>
  );
}

export function PropertyArt({ type }: { type: PropertyType }) {
  const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  return (
    <svg viewBox="0 0 200 120" className="lart" aria-hidden="true">
      <path d="M0 104h200" {...stroke} opacity="0.35" />
      {type === "Apartment" && (
        <g {...stroke}>
          <path d="M70 104V30h44v74M114 104V50h26v54" />
          {[40, 54, 68, 82].map((y) => (
            <g key={y}><path d={`M80 ${y}h8M96 ${y}h8`} /></g>
          ))}
          <path d="M122 62h10M122 76h10M122 90h10" />
          <path d="M86 104v-10h12v10" className="door" />
        </g>
      )}
      {type === "Independent house" && (
        <g {...stroke}>
          <path d="M62 104V64l38-28 38 28v40" />
          <path d="M92 104V82h16v22" className="door" />
          <path d="M72 70h12v10H72zM116 70h12v10h-12z" />
          <path d="M120 46V34h8v18" />
        </g>
      )}
      {type === "Villa" && (
        <g {...stroke}>
          <path d="M50 104V66l32-22 32 22v38M114 104V76h40v28" />
          <path d="M74 104V84h16v20" className="door" />
          <path d="M124 84h20v10h-20z" />
          <path d="M166 104V84m0 0c-8 0-10-12-2-16 0-8 12-8 12 0 8 4 6 16-2 16z" />
        </g>
      )}
      {type === "Office" && (
        <g {...stroke}>
          <path d="M72 104V22h56v82" />
          {[34, 48, 62, 76].map((y) => (
            <path key={y} d={`M80 ${y}h40`} opacity="0.7" />
          ))}
          <path d="M100 22v68M90 104V90h20v14" className="door" />
        </g>
      )}
      {type === "Shop" && (
        <g {...stroke}>
          <path d="M60 104V58h80v46" />
          <path d="M56 58l8-18h72l8 18c0 6-9 8-14 2-4 6-14 6-18 0-4 6-14 6-18 0-4 6-14 6-18 0-5 6-14 4-14-2z" />
          <path d="M70 76h30v20H70z" />
          <path d="M112 104V76h18v28" className="door" />
        </g>
      )}
    </svg>
  );
}
