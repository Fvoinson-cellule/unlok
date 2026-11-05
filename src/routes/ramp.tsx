import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { RAMP, isRampLaunch } from "@/lib/pricing";

export const Route = createFileRoute("/ramp")({
  head: () => ({
    meta: [
      { title: "Book RAMP · 40 échauffements basket · Unlok" },
      { name: "description", content: "40 échauffements basket construits sur le modèle RAMP. Prix de lancement 14,90 € jusqu'au 31 décembre, puis 24,90 €." },
      { property: "og:title", content: "Book RAMP · 40 échauffements basket" },
      { property: "og:description", content: "40 échauffements prêts à l'emploi pour joueurs et coachs. Prix de lancement 14,90 €." },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Ramp,
});

const STEPS = [
  ["R", "Raise", "Élever la température, le rythme cardiaque et l'attention."],
  ["A", "Activate", "Activer les muscles clés du basket."],
  ["M", "Mobilise", "Mobiliser les articulations dans les amplitudes du jeu."],
  ["P", "Potentiate", "Monter en intensité pour être prêt dès le premier ballon."],
] as const;

function Ramp() {
  const [launch, setLaunch] = useState(true);
  useEffect(() => setLaunch(isRampLaunch()), []);
  return (
    <div className="min-h-screen bg-background text-foreground font-body antialiased selection:bg-primary/20">
      <SiteNav />

      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 pt-20 pb-16">
          <div className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            Book numérique · Bientôt disponible
          </div>
          <h1 className="mt-6 font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.92] tracking-tight text-balance rise">
            40 échauffements<br />
            <span className="text-primary">RAMP.</span>
          </h1>
          <p className="mt-6 max-w-[52ch] text-lg text-muted-foreground text-pretty">
            Des échauffements prêts à l'emploi, pensés pour le basket, pour les joueurs comme pour
            les coachs. Finis les tours de terrain : on prépare le corps et la tête au jeu.
          </p>
          <div className="mt-8 flex flex-wrap items-end gap-4">
            {launch ? (
              <>
                <span className="font-display text-6xl text-primary">{RAMP.launchPrice}</span>
                <span className="pb-2 text-xl text-muted-foreground line-through">{RAMP.regularPrice}</span>
                <span className="pb-2 text-sm text-muted-foreground">Prix de lancement jusqu'au 31 décembre</span>
              </>
            ) : (
              <span className="font-display text-6xl text-primary">{RAMP.regularPrice}</span>
            )}
          </div>
          <a
            href="mailto:unlok.basketball@gmail.com?subject=Book%20RAMP%20-%20Pr%C3%A9venez-moi"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:-translate-y-0.5 hover:shadow-glow-lg"
          >
            Être prévenu de la sortie <span>→</span>
          </a>
        </div>
      </section>

      <section className="border-b border-border bg-court text-court-foreground">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="font-mono text-xs uppercase tracking-[0.15em] text-primary">Le modèle RAMP</div>
          <h2 className="mt-4 font-display text-4xl tracking-tight">4 étapes, 10 minutes.</h2>
          <ol className="mt-10 border-t border-court-foreground/20">
            {STEPS.map(([l, n, t]) => (
              <li key={l} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-court-foreground/20 py-6 md:grid-cols-[5rem_1fr]">
                <span className="font-display text-4xl text-primary">{l}</span>
                <div>
                  <h3 className="font-display text-2xl">{n}</h3>
                  <p className="mt-1 text-sm text-court-foreground/65">{t}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
