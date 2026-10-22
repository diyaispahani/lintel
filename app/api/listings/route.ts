// Owner creates a listing. The phone number is stored, never shown publicly.

import { getNotice } from "@/lib/mygate";
import { validPhone } from "@/lib/rules";
import { createListing, type DealType } from "@/lib/store";

const DEALS: DealType[] = ["rent", "sale", "lease"];

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

  const listing = createListing({
    dealType,
    title,
    society,
    area,
    price,
    bhk,
    furnishing: field("furnishing", 40) || "Unfurnished",
    availableFrom: field("availableFrom", 20),
    details: field("details", 1500),
    ownerName: field("ownerName", 40) || "Owner",
    ownerPhone,
    mygateVerified: Boolean(notice && notice.society === society),
  });
  return Response.json({ id: listing.id, ownerKey: listing.ownerKey });
}
