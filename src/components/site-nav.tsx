import { Link } from "@tanstack/react-router";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl tracking-tight leading-none text-foreground">
          UNLOK<span className="text-primary">.</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="/#methode" className="text-muted-foreground hover:text-foreground transition-colors">Méthode</a>
          <a href="/#seance" className="text-muted-foreground hover:text-foreground transition-colors">Séance</a>
          <a href="/#preuves" className="text-muted-foreground hover:text-foreground transition-colors">Cadre</a>
          <Link to="/offre" className="text-muted-foreground hover:text-foreground transition-colors">Tarifs</Link>
        </nav>
        <Link
          to="/offre"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:-translate-y-0.5 hover:shadow-glow-lg"
        >
          Réserver
          <span className="text-xs">→</span>
        </Link>
      </div>
    </header>
  );
}
