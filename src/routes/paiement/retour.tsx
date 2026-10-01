import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { getBookingByCheckoutSession } from "@/lib/payments.functions";

type RetourSearch = { session_id?: string };

export const Route = createFileRoute("/paiement/retour")({
  validateSearch: (search: Record<string, unknown>): RetourSearch => ({
    session_id: typeof search.session_id === "string" ? search.session_id : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Paiement confirmé · UNLOK" },
      { name: "description", content: "Confirmation de ta réservation UNLOK après paiement." },
      { property: "og:title", content: "Paiement confirmé · UNLOK" },
      { property: "og:description", content: "Confirmation de ta réservation UNLOK après paiement." },
    ],
  }),
  component: RetourPaiement,
});

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Europe/Paris",
  }).format(new Date(iso));
}

function labelFor(type: string) {
  if (type === "trial") return "Séance d'essai";
  if (type === "subscription") return "Abonnement";
  return "Séance sur carte";
}

function RetourPaiement() {
  const { session_id: sessionId } = Route.useSearch();

  const query = useQuery({
    queryKey: ["checkout-return", sessionId],
    queryFn: () => getBookingByCheckoutSession({ data: { sessionId: sessionId as string } }),
    enabled: Boolean(sessionId),
    staleTime: 10_000,
  });

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-6 py-20">
      <div className="w-full max-w-xl">
        {!sessionId ? (
          <div className="rounded-lg border border-border/60 bg-card p-8 text-center">
            <p className="text-xs font-medium uppercase text-primary">Paiement</p>
            <h1 className="mt-3 font-display text-3xl font-bold uppercase text-foreground">
              Retour de paiement introuvable.
            </h1>
            <p className="mt-4 text-sm text-muted-foreground">
              Si tu viens de payer, ta réservation est bien enregistrée. Reviens sur la page de
              réservation ou écris-nous pour vérifier.
            </p>
            <Link
              to="/offre"
              className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold uppercase text-primary-foreground shadow-glow transition hover:brightness-110"
            >
              Retour au site
            </Link>
          </div>
        ) : query.isPending ? (
          <div className="h-64 animate-pulse rounded-lg border border-border/60 bg-card" />
        ) : "error" in (query.data ?? {}) || !query.data || !("booking" in query.data) ? (
          <div className="rounded-lg border border-border/60 bg-card p-8 text-center">
            <p className="text-xs font-medium uppercase text-primary">Paiement</p>
            <h1 className="mt-3 font-display text-3xl font-bold uppercase text-foreground">
              On n'a pas retrouvé ta réservation.
            </h1>
            <p className="mt-4 text-sm text-muted-foreground">
              Écris-nous à unlok.basketball@gmail.com, on vérifie tout de suite.
            </p>
            <Link
              to="/offre"
              className="mt-6 inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-semibold uppercase text-foreground transition-colors hover:bg-accent"
            >
              Retour au site
            </Link>
          </div>
        ) : (
          (() => {
            const booking = query.data.booking;
            return (
              <div className="rounded-lg border border-primary/50 bg-card p-8">
                <p className="text-xs font-medium uppercase text-primary">
                  {booking.paid ? "Paiement confirmé" : "Paiement en cours de confirmation"}
                </p>
                <h1 className="mt-3 font-display text-3xl font-bold uppercase leading-tight text-foreground">
                  {labelFor(booking.type)} · {booking.dayLabel ?? ""}
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  {booking.sessionDate ? `${formatDate(booking.sessionDate)} · ` : ""}
                  {booking.timeLabel ?? ""} {booking.location ? `· ${booking.location}` : ""}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {booking.paid
                    ? "Ta place est confirmée. À très vite sur le terrain, apporte ta tenue de basket et ta gourde."
                    : "Ton paiement est en cours de validation, ta place est bloquée. Tu recevras la confirmation dans quelques instants."}
                </p>
                {booking.cardRemaining !== null ? (
                  <p className="mt-4 rounded-md border border-border/60 bg-background/60 p-4 text-sm text-foreground">
                    Il te reste {booking.cardRemaining} séance{booking.cardRemaining > 1 ? "s" : ""}
                    {booking.cardExpiresOn ? `, valables jusqu'au ${formatDate(booking.cardExpiresOn)}` : ""}.
                  </p>
                ) : null}
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    to="/"
                    className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold uppercase text-primary-foreground shadow-glow transition hover:brightness-110"
                  >
                    Retour au site
                  </Link>
                  <a
                    href="mailto:unlok.basketball@gmail.com?subject=Réservation%20UNLOK"
                    className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-semibold uppercase text-foreground transition-colors hover:bg-accent"
                  >
                    Une question ?
                  </a>
                </div>
              </div>
            );
          })()
        )}
      </div>
    </main>
  );
}
