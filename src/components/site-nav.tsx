import { Link } from "@tanstack/react-router";
import logoUrl from "@/assets/unlok-logo.png";

const navBtn =
  "inline-flex items-center rounded-lg border border-primary bg-background px-4 py-2 text-foreground transition-all hover:-translate-y-0.5 hover:shadow-glow";

function InstagramIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" />
    </svg>
  );
}

function MailIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 leading-none text-foreground">
          <img
            src={logoUrl}
            alt="Unlok"
            className="h-9 w-9 rounded-full object-cover"
          />
          <span className="font-display text-2xl tracking-tight">
            UNLOK<span className="text-primary">.</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-3 text-sm font-medium">
          <Link to="/" hash="methode" className={navBtn}>Méthode</Link>
          <Link to="/" hash="seance" className={navBtn}>Séance</Link>
          <Link to="/" hash="preuves" className={navBtn}>Cadre</Link>
          <Link to="/offre" className={navBtn}>Tarifs</Link>
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="https://www.instagram.com/unlok.basketball/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram Unlok"
            className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-primary hover:border-primary border border-transparent transition-colors"
          >
            <InstagramIcon className="h-5 w-5" />
          </a>
          <a
            href="mailto:unlok.basketball@gmail.com"
            aria-label="Écrire à Unlok"
            className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:text-primary hover:border-primary border border-transparent transition-colors"
          >
            <MailIcon className="h-5 w-5" />
          </a>
          <Link
            to="/offre"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:-translate-y-0.5 hover:shadow-glow-lg"
          >
            Réserver
            <span className="text-xs">→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
