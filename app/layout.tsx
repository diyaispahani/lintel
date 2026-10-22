import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "GharDirect",
  description: "Rent, buy or lease directly from owners. Zero brokers.",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <Link href="/" className="brand">🏠 GharDirect</Link>
          <nav>
            <Link href="/">Browse</Link>
            <Link href="/list">List property</Link>
            <Link href="/wanted">Looking for…</Link>
            <Link href="/mygate">MyGate</Link>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
