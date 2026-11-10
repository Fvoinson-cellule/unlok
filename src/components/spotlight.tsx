import type { ReactNode, MouseEvent } from "react";

export function spotlightMove(e: MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export function CourtLines({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 400" fill="none" aria-hidden="true" className={`court-lines ${className}`}>
      <rect x="10" y="10" width="580" height="380" />
      <line x1="300" y1="10" x2="300" y2="390" />
      <circle cx="300" cy="200" r="50" />
      <rect x="10" y="140" width="120" height="120" />
      <rect x="470" y="140" width="120" height="120" />
      <path d="M10 40 H50 A170 170 0 0 1 50 360 H10" />
      <path d="M590 40 H550 A170 170 0 0 0 550 360 H590" />
      <circle cx="130" cy="200" r="40" />
      <circle cx="470" cy="200" r="40" />
    </svg>
  );
}

export function SpotlightCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div onMouseMove={spotlightMove} className={`spotlight ${className}`}>{children}</div>
  );
}
