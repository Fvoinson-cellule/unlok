import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { GROUPS, RAMP, SESSION_MINUTES, TRIAL_PRICE, formatEuro, pricePerPerson } from "@/lib/pricing";

export const Route = createFileRoute("/cgv")({
  head: () => ({
    meta: [
      { title: "Conditions générales de vente · Unlok" },
      {
        name: "description",
        content: "CGV Unlok, coaching basket individualisé. Saison 2026-2027.",
      },
      { property: "og:title", content: "CGV · Unlok" },
      {
        property: "og:description",
        content: "Conditions générales de vente des séances, cartes de coaching basket et Book RAMP Unlok.",
      },
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
          Version du 9 novembre 2026, saison 2026-2027.
        </p>

        <div className="mt-10 space-y-8 text-sm text-muted-foreground">
          <section>
            <h2 className="font-display text-xl tracking-tight text-foreground">1. Qui sommes-nous</h2>
            <p className="mt-2">
              Les prestations Unlok sont proposées par <strong className="text-foreground">Florian Voinson, entrepreneur individuel (EI)</strong>,
              sous le régime de la micro-entreprise, SIRET 752 888 511 00041, domicilié 211 le
              Limbach, 68910 Labaroche.
            </p>
            <p className="mt-2">
              Contact :{" "}
              <a href="mailto:unlok.basketball@gmail.com" className="text-primary hover:underline">unlok.basketball@gmail.com</a>{" "}
              06 89 18 04 09.
            </p>
            <p className="mt-2">
              Diplômes : BPJEPS, DETB. Carte professionnelle d'éducateur sportif n° 03825ED0066.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl tracking-tight text-foreground">2. Objet</h2>
            <p className="mt-2">
              Les présentes conditions régissent la vente de séances de coaching de basketball
              individualisé, en individuel, en duo ou en petit groupe de 3 à 4 joueurs, destinées aux joueurs et joueuses,
              jeunes et adultes, en complément de l'entraînement en club, ainsi que du Book RAMP numérique. Toute commande
              implique l'acceptation sans réserve des présentes conditions.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl tracking-tight text-foreground">3. Réservation</h2>
            <p className="mt-2">
              La réservation et le paiement sont effectués par le joueur lui-même ou, pour les
              mineurs, par l'un de ses représentants légaux, qui déclare agir avec l'accord de
              l'autre représentant légal.
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
                    <td className="px-4 py-3 text-foreground">Séance d'essai</td>
                    <td className="px-4 py-3">{formatEuro(TRIAL_PRICE)} / personne</td>
                    <td className="px-4 py-3">Une seule séance d'essai par joueur, sans engagement. Possible seul ou à 2, 3 ou 4.</td>
                  </tr>
                  {GROUPS.map((group) => (
                    ["seance", "carte5", "carte10"] as const
                  ).map((formule) => (
                    <tr key={`${group.key}-${formule}`}>
                      <td className="px-4 py-3 text-foreground">
                        {formule === "seance" ? "Séance" : formule === "carte5" ? "Carte 5 séances" : "Carte 10 séances"} · {group.label} ({group.people})
                      </td>
                      <td className="px-4 py-3">{formatEuro(pricePerPerson(formule, group.key === "solo" ? 1 : group.key === "duo" ? 2 : 3))} / personne</td>
                      <td className="px-4 py-3">
                        {formule === "seance" ? "Sans engagement." : "Valable 5 mois à compter de l'achat, selon les places disponibles."}
                      </td>
                    </tr>
                  )))}
                  <tr>
                    <td className="px-4 py-3 text-foreground">Book RAMP numérique</td>
                    <td className="px-4 py-3">{RAMP.launchPrice} jusqu'au 31/12/2026 inclus, puis {RAMP.regularPrice}</td>
                    <td className="px-4 py-3">Achat unique, téléchargement après paiement.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3">
              Chaque séance de coaching dure {SESSION_MINUTES} minutes. La carte 5 bénéficie d'une remise de 2 € par séance,
              la carte 10 d'une remise de 5 € par séance, par rapport au prix à la séance du format choisi.
              Il n'y a pas d'abonnement ni de prélèvement récurrent. Le payeur peut régler sa place ou celles de plusieurs joueurs ;
              le montant total correspond au tarif par personne multiplié par le nombre de personnes payées.
            </p>
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
              (selon les moyens de paiement proposés au moment de l'achat). Unlok
              n'a jamais accès à vos données bancaires.
            </p>
            <p className="mt-2">
              Le montant total est affiché avant validation et payé en une seule fois à la commande.
              Une facture est émise pour chaque paiement.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl tracking-tight text-foreground">6. Organisation des séances et accès au Book RAMP</h2>
            <p className="mt-2">
              Après l'achat d'une séance ou d'une carte, Florian contacte le payeur pour convenir
              des dates et du lieu, selon les disponibilités. Si la séance est déjà convenue,
              le paiement confirme l'achat de la formule choisie. Les cartes sont nominatives et sans renouvellement automatique.
            </p>
            <p className="mt-2">
              Le Book RAMP est fourni au format PDF. Le lien de téléchargement est disponible
              après confirmation du paiement.
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
            <p className="mt-2">
              Pour le Book RAMP, l'accès immédiat au PDF nécessite votre accord exprès pour la fourniture
              du contenu numérique avant la fin du délai de 14 jours et votre renonciation expresse au droit
              de rétractation. Ces accords sont recueillis avant le paiement. Une fois la fourniture commencée
              avec ces accords, le droit de rétractation ne s'applique plus (article L221-28, 13°).
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
              Unlok a souscrit une assurance responsabilité civile professionnelle auprès de Hiscox,
              contrat n° RCPH278655510 géré par Orus France SAS. La couverture prend effet le
              5 octobre 2026 et reste valable jusqu'au 4 octobre 2027, sous réserve du paiement de la
              cotisation et des conditions du contrat. Elle s'applique dans le monde entier, hors
              États-Unis et Canada, dans les limites et exclusions prévues au contrat.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl tracking-tight text-foreground">10. Droit à l'image et données personnelles</h2>
            <p className="mt-2">
              Aucune photo ni vidéo du joueur n'est prise sans le <strong className="text-foreground">consentement
              écrit des deux parents</strong>.
            </p>
            <p className="mt-2">
              Le responsable du traitement est Florian Voinson, EI. Les données collectées lors de
              la réservation (nom, adresse email, téléphone et créneau choisi) servent à traiter la
              demande, organiser les séances et assurer le suivi contractuel. Ce traitement repose
              sur les mesures précontractuelles demandées et sur l'exécution du contrat. Les données
              nécessaires à la réservation sont conservées pendant la relation contractuelle, puis
              archivées uniquement pendant les durées imposées par la loi. Les factures et pièces
              comptables sont conservées dix ans. Les données sont accessibles à Unlok et, dans la
              limite nécessaire à leurs missions, à ses prestataires techniques et de paiement.
              Vous pouvez demander l'accès, la rectification, l'effacement ou la limitation de vos
              données et, lorsque la loi le prévoit, vous opposer à leur traitement ou exercer votre
              droit à la portabilité, en écrivant à{" "}
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
              En cas de litige, contactez d'abord Unlok par email. À défaut d'accord amiable, le
              consommateur pourra saisir gratuitement le médiateur de la consommation désigné par
              Unlok. Cette désignation est en cours. Ses coordonnées et l'adresse de son site
              internet seront publiées ici dès la prise d'effet de la convention.
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
