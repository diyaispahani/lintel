// GharDirect mark: a house whose doorway is an open arrow straight through - owner to you, nothing in between.

export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className="logo">
      <rect width="32" height="32" rx="9" fill="var(--primary)" />
      <path d="M8 15.5 16 9l8 6.5V24H8z" fill="none" stroke="var(--brass)" strokeWidth="2" strokeLinejoin="round" />
      <path d="M12.5 19.5h7m-2.5-2.5 2.5 2.5-2.5 2.5" fill="none" stroke="var(--on-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
