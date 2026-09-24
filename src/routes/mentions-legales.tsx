import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({
    meta: [
      { title: "Mentions légales — Unlok" },
      {
        name: "description",
        content: "Mentions légales du site Unlok — éditeur, hébergement, paiements, données personnelles.",
      },
      { property: "og:title", content: "Mentions légales — Unlok" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MentionsLegales,
});

function MentionsLegales() {
  return (
    <div className="min-h-screen bg-background text-foreground font-body antialiased">
      <SiteNav />
      <article className="mx-auto max-w-3xl px-6 py-16">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Retour à l'accueil
        </Link>
        <h1 className="mt-6 font-display text-4xl tracking-tight">Mentions légales</h1>

        <div className="mt-10 space-y-8 text-sm text-muted-foreground">
          <section>
            <h2 className="font-display text-xl tracking-tight text-foreground">1. Éditeur du site</h2>
            <p className="mt-2">
              Le site Unlok est édité par <strong className="text-foreground">Florian Voinson</strong>,
              entrepreneur individuel (micro-entreprise), exerçant une activité de coaching sportif
              individualisé.
            </p>
            <ul className="mt-3 space-y-1">
              <li>SIRET : 752 888 511 00041</li>
              <li>Adresse : 211 le Limbach, 68910 Labaroche, France</li>
              <li>
                Email :{" "}
                <a href="mailto:unlok.basketball@gmail.com" className="text-primary hover:underline">
                  unlok.basketball@gmail.com
                </a>
              </li>
              <li>Téléphone : 06 89 18 04 09</li>
              <li>Directeur de la publication : Florian Voinson</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl tracking-tight text-foreground">2. Hébergement</h2>
            <p className="mt-2">Le site est hébergé par :</p>
            <ul className="mt-3 space-y-1">
              <li>GitHub, Inc.</li>
              <li>88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis</li>
              <li>
                <a href="https://github.com/" className="text-primary hover:underline">github.com</a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl tracking-tight text-foreground">3. Paiements</h2>
            <p className="mt-2">Les paiements en ligne sont traités par :</p>
            <ul className="mt-3 space-y-1">
              <li>Stripe Payments Europe, Ltd.</li>
              <li>1 Wilton Park, Wilton Place, Dublin 2, D02 FX04, Irlande</li>
              <li>
                <a href="https://stripe.com/" className="text-primary hover:underline">stripe.com</a>
              </li>
            </ul>
            <p className="mt-3">
              Unlok ne stocke aucune donnée bancaire : ces informations sont saisies et traitées
              directement par Stripe.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl tracking-tight text-foreground">4. Données personnelles</h2>
            <p className="mt-2">
              Les modalités de collecte, d'utilisation et de conservation des données personnelles
              (y compris celles des mineurs et le droit à l'image) sont détaillées dans nos{" "}
              <Link to="/cgv" className="text-primary hover:underline">
                conditions générales de vente
              </Link>
              , article « Droit à l'image et données personnelles ».
            </p>
          </section>
        </div>
      </article>
      <SiteFooter />
    </div>
  );
}
