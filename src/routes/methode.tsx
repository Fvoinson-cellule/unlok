import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { MethodLoop } from "@/components/method-loop";

export const Route = createFileRoute("/methode")({
  head: () => ({
    meta: [
      { title: "La méthode CLA · Unlok · Coaching basket" },
      { name: "description", content: "L'approche par contraintes (CLA) d'Unlok : réagir plus vite, faire le bon choix et ancrer durablement, en séances de 60 minutes." },
      { property: "og:title", content: "La méthode CLA · Unlok" },
      { property: "og:description", content: "Apprendre à décider dans le jeu grâce à l'approche par contraintes." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Methode,
});

function Methode() {
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
      <section className="border-t border-border bg-court text-court-foreground">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <h2 className="font-display text-4xl md:text-5xl tracking-tight text-balance">Viens l'essayer sur le terrain.</h2>
          <p className="mt-4 text-court-foreground/70 max-w-xl mx-auto">Séance d'essai de 60 minutes à 25 €, seul ou à 2, 3 ou 4.</p>
          <Link to="/tarifs" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:-translate-y-0.5 hover:shadow-glow-lg">
            Voir les tarifs <span>→</span>
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
