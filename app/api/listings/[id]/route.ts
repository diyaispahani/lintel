// The owner's shortlist. Needs the secret key from the owner's link.

import { enquiriesFor, getListing, toPublic } from "@/lib/store";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = getListing(id);
  const key = new URL(req.url).searchParams.get("key");
  if (!listing || key !== listing.ownerKey) {
    return Response.json({ error: "This shortlist link isn't valid." }, { status: 404 });
  }
  const enquiries = enquiriesFor(id).map(({ transcript: _t, ...rest }) => rest);
  return Response.json({ listing: toPublic(listing), enquiries });
}
