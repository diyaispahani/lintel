// In-memory storage for the demo. Data resets when the server restarts.
// The owner's phone number lives only here and is never sent to Claude.

import { randomBytes } from "crypto";

export type Label = "Genuine" | "Broker" | "Sales pitch" | "Unclear";
export type Turn = { role: "ai" | "seeker"; text: string };

export type Listing = {
  id: string;
  ownerKey: string; // secret in the owner's shortlist link
  title: string;
  area: string;
  price: string;
  details: string;
  ownerPhone: string;
  createdAt: number;
};

export type Enquiry = {
  id: string;
  listingId: string;
  transcript: Turn[];
  aiLabel: Label; // what Claude said
  label: Label; // after our rules
  confidence: number;
  reason: string;
  summary: string;
  hidden: boolean; // blocked as sales or broker
  shared: boolean; // owner shared their number with this seeker
  createdAt: number;
};

// Public view of a listing: everything except the number and owner key.
export type PublicListing = Omit<Listing, "ownerPhone" | "ownerKey">;

const db = globalThis as unknown as { shush?: { listings: Map<string, Listing>; enquiries: Map<string, Enquiry> } };
db.shush ??= { listings: new Map(), enquiries: new Map() };
const { listings, enquiries } = db.shush;

export const newId = () => randomBytes(6).toString("base64url");

export function createListing(fields: Omit<Listing, "id" | "ownerKey" | "createdAt">): Listing {
  const listing = { ...fields, id: newId(), ownerKey: randomBytes(16).toString("base64url"), createdAt: Date.now() };
  listings.set(listing.id, listing);
  return listing;
}

export const getListing = (id: string) => listings.get(id);

export function toPublic({ ownerPhone: _p, ownerKey: _k, ...rest }: Listing): PublicListing {
  return rest;
}

export function saveEnquiry(enquiry: Enquiry) {
  enquiries.set(enquiry.id, enquiry);
}

export const getEnquiry = (id: string) => enquiries.get(id);

export function enquiriesFor(listingId: string): Enquiry[] {
  return [...enquiries.values()].filter((e) => e.listingId === listingId).sort((a, b) => b.createdAt - a.createdAt);
}
