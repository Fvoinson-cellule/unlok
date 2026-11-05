// Catalogue de la page « Régler ma séance » (/paiement).
// Utilisé côté navigateur et côté serveur : le serveur ne fait confiance qu'à cette liste.
export const EXPRESS_PRODUCTS = {
  essai: { label: "Séance d'essai", price: 15, lookupKey: "unlok_trial_once", card: null, sessions: 0 },
  seance: { label: "Séance individuelle", price: 50, lookupKey: "unlok_single_session_once", card: null, sessions: 0 },
  carte5: { label: "Carte 5 séances", price: 250, lookupKey: "unlok_card5_once", card: "card5", sessions: 5 },
  carte10: { label: "Carte 10 séances", price: 400, lookupKey: "unlok_card10_once", card: "card10", sessions: 10 },
} as const;

export type ExpressProduct = keyof typeof EXPRESS_PRODUCTS;

export function isExpressProduct(v: unknown): v is ExpressProduct {
  return typeof v === "string" && v in EXPRESS_PRODUCTS;
}
