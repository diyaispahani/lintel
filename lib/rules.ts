// Plain-code rules. The AI judges intent; these fixed rules decide what happens.

import { enquiriesFor, type Label } from "./store";

export const MAX_SEEKER_ANSWERS = 5; // AI must wrap up after this many answers
const MIN_CONFIDENCE = 0.7; // below this, the label becomes Unclear

export function applyRules(aiLabel: Label, confidence: number): { label: Label; hidden: boolean } {
  const label = confidence < MIN_CONFIDENCE ? "Unclear" : aiLabel;
  return { label, hidden: label === "Sales pitch" || label === "Broker" };
}

// One enquiry per phone number per listing.
export async function isDuplicate(listingId: string, phoneHash: string): Promise<boolean> {
  return (await enquiriesFor(listingId)).some((e) => e.phoneHash === phoneHash);
}

export function validPhone(phone: string): boolean {
  return phone.replace(/\D/g, "").length >= 10;
}
