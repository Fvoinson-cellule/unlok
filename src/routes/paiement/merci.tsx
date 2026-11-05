import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { isFormule, MAX_PEOPLE, type Formule } from "@/lib/pricing";

type Search = { formule?: Formule; nb?: number; reste?: number };
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
  validateSearch: (s: Record<string, unknown>): Search => {
    const out: Search = {};
    if (isFormule(s["formule"])) out.formule = s["formule"] as Formule;
    const nb = Number(s["nb"]);
    const reste = Number(s["reste"]);
    if (nb >= 1 && nb <= MAX_PEOPLE) out.nb = Math.floor(nb);
    if (reste >= 1 && reste <= MAX_PEOPLE) out.reste = Math.floor(reste);
    return out;
  },
  component: Merci,
});

function Merci() {
  const { formule, nb, reste } = Route.useSearch();
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (formule && nb && reste) setLink(`${window.location.origin}/paiement?formule=${formule}&nb=${nb}`);
  }, [formule, nb, reste]);
  const message = `Je viens de réserver notre séance Unlok à ${nb}. Paie ta place ici : ${link}`;
  return (
    <div className="min-h-screen bg-background text-foreground font-body antialiased">
      <SiteNav />
      <main className="mx-auto max-w-2xl px-5 py-24 text-center">
        <h1 className="font-display text-5xl uppercase md:text-6xl">Paiement reçu</h1>
        <p className="mt-4 text-muted-foreground">
          Merci ! Tu reçois le reçu par email. Ta séance est confirmée, à très vite sur le terrain.
        </p>
        {link && (
          <div className="mt-10 rounded-lg border border-primary/40 bg-primary/10 p-5 text-left">
            <p className="font-display text-xl uppercase">
              {reste === 1 ? "Ton coéquipier doit payer sa place" : `Tes ${reste} coéquipiers doivent payer leur place`}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Envoie-leur ce lien, le bon tarif est déjà choisi.</p>
            <p className="mt-3 break-all rounded-md border border-border bg-background p-3 text-sm">{link}</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(link).then(() => setCopied(true))}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium uppercase text-primary-foreground"
              >
                {copied ? "Lien copié" : "Copier le lien"}
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(message)}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-border px-4 py-2 text-sm font-medium uppercase"
              >
                Envoyer sur WhatsApp
              </a>
            </div>
          </div>
        )}
        <Link to="/" className="mt-8 inline-flex rounded-md bg-primary px-6 py-3 font-medium uppercase text-primary-foreground">
          Retour à l'accueil
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
