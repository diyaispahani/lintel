// List a property. With ?mygate=<notice id>, the form is pre-filled from the (simulated) MyGate feed.

import { getNotice } from "@/lib/mygate";
import ListForm from "./ListForm";

export default async function ListPage({ searchParams }: { searchParams: Promise<{ mygate?: string }> }) {
  const { mygate } = await searchParams;
  const notice = mygate ? getNotice(mygate) : undefined;
  return <ListForm notice={notice ?? null} />;
}
