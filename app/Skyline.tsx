// Illustrated neighbourhood skylines: a pastel hill with a line-drawn cluster of buildings.
// Each variant is a different mix so the row of cards doesn't repeat.

const VARIANTS = [
  "M20 120V70h22v50M42 120V52h26v68M68 120V84h18v36M98 120V60l16-12 16 12v60M140 120V40h24v80M164 120V74h20v46",
  "M18 120V88h28v32M46 120V58h20v62M66 120V44h30v76M106 120V76l14-10 14 10v44M144 120V62h18v58M162 120V82h24v38",
  "M22 120V64h18v56M40 120V80h26v40M74 120V50h24v70M98 120V36h18v84M124 120V70h30v50M160 120V58l14-10 14 10v62",
  "M16 120V76l16-12 16 12v44M56 120V54h22v66M78 120V68h20v52M106 120V42h26v78M140 120V86h22v34M162 120V64h22v56",
];

export default function Skyline({ variant, tone }: { variant: number; tone: string }) {
  const d = VARIANTS[variant % VARIANTS.length];
  const windows = Array.from({ length: 10 }, (_, i) => [30 + ((i * 37) % 150), 70 + ((i * 23) % 40)]);
  return (
    <svg viewBox="0 0 200 130" className="skyline" aria-hidden="true">
      <path d="M0 130V96C40 70 70 66 100 72s70 4 100-14v72z" fill={`var(--${tone})`} />
      <path d={d} fill="var(--surface)" stroke="var(--ink)" strokeWidth="1.4" strokeLinejoin="round" />
      {windows.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="4" height="5" fill="none" stroke="var(--ink)" strokeWidth="0.9" opacity="0.6" />
      ))}
      <path d="M0 120.5h200" stroke="var(--ink)" strokeWidth="1.4" />
      <path d="M8 126h40M60 126h22M150 126h42" stroke="var(--ink)" strokeWidth="1" strokeDasharray="5 5" opacity="0.5" />
    </svg>
  );
}
