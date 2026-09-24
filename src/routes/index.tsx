import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { MethodLoop } from "@/components/method-loop";
import portrait from "@/assets/florian-portrait.png";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Unlok — Coaching basket individualisé · Alsace" },
      {
        name: "description",
        content:
          "Unlok : coaching de basketball individualisé pour joueurs et joueuses, jeunes et adultes, en Alsace. Méthode par contraintes, effectif de 6 maximum, en complément du club.",
      },
      { property: "og:title", content: "Unlok — Coaching basket individualisé" },
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
  const methodRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = methodRef.current;
    if (!section) return;

    section.classList.add("method-js");
    const animatedElements = section.querySelectorAll<HTMLElement>(
      ".method-intro, .method-sheet, .method-step",
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8%" },
    );

    animatedElements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

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
                  to="/offre"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:-translate-y-0.5 hover:shadow-glow-lg"
                >
                  Réserver une séance découverte — 15 €
                  <span>→</span>
                </Link>
                <a
                  href="#methode"
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
                >
                  Découvrir la méthode
                </a>
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
              { k: "Effectif", v: "6 joueurs max" },
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

      {/* METHOD */}
      <section ref={methodRef} id="methode" className="method-story border-t border-border">
        <div className="method-intro mx-auto max-w-6xl px-6 pt-24 pb-16 md:pb-20">
          <div className="max-w-3xl">
            <div className="font-mono text-xs uppercase tracking-[0.15em] text-primary">La méthode</div>
            <h2 className="mt-4 font-display text-5xl md:text-7xl text-balance">
              L'approche par contraintes.
            </h2>
            <p className="mt-8 max-w-2xl text-lg text-muted-foreground text-pretty">
              Au cœur d'UNLOK, une philosophie : la{" "}
              <span className="font-medium text-foreground">
                CLA (<em>Constraints-Led Approach</em>)
              </span>
              . Le principe ? Travailler sous contraintes ciblées (espace réduit, temps limité,
              défense asymétrique) pour forcer le cerveau et le corps à trouver la solution en
              direct. On ne forme pas des robots qui récitent des gammes, mais des joueurs créatifs,
              adaptables et imprévisibles sur le terrain.
            </p>
          </div>

          {/* Boucle de la méthode */}
          <div className="mt-16 grid items-center gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-16">
            <div className="flex justify-center text-foreground">
              <MethodLoop />
            </div>
            <ol className="space-y-6">
              <li className="rounded-2xl bg-glass p-5 ring-1 ring-white/10 backdrop-blur-md">
                <div className="font-mono text-xs text-primary">01</div>
                <h3 className="mt-3 font-display text-2xl tracking-tight">Réagir plus vite</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Traiter l'information en une fraction de seconde : lire le placement de la défense,
                  repérer l'aide, voir le démarquage d'un coéquipier et prendre la bonne décision
                  sous pression. On entraîne la perception et le traitement de l'information pour
                  gagner en vitesse de réaction.
                </p>
              </li>
              <li className="rounded-2xl bg-glass p-5 ring-1 ring-white/10 backdrop-blur-md">
                <div className="font-mono text-xs text-primary">02</div>
                <h3 className="mt-3 font-display text-2xl tracking-tight">Faire le bon choix</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  En recréant des situations réelles de match, on confronte le joueur à des dilemmes
                  permanents : shooter, passer ou attaquer le cercle ? On habitue le cerveau à
                  anticiper pour exécuter le bon geste sous pression défensive.
                </p>
              </li>
              <li className="rounded-2xl bg-glass p-5 ring-1 ring-white/10 backdrop-blur-md">
                <div className="font-mono text-xs text-primary">03</div>
                <h3 className="mt-3 font-display text-2xl tracking-tight">Ancrer durablement</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Répéter, mais jamais à l'identique. Par la CLA, chaque situation est différente,
                  comme en match. En multipliant ces répétitions à haute intensité, réagir vite et
                  faire le bon choix ne demandent plus d'hésitation : le geste devient un réflexe
                  naturel et instinctif.
                </p>
              </li>
            </ol>
          </div>
        </div>


        <div className="method-sheet text-court-foreground">

          <div className="mx-auto max-w-6xl px-6 pt-20 pb-24 md:pt-28 md:pb-32">
            <div className="grid gap-14 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:gap-20">
              <div>
                <p className="font-display text-3xl md:text-5xl text-balance">
                  Apprendre à décider dans le jeu.
                </p>
                <p className="mt-6 max-w-md text-sm leading-7 text-court-foreground/65 text-pretty">
                  Je m'appuie sur du concret : plutôt que des pourcentages, je mesure la progression
                  réelle, séance après séance. Les autres joueurs ne sont pas là pour « gagner » :
                  ils recréent la pression et l'imprévu où l'on apprend à décider.
                </p>
              </div>

              <ol className="method-steps border-t border-court-foreground/20">
                <li className="method-step grid grid-cols-[3rem_1fr] gap-4 border-b border-court-foreground/20 py-7 md:grid-cols-[5rem_1fr] md:gap-8 md:py-9">
                  <span className="font-display text-3xl text-primary">01</span>
                  <div>
                    <h3 className="font-display text-2xl md:text-3xl">Le joueur</h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-court-foreground/65">
                      Entraîné dans des situations qui ressemblent au match, il développe une motricité
                      adaptable plutôt qu'un geste figé.
                    </p>
                  </div>
                </li>
                <li className="method-step grid grid-cols-[3rem_1fr] gap-4 border-b border-court-foreground/20 py-7 md:grid-cols-[5rem_1fr] md:gap-8 md:py-9">
                  <span className="font-display text-3xl text-primary">02</span>
                  <div>
                    <h3 className="font-display text-2xl md:text-3xl">La tâche</h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-court-foreground/65">
                      Des situations à contraintes précises qui isolent une décision, puis qu'on répète
                      jusqu'à la maîtrise.
                    </p>
                  </div>
                </li>
                <li className="method-step grid grid-cols-[3rem_1fr] gap-4 border-b border-court-foreground/20 py-7 md:grid-cols-[5rem_1fr] md:gap-8 md:py-9">
                  <span className="font-display text-3xl text-primary">03</span>
                  <div>
                    <h3 className="font-display text-2xl md:text-3xl">L'environnement</h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-court-foreground/65">
                      La compétence naît de l'interaction entre trois contraintes : le joueur, la tâche,
                      l'environnement.
                    </p>
                  </div>
                </li>
                <li className="method-step grid grid-cols-[3rem_1fr] gap-4 border-b border-court-foreground/20 py-7 md:grid-cols-[5rem_1fr] md:gap-8 md:py-9">
                  <span className="font-display text-3xl text-primary">04</span>
                  <div>
                    <h3 className="font-display text-2xl md:text-3xl">Le transfert</h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-court-foreground/65">
                      Ce qui est travaillé ici se voit ensuite en match avec son équipe.
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* LE CONSTAT */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid grid-cols-12 gap-8 items-center">
            <div className="col-span-12 md:col-span-5">
              <div className="font-mono text-xs uppercase tracking-[0.15em] text-primary">Le constat</div>
              <h2 className="mt-4 font-display text-4xl tracking-tight text-balance">
                L'individuel, en plus du collectif.
              </h2>
            </div>
            <div className="col-span-12 md:col-span-7">
              <p className="text-lg text-muted-foreground text-pretty">
                En club, le joueur apprend au sein d'un groupe, c'est essentiel. Unlok ajoute la
                dimension individuelle : peu de joueurs, beaucoup de répétitions utiles, sur ses
                situations à lui.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* REINFORCES CLUB */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="rounded-3xl bg-court text-court-foreground p-8 md:p-12">
            <div className="font-mono text-xs uppercase tracking-[0.15em] text-primary">Point essentiel</div>
            <h2 className="mt-4 font-display text-3xl md:text-4xl tracking-tight text-balance">
              Je renforce le travail du club.
            </h2>
            <p className="mt-4 text-court-foreground/70 text-pretty max-w-2xl">
              Unlok complète les séances collectives en ajoutant la dimension individuelle. Le club
              reste le lieu de la vie du joueur ; j'interviens en soutien, sans coût ni charge pour
              la structure.
            </p>
            <div className="mt-8 flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-lg bg-primary" />
                Aligné sur l'éducateur
              </div>
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-lg bg-primary" />
                En soutien du club
              </div>
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-lg bg-primary" />
                Service pour le territoire
              </div>
            </div>
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
              <div className="mt-2 font-display text-xl tracking-tight">6 max</div>
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
                to="/offre"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:-translate-y-0.5 hover:shadow-glow-lg"
              >
                Réserver la séance d'essai — 15 €
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
            Places limitées à 6 joueurs par créneau. Écrivez-nous pour réserver ou poser vos
            questions.
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
