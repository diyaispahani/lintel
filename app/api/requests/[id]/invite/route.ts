// An owner invites a matching seeker to enquire. The seeker sees it on their private page.

import { matches } from "@/lib/match";
import { getListing, getRequest, requestToPublic, toPublic } from "@/lib/store";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const request = getRequest(id);
  const listing = typeof body.listingId === "string" ? getListing(body.listingId) : undefined;
  if (!request || !listing || body.key !== listing.ownerKey || !matches(requestToPublic(request), toPublic(listing))) {
    return Response.json({ error: "Not allowed." }, { status: 403 });
  }
  if (!request.invitedTo.includes(listing.id)) request.invitedTo.push(listing.id);
  return Response.json({ invited: true });
}
