import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import {
  bookDiscoverySession,
  listDiscoverySessions,
  type BookingResult,
} from "@/lib/discovery.functions";

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const REASONS = {
  full: "Cette séance est complète. Choisis l'autre créneau ou écris-nous pour la prochaine.",
  duplicate: "Cette adresse email est déjà inscrite à cette séance.",
  past: "Cette séance a déjà eu lieu.",
  not_found: "Ce créneau n'est plus disponible.",
  missing_fields: "Complète ton prénom, ton nom et ton email.",
  rejected: "Ton inscription n'a pas pu être enregistrée. Écris-nous directement.",
} as const;

const MAILTO =
  "mailto:unlok.basketball@gmail.com?subject=S%C3%A9ance%20d%C3%A9couverte%20UNLOK";

function Places({ booked, capacity }: { booked: number; capacity: number }) {
  const remaining = Math.max(capacity - booked, 0);
  const full = remaining === 0;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1" aria-hidden="true">
        {Array.from({ length: capacity }).map((_, index) => (
          <span
            key={index}
            className={
              index < remaining
                ? "h-3 w-1.5 bg-primary"
                : "h-3 w-1.5 bg-muted-foreground/25"
            }
          />
        ))}
      </div>
      <span
        className={
          full
            ? "text-xs text-muted-foreground"
            : remaining <= 2
              ? "text-xs text-primary"
              : "text-xs text-muted-foreground"
        }
      >
        {full
          ? "Complète"
          : `${remaining} place${remaining > 1 ? "s" : ""} restante${remaining > 1 ? "s" : ""}`}
      </span>
    </div>
  );
}

export function DiscoveryBooking({ className = "" }: { className?: string }) {
  const queryClient = useQueryClient();
  const fetchSessions = useServerFn(listDiscoverySessions);
  const submitBooking = useServerFn(bookDiscoverySession);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<
    Extract<BookingResult, { ok: true }> | null
  >(null);

  const { data, isPending, isError } = useQuery({
    queryKey: ["discovery-sessions"],
    queryFn: () => fetchSessions(),
    staleTime: 20_000,
  });

  const sessions = data ?? [];
  const active =
    sessions.find((session) => session.id === selectedId) ??
    sessions.find((session) => session.remaining > 0) ??
    null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const cleanName = fullName.trim();
    const cleanEmail = email.trim();
    const nextNameError =
      cleanName.length < 2 ? "Indique ton prénom et ton nom." : null;
    const nextEmailError = EMAIL_PATTERN.test(cleanEmail)
      ? null
      : "Entre une adresse email valide.";

    setNameError(nextNameError);
    setEmailError(nextEmailError);
    if (nextNameError || nextEmailError || !active) return;

    setIsSubmitting(true);
    try {
      const result = await submitBooking({
        data: {
          sessionId: active.id,
          fullName: cleanName,
          email: cleanEmail,
          phone: phone.trim(),
          website,
        },
      });

      if (!result.ok) {
        setFormError(REASONS[result.reason] ?? REASONS.rejected);
        return;
      }

      setConfirmation(result);
      setPhone("");
      setWebsite("");
      queryClient.invalidateQueries({ queryKey: ["discovery-sessions"] });
    } catch {
      setFormError(
        "Le serveur n'a pas répondu. Réessaie dans un instant ou écris-nous.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section
      id="seance-decouverte"
      className={`border-t border-border/60 py-20 md:py-28 ${className}`}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase text-primary">
            Séance découverte
          </p>
          <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-[1.05] text-foreground md:text-5xl">
            Réserve ta place.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            6 joueurs maximum par séance, 15 € la séance d'une heure. Ton
            inscription bloque ta place, le paiement la confirme.
          </p>
        </div>

        {isPending ? (
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[0, 1].map((index) => (
              <div
                key={index}
                className="h-32 animate-pulse rounded-lg border border-border/60 bg-card"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="mt-10 rounded-lg border border-border/60 bg-card p-6 text-sm text-muted-foreground">
            Les créneaux ne se chargent pas. Écris-nous à{" "}
            <a href={MAILTO} className="text-primary underline-offset-4 hover:underline">
              unlok.basketball@gmail.com
            </a>{" "}
            et on te répond tout de suite.
          </div>
        ) : sessions.length === 0 ? (
          <div className="mt-10 rounded-lg border border-border/60 bg-card p-6 text-sm text-muted-foreground">
            Aucune séance découverte programmée pour l'instant. Écris-nous à{" "}
            <a href={MAILTO} className="text-primary underline-offset-4 hover:underline">
              unlok.basketball@gmail.com
            </a>{" "}
            et on te préviendra de la prochaine date.
          </div>
        ) : (
          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,32rem)]">
            <div className="space-y-6">
            <fieldset className="space-y-3">
              <legend className="sr-only">Choisis ton créneau</legend>
              {sessions.map((session) => {
                const isActive = active?.id === session.id;
                const full = session.remaining === 0;

                return (
                  <label
                    key={session.id}
                    className={`flex cursor-pointer flex-col gap-3 rounded-lg border p-5 transition-colors ${
                      full
                        ? "cursor-not-allowed border-border/40 bg-card/40 opacity-60"
                        : isActive
                          ? "border-primary/70 bg-card"
                          : "border-border/60 bg-card hover:border-primary/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="discovery-session"
                      value={session.id}
                      checked={isActive}
                      disabled={full}
                      onChange={() => {
                        setSelectedId(session.id);
                        setConfirmation(null);
                        setFormError(null);
                      }}
                      className="sr-only"
                    />
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-display text-2xl font-bold uppercase text-foreground">
                        {session.dayLabel}
                      </span>
                      <span className="font-display text-2xl font-bold uppercase text-primary">
                        {session.timeLabel}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="text-sm text-muted-foreground">
                        {session.location}
                      </span>
                      <Places
                        booked={session.booked}
                        capacity={session.capacity}
                      />
                    </div>
                  </label>
                );
              })}
            </fieldset>
            <dl className="grid grid-cols-[7.5rem_1fr] gap-x-6 gap-y-3 border-t border-border/60 pt-5 text-sm">
              <dt className="text-muted-foreground">Format</dt>
              <dd className="text-foreground">1 heure, 6 joueurs maximum</dd>
              <dt className="text-muted-foreground">Tarif</dt>
              <dd className="text-foreground">15 €, réglés en ligne après inscription</dd>
              <dt className="text-muted-foreground">À apporter</dt>
              <dd className="text-foreground">Baskets, tenue d'entraînement, bouteille d'eau</dd>
            </dl>
            </div>

            {confirmation ? (
              <div className="rounded-lg border border-primary/50 bg-card p-6">
                <p className="text-xs font-medium uppercase text-primary">
                  Place réservée
                </p>
                <h3 className="mt-3 font-display text-2xl font-bold uppercase text-foreground">
                  {confirmation.session.dayLabel}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {confirmation.session.timeLabel} ·{" "}
                  {confirmation.session.location}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Ta place est bloquée. Termine en réglant les{" "}
                  {confirmation.session.priceEur} € pour la confirmer.
                </p>
                <a
                  href={confirmation.session.stripeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold uppercase text-primary-foreground shadow-[0_0_24px_-6px_var(--primary)] transition hover:brightness-110"
                >
                  Payer {confirmation.session.priceEur} €
                </a>
                <button
                  type="button"
                  onClick={() => setConfirmation(null)}
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
                <div>
                  <label
                    htmlFor="discovery-name"
                    className="text-xs font-medium uppercase text-muted-foreground"
                  >
                    Prénom et nom
                  </label>
                  <input
                    id="discovery-name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    maxLength={80}
                    autoComplete="name"
                    aria-invalid={Boolean(nameError)}
                    className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:border-primary"
                  />
                  {nameError ? (
                    <p className="mt-1 text-xs text-primary">{nameError}</p>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor="discovery-email"
                    className="text-xs font-medium uppercase text-muted-foreground"
                  >
                    Email
                  </label>
                  <input
                    id="discovery-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    maxLength={160}
                    autoComplete="email"
                    aria-invalid={Boolean(emailError)}
                    className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:border-primary"
                  />
                  {emailError ? (
                    <p className="mt-1 text-xs text-primary">{emailError}</p>
                  ) : null}
                </div>

                <div>
                  <label
                    htmlFor="discovery-phone"
                    className="text-xs font-medium uppercase text-muted-foreground"
                  >
                    Téléphone (facultatif)
                  </label>
                  <input
                    id="discovery-phone"
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    maxLength={20}
                    autoComplete="tel"
                    className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:border-primary"
                  />
                </div>

                <input
                  type="text"
                  name="website"
                  value={website}
                  onChange={(event) => setWebsite(event.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="absolute left-[-9999px] h-0 w-0 opacity-0"
                />

                {formError ? (
                  <p className="text-xs text-primary">{formError}</p>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting || !active}
                  className="w-full rounded-md bg-primary px-6 py-3 text-sm font-semibold uppercase text-primary-foreground shadow-[0_0_24px_-6px_var(--primary)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting
                    ? "Envoi en cours"
                    : "Valider mon inscription · 15 €"}
                </button>

                <p className="text-xs text-muted-foreground">
                  Aucun compte à créer. Tes coordonnées servent uniquement à
                  Florian pour t'envoyer les informations de la séance.
                </p>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
