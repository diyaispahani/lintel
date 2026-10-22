// In-memory storage for the demo, pre-filled with seed data so it's never empty.
// Phone numbers live only here. They are never sent to the AI and only revealed after Connect.

import { createHash, randomBytes } from "crypto";
import { seedListings, seedRequests } from "./seed";

export type DealType = "rent" | "sale" | "lease";
export type PropertyType = "Apartment" | "Independent house" | "Villa" | "Office" | "Shop";
export type TenantPreference = "Any" | "Family" | "Bachelors" | "Company";
export type Possession = "Ready to move" | "Under construction";

export const AMENITIES = ["Lift", "Power backup", "24x7 security", "Gym", "Swimming pool", "Clubhouse", "Gated society", "Visitor parking"] as const;
export type Label = "Genuine" | "Broker" | "Sales pitch" | "Unclear";
export type Turn = { role: "ai" | "seeker"; text: string };

export type Listing = {
  id: string;
  ownerKey: string; // secret in the owner's dashboard link
  dealType: DealType;
  title: string;
  society: string;
  area: string;
  price: number; // rupees: per month for rent/lease, total for sale
  bhk: number | null; // null for commercial space
  propertyType: PropertyType;
  areaSqft: number; // carpet area
  furnishing: string;
  availableFrom: string;
  // Rent and lease terms (null for sale)
  depositMonths: number | null; // security deposit, in months of rent
  lockInMonths: number | null; // 0 = no lock-in
  maintenance: number; // per month; 0 = included in rent
  tenantPreference: TenantPreference;
  petsAllowed: boolean;
  carParking: number; // covered car spots
  amenities: string[];
  // Sale terms
  possession: Possession;
  reraRegistered: boolean;
  details: string;
  ownerName: string;
  ownerPhone: string;
  mygateVerified: boolean;
  createdAt: number;
};

export type Enquiry = {
  id: string;
  listingId: string;
  transcript: Turn[];
  aiLabel: Label; // what the AI said
  label: Label; // after our rules
  confidence: number;
  reason: string;
  summary: string;
  hidden: boolean; // blocked as sales or broker
  seekerName: string;
  seekerPhone: string;
  phoneHash: string;
  connected: boolean; // owner tapped Connect: both see each other's number
  createdAt: number;
};

// A seeker's "Looking for…" post.
export type Request = {
  id: string;
  key: string; // secret in the seeker's private link
  dealType: DealType;
  area: string;
  maxBudget: number;
  bhk: number | null;
  note: string;
  name: string;
  phone: string;
  invitedTo: string[]; // listing ids whose owners invited this seeker
  createdAt: number;
};

// What anyone can see: no phone numbers, no secret keys.
export type PublicListing = Omit<Listing, "ownerPhone" | "ownerKey">;
export type PublicRequest = Omit<Request, "phone" | "key" | "invitedTo">;

const db = globalThis as unknown as {
  ghar?: { listings: Map<string, Listing>; enquiries: Map<string, Enquiry>; requests: Map<string, Request> };
};
db.ghar ??= {
  listings: new Map(seedListings.map((l) => [l.id, l])),
  enquiries: new Map(),
  requests: new Map(seedRequests.map((r) => [r.id, r])),
};
const { listings, enquiries, requests } = db.ghar;

export const newId = (bytes = 6) => randomBytes(bytes).toString("base64url");
export const hashPhone = (phone: string) => createHash("sha256").update(phone.replace(/\D/g, "").slice(-10)).digest("hex");

export function createListing(fields: Omit<Listing, "id" | "ownerKey" | "createdAt">): Listing {
  const listing = { ...fields, id: newId(), ownerKey: newId(16), createdAt: Date.now() };
  listings.set(listing.id, listing);
  return listing;
}

export const getListing = (id: string) => listings.get(id);
export const allListings = () => [...listings.values()].sort((a, b) => b.createdAt - a.createdAt);

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

export function createRequest(fields: Omit<Request, "id" | "key" | "invitedTo" | "createdAt">): Request {
  const request = { ...fields, id: newId(), key: newId(16), invitedTo: [], createdAt: Date.now() };
  requests.set(request.id, request);
  return request;
}

export const getRequest = (id: string) => requests.get(id);
export const allRequests = () => [...requests.values()].sort((a, b) => b.createdAt - a.createdAt);

export function requestToPublic({ phone: _p, key: _k, invitedTo: _i, ...rest }: Request): PublicRequest {
  return rest;
}
