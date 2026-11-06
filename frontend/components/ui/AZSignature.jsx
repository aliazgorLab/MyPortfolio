"use client";

/**
 * AZSignature — Handwritten expressive SVG logo for Md Ali Azgor's portfolio.
 * Drawn as a bespoke SVG path so every stroke detail is intentional.
 * Accent colour: #FF791F (warm orange), chosen to contrast the obsidian theme.
 */
export default function AZSignature({ className = "", size = 44 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 110 52"
      width={size}
      height={Math.round(size * 0.473)}
      aria-label="AZ."
      role="img"
      className={className}
      style={{ overflow: "visible", display: "block" }}
    >
      {/* ── A ──
          A loose, slightly italic uppercase A.
          Left stroke rises from baseline, right leg descends;
          crossbar sits at mid-height. The strokes are thick at the
          start and taper — simulating a felt-tip or broad-nib pen. */}
      <path
        d="
          M 5 46
          C 6 43, 10 36, 14 27
          C 18 18, 23 9, 26 5
          C 27 3, 29 3, 30 5
          C 33 10, 38 22, 43 38
          C 45 44, 46 47, 47 49
        "
        fill="none"
        stroke="#FF791F"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* A crossbar */}
      <path
        d="M 15 31 C 20 30, 30 29, 38 30"
        fill="none"
        stroke="#FF791F"
        strokeWidth="3.4"
        strokeLinecap="round"
      />

      {/* ── Z ──
          A playful, slightly slanted Z.
          Top horizontal, diagonal slash, bottom horizontal — each
          starting from a slightly different x baseline for a hand-drawn feel. */}
      <path
        d="
          M 55 8
          C 62 7, 74 6, 82 7
          C 82 7, 63 27, 55 40
          C 55 40, 64 40, 75 41
          C 80 42, 84 42, 87 43
        "
        fill="none"
        stroke="#FF791F"
        strokeWidth="4.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* ── . (dot) ──
          A small filled circle — slightly below the natural baseline
          and offset to the right of the Z for breathing room. */}
      <circle cx="97" cy="45" r="4.5" fill="#FF791F" />
    </svg>
  );
}
