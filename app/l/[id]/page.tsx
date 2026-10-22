// Public listing page: no phone number, just an Enquire chat.

import { notFound } from "next/navigation";
import { getListing, toPublic } from "@/lib/store";
import Chat from "./Chat";

export const dynamic = "force-dynamic";

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = getListing(id);
  if (!listing) notFound();
  const flat = toPublic(listing);

  return (
    <>
      <h1>{flat.title}</h1>
      <p className="muted">📍 {flat.area} · {flat.price}</p>
      {flat.details && <div className="card">{flat.details}</div>}
      <p className="muted small">The owner's number is private. Answer a few quick questions and the owner will get back to you if it's a fit.</p>
      <Chat listingId={flat.id} />
    </>
  );
}
