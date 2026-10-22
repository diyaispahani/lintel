"use client";

// The neighbourhood around one home: a map, nearest transit, everyday places,
// and a link to Google's 360° street view. Places come from OpenStreetMap.

import { useEffect, useMemo, useState } from "react";
import MapView, { type MapPin } from "@/app/MapView";
import type { Nearby, Place } from "@/lib/nearby";

const PLACE_LABELS: [keyof Nearby["places"], string][] = [
  ["hospital", "Hospitals & clinics"],
  ["pharmacy", "Medical stores"],
  ["school", "Schools"],
  ["college", "Colleges"],
  ["grocery", "Grocery stores"],
  ["gym", "Gyms"],
  ["salon", "Salons"],
];

const dist = (km: number) => (km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`);

export default function Neighbourhood({ id, lat, lng, title, streetView }: { id: string; lat: number; lng: number; title: string; streetView: string }) {
  const [data, setData] = useState<Nearby | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/nearby/${id}`)
      .then((r) => r.json())
      .then((d) => (d.error ? setError(d.error) : setData(d)))
      .catch(() => setError("Couldn't load nearby places right now."));
  }, [id]);

  const pins: MapPin[] = useMemo(() => {
    const home: MapPin = { id: "home", lat, lng, label: "This home", title, sub: "The home you're viewing", tone: "here" };
    if (!data) return [home];
    const transit = (list: Place[], kind: string): MapPin[] =>
      list.map((p, i) => ({ id: `${kind}-${i}`, lat: p.lat, lng: p.lng, label: kind, title: p.name, sub: `${dist(p.km)} away` }));
    return [home, ...transit(data.transit.metro, "Metro"), ...transit(data.transit.rail, "Rail"), ...transit(data.transit.bus.slice(0, 1), "Bus")];
  }, [data, lat, lng, title]);

  const transitRows: [string, Place | { name: string; km: number } | undefined][] = data
    ? [
        ["Bus stop", data.transit.bus[0]],
        ["Metro", data.transit.metro[0]],
        ["Railway station", data.transit.rail[0]],
        ["Airport", data.transit.airport],
      ]
    : [];

  return (
    <section className="hood-section">
      <div className="row between" style={{ alignItems: "flex-end", marginBottom: 14 }}>
        <div>
          <h2 style={{ margin: 0 }}>The neighbourhood</h2>
          <p className="muted small" style={{ margin: 0 }}>Distances are straight-line, from OpenStreetMap data.</p>
        </div>
        <a href={streetView} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">360° street view ↗</a>
      </div>

      <MapView pins={pins} height={360} zoom={14} />

      {error && <div className="error">{error}</div>}
      {!data && !error && <p className="muted small" style={{ marginTop: 14 }}>Finding nearby transit and places… the first look-up for a home takes about 15 seconds.</p>}

      {data && (
        <>
          <div className="transit">
            {transitRows.map(([label, p]) => (
              <div key={label} className="transit-item">
                <span>{label}</span>
                <strong>{p ? p.name : "None within reach"}</strong>
                {p && <em>{dist(p.km)}</em>}
              </div>
            ))}
          </div>
          <div className="places">
            {PLACE_LABELS.map(([key, label]) => (
              <div key={key} className="place-group">
                <h3>{label}</h3>
                {data.places[key].length ? (
                  <ul>
                    {data.places[key].map((p) => (
                      <li key={p.name}><span>{p.name}</span><em>{dist(p.km)}</em></li>
                    ))}
                  </ul>
                ) : (
                  <p className="muted small" style={{ margin: 0 }}>None found nearby</p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
