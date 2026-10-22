// Nearby transit and everyday places for a home, from OpenStreetMap's free place
// search (Nominatim). Plain code: one search per kind of place inside a box around
// the home, then sort by distance. No AI involved.
// Nominatim's fair-use policy allows one request a second and asks callers to
// cache, so lookups run one after another and the result is cached per home.

import { distanceKm, nearestAirport, type LatLng } from "./places";

export type Place = { name: string; km: number; lat: number; lng: number };
type PlaceKind = "hospital" | "school" | "pharmacy" | "college" | "salon" | "grocery" | "gym";
export type Nearby = {
  transit: { bus: Place[]; metro: Place[]; rail: Place[]; airport: { name: string; km: number } };
  places: Record<PlaceKind, Place[]>;
  fetchedAt: number;
};

// [what to search for, half-width of the search box in degrees (~111 km each), how many to keep]
const SEARCHES: Record<"bus" | "metro" | "rail" | PlaceKind, [string[], number, number]> = {
  bus: [["bus stop"], 0.012, 2],
  metro: [["metro station"], 0.06, 2],
  rail: [["railway station"], 0.09, 2],
  hospital: [["hospital"], 0.025, 3],
  school: [["school"], 0.025, 3],
  pharmacy: [["pharmacy", "medical store"], 0.025, 3],
  college: [["college"], 0.03, 3],
  salon: [["salon", "beauty parlour", "hair"], 0.025, 3],
  grocery: [["supermarket", "grocery"], 0.025, 3],
  gym: [["gym"], 0.025, 3],
};

const pause = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function search(p: LatLng, what: string, half: number): Promise<Place[]> {
  const box = [p.lng - half, p.lat + half, p.lng + half, p.lat - half].join(",");
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=8&bounded=1&viewbox=${box}&q=${encodeURIComponent(what)}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Lintel prototype (lintelhomes.vercel.app)" },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Place search failed (${res.status})`);
  const hits = (await res.json()) as { lat: string; lon: string; display_name: string; class: string; type: string }[];
  // Drop streets, areas and boundaries that merely share the word ("27th Cross Road").
  const real = hits.filter((h) => (what === "bus stop" ? h.type === "bus_stop" || h.class === "highway" : !["highway", "place", "boundary"].includes(h.class)));
  // An unnamed place is labelled with its street ("27th Cross Road"): skip those.
  const streetLike = /\b(road|cross|main|street|lane|marg)\b/i;
  return real
    .map((h) => {
      const at = { lat: +h.lat, lng: +h.lon };
      return { name: h.display_name.split(",")[0].trim(), ...at, km: distanceKm(p, at) };
    })
    .filter((x) => what === "bus stop" || !streetLike.test(x.name));
}

export async function fetchNearby(p: LatLng): Promise<Nearby> {
  const found = {} as Record<keyof typeof SEARCHES, Place[]>;
  let failures = 0;
  let calls = 0; // every search after the first waits a second (Nominatim fair use)
  for (const [key, [terms, half, keep]] of Object.entries(SEARCHES) as [keyof typeof SEARCHES, [string[], number, number]][]) {
    try {
      let list: Place[] = [];
      for (const what of terms) {
        if (list.length >= keep) break; // enough found; skip the alternate words
        if (calls++) await pause(1050);
        list = list.concat(await search(p, what, half));
      }
      if (key === "rail") list = list.filter((x) => !/metro/i.test(x.name)); // metro stations have their own row
      const seen = new Set<string>();
      found[key] = list
        .sort((a, b) => a.km - b.km)
        .filter((x) => (seen.has(x.name) ? false : (seen.add(x.name), true)))
        .slice(0, keep)
        .map((x) => ({ ...x, km: +x.km.toFixed(2) }));
    } catch {
      failures++;
      found[key] = [];
    }
  }
  if (failures === Object.keys(SEARCHES).length) throw new Error("Nearby places are unavailable right now");

  const air = nearestAirport(p);
  return {
    transit: { bus: found.bus, metro: found.metro, rail: found.rail, airport: { name: air.name, km: +air.km.toFixed(1) } },
    places: {
      hospital: found.hospital,
      school: found.school,
      pharmacy: found.pharmacy,
      college: found.college,
      salon: found.salon,
      grocery: found.grocery,
      gym: found.gym,
    },
    fetchedAt: Date.now(),
  };
}
