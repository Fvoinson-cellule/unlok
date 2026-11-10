import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Review = { id: string; name: string; role: string | null; rating: number; message: string };
const field =
  "w-full rounded-lg border border-foreground/30 bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none";

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", message: "", rating: 5 });
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("reviews").select("id,name,role,rating,message").eq("approved", true)
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
      rating: form.rating, message: message.slice(0, 800),
    });
    if (error) { setState("idle"); return setError("L'envoi n'a pas fonctionné, réessaie."); }
    setState("done");
  }

  return (
    <section id="avis" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="font-mono text-xs uppercase tracking-[0.15em] text-primary">Avis</div>
            <h2 className="mt-4 font-display text-4xl md:text-5xl tracking-tight text-balance">Ils en parlent.</h2>
          </div>
          {!open && state !== "done" && (
            <button onClick={() => setOpen(true)} className="rounded-lg border border-border px-6 py-3 text-sm font-semibold transition-colors hover:border-primary hover:text-primary">
              Laisser un avis
            </button>
          )}
        </div>

        {reviews.length > 0 ? (
          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            {reviews.map((r) => (
              <figure key={r.id} className="flex flex-col rounded-2xl bg-glass p-6 ring-1 ring-white/10">
                <div className="text-primary" aria-label={`${r.rating} sur 5`}>{"★".repeat(r.rating)}<span className="text-muted-foreground/40">{"★".repeat(5 - r.rating)}</span></div>
                <blockquote className="mt-4 flex-1 text-sm leading-6 text-muted-foreground">« {r.message} »</blockquote>
                <figcaption className="mt-5 text-sm font-semibold">{r.name}{r.role && <span className="font-normal text-muted-foreground"> · {r.role}</span>}</figcaption>
              </figure>
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-muted-foreground">Les premiers avis arrivent bientôt. Tu as fait une séance ? Partage ton retour.</p>
        )}

        {state === "done" ? (
          <p className="mt-10 rounded-xl border border-primary/40 p-5 text-sm">Merci pour ton avis ! Il apparaîtra ici après validation.</p>
        ) : open && (
          <form onSubmit={submit} className="mt-10 grid max-w-2xl gap-3 rounded-2xl border border-border p-6">
            <div className="flex gap-1" role="radiogroup" aria-label="Note">
              {[1, 2, 3, 4, 5].map((n) => (
                <button type="button" key={n} aria-label={`${n} étoiles`} onClick={() => setForm({ ...form, rating: n })}
                  className={`text-2xl ${n <= form.rating ? "text-primary" : "text-muted-foreground/40"}`}>★</button>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <input className={field} placeholder="Prénom" maxLength={60} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className={field} placeholder="Joueur, parent, coach… (facultatif)" maxLength={60} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
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
