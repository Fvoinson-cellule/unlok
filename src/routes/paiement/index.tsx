import { createFileRoute } from "@tanstack/react-router";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { useState } from "react";

import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { EXPRESS_PRODUCTS, isExpressProduct, type ExpressProduct } from "@/lib/express-payment";
import { createExpressCheckout } from "@/lib/payments.functions";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";

type Search = { formule?: ExpressProduct; nb?: number };

export const Route = createFileRoute("/paiement/")({
  validateSearch: (s: Record<string, unknown>): Search => {
    const nb = Number(s["nb"]);
    const f = s["formule"];
    const out: Search = {};
    if (isExpressProduct(f)) out.formule = f;
    if (nb >= 1 && nb <= 6) out.nb = Math.floor(nb);
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

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const input =
  "w-full rounded-md border border-border bg-card px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none";

function Paiement() {
  const search = Route.useSearch();
  const [product, setProduct] = useState<ExpressProduct>(search.formule ?? "seance");
  const [qty, setQty] = useState(search.nb ?? 1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const item = EXPRESS_PRODUCTS[product];
  const quantity = item.card ? 1 : qty;
  const total = item.price * quantity;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (fullName.trim().length < 2) return setError("Indique ton prénom et ton nom.");
    if (!EMAIL.test(email.trim())) return setError("Entre une adresse email valide.");
    if (!terms) return setError("Merci d'accepter les conditions générales de vente.");
    try {
      getStripeEnvironment();
    } catch {
      return setError("Le paiement en ligne n'est pas disponible ici. Écris à unlok.basketball@gmail.com.");
    }
    setReady(true);
  }

  async function fetchClientSecret() {
    const r = await createExpressCheckout({
      data: {
        product,
        quantity,
        customerEmail: email.trim(),
        fullName,
        note,
        returnUrl: `${window.location.origin}/paiement/merci`,
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

  return (
    <div className="min-h-screen bg-background text-foreground font-body antialiased">
      <SiteNav />
      <main className="mx-auto max-w-2xl px-5 py-16 md:py-24">
        <p className="text-sm font-medium uppercase tracking-widest text-primary">Paiement express</p>
        <h1 className="mt-3 font-display text-5xl uppercase leading-none md:text-6xl">Régler ma séance</h1>
        <p className="mt-4 text-muted-foreground">
          Ta séance est déjà programmée avec Florian ? Choisis ce que tu règles et paie en quelques secondes.
        </p>

        {ready ? (
          <div className="mt-10 space-y-4">
            <div className="flex items-center justify-between rounded-md border border-border bg-card p-4 text-sm">
              <span>
                {item.label}
                {quantity > 1 ? ` × ${quantity}` : ""} · {fullName}
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
        ) : (
          <form onSubmit={submit} className="mt-10 space-y-6">
            <fieldset>
              <legend className="mb-3 text-sm font-medium uppercase tracking-wide">Je règle</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                {(Object.keys(EXPRESS_PRODUCTS) as ExpressProduct[]).map((k) => {
                  const p = EXPRESS_PRODUCTS[k];
                  const on = k === product;
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => setProduct(k)}
                      aria-pressed={on}
                      className={`rounded-md border p-4 text-left transition-colors ${
                        on ? "border-primary bg-primary/10" : "border-border bg-card hover:border-primary/60"
                      }`}
                    >
                      <span className="block font-display text-xl uppercase">{p.label}</span>
                      <span className="text-sm text-muted-foreground">{p.price} €</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            {!item.card && (
              <div>
                <span className="mb-2 block text-sm font-medium uppercase tracking-wide">Nombre de personnes</span>
                <div className="inline-flex items-center gap-4 rounded-md border border-border bg-card px-2 py-1">
                  <button type="button" aria-label="Moins" className="px-3 py-1 text-xl" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                    −
                  </button>
                  <span className="w-6 text-center font-medium">{qty}</span>
                  <button type="button" aria-label="Plus" className="px-3 py-1 text-xl" onClick={() => setQty((q) => Math.min(6, q + 1))}>
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="grid gap-4">
              <input className={input} placeholder="Prénom et nom" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              <input className={input} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input
                className={input}
                placeholder="Date de la séance ou précision (facultatif)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

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

            {error && <p className="text-sm text-destructive">{error}</p>}

            <button
              type="submit"
              className="w-full rounded-md bg-primary px-6 py-4 font-display text-xl uppercase text-primary-foreground shadow-[0_0_30px_-8px_hsl(var(--primary))]"
            >
              Payer {total} €
            </button>
          </form>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
