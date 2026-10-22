// Map coordinates for the neighbourhoods Lintel's sample homes sit in, the main
// airports, and a distance helper. Coordinates are approximate locality centres.

export type LatLng = { lat: number; lng: number };

export const LOCALITIES: Record<string, LatLng> = {
  "HSR Layout": { lat: 12.9116, lng: 77.6474 },
  Koramangala: { lat: 12.9352, lng: 77.6245 },
  Indiranagar: { lat: 12.9719, lng: 77.6412 },
  Whitefield: { lat: 12.9698, lng: 77.75 },
  "JP Nagar": { lat: 12.9063, lng: 77.5857 },
  "Sarjapur Road": { lat: 12.901, lng: 77.687 },
  Jayanagar: { lat: 12.925, lng: 77.5938 },
  Hebbal: { lat: 13.0358, lng: 77.597 },
  "Electronic City": { lat: 12.8452, lng: 77.6602 },
  Bellandur: { lat: 12.9257, lng: 77.6762 },
  Marathahalli: { lat: 12.9592, lng: 77.6974 },
  Malleshwaram: { lat: 13.0035, lng: 77.5709 },
  Powai: { lat: 19.1176, lng: 72.906 },
  "Andheri West": { lat: 19.1364, lng: 72.8296 },
  "Bandra West": { lat: 19.0596, lng: 72.8295 },
  Thane: { lat: 19.2183, lng: 72.9781 },
  Baner: { lat: 18.559, lng: 73.7868 },
  Kothrud: { lat: 18.5074, lng: 73.8077 },
  Hinjewadi: { lat: 18.5913, lng: 73.7389 },
  Gachibowli: { lat: 17.4401, lng: 78.3489 },
  Madhapur: { lat: 17.4483, lng: 78.3915 },
  Kondapur: { lat: 17.47, lng: 78.357 },
  "DLF Phase 4": { lat: 28.4677, lng: 77.0829 },
  Saket: { lat: 28.5245, lng: 77.2066 },
  Adyar: { lat: 13.0067, lng: 80.257 },
  "Anna Nagar": { lat: 13.085, lng: 80.2101 },
};

export const AIRPORTS: (LatLng & { name: string })[] = [
  { name: "Kempegowda International Airport (BLR)", lat: 13.1986, lng: 77.7066 },
  { name: "Chhatrapati Shivaji Maharaj International Airport (BOM)", lat: 19.0896, lng: 72.8656 },
  { name: "Navi Mumbai International Airport (NMI)", lat: 18.99, lng: 73.07 },
  { name: "Pune Airport (PNQ)", lat: 18.5821, lng: 73.9197 },
  { name: "Rajiv Gandhi International Airport (HYD)", lat: 17.2403, lng: 78.4294 },
  { name: "Indira Gandhi International Airport (DEL)", lat: 28.5562, lng: 77.1 },
  { name: "Chennai International Airport (MAA)", lat: 12.9941, lng: 80.1709 },
];

// Locality centre for an "Area, City" string, nudged a little per home so
// pins in one neighbourhood don't sit exactly on top of each other.
export function coordsFor(area: string, seed: string): LatLng | null {
  const name = area.split(",")[0].trim();
  const base = LOCALITIES[name];
  if (!base) return null;
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const dx = ((h % 1000) / 1000 - 0.5) * 0.012;
  const dy = (((h >> 10) % 1000) / 1000 - 0.5) * 0.012;
  return { lat: +(base.lat + dy).toFixed(5), lng: +(base.lng + dx).toFixed(5) };
}

// Straight-line distance in km.
export function distanceKm(a: LatLng, b: LatLng): number {
  const r = (d: number) => (d * Math.PI) / 180;
  const h = Math.sin(r(b.lat - a.lat) / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(r(b.lng - a.lng) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

export function nearestAirport(p: LatLng) {
  return AIRPORTS.map((a) => ({ name: a.name, km: distanceKm(p, a) })).sort((x, y) => x.km - y.km)[0];
}

export const streetViewUrl = (p: LatLng) =>
  `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${p.lat},${p.lng}`;

// Look up an address on OpenStreetMap (free, no key). Used only when a new
// listing's area isn't one of the known localities. Returns null on any failure.
export async function geocode(query: string): Promise<LatLng | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=in&q=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Lintel prototype (lintelhomes.vercel.app)" },
      signal: AbortSignal.timeout(4000),
    });
    const [hit] = (await res.json()) as { lat: string; lon: string }[];
    return hit ? { lat: +(+hit.lat).toFixed(5), lng: +(+hit.lon).toFixed(5) } : null;
  } catch {
    return null;
  }
}
