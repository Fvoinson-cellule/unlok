import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/clubs")({
  head: () => ({
    meta: [
      { title: "Espace clubs · Le guide gratuit · Unlok" },
      { name: "description", content: "Guide gratuit pour les clubs de basket : 10 choses à mettre en place dans son club. Reçu par email." },
      { property: "og:title", content: "Espace clubs · Unlok" },
      { property: "og:description", content: "10 choses à mettre en place dans son club de basket. Guide gratuit." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Clubs,
});

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const field =
  "w-full rounded-lg border border-foreground/30 bg-background px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none";

function Clubs() {
  const [email, setEmail] = useState("");
  const [club, setClub] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!EMAIL.test(email.trim())) return setError("Entre une adresse email valide.");
    setState("sending");
    const { error } = await supabase
      .from("club_guide_leads")
      .insert({ email: email.trim().slice(0, 200), club: club.trim().slice(0, 120) || null });
    if (error) {
      setState("idle");
      return setError("L'envoi n'a pas fonctionné. Réessaie ou écris à unlok.basketball@gmail.com.");
    }
    setState("done");
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-body antialiased selection:bg-primary/20">
      <SiteNav />
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary" />
              Espace clubs · Gratuit
            </div>
            <h1 className="mt-6 font-display text-[clamp(2.3rem,6vw,4.5rem)] leading-[0.95] tracking-tight text-balance rise">
              10 choses à mettre en place <span className="text-primary">dans son club.</span>
            </h1>
            <p className="mt-6 max-w-[48ch] text-lg text-muted-foreground text-pretty">
              Un guide concret pour les dirigeants et les éducateurs : organisation, formation des
              joueurs, accompagnement des coachs. Gratuit, envoyé par email.
            </p>
          </div>
          <div className="rounded-2xl bg-glass p-6 ring-1 ring-white/10 md:p-8">
            {state === "done" ? (
              <div>
                <h2 className="font-display text-3xl">Merci !</h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  C'est noté. Le guide arrive dans ta boîte mail très vite.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <h2 className="font-display text-3xl">Recevoir le guide</h2>
                <input className={field} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input className={field} placeholder="Club (facultatif)" value={club} onChange={(e) => setClub(e.target.value)} />
                {error && <p className="text-sm text-destructive">{error}</p>}
                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:-translate-y-0.5 hover:shadow-glow-lg disabled:opacity-60"
                >
                  {state === "sending" ? "Envoi…" : "Recevoir le guide gratuit →"}
                </button>
                <p className="text-xs text-muted-foreground">Ton email sert uniquement à t'envoyer le guide et des nouvelles d'Unlok.</p>
              </form>
            )}
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
