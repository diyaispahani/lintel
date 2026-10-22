// The brand story in one loop (pure SVG + CSS, no JavaScript):
// owner and seeker linked through a broker taking a fee -> the broker is struck out ->
// the door opens -> a direct line connects owner to you, AI-screened, numbers shared.
// With "reduce motion" turned on, it shows the final connected state without moving.

export default function HeroAnimation() {
  return (
    <svg viewBox="0 0 560 400" className="ha" role="img" aria-labelledby="ha-title">
      <title id="ha-title">An owner and a seeker connect directly through an open door, with the broker removed.</title>

      <circle cx="280" cy="220" r="170" className="ha-glow" />

      {/* The old way: through a broker */}
      <g className="ha-old">
        <path d="M112 244 C150 150 220 110 254 92" className="ha-dash" />
        <path d="M448 244 C410 150 340 110 306 92" className="ha-dash" />
      </g>
      <g className="ha-broker">
        <circle cx="280" cy="80" r="26" className="ha-broker-dot" />
        <text x="280" y="86" textAnchor="middle" className="ha-broker-letter">B</text>
        <rect x="318" y="62" width="128" height="34" rx="17" className="ha-fee" />
        <text x="382" y="84" textAnchor="middle" className="ha-fee-text">₹ 1 month fee</text>
        <path d="M244 116 L316 44" className="ha-strike" />
      </g>

      {/* The house */}
      <g className="ha-house">
        <path d="M190 312 V196 L280 128 L370 196 V312 Z" className="ha-walls" />
        <path d="M170 210 L280 120 L390 210" className="ha-roof" />
        <rect x="214" y="214" width="32" height="30" rx="3" className="ha-window" />
        <rect x="314" y="214" width="32" height="30" rx="3" className="ha-window" />
        <rect x="258" y="248" width="44" height="64" rx="3" className="ha-doorway" />
        <rect x="258" y="248" width="44" height="64" rx="3" className="ha-door" />
      </g>
      <path d="M150 312 H410" className="ha-ground" />

      {/* The direct line, through the door */}
      <path d="M124 280 H436" className="ha-direct" pathLength="1" />
      <circle cx="124" cy="280" r="6" className="ha-spark" />

      {/* Owner and you */}
      <g className="ha-node ha-owner">
        <circle cx="90" cy="280" r="34" className="ha-node-bg" />
        <circle cx="90" cy="280" r="34" className="ha-ring" />
        <circle cx="84" cy="274" r="9" className="ha-icon" />
        <path d="M91 280 L106 295 M100 289 l5 -5 M104 293 l4 -4" className="ha-icon" />
        <text x="90" y="338" textAnchor="middle" className="ha-label">Owner</text>
      </g>
      <g className="ha-node ha-you">
        <circle cx="470" cy="280" r="34" className="ha-node-bg" />
        <circle cx="470" cy="280" r="34" className="ha-ring" />
        <circle cx="470" cy="270" r="9" className="ha-icon" />
        <path d="M453 298 c3 -11 31 -11 34 0" className="ha-icon" />
        <text x="470" y="338" textAnchor="middle" className="ha-label">You</text>
      </g>

      {/* Outcome */}
      <g className="ha-chip">
        <rect x="214" y="352" width="132" height="32" rx="16" className="ha-chip-bg" />
        <text x="280" y="373" textAnchor="middle" className="ha-chip-text">✓ AI-screened</text>
      </g>
      <g className="ha-connected">
        <rect x="186" y="56" width="188" height="44" rx="22" className="ha-connected-bg" />
        <text x="280" y="84" textAnchor="middle" className="ha-connected-text">Connected directly · ₹0</text>
      </g>
    </svg>
  );
}
