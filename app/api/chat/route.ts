// One turn of the screening chat. When the interview is done, Claude labels it,
// our rules decide whether it's hidden, and the enquiry is saved for the owner.

import { classify, KeyMissingError, nextQuestion } from "@/lib/claude";
import { MAX_SEEKER_ANSWERS, applyRules } from "@/lib/rules";
import { getListing, newId, saveEnquiry, toPublic, type Turn } from "@/lib/store";

export const maxDuration = 60;

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const listing = typeof body.listingId === "string" ? getListing(body.listingId) : undefined;
  if (!listing) return Response.json({ error: "This listing no longer exists." }, { status: 404 });

  const transcript: Turn[] = Array.isArray(body.transcript)
    ? body.transcript
        .filter((t: Turn) => (t?.role === "ai" || t?.role === "seeker") && typeof t.text === "string")
        .slice(0, 2 * MAX_SEEKER_ANSWERS + 2)
        .map((t: Turn) => ({ role: t.role, text: t.text.trim().slice(0, 800) }))
    : [];
  if (transcript.at(-1)?.role !== "seeker" || !transcript.at(-1)?.text) {
    return Response.json({ error: "Please type an answer." }, { status: 400 });
  }

  try {
    const flat = toPublic(listing);
    const answers = transcript.filter((t) => t.role === "seeker").length;
    let { reply, done } = await nextQuestion(flat, transcript);
    if (answers >= MAX_SEEKER_ANSWERS && !done) {
      done = true;
      reply = "Thanks, that's everything I need. The owner will review your enquiry.";
    }
    if (!done) return Response.json({ reply, done });

    const fullTranscript: Turn[] = [...transcript, { role: "ai", text: reply }];
    const result = await classify(flat, fullTranscript);
    const { label, hidden } = applyRules(result.label, result.confidence);
    const enquiry = {
      id: newId(),
      listingId: listing.id,
      transcript: fullTranscript,
      aiLabel: result.label,
      label,
      confidence: result.confidence,
      reason: result.reason,
      summary: result.summary,
      hidden,
      shared: false,
      createdAt: Date.now(),
    };
    saveEnquiry(enquiry);
    console.log(`[shush] enquiry ${enquiry.id}: AI said ${result.label} (${result.confidence}), shown as ${label}${hidden ? ", hidden" : ""}`);
    return Response.json({ reply, done, enquiryId: enquiry.id });
  } catch (err) {
    if (err instanceof KeyMissingError) {
      return Response.json({ error: "The AI key isn't set up yet. Paste it into .env.local and save." }, { status: 500 });
    }
    console.error("[shush] chat failed", err);
    return Response.json({ error: "The assistant had a problem. Please send that again." }, { status: 502 });
  }
}
