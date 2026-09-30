import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState } from "react";

import {
  bookCoachingSlot,
  listCoachingSlots,
  type BookingType,
  type CoachingReason,
  type CoachingSession,
  type CoachingSlot,
} from "@/lib/coaching";

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const MAILTO = "mailto:unlok.basketball@gmail.com?subject=Inscription%20UNLOK";

const REASONS: Record<CoachingReason, string> = {
  full: "Cette séance est complète. Choisis une autre date ou écris-nous pour la liste d'attente.",
  duplicate: "Cette adresse email est déjà inscrite sur cette séance.",
  past: "Cette séance a déjà eu lieu.",
  not_found: "Ce créneau n'est plus disponible.",
  missing_fields: "Complète ton prénom, ton nom et ton email.",
  invalid_email: "Cette adresse email n'est pas valide.",
  invalid_type: "Choisis séance d'essai ou abonnement.",
  schedule_pending: "L'horaire de ce créneau n'est pas encore fixé.",
  season_ended: "La saison est terminée pour ce créneau.",
  rejected: "Ton inscription n'a pas pu être enregistrée. Écris-nous directement.",
};

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Europe/Paris",
  }).format(new Date(iso));
}

function formatShortDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "Europe/Paris",
  }).format(new Date(iso));
}

function Places({ remaining, capacity }: { remaining: number; capacity: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1" aria-hidden="true">
        {Array.from({ length: capacity }).map((_, i) => (
          <span
            key={i}
            className={i < remaining ? "h-3 w-1.5 bg-primary" : "h-3 w-1.5 bg-muted-foreground/25"}
          />
        ))}
      </div>
      <span className={remaining > 0 && remaining <= 2 ? "text-xs text-primary" : "text-xs text-muted-foreground"}>
        {remaining === 0
          ? "Complet"
          : `${remaining} place${remaining > 1 ? "s" : ""} restante${remaining > 1 ? "s" : ""}`}
      </span>
    </div>
  );
}

const inputClass =
  "mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:border-primary";

export function CoachingBooking() {
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [type, setType] = useState<BookingType>("trial");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ slot: CoachingSlot; type: BookingType; date: string | null } | null>(
    null,
  );

  const { data, isPending, isError } = useQuery({
    queryKey: ["coaching-slots"],
    queryFn: listCoachingSlots,
    staleTime: 20_000,
  });

  const slots = data ?? [];
  const slotSessions = (s: CoachingSlot): CoachingSession[] => s.sessions ?? [];
  const bookable = (s: CoachingSlot) => s.bookingOpen && slotSessions(s).some((x) => x.remaining > 0);
  const active = slots.find((s) => s.id === selectedId && bookable(s)) ?? slots.find(bookable) ?? null;

  const sessions: CoachingSession[] = active ? slotSessions(active) : [];
  const session =
    sessions.find((s) => s.date === selectedDate) ?? sessions.find((s) => s.remaining > 0) ?? sessions[0] ?? null;
  const price = active ? (type === "trial" ? active.trialPrice : active.subscriptionPrice) : 0;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (fullName.trim().length < 2) return setError("Indique ton prénom et ton nom.");
    if (!EMAIL_PATTERN.test(email.trim())) return setError("Entre une adresse email valide.");
    if (!acceptTerms) return setError("Merci d'accepter les conditions générales de vente pour continuer.");
    if (!active) return;

    const date = session?.date ?? null;

    setSubmitting(true);
    try {
      const result = await bookCoachingSlot({
        slotId: active.id,
        type,
        sessionDate: date,
        fullName,
        email,
        phone,
        website,
      });
      if (!result.ok) return setError(REASONS[result.reason] ?? REASONS.rejected);
      setDone({ slot: active, type, date: date ?? sessions[0]?.date ?? null });
      setPhone("");
      queryClient.invalidateQueries({ queryKey: ["coaching-slots"] });
    } catch {
      setError("Le serveur n'a pas répondu. Réessaie dans un instant ou écris-nous.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="seance-decouverte" className="scroll-mt-20 border-t border-border/60 py-20 md:py-28">
      <span id="creneaux" className="block scroll-mt-20" />
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase text-primary">Inscription</p>
          <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.05] text-foreground md:text-5xl">
            Réserve ta place.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Choisis ton créneau et ta date, puis une séance d'essai (15 €) ou l'abonnement (100 € / mois).
            Les essais se font pendant les séances des abonnés, dans la limite de 6 joueurs.
          </p>
        </div>

        {isPending ? (
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-lg border border-border/60 bg-card" />
            ))}
          </div>
        ) : isError || slots.length === 0 ? (
          <div className="mt-10 rounded-lg border border-border/60 bg-card p-6 text-sm text-muted-foreground">
            Les créneaux ne se chargent pas. Écris-nous à{" "}
            <a href={MAILTO} className="text-primary underline-offset-4 hover:underline">
              unlok.basketball@gmail.com
            </a>
            .
          </div>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)]">
            <fieldset className="space-y-3">
              <legend className="sr-only">Choisis ton créneau</legend>
              {slots.map((slot) => {
                const isActive = active?.id === slot.id;
                const disabled = !bookable(slot);
                const next = slotSessions(slot)[0] ?? null;
                return (
                  <label
                    key={slot.id}
                    className={`flex flex-col gap-3 rounded-lg border p-5 transition-colors ${
                      disabled
                        ? "cursor-not-allowed border-border/40 bg-card/40 opacity-60"
                        : isActive
                          ? "cursor-pointer border-primary/70 bg-card"
                          : "cursor-pointer border-border/60 bg-card hover:border-primary/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="coaching-slot"
                      checked={isActive}
                      disabled={disabled}
                      onChange={() => {
                        setSelectedId(slot.id);
                        setSelectedDate(null);
                        setDone(null);
                        setError(null);
                      }}
                      className="sr-only"
                    />
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-display text-2xl font-bold uppercase text-foreground">
                        {slot.dayLabel}
                      </span>
                      <span className="font-display text-xl font-bold uppercase text-primary">
                        {slot.timeLabel}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="text-sm text-muted-foreground">{slot.location}</span>
                      {slot.bookingOpen && next ? (
                        <Places remaining={next.remaining} capacity={next.capacity} />
                      ) : (
                        <span className="text-xs text-muted-foreground">Ouverture prochainement</span>
                      )}
                    </div>
                    {slot.bookingOpen && slotSessions(slot).length > 0 ? (
                      <span className="text-xs text-muted-foreground">
                        Prochaines séances :{" "}
                        {slotSessions(slot).map((s) => formatShortDate(s.at)).join(" · ")}
                      </span>
                    ) : null}
                  </label>
                );
              })}
            </fieldset>

            {done ? (
              <div className="rounded-lg border border-primary/50 bg-card p-6">
                <p className="text-xs font-medium uppercase text-primary">Place réservée</p>
                <h3 className="mt-3 font-display text-2xl font-bold uppercase text-foreground">
                  {done.type === "trial" ? "Séance d'essai" : "Abonnement"} · {done.slot.dayLabel}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {done.date ? `${formatDate(done.date)} · ` : ""}
                  {done.slot.timeLabel} · {done.slot.location}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Ta place est bloquée. Termine en réglant le paiement pour la confirmer.
                </p>
                <a
                  href={done.type === "trial" ? done.slot.trialUrl : done.slot.subscriptionUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold uppercase text-primary-foreground shadow-glow transition hover:brightness-110"
                >
                  Payer{" "}
                  {done.type === "trial"
                    ? `${done.slot.trialPrice} €`
                    : `${done.slot.subscriptionPrice} € / mois`}
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setDone(null);
                    setAcceptTerms(false);
                  }}
                  className="mt-3 block text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Inscrire quelqu'un d'autre
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="space-y-4 rounded-lg border border-border/60 bg-card p-6"
              >
                <div role="radiogroup" aria-label="Formule" className="grid grid-cols-2 gap-2">
                  {(
                    [
                      ["trial", "Séance d'essai", active ? `${active.trialPrice} €` : "15 €"],
                      ["subscription", "Abonnement", active ? `${active.subscriptionPrice} € / mois` : "100 € / mois"],
                    ] as const
                  ).map(([value, label, sub]) => (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={type === value}
                      onClick={() => setType(value)}
                      className={`rounded-md border px-3 py-3 text-left transition-colors ${
                        type === value
                          ? "border-primary bg-primary/10"
                          : "border-border/60 hover:border-primary/40"
                      }`}
                    >
                      <span className="block text-sm font-semibold uppercase text-foreground">{label}</span>
                      <span className="block text-xs text-muted-foreground">{sub}</span>
                    </button>
                  ))}
                </div>

                {sessions.length > 0 ? (
                  <div role="radiogroup" aria-label="Date de la séance">
                    <span className="text-xs font-medium uppercase text-muted-foreground">
                      {type === "trial" ? "Date de la séance" : "Première séance"}
                    </span>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      {sessions.map((s) => {
                        const isOn = session?.date === s.date;
                        const full = s.remaining === 0;
                        return (
                          <button
                            key={s.date}
                            type="button"
                            role="radio"
                            aria-checked={isOn}
                            disabled={full}
                            onClick={() => {
                              setSelectedDate(s.date);
                              setError(null);
                            }}
                            className={`rounded-md border px-3 py-3 text-left transition-colors ${
                              full
                                ? "cursor-not-allowed border-border/40 opacity-50"
                                : isOn
                                  ? "border-primary bg-primary/10"
                                  : "border-border/60 hover:border-primary/40"
                            }`}
                          >
                            <span className="block text-sm font-semibold text-foreground">
                              {formatShortDate(s.at)}
                            </span>
                            <span className="block text-xs text-muted-foreground">
                              {s.remaining === 0
                                ? "Complet"
                                : `${s.remaining} place${s.remaining > 1 ? "s" : ""}`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                <div>
                  <label htmlFor="coaching-name" className="text-xs font-medium uppercase text-muted-foreground">
                    Prénom et nom du joueur
                  </label>
                  <input id="coaching-name" value={fullName} onChange={(e) => setFullName(e.target.value)} maxLength={80} autoComplete="name" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="coaching-email" className="text-xs font-medium uppercase text-muted-foreground">
                    Email
                  </label>
                  <input id="coaching-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={160} autoComplete="email" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="coaching-phone" className="text-xs font-medium uppercase text-muted-foreground">
                    Téléphone (facultatif)
                  </label>
                  <input id="coaching-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={20} autoComplete="tel" className={inputClass} />
                </div>
                <input
                  type="text"
                  name="website"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-[-9999px] h-0 w-0 opacity-0"
                />

                <label htmlFor="coaching-cgv" className="flex items-start gap-3 text-xs text-muted-foreground">
                  <input
                    id="coaching-cgv"
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => {
                      setAcceptTerms(e.target.checked);
                      setError(null);
                    }}
                    className="mt-0.5 size-4 shrink-0 accent-[var(--color-primary)]"
                  />
                  <span>
                    J'ai lu et j'accepte les{" "}
                    <Link
                      to="/cgv"
                      target="_blank"
                      className="text-primary underline underline-offset-4"
                    >
                      conditions générales de vente
                    </Link>
                    .
                  </span>
                </label>

                {error ? <p className="text-xs text-primary">{error}</p> : null}

                <button
                  type="submit"
                  disabled={submitting || !active || !acceptTerms}
                  className="w-full rounded-md bg-primary px-6 py-3 text-sm font-semibold uppercase text-primary-foreground shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? "Envoi en cours"
                    : `Valider · ${price} €${type === "subscription" ? " / mois" : ""}`}
                </button>
                <p className="text-xs text-muted-foreground">
                  {type === "trial"
                    ? "Choisis la date qui t'arrange parmi les prochaines séances."
                    : `Ta place est réservée pour la saison, dès le ${
                        session ? formatDate(session.at) : "prochain créneau"
                      }.`}{" "}
                  Tes coordonnées servent uniquement à Florian pour organiser la séance.
                </p>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
