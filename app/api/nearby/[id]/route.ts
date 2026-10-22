// Nearby transit and places for one home. Looked up once, then served from the cache.

import { fetchNearby, type Nearby } from "@/lib/nearby";
import { getCached, getListing, setCached } from "@/lib/store";

export const maxDuration = 60;

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing || listing.lat === null || listing.lng === null) {
    return Response.json({ error: "This home has no map location yet." }, { status: 404 });
  }
  const key = `nearby:v1:${listing.lat},${listing.lng}`;
  const cached = await getCached<Nearby>(key);
  if (cached) return Response.json(cached);
  try {
    const nearby = await fetchNearby({ lat: listing.lat, lng: listing.lng });
    await setCached(key, nearby);
    return Response.json(nearby);
  } catch (err) {
    console.error("[lintel] nearby failed", err);
    return Response.json({ error: "Couldn't load nearby places right now. Try again in a minute." }, { status: 502 });
  }
}
