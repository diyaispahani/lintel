// Plain-code rules applied after the AI classifies an enquiry.
// The AI judges intent; these fixed rules decide what the owner sees.

import type { Label } from "./store";

export const MAX_SEEKER_ANSWERS = 5; // AI must wrap up after this many answers
const MIN_CONFIDENCE = 0.7; // below this, the label becomes Unclear

export function applyRules(aiLabel: Label, confidence: number): { label: Label; hidden: boolean } {
  const label = confidence < MIN_CONFIDENCE ? "Unclear" : aiLabel;
  return { label, hidden: label === "Sales pitch" || label === "Broker" };
}
