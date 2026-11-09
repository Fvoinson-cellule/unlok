import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { useState } from "react";

import { createCoachingOrder, type Participant } from "@/lib/payments.functions";
import { FORMULES, MAX_PEOPLE, formatEuro, pricePerPerson, type Formule } from "@/lib/pricing";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const field =
  "w-full rounded-lg border border-foreground/30 bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none";
const empty = (): Participant => ({ firstName: "", lastName: "", age: "", club: "", email: "", phone: "" });

export function OrderForm({
  initialFormule = "essai",
  initialPeople = 1,
  showNote = false,
}: {
  initialFormule?: Formule;
  initialPeople?: number;
  showNote?: boolean;
}) {
  const [formule, setFormule] = useState<Formule>(initialFormule);
  const [groupSize, setGroupSize] = useState(Math.min(MAX_PEOPLE, Math.max(1, initialPeople)));
  const [paidFor, setPaidFor] = useState(1);
  const isTrial = formule === "essai";
  const maxPaid = isTrial ? MAX_PEOPLE : groupSize;
  const people = Math.min(paidFor, maxPaid);
  const setPeople = (f: (q: number) => number) => setPaidFor(Math.min(maxPaid, Math.max(1, f(people))));
  const [participants, setParticipants] = useState<Participant[]>(() =>
    Array.from({ length: MAX_PEOPLE }, empty),
  );
  const [note, setNote] = useState("");
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const list = participants.slice(0, people);
  const unit = pricePerPerson(formule, groupSize);
  const total = unit * people;
  const openPlaces = isTrial ? 0 : groupSize - people;

  function update(i: number, key: keyof Participant, value: string) {
    setParticipants((prev) => prev.map((p, j) => (j === i ? { ...p, [key]: value } : p)));
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (isTrial) {
      const names = list.map((p) => p.firstName.trim().toLowerCase());
      if (new Set(names).size !== names.length)
        return setError("Une seule séance d'essai par joueur : deux joueurs ont le même prénom.");
    }
    for (const [i, p] of list.entries()) {
      const who = people > 1 ? ` (joueur ${i + 1})` : "";
      if (!p.firstName.trim() || !p.lastName.trim()) return setError(`Indique le prénom et le nom${who}.`);
      const age = Number(p.age);
      if (!(age >= 5 && age <= 99)) return setError(`Indique un âge valide${who}.`);
      if (i > 0) continue;
      if (!p.club.trim()) return setError("Indique le club (ou « aucun »).");
      if (!EMAIL.test(p.email.trim())) return setError("Entre une adresse email valide.");
      if (p.phone.replace(/\D/g, "").length < 10) return setError("Entre un numéro de téléphone valide.");
    }
    if (!terms) return setError("Merci d'accepter les conditions générales de vente.");
    try {
      getStripeEnvironment();
    } catch {
      return setError("Le paiement en ligne n'est pas disponible ici. Écris à unlok.basketball@gmail.com.");
    }
    setReady(true);
  }

  async function fetchClientSecret() {
    const r = await createCoachingOrder({
      data: {
        formule,
        groupSize,
        people,
        participants: list.map((p, i) => (i === 0 ? p : { ...p, club: "", email: "", phone: "" })),
        customerEmail: (list[0]?.email ?? "").trim(),
        note,
        returnUrl: `${window.location.origin}/paiement/merci${
          openPlaces > 0 ? `?formule=${formule}&nb=${groupSize}&reste=${openPlaces}` : ""
        }`,
        environment: getStripeEnvironment(),
      },
    });
    if ("error" in r) {
      setError(r.error);
      setReady(false);
      throw new Error(r.error);
    }
    return r.clientSecret;
  }

  if (ready) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4 text-sm">
          <span>
            {FORMULES[formule].label}{!isTrial ? ` · séance à ${groupSize}` : ""} · {people} pers. · {formatEuro(total)}
          </span>
          <button type="button" className="underline" onClick={() => setReady(false)}>
            Modifier
          </button>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      <fieldset>
        <legend className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-primary">1 · La formule</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {(Object.keys(FORMULES) as Formule[]).map((k) => {
            const on = k === formule;
            return (
              <button
                key={k}
                type="button"
                onClick={() => setFormule(k)}
                aria-pressed={on}
                className={`rounded-lg border p-4 text-left transition-colors ${
                  on ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/60"
                }`}
              >
                <span className="block font-display text-xl">{FORMULES[k].label}</span>
                <span className="text-sm text-muted-foreground">
                  {formatEuro(pricePerPerson(k, groupSize))} / pers. · 60 min{k.startsWith("carte") ? " par séance" : ""}
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {!isTrial && (
        <fieldset>
          <legend className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-primary">2 · Le format de la séance</legend>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[1, 2, 3, 4].map((n) => {
              const on = n === groupSize;
              return (
                <button
                  key={n}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setGroupSize(n)}
                  className={`rounded-lg border p-3 text-left transition-colors ${
                    on ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/60"
                  }`}
                >
                  <span className="block font-display text-lg">{n === 1 ? "Seul" : `À ${n}`}</span>
                  <span className="text-xs text-muted-foreground">{formatEuro(pricePerPerson("seance", n))} / pers. la séance</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {maxPaid > 1 && (
        <div>
          <span className="mb-3 block font-mono text-xs uppercase tracking-[0.15em] text-primary">
            {isTrial ? "2" : "3"} · Je paie pour
          </span>
          <div className="inline-flex items-center gap-4 rounded-lg border border-border bg-card px-2 py-1">
            <button type="button" aria-label="Moins" className="px-3 py-1 text-xl" onClick={() => setPeople((q) => q - 1)}>
              −
            </button>
            <span className="w-16 text-center font-medium">{people} pers.</span>
            <button type="button" aria-label="Plus" className="px-3 py-1 text-xl" onClick={() => setPeople((q) => q + 1)}>
              +
            </button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {isTrial
              ? "25 € par personne. Une seule séance d'essai par joueur."
              : "Paie seulement ta place ou celles de plusieurs joueurs du groupe. Remplis une fiche par personne payée."}
          </p>
        </div>
      )}

      <div className="space-y-6">
        <span className="block font-mono text-xs uppercase tracking-[0.15em] text-primary">
          {people > 1 ? "Les joueurs payés" : "Le joueur"}
        </span>
        {list.map((p, i) => (
          <fieldset key={i} className="rounded-lg border border-border p-4">
            <legend className="px-2 font-display text-lg">
              {i === 0 ? (people > 1 ? "Joueur 1 · contact" : "Joueur") : `Joueur ${i + 1}`}
            </legend>
            {i === 0 && people > 1 && (
              <p className="mb-3 text-xs text-muted-foreground">Florian utilisera cet email et ce téléphone pour tout le groupe.</p>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              <input className={field} placeholder="Prénom" value={p.firstName} onChange={(e) => update(i, "firstName", e.target.value)} />
              <input className={field} placeholder="Nom" value={p.lastName} onChange={(e) => update(i, "lastName", e.target.value)} />
              <input className={field} inputMode="numeric" placeholder="Âge" value={p.age} onChange={(e) => update(i, "age", e.target.value.replace(/\D/g, ""))} />
              {i === 0 && (
                <>
                  <input className={field} placeholder="Club" value={p.club} onChange={(e) => update(i, "club", e.target.value)} />
                  <input className={field} type="email" placeholder="Email" value={p.email} onChange={(e) => update(i, "email", e.target.value)} />
                  <input className={field} type="tel" placeholder="Téléphone" value={p.phone} onChange={(e) => update(i, "phone", e.target.value)} />
                </>
              )}
            </div>
          </fieldset>
        ))}
      </div>

      {showNote && (
        <input
          className={field}
          placeholder="Date de la séance ou précision (facultatif)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      )}

      <label className="flex items-start gap-3 text-sm text-muted-foreground">
        <input type="checkbox" className="mt-1 accent-primary" checked={terms} onChange={(e) => setTerms(e.target.checked)} />
        <span>
          J'accepte les{" "}
          <a href="/cgv" target="_blank" className="underline">
            conditions générales de vente
          </a>
          .
        </span>
      </label>

      {openPlaces > 0 && (
        <p className="rounded-lg border border-primary/40 bg-primary/10 p-3 text-sm">
          Tu paies {people === 1 ? "ta place" : `${people} places`}. Après le paiement, tu auras un lien à envoyer{" "}
          {openPlaces === 1 ? "à ton coéquipier pour qu'il paie sa part" : `à tes ${openPlaces} coéquipiers pour qu'ils paient leur part`} au même tarif.
        </p>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="rounded-lg border border-border bg-card p-4 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {formatEuro(unit)} × {people}
          </span>
          <strong className="font-display text-2xl text-primary">{formatEuro(total)}</strong>
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-primary px-6 py-4 font-display text-xl text-primary-foreground shadow-glow transition-all hover:-translate-y-0.5 hover:shadow-glow-lg"
      >
        Payer {formatEuro(total)}
      </button>
      <p className="text-center text-xs text-muted-foreground">
        Après le paiement, Florian te contacte pour fixer la date et le lieu de la séance.
      </p>
    </form>
  );
}
