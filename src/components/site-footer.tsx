import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <Link to="/" className="font-display text-3xl tracking-tight text-foreground">
              UNLOK<span className="text-primary">.</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-[30ch]">
              Coaching individuel de basketball pour les jeunes joueurs d'Alsace.
            </p>
          </div>
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.15em] text-primary">Contact</div>
            <div className="mt-4 space-y-1 text-sm">
              <p className="font-medium text-foreground">Florian Voinson</p>
              <p className="text-muted-foreground">06 89 18 04 09</p>
              <p className="text-muted-foreground">unlok.basketball@gmail.com</p>
              <a href="https://instagram.com/unlok.basketball" className="text-muted-foreground hover:text-foreground transition-colors">
                @unlok.basketball
              </a>
              <p className="text-muted-foreground">Alsace, France</p>
            </div>
          </div>
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.15em] text-primary">Mentions</div>
            <div className="mt-4 space-y-1 text-sm text-muted-foreground">
              <Link to="/mentions-legales" className="block hover:text-foreground transition-colors">Mentions légales</Link>
              <Link to="/cgv" className="block hover:text-foreground transition-colors">CGV</Link>
              <a href="https://billing.stripe.com/p/login/bJe9AT7DRcsNaLw0hU6sw00" className="block hover:text-foreground transition-colors">Gérer mon abonnement</a>
              <p>Micro-entreprise · RGPD</p>
              <p>Consentement parental</p>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-border text-xs text-muted-foreground flex flex-wrap gap-4">
          <span>© 2026 Unlok</span>
          <span>BPJEPS · DETB</span>
          <span>U13–U18</span>
          <span>Coaching basket individualisé</span>
        </div>
      </div>
    </footer>
  );
}
