// The seeker checks whether the owner has shared their number.

import { getEnquiry, getListing } from "@/lib/store";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const enquiry = getEnquiry(id);
  if (!enquiry) return Response.json({ error: "Enquiry not found." }, { status: 404 });
  const phone = enquiry.shared ? getListing(enquiry.listingId)?.ownerPhone : undefined;
  return Response.json({ shared: enquiry.shared, phone });
}
