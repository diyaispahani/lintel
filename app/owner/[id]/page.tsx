// The owner's private shortlist. The secret key comes from the owner's link.

import Shortlist from "./Shortlist";

export default async function OwnerPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ key?: string }>;
}) {
  const { id } = await params;
  const { key } = await searchParams;
  return <Shortlist listingId={id} ownerKey={key ?? ""} />;
}
