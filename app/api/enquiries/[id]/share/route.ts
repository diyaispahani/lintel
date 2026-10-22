// The owner chooses to share their number with one seeker.

import { getEnquiry, getListing } from "@/lib/store";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const enquiry = getEnquiry(id);
  const listing = enquiry && getListing(enquiry.listingId);
  if (!enquiry || !listing || body.key !== listing.ownerKey) {
    return Response.json({ error: "Not allowed." }, { status: 403 });
  }
  enquiry.shared = true;
  return Response.json({ shared: true });
}
