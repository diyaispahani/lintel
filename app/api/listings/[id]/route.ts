// The owner's dashboard data. Needs the secret key from the owner's link.
// A seeker's name and number are included only after the owner taps Connect.

import { matches } from "@/lib/match";
import { allRequests, enquiriesFor, getListing, requestToPublic, toPublic } from "@/lib/store";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await getListing(id);
  const key = new URL(req.url).searchParams.get("key");
  if (!listing || key !== listing.ownerKey) {
    return Response.json({ error: "This dashboard link isn't valid." }, { status: 404 });
  }
  const flat = toPublic(listing);

  const enquiries = (await enquiriesFor(id)).map(({ transcript: _t, phoneHash: _h, seekerName, seekerPhone, ...rest }) => ({
    ...rest,
    seeker: rest.connected ? { name: seekerName, phone: seekerPhone } : null,
  }));

  const matchingRequests = (await allRequests())
    .filter((r) => matches(requestToPublic(r), flat))
    .map((r) => ({ ...requestToPublic(r), invited: r.invitedTo.includes(id) }));

  return Response.json({ listing: flat, enquiries, matchingRequests });
}
