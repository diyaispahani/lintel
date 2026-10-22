// Landing page.

import Link from "next/link";
import { allListings, toPublic } from "@/lib/store";
import HeroAnimation from "./HeroAnimation";
import ListingCard from "./ListingCard";
import SavingsCalc from "./SavingsCalc";

export const dynamic = "force-dynamic";

const STEPS_SEEKER = [
  ["Find a home", "Every listing is posted by the owner. Filter by deposit, lock-in, pets and more."],
  ["Answer 4 quick questions", "Our AI asks what the owner needs to know, so they can tell you're genuine."],
  ["Connect when you both say yes", "Numbers are shared only when the owner taps Connect. No middlemen."],
];
const STEPS_OWNER = [
  ["List in two minutes", "Or one tap from MyGate when you're moving out. Your number stays hidden."],
  ["Brokers get filtered out", "AI reads every enquiry and hides brokers and sales pitches."],
  ["Pick who you talk to", "See a shortlist with a 2-line summary each, and connect with the right one."],
];

export default function Landing() {
  const featured = allListings().filter((l) => l.mygateVerified).slice(0, 3).map(toPublic);

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Zero brokerage · Owner-direct</p>
            <h1 className="hero-title">Home, <em>direct.</em></h1>
            <p className="hero-sub">
              Rent, buy or lease straight from owners. No brokers, no spam calls. An AI checks every enquiry, and you connect only when you both say yes.
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
                <input name="q" placeholder="Area, society or city, e.g. HSR Layout" aria-label="Area, society or city" />
                <button className="btn-lg">Search</button>
              </div>
            </form>

            <ul className="trust">
              <li>₹0 brokerage, always</li>
              <li>Owner-listed homes only</li>
              <li>Your number stays private</li>
            </ul>
          </div>
          <div className="hero-art">
            <HeroAnimation />
          </div>
        </div>
      </section>

      <section className="band">
        <div className="container compare">
          <div className="compare-card old">
            <p className="eyebrow muted">The old way</p>
            <h2>Your number goes public. The calls never stop.</h2>
            <ul>
              <li>Brokers flood owners within minutes of listing</li>
              <li>Tenants pay a month&apos;s rent just to be introduced</li>
              <li>Portals push paid plans with more calls</li>
            </ul>
          </div>
          <div className="compare-card new">
            <p className="eyebrow">With GharDirect</p>
            <h2>Owner and seeker, nothing in between.</h2>
            <ul>
              <li>Numbers hidden until both sides agree</li>
              <li>AI screens out brokers and sales pitches</li>
              <li>MyGate-verified owners you can trust</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="container section">
        <p className="eyebrow">How it works</p>
        <h2 className="section-title">Simple for both sides.</h2>
        <div className="how">
          {[["For seekers", STEPS_SEEKER], ["For owners", STEPS_OWNER]].map(([title, steps]) => (
            <div key={title as string} className="how-col">
              <h3>{title as string}</h3>
              <ol>
                {(steps as string[][]).map(([h, p], i) => (
                  <li key={h}>
                    <span className="step-n">{i + 1}</span>
                    <div><strong>{h}</strong><p className="muted">{p}</p></div>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="row between section-head">
          <div>
            <p className="eyebrow">MyGate-verified homes</p>
            <h2 className="section-title">Fresh from owners this week.</h2>
          </div>
          <Link href="/listings" className="btn btn-ghost">Explore all homes →</Link>
        </div>
        <div className="lgrid">
          {featured.map((l) => <ListingCard key={l.id} l={l} />)}
        </div>
      </section>

      <section className="container section split">
        <div>
          <p className="eyebrow">Do the maths</p>
          <h2 className="section-title">Keep the month&apos;s rent a broker would take.</h2>
          <p className="muted">Slide to your budget. On GharDirect there&apos;s no brokerage for owners or seekers, ever.</p>
        </div>
        <SavingsCalc />
      </section>

      <section className="container section">
        <div className="mygate-band">
          <div>
            <p className="eyebrow" style={{ color: "var(--mygate)" }}>MyGate × GharDirect</p>
            <h2 className="section-title">Moving out? List it in one tap.</h2>
            <p className="muted">
              MyGate knows when a flat is about to be vacated and who really owns it. GharDirect turns that into a verified, broker-free listing,
              pre-filled and ready to publish.
            </p>
            <Link href="/mygate" className="btn btn-ghost">See the MyGate demo →</Link>
          </div>
          <ul className="mygate-points">
            <li><strong>Move-out alerts</strong><span>Know before the flat goes empty</span></li>
            <li><strong>Verified owners</strong><span>Matched to the society&apos;s flat records</span></li>
            <li><strong>Trusted badge</strong><span>Seekers see who&apos;s real at a glance</span></li>
          </ul>
        </div>
      </section>

      <section className="container section">
        <div className="cta">
          <h2 className="display">Ready to go direct?</h2>
          <p>Find your next home, or list yours, without paying a single rupee in brokerage.</p>
          <div className="row" style={{ justifyContent: "center" }}>
            <Link href="/listings" className="btn btn-brass btn-lg">Explore homes</Link>
            <Link href="/list" className="btn btn-lg cta-ghost">List your property</Link>
          </div>
        </div>
      </section>
    </>
  );
}
