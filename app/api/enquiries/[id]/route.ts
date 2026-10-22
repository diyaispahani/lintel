// The seeker checks whether the owner has tapped Connect.

import { getEnquiry, getListing } from "@/lib/store";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const enquiry = getEnquiry(id);
  if (!enquiry) return Response.json({ error: "Enquiry not found." }, { status: 404 });
  const listing = enquiry.connected ? getListing(enquiry.listingId) : undefined;
  return Response.json({
    connected: enquiry.connected,
    owner: listing ? { name: listing.ownerName, phone: listing.ownerPhone } : undefined,
  });
}
