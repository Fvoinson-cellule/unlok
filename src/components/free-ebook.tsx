import { useState } from "react";
import { getFreeEbook } from "@/lib/free-ebook.functions";
import type { BookKey } from "@/lib/pricing";

const CONTENT = {
  ramp: {
    badge: "Extrait offert · 15 min",
    title: "Séance spéciale défense",
    description: "Une séance RAMP complète de 15 minutes, avec 4 exercices, consignes et évolutions.",
    filename: "Echauffement-defensif-RAMP-Unlok.pdf",
    steps: [
      ["R", "Loup ballon", "5 min"],
      ["A", "Touche basse", "3 min"],
      ["M", "Slide aux plots", "3 min"],
      ["P", "Chasseur et chassé", "4 min"],
    ],
  },
  tir: {
    badge: "Extrait offert · 3 exercices",
    title: "Découvre le Book Tir",
    description: "3 exercices, le sommaire complet et 3 outils pour tester le book avant de l'acheter.",
    filename: "Extrait-Book-Tir-Unlok.pdf",
    steps: [
      ["05", "Passeur opposé", "8 min"],
      ["16", "Fontaine de tir", "3 paniers"],
      ["25", "Poussée de plots", "2 équipes"],
    ],
  },
} as const;

export function FreeEbook({ book = "ramp" }: { book?: BookKey }) {
  const content = CONTENT[book];
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
      const r = await getFreeEbook({ data: { email, book } });
      if ("error" in r) throw new Error(r.error);
      setUrl(r.url);
      setState("done");
    } catch {
      setState("idle");
      setErr("Ça n'a pas fonctionné. Réessaie ou écris à unlok.basketball@gmail.com.");
    }
  }

  return (
    <div id={`extrait-${book}`} className="flex h-full flex-col rounded-2xl border border-primary/50 bg-gradient-to-b from-primary/15 to-card p-6 md:p-8">
      <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-primary/40 px-3 py-1 font-mono text-xs uppercase tracking-[0.15em] text-primary">
        <span className="size-1.5 rounded-full bg-primary" /> {content.badge}
      </div>
      <h2 className="mt-4 font-display text-3xl uppercase leading-none">{content.title}</h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{content.description}</p>
      <ul className="mt-5 space-y-2">
        {content.steps.map(([number, name, duration]) => (
          <li key={number} className="flex items-center gap-3 text-sm">
            <span className="grid size-8 shrink-0 place-items-center rounded-md bg-primary font-display text-sm text-primary-foreground">{number}</span>
            <span className="flex-1">{name}</span>
            <span className="text-right font-mono text-xs text-muted-foreground">{duration}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-6">
        {state === "done" ? (
          <div>
            <p className="mb-3 text-sm font-semibold text-primary">Ton extrait est prêt !</p>
            <a href={url} download={content.filename} target="_blank" rel="noopener"
              className="inline-block w-full rounded-lg bg-primary px-6 py-3 text-center font-display uppercase text-primary-foreground shadow-glow">
              Télécharger le PDF
            </a>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <label className="sr-only" htmlFor={`email-extrait-${book}`}>Ton email</label>
            <input id={`email-extrait-${book}`} type="email" placeholder="Ton email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-foreground/30 bg-background px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
            {err && <p className="text-sm text-destructive">{err}</p>}
            <button type="submit" disabled={state === "sending"}
              className="w-full rounded-lg bg-primary px-6 py-3 font-display uppercase text-primary-foreground shadow-glow disabled:opacity-60">
              {state === "sending" ? "Préparation…" : "Télécharger l'extrait gratuit →"}
            </button>
            <p className="text-xs text-muted-foreground">Gratuit, en PDF. Ton email sert à te tenir au courant des nouveautés Unlok.</p>
          </form>
        )}
      </div>
    </div>
  );
}
