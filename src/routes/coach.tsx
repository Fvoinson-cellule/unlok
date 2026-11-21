import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { FreeEbook } from "@/components/free-ebook";
import { ReviewsSection } from "@/components/reviews-section";
import { CheckoutForm, BookDownload } from "@/components/book-checkout";
import { Button } from "@/components/ui/button";
import { Play, ArrowRight } from "lucide-react";
import { BOOKS, BOOK_PACK, isBookLaunch, type BookKey, type BookProduct } from "@/lib/pricing";

type CoachSearch = { book?: BookKey | undefined; product?: BookProduct | undefined; session_id?: string | undefined };

export const Route = createFileRoute("/coach")({
  head: () => ({
    meta: [
      { title: "Books pour coachs · RAMP, Tir et pack · Unlok" },
      { name: "description", content: "Books RAMP et Tir pour préparer tes entraînements : extraits vidéo et PDF gratuits, books à 14,90 € jusqu'au 31 décembre, ou pack des deux à 24,90 €." },
      { property: "og:title", content: "Books RAMP et Tir pour coachs · Unlok" },
      { property: "og:description", content: "70 exercices prêts à l'emploi, deux extraits gratuits et un pack des deux books à 24,90 €." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): CoachSearch => ({
    book: search["book"] === "tir" ? "tir" : search["book"] === "ramp" ? "ramp" : undefined,
    product: search["product"] === "pack" || search["product"] === "tir" || search["product"] === "ramp" ? search["product"] : undefined,
    session_id: typeof search["session_id"] === "string" ? search["session_id"] : undefined,
  }),
  component: Coach,
});

const CONTENT = {
  ramp: {
    title: "40 échauffements RAMP.",
    description: "Des échauffements prêts à l'emploi, pensés pour le basket, pour préparer le corps et la tête au jeu. Finis les tours de terrain.",
    badge: "Book complet · 40 échauffements",
    downloadNote: "PDF de 40 pages, téléchargement immédiat après paiement.",
    sectionEyebrow: "Le modèle RAMP",
    sectionTitle: "4 étapes, 20 minutes.",
    steps: [
      ["R", "Raise", "Élever la température, le rythme cardiaque et l'attention."],
      ["A", "Activate", "Activer les muscles clés du basket."],
      ["M", "Mobilise", "Mobiliser les articulations dans les amplitudes du jeu."],
      ["P", "Potentiate", "Monter en intensité pour être prêt dès le premier ballon."],
    ],
  },
  tir: {
    title: "30 exercices de tir.",
    description: "Des exercices pour tous les niveaux, jeunes et seniors, avec le but, la durée, le matériel, les consignes d'animation et des évolutions.",
    badge: "Book complet · 30 exercices",
    downloadNote: "PDF de 34 pages, téléchargement immédiat après paiement.",
    sectionEyebrow: "Dans le Book Tir",
    sectionTitle: "3 catégories + une boîte à outils.",
    steps: [
      ["01", "Précision et rythme", "12 exercices pour travailler la gestuelle, la répétition et le rythme, seul ou à deux."],
      ["02", "Tir sous opposition", "10 exercices pour lire son défenseur et tirer sous pression."],
      ["03", "Tir en équipe et jeux", "8 jeux compétitifs pour tirer sous la pression du score et des coéquipiers."],
      ["+", "Boîte à outils & bonus", "10 leviers pour faire évoluer chaque exercice."],
    ],
  },
} as const;

function Coach() {
  const search = Route.useSearch();
  const book = search.book ?? "ramp";
  const content = CONTENT[book];
  const returnedProduct = search.product ?? book;
  const [launch, setLaunch] = useState(true);
  useEffect(() => setLaunch(isBookLaunch()), []);

  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased selection:bg-primary/20">
      <SiteNav />

      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 pb-10 pt-16 md:pt-20">
          <div className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" /> Espace coach · Ressources PDF
          </div>
          <h1 className="mt-6 font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.92] tracking-tight text-balance rise">
            Les books <span className="text-primary">des coachs.</span>
          </h1>
          <p className="mt-6 max-w-[58ch] text-lg text-muted-foreground text-pretty">
            Des exercices prêts à l'emploi pour préparer tes séances. Choisis ton thème, teste gratuitement, puis télécharge le book complet.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-2 rounded-xl border border-border bg-card p-1.5 sm:w-fit" role="tablist" aria-label="Choisir un book">
            {(["ramp", "tir"] as const).map((key) => (
              <Link key={key} to="/coach" search={{ book: key }} role="tab" aria-selected={book === key}
                className={`rounded-lg px-4 py-3 text-center font-display text-xl uppercase transition-colors sm:px-8 ${book === key ? "bg-primary text-primary-foreground shadow-glow" : "text-muted-foreground hover:text-foreground"}`}>
                {BOOKS[key].label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
          <div className="mb-8 max-w-3xl">
            <div className="font-mono text-xs uppercase tracking-[0.15em] text-primary">{BOOKS[book].label}</div>
            <h2 className="mt-3 font-display text-4xl tracking-tight md:text-5xl">{content.title}</h2>
            <p className="mt-4 text-muted-foreground">{content.description}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {book === "ramp" ? <FreeEbook book="ramp" /> : (
              <div className="flex flex-col rounded-lg border border-primary/50 bg-card p-6 md:p-8">
                <Play className="size-10 text-primary" aria-hidden="true" />
                <p className="mt-5 font-mono text-xs uppercase text-primary">Extrait gratuit · Vidéo</p>
                <h2 className="mt-3 font-display text-3xl">Regarde 3 exercices du Book Tir en vidéo</h2>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">Moins de 3 minutes pour découvrir les exercices en action.</p>
                <Button asChild className="mt-auto h-auto whitespace-normal py-3 shadow-glow">
                  <Link to="/extrait-tir">Voir l'extrait <ArrowRight /></Link>
                </Button>
              </div>
            )}
            <div className="flex flex-col rounded-2xl border border-border bg-card p-6 md:p-8">
              <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-border px-3 py-1 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                <span className="size-1.5 rounded-full bg-primary" /> {content.badge}
              </div>
              <div className="mt-5 flex flex-wrap items-end gap-3">
                {launch ? (
                  <>
                    <span className="font-display text-5xl text-primary">{BOOKS[book].launchPrice}</span>
                    <span className="pb-1 text-lg text-muted-foreground line-through">{BOOKS[book].regularPrice}</span>
                    <span className="w-full text-sm text-muted-foreground">Prix de lancement jusqu'au 31 décembre</span>
                  </>
                ) : <span className="font-display text-5xl text-primary">{BOOKS[book].regularPrice}</span>}
              </div>
              <div className="mt-6 flex-1">
                {search.session_id && returnedProduct === book
                  ? <BookDownload product={book} sessionId={search.session_id} />
                  : <CheckoutForm product={book} currentBook={book} />}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">{content.downloadNote}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-primary/50 bg-gradient-to-br from-primary/20 via-card to-background">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 md:grid-cols-[1fr_0.8fr] md:items-center md:py-20">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.15em] text-primary">La formule la plus complète</div>
            <h2 className="mt-4 font-display text-4xl tracking-tight md:text-5xl">Le pack des deux books.</h2>
            <p className="mt-4 max-w-[52ch] text-muted-foreground">
              40 échauffements RAMP + 30 exercices de tir : 70 ressources pour construire tes séances, avec deux PDF à télécharger.
            </p>
            <ul className="mt-6 space-y-2 text-sm">
              <li><span className="mr-2 text-primary">✓</span> Book RAMP complet</li>
              <li><span className="mr-2 text-primary">✓</span> Book Tir complet</li>
              <li><span className="mr-2 text-primary">✓</span> Accès immédiat aux deux PDF après paiement</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-primary/50 bg-background/85 p-6 shadow-glow md:p-8">
            <div className="font-mono text-xs uppercase tracking-[0.15em] text-primary">Pack RAMP + Tir</div>
            <div className="mb-6 mt-3 flex flex-wrap items-end gap-3">
              <span className="font-display text-5xl text-primary">{BOOK_PACK.price}</span>
              <span className="pb-1 text-lg text-muted-foreground line-through">{launch ? "29,80 €" : "49,80 €"}</span>
            </div>
            {search.session_id && returnedProduct === "pack"
              ? <BookDownload product="pack" sessionId={search.session_id} />
              : <CheckoutForm product="pack" currentBook={book} />}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-court text-court-foreground">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="font-mono text-xs uppercase tracking-[0.15em] text-primary">{content.sectionEyebrow}</div>
          <h2 className="mt-4 font-display text-4xl tracking-tight">{content.sectionTitle}</h2>
          <ol className="mt-10 border-t border-court-foreground/20">
            {content.steps.map(([letter, name, text]) => (
              <li key={letter} className="grid grid-cols-[3rem_1fr] gap-4 border-b border-court-foreground/20 py-6 md:grid-cols-[5rem_1fr]">
                <span className="font-display text-4xl text-primary">{letter}</span>
                <div>
                  <h3 className="font-display text-2xl">{name}</h3>
                  <p className="mt-1 text-sm text-court-foreground/65">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <ReviewsSection key={book} topic={book} />
      <SiteFooter />
    </div>
  );
}
