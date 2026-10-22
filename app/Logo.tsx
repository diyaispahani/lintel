// Lintel mark: a doorway under its lintel beam, with an arrow passing straight through -
// owner to you, nothing in between.

export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" className="logo">
      <rect width="32" height="32" rx="9" fill="var(--forest)" />
      <rect x="7" y="8" width="18" height="3.2" rx="0.8" fill="var(--gold-on-dark)" />
      <path d="M10 11.2V25M22 11.2V25" stroke="#f7f2e9" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12.5 18.5h7m-2.4-2.4 2.4 2.4-2.4 2.4" fill="none" stroke="var(--gold-on-dark)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
