import { createFileRoute, Link } from "@tanstack/react-router";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { createRampCheckout, getRampDownload } from "@/lib/ramp.functions";
import { useEffect, useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { ReviewsSection } from "@/components/reviews-section";
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
  validateSearch: (s: Record<string, unknown>): { session_id?: string } =>
    typeof s["session_id"] === "string" ? { session_id: s["session_id"] } : {},
  component: Ramp,
});

const STEPS = [
  ["R", "Raise", "Élever la température, le rythme cardiaque et l'attention."],
  ["A", "Activate", "Activer les muscles clés du basket."],
  ["M", "Mobilise", "Mobiliser les articulations dans les amplitudes du jeu."],
  ["P", "Potentiate", "Monter en intensité pour être prêt dès le premier ballon."],
] as const;

function RampBuy() {
  const [email, setEmail] = useState("");
  const [cgv, setCgv] = useState(false);
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState("");
  const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) && cgv;
  async function fetchClientSecret() {
    const r = await createRampCheckout({
      data: {
        email,
        returnUrl: `${window.location.origin}/ramp?session_id={CHECKOUT_SESSION_ID}`,
        environment: getStripeEnvironment(),
      },
    });
    if ("error" in r) throw new Error(r.error);
    return r.clientSecret;
  }
  if (open) {
    return (
      <div className="rounded-lg bg-card p-2">
        <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    );
  }
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        try { getStripeEnvironment(); setOpen(true); }
        catch { setErr("Le paiement n'est pas disponible ici. Écris à unlok.basketball@gmail.com."); }
      }}
      className="space-y-3"
    >
      <label className="block text-sm text-muted-foreground">
        Ton email (pour le reçu)
        <input
          type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-md border border-foreground/30 bg-card px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
      </label>
      <label className="flex items-start gap-2 text-sm text-muted-foreground">
        <input type="checkbox" checked={cgv} onChange={(e) => setCgv(e.target.checked)} className="mt-1" />
        <span>
          J'accepte les <Link to="/cgv" className="underline">CGV</Link> et je demande l'accès immédiat au
          PDF, en renonçant à mon droit de rétractation.
        </span>
      </label>
      {err && <p className="text-sm text-primary">{err}</p>}
      <button
        disabled={!valid}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:-translate-y-0.5 disabled:opacity-40"
      >
        Acheter le book <span>→</span>
      </button>
      <p className="text-xs text-muted-foreground">PDF de 40 pages, téléchargement immédiat après paiement.</p>
    </form>
  );
}

function RampDownload({ sessionId }: { sessionId: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [err, setErr] = useState(false);
  useEffect(() => {
    getRampDownload({ data: { sessionId, environment: getStripeEnvironment() } })
      .then((r) => ("url" in r ? setUrl(r.url) : setErr(true)))
      .catch(() => setErr(true));
  }, [sessionId]);
  if (err) {
    return (
      <p className="text-sm text-muted-foreground">
        Paiement introuvable. Écris à <a className="underline" href="mailto:unlok.basketball@gmail.com">unlok.basketball@gmail.com</a>, je t'envoie le book.
      </p>
    );
  }
  return (
    <div className="rounded-lg border border-primary/40 bg-primary/10 p-5">
      <p className="font-display text-2xl uppercase">Merci, paiement reçu !</p>
      <p className="mt-1 text-sm text-muted-foreground">Télécharge ton book maintenant et garde-le sur ton téléphone.</p>
      {url ? (
        <a href={url} download="Pack-RAMP-Unlok.pdf" className="mt-4 inline-flex rounded-lg bg-primary px-6 py-3 text-sm font-semibold uppercase text-primary-foreground">
          Télécharger le PDF
        </a>
      ) : (
        <p className="mt-4 text-sm">Vérification du paiement…</p>
      )}
    </div>
  );
}

function Ramp() {
  const { session_id } = Route.useSearch();
  const [launch, setLaunch] = useState(true);
  useEffect(() => setLaunch(isRampLaunch()), []);
  return (
    <div className="min-h-screen bg-background text-foreground font-body antialiased selection:bg-primary/20">
      <SiteNav />

      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 pt-20 pb-16">
          <div className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            Book numérique · Disponible
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
          <div className="mt-8 max-w-xl">
            {session_id ? <RampDownload sessionId={session_id} /> : <RampBuy />}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-court text-court-foreground">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="font-mono text-xs uppercase tracking-[0.15em] text-primary">Le modèle RAMP</div>
          <h2 className="mt-4 font-display text-4xl tracking-tight">4 étapes, 20 minutes.</h2>
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
      <ReviewsSection topic="ramp" />

      <SiteFooter />
    </div>
  );
}
