// The owner's private dashboard. The secret key comes from the owner's link.

import Dashboard from "./Dashboard";

export default async function OwnerPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ key?: string }>;
}) {
  const { id } = await params;
  const { key } = await searchParams;
  return <Dashboard listingId={id} ownerKey={key ?? ""} />;
}
