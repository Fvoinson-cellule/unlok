import { useEffect, useRef, useState } from "react";
import { spotlightMove } from "@/components/spotlight";
import { supabase } from "@/integrations/supabase/client";

type Review = { id: string; name: string; role: string | null; rating: number; message: string };
const field =
  "w-full rounded-lg border border-foreground/30 bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none";

type Topic = "seances" | "ramp";
const COPY = {
  seances: { eyebrow: "Avis · Séances terrain", title: "Ils s'entraînent avec Florian.", hook: "Tu as fait une séance ? Raconte ton expérience sur le terrain.", cta: "Donner mon avis sur les séances", role: "Joueur, parent… (facultatif)" },
  ramp: { eyebrow: "Avis · Book RAMP", title: "Les coachs en parlent.", hook: "Tu utilises le Book RAMP ? Dis-nous ce qu'il change dans tes échauffements.", cta: "Donner mon avis sur le Book RAMP", role: "Coach, club… (facultatif)" },
};

export function ReviewsSection({ topic = "seances" }: { topic?: Topic }) {
  const t = COPY[topic];
  const [reviews, setReviews] = useState<Review[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", message: "", rating: 5 });
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const track = useRef<HTMLDivElement>(null);
  const scroll = (d: number) => track.current?.scrollBy({ left: d * track.current.clientWidth * 0.8, behavior: "smooth" });

  useEffect(() => {
    supabase.from("reviews").select("id,name,role,rating,message").eq("approved", true).eq("topic", topic)
      .order("created_at", { ascending: false }).limit(12)
      .then(({ data }) => setReviews(data ?? []));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const name = form.name.trim(), message = form.message.trim();
    if (!name) return setError("Indique ton prénom.");
    if (message.length < 5) return setError("Écris quelques mots sur ton expérience.");
    setState("sending");
    const { error } = await supabase.from("reviews").insert({
      name: name.slice(0, 60), role: form.role.trim().slice(0, 60) || null,
      topic, rating: form.rating, message: message.slice(0, 800), approved: true,
    });
    if (error) { setState("idle"); return setError("L'envoi n'a pas fonctionné, réessaie."); }
    setState("done");
    const { data } = await supabase.from("reviews").select("id,name,role,rating,message").eq("approved", true).eq("topic", topic).order("created_at", { ascending: false }).limit(12);
    setReviews(data ?? []);
  }

  return (
    <section id="avis" className="relative overflow-hidden border-y border-primary/40 bg-gradient-to-b from-primary/15 to-background">
      <div aria-hidden className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-primary/25 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="font-mono text-xs uppercase tracking-[0.15em] text-primary">{t.eyebrow}</div>
          <div className="mt-4 text-4xl tracking-widest text-primary drop-shadow-[0_0_12px_var(--color-primary)]" aria-hidden>★★★★★</div>
          <h2 className="mt-4 font-display text-4xl md:text-6xl tracking-tight text-balance">{t.title}</h2>
          <p className="mt-4 text-muted-foreground">{t.hook}</p>
          {!open && state !== "done" && (
            <button onClick={() => setOpen(true)} className="mt-8 rounded-lg bg-primary px-8 py-4 text-sm font-semibold uppercase tracking-wide text-primary-foreground shadow-glow transition-transform hover:scale-105">
              {t.cta}
            </button>
          )}
        </div>

        {reviews.length > 0 ? (
          <div className="mt-12">
            <div ref={track} className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
              {reviews.map((r) => (
                <figure key={r.id} onMouseMove={spotlightMove} className="spotlight flex w-[85%] shrink-0 snap-start flex-col rounded-2xl bg-glass p-6 ring-1 ring-white/10 transition-all hover:ring-primary sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.7rem)]">
                  <div className="text-lg text-primary" aria-label={`${r.rating} sur 5`}>{"★".repeat(r.rating)}<span className="text-muted-foreground/40">{"★".repeat(5 - r.rating)}</span></div>
                  <blockquote className="mt-4 flex-1 text-sm leading-6 text-muted-foreground">« {r.message} »</blockquote>
                  <figcaption className="mt-5 text-sm font-semibold">{r.name}{r.role && <span className="font-normal text-muted-foreground"> · {r.role}</span>}</figcaption>
                </figure>
              ))}
            </div>
            {reviews.length > 1 && (
              <div className="mt-6 flex gap-2">
                <button type="button" aria-label="Avis précédent" onClick={() => scroll(-1)} className="grid size-11 place-items-center rounded-full border border-border transition-colors hover:border-primary hover:text-primary">←</button>
                <button type="button" aria-label="Avis suivant" onClick={() => scroll(1)} className="grid size-11 place-items-center rounded-full border border-border transition-colors hover:border-primary hover:text-primary">→</button>
              </div>
            )}
          </div>
        ) : (
          <p className="mt-10 text-center text-sm text-muted-foreground">Sois le premier à laisser ton avis.</p>
        )}

        {state === "done" ? (
          <p className="mx-auto mt-10 max-w-2xl rounded-xl border border-primary/40 bg-card p-5 text-center text-sm">Merci pour ton avis ! Il est maintenant en ligne.</p>
        ) : open && (
          <form onSubmit={submit} className="mx-auto mt-10 grid max-w-2xl gap-3 rounded-2xl border border-primary/40 bg-card p-6">
            <div className="flex gap-1" role="radiogroup" aria-label="Note">
              {[1, 2, 3, 4, 5].map((n) => (
                <button type="button" key={n} aria-label={`${n} étoiles`} onClick={() => setForm({ ...form, rating: n })}
                  className={`text-2xl ${n <= form.rating ? "text-primary" : "text-muted-foreground/40"}`}>★</button>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <input className={field} placeholder="Prénom" maxLength={60} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className={field} placeholder={t.role} maxLength={60} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
            </div>
            <textarea className={field} rows={4} placeholder="Ton retour" maxLength={800} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button disabled={state === "sending"} className="justify-self-start rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow disabled:opacity-60">
              {state === "sending" ? "Envoi…" : "Envoyer mon avis"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
