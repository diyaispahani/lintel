// Storage. On Vercel this is an Upstash Redis database, so every server sees the
// same listings, enquiries and requests. Without database settings (local dev),
// it falls back to memory. Seed demo data lives in code and is always present.
// Phone numbers are never sent to the AI and only revealed after Connect.

import { createHash, randomBytes } from "crypto";
import { Redis } from "@upstash/redis";
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

/* ---------- Tiny key-value layer: Redis when configured, memory otherwise ---------- */

const redis =
  (process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL) ? Redis.fromEnv() : null;

const mem = globalThis as unknown as { gharKv?: { values: Map<string, unknown>; lists: Map<string, string[]> } };
mem.gharKv ??= { values: new Map(), lists: new Map() };
const { values, lists } = mem.gharKv;

async function kvGet<T>(key: string): Promise<T | null> {
  if (redis) return (await redis.get<T>(key)) ?? null;
  return (values.get(key) as T) ?? null;
}
async function kvSet(key: string, value: unknown): Promise<void> {
  if (redis) await redis.set(key, value);
  else values.set(key, value);
}
async function kvMGet<T>(keys: string[]): Promise<T[]> {
  if (!keys.length) return [];
  const got = redis ? await redis.mget<(T | null)[]>(...keys) : keys.map((k) => (values.get(k) as T) ?? null);
  return got.filter((v): v is T => v !== null);
}
async function kvPush(key: string, id: string): Promise<void> {
  if (redis) await redis.lpush(key, id);
  else lists.set(key, [id, ...(lists.get(key) ?? [])]);
}
async function kvList(key: string): Promise<string[]> {
  if (redis) return await redis.lrange<string>(key, 0, -1);
  return lists.get(key) ?? [];
}

/* ---------- Helpers ---------- */

export const newId = (bytes = 6) => randomBytes(bytes).toString("base64url");
export const hashPhone = (phone: string) => createHash("sha256").update(phone.replace(/\D/g, "").slice(-10)).digest("hex");
const newestFirst = <T extends { createdAt: number }>(a: T, b: T) => b.createdAt - a.createdAt;

/* ---------- Listings ---------- */

export async function createListing(fields: Omit<Listing, "id" | "ownerKey" | "createdAt">): Promise<Listing> {
  const listing = { ...fields, id: newId(), ownerKey: newId(16), createdAt: Date.now() };
  await kvSet(`listing:${listing.id}`, listing);
  await kvPush("listings", listing.id);
  return listing;
}

export async function getListing(id: string): Promise<Listing | undefined> {
  return seedListings.find((l) => l.id === id) ?? (await kvGet<Listing>(`listing:${id}`)) ?? undefined;
}

export async function allListings(): Promise<Listing[]> {
  const ids = await kvList("listings");
  const stored = await kvMGet<Listing>(ids.map((id) => `listing:${id}`));
  return [...stored, ...seedListings].sort(newestFirst);
}

export function toPublic({ ownerPhone: _p, ownerKey: _k, ...rest }: Listing): PublicListing {
  return rest;
}

/* ---------- Enquiries ---------- */

export async function saveEnquiry(enquiry: Enquiry, isNew = false): Promise<void> {
  await kvSet(`enquiry:${enquiry.id}`, enquiry);
  if (isNew) await kvPush(`enquiries:${enquiry.listingId}`, enquiry.id);
}

export async function getEnquiry(id: string): Promise<Enquiry | undefined> {
  return (await kvGet<Enquiry>(`enquiry:${id}`)) ?? undefined;
}

export async function enquiriesFor(listingId: string): Promise<Enquiry[]> {
  const ids = await kvList(`enquiries:${listingId}`);
  return (await kvMGet<Enquiry>(ids.map((id) => `enquiry:${id}`))).sort(newestFirst);
}

/* ---------- "Looking for…" requests ---------- */

export async function createRequest(fields: Omit<Request, "id" | "key" | "invitedTo" | "createdAt">): Promise<Request> {
  const request = { ...fields, id: newId(), key: newId(16), invitedTo: [], createdAt: Date.now() };
  await kvSet(`request:${request.id}`, request);
  await kvPush("requests", request.id);
  return request;
}

// A stored copy wins over the seed, so invites on seed requests are remembered.
export async function getRequest(id: string): Promise<Request | undefined> {
  return (await kvGet<Request>(`request:${id}`)) ?? seedRequests.find((r) => r.id === id);
}

export async function saveRequest(request: Request): Promise<void> {
  await kvSet(`request:${request.id}`, request);
}

export async function allRequests(): Promise<Request[]> {
  const ids = await kvList("requests");
  const stored = await kvMGet<Request>(ids.map((id) => `request:${id}`));
  const seeds = await Promise.all(seedRequests.map((r) => getRequest(r.id)));
  return [...stored, ...seeds.filter((r): r is Request => !!r)].sort(newestFirst);
}

export function requestToPublic({ phone: _p, key: _k, invitedTo: _i, ...rest }: Request): PublicRequest {
  return rest;
}
