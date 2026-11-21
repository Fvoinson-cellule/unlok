import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { ArrowRight, Check, Play } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { CheckoutForm, BookDownload } from "@/components/book-checkout";
import { BOOKS, BOOK_PACK, isBookLaunch, type BookProduct } from "@/lib/pricing";
import { unlockTirVideo } from "@/lib/extrait-video.functions";
import { videoLeadSchema, videoSource } from "@/lib/extrait-video.schema";
import videoAsset from "@/assets/extrait-tir.mp4.asset.json";

const VIDEO_URL = videoAsset.url;
const UNLOCK_KEY = "unlok:extrait-tir:unlocked";
type ExtraitSearch = { src?: string; product?: BookProduct; session_id?: string };

export const Route = createFileRoute("/extrait-tir")({
  head: () => ({
    meta: [
      { title: "Extrait vidéo du Book Tir · Unlok" },
      { name: "description", content: "Regarde 3 exercices du Book Tir en action, puis découvre les 30 exercices du book et le pack RAMP + Tir." },
      { property: "og:title", content: "3 exercices du Book Tir en vidéo · Unlok" },
      { property: "og:description", content: "Ton extrait vidéo gratuit du Book Tir, avec accès immédiat après inscription." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  validateSearch: (search: Record<string, unknown>): ExtraitSearch => ({
    src: videoSource(search["src"]),
    ...(search["product"] === "tir" || search["product"] === "pack" || search["product"] === "ramp" ? { product: search["product"] } : {}),
    ...(typeof search["session_id"] === "string" ? { session_id: search["session_id"] } : {}),
  }),
  component: ExtraitTir,
});

function ExtraitTir() {
  const search = Route.useSearch();
  const saveLead = useServerFn(unlockTirVideo);
  const [unlocked, setUnlocked] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [launch, setLaunch] = useState(true);
  const returned = Boolean(search.session_id && search.product);

  useEffect(() => {
    try { setUnlocked(localStorage.getItem(UNLOCK_KEY) === "true"); } catch { /* L'accès fonctionne aussi sans stockage. */ }
    setLaunch(isBookLaunch());
    setHydrated(true);
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const parsed = videoLeadSchema.safeParse({ email, consent, src: videoSource(search.src) });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Vérifie tes informations.");
      return;
    }
    setSending(true);
    try {
      const result = await saveLead({ data: parsed.data });
      if ("error" in result) { setError(result.error); return; }
      try { localStorage.setItem(UNLOCK_KEY, "true"); } catch { /* Ne pas bloquer la vidéo. */ }
      setUnlocked(true);
    } catch {
      setError("L'envoi n'a pas fonctionné. Réessaie dans un instant.");
    } finally { setSending(false); }
  }

  return (
    <div className="min-h-screen bg-background font-body text-foreground antialiased selection:bg-primary/20">
      <SiteNav />
      <main>
        <section className="border-b border-border">
          <div className="mx-auto max-w-3xl px-5 py-12 md:px-6 md:py-16">
            <p className="flex items-center gap-2 font-mono text-xs uppercase text-primary"><Play className="size-4" /> Book Tir · Extrait gratuit</p>
            <h1 className="mt-5 font-display text-4xl leading-none sm:text-5xl md:text-6xl">Regarde 3 exercices du <span className="text-primary">Book Tir</span> en action</h1>
            {!unlocked && !returned ? (
              <>
                <p className="mt-5 text-base leading-7 text-muted-foreground">Moins de 3 minutes. Entre ton email, la vidéo s'ouvre tout de suite.</p>
                {!hydrated ? <p className="mt-8 text-sm text-muted-foreground">Chargement…</p> : (
                  <form onSubmit={submit} noValidate className="mt-8 max-w-xl space-y-5">
                    <div>
                      <label htmlFor="video-email" className="mb-2 block text-sm font-semibold">Ton email</label>
                      <input id="video-email" type="email" autoComplete="email" inputMode="email" maxLength={200} required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="toi@exemple.fr"
                        className="w-full rounded-lg border border-foreground/40 bg-card px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" aria-describedby={error ? "video-error" : undefined} />
                    </div>
                    <div className="flex items-start gap-3">
                      <input id="video-consent" type="checkbox" required checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1 size-5 shrink-0 accent-primary" />
                      <label htmlFor="video-consent" className="text-sm leading-6 text-muted-foreground">J'accepte de recevoir l'extrait vidéo et des emails de Florian (Unlok) sur le basket et ses books. Je peux me désinscrire à tout moment. <Link to="/mentions-legales" className="text-foreground underline underline-offset-4">Mentions légales</Link></label>
                    </div>
                    {error && <p id="video-error" role="alert" className="text-sm text-destructive">{error}</p>}
                    <Button type="submit" disabled={sending} className="h-auto w-full whitespace-normal py-3.5 text-base shadow-glow sm:w-auto sm:px-8">{sending ? "Ouverture…" : "Voir l'extrait"}<ArrowRight /></Button>
                  </form>
                )}
              </>
            ) : (
              <>
                <p className="mt-5 text-base text-muted-foreground">Ton extrait est prêt. Bon visionnage !</p>
                <div className="mx-auto mt-8 aspect-[9/16] w-full max-w-[420px] overflow-hidden rounded-lg border border-border bg-card">
                  {VIDEO_URL ? (
                    // Ces options freinent le téléchargement, elles ne constituent pas une vraie protection.
                    <video src={VIDEO_URL} className="h-full w-full object-contain" playsInline controls preload="metadata" controlsList="nodownload noplaybackrate" disablePictureInPicture onContextMenu={(event) => event.preventDefault()} aria-label="Extrait vidéo du Book Tir" />
                  ) : <div className="grid h-full place-items-center text-muted-foreground">Vidéo bientôt disponible</div>}
                </div>
              </>
            )}
          </div>
        </section>

        {(unlocked || returned) && (
          <section className="border-b border-border">
            <div className="mx-auto max-w-5xl px-5 py-10 md:px-6 md:py-14">
              <p className="mx-auto max-w-2xl text-center text-lg leading-7">Tu viens de voir 3 exercices. Le Book en contient <span className="font-semibold text-primary">30</span>, avec <span className="font-semibold text-primary">10 outils</span> pour les faire évoluer.</p>
              <div className="mt-8 grid items-start gap-6 md:grid-cols-2">
                <div className="rounded-lg border border-border bg-card p-6 md:p-8">
                  <p className="font-mono text-xs uppercase text-muted-foreground">{BOOKS.tir.label} · PDF</p>
                  <h2 className="mt-3 font-display text-3xl">30 exercices de tir</h2>
                  <div className="mt-5 flex flex-wrap items-end gap-3">
                    <span className="font-display text-5xl text-primary">{launch ? BOOKS.tir.launchPrice : BOOKS.tir.regularPrice}</span>
                    {launch && <span className="pb-1 text-muted-foreground line-through">{BOOKS.tir.regularPrice}</span>}
                  </div>
                  {launch && <p className="mt-2 text-sm text-muted-foreground">Prix de lancement jusqu'au 31 décembre</p>}
                  <p className="mb-6 mt-4 text-sm leading-6 text-muted-foreground">34 pages, 3 catégories d'exercices et une boîte à outils.</p>
                  {search.session_id && search.product === "tir" ? <BookDownload product="tir" sessionId={search.session_id} /> : <CheckoutForm product="tir" currentBook="tir" returnPath="/extrait-tir" />}
                  <p className="mt-4 text-xs text-muted-foreground">Téléchargement immédiat après paiement.</p>
                </div>
                <div className="rounded-lg border border-primary/50 bg-card p-6 md:p-8">
                  <p className="font-mono text-xs uppercase text-primary">Les deux books · 2 PDF</p>
                  <h2 className="mt-3 font-display text-3xl">Book Tir + Book RAMP</h2>
                  <div className="mt-5 flex flex-wrap items-end gap-3">
                    <span className="font-display text-5xl text-primary">{BOOK_PACK.price}</span>
                    <span className="pb-1 text-muted-foreground line-through">{launch ? "29,80 €" : "49,80 €"}</span>
                  </div>
                  {launch && <p className="mt-2 text-sm font-semibold text-primary">10 € de plus pour deux books</p>}
                  <ul className="mb-6 mt-4 space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2"><Check className="size-4 shrink-0 text-primary" />30 exercices de tir</li>
                    <li className="flex gap-2"><Check className="size-4 shrink-0 text-primary" />40 échauffements RAMP</li>
                  </ul>
                  {search.session_id && search.product === "pack" ? <BookDownload product="pack" sessionId={search.session_id} /> : <CheckoutForm product="pack" currentBook="tir" returnPath="/extrait-tir" />}
                  <p className="mt-4 text-xs text-muted-foreground">Accès immédiat aux deux PDF après paiement.</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}