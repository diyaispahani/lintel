"use client";

// Listings explorer: filters on the left (a drawer on phones), results on the right.
// Filters are kept in the URL so a search can be shared or bookmarked.

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ListingCard from "../ListingCard";
import { DEAL_LABEL, formatPrice } from "@/lib/match";
import { AMENITIES, type DealType, type PropertyType, type PublicListing } from "@/lib/store";

const PROPERTY_TYPES: PropertyType[] = ["Apartment", "Independent house", "Villa", "Office", "Shop"];
const FURNISHING = ["Unfurnished", "Semi-furnished", "Fully furnished", "Bare shell"];
const BUDGETS: Record<DealType, number[]> = {
  rent: [15000, 25000, 35000, 50000, 75000, 100000, 150000],
  lease: [50000, 100000, 150000, 250000, 500000],
  sale: [5000000, 7500000, 10000000, 15000000, 20000000, 30000000],
};

type Filters = {
  deal: "" | DealType;
  q: string;
  max: string;
  types: string[];
  bhk: string[];
  furnishing: string[];
  deposit: string; // max months
  lockin: string; // max months; "0" = no lock-in
  maintIncl: boolean;
  tenant: string;
  pets: boolean;
  possession: string;
  rera: boolean;
  minArea: string;
  parking: string;
  by: string; // available by date
  amenities: string[];
  verified: boolean;
  sort: string;
};

const EMPTY: Filters = {
  deal: "", q: "", max: "", types: [], bhk: [], furnishing: [], deposit: "", lockin: "", maintIncl: false, tenant: "",
  pets: false, possession: "", rera: false, minArea: "", parking: "", by: "", amenities: [], verified: false, sort: "new",
};

const LIST_KEYS = ["types", "bhk", "furnishing", "amenities"] as const;
const BOOL_KEYS = ["maintIncl", "pets", "rera", "verified"] as const;

function fromParams(p: Record<string, string | undefined>): Filters {
  const f: Filters = { ...EMPTY };
  for (const key of Object.keys(EMPTY) as (keyof Filters)[]) {
    const v = p[key];
    if (v === undefined) continue;
    if ((LIST_KEYS as readonly string[]).includes(key)) (f[key] as string[]) = v.split(",").filter(Boolean);
    else if ((BOOL_KEYS as readonly string[]).includes(key)) (f[key] as boolean) = v === "1";
    else (f[key] as string) = v;
  }
  if (!["", "rent", "sale", "lease"].includes(f.deal)) f.deal = "";
  return f;
}

function toQuery(f: Filters): string {
  const params = new URLSearchParams();
  for (const key of Object.keys(EMPTY) as (keyof Filters)[]) {
    const v = f[key];
    if (Array.isArray(v)) { if (v.length) params.set(key, v.join(",")); }
    else if (typeof v === "boolean") { if (v) params.set(key, "1"); }
    else if (v && v !== EMPTY[key]) params.set(key, v);
  }
  const s = params.toString();
  return s ? `?${s}` : "";
}

function apply(listings: PublicListing[], f: Filters): PublicListing[] {
  const q = f.q.trim().toLowerCase();
  const leasing = f.deal === "rent" || f.deal === "lease";
  const out = listings.filter((l) => {
    if (f.deal && l.dealType !== f.deal) return false;
    if (q && !`${l.title} ${l.society} ${l.area}`.toLowerCase().includes(q)) return false;
    if (f.max && l.price > Number(f.max)) return false;
    if (f.types.length && !f.types.includes(l.propertyType)) return false;
    if (f.bhk.length && !f.bhk.some((b) => (b === "4" ? (l.bhk ?? 0) >= 4 : l.bhk === Number(b)))) return false;
    if (f.furnishing.length && !f.furnishing.includes(l.furnishing)) return false;
    if (leasing) {
      if (f.deposit && (l.depositMonths ?? 99) > Number(f.deposit)) return false;
      if (f.lockin && (l.lockInMonths ?? 0) > Number(f.lockin)) return false;
      if (f.maintIncl && l.maintenance > 0) return false;
      if (f.tenant && l.tenantPreference !== "Any" && l.tenantPreference !== f.tenant) return false;
      if (f.pets && !l.petsAllowed) return false;
    }
    if (f.deal === "sale") {
      if (f.possession && l.possession !== f.possession) return false;
      if (f.rera && !l.reraRegistered) return false;
    }
    if (f.minArea && l.areaSqft < Number(f.minArea)) return false;
    if (f.parking && l.carParking < Number(f.parking)) return false;
    if (f.by && l.availableFrom > f.by) return false;
    if (f.amenities.length && !f.amenities.every((a) => l.amenities.includes(a))) return false;
    if (f.verified && !l.mygateVerified) return false;
    return true;
  });
  const sorters: Record<string, (a: PublicListing, b: PublicListing) => number> = {
    new: (a, b) => b.createdAt - a.createdAt,
    low: (a, b) => a.price - b.price,
    high: (a, b) => b.price - a.price,
    area: (a, b) => b.areaSqft - a.areaSqft,
  };
  return out.sort(sorters[f.sort] ?? sorters.new);
}

export default function Explorer({ listings, initial }: { listings: PublicListing[]; initial: Record<string, string | undefined> }) {
  const [f, setF] = useState<Filters>(() => fromParams(initial));
  const [open, setOpen] = useState(false); // filter drawer on phones
  const results = useMemo(() => apply(listings, f), [listings, f]);

  useEffect(() => {
    window.history.replaceState(null, "", `/listings${toQuery(f)}`);
  }, [f]);

  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => setF((prev) => ({ ...prev, [key]: value }));
  const toggle = (key: (typeof LIST_KEYS)[number], value: string) =>
    setF((prev) => ({ ...prev, [key]: prev[key].includes(value) ? prev[key].filter((v) => v !== value) : [...prev[key], value] }));
  const setDeal = (deal: Filters["deal"]) => setF((prev) => ({ ...prev, deal, max: "", deposit: "", lockin: "", possession: "", rera: false }));

  const leasing = f.deal === "rent" || f.deal === "lease";
  const active = activeChips(f);

  return (
    <div className="page-wide">
      <div className="explore-head">
        <div>
          <p className="eyebrow">Owner-listed · ₹0 brokerage</p>
          <h1>{f.deal ? `${DEAL_LABEL[f.deal]} homes` : "Homes and spaces"}<em>straight from owners</em></h1>
        </div>
        <div className="seg seg-lg" role="radiogroup" aria-label="Deal type">
          {([["", "All"], ["rent", "Rent"], ["sale", "Buy"], ["lease", "Lease"]] as const).map(([v, label]) => (
            <label key={v} className="seg-opt">
              <input type="radio" name="deal" checked={f.deal === v} onChange={() => setDeal(v)} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="explore">
        <aside className={`filters-panel ${open ? "open" : ""}`} aria-label="Filters">
          <div className="filters-top">
            <h2>Filters</h2>
            <button className="btn-ghost btn-sm" onClick={() => setF({ ...EMPTY, deal: f.deal, sort: f.sort })}>Clear all</button>
          </div>

          <Group title="Location">
            <input value={f.q} onChange={(e) => set("q", e.target.value)} placeholder="Area, society or city" aria-label="Area, society or city" />
          </Group>

          <Group title="Budget">
            {f.deal ? (
              <select value={f.max} onChange={(e) => set("max", e.target.value)} aria-label="Maximum budget">
                <option value="">Any budget</option>
                {BUDGETS[f.deal].map((b) => <option key={b} value={b}>Up to {formatPrice(b, f.deal as DealType)}</option>)}
              </select>
            ) : (
              <p className="muted small" style={{ margin: 0 }}>Choose Rent, Buy or Lease above to set a budget.</p>
            )}
          </Group>

          <Group title="Property type">
            <Chips options={PROPERTY_TYPES} selected={f.types} onToggle={(v) => toggle("types", v)} />
          </Group>

          <Group title="Bedrooms">
            <Chips options={["1", "2", "3", "4"]} labels={{ "4": "4+ BHK" }} suffix=" BHK" selected={f.bhk} onToggle={(v) => toggle("bhk", v)} />
          </Group>

          {leasing && (
            <>
              <Group title="Security deposit">
                <Pills value={f.deposit} onChange={(v) => set("deposit", v)} options={[["", "Any"], ["2", "≤ 2 months"], ["3", "≤ 3 months"], ["6", "≤ 6 months"]]} />
              </Group>
              <Group title="Lock-in period">
                <Pills value={f.lockin} onChange={(v) => set("lockin", v)} options={[["", "Any"], ["0", "No lock-in"], ["6", "≤ 6 mo"], ["11", "≤ 11 mo"], ["24", "≤ 2 yrs"]]} />
              </Group>
              <Group title="Preferred tenants">
                <select value={f.tenant} onChange={(e) => set("tenant", e.target.value)} aria-label="Preferred tenants">
                  <option value="">Anyone</option>
                  <option value="Family">Family</option>
                  <option value="Bachelors">Bachelors</option>
                  <option value="Company">Company lease</option>
                </select>
              </Group>
              <Group title="Terms">
                <Check checked={f.maintIncl} onChange={(v) => set("maintIncl", v)} label="Maintenance included in rent" />
                <Check checked={f.pets} onChange={(v) => set("pets", v)} label="Pets allowed" />
              </Group>
            </>
          )}

          {f.deal === "sale" && (
            <>
              <Group title="Possession">
                <Pills value={f.possession} onChange={(v) => set("possession", v)} options={[["", "Any"], ["Ready to move", "Ready to move"], ["Under construction", "Under construction"]]} />
              </Group>
              <Group title="Legal">
                <Check checked={f.rera} onChange={(v) => set("rera", v)} label="RERA registered only" />
              </Group>
            </>
          )}

          <Group title="Furnishing">
            <Chips options={FURNISHING} selected={f.furnishing} onToggle={(v) => toggle("furnishing", v)} />
          </Group>

          <Group title="Size & parking">
            <div className="two">
              <select value={f.minArea} onChange={(e) => set("minArea", e.target.value)} aria-label="Minimum carpet area">
                <option value="">Any size</option>
                {[500, 750, 1000, 1500, 2000, 3000].map((a) => <option key={a} value={a}>{a.toLocaleString("en-IN")}+ sq ft</option>)}
              </select>
              <select value={f.parking} onChange={(e) => set("parking", e.target.value)} aria-label="Car parking">
                <option value="">Any parking</option>
                <option value="1">1+ car</option>
                <option value="2">2+ cars</option>
              </select>
            </div>
          </Group>

          <Group title="Available by">
            <input type="date" value={f.by} onChange={(e) => set("by", e.target.value)} aria-label="Available by date" />
          </Group>

          <Group title="Amenities">
            <Chips options={[...AMENITIES]} selected={f.amenities} onToggle={(v) => toggle("amenities", v)} />
          </Group>

          <Group title="Trust">
            <Check checked={f.verified} onChange={(v) => set("verified", v)} label="MyGate-verified owners only" />
          </Group>

          <button className="full filters-done" onClick={() => setOpen(false)}>Show {results.length} results</button>
        </aside>

        <section className="results">
          <div className="results-bar">
            <button className="btn-ghost btn-sm filters-toggle" onClick={() => setOpen(true)}>
              Filters{active.length ? ` (${active.length})` : ""}
            </button>
            <span className="muted">{results.length} {results.length === 1 ? "property" : "properties"}</span>
            <select value={f.sort} onChange={(e) => set("sort", e.target.value)} className="sort" aria-label="Sort by">
              <option value="new">Newest first</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
              <option value="area">Largest first</option>
            </select>
          </div>

          {active.length > 0 && (
            <div className="active-chips">
              {active.map(([label, key, value]) => (
                <button
                  key={`${key}-${value}`}
                  className="active-chip"
                  onClick={() =>
                    (LIST_KEYS as readonly string[]).includes(key)
                      ? toggle(key as (typeof LIST_KEYS)[number], value)
                      : set(key as keyof Filters, EMPTY[key as keyof Filters])
                  }
                >
                  {label} <span aria-hidden="true">×</span>
                </button>
              ))}
            </div>
          )}

          {results.length > 0 ? (
            <div className="lgrid">{results.map((l) => <ListingCard key={l.id} l={l} />)}</div>
          ) : (
            <div className="empty">
              <h2>No exact matches yet.</h2>
              <p className="muted">Loosen a filter, or post what you need. Owners with a match can invite you directly.</p>
              <Link href="/wanted" className="btn">Post a requirement</Link>
            </div>
          )}
        </section>
      </div>
      {open && <div className="scrim" onClick={() => setOpen(false)} />}
    </div>
  );
}

function activeChips(f: Filters): [string, string, string][] {
  const chips: [string, string, string][] = [];
  if (f.q) chips.push([`“${f.q}”`, "q", f.q]);
  if (f.max && f.deal) chips.push([`Up to ${formatPrice(Number(f.max), f.deal)}`, "max", f.max]);
  f.types.forEach((t) => chips.push([t, "types", t]));
  f.bhk.forEach((b) => chips.push([b === "4" ? "4+ BHK" : `${b} BHK`, "bhk", b]));
  if (f.deposit) chips.push([`Deposit ≤ ${f.deposit} mo`, "deposit", f.deposit]);
  if (f.lockin) chips.push([f.lockin === "0" ? "No lock-in" : `Lock-in ≤ ${f.lockin} mo`, "lockin", f.lockin]);
  if (f.tenant) chips.push([f.tenant, "tenant", f.tenant]);
  if (f.maintIncl) chips.push(["Maintenance incl.", "maintIncl", "1"]);
  if (f.pets) chips.push(["Pets allowed", "pets", "1"]);
  if (f.possession) chips.push([f.possession, "possession", f.possession]);
  if (f.rera) chips.push(["RERA", "rera", "1"]);
  f.furnishing.forEach((v) => chips.push([v, "furnishing", v]));
  if (f.minArea) chips.push([`${f.minArea}+ sq ft`, "minArea", f.minArea]);
  if (f.parking) chips.push([`${f.parking}+ car parking`, "parking", f.parking]);
  if (f.by) chips.push([`By ${f.by}`, "by", f.by]);
  f.amenities.forEach((a) => chips.push([a, "amenities", a]));
  if (f.verified) chips.push(["MyGate verified", "verified", "1"]);
  return chips;
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="fgroup">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

function Chips({ options, selected, onToggle, suffix = "", labels = {} }: {
  options: string[]; selected: string[]; onToggle: (v: string) => void; suffix?: string; labels?: Record<string, string>;
}) {
  return (
    <div className="chips">
      {options.map((o) => (
        <button key={o} type="button" className={`chip ${selected.includes(o) ? "on" : ""}`} aria-pressed={selected.includes(o)} onClick={() => onToggle(o)}>
          {labels[o] ?? `${o}${suffix}`}
        </button>
      ))}
    </div>
  );
}

function Pills({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <div className="chips">
      {options.map(([v, label]) => (
        <button key={v} type="button" className={`chip ${value === v ? "on" : ""}`} aria-pressed={value === v} onClick={() => onChange(v)}>
          {label}
        </button>
      ))}
    </div>
  );
}

function Check({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="check">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}
