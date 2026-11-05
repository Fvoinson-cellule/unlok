import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/paiement/merci")({
  head: () => ({
    meta: [
      { title: "Paiement reçu · Unlok" },
      { name: "description", content: "Merci, ton paiement Unlok est bien reçu." },
      { property: "og:title", content: "Paiement reçu · Unlok" },
      { property: "og:description", content: "Ton paiement est confirmé. À très vite sur le terrain." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Merci,
});

function Merci() {
  return (
    <div className="min-h-screen bg-background text-foreground font-body antialiased">
      <SiteNav />
      <main className="mx-auto max-w-2xl px-5 py-24 text-center">
        <h1 className="font-display text-5xl uppercase md:text-6xl">Paiement reçu</h1>
        <p className="mt-4 text-muted-foreground">
          Merci ! Tu reçois le reçu par email. Ta séance est confirmée, à très vite sur le terrain.
        </p>
        <Link to="/" className="mt-8 inline-flex rounded-md bg-primary px-6 py-3 font-medium uppercase text-primary-foreground">
          Retour à l'accueil
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
