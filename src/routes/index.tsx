import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import portrait from "@/assets/florian-portrait.png";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Unlok · Coaching basket individualisé · Alsace" },
      {
        name: "description",
        content:
          "Unlok : coaching de basketball individualisé pour joueurs et joueuses, jeunes et adultes, en Alsace. Méthode par contraintes, séances de 60 minutes, en complément du club.",
      },
      { property: "og:title", content: "Unlok · Coaching basket individualisé" },
      {
        property: "og:description",
        content:
          "Coaching de basketball individualisé en Alsace, pour jeunes et adultes. Réagir plus vite, faire le bon choix, ancrer durablement.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground font-body antialiased selection:bg-primary/20">
      <SiteNav />

      {/* HERO — présentation du coach */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          className="pointer-events-none absolute inset-0 -z-0"
          style={{
            background:
              "radial-gradient(70% 55% at 78% 30%, oklch(0.62 0.21 36 / 0.16), transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-6 pt-14 pb-16 md:pt-20 md:pb-24">
          <div className="grid items-center gap-12 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:gap-16">
            {/* Colonne texte */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-background/60 px-3 py-1 text-xs font-mono uppercase tracking-[0.15em] text-muted-foreground">
                <span className="size-1.5 rounded-full bg-primary" />
                Coaching individuel · Alsace
              </div>

              <h1 className="mt-6 font-display text-[clamp(2.6rem,6.4vw,4.75rem)] leading-[0.95] tracking-tight text-balance rise">
                Du geste répété<br />
                <span className="text-primary">au geste décisif</span><br />
                en match.
              </h1>

              <div
                className="mt-7 max-w-[52ch] space-y-4 text-[15px] leading-7 text-muted-foreground text-pretty rise"
                style={{ animationDelay: "0.1s" }}
              >
                <p>
                  <span className="font-medium text-foreground">Je m'appelle Florian Voinson.</span>{" "}
                  J'entraîne depuis mes 17 ans, des U5 jusqu'au niveau NF3. Après des milliers
                  d'heures passées dans les gymnases, un constat s'est imposé : techniquement, les
                  joueurs savent tout faire à l'entraînement, dans la répétition sans opposition.
                  Mais en match, ils n'arrivent pas à le transférer.
                </p>
                <p>
                  Prenons l'exemple des finitions : à l'entraînement, ils maîtrisent une variété
                  infinie de gestes. En match, sous pression, 90 % finissent par un simple lay-up
                  prévisible. C'est précisément pour réduire cet écart entre le geste répété à
                  l'entraînement et la décision en match que j'ai créé{" "}
                  <span className="font-medium text-foreground">UNLOK</span>.
                </p>
              </div>

              <div
                className="mt-9 flex flex-wrap items-center gap-3 rise"
                style={{ animationDelay: "0.2s" }}
              >
                <Link
                  to="/tarifs"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:-translate-y-0.5 hover:shadow-glow-lg"
                >
                  Séance d'essai · 60 min · 25 €
                  <span>→</span>
                </Link>
                <Link
                  to="/methode"
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
                >
                  Découvrir la méthode
                </Link>
              </div>
            </div>

            {/* Colonne portrait */}
            <div
              className="portrait-halo relative mx-auto flex w-full max-w-sm justify-center rise md:max-w-none"
              style={{ animationDelay: "0.15s" }}
            >
              <img
                src={portrait}
                alt="Florian Voinson, coach de basket Unlok"
                className="portrait-fade relative w-full max-w-[26rem] object-contain"
                loading="eager"
              />
            </div>
          </div>

          {/* Repères */}
          <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
            {[
              { k: "Expérience", v: "U5 → NF3" },
              { k: "Diplômes d'État", v: "BPJEPS · DETB" },
              { k: "Durée d'une séance", v: "60 min" },
              { k: "Format", v: "1 à 4 joueurs" },
            ].map((item) => (
              <div key={item.k} className="bg-background px-5 py-6">
                <dt className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                  {item.k}
                </dt>
                <dd className="mt-2 font-display text-2xl tracking-tight">{item.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>


      {/* LA PROMESSE */}
      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <div className="font-mono text-xs uppercase tracking-[0.15em] text-primary">La promesse</div>
          <p className="mt-6 font-display text-2xl sm:text-3xl leading-snug tracking-tight text-balance text-foreground">
            Le joueur s'entraîne à faire les bons choix dans les moments de pression, sur ses
            situations à lui, en petit groupe. À force de les revivre à l'entraînement, il les
            aborde en match avec plus de lucidité et d'aisance.
          </p>
        </div>
      </section>

      {/* LES UNIVERS */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="max-w-2xl">
            <div className="font-mono text-xs uppercase tracking-[0.15em] text-primary">L'univers Unlok</div>
            <h2 className="mt-4 font-display text-4xl md:text-5xl tracking-tight text-balance">Trois façons de progresser.</h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { tag: "Terrain", title: "Coaching basket", text: "Séances de 60 minutes, seul, en duo ou en petit groupe. Séance d'essai à 25 €.", to: "/tarifs" as const, cta: "Voir les tarifs" },
              { tag: "Book", title: "40 échauffements RAMP", text: "Des échauffements prêts à l'emploi pour préparer le corps et la tête au jeu.", to: "/ramp" as const, cta: "Découvrir le book" },
              { tag: "Clubs", title: "Le guide des clubs", text: "10 choses à mettre en place dans son club. Gratuit, reçu par email.", to: "/clubs" as const, cta: "Recevoir le guide" },
            ].map((u) => (
              <Link key={u.tag} to={u.to} className="group flex flex-col rounded-2xl bg-glass p-6 ring-1 ring-white/10 backdrop-blur-md transition-all hover:-translate-y-1 hover:ring-primary">
                <div className="font-mono text-xs text-primary">{u.tag}</div>
                <h3 className="mt-3 font-display text-2xl tracking-tight">{u.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{u.text}</p>
                <span className="mt-6 text-sm font-semibold group-hover:text-primary">{u.cta} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>


      {/* CREDENTIALS STRIP */}
      <section id="preuves" className="bg-court text-court-foreground border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            <div>
              <div className="font-mono text-xs text-court-foreground/60">Diplômes</div>
              <div className="mt-2 font-display text-xl tracking-tight">BPJEPS · DETB</div>
            </div>
            <div>
              <div className="font-mono text-xs text-court-foreground/60">En formation</div>
              <div className="mt-2 font-display text-xl tracking-tight">Prépa mentale</div>
            </div>
            <div>
              <div className="font-mono text-xs text-court-foreground/60">Effectif</div>
              <div className="mt-2 font-display text-xl tracking-tight">1 à 4 joueurs</div>
            </div>
            <div>
              <div className="font-mono text-xs text-court-foreground/60">Public</div>
              <div className="mt-2 font-display text-xl tracking-tight">Jeunes & Adultes</div>
            </div>
            <div>
              <div className="font-mono text-xs text-court-foreground/60">Statut</div>
              <div className="mt-2 font-display text-xl tracking-tight">Micro-entreprise</div>
            </div>
            <div>
              <div className="font-mono text-xs text-court-foreground/60">Mineurs · RGPD</div>
              <div className="mt-2 font-display text-xl tracking-tight">Consentement écrit</div>
              <p className="text-xs text-court-foreground/50 mt-1">Des deux parents avant toute vidéo</p>
            </div>
          </div>
        </div>
      </section>

      {/* AUDIENCE PATHS */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="max-w-2xl">
            <div className="font-mono text-xs uppercase tracking-[0.15em] text-primary">Par où commencer</div>
            <h2 className="mt-4 font-display text-4xl tracking-tight text-balance">Selon votre profil.</h2>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-glass backdrop-blur-md ring-1 ring-white/10 p-6">
              <div className="font-mono text-xs text-primary">Joueur ou parent</div>
              <h3 className="mt-3 font-display text-xl tracking-tight">Un accompagnement individualisé</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                En complément du club, pour mieux lire le jeu et décider sous pression. Jeunes
                comme adultes, chaque joueur progresse sur ses situations à lui.
              </p>
              <Link
                to="/tarifs"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:-translate-y-0.5 hover:shadow-glow-lg"
              >
                Séance d'essai · 25 €
                <span>→</span>
              </Link>
            </div>
            <div className="rounded-2xl bg-glass backdrop-blur-md ring-1 ring-white/10 p-6">
              <div className="font-mono text-xs text-primary">Coach</div>
              <h3 className="mt-3 font-display text-xl tracking-tight">Un échange entre gens du métier</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Un praticien qui applique l'approche par contraintes sur le terrain, en français.
              </p>
              <a
                href="https://instagram.com/unlok.basketball"
                className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
              >
                Me suivre sur Instagram
              </a>
            </div>
            <div className="rounded-2xl bg-glass backdrop-blur-md ring-1 ring-white/10 p-6">
              <div className="font-mono text-xs text-primary">Clubs & structures</div>
              <h3 className="mt-3 font-display text-xl tracking-tight">Un service d'individualisation encadré</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                En complément des clubs et de toutes les structures du basket, sans coût ni charge
                pour vous.
              </p>
              <a
                href="mailto:unlok.basketball@gmail.com"
                className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
              >
                M'écrire
              </a>
            </div>
          </div>
          <p className="mt-10 text-sm text-muted-foreground text-pretty max-w-3xl">
            Et parce que je tiens à rendre des comptes, chaque collaboration se mesure :{" "}
            <span className="text-foreground font-medium">joueurs orientés</span> → séances découverte → suivis ·{" "}
            <span className="text-foreground font-medium">taux de retour</span> d'une séance à l'autre ·{" "}
            <span className="text-foreground font-medium">transfert</span> observé par les éducateurs.
          </p>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="border-t border-border bg-court text-court-foreground">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <h2 className="font-display text-4xl md:text-5xl tracking-tight text-balance">
            Parlons de votre saison.
          </h2>
          <p className="mt-4 text-court-foreground/70 max-w-xl mx-auto">
            Écrivez-moi pour organiser votre séance ou poser vos questions.
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
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
