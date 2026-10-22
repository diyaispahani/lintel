"use client";

// A map of homes (or one home) on free OpenStreetMap tiles, drawn with Leaflet.
// Each pin is a price tag; tapping it opens a small card linking to the home.

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";

export type MapPin = { id: string; lat: number; lng: number; label: string; title: string; sub: string; href?: string; tone?: "rent" | "sale" | "lease" | "here" };

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export default function MapView({ pins, height = 560, zoom }: { pins: MapPin[]; height?: number; zoom?: number }) {
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let map: import("leaflet").Map | undefined;
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !box.current) return;
      map = L.map(box.current, { scrollWheelZoom: false, zoomControl: true });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const markers = pins.map((p) =>
        L.marker([p.lat, p.lng], {
          icon: L.divIcon({ className: "", html: `<span class="pin pin-${p.tone ?? "rent"}">${esc(p.label)}</span>`, iconSize: [0, 0] }),
          title: p.title,
        })
          .bindPopup(
            `<div class="pin-card"><strong>${esc(p.title)}</strong><span>${esc(p.sub)}</span>${p.href ? `<a href="${esc(p.href)}">View home →</a>` : ""}</div>`,
          )
          .addTo(map!),
      );

      if (pins.length === 1) map.setView([pins[0].lat, pins[0].lng], zoom ?? 15);
      else if (pins.length) map.fitBounds(L.featureGroup(markers).getBounds().pad(0.15));
      else map.setView([20.6, 78.9], 4.5); // India
    })();
    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [pins, zoom]);

  return <div ref={box} className="map" style={{ height }} role="region" aria-label="Map of homes" />;
}
