// The owner chooses to connect with one seeker: from now on both see each other's number.

import { getEnquiry, getListing, saveEnquiry } from "@/lib/store";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const enquiry = await getEnquiry(id);
  const listing = enquiry && (await getListing(enquiry.listingId));
  if (!enquiry || !listing || body.key !== listing.ownerKey) {
    return Response.json({ error: "Not allowed." }, { status: 403 });
  }
  enquiry.connected = true;
  await saveEnquiry(enquiry);
  return Response.json({ connected: true });
}
