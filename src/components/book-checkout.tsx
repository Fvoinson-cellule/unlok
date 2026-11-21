import { Link } from "@tanstack/react-router";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { createBookCheckout, getBookDownload } from "@/lib/books.functions";
import type { BookKey, BookProduct } from "@/lib/pricing";

export function CheckoutForm({ product, currentBook, returnPath = "/coach" }: { product: BookProduct; currentBook: BookKey; returnPath?: "/coach" | "/extrait-tir" }) {
  const [email, setEmail] = useState("");
  const [cgv, setCgv] = useState(false);
  const [open, setOpen] = useState(false);
  const [err, setErr] = useState("");
  const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) && cgv;

  async function fetchClientSecret() {
    const result = await createBookCheckout({
      data: {
        product,
        email,
        returnUrl: `${window.location.origin}${returnPath}?book=${currentBook}&product=${product}&session_id={CHECKOUT_SESSION_ID}`,
        environment: getStripeEnvironment(),
      },
    });
    if ("error" in result) throw new Error(result.error);
    return result.clientSecret;
  }

  if (open) {
    return (
      <div className="rounded-lg bg-card p-2">
        <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      </div>
    );
  }

  return (
    <form onSubmit={(event) => {
      event.preventDefault();
      try { getStripeEnvironment(); setOpen(true); }
      catch { setErr("Le paiement n'est pas disponible ici. Écris à unlok.basketball@gmail.com."); }
    }} className="space-y-3">
      <label className="block text-sm text-muted-foreground">
        Ton email (pour le reçu)
        <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)}
          className="mt-1 w-full rounded-md border border-foreground/30 bg-background px-3 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
      </label>
      <label className="flex items-start gap-2 text-sm text-muted-foreground">
        <input type="checkbox" checked={cgv} onChange={(event) => setCgv(event.target.checked)} className="mt-1" />
        <span>J'accepte les <Link to="/cgv" className="underline">CGV</Link> et je demande l'accès immédiat au contenu numérique, en renonçant à mon droit de rétractation.</span>
      </label>
      {err && <p className="text-sm text-destructive">{err}</p>}
      <Button disabled={!valid} className="inline-flex h-auto w-full items-center justify-center gap-2 whitespace-normal rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:-translate-y-0.5 disabled:opacity-40">
        {product === "pack" ? "Acheter le pack" : "Acheter le book"} <span>→</span>
      </Button>
    </form>
  );
}

export function BookDownload({ product, sessionId }: { product: BookProduct; sessionId: string }) {
  const [downloads, setDownloads] = useState<Array<{ label: string; url: string; filename: string }>>([]);
  const [err, setErr] = useState(false);

  useEffect(() => {
    try {
      getBookDownload({ data: { product, sessionId, environment: getStripeEnvironment() } })
        .then((result) => ("downloads" in result ? setDownloads(result.downloads) : setErr(true)))
        .catch(() => setErr(true));
    } catch { setErr(true); }
  }, [product, sessionId]);

  if (err) {
    return <p className="text-sm text-muted-foreground">Paiement introuvable. Écris à <a className="underline" href="mailto:unlok.basketball@gmail.com">unlok.basketball@gmail.com</a>, je t'envoie ton contenu.</p>;
  }

  return (
    <div className="rounded-lg border border-primary/40 bg-primary/10 p-5">
      <p className="font-display text-2xl uppercase">Merci, paiement reçu !</p>
      <p className="mt-1 text-sm text-muted-foreground">{product === "pack" ? "Tes deux books sont prêts." : "Ton book est prêt."}</p>
      {downloads.length ? (
        <div className="mt-4 grid gap-2">
          {downloads.length > 1 && (
            <Button type="button" variant="outline" onClick={() => downloads.forEach((d, i) => setTimeout(() => {
              const a = document.createElement("a"); a.href = d.url; a.download = d.filename; a.target = "_blank"; a.rel = "noopener";
              document.body.appendChild(a); a.click(); a.remove();
            }, i * 800))}
              className="h-auto whitespace-normal rounded-lg border-2 border-primary px-5 py-3 text-center text-sm font-semibold uppercase text-primary shadow-glow">
              Tout télécharger · les {downloads.length} books
            </Button>
          )}
          {downloads.map((download) => (
            <a key={download.url} href={download.url} download={download.filename} target="_blank" rel="noopener"
              className="rounded-lg bg-primary px-5 py-3 text-center text-sm font-semibold uppercase text-primary-foreground shadow-glow">
              Télécharger · {download.label}
            </a>
          ))}
        </div>
      ) : <p className="mt-4 text-sm">Vérification du paiement…</p>}
    </div>
  );
}

