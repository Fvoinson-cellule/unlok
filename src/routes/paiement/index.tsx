import { createFileRoute } from "@tanstack/react-router";

import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { OrderForm } from "@/components/order-form";
import { MAX_PEOPLE, isFormule, type Formule } from "@/lib/pricing";

type Search = { formule?: Formule; nb?: number };

export const Route = createFileRoute("/paiement/")({
  validateSearch: (s: Record<string, unknown>): Search => {
    const nb = Number(s["nb"]);
    const f = s["formule"];
    const out: Search = {};
    if (isFormule(f)) out.formule = f;
    if (nb >= 1 && nb <= MAX_PEOPLE) out.nb = Math.floor(nb);
    return out;
  },
  head: () => ({
    meta: [
      { title: "Régler ma séance · Unlok" },
      { name: "description", content: "Paiement rapide et sécurisé d'une séance Unlok déjà convenue avec Florian." },
      { property: "og:title", content: "Régler ma séance · Unlok" },
      { property: "og:description", content: "Ta séance est programmée ? Règle-la en quelques secondes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Paiement,
});

function Paiement() {
  const search = Route.useSearch();
  return (
    <div className="min-h-screen bg-background text-foreground font-body antialiased">
      <SiteNav />
      <main className="mx-auto max-w-2xl px-5 py-16 md:py-24">
        <p className="font-mono text-xs uppercase tracking-[0.15em] text-primary">Paiement express</p>
        <h1 className="mt-3 font-display text-5xl leading-none md:text-6xl">Régler ma séance</h1>
        <p className="mt-4 mb-10 text-muted-foreground">
          Ta séance est déjà programmée avec Florian ? Choisis ce que tu règles et paie en quelques secondes.
        </p>
        <OrderForm initialFormule={search.formule ?? "seance"} initialPeople={search.nb ?? 1} showNote />
      </main>
      <SiteFooter />
    </div>
  );
}
