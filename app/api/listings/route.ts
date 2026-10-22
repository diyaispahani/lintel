// Owner creates a listing. The phone number is stored, never shown publicly.

import { getNotice } from "@/lib/mygate";
import { coordsFor, geocode } from "@/lib/places";
import { validPhone } from "@/lib/rules";
import { AMENITIES, createListing, type DealType, type PropertyType } from "@/lib/store";

const DEALS: DealType[] = ["rent", "sale", "lease"];
const PROPERTY_TYPES: PropertyType[] = ["Apartment", "Independent house", "Villa", "Office", "Shop"];

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const field = (name: string, max: number) => (typeof body[name] === "string" ? body[name].trim().slice(0, max) : "");

  const dealType = DEALS.includes(body.dealType) ? (body.dealType as DealType) : null;
  const title = field("title", 120);
  const society = field("society", 120);
  const area = field("area", 120);
  const price = Number(String(body.price ?? "").replace(/[^\d]/g, ""));
  const bhk = Number(body.bhk) || null;
  const ownerPhone = field("ownerPhone", 20);

  if (!dealType || !title || !area) {
    return Response.json({ error: "Please fill in what you want to do, a title and the area." }, { status: 400 });
  }
  if (!price) {
    return Response.json({ error: "Please enter the price as a number, e.g. 32000." }, { status: 400 });
  }
  if (!validPhone(ownerPhone)) {
    return Response.json({ error: "Please enter a valid phone number (10 digits)." }, { status: 400 });
  }

  // Simulated MyGate check: verified if it came from a real move-out notice for this society.
  const notice = typeof body.mygateId === "string" ? getNotice(body.mygateId) : undefined;

  const num = (name: string) => {
    const v = Number(String(body[name] ?? "").replace(/[^\d.]/g, ""));
    return Number.isFinite(v) ? v : 0;
  };
  const oneOf = <T extends string>(value: unknown, options: readonly T[], fallback: T): T =>
    options.includes(value as T) ? (value as T) : fallback;
  const isSale = dealType === "sale";
  const propertyType = oneOf(body.propertyType, PROPERTY_TYPES, "Apartment");
  const commercial = propertyType === "Office" || propertyType === "Shop";

  const listing = await createListing({
    dealType,
    title,
    society,
    area,
    price,
    bhk: commercial ? null : bhk,
    propertyType,
    areaSqft: num("areaSqft"),
    furnishing: field("furnishing", 40) || "Unfurnished",
    availableFrom: field("availableFrom", 20),
    depositMonths: isSale ? null : num("depositMonths"),
    lockInMonths: isSale ? null : num("lockInMonths"),
    maintenance: num("maintenance"),
    tenantPreference: oneOf(body.tenantPreference, ["Any", "Family", "Bachelors", "Company"] as const, "Any"),
    petsAllowed: body.petsAllowed === true,
    carParking: num("carParking"),
    amenities: Array.isArray(body.amenities) ? body.amenities.filter((a: unknown) => (AMENITIES as readonly unknown[]).includes(a)) : [],
    possession: oneOf(body.possession, ["Ready to move", "Under construction"] as const, "Ready to move"),
    reraRegistered: isSale && body.reraRegistered === true,
    details: field("details", 1500),
    ownerName: field("ownerName", 40) || "Owner",
    ownerPhone,
    mygateVerified: Boolean(notice && notice.society === society),
    kycVerified: body.kyc === true,
    ...(coordsFor(area, title + Date.now()) ?? (await geocode(`${society}, ${area}`)) ?? (await geocode(area)) ?? { lat: null, lng: null }),
  });
  return Response.json({ id: listing.id, ownerKey: listing.ownerKey });
}
