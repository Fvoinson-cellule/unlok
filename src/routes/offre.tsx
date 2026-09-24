import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/offre")({
  head: () => ({
    meta: [
      { title: "Tarifs & formules — Unlok · Coaching basket individualisé" },
      {
        name: "description",
        content:
          "Les formules Unlok : séance découverte 15€, abonnement mensuel 100€, carte 5 séances 250€, carte 10 séances 400€. Saison 2026-2027, Alsace.",
      },
      { property: "og:title", content: "Tarifs & formules — Unlok" },
      {
        property: "og:description",
        content:
          "Quatre formules pour commencer : séance découverte, abonnement mensuel, cartes de séances. Paiement sécurisé via Stripe.",
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
    desc: "Tarif permanent, un tarif préferentiel pour se faire une idée avant de choisir une formule.",
    cta: "Réserver — 15€",
    href: "https://buy.stripe.com/14AfZh3nB50l2f00hU6sw04",
    featured: false,
  },
  {
    label: "Créneau fixe",
    name: "Abonnement mensuel",
    price: "100€",
    unit: "/ mois",
    desc: "Tarif fixe par mois, quel que soit le nombre de séances. Créneau hebdomadaire fixe réservé, maintenu toute l' année y compris pendant les vacances scolaires.",
    cta: "Choisir un créneau",
    href: "#creneaux",
    featured: true,
  },
  {
    label: "Carte flexible",
    name: "5 séances",
    price: "250€",
    unit: "— 50€ / séance",
    desc: "Séances utilisées au rythme du joueur. Aucun créneau fixe imposé. Carte valable 5 mois.",
    cta: "Réserver — 250€",
    href: "https://buy.stripe.com/fZu14n5vJ78t9Hsd4G6sw01",
    featured: false,
  },
  {
    label: "Carte régulière",
    name: "10 séances",
    price: "400€",
    unit: "— 40€ / séance",
    desc: "−20% par séance vs la carte 5. Toujours sans créneau fixe imposé. Carte valable 5 mois.",
    cta: "Réserver — 400€",
    href: "https://buy.stripe.com/cNidR9gancsN1aWaWy6sw02",
    featured: false,
  },
] as const;

const SLOTS = [
  {
    day: "Lundi",
    location: "Cosec du collège de Kientzheim",
    time: "18h30 – 19h30",
    href: "https://buy.stripe.com/00w6oHf6jfEZbPA0hU6sw06",
  },
  {
    day: "Mardi",
    location: "Basket Center de Strasbourg",
    time: "Horaire à confirmer",
    href: "https://buy.stripe.com/cNi4gz4rFboJcTE6Gi6sw07",
  },
  {
    day: "Mercredi",
    location: "Basket Center de Strasbourg",
    time: "Horaire à confirmer",
    href: "https://buy.stripe.com/6oU00jf6j64p06S4ya6sw08",
  },
] as const;

const MONTHLY_TARIFF = [
  ["Octobre 2026", "100 €"],
  ["Novembre 2026", "100 €"],
  ["Décembre 2026", "100 €"],
  ["Janvier 2027", "100 €"],
  ["Février 2027", "100 €"],
  ["Mars 2027", "100 €"],
  ["Avril 2027", "100 €"],
  ["Mai 2027", "100 €"],
  ["Juin 2027", "75 €"],
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
              Coaching basket · U13 / U18 · Alsace
            </div>
            <h1 className="mt-6 font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.92] tracking-tight text-balance rise">
              Progresse sur le terrain,<br />
              <span className="text-primary">à ton rythme.</span>
            </h1>
            <p className="mt-6 max-w-[46ch] text-lg text-pretty text-muted-foreground rise" style={{ animationDelay: "0.1s" }}>
              Un coaching individuel en petit groupe (6 joueurs max), en complément du club, pour
              progresser sur ce qui fait vraiment la différence en match.
            </p>
            <div className="mt-8 rise" style={{ animationDelay: "0.2s" }}>
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

      {/* PRICING CARDS */}
      <section id="formules" className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="max-w-2xl">
            <div className="font-mono text-xs uppercase tracking-[0.15em] text-primary">Tarifs</div>
            <h2 className="mt-4 font-display text-4xl tracking-tight text-balance">
              Choisis la formule qui te correspond.
            </h2>
            <p className="mt-4 text-muted-foreground text-pretty">
              Une séance découverte pour tester, deux cartes ponctuelles pour suivre à ton rythme,
              un abonnement pour un vrai rendez-vous hebdomadaire sur la saison.
            </p>
          </div>

          {/* BANNIÈRE DÉCOUVERTE — horizontale, au-dessus des formules */}
          <div className="mt-12 flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-border border-l-4 border-l-primary bg-glass backdrop-blur-md p-6 sm:p-7">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-primary">{PLANS[0].label}</span>
              <span className="font-display text-2xl tracking-tight">{PLANS[0].name}</span>
              <span className="font-display text-2xl font-extrabold text-primary">
                {PLANS[0].price}
                <span className="font-body text-xs font-medium text-muted-foreground">{PLANS[0].unit}</span>
              </span>
            </div>
            <a
              href={PLANS[0].href}
              className="inline-flex shrink-0 justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:-translate-y-0.5 hover:shadow-glow-lg w-full sm:w-auto"
            >
              {PLANS[0].cta}
            </a>
            <p className="w-full text-sm text-muted-foreground">{PLANS[0].desc}</p>
          </div>

          {/* 3 FORMULES — verticales, côte à côte */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLANS.slice(1).map((plan) => (
              <div
                key={plan.name}
                className={
                  "flex flex-col rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1 " +
                  (plan.featured
                    ? "bg-secondary text-foreground ring-1 ring-primary"
                    : "bg-glass backdrop-blur-md ring-1 ring-white/10")
                }
              >
                <div className="font-mono text-xs uppercase tracking-[0.14em] text-primary">{plan.label}</div>
                <h3 className="mt-2 font-display text-xl tracking-tight">{plan.name}</h3>
                <div className="mt-3 font-display text-4xl font-extrabold text-primary">
                  {plan.price}
                  <span className="text-base font-medium text-muted-foreground">{plan.unit}</span>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">{plan.desc}</p>
                <a
                  href={plan.href}
                  className="mt-6 inline-flex w-full justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:-translate-y-0.5 hover:shadow-glow-lg"
                >
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>

          <p className="mt-8 text-xs text-muted-foreground">
            En réservant, tu acceptes nos{" "}
            <Link to="/cgv" className="underline hover:text-foreground">conditions générales de vente</Link>.
            {" "}Paiement sécurisé par Stripe. Prix nets — TVA non applicable, art. 293 B du CGI.
          </p>
        </div>
      </section>

      {/* TIME SLOTS */}
      <section id="creneaux" className="border-b border-border bg-court text-court-foreground">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="max-w-2xl">
            <div className="font-mono text-xs uppercase tracking-[0.15em] text-primary">Créneaux</div>
            <h2 className="mt-4 font-display text-4xl tracking-tight text-balance">Tes créneaux.</h2>
            <p className="mt-4 text-court-foreground/70 text-pretty">
              3 créneaux ouverts pour commencer : lundi, mardi et mercredi — séances de 60 minutes,
              petits groupes de 6 joueurs maximum, 18 places au total par semaine. D'autres créneaux
              ouvriront dès que ceux-ci seront remplis.
            </p>

          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            {SLOTS.map((slot) => (
              <div key={slot.day} className="rounded-2xl bg-court-foreground/5 ring-1 ring-court-foreground/10 p-6">
                <div className="font-mono text-xs text-court-foreground/60">{slot.day}</div>
                <div className="mt-2 font-display text-2xl tracking-tight">{slot.time}</div>
                <p className="mt-2 text-sm text-court-foreground/70">{slot.location}</p>
                <a
                  href={slot.href}
                  className="mt-4 inline-flex w-full justify-center rounded-lg border border-court-foreground/30 px-4 py-2 text-sm font-semibold hover:bg-court-foreground/10 transition-colors"
                >
                  Réserver ce créneau
                </a>
              </div>
            ))}
          </div>

          <p className="mt-6 text-sm text-court-foreground/60">
            6 places par créneau. Si le paiement indique que le lien est désactivé, le créneau est
            complet : écris-nous pour la liste d'attente.
          </p>
          <p className="mt-3 text-sm text-court-foreground/60">
            Premier mois payé à la réservation : 100€/mois d'octobre à mai, 75€ en juin. Paiement
            par carte ou prélèvement SEPA. Arrêt automatique fin juin 2027.
          </p>

          {/* MONTHLY TARIFF TABLE */}
          <div className="mt-16">
            <div className="flex items-end justify-between flex-wrap gap-4">
              <div>
                <div className="font-mono text-xs uppercase tracking-[0.15em] text-court-foreground/60">
                  Abonnement mensuel — ce que tu payes chaque mois
                </div>
                <h3 className="mt-2 font-display text-3xl tracking-tight">Un tarif fixe par mois.</h3>
              </div>
              <div className="text-right">
                <div className="font-mono text-xs text-court-foreground/60">Total saison</div>
                <div className="font-display text-3xl tracking-tight">875 €</div>
              </div>
            </div>
            <div className="mt-6 overflow-hidden rounded-2xl ring-1 ring-court-foreground/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-court-foreground/10 text-court-foreground/60 font-mono text-xs uppercase tracking-wider">
                    <th className="px-4 py-3 text-left font-medium">Mois</th>
                    <th className="px-4 py-3 text-right font-medium">Tarif</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-court-foreground/10">
                  {MONTHLY_TARIFF.map(([month, price]) => (
                    <tr key={month}>
                      <td className="px-4 py-3">{month}</td>
                      <td className="px-4 py-3 text-right font-mono">{price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-court-foreground/60">
              Juin est un mois plus creux (moins de semaines de cours) — d'où le tarif réduit.
            </p>
          </div>
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

          <div className="mt-8 overflow-x-auto rounded-2xl ring-1 ring-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-3 text-left font-medium">Mois</th>
                  <th className="px-4 py-3 text-left font-medium">Lundi</th>
                  <th className="px-4 py-3 text-left font-medium">Mardi</th>
                  <th className="px-4 py-3 text-left font-medium">Mercredi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {CALENDAR.map(([month, mon, tue, wed]) => (
                  <tr key={month}>
                    <td className="px-4 py-3 font-medium text-foreground">{month}</td>
                    <td className="px-4 py-3 text-muted-foreground font-mono">{mon}</td>
                    <td className="px-4 py-3 text-muted-foreground font-mono">{tue}</td>
                    <td className="px-4 py-3 text-muted-foreground font-mono">{wed}</td>
                  </tr>
                ))}
                <tr className="bg-secondary/40 font-medium">
                  <td className="px-4 py-3 text-foreground">Total saison</td>
                  <td className="px-4 py-3 font-mono text-foreground">35</td>
                  <td className="px-4 py-3 font-mono text-foreground">37</td>
                  <td className="px-4 py-3 font-mono text-foreground">36</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-muted-foreground text-pretty">
            Aucune séance n'est annulée pendant les vacances scolaires — seuls les jours fériés sont
            retirés du calendrier (11 novembre, lundi de Pâques, Ascension, lundi de Pentecôte). Un
            2ᵉ créneau le mercredi et un créneau le jeudi ouvriront dès que les 3 créneaux ci-dessus
            seront complets.
          </p>
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
