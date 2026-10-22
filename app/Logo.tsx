// GharDirect mark: a house whose doorway is an open arrow straight through - owner to you, nothing in between.

export default function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className="logo">
      <rect x="0.5" y="0.5" width="31" height="31" rx="9" fill="none" stroke="var(--gold)" strokeOpacity="0.55" />
      <path d="M8 15.5 16 9l8 6.5V24H8z" fill="none" stroke="var(--gold)" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12.5 19.5h7m-2.4-2.4 2.4 2.4-2.4 2.4" fill="none" stroke="var(--ink)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
