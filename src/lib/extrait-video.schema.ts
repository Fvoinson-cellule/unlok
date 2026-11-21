import { z } from "zod";

export function videoSource(value: unknown): "instagram" | "linkedin" | "facebook" | "autre" {
  return value === "instagram" || value === "linkedin" || value === "facebook" ? value : "autre";
}

export const videoLeadSchema = z.object({
  email: z.string().trim().toLowerCase().max(200, "Ton email est trop long.").email("Entre une adresse email valide."),
  consent: z.literal(true, { errorMap: () => ({ message: "Coche la case de consentement pour voir l'extrait." }) }),
  src: z.enum(["instagram", "linkedin", "facebook", "autre"]),
});