import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { CoachingBooking } from "@/components/coaching-booking";

export const Route = createFileRoute("/reservation")({
  head: () => ({
    meta: [
      { title: "Réservation · Unlok · Réserve ta séance avec ta carte" },
      {
        name: "description",
        content:
          "Tu as une carte de séances Unlok ? Choisis ton créneau et ta date, ton solde est décompté automatiquement.",
      },
      { property: "og:title", content: "Réservation · Unlok" },
      {
        property: "og:description",
        content: "Réserve ta séance de coaching basket avec ta carte Unlok, en quelques secondes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Reservation,
});

function Reservation() {
  return (
    <div className="min-h-screen bg-background text-foreground font-body antialiased">
      <SiteNav />
      <CoachingBooking initialType="card_session" />
      <SiteFooter />
    </div>
  );
}
