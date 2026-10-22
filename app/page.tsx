// Landing page.

import Link from "next/link";
import { allListings, toPublic, type PropertyType } from "@/lib/store";
import HeroAnimation from "./HeroAnimation";
import InView from "./InView";
import ListingCard, { PropertyArt } from "./ListingCard";
import SavingsCalc from "./SavingsCalc";
import Skyline from "./Skyline";

export const dynamic = "force-dynamic";

// Floating illustrated tiles around the hero headline (Flent uses photos; we draw ours).
const TILES: { type: PropertyType; tone: string; cls: string }[] = [
  { type: "Villa", tone: "mint", cls: "t1" },
  { type: "Apartment", tone: "butter", cls: "t2" },
  { type: "Independent house", tone: "blush", cls: "t3" },
  { type: "Office", tone: "lavender", cls: "t4" },
  { type: "Shop", tone: "butter", cls: "t5" },
  { type: "Apartment", tone: "mint", cls: "t6" },
];

const TONES = ["blush", "lavender", "butter", "mint"];

export default async function Landing() {
  const listings = (await allListings()).map(toPublic);
  const featured = listings.slice(0, 8);
  const cities = new Set(listings.map((l) => l.area.split(",").pop()?.trim())).size;

  // Neighbourhoods with at least one home, most homes first.
  const counts = new Map<string, number>();
  listings.forEach((l) => {
    const name = l.area.split(",")[0].trim();
    counts.set(name, (counts.get(name) ?? 0) + 1);
  });
  const hoods = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);

  return (
    <>
      <section className="hero">
        <div className="hero-tiles" aria-hidden="true">
          {TILES.map((t, i) => (
            <div key={i} className={`tile ${t.cls}`} style={{ background: `var(--${t.tone})` }}>
              <PropertyArt type={t.type} />
            </div>
          ))}
        </div>

        <div className="hero-copy">
          <h1 className="headline">
            Homes that come straight
            <em>from the owner</em>
          </h1>
          <p className="hero-sub">Rent, buy or lease without a single broker in between. No spam calls, no fees, and numbers shared only when you both say yes.</p>

          <form action="/listings" className="search">
            <div className="seg" role="radiogroup" aria-label="I want to">
              {[["rent", "Rent"], ["sale", "Buy"], ["lease", "Lease"]].map(([v, label], i) => (
                <label key={v} className="seg-opt">
                  <input type="radio" name="deal" value={v} defaultChecked={i === 0} />
                  <span>{label}</span>
                </label>
              ))}
            </div>
            <input name="q" placeholder="Search an area, society or city" aria-label="Area, society or city" />
            <button className="btn-ink">Explore homes</button>
          </form>
        </div>
      </section>

      <section className="promise-strip container">
        <p className="eyebrow">The Lintel promise</p>
        <div className="promises">
          <span>₹0 brokerage, ever</span>
          <span>Every home listed by its owner</span>
          <span>Every enquiry screened</span>
          <span>MyGate-verified owners</span>
        </div>
      </section>

      <section className="container">
        <div className="panel panel-forest story">
          <div>
            <h2 className="headline headline-sm">
              The broker step,
              <em>removed.</em>
            </h2>
            <ol className="story-steps">
              <li><span>01</span><div><strong>Owners list privately</strong><p>The number stays hidden. MyGate residents can list in one tap.</p></div></li>
              <li><span>02</span><div><strong>Every enquiry is screened</strong><p>Four short questions. Brokers and sales pitches never reach the owner.</p></div></li>
              <li><span>03</span><div><strong>Both say yes, then connect</strong><p>Numbers are exchanged only when the owner chooses you.</p></div></li>
            </ol>
          </div>
          <InView className="story-art">
            <HeroAnimation />
          </InView>
        </div>
      </section>

      <section className="ribbons" aria-label="Others connect you to brokers. We connect you to the owner.">
        <div className="ribbon ribbon-ghost"><div className="ribbon-track">{Array.from({ length: 6 }, (_, i) => <span key={i}>Others connect you to <em>brokers</em></span>)}</div></div>
        <div className="ribbon ribbon-green"><div className="ribbon-track reverse">{Array.from({ length: 6 }, (_, i) => <span key={i}>We connect you to <em>the owner.</em></span>)}</div></div>
      </section>

      <section className="container">
        <div className="panel panel-espresso">
          <div className="panel-head">
            <div>
              <h2 className="headline headline-sm">
                What you see,
                <em>is who you meet</em>
              </h2>
              <p className="panel-sub">Every listing below is posted by its owner. Rent, buy or lease, your call.</p>
            </div>
            <Link href="/listings" className="btn-cream">View all homes</Link>
          </div>
          <div className="carousel">
            {featured.map((l) => <ListingCard key={l.id} l={l} />)}
          </div>
        </div>
      </section>

      <section className="container section stat-section">
        <h2 className="headline headline-md">
          A lot goes into
          <em>a direct deal</em>
        </h2>
        <div className="stat-cards">
          <div className="stat-card s1"><strong>₹0</strong><span>Brokerage for owners and seekers</span></div>
          <div className="stat-card s2"><strong>4</strong><span>Questions every enquiry answers</span></div>
          <div className="stat-card s3"><strong>2-way</strong><span>Consent before any number is shared</span></div>
        </div>
      </section>

      <section className="section">
        <div className="container center">
          <h2 className="headline headline-md">
            Explore by
            <em>neighbourhood</em>
          </h2>
        </div>
        <div className="hoods">
          {hoods.map(([name, count], i) => (
            <Link key={name} href={`/listings?q=${encodeURIComponent(name)}`} className="hood">
              <div className="hood-top">
                <strong>{name}</strong>
                <span className="muted small">{count} {count === 1 ? "home" : "homes"}</span>
              </div>
              <Skyline variant={i} tone={TONES[i % TONES.length]} />
            </Link>
          ))}
        </div>
        <div className="container numbers">
          <div><strong>{listings.length}</strong><span>Homes and spaces live now</span></div>
          <div><strong>{cities}</strong><span>Cities across India</span></div>
          <div><strong>0</strong><span>Brokers, by design</span></div>
        </div>
      </section>

      <section className="container section split">
        <div>
          <h2 className="headline headline-md left">
            Keep the month&apos;s rent
            <em>a broker would take</em>
          </h2>
          <p className="muted" style={{ maxWidth: 440 }}>There is no brokerage on Lintel, for owners or seekers. Move the slider to see what that means for you.</p>
        </div>
        <SavingsCalc />
      </section>

      <section className="container section">
        <div className="panel panel-lavender mygate">
          <div>
            <h2 className="headline headline-sm left">
              Moving out?
              <em>List it in one tap.</em>
            </h2>
            <p style={{ maxWidth: 460 }}>
              MyGate knows when a flat is about to be vacated, and who really owns it. Lintel turns that into a verified, broker-free listing,
              ready to publish.
            </p>
            <Link href="/mygate" className="btn-ink">See the MyGate demo</Link>
          </div>
          <ul className="mygate-points">
            <li><strong>Move-out alerts</strong><span>Know before the flat goes empty</span></li>
            <li><strong>Verified owners</strong><span>Matched to the society&apos;s flat records</span></li>
            <li><strong>A badge seekers trust</strong><span>Real owners, recognisable at a glance</span></li>
          </ul>
        </div>
      </section>

      <section className="container section">
        <div className="panel panel-forest cta">
          <h2 className="headline headline-md">
            Ready to go
            <em>direct?</em>
          </h2>
          <p className="panel-sub">Find your next home, or list yours, without paying a single rupee in brokerage.</p>
          <div className="row" style={{ justifyContent: "center", gap: 14 }}>
            <Link href="/listings" className="btn-cream">Explore homes</Link>
            <Link href="/list" className="btn-outline-cream">List your property</Link>
          </div>
        </div>
      </section>
    </>
  );
}
