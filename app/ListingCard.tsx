// A listing card with a line-art cover drawn for its property type (no stock photos needed).

import Link from "next/link";
import { DEAL_LABEL, formatDate, formatPrice } from "@/lib/match";
import type { PropertyType, PublicListing } from "@/lib/store";
import { IconArea, IconBed, IconCalendar, IconCar, IconLock, IconPin, IconRupee } from "./Icons";

export default function ListingCard({ l }: { l: PublicListing }) {
  const locality = l.area.split(",")[0];
  return (
    <Link href={`/l/${l.id}`} className="lcard">
      <div className={`lcover ${l.dealType}`}>
        <PropertyArt type={l.propertyType} />
        <span className="tag tag-deal lcover-tl">{DEAL_LABEL[l.dealType]}</span>
        <span className="tag lcover-tr"><IconPin /> {locality}</span>
        {l.mygateVerified && <span className="lcover-band">MyGate verified owner</span>}
      </div>
      <div className="lbody">
        <h3 className="ltitle">{l.title}</h3>
        <p className="lsub">{l.society}</p>
        <div className="lrow"><IconCalendar /> {new Date(l.availableFrom) <= new Date() ? "Available now" : `Available from ${formatDate(l.availableFrom)}`}</div>
        <div className="lgrid2">
          <span><IconBed /> {l.bhk ? `${l.bhk} BHK` : l.propertyType}</span>
          <span><IconArea /> {l.areaSqft.toLocaleString("en-IN")} sq ft</span>
          {l.dealType === "sale" ? (
            <>
              <span><IconCalendar /> {l.possession}</span>
              <span><IconCar /> {l.carParking ? `${l.carParking} parking` : "No parking"}</span>
            </>
          ) : (
            <>
              <span><IconRupee /> {l.depositMonths} mo deposit</span>
              <span><IconLock /> {l.lockInMonths ? `${l.lockInMonths} mo lock-in` : "No lock-in"}</span>
            </>
          )}
        </div>
        <div className="lprice">
          <span className="lprice-label">{l.dealType === "sale" ? "Asking price" : l.dealType === "lease" ? "Lease rent" : "Monthly rent"}</span>
          <strong>{formatPrice(l.price, l.dealType).replace("/month", "")}</strong>
          <span className="lprice-label">{l.dealType === "sale" ? `Owner · ${l.ownerName}` : `/ month · owner ${l.ownerName}`}</span>
        </div>
      </div>
    </Link>
  );
}

export function PropertyArt({ type }: { type: PropertyType }) {
  const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  return (
    <svg viewBox="0 0 200 120" className="lart" aria-hidden="true">
      <ellipse cx="100" cy="104" rx="86" ry="10" className="lart-ground" />
      {type === "Apartment" && (
        <g {...stroke}>
          <path d="M70 104V30h44v74M114 104V50h26v54" className="lart-fill" />
          {[40, 54, 68, 82].map((y) => (
            <g key={y}><path d={`M80 ${y}h8M96 ${y}h8`} /></g>
          ))}
          <path d="M122 62h10M122 76h10M122 90h10" />
          <path d="M86 104v-10h12v10" className="door" />
        </g>
      )}
      {type === "Independent house" && (
        <g {...stroke}>
          <path d="M62 104V64l38-28 38 28v40" className="lart-fill" />
          <path d="M92 104V82h16v22" className="door" />
          <path d="M72 70h12v10H72zM116 70h12v10h-12z" />
          <path d="M120 46V34h8v18" />
        </g>
      )}
      {type === "Villa" && (
        <g {...stroke}>
          <path d="M50 104V66l32-22 32 22v38M114 104V76h40v28" className="lart-fill" />
          <path d="M74 104V84h16v20" className="door" />
          <path d="M124 84h20v10h-20z" />
          <path d="M166 104V84m0 0c-8 0-10-12-2-16 0-8 12-8 12 0 8 4 6 16-2 16z" />
        </g>
      )}
      {type === "Office" && (
        <g {...stroke}>
          <path d="M72 104V22h56v82" className="lart-fill" />
          {[34, 48, 62, 76].map((y) => (
            <path key={y} d={`M80 ${y}h40`} opacity="0.7" />
          ))}
          <path d="M100 22v68M90 104V90h20v14" className="door" />
        </g>
      )}
      {type === "Shop" && (
        <g {...stroke}>
          <path d="M60 104V58h80v46" className="lart-fill" />
          <path d="M56 58l8-18h72l8 18c0 6-9 8-14 2-4 6-14 6-18 0-4 6-14 6-18 0-4 6-14 6-18 0-5 6-14 4-14-2z" />
          <path d="M70 76h30v20H70z" />
          <path d="M112 104V76h18v28" className="door" />
        </g>
      )}
    </svg>
  );
}
