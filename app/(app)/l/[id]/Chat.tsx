"use client";

// What a seeker sees after tapping "I'm interested":
// 1. name + phone (kept private, never sent to the AI), 2. the AI screening chat,
// 3. a waiting screen that shows the owner's number once the owner taps Connect.

import { useEffect, useRef, useState } from "react";
import type { DealType } from "@/lib/store";

type Turn = { role: "ai" | "seeker"; text: string };

const GREETING: Record<DealType, string> = {
  rent: "Hi! I'm the owner's assistant. A few quick questions before I pass your enquiry on. Are you looking to rent for yourself, or for someone else?",
  sale: "Hi! I'm the owner's assistant. A few quick questions before I pass your enquiry on. Are you buying for yourself, or for someone else?",
  lease: "Hi! I'm the owner's assistant. A few quick questions before I pass your enquiry on. What's your business, and is the space for you or for someone else?",
};

export default function Chat({ listingId, dealType }: { listingId: string; dealType: DealType }) {
  const [step, setStep] = useState<"closed" | "contact" | "chat" | "sent">("closed");
  const [contact, setContact] = useState({ name: "", phone: "" });
  const [transcript, setTranscript] = useState<Turn[]>([{ role: "ai", text: GREETING[dealType] }]);
  const [draft, setDraft] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState("");
  const [enquiryId, setEnquiryId] = useState<string | null>(null);
  const [owner, setOwner] = useState<{ name: string; phone: string } | null>(null);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript, waiting]);

  // After the chat, check every 5 s whether the owner tapped Connect.
  useEffect(() => {
    if (!enquiryId || owner) return;
    const timer = setInterval(async () => {
      const data = await fetch(`/api/enquiries/${enquiryId}`).then((r) => r.json()).catch(() => null);
      if (data?.connected && data.owner) setOwner(data.owner);
    }, 5000);
    return () => clearInterval(timer);
  }, [enquiryId, owner]);

  async function callChat(nextTranscript: Turn[]) {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId, contact, transcript: nextTranscript }),
    }).catch(() => null);
    const data = await res?.json().catch(() => null);
    return res?.ok && data ? { data } : { error: (data?.error as string) ?? "Couldn't reach the assistant. Please try again." };
  }

  async function startChat(e: React.FormEvent) {
    e.preventDefault();
    setWaiting(true);
    setError("");
    const result = await callChat([]); // checks the contact details and duplicates only
    setWaiting(false);
    if (result.error) return setError(result.error);
    setStep("chat");
  }

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || waiting) return;
    const next: Turn[] = [...transcript, { role: "seeker", text }];
    setTranscript(next);
    setDraft("");
    setWaiting(true);
    setError("");
    const result = await callChat(next);
    setWaiting(false);
    if (result.error || !result.data?.reply) {
      setTranscript(transcript); // let them resend
      setDraft(text);
      return setError(result.error ?? "The assistant had a problem. Please send that again.");
    }
    setTranscript([...next, { role: "ai", text: result.data.reply }]);
    if (result.data.done) {
      setEnquiryId(result.data.enquiryId);
      setStep("sent");
    }
  }

  if (step === "closed") {
    return <button className="full" onClick={() => setStep("contact")}>I&apos;m interested</button>;
  }

  if (step === "contact") {
    return (
      <form onSubmit={startChat} className="card">
        <h2>First, how can the owner reach you?</h2>
        <p className="muted small">Only shared with the owner if you both agree to connect. Never sent to the AI.</p>
        <div className="two">
          <div>
            <label htmlFor="name">Your name</label>
            <input id="name" value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} placeholder="Kavya" />
          </div>
          <div>
            <label htmlFor="phone">Your phone</label>
            <input id="phone" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} inputMode="tel" placeholder="98xxxxxxxx" />
          </div>
        </div>
        <button className="full" disabled={waiting}>{waiting ? "Checking…" : "Continue"}</button>
        {error && <div className="error">{error}</div>}
      </form>
    );
  }

  return (
    <div className="card">
      <div className="chat">
        {transcript.map((t, i) => (
          <div key={i} className={`bubble ${t.role}`}>{t.text}</div>
        ))}
        {waiting && <div className="bubble ai muted">typing…</div>}
        <div ref={bottom} />
      </div>

      {step === "sent" ? (
        owner ? (
          <p className="connected">Connected! {owner.name} (owner): {owner.phone}. The owner has your number too.</p>
        ) : (
          <p className="muted small">Enquiry sent. Keep this page open: if the owner wants to connect, their number appears here.</p>
        )
      ) : (
        <form onSubmit={send} className="composer">
          <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Type your answer…" disabled={waiting} autoFocus />
          <button disabled={waiting || !draft.trim()}>Send</button>
        </form>
      )}
      {error && <div className="error">{error}</div>}
    </div>
  );
}
