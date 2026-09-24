import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/cgv")({
  head: () => ({
    meta: [
      { title: "Conditions générales de vente — Unlok" },
      {
        name: "description",
        content: "CGV Unlok — coaching basket individualisé. Saison 2026-2027.",
      },
      { property: "og:title", content: "CGV — Unlok" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CGV,
});

function CGV() {
  return (
    <div className="min-h-screen bg-background text-foreground font-body antialiased">
      <SiteNav />
      <article className="mx-auto max-w-3xl px-6 py-16">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← Retour à l'accueil
        </Link>
        <h1 className="mt-6 font-display text-4xl tracking-tight">Conditions générales de vente</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Version du 23 septembre 2026 — saison 2026-2027.
        </p>

        <div className="mt-10 space-y-8 text-sm text-muted-foreground">
          <section>
            <h2 className="font-display text-xl tracking-tight text-foreground">1. Qui sommes-nous</h2>
            <p className="mt-2">
              Les prestations Unlok sont proposées par <strong className="text-foreground">Florian Voinson</strong>,
              entrepreneur individuel (micro-entreprise), SIRET 752 888 511 00041, domicilié 211 le
              Limbach, 68910 Labaroche.
            </p>
            <p className="mt-2">
              Contact :{" "}
              <a href="mailto:unlok.basketball@gmail.com" className="text-primary hover:underline">unlok.basketball@gmail.com</a>{" "}
              — 06 89 18 04 09.
            </p>
            <p className="mt-2">
              Diplômes : BPJEPS, DETB. Carte professionnelle d'éducateur sportif n° 03825ED0066.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl tracking-tight text-foreground">2. Objet</h2>
            <p className="mt-2">
              Les présentes conditions régissent la vente de séances de coaching de basketball
              individualisé en petit groupe (6 joueurs maximum), destinées principalement aux
              joueurs de U13 à U18, en complément de l'entraînement en club. Toute réservation
              implique l'acceptation sans réserve des présentes conditions.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl tracking-tight text-foreground">3. Réservation par un représentant légal</h2>
            <p className="mt-2">
              Le joueur étant généralement mineur, la réservation et le paiement sont effectués par
              l'un de ses représentants légaux, qui déclare agir avec l'accord de l'autre
              représentant légal.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl tracking-tight text-foreground">4. Formules et tarifs</h2>
            <div className="mt-3 overflow-x-auto rounded-2xl ring-1 ring-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-3 text-left font-medium">Formule</th>
                    <th className="px-4 py-3 text-left font-medium">Prix</th>
                    <th className="px-4 py-3 text-left font-medium">Conditions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-3 text-foreground">Séance découverte</td>
                    <td className="px-4 py-3">15 €</td>
                    <td className="px-4 py-3">Séance unique, sans engagement.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-foreground">Carte 5 séances</td>
                    <td className="px-4 py-3">250 €</td>
                    <td className="px-4 py-3">Valable 5 mois à compter de l'achat, sans créneau fixe, selon les places disponibles.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-foreground">Carte 10 séances</td>
                    <td className="px-4 py-3">400 €</td>
                    <td className="px-4 py-3">Valable 5 mois à compter de l'achat, sans créneau fixe, selon les places disponibles.</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-foreground">Abonnement mensuel</td>
                    <td className="px-4 py-3">100 €/mois (oct. 2026–mai 2027), 75 € en juin 2027</td>
                    <td className="px-4 py-3">Créneau hebdomadaire fixe réservé. Fin automatique le 30 juin 2027.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3">
              Les prix sont indiqués en euros, nets de taxe. TVA non applicable, article 293 B du
              Code général des impôts.
            </p>
            <p className="mt-2">
              Les séances non utilisées d'une carte à la fin de sa période de validité de 5 mois sont
              perdues et ne sont pas remboursées, <strong className="text-foreground">sauf certificat
              médical justifiant une inaptitude temporaire</strong> : dans ce cas, la validité de la
              carte est prolongée à raison d'une séance recréditée par mois d'inaptitude couvert par
              le certificat, dans la limite du nombre de séances restant sur la carte. Les cartes
              sont nominatives.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl tracking-tight text-foreground">5. Paiement</h2>
            <p className="mt-2">
              Le paiement se fait en ligne, par l'intermédiaire de la plateforme sécurisée Stripe
              (carte bancaire, Apple Pay, Google Pay ou prélèvement SEPA selon la formule). Unlok
              n'a jamais accès à vos données bancaires.
            </p>
            <p className="mt-2">
              Pour l'abonnement, le premier mois est payé à la réservation. Les mois suivants sont
              prélevés automatiquement à la même date chaque mois. L'abonnement se termine
              automatiquement après l'échéance de juin 2027. Une facture est émise pour chaque
              paiement.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl tracking-tight text-foreground">6. Résiliation de l'abonnement</h2>
            <p className="mt-2">
              L'abonnement est souscrit pour la durée de la saison, jusqu'au 30 juin 2027. Il ne
              peut être résilié de façon anticipée que pour un <strong className="text-foreground">motif
              légitime dûment justifié</strong> : blessure ou inaptitude médicale justifiée par
              certificat, déménagement rendant la poursuite des séances impossible, ou tout autre
              motif légitime équivalent dûment justifié. La demande de résiliation anticipée est
              adressée par email à{" "}
              <a href="mailto:unlok.basketball@gmail.com" className="text-primary hover:underline">unlok.basketball@gmail.com</a>,
              accompagnée du justificatif correspondant. En dehors de ces cas, les mensualités
              restant dues jusqu'à la fin de la saison restent exigibles.
            </p>
            <p className="mt-2">
              Les formules Carte 5 séances et Carte 10 séances n'impliquent aucun engagement dans
              la durée et restent une alternative pour qui préfère ne pas s'engager sur la saison.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl tracking-tight text-foreground">7. Droit de rétractation</h2>
            <p className="mt-2">
              Conformément à l'article L221-18 du Code de la consommation, vous disposez d'un délai
              de <strong className="text-foreground">14 jours</strong> à compter de la réservation
              pour vous rétracter, sans avoir à vous justifier, par email à{" "}
              <a href="mailto:unlok.basketball@gmail.com" className="text-primary hover:underline">unlok.basketball@gmail.com</a>.
            </p>
            <p className="mt-2">
              Si vous demandez expressément que les séances commencent avant la fin de ce délai, vous
              devrez payer les séances déjà effectuées au moment de la rétractation (article
              L221-25). Le reste vous sera remboursé sous 14 jours.
            </p>
            <p className="mt-2">
              Si vous souhaitez qu'une prestation soit <strong className="text-foreground">entièrement
              exécutée</strong> avant la fin du délai de rétractation, il vous sera demandé, au
              moment de la réservation, de renoncer expressément à votre droit de rétractation en
              plus de votre accord pour un démarrage anticipé : dans ce cas, une fois la prestation
              pleinement exécutée avec votre accord exprès et votre renonciation expresse, elle
              n'ouvre plus droit à rétractation (article L221-28, 1°).
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl tracking-tight text-foreground">8. Absences, annulations et rattrapages</h2>
            <ul className="mt-2 space-y-2">
              <li>
                <strong className="text-foreground">Absence du joueur :</strong> la séance est due
                et n'est ni remboursée ni reportée. Un rattrapage est possible sur présentation d'un
                certificat médical, selon les places disponibles.
              </li>
              <li>
                <strong className="text-foreground">Annulation par Unlok</strong> (indisponibilité
                du coach, de la salle ou autre imprévu) : la séance est rattrapée ou, à défaut,
                remboursée au prorata.
              </li>
              <li>
                Le coaching est maintenu pendant les vacances scolaires, sauf les jours fériés. La
                saison va du 5 octobre 2026 au 20 juin 2027.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl tracking-tight text-foreground">9. Santé, sécurité et assurance</h2>
            <p className="mt-2">
              Le représentant légal certifie que le joueur est apte à la pratique du basketball
              (licence en club en cours de validité ou certificat médical) et informe le coach de
              tout problème de santé utile. Le joueur doit être présent à l'heure et venir avec une
              tenue adaptée.
            </p>
            <p className="mt-2">
              Unlok est couvert par une assurance responsabilité civile professionnelle [souscription
              en cours — nom de l'assureur et n° de contrat à ajouter dès finalisation],
              conformément à l'article L321-7 du Code du sport.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl tracking-tight text-foreground">10. Droit à l'image et données personnelles</h2>
            <p className="mt-2">
              Aucune photo ni vidéo du joueur n'est prise sans le <strong className="text-foreground">consentement
              écrit des deux parents</strong>.
            </p>
            <p className="mt-2">
              Les données collectées (nom du parent et du joueur, catégorie, créneau, coordonnées)
              servent uniquement à organiser les séances et à établir les factures, sur la base de
              l'exécution du contrat qui vous lie à Unlok. Elles sont conservées le temps nécessaire
              à cette finalité, puis selon les durées légales de conservation applicables en matière
              comptable. Vous pouvez y accéder, les faire corriger ou supprimer en écrivant à{" "}
              <a href="mailto:unlok.basketball@gmail.com" className="text-primary hover:underline">unlok.basketball@gmail.com</a>.
              Vous disposez également du droit d'introduire une réclamation auprès de la CNIL ({" "}
              <a href="https://www.cnil.fr/" className="text-primary hover:underline">cnil.fr</a>) si
              vous estimez que vos droits ne sont pas respectés. Les paiements sont traités par
              Stripe, qui agit en tant que sous-traitant/prestataire de paiement.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl tracking-tight text-foreground">11. Médiation et litiges</h2>
            <p className="mt-2">
              En cas de litige, contactez d'abord Unlok par email. À défaut d'accord amiable, vous
              pouvez saisir gratuitement le médiateur de la consommation dont Unlok relève :{" "}
              <strong className="text-foreground">CM2C — Centre de la Médiation de la Consommation de
              Conciliateurs de Justice</strong>, 49 rue de Ponthieu, 75008 Paris,{" "}
              <a href="https://www.cm2c.net/" className="text-primary hover:underline">www.cm2c.net</a>.
            </p>
            <p className="mt-2">
              Les présentes conditions sont soumises au droit français.
            </p>
          </section>
        </div>
      </article>
      <SiteFooter />
    </div>
  );
}
