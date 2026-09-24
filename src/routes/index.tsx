import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Unlok — Coaching basket individualisé U13–U18 · Alsace" },
      {
        name: "description",
        content:
          "Unlok : coaching de basketball individualisé pour les jeunes (U13–U18) en Alsace. Méthode par contraintes, effectif de 6 maximum, en complément du club.",
      },
      { property: "og:title", content: "Unlok — Coaching basket individualisé" },
      {
        property: "og:description",
        content:
          "Coaching de basketball individuel pour les jeunes joueurs d'Alsace. Réagir plus vite, faire le bon choix, ancrer durablement.",
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

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 -z-0"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.62 0.21 36 / 0.14), var(--color-background) 65%)",
          }}
        />

        <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-background/60 px-3 py-1 text-xs font-mono uppercase tracking-[0.15em] text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary" />
              Coaching individuel · U13–U18 · Alsace
            </div>

            <h1 className="mt-6 font-display text-[clamp(3rem,8vw,6.5rem)] leading-[0.92] tracking-tight text-balance rise">
              Réagir plus vite.<br />
              <span className="text-primary">Faire le bon choix.</span><br />
              Ancrer durablement.
            </h1>

            <p className="mt-8 max-w-[46ch] text-lg text-pretty text-muted-foreground rise" style={{ animationDelay: "0.1s" }}>
              Un entraînement qui tourne en boucle. Trois effets qui se renforcent,
              séance après séance : un joueur plus vif, plus juste, et qui garde ses acquis.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4 rise" style={{ animationDelay: "0.2s" }}>
              <Link
                to="/offre"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:-translate-y-0.5 hover:shadow-glow-lg"
              >
                Voir les formules
                <span>→</span>
              </Link>
              <a
                href="#methode"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
              >
                Découvrir la méthode
              </a>
            </div>

            {/* 3-effect loop */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-glass backdrop-blur-md ring-1 ring-white/10 p-5 rise" style={{ animationDelay: "0.3s" }}>
                <div className="font-mono text-xs text-primary">01</div>
                <h3 className="mt-3 font-display text-2xl tracking-tight">Réagir plus vite</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Votre joueur voit le jeu et réagit plus rapidement. On entraîne la perception
                  et le traitement de l'information pour gagner en vitesse de réaction.
                </p>
              </div>
              <div className="rounded-2xl bg-glass backdrop-blur-md ring-1 ring-white/10 p-5 rise" style={{ animationDelay: "0.4s" }}>
                <div className="font-mono text-xs text-primary">02</div>
                <h3 className="mt-3 font-display text-2xl tracking-tight">Faire le bon choix</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Face à la situation réelle, il choisit la meilleure option. En situations proches
                  du match, il apprend à sélectionner la bonne réponse sous pression.
                </p>
              </div>
              <div className="rounded-2xl bg-glass backdrop-blur-md ring-1 ring-white/10 p-5 rise" style={{ animationDelay: "0.5s" }}>
                <div className="font-mono text-xs text-primary">03</div>
                <h3 className="mt-3 font-display text-2xl tracking-tight">Ancrer durablement</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Ce qu'il gagne, il le garde. La répétition de situations signifiantes installe
                  l'automatisme, pour que ça dure dans le temps.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LA PROMESSE */}
      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-4xl px-6 py-20">
          <div className="font-mono text-xs uppercase tracking-[0.15em] text-primary">La promesse</div>
          <p className="mt-6 font-display text-2xl sm:text-3xl leading-snug tracking-tight text-balance text-foreground">
            Votre enfant s'entraîne à faire les bons choix dans les moments de pression, sur ses
            situations à lui, en petit groupe. À force de les revivre à l'entraînement, il les
            aborde en match avec plus de lucidité et d'aisance.
          </p>
        </div>
      </section>

      {/* METHOD */}
      <section ref={methodRef} id="methode" className="method-story border-t border-border">
        <div className="method-intro mx-auto max-w-6xl px-6 pt-24 pb-16 md:pb-24">
          <div className="max-w-3xl">
            <div className="font-mono text-xs uppercase tracking-[0.15em] text-primary">(a) La méthode</div>
            <h2 className="mt-4 font-display text-5xl md:text-7xl text-balance">
              L'approche par contraintes.
            </h2>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground text-pretty">
              Plutôt que faire répéter un geste « modèle » isolé, on aménage l'environnement pour
              que le joueur explore et trouve lui-même des solutions adaptées.
            </p>
          </div>
        </div>

        <div className="method-sheet text-court-foreground">
          <div className="method-edge" aria-hidden="true" />
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

      {/* CONFIDENCE LEVELS */}
      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <div className="font-mono text-xs uppercase tracking-[0.15em] text-primary">Comment lire ce dossier</div>
            <h2 className="mt-4 font-display text-3xl tracking-tight text-balance">
              Je distingue le prouvé de ce que je vise.
            </h2>
            <p className="mt-4 text-muted-foreground text-pretty">
              La confiance se construit quand on reste précis. Chaque affirmation de ce dossier
              porte un niveau de certitude : plein, à moitié, ou vide.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-background ring-1 ring-border p-6">
              <div className="font-mono text-xs text-primary">Prouvé</div>
              <h3 className="mt-3 font-display text-xl tracking-tight">Établi</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Principe documenté et reconnu dans la littérature scientifique.
              </p>
            </div>
            <div className="rounded-2xl bg-background ring-1 ring-border p-6">
              <div className="font-mono text-xs text-primary">Mon application</div>
              <h3 className="mt-3 font-display text-xl tracking-tight">Extrapolation</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Ce que j'en tire concrètement sur le terrain, en tant que praticien.
              </p>
            </div>
            <div className="rounded-2xl bg-background ring-1 ring-border p-6">
              <div className="font-mono text-xs text-primary">Objectif</div>
              <h3 className="mt-3 font-display text-xl tracking-tight">On y travaille</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Ce qu'on cherche à développer, et qu'on mesure séance après séance.
              </p>
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
                En club, votre enfant apprend au sein d'un groupe, c'est essentiel. Unlok ajoute la
                dimension individuelle : peu de joueurs, beaucoup de répétitions utiles, sur ses
                situations à lui.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SESSION BREAKDOWN */}
      <section id="seance" className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="max-w-2xl">
            <div className="font-mono text-xs uppercase tracking-[0.15em] text-primary">(b) Concrètement</div>
            <h2 className="mt-4 font-display text-4xl tracking-tight text-balance">Une séance.</h2>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="border-t-2 border-primary pt-4">
              <div className="font-mono text-xs text-muted-foreground">01</div>
              <h3 className="mt-2 font-display text-xl tracking-tight">Échauffement structuré</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Progressif, il prépare le système nerveux et articulaire au travail intense.
              </p>
            </div>
            <div className="border-t-2 border-primary pt-4">
              <div className="font-mono text-xs text-muted-foreground">02</div>
              <h3 className="mt-2 font-display text-xl tracking-tight">Situations à contraintes</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Peu de consignes descendantes, beaucoup de mises en situation où le joueur cherche.
              </p>
            </div>
            <div className="border-t-2 border-primary pt-4">
              <div className="font-mono text-xs text-muted-foreground">03</div>
              <h3 className="mt-2 font-display text-xl tracking-tight">Feedback individualisé</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Rendu possible par le très petit effectif : chacun repart avec du concret.
              </p>
            </div>
            <div className="border-t-2 border-primary pt-4">
              <div className="font-mono text-xs text-muted-foreground">04</div>
              <h3 className="mt-2 font-display text-xl tracking-tight">Charge adaptée</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Ajustée à la maturité du jeune, pas seulement à son âge civil.
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
              <div className="mt-2 font-display text-xl tracking-tight">U13 → U18</div>
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
              <div className="font-mono text-xs text-primary">Parent</div>
              <h3 className="mt-3 font-display text-xl tracking-tight">Un accompagnement individualisé</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Pour votre enfant, en complément du club, pour l'aider à mieux lire le jeu et décider
                sous pression.
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
            Parlons de la saison de votre joueur.
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
