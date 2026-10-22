// Owner creates a listing. The phone number is stored, never shown publicly.

import { createListing } from "@/lib/store";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const field = (name: string, max: number) => (typeof body[name] === "string" ? body[name].trim().slice(0, max) : "");

  const title = field("title", 120);
  const area = field("area", 120);
  const price = field("price", 60);
  const details = field("details", 1500);
  const ownerPhone = field("ownerPhone", 20);

  if (!title || !area || !price) {
    return Response.json({ error: "Please fill in the title, area and rent or price." }, { status: 400 });
  }
  if (ownerPhone.replace(/\D/g, "").length < 10) {
    return Response.json({ error: "Please enter a valid phone number (10 digits)." }, { status: 400 });
  }

  const listing = createListing({ title, area, price, details, ownerPhone });
  return Response.json({ id: listing.id, ownerKey: listing.ownerKey });
}
