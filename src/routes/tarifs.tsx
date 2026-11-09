import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { OrderForm } from "@/components/order-form";
import { GROUPS, TRIAL_PRICE, formatEuro, pricePerPerson } from "@/lib/pricing";

export const Route = createFileRoute("/tarifs")({
  head: () => ({
    meta: [
      { title: "Tarifs & inscription · Unlok · Coaching basket Alsace" },
      { name: "description", content: "Séances de 60 minutes en individuel, duo ou petit groupe. Séance d'essai 25 €, cartes 5 et 10 séances. Inscription et paiement en ligne." },
      { property: "og:title", content: "Tarifs & inscription · Unlok" },
      { property: "og:description", content: "Séance d'essai 25 €, séances de 60 minutes, cartes 5 et 10 séances." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Tarifs,
});

function Tarifs() {
  return (
    <div className="min-h-screen bg-background text-foreground font-body antialiased selection:bg-primary/20">
      <SiteNav />

      <section className="relative overflow-hidden border-b border-border">
        <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-16">
          <div className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            Séances de 60 minutes · Sans abonnement
          </div>
          <h1 className="mt-6 font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.92] tracking-tight text-balance rise">
            Tarifs &<br />
            <span className="text-primary">inscription.</span>
          </h1>
          <p className="mt-6 max-w-[52ch] text-lg text-muted-foreground text-pretty">
            Chaque séance dure 60 minutes. Seul, en duo ou en petit groupe : plus vous êtes, plus le
            prix par personne baisse. Les cartes font encore baisser le prix de chaque séance.
          </p>
        </div>
      </section>

      {/* ESSAI */}
      <section className="border-b border-border bg-secondary/40">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-12 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.15em] text-primary">Pour commencer</div>
            <h2 className="mt-2 font-display text-3xl tracking-tight">Séance d'essai · 60 min</h2>
            <p className="mt-1 text-sm text-muted-foreground">Une fois par joueur, pour découvrir la méthode.</p>
          </div>
          <div className="font-display text-5xl text-primary">
            {formatEuro(TRIAL_PRICE)}
            <span className="ml-2 text-base text-muted-foreground">/ pers.</span>
          </div>
        </div>
      </section>

      {/* GRILLE */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="font-mono text-xs uppercase tracking-[0.15em] text-primary">Coaching terrain</div>
          <h2 className="mt-4 font-display text-4xl tracking-tight">La grille.</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {GROUPS.map((g, i) => {
              const people = i + 1 === 3 ? 3 : i + 1;
              return (
                <div key={g.key} className="rounded-2xl bg-glass p-6 ring-1 ring-white/10">
                  <div className="font-mono text-xs text-primary">{g.people}</div>
                  <h3 className="mt-2 font-display text-3xl tracking-tight">{g.label}</h3>
                  <dl className="mt-6 divide-y divide-border text-sm">
                    {([
                      ["La séance", "seance", 1],
                      ["Carte 5 séances", "carte5", 5],
                      ["Carte 10 séances", "carte10", 10],
                    ] as const).map(([label, f, n]) => {
                      const price = pricePerPerson(f, people);
                      return (
                        <div key={f} className="flex items-baseline justify-between py-3">
                          <dt className="text-muted-foreground">{label}</dt>
                          <dd className="text-right">
                            <span className="font-display text-2xl">{formatEuro(price)}</span>
                            {n > 1 && <span className="block text-xs text-muted-foreground">soit {formatEuro(price / n)} / séance</span>}
                          </dd>
                        </div>
                      );
                    })}
                  </dl>
                  {i > 0 && <p className="mt-3 text-xs text-muted-foreground">Prix par personne.</p>}
                </div>
              );
            })}
          </div>
          <ul className="mt-8 space-y-2 text-sm text-muted-foreground">
            <li>· Toutes les séances durent 60 minutes.</li>
            <li>· Carte 5 : 2 € de moins par séance. Carte 10 : 5 € de moins par séance.</li>
            <li>· Cartes valables 5 mois. Date et lieu fixés ensemble après l'inscription.</li>
          </ul>
        </div>
      </section>

      {/* INSCRIPTION */}
      <section id="inscription" className="scroll-mt-20 border-b border-border">
        <div className="mx-auto max-w-2xl px-6 py-20">
          <div className="font-mono text-xs uppercase tracking-[0.15em] text-primary">Inscription</div>
          <h2 className="mt-4 mb-10 font-display text-4xl tracking-tight">Je m'inscris.</h2>
          <OrderForm />
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
