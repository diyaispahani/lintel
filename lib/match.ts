// Plain-code matching between "Looking for…" requests and listings,
// plus shared formatting helpers.

import type { DealType, PublicListing, PublicRequest } from "./store";

export function matches(request: PublicRequest, listing: PublicListing): boolean {
  if (request.dealType !== listing.dealType) return false;
  if (listing.price > request.maxBudget) return false;
  if (request.bhk !== null && listing.bhk !== null && listing.bhk !== request.bhk) return false;
  const want = request.area.toLowerCase().trim();
  const place = `${listing.area} ${listing.society}`.toLowerCase();
  return want === "" || place.includes(want) || want.includes(listing.area.split(",")[0].toLowerCase());
}

export const DEAL_LABEL: Record<DealType, string> = { rent: "Rent", sale: "Buy", lease: "Lease" };

export function formatPrice(price: number, dealType: DealType): string {
  if (dealType === "sale") {
    return price >= 1e7 ? `₹${(price / 1e7).toFixed(2).replace(/\.?0+$/, "")} Cr` : `₹${(price / 1e5).toFixed(1).replace(/\.0$/, "")} L`;
  }
  return `₹${price.toLocaleString("en-IN")}/month`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
