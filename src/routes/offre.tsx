import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { CoachingBooking } from "@/components/coaching-booking";
import { OCTOBER_PROMO } from "@/lib/coaching";

export const Route = createFileRoute("/offre")({
  head: () => ({
    meta: [
      { title: "Tarifs & formules · Unlok · Coaching basket individualisé" },
      {
        name: "description",
        content:
          "Les formules Unlok : séance découverte, abonnement mensuel, cartes de séances et coaching privé sur demande, seul ou entre amis. Saison 2026-2027, Alsace.",
      },
      { property: "og:title", content: "Tarifs & formules · Unlok" },
      {
        property: "og:description",
        content:
          "Séance découverte, abonnement mensuel, cartes de séances et coaching privé sur demande en Alsace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Offre,
});

const PLANS = [
  {
    label: "Sans engagement",
    name: "Séance découverte",
    price: "15€",
    unit: "/ séance unique",
    promo: "15€",
    desc: "Tarif permanent, un tarif préférentiel pour se faire une idée avant de choisir une formule.",
    cta: "Choisir un créneau",
    href: "#seance-decouverte",
    featured: false,
  },
  {
    label: "Créneau fixe",
    name: "Abonnement mensuel",
    price: "100€",
    unit: "/ mois",
    promo: "100€ / mois",
    desc: "Tarif fixe par mois, quel que soit le nombre de séances. Créneau hebdomadaire fixe réservé, maintenu toute l' année y compris pendant les vacances scolaires.",
    cta: "Choisir un créneau",
    href: "#seance-decouverte",
    featured: true,
  },
  {
    label: "Carte flexible",
    name: "5 séances",
    price: "250€",
    unit: "50€ / séance",
    promo: "150€",
    desc: "Séances utilisées au rythme du joueur. Aucun créneau fixe imposé. Carte valable 5 mois.",
    cta: "Réserver · 250€",
    href: "#seance-decouverte",
    featured: false,
  },
  {
    label: "Carte régulière",
    name: "10 séances",
    price: "400€",
    unit: "40€ / séance",
    promo: "250€",
    desc: "−20% par séance vs la carte 5. Toujours sans créneau fixe imposé. Carte valable 5 mois.",
    cta: "Réserver · 400€",
    href: "#seance-decouverte",
    featured: false,
  },
] as const;



const CALENDAR = [
  ["Octobre 2026", "5, 12, 19, 26", "6, 13, 20, 27", "7, 14, 21, 28"],
  ["Novembre 2026", "2, 9, 16, 23, 30", "3, 10, 17, 24", "4, 18, 25"],
  ["Décembre 2026", "7, 14, 21, 28", "1, 8, 15, 22, 29", "2, 9, 16, 23, 30"],
  ["Janvier 2027", "4, 11, 18, 25", "5, 12, 19, 26", "6, 13, 20, 27"],
  ["Février 2027", "1, 8, 15, 22", "2, 9, 16, 23", "3, 10, 17, 24"],
  ["Mars 2027", "1, 8, 15, 22", "2, 9, 16, 23, 30", "3, 10, 17, 24, 31"],
  ["Avril 2027", "5, 12, 19, 26", "6, 13, 20, 27", "7, 14, 21, 28"],
  ["Mai 2027", "3, 10, 24, 31", "4, 11, 18, 25", "5, 12, 19, 26"],
  ["Juin 2027", "7, 14", "1, 8, 15", "2, 9, 16"],
] as const;

function Offre() {
  const [promoActive, setPromoActive] = useState(false);
  useEffect(() => setPromoActive(new Date() < OCTOBER_PROMO.endsAt), []);
  return (
    <div className="min-h-screen bg-background text-foreground font-body antialiased selection:bg-primary/20">
      <SiteNav />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 -z-0"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.62 0.21 36 / 0.14), var(--color-background) 65%)",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-background/60 px-3 py-1 text-xs font-mono uppercase tracking-[0.15em] text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary" />
              Coaching basket · Jeunes & Adultes · Alsace
            </div>
            <h1 className="mt-6 font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.92] tracking-tight text-balance rise">
              Progresse sur le terrain,<br />
              <span className="text-primary">à ton rythme.</span>
            </h1>
            <p className="mt-6 max-w-[46ch] text-lg text-pretty text-muted-foreground rise" style={{ animationDelay: "0.1s" }}>
              Un coaching individuel en petit groupe (6 joueurs max), en complément du club, pour
              progresser sur ce qui fait vraiment la différence en match.
            </p>
            <div
              className="mt-8 flex flex-wrap items-center gap-4 rise"
              style={{ animationDelay: "0.2s" }}
            >
              <a
                href="#formules"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:-translate-y-0.5 hover:shadow-glow-lg"
              >
                Choisir ma formule
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PRINCIPLE */}
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="font-mono text-xs uppercase tracking-[0.15em] text-primary">Le principe</div>
          <h2 className="mt-4 font-display text-3xl tracking-tight text-balance">
            Un complément du club
          </h2>
          <p className="mt-4 text-muted-foreground text-pretty">
            Chaque créneau réunit 6 joueurs maximum, pour un vrai suivi individuel dans un cadre
            collectif. L'objectif : que ce qui est travaillé ici se voie ensuite en match avec ton
            équipe.
          </p>
        </div>
      </section>

      <div id="formules" className="scroll-mt-28" />
      <CoachingBooking />

      {/* PRIVATE COACHING */}
      <section
        id="coaching-prive"
        className="scroll-mt-20 border-b border-border bg-court text-court-foreground"
      >
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.15em] text-primary">
                Coaching privé · U13 à seniors
              </div>
              <h2 className="mt-4 font-display text-5xl tracking-tight text-balance md:text-6xl">
                Une séance construite autour de tes besoins.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-court-foreground/70 text-pretty">
                Réserve une séance individuelle ou viens avec tes amis, jusqu'à 6 personnes. Nous
                définissons ensemble l'objectif, la date et le lieu en Alsace.
              </p>
            </div>

            <div className="border-y border-court-foreground/20">
              {[
                ["1 à 2 personnes", "50 €", "par personne"],
                ["3 à 4 personnes", "40 €", "par personne"],
                ["5 à 6 personnes", "30 €", "par personne"],
              ].map(([group, price, unit], index) => (
                <div
                  key={group}
                  className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-center gap-4 border-b border-court-foreground/20 py-5 last:border-b-0 sm:grid-cols-[3rem_minmax(0,1fr)_auto]"
                >
                  <span className="font-mono text-xs text-primary">0{index + 1}</span>
                  <span className="font-display text-xl tracking-tight sm:text-2xl">{group}</span>
                  <span className="text-right">
                    <strong className="block font-display text-3xl text-primary sm:text-4xl">{price}</strong>
                    <span className="text-xs text-court-foreground/60">{unit}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-5 border-t border-court-foreground/20 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-2xl tracking-tight">Lieu à définir · Alsace</p>
              <p className="mt-1 text-sm text-court-foreground/60">
                Écris-moi pour échanger sur tes besoins et organiser la séance.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.instagram.com/unlok.basketball/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:-translate-y-0.5 hover:shadow-glow-lg"
              >
                Envoyer un DM
                <span>→</span>
              </a>
              <a
                href="mailto:unlok.basketball@gmail.com?subject=Demande%20de%20coaching%20priv%C3%A9"
                className="inline-flex items-center rounded-lg border border-court-foreground/30 px-5 py-3 text-sm font-semibold transition-colors hover:bg-court-foreground/10"
              >
                Écrire par email
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* TIME SLOTS */}
      <section className="border-b border-border bg-court text-court-foreground">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="max-w-2xl">
            <div className="font-mono text-xs uppercase tracking-[0.15em] text-primary">Créneaux</div>
            <h2 className="mt-4 font-display text-4xl tracking-tight text-balance">Tes créneaux.</h2>
            <p className="mt-4 text-court-foreground/70 text-pretty">
              3 créneaux ouverts pour commencer : lundi, mardi et mercredi, séances de 60 minutes,
              petits groupes de 6 joueurs maximum, 18 places au total par semaine. D'autres créneaux
              ouvriront dès que ceux-ci seront remplis.
            </p>

          </div>

          <p className="mt-6 text-sm text-court-foreground/60">
            6 places par créneau, partagées entre abonnés et séances d'essai. Inscription dans la
            section « Réserve ta place » ci-dessus.
          </p>
          <p className="mt-3 text-sm text-court-foreground/60">
            Premier mois payé à la réservation, puis 100€ prélevés chaque mois à la même date.
            Paiement par carte ou prélèvement SEPA. Le dernier mois, en juin, est ajusté au prorata
            des séances restantes.
          </p>

        </div>
      </section>

      {/* SEASON CALENDAR */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="max-w-2xl">
            <div className="font-mono text-xs uppercase tracking-[0.15em] text-primary">
              Calendrier des séances
            </div>
            <h2 className="mt-4 font-display text-4xl tracking-tight text-balance">
              5 oct. 2026 → 20 juin 2027.
            </h2>
            <p className="mt-4 text-muted-foreground text-pretty">
              Coaching maintenu toute l'année, y compris pendant les vacances scolaires (hors jours
              fériés). En cas d'absence, rattrapage possible sur présentation d'un certificat médical.
            </p>
          </div>

          <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
            <li>· Saison d'octobre à fin juin, environ 36 séances par créneau.</li>
            <li>· Séances maintenues pendant les vacances scolaires, hors jours fériés.</li>
            <li>· Rattrapage possible sur présentation d'un certificat médical.</li>
          </ul>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="border-b border-border bg-court text-court-foreground">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <h2 className="font-display text-4xl md:text-5xl tracking-tight text-balance">
            On se lance ?
          </h2>
          <p className="mt-4 text-court-foreground/70 max-w-xl mx-auto">
            Places limitées à 6 joueurs par créneau. Écris-nous pour réserver la séance découverte
            ou poser tes questions.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="https://instagram.com/unlok.basketball"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:-translate-y-0.5 hover:shadow-glow-lg"
            >
              Écrire sur Instagram
              <span>→</span>
            </a>
            <a
              href="mailto:unlok.basketball@gmail.com?subject=Inscription%20Unlok"
              className="inline-flex items-center gap-2 rounded-lg border border-court-foreground/30 px-6 py-3 text-sm font-semibold hover:bg-court-foreground/10 transition-colors"
            >
              Ou par email
            </a>
          </div>
          <div className="mt-8">
            <Link to="/" className="text-sm text-court-foreground/60 hover:text-court-foreground transition-colors">
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
