// Grille tarifaire UNLOK (séances de 60 min).
// Règle : prix à la séance P selon le nombre de joueurs ;
// carte 5 = 5 × (P − 2 €), carte 10 = 10 × (P − 5 €). Séance d'essai : 15 € / personne.
// Utilisé côté navigateur ET serveur : le serveur ne fait confiance qu'à ce calcul.

export const SESSION_MINUTES = 60;
export const MAX_PEOPLE = 4;
export const TRIAL_PRICE = 15;

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

// Book RAMP : prix de lancement jusqu'au 31/12/2026 inclus, puis prix normal.
export const RAMP = {
  launchPrice: "14,90 €",
  regularPrice: "24,90 €",
  launchEndsAt: new Date("2027-01-01T00:00:00+01:00"),
};
export function isRampLaunch(now: Date = new Date()): boolean {
  return now < RAMP.launchEndsAt;
}
