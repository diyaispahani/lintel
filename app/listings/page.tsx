// All listings, with filters. The filtering runs in the browser for instant results.

import { allListings, toPublic } from "@/lib/store";
import Explorer from "./Explorer";

export const dynamic = "force-dynamic";

export default async function ListingsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  return <Explorer listings={allListings().map(toPublic)} initial={params} />;
}
