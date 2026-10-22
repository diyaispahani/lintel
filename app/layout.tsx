import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import Logo from "./Logo";
import "./globals.css";

const display = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-display" });
const body = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "GharDirect: homes straight from owners",
  description: "Rent, buy or lease directly from owners. Zero brokers, AI-screened enquiries, MyGate-verified homes.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <header className="site-header">
          <Link href="/" className="brand-pill" aria-label="GharDirect home">
            <Logo />
            <span>GharDirect</span>
          </Link>
          <nav className="nav-pill">
            <Link href="/listings">All homes</Link>
            <Link href="/wanted" className="hide-sm">Post a requirement</Link>
            <Link href="/mygate" className="pill pill-blush">MyGate</Link>
            <Link href="/list" className="pill pill-lavender">For owners <span aria-hidden="true">→</span></Link>
          </nav>
        </header>
        {children}
        <footer className="site-footer">
          <div className="container footer-inner">
            <div>
              <Link href="/" className="brand"><Logo /><span>GharDirect</span></Link>
              <p className="muted small" style={{ marginTop: 10 }}>Homes straight from owners. Zero brokerage, always.</p>
            </div>
            <div className="footer-links">
              <Link href="/listings?deal=rent">Rent</Link>
              <Link href="/listings?deal=sale">Buy</Link>
              <Link href="/listings?deal=lease">Lease</Link>
              <Link href="/list">List property</Link>
              <Link href="/wanted">Post a requirement</Link>
            </div>
            <p className="muted small">Prototype · MyGate data is simulated for demo purposes.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
