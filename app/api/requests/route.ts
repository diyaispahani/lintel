// A seeker posts what they're looking for, so matching owners can invite them.

import { validPhone } from "@/lib/rules";
import { createRequest, type DealType } from "@/lib/store";

const DEALS: DealType[] = ["rent", "sale", "lease"];

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const field = (name: string, max: number) => (typeof body[name] === "string" ? body[name].trim().slice(0, max) : "");

  const dealType = DEALS.includes(body.dealType) ? (body.dealType as DealType) : null;
  const maxBudget = Number(String(body.maxBudget ?? "").replace(/[^\d]/g, ""));
  const name = field("name", 60);
  const phone = field("phone", 20);

  if (!dealType || !field("area", 80) || !maxBudget) {
    return Response.json({ error: "Please choose rent, buy or lease, an area and a budget (a number)." }, { status: 400 });
  }
  if (!name || !validPhone(phone)) {
    return Response.json({ error: "Please enter your name and a valid 10-digit phone number." }, { status: 400 });
  }

  const request = createRequest({
    dealType,
    area: field("area", 80),
    maxBudget,
    bhk: Number(body.bhk) || null,
    note: field("note", 300),
    name,
    phone,
  });
  return Response.json({ id: request.id, key: request.key });
}
