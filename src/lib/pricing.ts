// Grille tarifaire UNLOK (séances de 60 min).
// Règle : prix à la séance P selon le nombre de joueurs ;
// carte 5 = 5 × (P − 2 €), carte 10 = 10 × (P − 5 €). Séance d'essai : 25 € / personne.
// Utilisé côté navigateur ET serveur : le serveur ne fait confiance qu'à ce calcul.

export const SESSION_MINUTES = 60;
export const MAX_PEOPLE = 4;
export const TRIAL_PRICE = 25;

export const FORMULES = {
  essai: { label: "Séance d'essai", sessions: 1 },
  seance: { label: "Séance", sessions: 1 },
  carte5: { label: "Carte 5 séances", sessions: 5 },
  carte10: { label: "Carte 10 séances", sessions: 10 },
} as const;

export type Formule = keyof typeof FORMULES;

export function isFormule(v: unknown): v is Formule {
  return typeof v === "string" && v in FORMULES;
}

export const GROUPS = [
  { key: "solo", label: "Individuel", people: "1 joueur", base: 50 },
  { key: "duo", label: "Duo", people: "2 joueurs", base: 40 },
  { key: "groupe", label: "Petit groupe", people: "3 à 4 joueurs", base: 35 },
] as const;

/** Prix d'une séance par personne selon le nombre de joueurs. */
export function basePrice(people: number): number {
  if (people <= 1) return 50;
  if (people === 2) return 40;
  return 35;
}

/** Prix par personne (en €) d'une formule pour un groupe de `people` joueurs. */
export function pricePerPerson(formule: Formule, people: number): number {
  if (formule === "essai") return TRIAL_PRICE;
  const p = basePrice(people);
  if (formule === "seance") return p;
  if (formule === "carte5") return 5 * (p - 2);
  return 10 * (p - 5);
}

export function orderTotal(formule: Formule, people: number): number {
  return pricePerPerson(formule, people) * people;
}

export function formatEuro(n: number): string {
  return `${n.toLocaleString("fr-FR")} €`;
}

// Books numériques : prix de lancement jusqu'au 31/12/2026 inclus, puis prix normal.
// Le pack reste à 24,90 € et donne accès aux deux PDF.
export type BookKey = "ramp" | "tir";
export type BookProduct = BookKey | "pack";

export const BOOK_LAUNCH_ENDS_AT = new Date("2027-01-01T00:00:00+01:00");
export const BOOKS = {
  ramp: {
    label: "Book RAMP",
    checkoutName: "Book RAMP UNLOK · 40 échauffements (PDF)",
    launchPrice: "14,90 €",
    regularPrice: "24,90 €",
  },
  tir: {
    label: "Book Tir",
    checkoutName: "Book Tir UNLOK · 30 exercices (PDF)",
    launchPrice: "14,90 €",
    regularPrice: "24,90 €",
  },
} as const;

export const BOOK_PACK = {
  label: "Pack Book RAMP + Book Tir",
  checkoutName: "Pack UNLOK · Book RAMP + Book Tir (2 PDF)",
  price: "24,90 €",
  priceCents: 2490,
} as const;

export function isBookLaunch(now: Date = new Date()): boolean {
  return now < BOOK_LAUNCH_ENDS_AT;
}

export function isBookProduct(value: unknown): value is BookProduct {
  return value === "ramp" || value === "tir" || value === "pack";
}

/** Prix en centimes d'un book ou du pack à une date donnée. */
export function bookPriceCents(product: BookProduct, now: Date = new Date()): number {
  if (product === "pack") return BOOK_PACK.priceCents;
  return isBookLaunch(now) ? 1490 : 2490;
}

// Alias conservés pour les pages et tests existants.
export const RAMP = {
  launchPrice: BOOKS.ramp.launchPrice,
  regularPrice: BOOKS.ramp.regularPrice,
  launchEndsAt: BOOK_LAUNCH_ENDS_AT,
};
export function isRampLaunch(now: Date = new Date()): boolean {
  return isBookLaunch(now);
}
export function rampPriceCents(now: Date = new Date()): number {
  return bookPriceCents("ramp", now);
}
