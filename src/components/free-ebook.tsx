import { useState } from "react";
import { getFreeEbook } from "@/lib/free-ebook.functions";

const STEPS = [
  ["R", "Loup ballon", "5 min"],
  ["A", "Touche basse", "3 min"],
  ["M", "Slide aux plots", "3 min"],
  ["P", "Chasseur et chassé", "4 min"],
] as const;

export function FreeEbook() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [url, setUrl] = useState("");
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) return setErr("Entre une adresse email valide.");
    setState("sending");
    try {
      const r = await getFreeEbook({ data: { email } });
      if ("error" in r) throw new Error(r.error);
      setUrl(r.url);
      setState("done");
    } catch {
      setState("idle");
      setErr("Ça n'a pas fonctionné. Réessaie ou écris à unlok.basketball@gmail.com.");
    }
  }

  return (
    <section id="extrait-gratuit" className="relative overflow-hidden border-b border-primary/40 bg-gradient-to-b from-primary/15 to-background">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-lg border border-primary/40 px-3 py-1 font-mono text-xs uppercase tracking-[0.15em] text-primary">
            <span className="size-1.5 rounded-full bg-primary" /> Extrait gratuit
          </div>
          <h2 className="mt-6 font-display text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] tracking-tight">
            Teste la méthode : <span className="text-primary">échauffement défensif.</span>
          </h2>
          <p className="mt-4 max-w-[46ch] text-muted-foreground">
            Une séance RAMP complète de 15 minutes, 4 exercices avec but, consignes et évolutions. Gratuit, en PDF.
          </p>
          <ul className="mt-6 space-y-2">
            {STEPS.map(([l, n, d]) => (
              <li key={l} className="flex items-center gap-3 text-sm">
                <span className="grid size-8 place-items-center rounded-md bg-primary font-display text-primary-foreground">{l}</span>
                <span className="flex-1">{n}</span>
                <span className="font-mono text-muted-foreground">{d}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-primary/40 bg-card p-6 md:p-8">
          {state === "done" ? (
            <div>
              <h3 className="font-display text-3xl">C'est à toi !</h3>
              <p className="mt-3 text-sm text-muted-foreground">Ton extrait est prêt.</p>
              <a href={url} download="Echauffement-defensif-RAMP-Unlok.pdf" target="_blank" rel="noopener"
                className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 font-display uppercase text-primary-foreground shadow-glow">
                Télécharger le PDF
              </a>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <h3 className="font-display text-3xl">Recevoir l'extrait</h3>
              <input type="email" placeholder="Ton email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-foreground/30 bg-background px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
              {err && <p className="text-sm text-destructive">{err}</p>}
              <button type="submit" disabled={state === "sending"}
                className="w-full rounded-lg bg-primary px-6 py-3 font-display uppercase text-primary-foreground shadow-glow disabled:opacity-60">
                {state === "sending" ? "Envoi…" : "Télécharger l'extrait gratuit"}
              </button>
              <p className="text-xs text-muted-foreground">Ton email sert à te tenir au courant des nouveautés Unlok. Désinscription sur simple demande.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
