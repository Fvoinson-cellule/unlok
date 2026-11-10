import type { ReactNode, MouseEvent } from "react";

export function spotlightMove(e: MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export function CourtLines({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 400"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
      className={`court-lines ${className}`}
    >
      <line x1="-60" y1="300" x2="660" y2="40" />
      <line x1="-60" y1="390" x2="660" y2="130" />
      <line x1="-60" y1="210" x2="660" y2="-50" />
      <line className="thin" x1="120" y1="440" x2="720" y2="140" />
      <line className="thin" x1="-120" y1="440" x2="480" y2="140" />
    </svg>
  );
}

export function SpotlightCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div onMouseMove={spotlightMove} className={`spotlight ${className}`}>{children}</div>
  );
}
