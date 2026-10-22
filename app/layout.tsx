import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import Link from "next/link";
import Logo from "./Logo";
import "./globals.css";

const display = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });

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
          <div className="container header-inner">
            <Link href="/" className="brand" aria-label="GharDirect home">
              <Logo />
              <span>GharDirect</span>
            </Link>
            <nav className="nav">
              <Link href="/listings">Explore homes</Link>
              <Link href="/wanted">Post a requirement</Link>
              <Link href="/mygate">MyGate</Link>
              <Link href="/list" className="btn btn-outline btn-sm">List your property</Link>
            </nav>
          </div>
        </header>
        {children}
        <footer className="site-footer">
          <div className="container footer-inner">
            <div>
              <Link href="/" className="brand"><Logo /><span>GharDirect</span></Link>
              <p className="muted small">Homes straight from owners. Zero brokerage, always.</p>
            </div>
            <div className="footer-links">
              <Link href="/listings?deal=rent">Rent</Link>
              <Link href="/listings?deal=sale">Buy</Link>
              <Link href="/listings?deal=lease">Lease</Link>
              <Link href="/list">List property</Link>
            </div>
            <p className="muted small">Prototype · MyGate data is simulated for demo purposes.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
