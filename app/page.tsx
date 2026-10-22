// Landing page.

import Link from "next/link";
import { allListings, toPublic } from "@/lib/store";
import HeroAnimation from "./HeroAnimation";
import ListingCard from "./ListingCard";
import SavingsCalc from "./SavingsCalc";

export const dynamic = "force-dynamic";

const STEPS_SEEKER = [
  ["Find a home", "Every listing comes from its owner. Filter by deposit, lock-in, pets and more."],
  ["Answer four questions", "A short, private conversation so the owner knows you're genuine."],
  ["Connect when you both say yes", "Numbers are exchanged only when the owner chooses you."],
];
const STEPS_OWNER = [
  ["List in two minutes", "Or in one tap from MyGate when a flat is being vacated. Your number stays hidden."],
  ["Brokers never reach you", "Every enquiry is read first. Brokers and sales pitches are set aside."],
  ["Choose who you speak to", "A considered shortlist, each with a two-line summary. Connect with the right one."],
];

export default function Landing() {
  const listings = allListings();
  const featured = listings.filter((l) => l.mygateVerified).slice(0, 3).map(toPublic);
  const cities = new Set(listings.map((l) => l.area.split(",").pop()?.trim())).size;

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Owner-direct real estate</p>
            <h1 className="hero-title">Home,<br /><em>direct.</em></h1>
            <p className="hero-sub">
              Rent, buy or lease straight from the people who own it. No brokers, no calls you didn&apos;t ask for, and no fees. Ever.
            </p>

            <form action="/listings" className="search">
              <div className="seg" role="radiogroup" aria-label="I want to">
                {[["rent", "Rent"], ["sale", "Buy"], ["lease", "Lease"]].map(([v, label], i) => (
                  <label key={v} className="seg-opt">
                    <input type="radio" name="deal" value={v} defaultChecked={i === 0} />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
              <div className="search-row">
                <input name="q" placeholder="Area, society or city" aria-label="Area, society or city" />
                <button className="btn-lg">Search</button>
              </div>
            </form>

            <ul className="trust">
              <li>Zero brokerage</li>
              <li>Owner-listed only</li>
              <li>Private until you both agree</li>
            </ul>
          </div>
          <div className="hero-art">
            <HeroAnimation />
          </div>
        </div>
      </section>

      <div className="container">
        <div className="metrics">
          <div className="metric"><strong>₹0</strong><span>Brokerage for owners and seekers</span></div>
          <div className="metric"><strong>100%</strong><span>Of homes listed by their owners</span></div>
          <div className="metric"><strong>{listings.length}</strong><span>Homes and spaces across {cities} cities</span></div>
          <div className="metric"><strong>2-way</strong><span>Consent before any number is shared</span></div>
        </div>
      </div>

      <section className="container section">
        <p className="eyebrow">Why GharDirect</p>
        <h2 className="section-title">The middleman was never part of the home.</h2>
        <div className="compare">
          <div className="compare-card old">
            <p className="eyebrow" style={{ color: "var(--faint)" }}>The old way</p>
            <h3>A public number, and calls that never stop.</h3>
            <ul>
              <li>Brokers reach owners within minutes of listing</li>
              <li>Tenants pay a month&apos;s rent just to be introduced</li>
              <li>Portals sell paid plans that bring more calls</li>
            </ul>
          </div>
          <div className="compare-card new">
            <p className="eyebrow">With GharDirect</p>
            <h3>Owner and seeker, with nothing in between.</h3>
            <ul>
              <li>Numbers stay private until both sides agree</li>
              <li>Every enquiry is screened before the owner sees it</li>
              <li>MyGate-verified owners you can trust</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="container section">
        <p className="eyebrow">How it works</p>
        <h2 className="section-title">Considered for both sides.</h2>
        <div className="how">
          {([["For seekers", STEPS_SEEKER], ["For owners", STEPS_OWNER]] as const).map(([title, steps]) => (
            <div key={title} className="how-col">
              <h3>{title}</h3>
              <ol>
                {steps.map(([h, p], i) => (
                  <li key={h}>
                    <span className="step-n">0{i + 1}</span>
                    <div><strong>{h}</strong><p>{p}</p></div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <div>
            <p className="eyebrow">MyGate-verified</p>
            <h2 className="section-title" style={{ marginBottom: 0 }}>New from owners this week.</h2>
          </div>
          <Link href="/listings" className="btn btn-outline">View all homes</Link>
        </div>
        <div className="lgrid">
          {featured.map((l) => <ListingCard key={l.id} l={l} />)}
        </div>
      </section>

      <section className="container section split">
        <div>
          <p className="eyebrow">The arithmetic</p>
          <h2 className="section-title">Keep the month&apos;s rent a broker would take.</h2>
          <p className="section-lede">There is no brokerage on GharDirect, for owners or seekers. Move the slider to see what that means for you.</p>
        </div>
        <SavingsCalc />
      </section>

      <section className="container section">
        <div className="mygate-band">
          <div>
            <p className="eyebrow">MyGate × GharDirect</p>
            <h2 className="section-title">Moving out? List it in one tap.</h2>
            <p className="section-lede" style={{ marginBottom: 28 }}>
              MyGate knows when a flat is about to be vacated, and who really owns it. GharDirect turns that into a verified,
              broker-free listing, ready to publish.
            </p>
            <Link href="/mygate" className="btn btn-outline">See how it works</Link>
          </div>
          <ul className="mygate-points">
            <li><strong>Move-out alerts</strong><span>Know before the flat goes empty</span></li>
            <li><strong>Verified owners</strong><span>Matched to the society&apos;s flat records</span></li>
            <li><strong>A badge seekers trust</strong><span>Real owners, recognisable at a glance</span></li>
          </ul>
        </div>
      </section>

      <section className="container section">
        <div className="cta">
          <p className="eyebrow">Begin</p>
          <h2>Ready to go <em>direct?</em></h2>
          <p>Find your next home, or list yours, without paying a single rupee in brokerage.</p>
          <div className="row" style={{ justifyContent: "center", gap: 12 }}>
            <Link href="/listings" className="btn btn-lg">Explore homes</Link>
            <Link href="/list" className="btn btn-lg cta-ghost">List your property</Link>
          </div>
        </div>
      </section>
    </>
  );
}
