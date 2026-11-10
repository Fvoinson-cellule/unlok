import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { getAdminData, moderateReview } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Espace privé · Unlok" },
      { name: "description", content: "Espace privé Unlok." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Espace privé · Unlok" },
      { property: "og:description", content: "Espace privé Unlok." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Admin,
});

type Data = Awaited<ReturnType<typeof getAdminData>>;
const SEGMENTS = [
  { key: "joueur", label: "Joueurs / Parents", hint: "Séances" },
  { key: "coach", label: "Coachs", hint: "Book RAMP" },
  { key: "club", label: "Clubs", hint: "Ebook gratuit" },
] as const;

function Admin() {
  const load = useServerFn(getAdminData);
  const moderate = useServerFn(moderateReview);
  const [code, setCode] = useState("");
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [seg, setSeg] = useState<(typeof SEGMENTS)[number]["key"]>("joueur");
  const [copied, setCopied] = useState(false);

  async function refresh(c = code) {
    setError(null);
    try { setData(await load({ data: { code: c } })); } catch { setError("Code incorrect."); }
  }

  const rows = useMemo(() => (data?.customers ?? []).filter((c) => c.segment === seg), [data, seg]);
  const emails = useMemo(() => [...new Set(rows.map((r) => r.email))], [rows]);

  function csv() {
    const lines = [["date", "email", "nom", "détail", "montant €"], ...rows.map((r) => [
      new Date(r.created_at).toLocaleDateString("fr-FR"), r.email, r.name ?? "", r.detail ?? "",
      r.amount_cents != null ? (r.amount_cents / 100).toFixed(2) : "",
    ])].map((l) => l.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(";"));
    const url = URL.createObjectURL(new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv" }));
    Object.assign(document.createElement("a"), { href: url, download: `unlok-${seg}.csv` }).click();
  }

  if (!data) return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-3 px-6 font-body">
      <h1 className="font-display text-3xl">Espace privé</h1>
      <form onSubmit={(e) => { e.preventDefault(); refresh(); }} className="grid gap-3">
        <input type="password" value={code} onChange={(e) => setCode(e.target.value)} placeholder="Code d'accès"
          className="rounded-lg border border-foreground/30 bg-background px-3 py-3 text-sm" />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">Entrer</button>
      </form>
    </main>
  );

  const btn = "rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:border-primary hover:text-primary";
  return (
    <main className="mx-auto max-w-6xl px-6 py-12 font-body">
      <h1 className="font-display text-4xl">Mes clients</h1>
      <div className="mt-6 flex flex-wrap gap-2">
        {SEGMENTS.map((s) => {
          const n = new Set(data.customers.filter((c) => c.segment === s.key).map((c) => c.email)).size;
          return (
            <button key={s.key} onClick={() => setSeg(s.key)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold ${seg === s.key ? "bg-primary text-primary-foreground" : "border border-border"}`}>
              {s.label} · {n} <span className="font-normal opacity-70">({s.hint})</span>
            </button>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <a className={btn} href={`mailto:unlok.basketball@gmail.com?bcc=${encodeURIComponent(emails.join(","))}`}>Écrire à ce groupe</a>
        <button className={btn} onClick={async () => { await navigator.clipboard.writeText(emails.join(", ")); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>
          {copied ? "Copié !" : `Copier les ${emails.length} emails`}
        </button>
        <button className={btn} onClick={csv}>Télécharger (Excel)</button>
      </div>
      <div className="mt-6 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="text-muted-foreground"><tr><th className="p-3">Date</th><th className="p-3">Email</th><th className="p-3">Nom</th><th className="p-3">Détail</th><th className="p-3">Montant</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border align-top">
                <td className="p-3 whitespace-nowrap">{new Date(r.created_at).toLocaleDateString("fr-FR")}</td>
                <td className="p-3">{r.email}</td><td className="p-3">{r.name}</td>
                <td className="p-3 text-muted-foreground">{r.detail}</td>
                <td className="p-3 whitespace-nowrap">{r.amount_cents != null ? `${(r.amount_cents / 100).toFixed(2)} €` : "Gratuit"}</td>
              </tr>
            ))}
            {!rows.length && <tr><td className="p-3 text-muted-foreground" colSpan={5}>Aucun contact pour l'instant.</td></tr>}
          </tbody>
        </table>
      </div>

      <h2 className="mt-16 font-display text-3xl">Avis clients</h2>
      <div className="mt-4 grid gap-3">
        {data.reviews.map((r) => (
          <div key={r.id} className="rounded-xl border border-border p-4">
            <div className="text-sm"><span className="text-primary">{"★".repeat(r.rating)}</span> <b>{r.name}</b> {r.role && `· ${r.role}`} · {r.approved ? "En ligne" : "En attente"}</div>
            <p className="mt-2 text-sm text-muted-foreground">{r.message}</p>
            <div className="mt-3 flex gap-2">
              {r.approved
                ? <button className={btn} onClick={async () => { await moderate({ data: { code, id: r.id, action: "hide" } }); refresh(); }}>Masquer</button>
                : <button className={btn} onClick={async () => { await moderate({ data: { code, id: r.id, action: "approve" } }); refresh(); }}>Publier</button>}
              <button className={btn} onClick={async () => { if (confirm("Supprimer cet avis ?")) { await moderate({ data: { code, id: r.id, action: "delete" } }); refresh(); } }}>Supprimer</button>
            </div>
          </div>
        ))}
        {!data.reviews.length && <p className="text-sm text-muted-foreground">Aucun avis pour l'instant.</p>}
      </div>
    </main>
  );
}
