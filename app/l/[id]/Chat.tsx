"use client";

// The AI screening chat a seeker sees after tapping Enquire.

import { useEffect, useRef, useState } from "react";

type Turn = { role: "ai" | "seeker"; text: string };

const GREETING: Turn = {
  role: "ai",
  text: "Hi! I'm the owner's assistant. I'll ask a few quick questions before passing your enquiry on. Are you looking for yourself, or for someone else?",
};

export default function Chat({ listingId }: { listingId: string }) {
  const [open, setOpen] = useState(false);
  const [transcript, setTranscript] = useState<Turn[]>([GREETING]);
  const [draft, setDraft] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState("");
  const [enquiryId, setEnquiryId] = useState<string | null>(null);
  const [phone, setPhone] = useState<string | null>(null);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript, waiting]);

  // After the chat, check every 5 s whether the owner shared their number.
  useEffect(() => {
    if (!enquiryId || phone) return;
    const timer = setInterval(async () => {
      const data = await fetch(`/api/enquiries/${enquiryId}`).then((r) => r.json()).catch(() => null);
      if (data?.shared && data.phone) setPhone(data.phone);
    }, 5000);
    return () => clearInterval(timer);
  }, [enquiryId, phone]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || waiting) return;
    const next: Turn[] = [...transcript, { role: "seeker", text }];
    setTranscript(next);
    setDraft("");
    setWaiting(true);
    setError("");
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId, transcript: next }),
    }).catch(() => null);
    const data = await res?.json().catch(() => null);
    setWaiting(false);
    if (!res?.ok || !data?.reply) {
      setTranscript(transcript); // let them resend
      setDraft(text);
      return setError(data?.error ?? "Couldn't reach the assistant. Please try again.");
    }
    setTranscript([...next, { role: "ai", text: data.reply }]);
    if (data.done) setEnquiryId(data.enquiryId);
  }

  if (!open) {
    return <button className="full" onClick={() => setOpen(true)}>Enquire</button>;
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

      {enquiryId ? (
        phone ? (
          <p className="shared">✅ The owner shared their number: {phone}</p>
        ) : (
          <p className="muted small">✔ Enquiry sent. Keep this page open: if the owner picks you, their number appears here.</p>
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
